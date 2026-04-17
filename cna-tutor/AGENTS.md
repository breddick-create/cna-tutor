# CNA Tutor Agent Guide

## Product Overview

CNA Tutor is a guided exam-readiness app for students preparing for the Texas CNA exam.

This is not a generic e-learning app.
This is not a generic SaaS dashboard.
The product should feel like a structured, supportive system that helps students become exam-ready.

## Primary Users

### Student
- A CNA student who may feel anxious about passing
- May be unsure what to study next
- Needs structure, clarity, and encouragement
- Benefits from step-by-step guidance

### Program Staff
- Need visibility into progress, weak areas, engagement, and readiness
- Need to spot stalled or at-risk students early
- Need a clean oversight view, not vanity analytics

## Student Journey

The core student flow is:
1. Sign up
2. Complete pre-test
3. Review results
4. Follow a personalized study plan
5. Complete guided study and practice
6. Take practice exams
7. Reach readiness threshold
8. Become exam-ready

## Voice and Tone Rules

Write student-facing copy like this:
- plain language
- short sentences
- direct wording
- supportive and calm
- practical and confident
- student-centered

Avoid:
- robotic wording
- technical system language
- corporate or generic SaaS phrases
- stiff academic tone

Prefer language like:
- Here's what to focus on next
- Pick up where you left off
- You're making progress
- Needs more practice
- Start your pre-test
- Continue your study plan
- Take a practice quiz
- Take a practice exam

## UX Rules

- Every major student screen must answer:
  1. What is this?
  2. Why does it matter?
  3. What should the student do next?
- Every major page should have one obvious primary action.
- Students should not have to guess what to do next.
- Readiness should matter more than raw activity.
- Weak areas should drive the study plan.
- Dashboard should be readiness-first, not activity-first.
- Empty states must explain what the section is, why it matters, and what to do next.
- Error states must sound human and suggest the next step.
- Student experience should feel calm, clear, trustworthy, and structured.

## Business Rules

- New students should go to the pre-test intro after sign up.
- Pre-test is required before the student can meaningfully use the study system.
- Pre-test results create the initial study plan.
- Module completion alone does not equal readiness.
- Practice exams should carry more weight than short quizzes.
- Recent poor performance should reduce readiness.
- Consistent improvement should count positively.
- Students should not be marked exam-ready too early.
- Student and staff experiences should stay clearly separated.

## Readiness Model Guidance

The readiness system should support:
- category mastery
- overall readiness score
- readiness label
- top weak areas
- recommended next step

Use these readiness labels consistently:
- Not Ready
- Making Progress
- Almost There
- Exam Ready

General guidance:
- pre-test is baseline only
- quizzes have moderate weight
- practice exams have high weight
- consistency matters
- recency matters
- repeated poor performance should not inflate readiness

## Engineering Rules

Before making changes:
1. Inspect the current implementation
2. Identify relevant files
3. Summarize current behavior
4. Explain likely impact
5. Then implement

After making changes:
1. List exact files changed
2. Explain why each file changed
3. Identify manual test cases
4. Mention possible regressions

Additional rules:
- Preserve working auth and routing unless the task requires changes
- Reuse existing components and business logic when sensible
- Keep business rules centralized where possible
- Prefer pure functions for scoring and readiness logic

## UI Rules

- Keep layouts clean, modern, and uncluttered
- Use strong hierarchy
- Prefer card-based sections where helpful
- Keep screens mobile responsive
- Avoid decorative filler
- CTA labels must be specific
- Put the main outcome first, the next step second, and supporting detail after that

## Code Quality Rules

- Keep components small and readable
- Use clear names
- Reduce duplication
- Avoid shallow one-off abstractions
- Keep data shaping out of presentation components when possible
- Preserve behavior unless the task explicitly changes it
- Write code that is easy to test and reason about

## Preferred Terms

Use these terms consistently in student-facing UI:
- pre-test
- study plan
- weak areas
- practice quiz
- practice exam
- readiness
- next step
- exam-ready

Avoid inconsistent naming like:
- assessment / diagnostic / evaluation
- quiz / test / module check
- dashboard / analytics portal

Pick one term and stay consistent.
