alter table public.dogleg_round_posts alter column round_id type text using round_id::text;
alter table public.dogleg_round_posts add constraint dogleg_post_round_id_format check (round_id ~ '^[A-Za-z0-9_-]{1,100}$');

