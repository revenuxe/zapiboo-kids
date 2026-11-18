-- New and edited vehicles require admin approval, including direct REST writes.
begin;
alter table public.vehicle_listings drop constraint if exists vehicle_listings_status_check;
alter table public.vehicle_listings add constraint vehicle_listings_status_check check(status in ('pending','active','rejected','sold','archived'));
alter table public.vehicle_listings alter column status set default 'pending';
alter table public.vehicle_listings add column if not exists rejection_reason text;
alter table public.vehicle_listings add column if not exists updated_at timestamptz not null default now();

create or replace function public.enforce_listing_review() returns trigger
language plpgsql security definer set search_path=public as $$
begin
  if TG_OP='INSERT' then
    new.status:='pending'; new.rejection_reason:=null; new.updated_at:=now();
    return new;
  end if;
  new.updated_at:=now();
  if public.has_role(auth.uid(),'admin') or auth.role()='service_role' then return new; end if;
  if new.id<>old.id or new.user_id<>old.user_id or new.created_at<>old.created_at then
    raise exception 'Listing identity cannot be changed.' using errcode='42501';
  end if;
  if new.rejection_reason is distinct from old.rejection_reason then
    raise exception 'Only admins can change review feedback.' using errcode='42501';
  end if;
  if (to_jsonb(new)-array['status','rejection_reason','updated_at']) is distinct from
     (to_jsonb(old)-array['status','rejection_reason','updated_at']) then
    new.status:='pending'; new.rejection_reason:=null;
  elsif new.status in ('active','pending') and new.status is distinct from old.status then
    new.status:='pending'; new.rejection_reason:=null;
  elsif new.status='sold' and old.status<>'active' and old.status<>'sold' then
    raise exception 'Only a live listing can be marked sold.';
  elsif new.status='rejected' and new.status is distinct from old.status then
    raise exception 'Only admins can reject listings.' using errcode='42501';
  end if;
  return new;
end; $$;
create trigger vehicle_listings_review before insert or update on public.vehicle_listings
for each row execute function public.enforce_listing_review();

create policy "Admins review all vehicle listings" on public.vehicle_listings for select to authenticated using(public.has_role(auth.uid(),'admin'));
create policy "Admins moderate vehicle listings" on public.vehicle_listings for update to authenticated using(public.has_role(auth.uid(),'admin')) with check(public.has_role(auth.uid(),'admin'));
create policy "Owners delete their vehicle listings" on public.vehicle_listings for delete to authenticated using(user_id=(select auth.uid()));
grant delete on public.vehicle_listings to authenticated;
grant update(category,title,description,brand,model,year,mileage,price,fuel,transmission,owners,location,seller_name,negotiable,photos,status,rejection_reason) on public.vehicle_listings to authenticated;

-- Contacts have no foreign key because they are staged before listing creation.
create or replace function public.remove_deleted_listing_contact() returns trigger
language plpgsql security definer set search_path=public as $$
begin
 delete from public.vehicle_listing_contacts where listing_id=old.id;
 return old;
end; $$;
create trigger vehicle_listing_contact_cleanup after delete on public.vehicle_listings
for each row execute function public.remove_deleted_listing_contact();
notify pgrst,'reload schema';
commit;
