import { AssessmentRunner } from "@/components/exams/assessment-runner";
import { getMockExamTimeLimitSeconds } from "@/lib/exams/mock-flow";
import { requireViewer } from "@/lib/auth/session";
import { getWrittenAssessmentQuestions, listWrittenExamDomains } from "@/lib/exams/written-bank";

type SearchParams = Promise<{ domain?: string }>;

export default async function WrittenMockExamStartPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireViewer();
  const resolvedSearchParams = await searchParams;
  const domains = listWrittenExamDomains();
  const selectedDomain = domains.find((d) => d.slug === resolvedSearchParams.domain) ?? null;
  const questions = getWrittenAssessmentQuestions("mock_exam", selectedDomain?.slug);
  const fullTest = !selectedDomain;
  const questionCount = questions.length;
  const resultsHref = selectedDomain
    ? `/written/mock-exam/results?domain=${selectedDomain.slug}`
    : "/written/mock-exam/results";

  return (
    <AssessmentRunner
      description={
        selectedDomain
          ? `This timed section mock focuses on ${selectedDomain.title}. Finish it in one sitting if you can, then use the result to decide whether this topic needs one more pass.`
          : "This timed full written practice exam covers all eight Texas CNA written exam domains. Finish in one sitting if you can, then use the result to decide whether to keep studying or move closer to exam-ready confidence."
      }
      domainSlug={selectedDomain?.slug}
      mode="mock_exam"
      questions={questions}
      resultsHref={resultsHref}
      submitHref="/api/written/assessments/submit"
      timeLimitSeconds={getMockExamTimeLimitSeconds({ questionCount, fullTest })}
      title={
        selectedDomain
          ? `${selectedDomain.title} section mock exam`
          : "Texas CNA written exam — full practice"
      }
    />
  );
}
