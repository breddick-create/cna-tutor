-- RDA Tutor parallel product support.

create extension if not exists "pgcrypto";

alter table public.profiles
  drop constraint if exists profiles_product_check;

alter table public.profiles
  add constraint profiles_product_check
  check (product in ('cna', 'ccma', 'rda'));

create table if not exists public.rda_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  product text not null default 'rda',
  full_name text,
  language_preference text default 'en',
  school_or_program text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rda_pretest_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  overall_score numeric(5,2) not null,
  domain_scores jsonb not null,
  weak_areas jsonb,
  strengths jsonb,
  readiness_score integer,
  readiness_label text,
  confidence_estimate integer,
  answers jsonb,
  completed_at timestamptz not null default now()
);

create index if not exists idx_rda_pretest_user_id
  on public.rda_pretest_results(user_id);

create table if not exists public.rda_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  lesson_id text not null,
  domain_id text not null,
  status text not null default 'not_started',
  mastery_score numeric(5,2),
  current_step integer default 1,
  attempts_count integer default 0,
  last_feedback text,
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists idx_rda_lesson_progress_user_id
  on public.rda_lesson_progress(user_id);

create table if not exists public.rda_quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  quiz_id text not null,
  domain_id text not null,
  score numeric(5,2) not null,
  passed boolean not null default false,
  answers jsonb,
  weak_areas jsonb,
  completed_at timestamptz not null default now()
);

create index if not exists idx_rda_quiz_attempts_user_id
  on public.rda_quiz_attempts(user_id);

create table if not exists public.rda_mock_exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  exam_version text,
  score numeric(5,2) not null,
  timed boolean not null default false,
  duration_seconds integer,
  domain_scores jsonb not null,
  weak_areas jsonb,
  action_plan jsonb,
  answers jsonb,
  completed_at timestamptz not null default now()
);

create index if not exists idx_rda_mock_exam_attempts_user_id
  on public.rda_mock_exam_attempts(user_id);

create table if not exists public.rda_readiness_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  score integer not null,
  label text not null,
  weak_areas jsonb,
  strengths jsonb,
  next_best_action text,
  checklist jsonb,
  recovery_signals jsonb,
  confidence_trend integer,
  created_at timestamptz not null default now()
);

create index if not exists idx_rda_readiness_user_id
  on public.rda_readiness_snapshots(user_id);

create table if not exists public.rda_study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  lesson_id text,
  domain_id text,
  session_type text not null
    check (session_type in ('lesson', 'quiz', 'mock_exam', 'pretest', 'review', 'tutor')),
  duration_seconds integer not null default 0,
  completed boolean not null default false,
  score numeric(5,2),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_rda_study_sessions_user_id
  on public.rda_study_sessions(user_id);

create table if not exists public.rda_admin_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  admin_user_id uuid not null,
  note text not null,
  note_type text not null default 'general'
    check (note_type in ('general', 'check_in', 'risk', 'encouragement', 'academic')),
  created_at timestamptz not null default now()
);

create index if not exists idx_rda_admin_notes_user_id
  on public.rda_admin_notes(user_id);
