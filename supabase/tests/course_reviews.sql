begin;
insert into auth.users(id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at) values
 ('fd001000-0000-4000-8000-000000000001','authenticated','authenticated','course-a@example.invalid','',now(),now(),now()),
 ('fd001000-0000-4000-8000-000000000002','authenticated','authenticated','course-b@example.invalid','',now(),now(),now()),
 ('fd001000-0000-4000-8000-000000000003','authenticated','authenticated','course-c@example.invalid','',now(),now(),now());
insert into public.dogleg_connections(requester,recipient,requester_name,recipient_name,status) values
 ('fd001000-0000-4000-8000-000000000001','fd001000-0000-4000-8000-000000000002','Course A','Course B','accepted'),
 ('fd001000-0000-4000-8000-000000000001','fd001000-0000-4000-8000-000000000003','Course A','Golf friend','pending');
set local role anon;
do $$ begin
 begin perform * from public.dogleg_course_reviews;raise exception 'Anonymous review access allowed';exception when insufficient_privilege then null;end;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub','fd001000-0000-4000-8000-000000000001',true);
insert into public.dogleg_course_reviews(user_id,course_key,course_name,golfer_name,stars,review) values
 ('fd001000-0000-4000-8000-000000000001','test:rollback-only','Synthetic course','Course A',4,'Rollback-only test');
do $$ begin
 if (select count(*) from public.dogleg_course_reviews where course_key='test:rollback-only')<>1 then raise exception 'Owner cannot read';end if;
 begin update public.dogleg_course_reviews set user_id='fd001000-0000-4000-8000-000000000002' where course_key='test:rollback-only';raise exception 'Ownership reassignment allowed';exception when insufficient_privilege then null;end;
 begin update public.dogleg_course_reviews set stars=6 where course_key='test:rollback-only';raise exception 'Invalid rating allowed';exception when check_violation then null;end;
end $$;
select set_config('request.jwt.claim.sub','fd001000-0000-4000-8000-000000000002',true);
do $$ declare n int;begin
 if (select count(*) from public.dogleg_course_reviews where course_key='test:rollback-only')<>1 then raise exception 'Accepted friend cannot read';end if;
 update public.dogleg_course_reviews set review='Should be denied' where course_key='test:rollback-only';get diagnostics n=row_count;if n<>0 then raise exception 'Friend modified review';end if;
 delete from public.dogleg_course_reviews where course_key='test:rollback-only';get diagnostics n=row_count;if n<>0 then raise exception 'Friend deleted review';end if;
end $$;
select set_config('request.jwt.claim.sub','fd001000-0000-4000-8000-000000000003',true);
do $$ begin if exists(select 1 from public.dogleg_course_reviews where course_key='test:rollback-only') then raise exception 'Pending friend can read';end if;end $$;
reset role;
delete from public.dogleg_connections where requester='fd001000-0000-4000-8000-000000000001' and recipient='fd001000-0000-4000-8000-000000000002';
set local role authenticated;
select set_config('request.jwt.claim.sub','fd001000-0000-4000-8000-000000000002',true);
do $$ begin if exists(select 1 from public.dogleg_course_reviews where course_key='test:rollback-only') then raise exception 'Disconnected friend can read';end if;end $$;
select set_config('request.jwt.claim.sub','fd001000-0000-4000-8000-000000000001',true);
do $$ declare n int;begin delete from public.dogleg_course_reviews where course_key='test:rollback-only';get diagnostics n=row_count;if n<>1 then raise exception 'Owner cannot delete';end if;end $$;
rollback;
