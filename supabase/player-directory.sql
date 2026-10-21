-- Opt-in player directory; journal and playing-partner records stay private.
create table public.dogleg_player_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null check(length(trim(display_name)) between 1 and 50),
 home_area text not null default '' check(length(home_area)<=100),
 discoverable boolean not null default false
);
alter table public.dogleg_player_profiles enable row level security;
revoke all on public.dogleg_player_profiles from public,anon,authenticated;
grant select,insert,update on public.dogleg_player_profiles to authenticated;
create policy player_profile_read on public.dogleg_player_profiles for select to authenticated using(user_id=(select auth.uid()) or discoverable);
create policy player_profile_insert on public.dogleg_player_profiles for insert to authenticated with check(user_id=(select auth.uid()));
create policy player_profile_update on public.dogleg_player_profiles for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create function public.dogleg_search_players(search_name text) returns table(user_id uuid,display_name text,home_area text) language sql stable security invoker set search_path='' as $$
 select p.user_id,p.display_name,p.home_area from public.dogleg_player_profiles p
 where (select auth.uid()) is not null and p.discoverable and p.user_id<>(select auth.uid())
 and length(trim(search_name)) between 2 and 50
 and not exists(select 1 from regexp_split_to_table(lower(trim(search_name)),E'\\s+') as words(term) where strpos(lower(p.display_name),term)=0)
 order by lower(p.display_name),p.user_id limit 20
$$;
revoke all on function public.dogleg_search_players(text) from public,anon;
grant execute on function public.dogleg_search_players(text) to authenticated;
