-- Add Bloom's taxonomy level and concept tracking to tutor_turns
alter table public.tutor_turns
  add column if not exists bloom_level integer
    check (bloom_level between 1 and 6);

-- Segment ID from LessonSegment that this turn relates to
alter table public.tutor_turns
  add column if not exists segment_id text;

-- Change in concept mastery score this turn produced (can be negative)
alter table public.tutor_turns
  add column if not exists mastery_delta numeric(5,4);
