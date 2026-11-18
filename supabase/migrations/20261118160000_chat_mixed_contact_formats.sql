-- Normalize mixed spelled-out / numeric phone attempts consistently.
create or replace function public.marketplace_normalize_chat_fragment(value text) returns text
language plpgsql immutable set search_path=public as $$
declare clean text; words text[]:=array['zero','one','two','three','four','five','six','seven','eight','nine']; i integer;
begin
 clean:=lower(translate(regexp_replace(normalize(coalesce(value,''),NFKC),'[​‌‍﻿]','','g'),
 '٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹०१२३४५६७८९০১২৩৪৫৬৭৮৯','0123456789012345678901234567890123456789'));
 for i in 0..9 loop clean:=replace(clean,words[i+1],i::text); end loop;
 return replace(clean,'oh','0');
end; $$;
create or replace function public.marketplace_has_contact(value text) returns boolean
language sql immutable set search_path=public as $$
 with cleaned as(select public.marketplace_normalize_chat_fragment(value) t)
 select t ~ '([0-9][[:space:]().+/-]*){9,}'
 or t ~ '@|https?://|www[.]|[a-z0-9-]+[.](com|in|net|org|me|co)([^a-z]|$)'
 or t ~ 'whats[[:space:]]*app|telegram|instagram|snapchat|wa[.]me|t[.]me|\minsta\M|\msignal\M' from cleaned;
$$;
