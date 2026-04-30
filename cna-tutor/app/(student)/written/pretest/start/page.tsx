import { AssessmentRunner } from "@/components/exams/assessment-runner";
import { requireViewer } from "@/lib/auth/session";
import { getWrittenPretestQuestions } from "@/lib/exams/written-bank";

export default async function WrittenPretestStartPage() {
  await requireViewer();
  const questions = getWrittenPretestQuestions();

  return (
    <div className="space-y-8">
      <section className="panel rounded-[1.75rem] p-6">
        <p className="eyebrow">Texas CNA Written Exam Pre-Test</p>
        <h1 className="mt-3 text-3xl font-semibold">
          Answer honestly so we can build the best written study plan for you.
        </h1>
        <p className="text-muted mt-3 max-w-3xl leading-7">
          This pre-test covers the 8 written exam domains tested by Prometric. When you finish,
          your results will build the first version of your written study plan automatically.
        </p>
      </section>

      <AssessmentRunner
        description="Take your time and answer every question honestly. There is no penalty for a low score. Your results will show which written exam domains to study first."
        mode="pretest"
        questions={questions}
        resultsHref="/written/pretest/results"
        submitHref="/api/written/pretest/submit"
        title="Texas CNA written exam pre-test"
      />
    </div>
  );
}
