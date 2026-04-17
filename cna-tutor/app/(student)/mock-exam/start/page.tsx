import { redirect } from "next/navigation";

import { AssessmentRunner } from "@/components/exams/assessment-runner";
import {
  buildMockExamResultsHref,
  getMockExamTimeLimitSeconds,
} from "@/lib/exams/mock-flow";
import { requireViewer } from "@/lib/auth/session";
import { getAssessmentQuestions, listExamDomains } from "@/lib/exams/bank";
import { getPretestDomainBreakdown, getPretestScore } from "@/lib/onboarding/pretest";
import { getStudentProgressionSnapshot } from "@/lib/progression/student";

type SearchParams = Promise<{ domain?: string }>;

export default async function MockExamStartPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const viewer = await requireViewer();
  const resolvedSearchParams = await searchParams;
  const domains = listExamDomains();
  const selectedDomain =
    domains.find((domain) => domain.slug === resolvedSearchParams.domain) ?? null;
  const pretestScore = getPretestScore(viewer.user);
  const pretestDomainBreakdown = getPretestDomainBreakdown(viewer.user);
  const progression = await getStudentProgressionSnapshot({
    userId: viewer.user.id,
    pretestScore,
    pretestDomainBreakdown,
  });

  if (!selectedDomain && !progression.practiceExamUnlocked) {
    redirect("/mock-exam");
  }

  const questions = getAssessmentQuestions("mock_exam", selectedDomain?.slug);
  const fullTest = !selectedDomain;
  const questionCount = questions.length;

  return (
    <AssessmentRunner
      description={
        selectedDomain
          ? `This timed section mock focuses on ${selectedDomain.title}. Finish it in one sitting if you can, then use the result to decide whether this topic needs one more pass or is strong enough to keep moving.`
          : `This timed full practice exam is meant to feel like a real readiness check. Finish it in one sitting if you can, then use the result to decide whether to keep studying or move closer to exam day with confidence.`
      }
      domainSlug={selectedDomain?.slug}
      mode="mock_exam"
      questions={questions}
      resultsHref={buildMockExamResultsHref(selectedDomain?.slug)}
      timeLimitSeconds={getMockExamTimeLimitSeconds({
        questionCount,
        fullTest,
      })}
      title={selectedDomain ? `${selectedDomain.title} section mock exam` : "Texas CNA full practice exam"}
    />
  );
}
