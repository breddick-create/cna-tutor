alter table public.profiles
add column if not exists preferred_language text not null default 'english';

update public.profiles
set preferred_language = 'english'
where preferred_language is null;
