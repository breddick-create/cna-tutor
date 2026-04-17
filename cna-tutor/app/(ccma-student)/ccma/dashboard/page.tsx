import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { updateCcmaLanguagePreferenceAction } from "@/app/ccma/actions";
import { SubmitButton } from "@/components/auth/submit-button";
import { ProgressBar } from "@/components/dashboard/progress-bar";
import { TrendLine } from "@/components/dashboard/trend-line";
import { CcmaReadinessChecklist } from "@/components/ccma/readiness-checklist";
import { StudentEmptyState } from "@/components/student/student-empty-state";
import { requireCcmaViewer } from "@/lib/ccma/auth/session";
import { formatConfidenceScore } from "@/lib/ccma/confidence";
import { getCcmaStudentDashboard } from "@/lib/ccma/dashboard/student";
import {
  getLanguageLabel,
  LANGUAGE_OPTIONS,
  pickLocalizedText,
  resolvePreferredLanguage,
} from "@/lib/ccma/i18n/languages";
import {
  getPretestDomainBreakdown,
  getPretestScore,
  hasCompletedPretest,
} from "@/lib/ccma/onboarding/pretest";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const readinessToneStyles = {
  "Not Ready": "bg-[rgba(166,60,47,0.12)] text-[color:var(--danger)]",
  "Making Progress": "bg-[rgba(255,185,0,0.16)] text-[color:#7a5700]",
  "Almost There": "bg-[rgba(23,60,255,0.12)] text-[color:var(--brand-strong)]",
  "Exam Ready": "bg-[rgba(28,124,104,0.14)] text-[color:#145f50]",
} as const;

const trendStyles = {
  up: "bg-[rgba(23,60,255,0.12)] text-[color:var(--brand-strong)]",
  down: "bg-[rgba(166,60,47,0.12)] text-[color:var(--danger)]",
  steady: "bg-[rgba(123,144,158,0.14)] text-[color:var(--foreground)]",
} as const;

function DashboardSection({
  eyebrow,
  title,
  description,
  action,
  children,
  strong = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  strong?: boolean;
}) {
  return (
    <section className={`${strong ? "panel-strong" : "panel"} min-w-0 rounded-[1.75rem] p-5 sm:p-6`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-3 text-xl font-semibold sm:text-2xl">{title}</h2>
          {description ? <p className="text-muted mt-3 leading-7">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  helper,
  note,
}: {
  label: string;
  value: string;
  helper?: string;
  note?: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {helper ? <p className="text-muted mt-2 text-sm leading-6">{helper}</p> : null}
      {note ? (
        <p className="mt-2 text-sm leading-6 text-[color:var(--brand-strong)]">{note}</p>
      ) : null}
    </div>
  );
}

function PracticeExamRequirementItem({
  complete,
  label,
}: {
  complete: boolean;
  label: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
        complete
          ? "border-[rgba(28,124,104,0.28)] bg-[rgba(231,248,243,0.92)]"
          : "border-[var(--border)] bg-white/80"
      }`}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
          complete
            ? "bg-[rgba(28,124,104,0.18)] text-[color:#145f50]"
            : "bg-[rgba(123,144,158,0.14)] text-[color:var(--foreground)]"
        }`}
      >
        {complete ? "✓" : "•"}
      </span>
      <p className="text-sm leading-6">{label}</p>
    </div>
  );
}

function PracticeExamUnlockBlock({
  lessonsCompleted,
  lessonsRequired,
  qualifyingQuizCount,
  qualifyingQuizRequired,
  unlocked,
}: {
  lessonsCompleted: number;
  lessonsRequired: number;
  qualifyingQuizCount: number;
  qualifyingQuizRequired: number;
  unlocked: boolean;
}) {
  const lessonComplete = lessonsCompleted >= lessonsRequired;
  const quizComplete = qualifyingQuizCount >= qualifyingQuizRequired;

  return (
    <div
      className={`mt-5 rounded-[1.5rem] border p-4 transition-all duration-500 ${
        unlocked
          ? "border-[rgba(28,124,104,0.34)] bg-[linear-gradient(135deg,rgba(231,248,243,0.96),rgba(244,252,249,0.96))] shadow-[0_18px_36px_rgba(28,124,104,0.14)]"
          : "border-[rgba(217,111,50,0.18)] bg-[rgba(255,249,243,0.92)]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">
            {unlocked ? "Full practice exam unlocked" : "Unlock requirements"}
          </p>
          <p className="mt-2 text-sm leading-6">
            To unlock the full practice exam, complete: (1) at least 2 guided lessons, (2) at least 1 quiz with a score of 60% or higher.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
            unlocked
              ? "bg-[rgba(28,124,104,0.18)] text-[color:#145f50]"
              : "bg-[rgba(217,111,50,0.16)] text-[color:#9a4f17]"
          }`}
        >
          {lessonComplete && quizComplete ? "Ready" : "In progress"}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <PracticeExamRequirementItem
          complete={lessonComplete}
          label={`Guided lessons: ${Math.min(lessonsCompleted, lessonsRequired)}/${lessonsRequired} completed`}
        />
        <PracticeExamRequirementItem
          complete={quizComplete}
          label={`Qualifying quizzes (60%+): ${Math.min(qualifyingQuizCount, qualifyingQuizRequired)}/${qualifyingQuizRequired} completed`}
        />
      </div>
    </div>
  );
}

function getWeakAreaLabel(index: number) {
  if (index === 0) {
    return "Needs more practice";
  }

  if (index === 1) {
    return "Focus here next";
  }

  return "Keep working here";
}

function getReadinessSupportMessage(label: keyof typeof readinessToneStyles) {
  switch (label) {
    case "Not Ready":
      return "Start with the weakest topics first. That's the fastest way to build a stronger foundation.";
    case "Making Progress":
      return "You're moving in the right direction. Keep following the plan in order so your scores keep rising.";
    case "Almost There":
      return "You're getting close. A few focused study blocks can move you from close to ready.";
    case "Exam Ready":
      return "You're in a strong place. Keep your weak spots steady so your readiness holds.";
    default:
      return "";
  }
}

function formatReadinessDelta(current: number, baseline: number | null) {
  if (baseline === null) {
    return {
      value: "Not enough baseline data yet",
      note: undefined,
    };
  }

  const delta = current - baseline;

  if (delta > 0) {
    return {
      value: `Up ${delta} points since your pre-test`,
      note: undefined,
    };
  }

  if (delta < 0) {
    return {
      value: "Still building - your study work will move this score.",
      note: "Early study sessions sometimes dip the score before they raise it. Keep going.",
    };
  }

  return {
    value: "Holding steady since your pre-test",
    note: undefined,
  };
}

export default async function StudentDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const viewer = await requireCcmaViewer();

  if (!hasCompletedPretest(viewer.user)) {
    redirect("/ccma/pretest");
  }

  const params = await searchParams;
  const message = typeof params.message === "string" ? decodeURIComponent(params.message) : null;
  const preferredLanguage = resolvePreferredLanguage(viewer.profile.preferred_language);
  const text = (en: string, es: string) => pickLocalizedText(preferredLanguage, { en, es });
  const pretestScore = getPretestScore(viewer.user);
  const pretestDomainBreakdown = getPretestDomainBreakdown(viewer.user);
  const dashboard = await getCcmaStudentDashboard({
    userId: viewer.user.id,
    pretestScore,
    pretestDomainBreakdown,
  });

  const readinessLabel =
    dashboard.progression.readinessLabel as keyof typeof readinessToneStyles;
  const readinessTone = readinessToneStyles[readinessLabel];
  const readinessSupport = getReadinessSupportMessage(readinessLabel);
  const topWeakAreas = dashboard.weakAreas.slice(0, 3);
  const latestQuiz = dashboard.practicePerformance.recentScores[0] ?? null;
  const confidenceSeries = dashboard.practicePerformance.recentScores
    .map((attempt: any) => attempt.confidenceScore)
    .filter((value: any): value is number => typeof value === "number")
    .reverse();
  const scoreSeries = dashboard.practicePerformance.recentScores
    .map((attempt: any) => attempt.score)
    .reverse();
  const readinessDeltaLabel = formatReadinessDelta(
    dashboard.progression.readinessScore,
    dashboard.progression.signals.pretestScore,
  );

  return (
    <div className="space-y-6">
      {message ? (
        <section className="rounded-2xl border border-[var(--border)] bg-white/85 px-5 py-4 text-sm shadow-sm">
          {message}
        </section>
      ) : null}

      {dashboard.isInactive ? (
        <section className="panel rounded-[1.75rem] border border-[rgba(217,111,50,0.28)] bg-[rgba(255,244,234,0.92)] p-5 sm:p-6">
          <p className="eyebrow text-[color:#9a4f17]">Welcome Back</p>
          <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <h2 className="text-xl font-semibold sm:text-2xl">It&apos;s been a few days.</h2>
              <p className="mt-3 text-sm leading-7 text-[color:#5f3a1a]">
                It&apos;s been a few days — your study plan is still here and your progress is
                saved. Pick up where you left off.
              </p>
            </div>
            <Link className="button-primary w-full sm:w-auto" href={dashboard.nextStep.ctaHref}>
              {dashboard.nextStep.ctaLabel}
            </Link>
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="panel-strong order-1 min-w-0 rounded-[1.9rem] border-l-[6px] border-l-[var(--accent)] bg-[linear-gradient(135deg,rgba(255,244,234,0.98),rgba(255,252,247,0.98))] p-5 shadow-[0_24px_50px_rgba(217,111,50,0.16)] sm:p-6 xl:order-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="eyebrow text-[color:#9a4f17]">{text("Your Next Step", "Tu siguiente paso")}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                {dashboard.nextStep.title}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[color:#5f3a1a]">
                {dashboard.recoveryPlan.active
                  ? `${dashboard.recoveryPlan.summary} ${dashboard.recoveryPlan.encouragement}`
                  : dashboard.nextStep.description}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-[rgba(217,111,50,0.18)] bg-white/80 p-5">
            <p className="text-sm font-semibold text-[color:#9a4f17]">
              {dashboard.recoveryPlan.active
                ? text("Why this matters right now", "Por que esto importa ahora")
                : text("Why this comes first", "Por que esto va primero")}
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:#5f3a1a]">
              {dashboard.recoveryPlan.active
                ? text(
                    "The app is narrowing your focus so you can rebuild momentum instead of spreading your effort around.",
                    "La app esta reduciendo tu enfoque para que recuperes impulso en lugar de dispersar tu esfuerzo.",
                  )
                : text(
                    "This step comes first because it is the clearest way to raise readiness based on your weak areas, lesson progress, and recent scores.",
                    "Este paso va primero porque es la forma mas clara de subir tu preparacion segun tus areas debiles, el progreso de tus lecciones y tus puntajes recientes.",
                  )}
            </p>
          </div>

          <p className="mt-4 text-sm font-medium leading-6 text-[color:#7f4217]">
            {text("Do this before anything else on the page.", "Haz esto antes que cualquier otra cosa en la pagina.")}
          </p>

          <div className="mt-6">
            <Link className="button-primary w-full sm:w-auto" href={dashboard.nextStep.ctaHref}>
              {dashboard.nextStep.ctaLabel}
            </Link>
          </div>
        </section>

        <DashboardSection
          strong
          description={text(
            "Start here after your next step. This shows how close you are to exam-ready right now.",
            "Empieza aqui despues de tu siguiente paso. Esto muestra que tan cerca estas de estar listo para el examen en este momento.",
          )}
          eyebrow={text("Readiness", "Preparacion")}
          title={text("Your readiness score", "Tu puntaje de preparacion")}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-5xl font-semibold">{dashboard.progression.readinessScore}%</p>
              <p className="mt-2 text-lg font-semibold">{dashboard.progression.readinessLabel}</p>
            </div>
            <span
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${readinessTone}`}
            >
              {dashboard.progression.readinessLabel}
            </span>
          </div>

          <div className="mt-5">
            <ProgressBar value={dashboard.progression.readinessScore} />
          </div>

          <p className="mt-4 text-sm font-semibold leading-6">{dashboard.progression.summary}</p>
          <p className="mt-4 text-sm font-medium leading-6">{readinessSupport}</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <MetricCard
              helper={text("Your starting point", "Tu punto de partida")}
              label={text("Pre-test", "Preevaluacion")}
              value={`${dashboard.progression.signals.pretestScore ?? 0}%`}
            />
            <MetricCard
              helper={text("Progress over time", "Progreso con el tiempo")}
              label={text("Since pre-test", "Desde la preevaluacion")}
              note={readinessDeltaLabel.note}
              value={readinessDeltaLabel.value}
            />
            <MetricCard
              helper={text("Your strongest long practice check", "Tu mejor verificacion larga de practica")}
              label={text("Best full practice exam", "Mejor examen completo de practica")}
              value={
                dashboard.practiceExamStatus.bestScore !== null
                  ? `${dashboard.practiceExamStatus.bestScore}%`
                  : text("Not yet", "Todavia no")
              }
            />
          </div>
        </DashboardSection>

      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardSection
          description="These are the exact topics the app wants you to improve before you move deeper into practice."
          eyebrow="Needs More Practice"
          title="Focus on these topics next"
        >
          {topWeakAreas.length ? (
            <div className="space-y-4">
              {topWeakAreas.map((area: any, index: number) => (
                <article
                  key={`${area.domainId}-${area.domainSlug}`}
                  className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {area.lessonTitle ?? area.title}
                      </p>
                      <p className="text-muted mt-1 text-sm">
                        Weak area: {area.title}. {getWeakAreaLabel(index)}.
                      </p>
                    </div>
                    <span className="rounded-full bg-[rgba(166,60,47,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--danger)]">
                      {area.masteryScore}%
                    </span>
                  </div>
                  <div className="mt-4">
                    <ProgressBar value={area.masteryScore} />
                  </div>
                  <p className="mt-3 text-sm leading-6">{area.recommendation}</p>
                </article>
              ))}
            </div>
          ) : (
            <StudentEmptyState
              compact
              description="You do not have any urgent weak areas showing right now. Keep checking your understanding with quizzes and full practice exams so it stays that way."
              eyebrow="Needs More Practice"
              primaryAction={{
                href: "/ccma/quiz",
                label: "Take practice quiz",
              }}
              secondaryAction={{
                href: "/ccma/mock-exam",
                label: "Open practice exam",
              }}
              title="Your biggest weak spots are under control."
            />
          )}
        </DashboardSection>

        <DashboardSection
          description="This shows whether your work is changing the score over time, not just where it stands today."
          eyebrow="Progress Over Time"
          title="See how your work is changing readiness"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard
              label="Lessons completed"
              value={dashboard.studyPlanProgress.completedModules.toString()}
            />
            <MetricCard
              label="Study plan complete"
              value={`${dashboard.studyPlanProgress.percentComplete}%`}
            />
            <MetricCard
              label="Weak areas improved"
              value={dashboard.studyPlanProgress.improvedAreasCount.toString()}
            />
          </div>

          <div className="mt-5">
            <ProgressBar value={dashboard.studyPlanProgress.percentComplete} />
          </div>

          <p className="mt-3 text-sm leading-6">
            {dashboard.studyPlanProgress.completedModules > 0
              ? `${dashboard.studyPlanProgress.completedModules} lesson${dashboard.studyPlanProgress.completedModules === 1 ? "" : "s"} done, ${dashboard.studyPlanProgress.remainingModules} left in the guided path.`
              : "You haven't started the guided path yet. Your first lesson will give you the clearest place to begin."}
          </p>
          <p className="text-muted mt-2 text-sm leading-6">{dashboard.studyPlanProgress.encouragement}</p>

          <div className="mt-5 space-y-3">
            {dashboard.studyPlanProgress.improvementHighlights.length ? (
              dashboard.studyPlanProgress.improvementHighlights.map((highlight: any) => (
                <article
                  key={highlight.domainSlug}
                  className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4"
                >
                  <p className="text-sm font-semibold">Improvement over time</p>
                  <p className="mt-2 text-sm leading-6">{highlight.message}</p>
                </article>
              ))
            ) : (
              <StudentEmptyState
                compact
                description="Once a weaker topic rises clearly above where you started, that improvement will show here."
                eyebrow="Progress"
                primaryAction={{
                  href: "/ccma/study-plan",
                  label: "Start next lesson",
                }}
                secondaryAction={{
                  href: "/ccma/quiz",
                  label: "Take practice quiz",
                }}
                title="Your improvement will show here as you keep going."
              />
            )}
          </div>
        </DashboardSection>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardSection
          description="These milestones turn the readiness score into a concrete checklist so you can see what still needs to be true before the app should call you exam-ready."
          eyebrow="Readiness Checklist"
          title="What still needs to happen before exam-ready"
        >
          <CcmaReadinessChecklist items={dashboard.progression.readinessChecklist} />
        </DashboardSection>

        <DashboardSection
          description="Use one rapid 10-question drill built from your top 3 weak areas when you want extra repetition without leaving the main study plan flow."
          eyebrow="Drill Weak Areas"
          title="Run a fast weak-area drill"
          action={
            <Link className="button-secondary w-full sm:w-auto" href="/ccma/quiz?mode=drill">
              Drill again
            </Link>
          }
        >
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-5">
            <p className="text-sm font-semibold">What this does</p>
            <p className="mt-2 text-sm leading-6">
              This drill pulls 10 questions only from your top 3 weak areas, then shows how each area compares with your pre-test baseline so you can see whether the weakest topics are actually moving.
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link className="button-primary w-full sm:w-auto" href="/ccma/quiz?mode=drill">
              Start weak-area drill
            </Link>
            <Link className="button-secondary w-full sm:w-auto" href="/ccma/study-plan">
              Stay with study plan
            </Link>
          </div>
        </DashboardSection>

        {dashboard.progression.examReady ? (
          <DashboardSection
            description="You reached the exam-ready range. Use your exam-day plan to review what to bring, what the NHA CCMA testing flow looks like, and how to walk in calm."
            eyebrow="Exam Day"
            title="Your test-day plan is unlocked"
          >
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-5">
              <p className="text-sm font-semibold">What you can review now</p>
              <p className="mt-2 text-sm leading-6">
                Open your exam-day page for the NHA CCMA test-day checklist, your readiness summary, and a final confidence message before test day.
              </p>
            </div>
            <div className="mt-5">
              <Link className="button-primary w-full sm:w-auto" href="/ccma/exam-day">
                Open exam-day plan
              </Link>
            </div>
          </DashboardSection>
        ) : null}

        <DashboardSection
          description={
            dashboard.recoveryPlan.active && dashboard.recoveryPlan.reason !== "inactivity"
              ? "Recent scores show you need a more focused reset. Short quizzes can help confirm when a weak topic is starting to stick again."
              : "Use short quizzes and full practice exams to check whether your study work is turning into steady performance."
          }
          eyebrow="Practice Performance"
          title="See how your recent practice is going"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Recent quiz score</p>
              <p className="mt-2 text-3xl font-semibold">
                {latestQuiz ? `${latestQuiz.score}%` : "Not yet"}
              </p>
            </div>
            <span
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${trendStyles[dashboard.practicePerformance.trendDirection as keyof typeof trendStyles]}`}
            >
              {dashboard.practicePerformance.trendLabel}
            </span>
          </div>

          <p className="mt-4 text-sm font-medium leading-6">{dashboard.practicePerformance.summary}</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <MetricCard
              helper="Your best score so far"
              label="Full practice exam"
              value={
                dashboard.practiceExamStatus.bestScore !== null
                  ? `${dashboard.practiceExamStatus.bestScore}%`
                  : dashboard.practiceExamStatus.unlocked
                    ? "Ready to start"
                    : "Unlock in progress"
              }
            />
            <MetricCard
              helper="What the app wants you to do next"
              label="Practice direction"
              value={
                dashboard.practiceExamStatus.unlocked
                  ? dashboard.practiceExamStatus.completed
                    ? "Tighten weak areas"
                    : "Take your first full exam"
                  : "Keep building first"
              }
            />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold">Score trend</p>
              <p className="text-muted mt-2 text-sm leading-6">
                Your recent quiz scores over time.
              </p>
              <div className="mt-3">
                <TrendLine values={scoreSeries} />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold">Confidence trend</p>
              <p className="text-muted mt-2 text-sm leading-6">
                {dashboard.practicePerformance.confidenceSummary}
              </p>
              <div className="mt-3">
                <TrendLine tone="accent" values={confidenceSeries} />
              </div>
              <p className="mt-3 text-sm font-medium leading-6">
                {dashboard.practicePerformance.confidenceLabel}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
            <p className="text-sm font-semibold">Practice note</p>
            <p className="mt-2 text-sm leading-6">{dashboard.practiceExamStatus.summary}</p>
          </div>

          <PracticeExamUnlockBlock
            lessonsCompleted={dashboard.practiceExamStatus.requirements.lessonsCompleted}
            lessonsRequired={dashboard.practiceExamStatus.requirements.lessonsRequired}
            qualifyingQuizCount={dashboard.practiceExamStatus.requirements.qualifyingQuizCount}
            qualifyingQuizRequired={dashboard.practiceExamStatus.requirements.qualifyingQuizRequired}
            unlocked={dashboard.practiceExamStatus.unlocked}
          />

          <div className="mt-5 space-y-3">
            {dashboard.practicePerformance.recentScores.length ? (
              dashboard.practicePerformance.recentScores.slice(0, 3).map((attempt: any) => (
                <article
                  key={attempt.id}
                  className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{attempt.domainTitle}</p>
                      <p className="text-muted mt-1 text-sm">{attempt.completedAt}</p>
                      <p className="text-muted mt-1 text-sm">
                        Confidence: {formatConfidenceScore(attempt.confidenceScore)}
                      </p>
                    </div>
                    <span className="text-lg font-semibold">{attempt.score}%</span>
                  </div>
                </article>
              ))
            ) : (
              <StudentEmptyState
                compact
                description="You haven't started quiz practice yet. Begin with a short quiz after your next guided lesson so you can see whether the material is sticking."
                eyebrow="Practice"
                primaryAction={{
                  href: "/ccma/quiz",
                  label: "Start first quiz",
                }}
                title="Your quiz results will show here."
              />
            )}
          </div>
        </DashboardSection>

        <DashboardSection
          description={text(
            "Get quick help and set the tutor language that feels best for you.",
            "Recibe ayuda rapida y elige el idioma del tutor que te funcione mejor.",
          )}
          eyebrow={text("Support", "Apoyo")}
          title={text("Keep support close by", "Manten el apoyo cerca")}
        >
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
            <p className="text-sm font-semibold">{text("Tutor language", "Idioma del tutor")}</p>
            <p className="text-muted mt-2 text-sm leading-6">
              {text("Current language:", "Idioma actual:")} {getLanguageLabel(preferredLanguage)}.
            </p>
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
            <p className="text-sm font-semibold">{text("Need a hand?", "Necesitas ayuda?")}</p>
            <p className="text-muted mt-2 text-sm leading-6">
              {text(
                "If something feels confusing, use support or reset your password and come back to your study plan.",
                "Si algo se siente confuso, usa soporte o restablece tu contrasena y vuelve a tu plan de estudio.",
              )}
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link className="button-secondary w-full sm:w-auto" href="/ccma/support">
                {text("Get help", "Obtener ayuda")}
              </Link>
              <Link className="button-secondary w-full sm:w-auto" href="/forgot-password">
                {text("Forgot password", "Olvide mi contrasena")}
              </Link>
            </div>
          </div>

          <form action={updateCcmaLanguagePreferenceAction} className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="preferred_language">
                {text("Choose tutor language", "Elige el idioma del tutor")}
              </label>
              <select
                className="input-base"
                defaultValue={preferredLanguage}
                id="preferred_language"
                name="preferred_language"
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <SubmitButton
                className="button-secondary w-full sm:w-auto"
                pendingText={text("Saving language...", "Guardando idioma...")}
              >
                {text("Save language", "Guardar idioma")}
              </SubmitButton>
              <Link className="button-secondary w-full sm:w-auto" href="/ccma/support">
                {text("Get help", "Obtener ayuda")}
              </Link>
            </div>
          </form>
        </DashboardSection>
      </section>
    </div>
  );
}


