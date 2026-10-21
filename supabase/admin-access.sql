-- Independent admin activation. Does not enable membership/paywall restrictions.
create schema if not exists dogleg_private;
revoke all on schema dogleg_private from public, anon;
grant usage on schema dogleg_private to authenticated;
create table dogleg_private.admin_accounts (
 user_id uuid primary key references auth.users(id) on delete cascade,
 active boolean not null default true,
 pin_hash text, token uuid, expires_at timestamptz,
 attempts integer not null default 0, window_start timestamptz not null default now()
);
create table dogleg_private.admin_events (
 id bigint generated always as identity primary key,
 actor uuid not null, target uuid not null, action text not null,
 created_at timestamptz not null default now()
);
alter table dogleg_private.admin_accounts enable row level security;
alter table dogleg_private.admin_events enable row level security;
revoke all on dogleg_private.admin_accounts,dogleg_private.admin_events from public,anon,authenticated;
create function dogleg_private.admin_status() returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object('allowed',coalesce((select active from dogleg_private.admin_accounts where user_id=auth.uid()),false),'needs_pin',coalesce((select active and pin_hash is null from dogleg_private.admin_accounts where user_id=auth.uid()),false))
$$;
create function dogleg_private.admin_enroll(new_pin text) returns boolean language plpgsql security definer set search_path='' as $$
begin
 if new_pin is null or new_pin !~ '^[0-9]{6,12}$' then return false; end if;
 update dogleg_private.admin_accounts set pin_hash=extensions.crypt(new_pin,extensions.gen_salt('bf',10)),token=null,expires_at=null where user_id=auth.uid() and active and pin_hash is null;
 if not found then return false; end if;
 insert into dogleg_private.admin_events(actor,target,action) values(auth.uid(),auth.uid(),'pin_enrolled');
 return true;
end$$;
create function dogleg_private.admin_unlock(pin text) returns uuid language plpgsql security definer set search_path='' as $$
declare a dogleg_private.admin_accounts; t uuid;
begin
 select * into a from dogleg_private.admin_accounts where user_id=auth.uid() and active for update;
 if not found or a.pin_hash is null then return null; end if;
 if a.window_start<now()-interval '15 minutes' then a.attempts:=0; a.window_start:=now(); end if;
 if a.attempts>=5 then return null; end if;
 update dogleg_private.admin_accounts set attempts=a.attempts+1,window_start=a.window_start where user_id=a.user_id;
 if pin is null or pin !~ '^[0-9]{6,12}$' or extensions.crypt(pin,a.pin_hash)<>a.pin_hash then return null; end if;
 t:=gen_random_uuid();
 update dogleg_private.admin_accounts set token=t,expires_at=now()+interval '10 minutes',attempts=0 where user_id=a.user_id;
 return t;
end$$;
create function dogleg_private.admin_require(unlock_token uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not exists(select 1 from dogleg_private.admin_accounts where user_id=auth.uid() and active and token=unlock_token and expires_at>now()) then raise exception 'Administrator unlock required'; end if;
end$$;
create function dogleg_private.admin_dashboard(unlock_token uuid) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform dogleg_private.admin_require(unlock_token);
 return jsonb_build_object('statistics',jsonb_build_object('users',(select count(*) from auth.users),'rounds',(select coalesce(sum(case when jsonb_typeof(data->'rounds')='array' then jsonb_array_length(data->'rounds') else 0 end),0) from public.dogleg_journals)),
 'users',(select coalesce(jsonb_agg(jsonb_build_object('user_id',u.id,'email',u.email,'created_at',u.created_at,'is_admin',coalesce(a.active,false),'rounds',case when jsonb_typeof(j.data->'rounds')='array' then jsonb_array_length(j.data->'rounds') else 0 end) order by u.created_at desc),'[]'::jsonb) from auth.users u left join dogleg_private.admin_accounts a on a.user_id=u.id left join public.dogleg_journals j on j.user_id=u.id));
end$$;
create function dogleg_private.admin_role(unlock_token uuid,target_user uuid,enabled boolean) returns void language plpgsql security definer set search_path='' as $$
begin
 perform dogleg_private.admin_require(unlock_token);
 if enabled is null or target_user is null or target_user=auth.uid() then raise exception 'Cannot change own administrator role'; end if;
 if not exists(select 1 from auth.users where id=target_user) then raise exception 'Unknown account'; end if;
 insert into dogleg_private.admin_accounts(user_id,active) values(target_user,enabled) on conflict(user_id) do update set active=excluded.active,token=null,expires_at=null;
 insert into dogleg_private.admin_events(actor,target,action) values(auth.uid(),target_user,case when enabled then 'admin_granted' else 'admin_revoked' end);
end$$;
create function dogleg_private.admin_lock(unlock_token uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 update dogleg_private.admin_accounts set token=null,expires_at=null where user_id=auth.uid() and token=unlock_token;
end$$;
revoke all on function dogleg_private.admin_status(),dogleg_private.admin_enroll(text),dogleg_private.admin_unlock(text),dogleg_private.admin_require(uuid),dogleg_private.admin_dashboard(uuid),dogleg_private.admin_role(uuid,uuid,boolean),dogleg_private.admin_lock(uuid) from public,anon,authenticated;
grant execute on function dogleg_private.admin_status(),dogleg_private.admin_enroll(text),dogleg_private.admin_unlock(text),dogleg_private.admin_dashboard(uuid),dogleg_private.admin_role(uuid,uuid,boolean),dogleg_private.admin_lock(uuid) to authenticated;
create function public.dogleg_admin_status() returns jsonb language sql security invoker set search_path='' as $$select dogleg_private.admin_status()$$;
create function public.dogleg_admin_enroll(new_pin text) returns boolean language sql security invoker set search_path='' as $$select dogleg_private.admin_enroll(new_pin)$$;
create function public.dogleg_admin_unlock(pin text) returns uuid language sql security invoker set search_path='' as $$select dogleg_private.admin_unlock(pin)$$;
create function public.dogleg_admin_overview(unlock_token uuid) returns jsonb language sql security invoker set search_path='' as $$select dogleg_private.admin_dashboard(unlock_token)$$;
create function public.dogleg_admin_role(unlock_token uuid,target_user uuid,enabled boolean) returns void language sql security invoker set search_path='' as $$select dogleg_private.admin_role(unlock_token,target_user,enabled)$$;
create function public.dogleg_admin_lock(unlock_token uuid) returns void language sql security invoker set search_path='' as $$select dogleg_private.admin_lock(unlock_token)$$;
revoke all on function public.dogleg_admin_status(),public.dogleg_admin_enroll(text),public.dogleg_admin_unlock(text),public.dogleg_admin_overview(uuid),public.dogleg_admin_role(uuid,uuid,boolean),public.dogleg_admin_lock(uuid) from public,anon;
grant execute on function public.dogleg_admin_status(),public.dogleg_admin_enroll(text),public.dogleg_admin_unlock(text),public.dogleg_admin_overview(uuid),public.dogleg_admin_role(uuid,uuid,boolean),public.dogleg_admin_lock(uuid) to authenticated;
