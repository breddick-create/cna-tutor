-- RDA schema fixes: tutor session tables, FK constraints, RLS policies,
-- updated-at triggers, and auto-profile creation.
-- Do not modify migrations 0001–0009.

-- ─── Shared trigger function ──────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- ─── RDA Tutor Session Tables ─────────────────────────────────────────────────

create table if not exists public.rda_tutor_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null,
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

create table if not exists public.rda_tutor_turns (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.rda_tutor_sessions(id) on delete cascade,
  actor text not null,
  turn_type text not null,
  content text not null,
  correctness text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists rda_tutor_sessions_user_idx
  on public.rda_tutor_sessions(user_id, started_at desc);

create index if not exists rda_tutor_turns_session_idx
  on public.rda_tutor_turns(session_id, created_at);

alter table public.rda_tutor_sessions enable row level security;
alter table public.rda_tutor_turns enable row level security;

create policy "rda tutor sessions own access"
  on public.rda_tutor_sessions for select
  using (auth.uid() = user_id or public.is_admin());

create policy "rda tutor sessions own insert"
  on public.rda_tutor_sessions for insert
  with check (auth.uid() = user_id or public.is_admin());

create policy "rda tutor sessions own update"
  on public.rda_tutor_sessions for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

create policy "rda tutor turns own access"
  on public.rda_tutor_turns for select
  using (
    exists (
      select 1 from public.rda_tutor_sessions
      where public.rda_tutor_sessions.id = rda_tutor_turns.session_id
        and (public.rda_tutor_sessions.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "rda tutor turns own insert"
  on public.rda_tutor_turns for insert
  with check (
    exists (
      select 1 from public.rda_tutor_sessions
      where public.rda_tutor_sessions.id = rda_tutor_turns.session_id
        and (public.rda_tutor_sessions.user_id = auth.uid() or public.is_admin())
    )
  );

-- ─── Extend rda_study_sessions ────────────────────────────────────────────────

alter table public.rda_study_sessions
  add column if not exists started_at timestamptz not null default now(),
  add column if not exists ended_at timestamptz,
  add column if not exists active_seconds integer not null default 0;

-- ─── FK Constraints on existing RDA tables ───────────────────────────────────

alter table public.rda_profiles
  add constraint rda_profiles_user_id_fk
  foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.rda_pretest_results
  add constraint rda_pretest_results_user_id_fk
  foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.rda_lesson_progress
  add constraint rda_lesson_progress_user_id_fk
  foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.rda_quiz_attempts
  add constraint rda_quiz_attempts_user_id_fk
  foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.rda_mock_exam_attempts
  add constraint rda_mock_exam_attempts_user_id_fk
  foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.rda_readiness_snapshots
  add constraint rda_readiness_snapshots_user_id_fk
  foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.rda_study_sessions
  add constraint rda_study_sessions_user_id_fk
  foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.rda_admin_notes
  add constraint rda_admin_notes_user_id_fk
  foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.rda_admin_notes
  add constraint rda_admin_notes_admin_user_id_fk
  foreign key (admin_user_id) references public.profiles(id) on delete cascade;

-- ─── RLS Policies for existing tables ────────────────────────────────────────

alter table public.rda_profiles enable row level security;
alter table public.rda_pretest_results enable row level security;
alter table public.rda_lesson_progress enable row level security;
alter table public.rda_quiz_attempts enable row level security;
alter table public.rda_mock_exam_attempts enable row level security;
alter table public.rda_readiness_snapshots enable row level security;
alter table public.rda_study_sessions enable row level security;
alter table public.rda_admin_notes enable row level security;

-- rda_profiles
create policy "rda profiles own access"
  on public.rda_profiles for select
  using (auth.uid() = user_id or public.is_admin());

create policy "rda profiles own insert"
  on public.rda_profiles for insert
  with check (auth.uid() = user_id or public.is_admin());

create policy "rda profiles own update"
  on public.rda_profiles for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- rda_pretest_results
create policy "rda pretest results own access"
  on public.rda_pretest_results for select
  using (auth.uid() = user_id or public.is_admin());

create policy "rda pretest results own insert"
  on public.rda_pretest_results for insert
  with check (auth.uid() = user_id or public.is_admin());

-- rda_lesson_progress
create policy "rda lesson progress own access"
  on public.rda_lesson_progress for select
  using (auth.uid() = user_id or public.is_admin());

create policy "rda lesson progress own insert"
  on public.rda_lesson_progress for insert
  with check (auth.uid() = user_id or public.is_admin());

create policy "rda lesson progress own update"
  on public.rda_lesson_progress for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- rda_quiz_attempts
create policy "rda quiz attempts own access"
  on public.rda_quiz_attempts for select
  using (auth.uid() = user_id or public.is_admin());

create policy "rda quiz attempts own insert"
  on public.rda_quiz_attempts for insert
  with check (auth.uid() = user_id or public.is_admin());

-- rda_mock_exam_attempts
create policy "rda mock exam attempts own access"
  on public.rda_mock_exam_attempts for select
  using (auth.uid() = user_id or public.is_admin());

create policy "rda mock exam attempts own insert"
  on public.rda_mock_exam_attempts for insert
  with check (auth.uid() = user_id or public.is_admin());

-- rda_readiness_snapshots
create policy "rda readiness snapshots own access"
  on public.rda_readiness_snapshots for select
  using (auth.uid() = user_id or public.is_admin());

create policy "rda readiness snapshots own insert"
  on public.rda_readiness_snapshots for insert
  with check (auth.uid() = user_id or public.is_admin());

create policy "rda readiness snapshots own update"
  on public.rda_readiness_snapshots for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- rda_study_sessions
create policy "rda study sessions own access"
  on public.rda_study_sessions for select
  using (auth.uid() = user_id or public.is_admin());

create policy "rda study sessions own insert"
  on public.rda_study_sessions for insert
  with check (auth.uid() = user_id or public.is_admin());

create policy "rda study sessions own update"
  on public.rda_study_sessions for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- rda_admin_notes: students read-only on their own rows; only admins can write
create policy "rda admin notes student read"
  on public.rda_admin_notes for select
  using (auth.uid() = user_id or public.is_admin());

create policy "rda admin notes admin insert"
  on public.rda_admin_notes for insert
  with check (public.is_admin());

create policy "rda admin notes admin update"
  on public.rda_admin_notes for update
  using (public.is_admin())
  with check (public.is_admin());

-- ─── Updated-at Triggers ──────────────────────────────────────────────────────

create or replace trigger rda_profiles_touch_updated_at
  before update on public.rda_profiles
  for each row execute function public.touch_updated_at();

create or replace trigger rda_lesson_progress_touch_updated_at
  before update on public.rda_lesson_progress
  for each row execute function public.touch_updated_at();

-- ─── Auto-create rda_profiles on new RDA profile row ─────────────────────────

create or replace function public.handle_new_rda_profile()
returns trigger language plpgsql security definer as $$
begin
  if new.product = 'rda' then
    insert into public.rda_profiles (user_id, full_name)
    values (new.id, new.full_name)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

create or replace trigger on_rda_profile_created
  after insert on public.profiles
  for each row execute function public.handle_new_rda_profile();
