-- Daily study streak tracking
create table if not exists public.study_streaks (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_study_date date,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.study_streaks enable row level security;

create policy "study_streaks_own"
  on public.study_streaks for all
  using (auth.uid() = user_id);

-- Achievement catalog
create table if not exists public.achievement_definitions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  criteria_json jsonb not null default '{}',
  created_at timestamptz not null default timezone('utc', now())
);

insert into public.achievement_definitions (slug, title, description, criteria_json) values
  ('first_lesson',   'First Lesson',    'Completed your first tutor lesson',          '{"type":"lessons_completed","threshold":1}'),
  ('streak_3',       '3-Day Streak',    'Studied 3 days in a row',                    '{"type":"streak","threshold":3}'),
  ('streak_7',       '7-Day Streak',    'Studied 7 days in a row',                    '{"type":"streak","threshold":7}'),
  ('streak_14',      '14-Day Streak',   'Studied 14 days in a row',                   '{"type":"streak","threshold":14}'),
  ('perfect_session','Perfect Session', 'Mastered every topic in a single lesson',    '{"type":"session_mastery","threshold":100}'),
  ('domain_master',  'Domain Master',   'Reached 90% mastery on a domain',            '{"type":"domain_mastery","threshold":90}'),
  ('ten_lessons',    '10 Lessons Done', 'Completed 10 tutor lessons',                 '{"type":"lessons_completed","threshold":10}')
on conflict (slug) do nothing;

-- Student earned achievements
create table if not exists public.student_achievements (
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievement_definitions(id) on delete cascade,
  earned_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, achievement_id)
);

alter table public.student_achievements enable row level security;

create policy "student_achievements_own"
  on public.student_achievements for all
  using (auth.uid() = user_id);
