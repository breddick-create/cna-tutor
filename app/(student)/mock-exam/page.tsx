import Link from "next/link";

import { AssessmentRunner } from "@/components/exams/assessment-runner";
import { requireViewer } from "@/lib/auth/session";
import { getAssessmentQuestions } from "@/lib/exams/bank";

export default async function MockExamPage() {
  await requireViewer();
  const questions = getAssessmentQuestions("mock_exam");

  return (
    <div className="space-y-8">
      <section className="panel rounded-[1.75rem] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Mock Exam</p>
            <h1 className="mt-3 text-3xl font-semibold">Simulate a broader written-exam pass.</h1>
            <p className="text-muted mt-3 max-w-3xl leading-7">
              This mock exam pulls questions across multiple CNA domains, scores the result, and
              flags weak areas for immediate follow-up.
            </p>
          </div>
          <Link className="button-secondary" href="/dashboard">
            Back to dashboard
          </Link>
        </div>
      </section>

      <AssessmentRunner
        description="Use this fifteen-question mock exam to see how your knowledge is holding together across the exam blueprint."
        mode="mock_exam"
        questions={questions}
        title="Texas CNA mock exam"
      />
    </div>
  );
}
