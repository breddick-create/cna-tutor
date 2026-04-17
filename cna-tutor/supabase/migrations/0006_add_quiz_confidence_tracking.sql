alter table public.quiz_attempts
  add column if not exists confidence_level text,
  add column if not exists confidence_score integer;

alter table public.quiz_attempts
  add constraint quiz_attempts_confidence_level_check
    check (
      confidence_level is null
      or confidence_level in ('not_confident', 'somewhat_confident', 'very_confident')
    );

alter table public.quiz_attempts
  add constraint quiz_attempts_confidence_score_check
    check (
      confidence_score is null
      or confidence_score in (1, 2, 3)
    );
