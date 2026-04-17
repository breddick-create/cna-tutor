import { AssessmentRunner } from "@/components/exams/assessment-runner";
import { requireViewer } from "@/lib/auth/session";
import { getAssessmentQuestions } from "@/lib/exams/bank";

export default async function PretestStartPage() {
  await requireViewer();
  const questions = getAssessmentQuestions("pretest");

  return (
    <div className="space-y-8">
      <section className="panel rounded-[1.75rem] p-6">
        <p className="eyebrow">Texas CNA Pre-Test</p>
        <h1 className="mt-3 text-3xl font-semibold">Answer honestly so we can build the best study plan for you.</h1>
        <p className="text-muted mt-3 max-w-3xl leading-7">
          This pre-test is here to show where you are strongest and where you need more
          support. When you finish, your results will build the first version of your
          study plan automatically.
        </p>
      </section>

      <AssessmentRunner
        description="Take your time and answer every question honestly. There is no penalty for a low score. Your results will show what to study first."
        mode="pretest"
        questions={questions}
        title="Texas CNA pre-test"
      />
    </div>
  );
}
