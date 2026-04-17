alter table public.profiles
alter column preferred_language set default 'en';

update public.profiles
set preferred_language = case
  when preferred_language in ('spanish', 'es') then 'es'
  else 'en'
end;
