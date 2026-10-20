begin;
set local role anon;
select count(*) as readable_course_cards from public.dogleg_course_catalog;
do $$
begin
 begin insert into public.dogleg_course_catalog(id,name,data) values ('00000000-0000-0000-0000-000000000001','Policy test','{}'); raise exception 'Anonymous insert unexpectedly allowed'; exception when insufficient_privilege then null; end;
 begin update public.dogleg_course_catalog set name='Policy test' where false; raise exception 'Anonymous update unexpectedly allowed'; exception when insufficient_privilege then null; end;
 begin delete from public.dogleg_course_catalog where false; raise exception 'Anonymous delete unexpectedly allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
set local role authenticated;
select count(*) as readable_course_cards from public.dogleg_course_catalog;
do $$
begin
 begin insert into public.dogleg_course_catalog(id,name,data) values ('00000000-0000-0000-0000-000000000001','Policy test','{}'); raise exception 'User insert unexpectedly allowed'; exception when insufficient_privilege then null; end;
 begin update public.dogleg_course_catalog set name='Policy test' where false; raise exception 'User update unexpectedly allowed'; exception when insufficient_privilege then null; end;
 begin delete from public.dogleg_course_catalog where false; raise exception 'User delete unexpectedly allowed'; exception when insufficient_privilege then null; end;
end $$;
rollback;
