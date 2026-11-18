-- Vehicle marketplace: public listings, private-until-sign-in contacts and owner-scoped photos.
create table if not exists public.vehicle_listings (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check(category in ('used-cars','used-bikes','used-scooters','used-suvs','commercial-vehicles','electric-vehicles')),
  title text not null check(char_length(title) between 10 and 100),
  description text not null check(char_length(description) between 40 and 3000),
  brand text not null check(char_length(brand) between 2 and 40),
  model text not null check(char_length(model) between 1 and 60),
  year integer not null check(year between 1980 and 2100),
  mileage integer not null check(mileage between 0 and 2000000),
  price integer not null check(price between 1000 and 100000000),
  fuel text not null check(fuel in ('Petrol','Diesel','Electric','CNG','Hybrid')),
  transmission text not null check(transmission in ('Manual','Automatic')),
  owners text not null check(owners in ('1st owner','2nd owner','3rd owner or more')),
  location text not null check(char_length(location) between 2 and 80),
  seller_name text not null check(char_length(seller_name) between 2 and 80),
  negotiable boolean not null default true,
  photos text[] not null check(cardinality(photos) between 1 and 8),
  status text not null default 'active' check(status in ('active','sold','archived')),
  created_at timestamptz not null default now()
);
create index if not exists vehicle_listings_browse on public.vehicle_listings(status,category,created_at desc);
create index if not exists vehicle_listings_owner on public.vehicle_listings(user_id,created_at desc);
alter table public.vehicle_listings enable row level security;
create policy "Public active listings and own listings" on public.vehicle_listings for select using(status='active' or user_id=(select auth.uid()));
create policy "Owners create listings" on public.vehicle_listings for insert to authenticated with check(user_id=(select auth.uid()));
create policy "Owners update their listings" on public.vehicle_listings for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
grant select on public.vehicle_listings to anon,authenticated;
grant insert on public.vehicle_listings to authenticated;
grant update(status) on public.vehicle_listings to authenticated;

-- A contact is staged before its listing is inserted. Read access requires an active listing.
create table if not exists public.vehicle_listing_contacts (
  listing_id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  phone text not null check(phone ~ '^[6-9][0-9]{9}$')
);
alter table public.vehicle_listing_contacts enable row level security;
create policy "Signed in buyers see active seller contacts" on public.vehicle_listing_contacts for select to authenticated using(user_id=(select auth.uid()) or exists(select 1 from public.vehicle_listings l where l.id=listing_id and l.status='active'));
create policy "Owners create their contact" on public.vehicle_listing_contacts for insert to authenticated with check(user_id=(select auth.uid()));
create policy "Owners remove staged contact" on public.vehicle_listing_contacts for delete to authenticated using(user_id=(select auth.uid()));
grant select,insert,delete on public.vehicle_listing_contacts to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('vehicle-listing-photos','vehicle-listing-photos',true,2097152,array['image/webp']) on conflict(id) do nothing;
create policy "Marketplace photos are public" on storage.objects for select using(bucket_id='vehicle-listing-photos');
create policy "Owners upload marketplace photos" on storage.objects for insert to authenticated with check(bucket_id='vehicle-listing-photos' and (storage.foldername(name))[1]=(select auth.uid()::text));
create policy "Owners replace marketplace photos" on storage.objects for update to authenticated using(bucket_id='vehicle-listing-photos' and (storage.foldername(name))[1]=(select auth.uid()::text)) with check(bucket_id='vehicle-listing-photos' and (storage.foldername(name))[1]=(select auth.uid()::text));
create policy "Owners remove marketplace photos" on storage.objects for delete to authenticated using(bucket_id='vehicle-listing-photos' and (storage.foldername(name))[1]=(select auth.uid()::text));
notify pgrst,'reload schema';
