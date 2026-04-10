create extension if not exists pgcrypto;

create type public.app_role as enum ('student', 'admin');
create type public.lesson_mode as enum ('learn', 'quiz', 'mock_exam', 'weak_area_review', 'study_plan', 'rapid_review');
create type public.session_status as enum ('active', 'paused', 'completed', 'abandoned');
create type public.turn_actor as enum ('tutor', 'student', 'system');

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'student',
  full_name text not null,
  email text not null unique,
  cohort text,
  study_goal_hours integer not null default 40,
  last_login_at timestamptz,
  last_activity_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.domains (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid not null references public.domains(id) on delete cascade,
  title text not null,
  mode public.lesson_mode not null default 'learn',
  difficulty integer not null default 1,
  estimated_minutes integer not null default 15,
  content_json jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.question_bank (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid not null references public.domains(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  type text not null,
  prompt text not null,
  choices_json jsonb,
  answer_json jsonb not null,
  rationale text not null,
  memory_tip text,
  difficulty integer not null default 1,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.tutor_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mode public.lesson_mode not null,
  domain_id uuid references public.domains(id) on delete set null,
  lesson_id uuid references public.lessons(id) on delete set null,
  status public.session_status not null default 'active',
  started_at timestamptz not null default timezone('utc', now()),
  ended_at timestamptz,
  last_activity_at timestamptz not null default timezone('utc', now()),
  total_seconds integer not null default 0,
  active_seconds integer not null default 0,
  idle_seconds integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.tutor_turns (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.tutor_sessions(id) on delete cascade,
  actor public.turn_actor not null,
  turn_type text not null,
  content text not null,
  correctness text,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  session_id uuid references public.tutor_sessions(id) on delete set null,
  event_type text not null,
  metadata_json jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default timezone('utc', now())
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  domain_id uuid references public.domains(id) on delete set null,
  score integer not null default 0,
  total_questions integer not null default 0,
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.mock_exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  score integer not null default 0,
  percent integer not null default 0,
  passed boolean not null default false,
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.domain_mastery (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  domain_id uuid not null references public.domains(id) on delete cascade,
  mastery_score integer not null default 0,
  weak_streak integer not null default 0,
  last_seen_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, domain_id)
);

create table public.daily_user_stats (
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  total_seconds integer not null default 0,
  active_seconds integer not null default 0,
  idle_seconds integer not null default 0,
  lessons_completed integer not null default 0,
  quizzes_completed integer not null default 0,
  mock_exams_completed integer not null default 0,
  average_score integer not null default 0,
  last_activity_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, date)
);

create index profiles_role_idx on public.profiles(role);
create index profiles_cohort_idx on public.profiles(cohort);
create index profiles_last_activity_idx on public.profiles(last_activity_at desc);
create index lessons_domain_idx on public.lessons(domain_id);
create index question_bank_domain_idx on public.question_bank(domain_id);
create index tutor_sessions_user_idx on public.tutor_sessions(user_id, started_at desc);
create index tutor_turns_session_idx on public.tutor_turns(session_id, created_at);
create index activity_events_user_idx on public.activity_events(user_id, occurred_at desc);
create index quiz_attempts_user_idx on public.quiz_attempts(user_id, created_at desc);
create index mock_exam_attempts_user_idx on public.mock_exam_attempts(user_id, created_at desc);
create index domain_mastery_user_idx on public.domain_mastery(user_id, mastery_score);
create index daily_user_stats_date_idx on public.daily_user_stats(date desc);

create trigger profiles_updated_at
before update on public.profiles
for each row execute procedure public.touch_updated_at();

create trigger lessons_updated_at
before update on public.lessons
for each row execute procedure public.touch_updated_at();

create trigger tutor_sessions_updated_at
before update on public.tutor_sessions
for each row execute procedure public.touch_updated_at();

create trigger domain_mastery_updated_at
before update on public.domain_mastery
for each row execute procedure public.touch_updated_at();

create trigger daily_user_stats_updated_at
before update on public.daily_user_stats
for each row execute procedure public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, email, cohort)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'role')::public.app_role, 'student'),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    nullif(new.raw_user_meta_data ->> 'cohort', '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name,
    cohort = excluded.cohort;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin(check_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = check_user_id
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.domains enable row level security;
alter table public.lessons enable row level security;
alter table public.question_bank enable row level security;
alter table public.tutor_sessions enable row level security;
alter table public.tutor_turns enable row level security;
alter table public.activity_events enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.mock_exam_attempts enable row level security;
alter table public.domain_mastery enable row level security;
alter table public.daily_user_stats enable row level security;

create policy "profiles own read"
on public.profiles
for select
using (auth.uid() = id or public.is_admin());

create policy "profiles own update"
on public.profiles
for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

create policy "domains authenticated read"
on public.domains
for select
using (auth.role() = 'authenticated');

create policy "domains admin manage"
on public.domains
for all
using (public.is_admin())
with check (public.is_admin());

create policy "lessons authenticated read"
on public.lessons
for select
using (auth.role() = 'authenticated');

create policy "lessons admin manage"
on public.lessons
for all
using (public.is_admin())
with check (public.is_admin());

create policy "question bank authenticated read"
on public.question_bank
for select
using (auth.role() = 'authenticated');

create policy "question bank admin manage"
on public.question_bank
for all
using (public.is_admin())
with check (public.is_admin());

create policy "tutor sessions own access"
on public.tutor_sessions
for select
using (auth.uid() = user_id or public.is_admin());

create policy "tutor sessions own insert"
on public.tutor_sessions
for insert
with check (auth.uid() = user_id or public.is_admin());

create policy "tutor sessions own update"
on public.tutor_sessions
for update
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

create policy "tutor turns own access"
on public.tutor_turns
for select
using (
  exists (
    select 1
    from public.tutor_sessions
    where public.tutor_sessions.id = tutor_turns.session_id
      and (public.tutor_sessions.user_id = auth.uid() or public.is_admin())
  )
);

create policy "tutor turns own insert"
on public.tutor_turns
for insert
with check (
  exists (
    select 1
    from public.tutor_sessions
    where public.tutor_sessions.id = tutor_turns.session_id
      and (public.tutor_sessions.user_id = auth.uid() or public.is_admin())
  )
);

create policy "activity events own access"
on public.activity_events
for select
using (auth.uid() = user_id or public.is_admin());

create policy "activity events own insert"
on public.activity_events
for insert
with check (auth.uid() = user_id or public.is_admin());

create policy "quiz attempts own access"
on public.quiz_attempts
for select
using (auth.uid() = user_id or public.is_admin());

create policy "quiz attempts own insert"
on public.quiz_attempts
for insert
with check (auth.uid() = user_id or public.is_admin());

create policy "quiz attempts own update"
on public.quiz_attempts
for update
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

create policy "mock exams own access"
on public.mock_exam_attempts
for select
using (auth.uid() = user_id or public.is_admin());

create policy "mock exams own insert"
on public.mock_exam_attempts
for insert
with check (auth.uid() = user_id or public.is_admin());

create policy "mock exams own update"
on public.mock_exam_attempts
for update
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

create policy "domain mastery own access"
on public.domain_mastery
for select
using (auth.uid() = user_id or public.is_admin());

create policy "domain mastery own insert"
on public.domain_mastery
for insert
with check (auth.uid() = user_id or public.is_admin());

create policy "domain mastery own update"
on public.domain_mastery
for update
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

create policy "daily stats own access"
on public.daily_user_stats
for select
using (auth.uid() = user_id or public.is_admin());

create policy "daily stats own insert"
on public.daily_user_stats
for insert
with check (auth.uid() = user_id or public.is_admin());

create policy "daily stats own update"
on public.daily_user_stats
for update
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());
