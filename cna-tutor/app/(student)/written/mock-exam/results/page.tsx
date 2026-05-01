import { MockExamResultsView } from "@/components/exams/mock-exam-results-view";
import { requireViewer } from "@/lib/auth/session";
import { listWrittenExamDomains } from "@/lib/exams/written-bank";
import { getWrittenPretestDomainBreakdown, getWrittenPretestScore } from "@/lib/onboarding/written-pretest";
import { getStudentProgressionSnapshot } from "@/lib/progression/student";
import { writtenExamDomains } from "@/content/texas-cna/written-domains";

type SearchParams = Promise<{ domain?: string }>;

export default async function WrittenMockExamResultsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const viewer = await requireViewer();
  const resolvedSearchParams = await searchParams;
  const domains = listWrittenExamDomains();
  const selectedDomain = domains.find((d) => d.slug === resolvedSearchParams.domain) ?? null;

  const progression = await getStudentProgressionSnapshot({
    userId: viewer.user.id,
    pretestScore: getWrittenPretestScore(viewer.user),
    pretestDomainBreakdown: getWrittenPretestDomainBreakdown(viewer.user),
    domains: writtenExamDomains,
  });

  return (
    <MockExamResultsView
      basePath="/written"
      domainSlug={selectedDomain?.slug}
      examTitle={
        selectedDomain
          ? `${selectedDomain.title} section mock exam`
          : "Texas CNA written exam — full practice"
      }
      progression={progression}
    />
  );
}
