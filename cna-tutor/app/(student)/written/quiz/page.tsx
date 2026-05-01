import Link from "next/link";

import { AssessmentRunner } from "@/components/exams/assessment-runner";
import { StudentEmptyState } from "@/components/student/student-empty-state";
import { requireViewer } from "@/lib/auth/session";
import { getWrittenAssessmentQuestions, listWrittenExamDomains } from "@/lib/exams/written-bank";
import { getWrittenPretestDomainBreakdown, getWrittenPretestScore } from "@/lib/onboarding/written-pretest";
import { getStudentProgressionSnapshot } from "@/lib/progression/student";
import { writtenExamDomains } from "@/content/texas-cna/written-domains";

type SearchParams = Promise<{ domain?: string }>;

export default async function WrittenQuizPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const viewer = await requireViewer();
  const params = await searchParams;
  const domains = listWrittenExamDomains();
  const selectedDomain = domains.find((d) => d.slug === params.domain) ?? null;

  const progression = await getStudentProgressionSnapshot({
    userId: viewer.user.id,
    pretestScore: getWrittenPretestScore(viewer.user),
    pretestDomainBreakdown: getWrittenPretestDomainBreakdown(viewer.user),
    domains: writtenExamDomains,
  });

  const assignedDomain = selectedDomain ?? (
    progression.topWeakAreas[0]
      ? domains.find((d) => d.slug === progression.topWeakAreas[0].domainSlug) ?? domains[0]
      : domains[0]
  ) ?? null;

  if (!assignedDomain) {
    return (
      <StudentEmptyState
        description="No written exam domains are available right now."
        eyebrow="Written Quiz"
        primaryAction={{ href: "/written/study-plan", label: "Back to study plan" }}
        title="No domains found."
      />
    );
  }

  const questions = getWrittenAssessmentQuestions("quiz", assignedDomain.slug);

  return (
    <div className="space-y-8">
      <section className="panel rounded-[1.75rem] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="eyebrow">Written Exam Quiz</p>
            <h1 className="mt-3 text-3xl font-semibold">
              Quiz the topic that needs the most work next.
            </h1>
            <p className="text-muted mt-3 max-w-3xl leading-7">
              This 10-question quiz focuses on one written exam domain. Answer honestly, then use the result to decide whether to review the topic again or move ahead in your study plan.
            </p>
          </div>
          <Link className="button-secondary w-full sm:w-auto" href="/written/study-plan">
            Back to study plan
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            className={`inline-flex min-h-10 items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              !selectedDomain
                ? "bg-[rgba(23,60,255,0.12)] text-[color:var(--brand-strong)]"
                : "border border-[var(--border)] bg-white/70 hover:bg-white/90"
            }`}
            href="/written/quiz"
          >
            Weakest domain
          </Link>
          {domains.map((domain) => (
            <Link
              key={domain.slug}
              className={`inline-flex min-h-10 items-center justify-center rounded-2xl px-4 py-2 text-center text-sm font-semibold transition ${
                domain.slug === selectedDomain?.slug
                  ? "bg-[rgba(23,60,255,0.12)] text-[color:var(--brand-strong)]"
                  : "border border-[var(--border)] bg-white/70 hover:bg-white/90"
              }`}
              href={`/written/quiz?domain=${domain.slug}`}
            >
              {domain.title}
            </Link>
          ))}
        </div>

        <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
          <p className="text-sm font-semibold">
            {selectedDomain ? "Selected topic" : "Auto-assigned topic"}
          </p>
          <p className="mt-2 text-lg font-semibold">{assignedDomain.title}</p>
          {!selectedDomain ? (
            <p className="text-muted mt-2 text-sm leading-6">
              Auto-assigned from your current weakest written exam domain. Choose a specific domain above to override.
            </p>
          ) : null}
        </div>
      </section>

      <AssessmentRunner
        confidencePrompt={{ topicLabel: assignedDomain.title }}
        description={`This 10-question check focuses on ${assignedDomain.title}. Answer honestly, then use the result to decide whether to review this topic again or move ahead in your study plan.`}
        domainSlug={assignedDomain.slug}
        mode="quiz"
        questions={questions}
        submitHref="/api/written/assessments/submit"
        title={`${assignedDomain.title} quiz`}
      />
    </div>
  );
}
