-- Optional RDA seed scaffold for local development.
-- The TypeScript content bank in content/rda is the source of truth; this file
-- gives operators a stable place to add local cohort/test users without mixing
-- RDA rows into CNA or CCMA tables.

insert into public.rda_profiles (user_id, full_name, language_preference, school_or_program)
select id, full_name, preferred_language, coalesce(cohort, 'Texas RDA Demo Cohort')
from public.profiles
where product = 'rda'
on conflict (user_id) do nothing;
