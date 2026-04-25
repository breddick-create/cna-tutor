-- Extend achievement_definitions with full badge metadata
alter table public.achievement_definitions
  add column if not exists category text not null default 'milestone'
    check (category in ('mastery', 'milestone', 'performance'));

alter table public.achievement_definitions
  add column if not exists icon_slug text not null default 'star';

-- NULL = both products, otherwise scoped to 'cna' or 'ccma'
alter table public.achievement_definitions
  add column if not exists product text
    check (product in ('cna', 'ccma'));

alter table public.achievement_definitions
  add column if not exists domain_slug text;

alter table public.achievement_definitions
  add column if not exists unlock_condition_text text not null default '';

-- Clear old minimal seeds (no students have earned these yet)
delete from public.student_achievements;
delete from public.achievement_definitions;

-- ── CNA Mastery Badges ──────────────────────────────────────────────────────
insert into public.achievement_definitions
  (slug, title, description, criteria_json, category, icon_slug, product, domain_slug, unlock_condition_text)
values
  ('cna_mastery_basic_nursing',    'Basic Nursing Skills Pro',      'Reached 80%+ mastery in Basic Nursing Skills',          '{"type":"domain_mastery","domain_slug":"basic-nursing-skills","threshold":80}',              'mastery',     'shield-medical',    'cna',  'basic-nursing-skills',           'Reach 80% mastery in Basic Nursing Skills'),
  ('cna_mastery_infection_control','Infection Control Pro',         'Reached 80%+ mastery in Infection Control and Safety',  '{"type":"domain_mastery","domain_slug":"infection-control-and-safety","threshold":80}',       'mastery',     'shield-biohazard',  'cna',  'infection-control-and-safety',   'Reach 80% mastery in Infection Control & Safety'),
  ('cna_mastery_patient_rights',   'Patient Rights Expert',         'Reached 80%+ mastery in Patient Rights and Ethics',     '{"type":"domain_mastery","domain_slug":"patient-rights-and-ethics","threshold":80}',          'mastery',     'shield-scale',      'cna',  'patient-rights-and-ethics',      'Reach 80% mastery in Patient Rights & Ethics'),
  ('cna_mastery_communication',    'Communication Specialist',      'Reached 80%+ mastery in Communication Skills',          '{"type":"domain_mastery","domain_slug":"communication-skills","threshold":80}',               'mastery',     'shield-chat',       'cna',  'communication-skills',           'Reach 80% mastery in Communication Skills'),
  ('cna_mastery_mental_health',    'Mental Health Advocate',        'Reached 80%+ mastery in Mental Health and Social Needs','{"type":"domain_mastery","domain_slug":"mental-health-and-social-needs","threshold":80}',     'mastery',     'shield-heart',      'cna',  'mental-health-and-social-needs', 'Reach 80% mastery in Mental Health & Social Needs'),
  ('cna_mastery_personal_care',    'Personal Care Specialist',      'Reached 80%+ mastery in Personal Care and ADLs',        '{"type":"domain_mastery","domain_slug":"personal-care-adls","threshold":80}',                 'mastery',     'shield-care',       'cna',  'personal-care-adls',             'Reach 80% mastery in Personal Care & ADLs'),
  ('cna_mastery_vital_signs',      'Vital Signs Master',            'Reached 80%+ mastery in Vital Signs Basics',            '{"type":"domain_mastery","domain_slug":"vital-signs-basics","threshold":80}',                 'mastery',     'shield-pulse',      'cna',  'vital-signs-basics',             'Reach 80% mastery in Vital Signs Basics'),
  ('cna_mastery_emergency',        'Emergency Response Expert',     'Reached 80%+ mastery in Emergency Procedures',          '{"type":"domain_mastery","domain_slug":"emergency-procedures","threshold":80}',               'mastery',     'shield-alert',      'cna',  'emergency-procedures',           'Reach 80% mastery in Emergency Procedures'),
  ('cna_mastery_documentation',    'Documentation Expert',          'Reached 80%+ mastery in Documentation',                 '{"type":"domain_mastery","domain_slug":"documentation","threshold":80}',                      'mastery',     'shield-document',   'cna',  'documentation',                  'Reach 80% mastery in Documentation'),
  ('cna_mastery_restorative',      'Restorative Care Champion',     'Reached 80%+ mastery in Restorative Care',              '{"type":"domain_mastery","domain_slug":"restorative-care","threshold":80}',                   'mastery',     'shield-restore',    'cna',  'restorative-care',               'Reach 80% mastery in Restorative Care');

-- ── CCMA Mastery Badges ─────────────────────────────────────────────────────
insert into public.achievement_definitions
  (slug, title, description, criteria_json, category, icon_slug, product, domain_slug, unlock_condition_text)
values
  ('ccma_mastery_clinical',        'Clinical Care Pro',              'Reached 80%+ mastery in Clinical Patient Care',           '{"type":"domain_mastery","domain_slug":"clinical-patient-care","threshold":80}',              'mastery', 'shield-medical',   'ccma', 'clinical-patient-care',                   'Reach 80% mastery in Clinical Patient Care'),
  ('ccma_mastery_coordination',    'Care Coordinator',               'Reached 80%+ mastery in Patient Care Coordination',       '{"type":"domain_mastery","domain_slug":"patient-care-coordination-and-education","threshold":80}','mastery','shield-care',     'ccma', 'patient-care-coordination-and-education', 'Reach 80% mastery in Patient Care Coordination'),
  ('ccma_mastery_admin',           'Administrative Expert',          'Reached 80%+ mastery in Administrative Assisting',        '{"type":"domain_mastery","domain_slug":"administrative-assisting","threshold":80}',            'mastery', 'shield-document',  'ccma', 'administrative-assisting',                'Reach 80% mastery in Administrative Assisting'),
  ('ccma_mastery_lab',             'Lab Procedures Pro',             'Reached 80%+ mastery in Laboratory Procedures',           '{"type":"domain_mastery","domain_slug":"laboratory-procedures","threshold":80}',               'mastery', 'shield-lab',       'ccma', 'laboratory-procedures',                   'Reach 80% mastery in Laboratory Procedures'),
  ('ccma_mastery_diagnostic',      'Diagnostics Specialist',         'Reached 80%+ mastery in Diagnostic Testing',              '{"type":"domain_mastery","domain_slug":"diagnostic-testing","threshold":80}',                  'mastery', 'shield-pulse',     'ccma', 'diagnostic-testing',                      'Reach 80% mastery in Diagnostic Testing'),
  ('ccma_mastery_pharmacology',    'Pharmacology Expert',            'Reached 80%+ mastery in Pharmacology',                    '{"type":"domain_mastery","domain_slug":"pharmacology","threshold":80}',                        'mastery', 'shield-biohazard',  'ccma', 'pharmacology',                            'Reach 80% mastery in Pharmacology'),
  ('ccma_mastery_terminology',     'Medical Terminology Master',     'Reached 80%+ mastery in Medical Terminology and Anatomy', '{"type":"domain_mastery","domain_slug":"medical-terminology-and-anatomy","threshold":80}',     'mastery', 'shield-document',  'ccma', 'medical-terminology-and-anatomy',         'Reach 80% mastery in Medical Terminology & Anatomy');

-- ── Milestone Badges (both products) ───────────────────────────────────────
insert into public.achievement_definitions
  (slug, title, description, criteria_json, category, icon_slug, product, unlock_condition_text)
values
  ('first_step',          'First Step',           'Completed the pre-test and started your study journey',              '{"type":"pretest_complete"}',                               'milestone', 'star-first',    null, 'Complete the pre-test'),
  ('on_a_roll',           'On a Roll',            'Studied 3 days in a row',                                            '{"type":"streak","threshold":3}',                           'milestone', 'flame-small',   null, 'Study 3 days in a row'),
  ('unstoppable',         'Unstoppable',          'Studied 7 days in a row',                                            '{"type":"streak","threshold":7}',                           'milestone', 'flame-large',   null, 'Study 7 days in a row'),
  ('comeback_kid',        'Comeback Kid',         'Returned after 5+ days away and completed a full session',           '{"type":"comeback","days_away":5}',                         'milestone', 'arrow-return',  null, 'Come back after 5+ days away and complete a session'),
  ('halfway_there',       'Halfway There',        'Overall readiness score reached 50%',                                '{"type":"readiness","threshold":50}',                       'milestone', 'star-half',     null, 'Reach 50% readiness'),
  ('exam_ready_badge',    'Exam Ready',           'Overall readiness score reached 85% — strong position for the exam', '{"type":"readiness","threshold":85}',                       'milestone', 'trophy',        null, 'Reach 85% readiness'),
  ('mock_exam_champion',  'Mock Exam Champion',   'Scored 80%+ on a full mock exam',                                    '{"type":"mock_exam_score","threshold":80}',                 'milestone', 'trophy-gold',   null, 'Score 80%+ on a full mock exam'),
  ('perfect_session',     'Perfect Session',      'Answered every question correctly in a single lesson session',       '{"type":"session_mastery","threshold":100}',                'milestone', 'check-circle',  null, 'Master every topic in a single session'),
  ('speed_learner',       'Speed Learner',        'Completed a full lesson in under 10 minutes with 90%+ accuracy',     '{"type":"speed_learner","max_seconds":600,"min_score":90}', 'milestone', 'lightning',     null, 'Finish a lesson under 10 min with 90%+ accuracy');

-- ── Performance Badges (both products) ─────────────────────────────────────
insert into public.achievement_definitions
  (slug, title, description, criteria_json, category, icon_slug, product, unlock_condition_text)
values
  ('sharp_mind',   'Sharp Mind',   '10 consecutive correct answers in a single session',                    '{"type":"consecutive_correct","threshold":10}',  'performance', 'lightning-bolt', null, 'Answer 10 questions correctly in a row in one session'),
  ('bounce_back',  'Bounce Back',  'Answered incorrectly then got the next 5 correct in the same session',  '{"type":"bounce_back","correct_streak":5}',      'performance', 'arrow-up',       null, 'Get a wrong answer, then answer the next 5 correctly'),
  ('deep_diver',   'Deep Diver',   'Completed every lesson in a single domain',                             '{"type":"domain_complete"}',                     'performance', 'compass',        null, 'Complete every lesson in any single domain'),
  ('full_send',    'Full Send',    'Completed all lessons across all domains',                               '{"type":"all_lessons_complete"}',                'performance', 'globe',          null, 'Complete every lesson across all domains');
