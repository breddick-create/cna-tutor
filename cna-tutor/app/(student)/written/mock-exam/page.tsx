import Link from "next/link";

import { formatExamTime, getMockExamTimeLimitSeconds } from "@/lib/exams/mock-flow";
import { requireViewer } from "@/lib/auth/session";
import { getWrittenAssessmentQuestions, listWrittenExamDomains } from "@/lib/exams/written-bank";

type SearchParams = Promise<{ domain?: string }>;

export default async function WrittenMockExamPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireViewer();
  const resolvedSearchParams = await searchParams;
  const domains = listWrittenExamDomains();
  const selectedDomain = domains.find((d) => d.slug === resolvedSearchParams.domain) ?? null;
  const questions = getWrittenAssessmentQuestions("mock_exam", selectedDomain?.slug);
  const questionCount = questions.length;
  const fullTest = !selectedDomain;
  const timeLimitSeconds = getMockExamTimeLimitSeconds({ questionCount, fullTest });

  const startHref = selectedDomain
    ? `/written/mock-exam/start?domain=${selectedDomain.slug}`
    : "/written/mock-exam/start";
  const quizHref = selectedDomain
    ? `/written/quiz?domain=${selectedDomain.slug}`
    : "/written/quiz";

  return (
    <div className="space-y-8">
      <section className="panel rounded-[1.75rem] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="eyebrow">Written Practice Exam</p>
            <h1 className="mt-3 text-3xl font-semibold">
              {selectedDomain
                ? `Use ${selectedDomain.title} as a deeper section check.`
                : "Use the full written practice exam as a real readiness check."}
            </h1>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--brand-strong)]">
              {selectedDomain
                ? `${questionCount}-question section practice exam`
                : `${questionCount}-question full written practice exam`}
            </p>
            <p className="text-muted mt-3 max-w-3xl leading-7">
              {selectedDomain
                ? `This section mock stays inside ${selectedDomain.title}. Use it after the guided lesson and 10-question quiz when you want a stronger check before moving on.`
                : "This full mock simulates the 60-question Texas CNA written exam. It helps you see how your written knowledge holds up across all eight domains."}
            </p>
          </div>
          <Link className="button-secondary w-full sm:w-auto" href="/dashboard">
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
            href="/written/mock-exam"
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
              href={`/written/mock-exam?domain=${domain.slug}`}
            >
              {domain.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="panel rounded-[1.75rem] p-5 sm:p-6">
        <p className="eyebrow">Before You Start</p>
        <h2 className="mt-3 text-3xl font-semibold">
          {selectedDomain
            ? `You are about to run a timed mock for ${selectedDomain.title}.`
            : "You are about to run a timed full written practice exam."}
        </h2>
        <p className="text-muted mt-3 max-w-3xl leading-7">
          {selectedDomain
            ? "Treat this like a deeper section check. Answer honestly, finish in one sitting if you can, and use the result to decide whether this topic needs one more pass."
            : "Treat this like the real written exam. Finish in one sitting if you can, answer honestly, and use the result to decide whether to keep studying or move toward exam-ready confidence."}
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
            <p className="text-sm font-semibold">What happens after</p>
            <p className="mt-2 text-sm leading-6">
              You will see your score, the domain breakdown, and what to do next.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link className="button-primary w-full sm:w-auto" href={startHref}>
            {selectedDomain ? "Start section practice exam" : "Start full written practice exam"}
          </Link>
          <Link className="button-secondary w-full sm:w-auto" href={quizHref}>
            {selectedDomain ? "Take section quiz first" : "Back to study plan"}
          </Link>
        </div>
      </section>

      <section className="panel rounded-[1.75rem] p-5 sm:p-6">
        <p className="eyebrow">Why This Matters</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
            <p className="text-sm font-semibold">1. Measure</p>
            <p className="text-muted mt-2 text-sm leading-6">
              More than a quiz — shows whether your written study work holds up in a longer, timed check across all domains.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
            <p className="text-sm font-semibold">2. Diagnose</p>
            <p className="text-muted mt-2 text-sm leading-6">
              The result shows which written domains need another pass before you rely on final readiness signals.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
            <p className="text-sm font-semibold">3. Decide</p>
            <p className="text-muted mt-2 text-sm leading-6">
              Strong performance moves readiness up. Low performance sends you back to the right review.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
