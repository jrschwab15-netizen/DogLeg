-- Public licensed course facts only. Player journals and posting policies stay separate.
create table public.dogleg_course_catalog (
 id uuid primary key,
 name text not null check (length(name) between 1 and 100),
 source text not null default 'OpenGolfAPI' check (source='OpenGolfAPI'),
 data jsonb not null check (jsonb_typeof(data)='object' and octet_length(data::text)<100000),
 fetched_at timestamptz not null default now()
);
alter table public.dogleg_course_catalog enable row level security;
revoke all on public.dogleg_course_catalog from public,anon,authenticated;
grant select on public.dogleg_course_catalog to anon,authenticated;
grant all on public.dogleg_course_catalog to service_role;
create policy "Public licensed course facts" on public.dogleg_course_catalog for select to anon,authenticated using (true);
