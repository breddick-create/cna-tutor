alter table public.tutor_sessions
add column session_state_json jsonb not null default '{}'::jsonb;
