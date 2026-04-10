# CNA Tutor

Production-oriented MVP foundation for an AI tutoring platform focused on the Texas CNA written exam.

## Stack

- Next.js App Router
- TypeScript
- Supabase Auth + Postgres + RLS
- Tailwind CSS
- OpenAI SDK

## Current MVP Coverage

- Next.js project scaffold
- Supabase SSR auth helpers
- Student and admin route separation
- Sign-in and sign-up flows
- Initial reporting-friendly database schema
- Row Level Security policies
- Student dashboard with guided-study, quiz, mock-exam, and study-plan entry points
- Admin dashboard with participant filters, watch list, trend charts, and CSV export
- Source-grounded teacher knowledge based on the March 2024 Texas CNA curriculum PDF
- Added official and supplemental clinical-skills prep references, including Prometric testing guidance
- Teacher-led tutor sessions with lesson state, remediation, adaptive difficulty, and weak-area recommendations
- Targeted quizzes and a mock-exam workflow with scoring, answer review, and mastery updates
- Study-plan view that turns weak areas and goal hours into a realistic weekly sequence
- Interaction-based tracking for lessons plus scored assessments that feed reporting tables

## Prerequisites

1. Install Node.js 20 or newer.
2. Create a Supabase project.
3. Copy `.env.example` to `.env.local`.
4. Fill in your Supabase and OpenAI keys.

## Local Setup

```bash
npm install
npm run dev
```

## Supabase Setup

1. Open your Supabase SQL editor.
2. Run [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql).
3. Run [`supabase/migrations/0002_tutor_session_state.sql`](./supabase/migrations/0002_tutor_session_state.sql).
4. Create your first account through the app.
5. Promote yourself to admin in Supabase:

```sql
update public.profiles
set role = 'admin'
where email = 'you@example.com';
```

## Environment Variables

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

## Key Routes

- `/dashboard` - learner overview
- `/study` - teacher-led lessons and weak-area review
- `/study-plan` - generated weekly plan
- `/quiz` - domain-based quiz mode
- `/mock-exam` - broader practice exam
- `/admin` - reporting dashboard
- `/api/reports/participants.csv` - CSV export for admin filters

## Source Grounding

The tutor knowledge scaffold now includes a structured representation of the official Texas CNA curriculum source:

- [content/texas-cna/teacher-knowledge.ts](./content/texas-cna/teacher-knowledge.ts)
- [lib/tutor/prompts.ts](./lib/tutor/prompts.ts)

This content is grounded in the March 2024 Texas curriculum PDF you provided:

- `C:/Users/BillyReddick/Downloads/cna.pdf`

## Notes

- The app currently uses local curriculum content and a local exam bank for the MVP.
- If you are preparing this for production deployment, install current patched `next` and `react` versions before shipping.
