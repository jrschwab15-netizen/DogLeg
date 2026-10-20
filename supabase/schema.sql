create table public.dogleg_journals (
 user_id uuid primary key references auth.users(id) on delete cascade,
 data jsonb not null check (jsonb_typeof(data) = 'object' and octet_length(data::text) <= 10000000),
 revision bigint not null default 1 check (revision > 0),
 updated_at timestamptz not null default now()
);
alter table public.dogleg_journals enable row level security;
revoke all on public.dogleg_journals from anon, authenticated;
grant select, insert, update on public.dogleg_journals to authenticated;
create policy "Read own journal" on public.dogleg_journals for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own journal" on public.dogleg_journals for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own journal" on public.dogleg_journals for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
