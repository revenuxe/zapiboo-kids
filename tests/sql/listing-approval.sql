-- Run against the migrated database. All fixtures and changes are rolled back.
begin;
do $$
declare owner_id uuid:=gen_random_uuid(); other_id uuid:=gen_random_uuid(); admin_id uuid:=gen_random_uuid();
begin
 perform set_config('test.owner',owner_id::text,true);
 perform set_config('test.other',other_id::text,true);
 perform set_config('test.admin',admin_id::text,true);
 perform set_config('test.listing',gen_random_uuid()::text,true);
 insert into auth.users(id,aud,role,email) values
 (owner_id,'authenticated','authenticated','listing-owner-'||owner_id||'@example.invalid'),
 (other_id,'authenticated','authenticated','listing-other-'||other_id||'@example.invalid'),
 (admin_id,'authenticated','authenticated','listing-admin-'||admin_id||'@example.invalid');
 insert into public.user_roles(user_id,role) values(admin_id,'admin');
end $$;
set local role authenticated;
do $$ begin
 perform set_config('request.jwt.claims',json_build_object('sub',current_setting('test.owner'),'role','authenticated')::text,true);
 insert into public.vehicle_listings(id,user_id,category,title,description,brand,model,year,mileage,price,fuel,transmission,owners,location,seller_name,photos,status)
 values(current_setting('test.listing')::uuid,auth.uid(),'used-cars','Test vehicle for approval','A test vehicle with a complete description for review.','Test','Model',2021,10000,100000,'Petrol','Manual','1st owner','Bangalore','Test Seller',array['https://example.invalid/test.webp'],'active');
 if (select status from public.vehicle_listings where id=current_setting('test.listing')::uuid)<>'pending' then raise exception 'Owner bypassed pending on insert'; end if;
end $$;
set local role anon;
do $$ begin
 perform set_config('request.jwt.claims','{"role":"anon"}',true);
 if exists(select 1 from public.vehicle_listings where id=current_setting('test.listing')::uuid) then raise exception 'Anonymous user saw pending listing'; end if;
end $$;
set local role authenticated;
do $$ declare affected integer; begin
 perform set_config('request.jwt.claims',json_build_object('sub',current_setting('test.other'),'role','authenticated')::text,true);
 if exists(select 1 from public.vehicle_listings where id=current_setting('test.listing')::uuid) then raise exception 'Another owner saw pending listing'; end if;
 update public.vehicle_listings set status='active' where id=current_setting('test.listing')::uuid;
 get diagnostics affected=row_count;
 if affected<>0 then raise exception 'Another owner updated listing'; end if;
 delete from public.vehicle_listings where id=current_setting('test.listing')::uuid;
 get diagnostics affected=row_count;
 if affected<>0 then raise exception 'Another owner deleted listing'; end if;
 perform set_config('request.jwt.claims',json_build_object('sub',current_setting('test.admin'),'role','authenticated')::text,true);
 if not exists(select 1 from public.vehicle_listings where id=current_setting('test.listing')::uuid and status='pending') then raise exception 'Admin cannot read queue'; end if;
 update public.vehicle_listings set status='active' where id=current_setting('test.listing')::uuid;
 if (select status from public.vehicle_listings where id=current_setting('test.listing')::uuid)<>'active' then raise exception 'Admin cannot approve'; end if;
end $$;
set local role anon;
do $$ begin
 perform set_config('request.jwt.claims','{"role":"anon"}',true);
 if not exists(select 1 from public.vehicle_listings where id=current_setting('test.listing')::uuid and status='active') then raise exception 'Approved listing is not public'; end if;
end $$;
set local role authenticated;
do $$ declare blocked boolean:=false; begin
 perform set_config('request.jwt.claims',json_build_object('sub',current_setting('test.owner'),'role','authenticated')::text,true);
 update public.vehicle_listings set title='Edited vehicle for approval' where id=current_setting('test.listing')::uuid;
 if (select status from public.vehicle_listings where id=current_setting('test.listing')::uuid)<>'pending' then raise exception 'Editing bypassed review'; end if;
 update public.vehicle_listings set status='active' where id=current_setting('test.listing')::uuid;
 if (select status from public.vehicle_listings where id=current_setting('test.listing')::uuid)<>'pending' then raise exception 'Owner self-approved listing'; end if;
 begin update public.vehicle_listings set rejection_reason='Forged feedback' where id=current_setting('test.listing')::uuid;
 exception when insufficient_privilege then blocked:=true; end;
 if not blocked then raise exception 'Owner forged admin feedback'; end if;
 perform set_config('request.jwt.claims',json_build_object('sub',current_setting('test.admin'),'role','authenticated')::text,true);
 update public.vehicle_listings set status='active' where id=current_setting('test.listing')::uuid;
 perform set_config('request.jwt.claims',json_build_object('sub',current_setting('test.owner'),'role','authenticated')::text,true);
 update public.vehicle_listings set status='sold' where id=current_setting('test.listing')::uuid;
 if (select status from public.vehicle_listings where id=current_setting('test.listing')::uuid)<>'sold' then raise exception 'Owner cannot mark sold'; end if;
 update public.vehicle_listings set status='pending' where id=current_setting('test.listing')::uuid;
 perform set_config('request.jwt.claims',json_build_object('sub',current_setting('test.admin'),'role','authenticated')::text,true);
 update public.vehicle_listings set status='rejected',rejection_reason='Please add better photos' where id=current_setting('test.listing')::uuid;
 perform set_config('request.jwt.claims',json_build_object('sub',current_setting('test.owner'),'role','authenticated')::text,true);
 update public.vehicle_listings set status='pending' where id=current_setting('test.listing')::uuid;
 if exists(select 1 from public.vehicle_listings where id=current_setting('test.listing')::uuid and rejection_reason is not null) then raise exception 'Resubmission did not clear feedback'; end if;
 insert into public.vehicle_listing_contacts(listing_id,user_id,phone) values(current_setting('test.listing')::uuid,auth.uid(),'9876543210');
 delete from public.vehicle_listings where id=current_setting('test.listing')::uuid;
 if exists(select 1 from public.vehicle_listing_contacts where listing_id=current_setting('test.listing')::uuid) then raise exception 'Deleted listing left private contact'; end if;
end $$;
reset role;
rollback;
select 'Listing approval, RLS, owner actions and contact cleanup passed; all fixtures rolled back.' as result;
