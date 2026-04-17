import Link from "next/link";

import { AssessmentRunner } from "@/components/exams/assessment-runner";
import { requireViewer } from "@/lib/auth/session";
import { getAssessmentQuestions, listExamDomains } from "@/lib/exams/bank";

type SearchParams = Promise<{ domain?: string }>;

export default async function QuizPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireViewer();
  const resolvedSearchParams = await searchParams;
  const domains = listExamDomains();
  const selectedDomain = domains.find((domain) => domain.slug === resolvedSearchParams.domain) ?? domains[0];
  const questions = getAssessmentQuestions("quiz", selectedDomain.slug);

  return (
    <div className="space-y-8">
      <section className="panel rounded-[1.75rem] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Targeted Quiz</p>
            <h1 className="mt-3 text-3xl font-semibold">Check one domain at a time.</h1>
            <p className="text-muted mt-3 max-w-3xl leading-7">
              Use quizzes to measure retention quickly. Each quiz is scored, saved for reporting,
              and pushed back into mastery tracking.
            </p>
          </div>
          <Link className="button-secondary" href="/study">
            Back to study
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {domains.map((domain) => (
            <Link
              key={domain.slug}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                domain.slug === selectedDomain.slug
                  ? "bg-[rgba(28,124,104,0.12)] text-[color:var(--brand-strong)]"
                  : "border border-[var(--border)] bg-white/70"
              }`}
              href={`/quiz?domain=${domain.slug}`}
            >
              {domain.title}
            </Link>
          ))}
        </div>
      </section>

      <AssessmentRunner
        description={`This focused check targets ${selectedDomain.title}. Use these ${questions.length} questions for a fast score before returning to guided tutoring.`}
        domainSlug={selectedDomain.slug}
        mode="quiz"
        questions={questions}
        title={`${selectedDomain.title} quiz`}
      />
    </div>
  );
}
