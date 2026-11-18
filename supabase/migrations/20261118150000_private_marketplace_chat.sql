-- Private, listing-specific conversations. All writes use authenticated RPCs.
create or replace function public.marketplace_has_contact(value text) returns boolean
language sql immutable set search_path=public as $$
  with cleaned as (
    select lower(translate(regexp_replace(normalize(coalesce(value,''),NFKC),'[​‌‍﻿]','','g'),
      '٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹०१२३४५६७८९০১২৩৪৫৬৭৮৯',
      '0123456789012345678901234567890123456789')) as t
  ) select t ~ '([0-9][[:space:]().+/-]*){9,}'
    or t ~ '(zero|one|two|three|four|five|six|seven|eight|nine|oh)([[:space:],.-]*(zero|one|two|three|four|five|six|seven|eight|nine|oh)){6,}'
    or t ~ '@|https?://|www[.]|[a-z0-9-]+[.](com|in|net|org|me|co)([^a-z]|$)'
    or t ~ 'whats[[:space:]]*app|telegram|instagram|snapchat|wa[.]me|t[.]me|\minsta\M|\msignal\M'
  from cleaned;
$$;

-- Buyers cannot retrieve private phone numbers through the old REST table.
drop policy if exists "Signed in buyers see active seller contacts" on public.vehicle_listing_contacts;
create policy "Only owners can read their private contact" on public.vehicle_listing_contacts
for select to authenticated using(user_id=(select auth.uid()));

create table public.vehicle_conversations (
 id uuid primary key default gen_random_uuid(),
 listing_id uuid not null references public.vehicle_listings(id) on delete cascade,
 buyer_id uuid not null references auth.users(id) on delete cascade,
 seller_id uuid not null references auth.users(id) on delete cascade,
 buyer_name text not null, seller_name text not null,
 listing_title text not null, listing_photo text not null, listing_price integer not null,
 buyer_read_at timestamptz not null default now(), seller_read_at timestamptz not null default now(),
 buyer_archived boolean not null default false, seller_archived boolean not null default false,
 buyer_blocked boolean not null default false, seller_blocked boolean not null default false,
 last_message text, last_sender_id uuid, updated_at timestamptz not null default now(),
 created_at timestamptz not null default now(),
 unique(listing_id,buyer_id), check(buyer_id<>seller_id)
);
create index vehicle_conversations_buyer on public.vehicle_conversations(buyer_id,updated_at desc);
create index vehicle_conversations_seller on public.vehicle_conversations(seller_id,updated_at desc);
alter table public.vehicle_conversations enable row level security;
create policy "Conversation participants can read" on public.vehicle_conversations for select to authenticated
using((select auth.uid()) in(buyer_id,seller_id));
revoke all on public.vehicle_conversations from anon,authenticated;
grant select on public.vehicle_conversations to authenticated;

create table public.vehicle_chat_messages (
 id uuid primary key,
 conversation_id uuid not null references public.vehicle_conversations(id) on delete cascade,
 sender_id uuid not null references auth.users(id) on delete cascade,
 body text not null check(char_length(btrim(body)) between 1 and 2000),
 created_at timestamptz not null default clock_timestamp(),
 constraint vehicle_message_no_contact check(not public.marketplace_has_contact(body))
);
create index vehicle_chat_messages_thread on public.vehicle_chat_messages(conversation_id,created_at desc,id desc);
create index vehicle_chat_messages_sender on public.vehicle_chat_messages(sender_id,created_at desc);
alter table public.vehicle_chat_messages enable row level security;
create policy "Only participants read messages" on public.vehicle_chat_messages for select to authenticated
using(exists(select 1 from public.vehicle_conversations c where c.id=conversation_id and (select auth.uid()) in(c.buyer_id,c.seller_id)));
revoke all on public.vehicle_chat_messages from anon,authenticated;
grant select on public.vehicle_chat_messages to authenticated;

create table public.vehicle_chat_reports (
 id uuid primary key default gen_random_uuid(),
 conversation_id uuid not null references public.vehicle_conversations(id) on delete cascade,
 reporter_id uuid not null references auth.users(id) on delete cascade,
 reason text not null check(char_length(reason) between 3 and 500),
 created_at timestamptz not null default now(), unique(conversation_id,reporter_id)
);
alter table public.vehicle_chat_reports enable row level security;
revoke all on public.vehicle_chat_reports from anon,authenticated;
grant select on public.vehicle_chat_reports to authenticated;
create policy "Reporters read their reports" on public.vehicle_chat_reports for select to authenticated using(reporter_id=(select auth.uid()));

create or replace function public.marketplace_start_chat(p_listing uuid) returns uuid
language plpgsql security definer set search_path=public as $$
declare actor uuid:=auth.uid(); item public.vehicle_listings; buyer text; thread uuid;
begin
 if actor is null then raise exception 'Please sign in to chat.' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(hashtextextended(actor::text,73));
 select * into item from public.vehicle_listings where id=p_listing and status='active';
 if not found then raise exception 'This vehicle is no longer available.'; end if;
 if item.user_id=actor then raise exception 'You cannot start a chat with yourself.'; end if;
 select id into thread from public.vehicle_conversations where listing_id=p_listing and buyer_id=actor;
 if thread is not null then
   update public.vehicle_conversations set buyer_archived=false where id=thread;
   return thread;
 end if;
 if (select count(*) from public.vehicle_conversations where buyer_id=actor and created_at>now()-interval '1 day')>=20 then
   raise exception 'You can start up to 20 new conversations a day. Please try again later.';
 end if;
 select coalesce(p.full_name,u.raw_user_meta_data->>'full_name',u.raw_user_meta_data->>'name','Buyer') into buyer from auth.users u left join public.user_profiles p on p.user_id=u.id where u.id=actor;
 if buyer is null or btrim(buyer)='' or public.marketplace_has_contact(buyer) then buyer:='Buyer'; end if;
 insert into public.vehicle_conversations(listing_id,buyer_id,seller_id,buyer_name,seller_name,listing_title,listing_photo,listing_price)
 values(item.id,actor,item.user_id,left(buyer,80),case when public.marketplace_has_contact(item.seller_name) then 'Seller' else item.seller_name end,
 case when public.marketplace_has_contact(item.title) then 'Vehicle listing' else item.title end,item.photos[1],item.price)
 returning id into thread;
 return thread;
end; $$;

create or replace function public.marketplace_chat_inbox() returns jsonb
language sql security definer stable set search_path=public as $$
 select coalesce(jsonb_agg(row_to_json(q)::jsonb order by q.updated_at desc),'[]'::jsonb) from (
 select c.*,
 case when c.buyer_id=auth.uid() then 'buying' else 'selling' end as role,
 case when c.buyer_id=auth.uid() then c.buyer_archived else c.seller_archived end as archived,
 case when c.buyer_id=auth.uid() then c.buyer_blocked else c.seller_blocked end as blocked_by_me,
 (select count(*) from public.vehicle_chat_messages m where m.conversation_id=c.id and m.sender_id<>auth.uid()
 and m.created_at>case when c.buyer_id=auth.uid() then c.buyer_read_at else c.seller_read_at end) as unread_count
 from public.vehicle_conversations c where auth.uid() in(c.buyer_id,c.seller_id)
 order by c.updated_at desc limit 300
 ) q;
$$;

create or replace function public.marketplace_send_message(p_conversation uuid,p_message uuid,p_body text)
returns public.vehicle_chat_messages language plpgsql security definer set search_path=public as $$
declare actor uuid:=auth.uid(); thread public.vehicle_conversations; sent public.vehicle_chat_messages; clean text:=btrim(p_body);
begin
 if actor is null then raise exception 'Please sign in to chat.' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(hashtextextended(actor::text,74));
 select * into thread from public.vehicle_conversations where id=p_conversation and actor in(buyer_id,seller_id) for update;
 if not found then raise exception 'Conversation not found.' using errcode='42501'; end if;
 select * into sent from public.vehicle_chat_messages where id=p_message;
 if found then
   if sent.conversation_id<>p_conversation or sent.sender_id<>actor or sent.body<>clean then raise exception 'Message reference already used.'; end if;
   return sent;
 end if;
 if thread.buyer_blocked or thread.seller_blocked then raise exception 'This conversation is blocked. No new messages can be sent.'; end if;
 if clean is null or char_length(clean) not between 1 and 2000 then raise exception 'Write a message between 1 and 2000 characters.'; end if;
 if public.marketplace_has_contact(clean) then raise exception 'Keep contact details private. Phone numbers, email, links and off-platform handles are not allowed.'; end if;
 if (select count(*) from public.vehicle_chat_messages where sender_id=actor and created_at>now()-interval '1 minute')>=30 then raise exception 'You are sending messages too quickly. Please wait a minute.'; end if;
 insert into public.vehicle_chat_messages(id,conversation_id,sender_id,body) values(p_message,p_conversation,actor,clean) returning * into sent;
 update public.vehicle_conversations set last_message=left(clean,160),last_sender_id=actor,updated_at=sent.created_at,
 buyer_archived=false,seller_archived=false,
 buyer_read_at=case when actor=buyer_id then sent.created_at else buyer_read_at end,
 seller_read_at=case when actor=seller_id then sent.created_at else seller_read_at end where id=p_conversation;
 return sent;
end; $$;

create or replace function public.marketplace_chat_action(p_conversation uuid,p_action text,p_reason text default null) returns void
language plpgsql security definer set search_path=public as $$
declare actor uuid:=auth.uid(); thread public.vehicle_conversations; is_buyer boolean;
begin
 if actor is null then raise exception 'Please sign in.' using errcode='42501'; end if;
 select * into thread from public.vehicle_conversations where id=p_conversation and actor in(buyer_id,seller_id) for update;
 if not found then raise exception 'Conversation not found.' using errcode='42501'; end if;
 is_buyer:=actor=thread.buyer_id;
 if p_action='read' then
 update public.vehicle_conversations set buyer_read_at=case when is_buyer then clock_timestamp() else buyer_read_at end,
 seller_read_at=case when not is_buyer then clock_timestamp() else seller_read_at end where id=p_conversation;
 elsif p_action in('archive','unarchive') then
 update public.vehicle_conversations set buyer_archived=case when is_buyer then p_action='archive' else buyer_archived end,
 seller_archived=case when not is_buyer then p_action='archive' else seller_archived end where id=p_conversation;
 elsif p_action in('block','unblock') then
 update public.vehicle_conversations set buyer_blocked=case when is_buyer then p_action='block' else buyer_blocked end,
 seller_blocked=case when not is_buyer then p_action='block' else seller_blocked end where id=p_conversation;
 elsif p_action='report' then
 if p_reason is null or char_length(btrim(p_reason)) not between 3 and 500 then raise exception 'Choose a reason for reporting.'; end if;
 insert into public.vehicle_chat_reports(conversation_id,reporter_id,reason) values(p_conversation,actor,btrim(p_reason))
 on conflict(conversation_id,reporter_id) do update set reason=excluded.reason;
 else raise exception 'Invalid conversation action.';
 end if;
end; $$;

-- Contact filtering also protects public listing text against direct REST writes.
create or replace function public.marketplace_guard_listing_text() returns trigger
language plpgsql set search_path=public as $$
begin
 if public.marketplace_has_contact(new.title||E'\n'||new.description||E'\n'||new.seller_name||E'\n'||new.location||E'\n'||new.brand||E'\n'||new.model) then
 raise exception 'Remove phone numbers, email addresses, links and off-platform handles from your public listing. Buyers can contact you in Chats.';
 end if;return new;
end; $$;
create trigger vehicle_listing_private_contact before insert or update of title,description,seller_name,location,brand,model
on public.vehicle_listings for each row execute function public.marketplace_guard_listing_text();

revoke all on function public.marketplace_start_chat(uuid) from public,anon;
revoke all on function public.marketplace_chat_inbox() from public,anon;
revoke all on function public.marketplace_send_message(uuid,uuid,text) from public,anon;
revoke all on function public.marketplace_chat_action(uuid,text,text) from public,anon;
grant execute on function public.marketplace_start_chat(uuid),public.marketplace_chat_inbox(),public.marketplace_send_message(uuid,uuid,text),public.marketplace_chat_action(uuid,text,text) to authenticated;

do $$ begin
 if exists(select 1 from pg_publication where pubname='supabase_realtime') then
   alter publication supabase_realtime add table public.vehicle_conversations,public.vehicle_chat_messages;
 end if;
end $$;
notify pgrst,'reload schema';
