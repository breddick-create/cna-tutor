import Link from "next/link";

import { AssessmentRunner } from "@/components/ccma/assessment-runner";
import {
  formatExamTime,
  getMockExamTimeLimitSeconds,
} from "@/lib/ccma/exams/mock-flow";
import { requireCcmaViewer } from "@/lib/ccma/auth/session";
import { getAssessmentQuestions, listExamDomains } from "@/lib/ccma/exams/bank";
import { getPretestDomainBreakdown, getPretestScore } from "@/lib/ccma/onboarding/pretest";
import { getStudentProgressionSnapshot } from "@/lib/ccma/progression/student";

type SearchParams = Promise<{ domain?: string; start?: string }>;

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
  const viewer = await requireCcmaViewer();
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
  const shouldStart = resolvedSearchParams.start === "1";
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
                : "This full mock is meant to feel more like the real NHA CCMA written exam. It helps you decide whether to keep studying or move closer to exam day with confidence."}
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
          <div className="mt-6 rounded-[1.5rem] border border-[rgba(217,111,50,0.18)] bg-[rgba(255,249,243,0.92)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Unlock requirements</p>
                <p className="mt-2 text-sm leading-6">
                  To unlock the full practice exam, complete: (1) at least 2 guided lessons, (2)
                  at least 1 quiz with a score of 60% or higher.
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
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link className="button-primary w-full sm:w-auto" href="/ccma/study-plan">
              Continue study plan
            </Link>
            <Link className="button-secondary w-full sm:w-auto" href="/ccma/quiz">
              Take practice quiz
            </Link>
          </div>
        </section>
      ) : shouldStart ? (
        <AssessmentRunner
          description={
            selectedDomain
              ? `This timed section mock stays inside ${selectedDomain.title}. Use it to confirm whether this domain is ready to hold up under a longer check.`
              : "This full 50-question CCMA mock is your strongest readiness checkpoint. Finish it in one sitting if you can and use the result to decide what comes next."
          }
          domainSlug={selectedDomain?.slug}
          mode="mock_exam"
          questions={questions}
          timeLimitSeconds={timeLimitSeconds}
          title={
            selectedDomain
              ? `${selectedDomain.title} section mock`
              : "Full CCMA practice exam"
          }
        />
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
                href={
                  selectedDomain
                    ? `/ccma/mock-exam?domain=${selectedDomain.slug}&start=1`
                    : "/ccma/mock-exam?start=1"
                }
              >
                {selectedDomain ? "Start section practice exam" : "Start full practice exam"}
              </Link>
              <Link
                className="button-secondary w-full sm:w-auto"
                href={selectedDomain?.slug ? `/ccma/quiz?domain=${selectedDomain.slug}` : "/ccma/study-plan"}
              >
                {selectedDomain ? "Take section quiz first" : "Back to study plan"}
              </Link>
            </div>
          </section>
        </section>
      )}
    </div>
  );
}
