create table public.ccma_profiles (
  like public.profiles including all
);

create table public.ccma_domains (
  like public.domains including all
);

create table public.ccma_lessons (
  like public.lessons including all
);

alter table public.ccma_lessons
  drop constraint if exists lessons_domain_id_fkey,
  drop constraint if exists ccma_lessons_domain_id_fkey,
  add constraint ccma_lessons_domain_id_fkey
    foreign key (domain_id) references public.ccma_domains(id) on delete cascade;

create table public.ccma_question_bank (
  like public.question_bank including all
);

alter table public.ccma_question_bank
  drop constraint if exists question_bank_domain_id_fkey,
  drop constraint if exists question_bank_lessons_id_fkey,
  drop constraint if exists question_bank_lesson_id_fkey,
  drop constraint if exists ccma_question_bank_domain_id_fkey,
  drop constraint if exists ccma_question_bank_lesson_id_fkey,
  add constraint ccma_question_bank_domain_id_fkey
    foreign key (domain_id) references public.ccma_domains(id) on delete cascade,
  add constraint ccma_question_bank_lesson_id_fkey
    foreign key (lesson_id) references public.ccma_lessons(id) on delete set null;

create table public.ccma_tutor_sessions (
  like public.tutor_sessions including all
);

alter table public.ccma_tutor_sessions
  drop constraint if exists tutor_sessions_user_id_fkey,
  drop constraint if exists tutor_sessions_domain_id_fkey,
  drop constraint if exists tutor_sessions_lesson_id_fkey,
  drop constraint if exists ccma_tutor_sessions_user_id_fkey,
  drop constraint if exists ccma_tutor_sessions_domain_id_fkey,
  drop constraint if exists ccma_tutor_sessions_lesson_id_fkey,
  add constraint ccma_tutor_sessions_user_id_fkey
    foreign key (user_id) references public.ccma_profiles(id) on delete cascade,
  add constraint ccma_tutor_sessions_domain_id_fkey
    foreign key (domain_id) references public.ccma_domains(id) on delete set null,
  add constraint ccma_tutor_sessions_lesson_id_fkey
    foreign key (lesson_id) references public.ccma_lessons(id) on delete set null;

create table public.ccma_tutor_turns (
  like public.tutor_turns including all
);

alter table public.ccma_tutor_turns
  drop constraint if exists tutor_turns_session_id_fkey,
  drop constraint if exists ccma_tutor_turns_session_id_fkey,
  add constraint ccma_tutor_turns_session_id_fkey
    foreign key (session_id) references public.ccma_tutor_sessions(id) on delete cascade;

create table public.ccma_activity_events (
  like public.activity_events including all
);

alter table public.ccma_activity_events
  drop constraint if exists activity_events_user_id_fkey,
  drop constraint if exists activity_events_session_id_fkey,
  drop constraint if exists ccma_activity_events_user_id_fkey,
  drop constraint if exists ccma_activity_events_session_id_fkey,
  add constraint ccma_activity_events_user_id_fkey
    foreign key (user_id) references public.ccma_profiles(id) on delete cascade,
  add constraint ccma_activity_events_session_id_fkey
    foreign key (session_id) references public.ccma_tutor_sessions(id) on delete set null;

create table public.ccma_quiz_attempts (
  like public.quiz_attempts including all
);

alter table public.ccma_quiz_attempts
  drop constraint if exists quiz_attempts_user_id_fkey,
  drop constraint if exists quiz_attempts_lesson_id_fkey,
  drop constraint if exists quiz_attempts_domain_id_fkey,
  drop constraint if exists ccma_quiz_attempts_user_id_fkey,
  drop constraint if exists ccma_quiz_attempts_lesson_id_fkey,
  drop constraint if exists ccma_quiz_attempts_domain_id_fkey,
  add constraint ccma_quiz_attempts_user_id_fkey
    foreign key (user_id) references public.ccma_profiles(id) on delete cascade,
  add constraint ccma_quiz_attempts_lesson_id_fkey
    foreign key (lesson_id) references public.ccma_lessons(id) on delete set null,
  add constraint ccma_quiz_attempts_domain_id_fkey
    foreign key (domain_id) references public.ccma_domains(id) on delete set null;

create table public.ccma_mock_exam_attempts (
  like public.mock_exam_attempts including all
);

alter table public.ccma_mock_exam_attempts
  drop constraint if exists mock_exam_attempts_user_id_fkey,
  drop constraint if exists ccma_mock_exam_attempts_user_id_fkey,
  add constraint ccma_mock_exam_attempts_user_id_fkey
    foreign key (user_id) references public.ccma_profiles(id) on delete cascade;

create table public.ccma_domain_mastery (
  like public.domain_mastery including all
);

alter table public.ccma_domain_mastery
  drop constraint if exists domain_mastery_user_id_fkey,
  drop constraint if exists domain_mastery_domain_id_fkey,
  drop constraint if exists domain_mastery_user_id_domain_id_key,
  drop constraint if exists ccma_domain_mastery_user_id_fkey,
  drop constraint if exists ccma_domain_mastery_domain_id_fkey,
  drop constraint if exists ccma_domain_mastery_user_id_domain_id_key,
  add constraint ccma_domain_mastery_user_id_fkey
    foreign key (user_id) references public.ccma_profiles(id) on delete cascade,
  add constraint ccma_domain_mastery_domain_id_fkey
    foreign key (domain_id) references public.ccma_domains(id) on delete cascade,
  add constraint ccma_domain_mastery_user_id_domain_id_key
    unique (user_id, domain_id);

create table public.ccma_daily_user_stats (
  like public.daily_user_stats including all
);

alter table public.ccma_daily_user_stats
  drop constraint if exists daily_user_stats_user_id_fkey,
  drop constraint if exists ccma_daily_user_stats_user_id_fkey,
  add constraint ccma_daily_user_stats_user_id_fkey
    foreign key (user_id) references public.ccma_profiles(id) on delete cascade;

create index if not exists ccma_profiles_role_idx on public.ccma_profiles(role);
create index if not exists ccma_profiles_cohort_idx on public.ccma_profiles(cohort);
create index if not exists ccma_profiles_last_activity_idx on public.ccma_profiles(last_activity_at desc);
create index if not exists ccma_lessons_domain_idx on public.ccma_lessons(domain_id);
create index if not exists ccma_question_bank_domain_idx on public.ccma_question_bank(domain_id);
create index if not exists ccma_tutor_sessions_user_idx on public.ccma_tutor_sessions(user_id, started_at desc);
create index if not exists ccma_tutor_turns_session_idx on public.ccma_tutor_turns(session_id, created_at);
create index if not exists ccma_activity_events_user_idx on public.ccma_activity_events(user_id, occurred_at desc);
create index if not exists ccma_quiz_attempts_user_idx on public.ccma_quiz_attempts(user_id, created_at desc);
create index if not exists ccma_mock_exam_attempts_user_idx on public.ccma_mock_exam_attempts(user_id, created_at desc);
create index if not exists ccma_domain_mastery_user_idx on public.ccma_domain_mastery(user_id, mastery_score);
create index if not exists ccma_daily_user_stats_date_idx on public.ccma_daily_user_stats(date desc);

create trigger ccma_profiles_updated_at
before update on public.ccma_profiles
for each row execute procedure public.touch_updated_at();

create trigger ccma_lessons_updated_at
before update on public.ccma_lessons
for each row execute procedure public.touch_updated_at();

create trigger ccma_tutor_sessions_updated_at
before update on public.ccma_tutor_sessions
for each row execute procedure public.touch_updated_at();

create trigger ccma_domain_mastery_updated_at
before update on public.ccma_domain_mastery
for each row execute procedure public.touch_updated_at();

create trigger ccma_daily_user_stats_updated_at
before update on public.ccma_daily_user_stats
for each row execute procedure public.touch_updated_at();

create or replace function public.handle_new_ccma_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.ccma_profiles (id, role, full_name, email, cohort)
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

create trigger on_auth_user_created_ccma
after insert on auth.users
for each row execute procedure public.handle_new_ccma_user();

create or replace function public.is_ccma_admin(check_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.ccma_profiles
    where id = check_user_id
      and role = 'admin'
  );
$$;

alter table public.ccma_profiles enable row level security;
alter table public.ccma_domains enable row level security;
alter table public.ccma_lessons enable row level security;
alter table public.ccma_question_bank enable row level security;
alter table public.ccma_tutor_sessions enable row level security;
alter table public.ccma_tutor_turns enable row level security;
alter table public.ccma_activity_events enable row level security;
alter table public.ccma_quiz_attempts enable row level security;
alter table public.ccma_mock_exam_attempts enable row level security;
alter table public.ccma_domain_mastery enable row level security;
alter table public.ccma_daily_user_stats enable row level security;

create policy "ccma profiles own read"
on public.ccma_profiles
for select
using (auth.uid() = id or public.is_ccma_admin());

create policy "ccma profiles own update"
on public.ccma_profiles
for update
using (auth.uid() = id or public.is_ccma_admin())
with check (auth.uid() = id or public.is_ccma_admin());

create policy "ccma domains authenticated read"
on public.ccma_domains
for select
using (auth.role() = 'authenticated');

create policy "ccma domains admin manage"
on public.ccma_domains
for all
using (public.is_ccma_admin())
with check (public.is_ccma_admin());

create policy "ccma lessons authenticated read"
on public.ccma_lessons
for select
using (auth.role() = 'authenticated');

create policy "ccma lessons admin manage"
on public.ccma_lessons
for all
using (public.is_ccma_admin())
with check (public.is_ccma_admin());

create policy "ccma question bank authenticated read"
on public.ccma_question_bank
for select
using (auth.role() = 'authenticated');

create policy "ccma question bank admin manage"
on public.ccma_question_bank
for all
using (public.is_ccma_admin())
with check (public.is_ccma_admin());

create policy "ccma tutor sessions own access"
on public.ccma_tutor_sessions
for select
using (auth.uid() = user_id or public.is_ccma_admin());

create policy "ccma tutor sessions own insert"
on public.ccma_tutor_sessions
for insert
with check (auth.uid() = user_id or public.is_ccma_admin());

create policy "ccma tutor sessions own update"
on public.ccma_tutor_sessions
for update
using (auth.uid() = user_id or public.is_ccma_admin())
with check (auth.uid() = user_id or public.is_ccma_admin());

create policy "ccma tutor turns own access"
on public.ccma_tutor_turns
for select
using (
  exists (
    select 1
    from public.ccma_tutor_sessions
    where public.ccma_tutor_sessions.id = ccma_tutor_turns.session_id
      and (public.ccma_tutor_sessions.user_id = auth.uid() or public.is_ccma_admin())
  )
);

create policy "ccma tutor turns own insert"
on public.ccma_tutor_turns
for insert
with check (
  exists (
    select 1
    from public.ccma_tutor_sessions
    where public.ccma_tutor_sessions.id = ccma_tutor_turns.session_id
      and (public.ccma_tutor_sessions.user_id = auth.uid() or public.is_ccma_admin())
  )
);

create policy "ccma activity events own access"
on public.ccma_activity_events
for select
using (auth.uid() = user_id or public.is_ccma_admin());

create policy "ccma activity events own insert"
on public.ccma_activity_events
for insert
with check (auth.uid() = user_id or public.is_ccma_admin());

create policy "ccma quiz attempts own access"
on public.ccma_quiz_attempts
for select
using (auth.uid() = user_id or public.is_ccma_admin());

create policy "ccma quiz attempts own insert"
on public.ccma_quiz_attempts
for insert
with check (auth.uid() = user_id or public.is_ccma_admin());

create policy "ccma quiz attempts own update"
on public.ccma_quiz_attempts
for update
using (auth.uid() = user_id or public.is_ccma_admin())
with check (auth.uid() = user_id or public.is_ccma_admin());

create policy "ccma mock exams own access"
on public.ccma_mock_exam_attempts
for select
using (auth.uid() = user_id or public.is_ccma_admin());

create policy "ccma mock exams own insert"
on public.ccma_mock_exam_attempts
for insert
with check (auth.uid() = user_id or public.is_ccma_admin());

create policy "ccma mock exams own update"
on public.ccma_mock_exam_attempts
for update
using (auth.uid() = user_id or public.is_ccma_admin())
with check (auth.uid() = user_id or public.is_ccma_admin());

create policy "ccma domain mastery own access"
on public.ccma_domain_mastery
for select
using (auth.uid() = user_id or public.is_ccma_admin());

create policy "ccma domain mastery own insert"
on public.ccma_domain_mastery
for insert
with check (auth.uid() = user_id or public.is_ccma_admin());

create policy "ccma domain mastery own update"
on public.ccma_domain_mastery
for update
using (auth.uid() = user_id or public.is_ccma_admin())
with check (auth.uid() = user_id or public.is_ccma_admin());

create policy "ccma daily stats own access"
on public.ccma_daily_user_stats
for select
using (auth.uid() = user_id or public.is_ccma_admin());

create policy "ccma daily stats own insert"
on public.ccma_daily_user_stats
for insert
with check (auth.uid() = user_id or public.is_ccma_admin());

create policy "ccma daily stats own update"
on public.ccma_daily_user_stats
for update
using (auth.uid() = user_id or public.is_ccma_admin())
with check (auth.uid() = user_id or public.is_ccma_admin());
