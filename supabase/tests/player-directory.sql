-- Non-mutating production checks. Positive multi-user UI tests use local fixtures.
begin read only;
do $$begin
 if not (select relrowsecurity from pg_class where oid='public.dogleg_player_profiles'::regclass) then raise exception 'RLS missing';end if;
 if has_table_privilege('anon','public.dogleg_player_profiles','select') or has_function_privilege('anon','public.dogleg_search_players(text)','execute') then raise exception 'Anonymous access exposed';end if;
 if (select prosecdef from pg_proc where oid='public.dogleg_search_players(text)'::regprocedure) then raise exception 'Search bypasses RLS';end if;
 if (select count(*) from pg_policies where schemaname='public' and tablename='dogleg_player_profiles')<>3 then raise exception 'Missing owner policies';end if;
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='dogleg_player_profiles' and cmd='UPDATE' and qual like '%auth.uid()%' and with_check like '%auth.uid()%') then raise exception 'Owner update guard missing';end if;
end$$;
set local role authenticated;
do $$begin if auth.uid() is not null then raise exception 'Unexpected session identity';end if;if exists(select 1 from public.dogleg_search_players('QA')) then raise exception 'Unauthenticated identity can enumerate';end if;end$$;
reset role;
-- Validate word-order/literal matching against in-memory values, never Auth rows.
do $$begin if (select count(*) from (values ('Jamie Smith')) p(name) where not exists(select 1 from regexp_split_to_table(lower('smith jamie'),E'\\s+') as words(term) where strpos(lower(p.name),term)=0))<>1 then raise exception 'Name token matching failed';end if;end$$;
rollback;
