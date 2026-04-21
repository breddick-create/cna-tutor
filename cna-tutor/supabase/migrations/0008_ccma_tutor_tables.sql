-- CCMA tutor session and turn tables, mirroring the CNA tutor_sessions/tutor_turns
-- but isolated so CCMA data never mixes with CNA data.

create table if not exists public.ccma_tutor_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mode text not null,
  status text not null default 'active',
  session_state_json jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default timezone('utc', now()),
  ended_at timestamptz,
  last_activity_at timestamptz not null default timezone('utc', now()),
  total_seconds integer not null default 0,
  active_seconds integer not null default 0,
  idle_seconds integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.ccma_tutor_turns (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.ccma_tutor_sessions(id) on delete cascade,
  actor text not null,
  turn_type text not null,
  content text not null,
  correctness text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists ccma_tutor_sessions_user_idx
  on public.ccma_tutor_sessions(user_id, started_at desc);

create index if not exists ccma_tutor_turns_session_idx
  on public.ccma_tutor_turns(session_id, created_at);

alter table public.ccma_tutor_sessions enable row level security;
alter table public.ccma_tutor_turns enable row level security;

create policy "ccma tutor sessions own access"
  on public.ccma_tutor_sessions
  for select
  using (auth.uid() = user_id or public.is_admin());

create policy "ccma tutor sessions own insert"
  on public.ccma_tutor_sessions
  for insert
  with check (auth.uid() = user_id or public.is_admin());

create policy "ccma tutor sessions own update"
  on public.ccma_tutor_sessions
  for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

create policy "ccma tutor turns own access"
  on public.ccma_tutor_turns
  for select
  using (
    exists (
      select 1 from public.ccma_tutor_sessions
      where public.ccma_tutor_sessions.id = ccma_tutor_turns.session_id
        and (public.ccma_tutor_sessions.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "ccma tutor turns own insert"
  on public.ccma_tutor_turns
  for insert
  with check (
    exists (
      select 1 from public.ccma_tutor_sessions
      where public.ccma_tutor_sessions.id = ccma_tutor_turns.session_id
        and (public.ccma_tutor_sessions.user_id = auth.uid() or public.is_admin())
    )
  );
