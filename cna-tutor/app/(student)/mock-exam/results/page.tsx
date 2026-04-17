import { MockExamResultsView } from "@/components/exams/mock-exam-results-view";
import { requireViewer } from "@/lib/auth/session";
import { listExamDomains } from "@/lib/exams/bank";
import { getPretestDomainBreakdown, getPretestScore } from "@/lib/onboarding/pretest";
import { getStudentProgressionSnapshot } from "@/lib/progression/student";

type SearchParams = Promise<{ domain?: string }>;

export default async function MockExamResultsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const viewer = await requireViewer();
  const resolvedSearchParams = await searchParams;
  const domains = listExamDomains();
  const selectedDomain =
    domains.find((domain) => domain.slug === resolvedSearchParams.domain) ?? null;
  const progression = await getStudentProgressionSnapshot({
    userId: viewer.user.id,
    pretestScore: getPretestScore(viewer.user),
    pretestDomainBreakdown: getPretestDomainBreakdown(viewer.user),
  });

  return (
    <MockExamResultsView
      domainSlug={selectedDomain?.slug}
      examTitle={selectedDomain ? `${selectedDomain.title} section mock exam` : "Texas CNA full practice exam"}
      progression={progression}
    />
  );
}
