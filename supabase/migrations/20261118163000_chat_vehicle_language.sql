-- Signal is also a vehicle term; block contact-app intent rather than car features.
create or replace function public.marketplace_has_contact(value text) returns boolean
language sql immutable set search_path=public as $$
 with cleaned as(select public.marketplace_normalize_chat_fragment(value) t)
 select t ~ '([0-9][[:space:]().+/-]*){9,}'
 or t ~ '@|https?://|www[.]|[a-z0-9-]+[.](com|in|net|org|me|co)([^a-z]|$)'
 or t ~ 'whats[[:space:]]*app|telegram|instagram|snapchat|wa[.]me|t[.]me|\minsta\M|\m(on|via|using)[[:space:]]+signal\M|\msignal[[:space:]]+(app|id|username)\M' from cleaned;
$$;
