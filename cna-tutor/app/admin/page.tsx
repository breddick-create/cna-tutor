import Link from "next/link";

import { ChartCard } from "@/components/admin/chart-card";
import { ParticipantsTable } from "@/components/admin/participants-table";
import { ReportFilters } from "@/components/admin/report-filters";
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
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Participants"
          value={dashboard.studentCount.toString()}
          description="Learners matching current filters"
        />
        <StatCard
          title="Active This Week"
          value={dashboard.activeThisWeek.toString()}
          description="Participants with recent engagement"
        />
        <StatCard
          title="Active Study Hours"
          value={dashboard.totalActiveHours}
          description="Within the selected date range"
        />
        <StatCard
          title="Avg Completion"
          value={`${dashboard.averageCompletion}%`}
          description="Progress toward study-hour goals"
        />
      </section>

      <ReportFilters cohorts={dashboard.cohorts} current={dashboard.filters} />

      <section className="grid gap-6 xl:grid-cols-3">
        <ChartCard
          data={dashboard.charts.studyHoursTrend}
          subtitle="Active study hours logged each day."
          title="Study Hours Over Time"
        />
        <ChartCard
          data={dashboard.charts.engagementTrend}
          subtitle="Number of learners active on each day."
          title="Engagement Trend"
        />
        <ChartCard
          data={dashboard.charts.completionRates}
          subtitle="Average completion by cohort in the current filter window."
          title="Completion Rates"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="panel rounded-[1.75rem] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Watch List</p>
              <h2 className="mt-2 text-2xl font-semibold">Participants who need attention.</h2>
            </div>
            <Link className="button-secondary" href={buildExportHref(dashboard.filters)}>
              Export CSV
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {dashboard.watchList.length ? (
              dashboard.watchList.map((student) => (
                <div
                  key={student.id}
                  className="rounded-3xl border border-[var(--border)] bg-white/70 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{student.fullName}</p>
                      <p className="text-muted mt-1 text-sm">{student.email}</p>
                    </div>
                    <span className="rounded-full bg-[rgba(166,60,47,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--danger)]">
                      follow up
                    </span>
                  </div>
                  <p className="text-muted mt-3 text-sm leading-6">{student.reason}</p>
                </div>
              ))
            ) : (
              <p className="text-muted rounded-3xl border border-[var(--border)] bg-white/70 p-4 text-sm">
                No participants currently meet the watch-list threshold.
              </p>
            )}
          </div>
        </div>

        <div className="panel rounded-[1.75rem] p-6">
          <p className="eyebrow">Recent Participants</p>
          <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-white/75">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-[rgba(29,42,38,0.04)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Participant</th>
                  <th className="px-4 py-3 font-medium">Cohort</th>
                  <th className="px-4 py-3 font-medium">Hours</th>
                  <th className="px-4 py-3 font-medium">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentStudents.length ? (
                  dashboard.recentStudents.map((student) => (
                    <tr key={student.id} className="border-t border-[var(--border)]">
                      <td className="px-4 py-3">
                        <p className="font-medium">{student.fullName}</p>
                        <p className="text-muted mt-1 text-xs">{student.email}</p>
                      </td>
                      <td className="px-4 py-3">{student.cohort}</td>
                      <td className="px-4 py-3">{student.activeHours}</td>
                      <td className="px-4 py-3">{student.lastActivity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-6 text-muted" colSpan={4}>
                      Student rows will appear here after the first accounts are created.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="panel rounded-[1.75rem] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Participant Report</p>
            <h2 className="mt-2 text-2xl font-semibold">Reporting table for export and follow-up.</h2>
          </div>
          <Link className="button-secondary" href={buildExportHref(dashboard.filters)}>
            Download report
          </Link>
        </div>
        <div className="mt-5">
          <ParticipantsTable rows={dashboard.participantRows} />
        </div>
      </section>
    </div>
  );
}
