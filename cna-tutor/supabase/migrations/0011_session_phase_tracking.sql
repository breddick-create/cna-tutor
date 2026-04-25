-- Add session phase state machine columns to tutor_sessions
alter table public.tutor_sessions
  add column if not exists phase text not null default 'open'
    check (phase in ('open', 'core', 'close', 'completed'));

alter table public.tutor_sessions
  add column if not exists phase_started_at timestamptz;

-- Bloom's taxonomy target level for the session (1=Remember … 6=Create)
alter table public.tutor_sessions
  add column if not exists bloom_target integer not null default 2
    check (bloom_target between 1 and 6);
