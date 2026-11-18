alter table public.vehicle_listings
  add column if not exists buyer_call_enabled boolean not null default false;

grant update(buyer_call_enabled) on public.vehicle_listings to authenticated;

create or replace function public.marketplace_seller_phone(p_listing uuid)
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select contact.phone
  from public.vehicle_listing_contacts contact
  join public.vehicle_listings listing on listing.id = contact.listing_id
  where contact.listing_id = p_listing
    and listing.status = 'active'
    and listing.buyer_call_enabled
    and listing.user_id <> (select auth.uid())
    and (select auth.uid()) is not null
  limit 1;
$$;

revoke all on function public.marketplace_seller_phone(uuid) from public, anon, authenticated;
grant execute on function public.marketplace_seller_phone(uuid) to authenticated;

notify pgrst, 'reload schema';
