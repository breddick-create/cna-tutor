create table if not exists public.cna_skill_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  skill_slug text not null,
  mastery_score integer not null default 0 check (mastery_score between 0 and 100),
  walkthrough_completions integer not null default 0,
  timed_practice_completions integer not null default 0,
  last_practiced_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, skill_slug)
);

create index if not exists cna_skill_progress_user_idx
  on public.cna_skill_progress(user_id, last_practiced_at desc);

alter table public.cna_skill_progress enable row level security;

create policy "cna skill progress own access"
  on public.cna_skill_progress
  for select
  using (auth.uid() = user_id or public.is_admin());

create policy "cna skill progress own insert"
  on public.cna_skill_progress
  for insert
  with check (auth.uid() = user_id or public.is_admin());

create policy "cna skill progress own update"
  on public.cna_skill_progress
  for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

alter table public.tutor_sessions
  add column if not exists section text not null default 'written';

alter table public.quiz_attempts
  add column if not exists section text not null default 'written';

alter table public.mock_exam_attempts
  add column if not exists section text not null default 'written';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'tutor_sessions_section_check'
  ) then
    alter table public.tutor_sessions
      add constraint tutor_sessions_section_check
      check (section in ('written', 'skills'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'quiz_attempts_section_check'
  ) then
    alter table public.quiz_attempts
      add constraint quiz_attempts_section_check
      check (section in ('written', 'skills'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'mock_exam_attempts_section_check'
  ) then
    alter table public.mock_exam_attempts
      add constraint mock_exam_attempts_section_check
      check (section in ('written', 'skills'));
  end if;
end $$;
