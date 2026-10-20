-- One course review per golfer; readable only by its owner and accepted friends.
create table public.dogleg_course_reviews (
 user_id uuid not null references auth.users(id) on delete cascade,
 course_key text not null check (char_length(course_key) between 3 and 220),
 course_name text not null check (char_length(course_name) between 1 and 100),
 golfer_name text not null check (char_length(golfer_name) between 1 and 50),
 stars smallint not null check (stars between 1 and 5),
 review text not null default '' check (char_length(review)<=1500),
 updated_at timestamptz not null default now(),
 primary key(user_id,course_key)
);
create index dogleg_course_reviews_course on public.dogleg_course_reviews(course_key,updated_at desc);
alter table public.dogleg_course_reviews enable row level security;
revoke all on public.dogleg_course_reviews from public,anon,authenticated;
grant select,insert,update,delete on public.dogleg_course_reviews to authenticated;
create policy course_review_read on public.dogleg_course_reviews for select to authenticated using (
 user_id=(select auth.uid()) or exists(select 1 from public.dogleg_connections c where c.status='accepted' and
 ((c.requester=(select auth.uid()) and c.recipient=dogleg_course_reviews.user_id) or
 (c.recipient=(select auth.uid()) and c.requester=dogleg_course_reviews.user_id))));
create policy course_review_insert on public.dogleg_course_reviews for insert to authenticated with check(user_id=(select auth.uid()));
create policy course_review_update on public.dogleg_course_reviews for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy course_review_delete on public.dogleg_course_reviews for delete to authenticated using(user_id=(select auth.uid()));
