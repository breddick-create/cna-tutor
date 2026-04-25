-- Add adaptive session-phase tracking to CCMA tutor sessions
alter table public.ccma_tutor_sessions
  add column if not exists phase text not null default 'open'
    check (phase in ('open', 'core', 'close', 'completed'));

alter table public.ccma_tutor_sessions
  add column if not exists phase_started_at timestamptz;

alter table public.ccma_tutor_sessions
  add column if not exists bloom_target integer not null default 2
    check (bloom_target between 1 and 6);

-- Add Bloom and concept tracking to CCMA tutor turns
alter table public.ccma_tutor_turns
  add column if not exists bloom_level integer
    check (bloom_level between 1 and 6);

alter table public.ccma_tutor_turns
  add column if not exists segment_id text;

alter table public.ccma_tutor_turns
  add column if not exists mastery_delta numeric(5,4);
