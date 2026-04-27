-- Add username column to ccma_profiles
alter table public.ccma_profiles
  add column if not exists username text;

-- Backfill: existing users keep their email as their username
update public.ccma_profiles
set username = email
where username is null;

-- Enforce NOT NULL and uniqueness
alter table public.ccma_profiles
  alter column username set not null;

alter table public.ccma_profiles
  add constraint ccma_profiles_username_key unique (username);

-- Update trigger so new signups include username from metadata
create or replace function public.handle_new_ccma_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.ccma_profiles (id, role, full_name, email, username, cohort)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'role')::public.app_role, 'student'),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'username', new.email),
    nullif(new.raw_user_meta_data ->> 'cohort', '')
  )
  on conflict (id) do update
  set
    email    = excluded.email,
    full_name = excluded.full_name,
    username = excluded.username,
    cohort   = excluded.cohort;

  return new;
end;
$$;

-- RPC used by signInAction to resolve a username to its auth email
create or replace function public.get_email_by_username(p_username text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select email
  from public.ccma_profiles
  where username = lower(trim(p_username))
  limit 1;
$$;
