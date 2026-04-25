import Link from "next/link";

import { CohortProgressReport } from "@/components/admin/cohort-progress-report";
import { DomainWeaknessTrends } from "@/components/admin/domain-weakness-trends";
import { ReadinessDistribution } from "@/components/admin/readiness-distribution";
import { PrintReportButton } from "@/components/admin/print-report-button";
import { ParticipantsTable } from "@/components/admin/participants-table";
import { ReportFilters } from "@/components/admin/report-filters";
import { StudentStatusList } from "@/components/admin/student-status-list";
import { TrendLine } from "@/components/dashboard/trend-line";
import { StatCard } from "@/components/dashboard/stat-card";
import { getAdminDashboard } from "@/lib/dashboard/admin";

type SearchParams = Promise<{
  from?: string;
  to?: string;
  cohort?: string;
  activity?: "all" | "active" | "inactive" | "low_hours" | "low_scores";
}>;

function buildExportHref(filters: {
  from: string;
  to: string;
  cohort: string;
  activity: "all" | "active" | "inactive" | "low_hours" | "low_scores";
}) {
  const params = new URLSearchParams();

  if (filters.from) {
    params.set("from", filters.from);
  }

  if (filters.to) {
    params.set("to", filters.to);
  }

  if (filters.cohort) {
    params.set("cohort", filters.cohort);
  }

  if (filters.activity && filters.activity !== "all") {
    params.set("activity", filters.activity);
  }

  const query = params.toString();
  return query ? `/api/reports/participants.csv?${query}` : "/api/reports/participants.csv";
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = await searchParams;
  const dashboard = await getAdminDashboard(filters);

  return (
    <div className="space-y-8">
      <style>{`
        @media print {
          [data-app-shell-header],
          .admin-report-chrome {
            display: none !important;
          }

          .page-shell,
          .page-shell > div,
          .admin-report-print {
            padding: 0 !important;
            margin: 0 !important;
            max-width: none !important;
            gap: 0 !important;
          }

          .admin-report-print {
            display: block !important;
          }

          .admin-report-print .cohort-progress-report-table,
          .admin-report-print .cohort-progress-report-table table,
          .admin-report-print .cohort-progress-report-table thead,
          .admin-report-print .cohort-progress-report-table tbody,
          .admin-report-print .cohort-progress-report-table tr,
          .admin-report-print .cohort-progress-report-table th,
          .admin-report-print .cohort-progress-report-table td {
            background: white !important;
            color: black !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      <section className="panel-strong rounded-[1.75rem] p-6 admin-report-chrome">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Program Oversight</p>
            <h1 className="mt-3 text-3xl font-semibold">See who is progressing, stalled, at risk, or exam ready.</h1>
            <p className="text-muted mt-3 max-w-3xl leading-7">
              This dashboard is built for quick intervention. It highlights pre-test completion, engagement, readiness, and the skill areas that most often need staff follow-up.
            </p>
          </div>
          <Link className="button-secondary" href={buildExportHref(dashboard.filters)}>
            Export roster
          </Link>
        </div>
        <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4 text-sm leading-6">
          <span className="font-semibold">What needs attention now:</span> {dashboard.summary}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6 admin-report-chrome">
        <StatCard
          title="Progressing"
          value={dashboard.statusCounts.progressing.toString()}
          description="Students building readiness with active forward movement"
        />
        <StatCard
          title="Stalled"
          value={dashboard.statusCounts.stalled.toString()}
          description="Students with low recent engagement or little recent work"
        />
        <StatCard
          title="At Risk"
          value={dashboard.statusCounts.atRisk.toString()}
          description="Students whose readiness or weak areas need staff attention"
        />
        <StatCard
          title="Exam Ready"
          value={dashboard.statusCounts.examReady.toString()}
          description="Students currently in the exam-ready range"
        />
        <StatCard
          title="Pre-Test Missing"
          value={dashboard.statusCounts.pretestIncomplete.toString()}
          description="Students who still need the diagnostic before guided study"
        />
        <StatCard
          title="Cohort Confidence"
          value={dashboard.cohortConfidence.average !== null ? dashboard.cohortConfidence.label : "No data yet"}
          description="Average pre-quiz confidence across recent cohort quiz check-ins"
        />
      </section>

      <div className="admin-report-chrome">
        <ReportFilters cohorts={dashboard.cohorts} current={dashboard.filters} />
      </div>

      <section className="grid gap-6 xl:grid-cols-2 admin-report-chrome">
        <StudentStatusList
          emptyMessage="Every student in the current filter set has completed the pre-test."
          eyebrow="Pre-Test Not Completed"
          rows={dashboard.studentsWithoutPretest}
          title="Students who still need the diagnostic."
          tone="bg-[rgba(123,144,158,0.14)] text-[color:var(--foreground)]"
        />
        <StudentStatusList
          emptyMessage="No inactive students are showing right now."
          eyebrow="Needs Check-In"
          rows={dashboard.inactiveStudents}
          title="Students with 5 or more days since last activity."
          tone="bg-[rgba(217,111,50,0.16)] text-[color:#9a4f17]"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2 admin-report-chrome">
        <StudentStatusList
          emptyMessage="No low-engagement students are showing right now."
          eyebrow="Low Engagement"
          rows={dashboard.lowEngagementStudents}
          title="Students who may be drifting or stalled."
          tone="bg-[rgba(166,60,47,0.12)] text-[color:var(--danger)]"
        />
        <DomainWeaknessTrends rows={dashboard.weaknessTrends} studentCount={dashboard.studentCount} />
      </section>

      <section className="panel rounded-[1.75rem] p-6 admin-report-chrome">
        <p className="eyebrow">Confidence Trend</p>
        <h2 className="mt-3 text-2xl font-semibold">See whether cohort confidence is growing with practice.</h2>
        <p className="text-muted mt-3 text-sm leading-6">
          This average comes from the confidence check-in students complete before each quiz.
          {dashboard.cohortConfidence.attemptCount
            ? ` Current sample: ${dashboard.cohortConfidence.attemptCount} quiz check-ins.`
            : " No quiz confidence check-ins yet."}
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-[0.3fr_0.7fr]">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
            <p className="text-sm font-semibold">Current cohort read</p>
            <p className="mt-2 text-2xl font-semibold">
              {dashboard.cohortConfidence.average !== null
                ? dashboard.cohortConfidence.label
                : "No data yet"}
            </p>
            <p className="text-muted mt-2 text-sm leading-6">
              This helps coordinators see whether readiness growth is also feeling real to students.
            </p>
          </div>
          <TrendLine tone="accent" values={dashboard.cohortConfidence.trend} />
        </div>
      </section>

      <section className="admin-report-chrome">
        <ReadinessDistribution
          rows={dashboard.readinessDistribution}
          studentCount={dashboard.studentCount}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] admin-report-chrome">
        <StudentStatusList
          emptyMessage="No weak-readiness group is showing right now."
          eyebrow="Weak Readiness"
          rows={dashboard.weakReadinessStudents}
          title="Students who need targeted support next."
          tone="bg-[rgba(166,60,47,0.12)] text-[color:var(--danger)]"
        />
        <StudentStatusList
          emptyMessage="No students are in the exam-ready range yet."
          eyebrow="Exam Ready"
          rows={dashboard.examReadyStudents}
          title="Students who are ready for final confidence checks."
          tone="bg-[rgba(23,60,255,0.12)] text-[color:var(--brand-strong)]"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] admin-report-chrome">
        <section className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">How To Use This</p>
          <h2 className="mt-3 text-2xl font-semibold">Triage in this order.</h2>
          <div className="mt-5 grid gap-4">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
              <p className="text-sm font-semibold">1. Clear the pre-test backlog</p>
              <p className="text-muted mt-2 text-sm leading-6">
                Students without the pre-test do not yet have a ranked study path, so they are the first bottleneck to clear.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
              <p className="text-sm font-semibold">2. Re-engage stalled students</p>
              <p className="text-muted mt-2 text-sm leading-6">
                A readiness score cannot climb if the student is no longer working. Restart the next guided module first.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
              <p className="text-sm font-semibold">3. Target weak readiness by category</p>
              <p className="text-muted mt-2 text-sm leading-6">
                Use the weakness trends and student weak-area lists to focus staff coaching where it can move readiness fastest.
              </p>
            </div>
          </div>
        </section>
      </section>

      <section className="panel rounded-[1.75rem] p-6 admin-report-print">
        <div className="admin-report-chrome flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Cohort Progress Report</p>
            <h2 className="mt-2 text-2xl font-semibold">Printable cohort-by-cohort readiness table.</h2>
            <p className="text-muted mt-3 max-w-3xl text-sm leading-6">
              Use the cohort dropdown above to narrow this report to one program group, then export or print the exact student list below.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="button-secondary" href={buildExportHref(dashboard.filters)}>
              Export CSV
            </Link>
            <PrintReportButton />
          </div>
        </div>
        <div className="mt-5">
          <CohortProgressReport rows={dashboard.participantRows} />
        </div>
      </section>

      <section className="panel rounded-[1.75rem] p-6 admin-report-chrome">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Program Roster</p>
            <h2 className="mt-2 text-2xl font-semibold">Actionable student-by-student view.</h2>
          </div>
          <Link className="button-secondary" href={buildExportHref(dashboard.filters)}>
            Download CSV
          </Link>
        </div>
        <div className="mt-5">
          <ParticipantsTable rows={dashboard.participantRows} />
        </div>
      </section>
    </div>
  );
}
