create or replace function public.dogleg_valid_post(p jsonb) returns boolean language plpgsql immutable set search_path='' as $$
begin
 if jsonb_typeof(p) is distinct from 'object' or octet_length(p::text)>300000 then return false; end if;
 if exists(select 1 from jsonb_each(p) e where e.key in ('name','course','date','tees','notes') and jsonb_typeof(e.value) is distinct from 'string') then return false; end if;
 if not (p ?& array['name','course','date','score','holes','tees','notes','photos']) then return false; end if;
 if char_length(p->>'name') not between 1 and 50 or char_length(p->>'course') not between 1 and 100 or char_length(p->>'tees')>40 or char_length(p->>'notes')>2000 then return false; end if;
 if (p->>'date') !~ '^\d{4}-\d{2}-\d{2}$' or (p->>'holes') not in ('9','18') or (p->>'score') !~ '^[0-9]{1,3}$' then return false; end if;
 if (p->>'score')::int < (p->>'holes')::int or (p->>'score')::int>360 then return false; end if;
 if jsonb_typeof(p->'photos') is distinct from 'array' or jsonb_array_length(p->'photos')>3 then return false; end if;
 if exists(select 1 from jsonb_array_elements(p->'photos') as photo where jsonb_typeof(photo)<>'string' or char_length(photo#>>'{}')>90000 or (photo#>>'{}') !~ '^data:image/jpeg;base64,[A-Za-z0-9+/=]+$') then return false; end if;
 return true;
exception when others then return false;
end $$;

