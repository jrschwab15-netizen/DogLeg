create table public.dogleg_connections (
 id uuid primary key default gen_random_uuid(),
 requester uuid not null references auth.users(id) on delete cascade,
 recipient uuid not null references auth.users(id) on delete cascade,
 requester_name text not null check (char_length(requester_name) between 1 and 50),
 recipient_name text not null default 'Golf friend' check (char_length(recipient_name) between 1 and 50),
 status text not null default 'pending' check (status in ('pending','accepted')),
 created_at timestamptz not null default now(),
 check(requester <> recipient)
);
create unique index dogleg_connection_pair on public.dogleg_connections (least(requester,recipient),greatest(requester,recipient));
create index dogleg_connections_recipient on public.dogleg_connections(recipient);
create index dogleg_connections_requester on public.dogleg_connections(requester);
alter table public.dogleg_connections enable row level security;
revoke all on public.dogleg_connections from anon,authenticated;
grant select,insert,delete on public.dogleg_connections to authenticated;
grant update(status,recipient_name) on public.dogleg_connections to authenticated;
create policy connection_read on public.dogleg_connections for select to authenticated using ((select auth.uid()) in (requester,recipient));
create policy connection_request on public.dogleg_connections for insert to authenticated with check (requester=(select auth.uid()) and status='pending' and recipient_name='Golf friend');
create policy connection_accept on public.dogleg_connections for update to authenticated using(recipient=(select auth.uid()) and status='pending') with check(recipient=(select auth.uid()) and status='accepted');
create policy connection_remove on public.dogleg_connections for delete to authenticated using((select auth.uid()) in (requester,recipient));
create function public.dogleg_valid_post(p jsonb) returns boolean language plpgsql immutable set search_path='' as $$
begin
 if jsonb_typeof(p) <> 'object' or octet_length(p::text)>300000 then return false; end if;
 if not (p ?& array['name','course','date','score','holes','tees','notes','photos']) then return false; end if;
 if char_length(p->>'name') not between 1 and 50 or char_length(p->>'course') not between 1 and 100 or char_length(p->>'tees')>40 or char_length(p->>'notes')>2000 then return false; end if;
 if (p->>'date') !~ '^\d{4}-\d{2}-\d{2}$' or (p->>'holes') not in ('9','18') or (p->>'score') !~ '^[0-9]{1,3}$' then return false; end if;
 if (p->>'score')::int < (p->>'holes')::int or (p->>'score')::int>360 then return false; end if;
 if jsonb_typeof(p->'photos')<>'array' or jsonb_array_length(p->'photos')>3 then return false; end if;
 if exists(select 1 from jsonb_array_elements(p->'photos') as photo where jsonb_typeof(photo)<>'string' or char_length(photo#>>'{}')>90000 or (photo#>>'{}') !~ '^data:image/jpeg;base64,[A-Za-z0-9+/=]+$') then return false; end if;
 return true;
exception when others then return false;
end $$;
revoke all on function public.dogleg_valid_post(jsonb) from public;
grant execute on function public.dogleg_valid_post(jsonb) to authenticated;
create table public.dogleg_round_posts(
 user_id uuid not null references auth.users(id) on delete cascade,
 round_id uuid not null,
 payload jsonb not null check(public.dogleg_valid_post(payload)),
 created_at timestamptz not null default now(),
 primary key(user_id,round_id)
);
create index dogleg_round_posts_created on public.dogleg_round_posts(created_at desc);
alter table public.dogleg_round_posts enable row level security;
revoke all on public.dogleg_round_posts from anon,authenticated;
grant select,insert,update,delete on public.dogleg_round_posts to authenticated;
create policy post_read on public.dogleg_round_posts for select to authenticated using (
 user_id=(select auth.uid()) or exists(select 1 from public.dogleg_connections c where c.status='accepted' and ((c.requester=(select auth.uid()) and c.recipient=user_id) or (c.recipient=(select auth.uid()) and c.requester=user_id))));
create policy post_insert on public.dogleg_round_posts for insert to authenticated with check(user_id=(select auth.uid()));
create policy post_update on public.dogleg_round_posts for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy post_remove on public.dogleg_round_posts for delete to authenticated using(user_id=(select auth.uid()));

