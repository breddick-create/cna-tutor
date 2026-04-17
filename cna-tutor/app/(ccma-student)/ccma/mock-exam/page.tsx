import Link from "next/link";

import {
  buildMockExamStartHref,
  formatExamTime,
  getMockExamTimeLimitSeconds,
} from "@/lib/ccma/exams/mock-flow";
import { requireViewer } from "@/lib/auth/session";
import { getAssessmentQuestions, listExamDomains } from "@/lib/ccma/exams/bank";
import { getPretestDomainBreakdown, getPretestScore } from "@/lib/ccma/onboarding/pretest";
import { getStudentProgressionSnapshot } from "@/lib/ccma/progression/student";

type SearchParams = Promise<{ domain?: string }>;

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

export default async function MockExamPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const viewer = await requireViewer();
  const resolvedSearchParams = await searchParams;
  const pretestScore = getPretestScore(viewer.user);
  const pretestDomainBreakdown = getPretestDomainBreakdown(viewer.user);
  const progression = await getStudentProgressionSnapshot({
    userId: viewer.user.id,
    pretestScore,
    pretestDomainBreakdown,
  });
  const domains = listExamDomains();
  const selectedDomain =
    domains.find((domain) => domain.slug === resolvedSearchParams.domain) ?? null;
  const questions = getAssessmentQuestions("mock_exam", selectedDomain?.slug);
  const questionCount = questions.length;
  const fullTest = !selectedDomain;
  const timeLimitSeconds = getMockExamTimeLimitSeconds({
    questionCount,
    fullTest,
  });
  const fullMockLocked = fullTest && !progression.practiceExamUnlocked;
  const lessonsRequired = progression.config.gates.practiceExamMinLessonsCompleted;
  const qualifyingQuizRequired = 1;
  const qualifyingQuizCount = progression.signals.qualifyingQuizzesCompleted;
  const lessonsMet = progression.signals.lessonsCompleted >= lessonsRequired;
  const qualifyingQuizMet = qualifyingQuizCount >= qualifyingQuizRequired;

  return (
    <div className="space-y-8">
      <section className="panel rounded-[1.75rem] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="eyebrow">Practice Exam</p>
            <h1 className="mt-3 text-3xl font-semibold">
              {selectedDomain
                ? `Use ${selectedDomain.title} as a deeper section check.`
                : "Use the full practice exam as a real readiness check."}
            </h1>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--brand-strong)]">
              {selectedDomain
                ? `${questionCount}-question section practice exam`
                : `${questionCount}-question full practice exam`}
            </p>
            <p className="text-muted mt-3 max-w-3xl leading-7">
              {selectedDomain
                ? `This section mock stays inside ${selectedDomain.title}. Use it after guided study and the 10-question quiz when you want a stronger check before you move on.`
                : "This full mock is meant to feel more like the real written exam. It helps you decide whether to keep studying or move closer to exam day with confidence."}
            </p>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-7">
              Next step: {selectedDomain ? "finish this section check and use the result to decide whether this topic is ready." : "finish this full practice exam and use the result to decide whether to keep studying or move closer to exam day."}
            </p>
          </div>
          <Link className="button-secondary w-full sm:w-auto" href="/ccma/dashboard">
            Check your progress
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
          <Link
            className={`inline-flex min-h-11 w-full items-center justify-center rounded-2xl px-4 py-3 text-center text-sm font-semibold transition sm:w-auto ${
              fullTest
                ? "bg-[rgba(23,60,255,0.12)] text-[color:var(--brand-strong)]"
                : "border border-[var(--border)] bg-white/70"
            }`}
            href="/ccma/mock-exam"
          >
            Full practice exam
          </Link>
          {domains.map((domain) => (
            <Link
              key={domain.slug}
              className={`inline-flex min-h-11 w-full items-center justify-center rounded-2xl px-4 py-3 text-center text-sm font-semibold transition sm:w-auto ${
                domain.slug === selectedDomain?.slug
                  ? "bg-[rgba(23,60,255,0.12)] text-[color:var(--brand-strong)]"
                  : "border border-[var(--border)] bg-white/70"
              }`}
              href={`/ccma/mock-exam?domain=${domain.slug}`}
            >
              {domain.title}
            </Link>
          ))}
        </div>
      </section>

      {fullMockLocked ? (
        <section className="panel rounded-[1.75rem] p-5 sm:p-6">
          <p className="eyebrow">Full Practice Exam Locked</p>
          <h2 className="mt-3 text-3xl font-semibold">
            Build a little more foundation before you take the full practice exam.
          </h2>
          <p className="text-muted mt-3 max-w-3xl leading-7">
            {progression.practiceExamGateReason}
          </p>
          <p className="text-muted mt-3 max-w-3xl text-sm leading-7">
            That does not mean you are off track. It just means the app wants a little more lesson
            and quiz evidence before using the strongest readiness check.
          </p>
          <p className="mt-3 text-sm font-medium leading-7">
            Next step: continue the study plan or take a practice quiz in your weakest topic.
          </p>
          <div className="mt-6 rounded-[1.5rem] border border-[rgba(217,111,50,0.18)] bg-[rgba(255,249,243,0.92)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Unlock requirements</p>
                <p className="mt-2 text-sm leading-6">
                  To unlock the full practice exam, complete: (1) at least 2 guided lessons, (2) at least 1 quiz with a score of 60% or higher.
                </p>
              </div>
              <span className="rounded-full bg-[rgba(217,111,50,0.16)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:#9a4f17]">
                In progress
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <PracticeExamRequirementItem
                complete={lessonsMet}
                label={`Guided lessons: ${Math.min(progression.signals.lessonsCompleted, lessonsRequired)}/${lessonsRequired} completed`}
              />
              <PracticeExamRequirementItem
                complete={qualifyingQuizMet}
                label={`Qualifying quizzes (60%+): ${Math.min(qualifyingQuizCount, qualifyingQuizRequired)}/${qualifyingQuizRequired} completed`}
              />
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
              <p className="text-sm font-semibold">Guided lessons finished</p>
              <p className="mt-2 text-2xl font-semibold">{progression.signals.lessonsCompleted}</p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
              <p className="text-sm font-semibold">Quizzes finished</p>
              <p className="mt-2 text-2xl font-semibold">{progression.signals.quizzesCompleted}</p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
              <p className="text-sm font-semibold">Your current score</p>
              <p className="mt-2 text-2xl font-semibold">{progression.readinessScore}%</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link className="button-primary w-full sm:w-auto" href="/ccma/study-plan">
              Continue study plan
            </Link>
            <Link
              className="button-secondary w-full sm:w-auto"
              href={progression.priorityOrder[0]?.domainSlug ? `/ccma/quiz?domain=${progression.priorityOrder[0].domainSlug}` : "/ccma/quiz"}
            >
              Take practice quiz
            </Link>
          </div>
        </section>
      ) : (
        <section className="space-y-6">
          <section className="panel rounded-[1.75rem] p-5 sm:p-6">
            <p className="eyebrow">Before You Start</p>
            <h2 className="mt-3 text-3xl font-semibold">
              {selectedDomain
                ? `You are about to run a timed mock for ${selectedDomain.title}.`
                : "You are about to run a timed full practice exam."}
            </h2>
            <p className="text-muted mt-3 max-w-3xl leading-7">
              {selectedDomain
                ? "Treat this like a deeper section check. Answer honestly, finish in one sitting if you can, and use the result to decide whether this topic is strong enough to keep or needs one more pass."
                : "Treat this like a real readiness checkpoint. Finish in one sitting if you can, answer honestly, and use the result to decide whether to keep studying or move toward exam-ready confidence."}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
                <p className="text-sm font-semibold">Estimated time</p>
                <p className="mt-2 text-2xl font-semibold">{formatExamTime(timeLimitSeconds)}</p>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
                <p className="text-sm font-semibold">Question count</p>
                <p className="mt-2 text-2xl font-semibold">{questionCount}</p>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
                <p className="text-sm font-semibold">What happens after this</p>
                <p className="mt-2 text-sm leading-6">
                  You will see your score, the weakest categories, and what to do next.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                className={`w-full sm:w-auto ${fullTest ? "button-primary animate-[pulse_2.4s_ease-in-out_1]" : "button-primary"}`}
                href={buildMockExamStartHref(selectedDomain?.slug)}
              >
                {selectedDomain ? "Start section practice exam" : "Start full practice exam"}
              </Link>
              <Link className="button-secondary w-full sm:w-auto" href={selectedDomain?.slug ? `/ccma/quiz?domain=${selectedDomain.slug}` : "/ccma/study-plan"}>
                {selectedDomain ? "Take section quiz first" : "Back to study plan"}
              </Link>
            </div>
          </section>

          {fullTest ? (
            <section className="rounded-[1.75rem] border border-[rgba(28,124,104,0.34)] bg-[linear-gradient(135deg,rgba(231,248,243,0.96),rgba(244,252,249,0.96))] p-5 shadow-[0_18px_36px_rgba(28,124,104,0.14)] transition-all duration-500 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="eyebrow text-[color:#145f50]">Unlocked</p>
                  <h2 className="mt-3 text-2xl font-semibold">Your full practice exam is ready.</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:#145f50]">
                    You met both unlock requirements. This is your moment to use the full mock as a real readiness check.
                  </p>
                </div>
                <span className="rounded-full bg-[rgba(28,124,104,0.18)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:#145f50]">
                  Ready
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <PracticeExamRequirementItem
                  complete
                  label={`Guided lessons: ${Math.min(progression.signals.lessonsCompleted, lessonsRequired)}/${lessonsRequired} completed`}
                />
                <PracticeExamRequirementItem
                  complete
                  label={`Qualifying quizzes (60%+): ${Math.min(qualifyingQuizCount, qualifyingQuizRequired)}/${qualifyingQuizRequired} completed`}
                />
              </div>
            </section>
          ) : null}

          <section className="panel rounded-[1.75rem] p-5 sm:p-6">
            <p className="eyebrow">Why This Matters</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
                <p className="text-sm font-semibold">1. Measure</p>
                <p className="text-muted mt-2 text-sm leading-6">
                  This is more than a quiz. It shows whether your study work still holds up in a longer check.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
                <p className="text-sm font-semibold">2. Diagnose</p>
                <p className="text-muted mt-2 text-sm leading-6">
                  The result will show which categories need another pass before you rely on final readiness signals.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
                <p className="text-sm font-semibold">3. Decide</p>
                <p className="text-muted mt-2 text-sm leading-6">
                  Strong performance can move readiness up. Low performance sends you back to the right review instead of guesswork.
                </p>
              </div>
            </div>
          </section>
        </section>
      )}
    </div>
  );
}


