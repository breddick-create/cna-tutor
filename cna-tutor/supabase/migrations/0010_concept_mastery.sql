-- Segment-level mastery tracking with SM-2 spaced repetition
create table if not exists public.concept_mastery (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  concept_id text not null,        -- LessonSegment.id
  lesson_id text not null,         -- TutorLesson.id
  interval integer not null default 1,          -- days until next review
  ease_factor numeric(4,2) not null default 2.50,
  repetitions integer not null default 0,
  next_review_at timestamptz not null default timezone('utc', now()),
  mastery_score numeric(5,4) not null default 0, -- 0–1, confidence-weighted with recency decay
  last_score integer not null default 0,         -- 0–100 raw score from most recent grading
  bloom_level integer not null default 1 check (bloom_level between 1 and 6),
  last_seen_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, concept_id)
);

alter table public.concept_mastery enable row level security;

create policy "concept_mastery_own"
  on public.concept_mastery for all
  using (auth.uid() = user_id);

create trigger concept_mastery_updated_at
  before update on public.concept_mastery
  for each row execute function public.touch_updated_at();

create index if not exists concept_mastery_user_review
  on public.concept_mastery (user_id, next_review_at);
