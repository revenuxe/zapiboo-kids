-- Prevent simple phone-number fragments being spread across consecutive messages.
create function public.marketplace_normalize_chat_fragment(value text) returns text
language sql immutable set search_path=public as $$
select lower(translate(regexp_replace(normalize(coalesce(value,''),NFKC),'[​‌‍﻿]','','g'),
'٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹०१२३४५६७८९০১২৩৪৫৬৭৮৯','0123456789012345678901234567890123456789'));
$$;
create function public.marketplace_chat_is_fragment(value text) returns boolean
language sql immutable set search_path=public as $$
select public.marketplace_normalize_chat_fragment(value) ~ '^[0-9[:space:]().+/-]+$'
or regexp_replace(public.marketplace_normalize_chat_fragment(value),'zero|one|two|three|four|five|six|seven|eight|nine|oh','','g') ~ '^[[:space:],.-]+$';
$$;
create function public.marketplace_guard_chat_fragments() returns trigger
language plpgsql security definer set search_path=public as $$
declare recent text; joined text; digits text;
begin
 if not public.marketplace_chat_is_fragment(new.body) then return new; end if;
 select string_agg(public.marketplace_normalize_chat_fragment(q.body),' ' order by q.created_at) into recent
 from(select body,created_at from public.vehicle_chat_messages where conversation_id=new.conversation_id and sender_id=new.sender_id
 and created_at>now()-interval '5 minutes' and public.marketplace_chat_is_fragment(body) order by created_at desc limit 3)q;
 joined:=coalesce(recent,'')||' '||public.marketplace_normalize_chat_fragment(new.body);
 digits:=regexp_replace(joined,'[^0-9]','','g');
 if digits ~ '(91)?[6-9][0-9]{9}' or joined ~ '(zero|one|two|three|four|five|six|seven|eight|nine|oh)([[:space:],.-]*(zero|one|two|three|four|five|six|seven|eight|nine|oh)){6,}' then
 raise exception 'Keep contact details private. Phone numbers split across messages are not allowed.';
 end if;
 return new;
end; $$;
create trigger chat_fragment_privacy before insert on public.vehicle_chat_messages for each row execute function public.marketplace_guard_chat_fragments();
