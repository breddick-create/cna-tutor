import Link from "next/link";

import { getRdaAdminDashboard } from "@/lib/rda/dashboard/admin";
import { requireRdaAdmin } from "@/lib/rda/auth/session";
import { createRdaAdminNote } from "./actions";

type SearchParams = Promise<{
  cohort?: string;
  activity?: "all" | "inactive" | "needs_check_in" | "mock_missing";
  student?: string;
}>;

const NOTE_TYPE_LABELS: Record<string, string> = {
  general: "General",
  check_in: "Check-In",
  risk: "Risk",
  encouragement: "Encouragement",
  academic: "Academic",
};

export default async function RdaAdminPage({ searchParams }: { searchParams: SearchParams }) {
  await requireRdaAdmin();
  const filters = await searchParams;
  const selectedStudentId = filters.student;
  const dashboard = await getRdaAdminDashboard({ ...filters, selectedStudentId });
  const selectedStudent = selectedStudentId
    ? dashboard.exportRows.find((r) => r.id === selectedStudentId) ??
      dashboard.needsCheckIn.find((r) => r.id === selectedStudentId)
    : null;

  return (
    <main className="page-shell px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="panel-strong rounded-[1.75rem] p-6">
          <p className="eyebrow">RDA Program Oversight</p>
          <h1 className="mt-3 text-3xl font-semibold">
            Track readiness, weak areas, inactivity, and mock exam gates.
          </h1>
          <p className="text-muted mt-3 leading-7">
            Students flagged for check-in appear at the top of the roster. Inactive = no study
            activity in 7+ days and not yet Exam Ready.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="panel rounded-[1.5rem] p-5">
            <p className="text-sm font-semibold">Students</p>
            <p className="mt-2 text-3xl font-semibold">{dashboard.studentCount}</p>
          </div>
          <div className="panel rounded-[1.5rem] p-5">
            <p className="text-sm font-semibold">Needs Check-In</p>
            <p className="mt-2 text-3xl font-semibold">{dashboard.needsCheckIn.length}</p>
          </div>
          <div className="panel rounded-[1.5rem] p-5">
            <p className="text-sm font-semibold">Mock Completed</p>
            <p className="mt-2 text-3xl font-semibold">{dashboard.mockExamCompletion.completed}</p>
          </div>
          <div className="panel rounded-[1.5rem] p-5">
            <p className="text-sm font-semibold">Exam Ready</p>
            <p className="mt-2 text-3xl font-semibold">{dashboard.readinessDistribution.examReady}</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="panel rounded-[1.5rem] p-5">
            <p className="eyebrow">Weak Area Analysis</p>
            <div className="mt-4 space-y-3">
              {dashboard.weakAreaAnalysis.map((row) => (
                <div
                  key={row.domainSlug}
                  className="flex justify-between rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4"
                >
                  <span className="font-semibold">{row.domainTitle}</span>
                  <span>{row.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel rounded-[1.5rem] p-5">
            <p className="eyebrow">Readiness Distribution</p>
            <div className="mt-4 space-y-3 text-sm leading-6">
              <p>Not Ready: {dashboard.readinessDistribution.notReady}</p>
              <p>Making Progress: {dashboard.readinessDistribution.makingProgress}</p>
              <p>Almost There: {dashboard.readinessDistribution.almostThere}</p>
              <p>Exam Ready: {dashboard.readinessDistribution.examReady}</p>
            </div>
          </div>
        </section>

        {/* Export-ready table */}
        <section className="panel rounded-[1.5rem] p-5">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Student Roster</p>
            <a
              href="/api/rda/admin/export"
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Export CSV
            </a>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="py-3">Student</th>
                  <th>Cohort</th>
                  <th>Readiness</th>
                  <th>Weak Areas</th>
                  <th>Mock Exams</th>
                  <th>Last Activity</th>
                  <th>Notes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.exportRows.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-b border-[var(--border)] ${row.needsCheckIn ? "bg-amber-50/60" : ""}`}
                  >
                    <td className="py-3">
                      <p className="font-semibold">{row.name}</p>
                      <p className="text-muted">{row.email}</p>
                    </td>
                    <td>{row.cohort}</td>
                    <td>
                      {row.readinessScore ?? "—"}{" "}
                      <span className="text-muted">{row.readinessLabel}</span>
                    </td>
                    <td>{Array.isArray(row.weakAreas) ? row.weakAreas.length : 0}</td>
                    <td>{row.mockExamsCompleted}</td>
                    <td>
                      {row.lastActivity
                        ? new Date(row.lastActivity).toLocaleDateString()
                        : "—"}
                      {row.inactiveDays !== null && row.inactiveDays >= 7 && (
                        <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-800">
                          {row.inactiveDays}d inactive
                        </span>
                      )}
                    </td>
                    <td>
                      <Link
                        href={`/rda-admin?student=${row.id}`}
                        className="text-[color:var(--brand)] underline"
                      >
                        {row.adminNoteCount} {row.adminNoteCount === 1 ? "note" : "notes"}
                      </Link>
                    </td>
                    <td>
                      {row.needsCheckIn ? (
                        <span className="rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                          Check-In
                        </span>
                      ) : (
                        <span className="text-muted text-xs">OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Notes panel for selected student */}
        {selectedStudent && (
          <section className="panel rounded-[1.5rem] p-5">
            <div className="flex items-center justify-between">
              <p className="eyebrow">
                Notes — {selectedStudent.name}
              </p>
              <Link href="/rda-admin" className="text-sm text-[color:var(--muted)] hover:underline">
                Close
              </Link>
            </div>

            {/* Existing notes */}
            {dashboard.selectedStudentNotes.length === 0 ? (
              <p className="text-muted mt-4 text-sm">No notes yet for this student.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {dashboard.selectedStudentNotes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-semibold ${
                          note.note_type === "risk"
                            ? "bg-red-100 text-red-800"
                            : note.note_type === "check_in"
                              ? "bg-amber-100 text-amber-800"
                              : note.note_type === "encouragement"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {NOTE_TYPE_LABELS[note.note_type] ?? note.note_type}
                      </span>
                      <span className="text-muted text-xs">
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6">{note.note}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add note form */}
            <form action={createRdaAdminNote} className="mt-6 space-y-3">
              <input type="hidden" name="studentId" value={selectedStudent.id} />
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <textarea
                  name="note"
                  required
                  rows={3}
                  placeholder="Add a note about this student…"
                  className="w-full rounded-[1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
                />
                <div className="flex flex-col gap-3">
                  <select
                    name="noteType"
                    className="rounded-[1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm"
                  >
                    <option value="general">General</option>
                    <option value="check_in">Check-In</option>
                    <option value="risk">Risk</option>
                    <option value="encouragement">Encouragement</option>
                    <option value="academic">Academic</option>
                  </select>
                  <button
                    type="submit"
                    className="button-primary rounded-[1rem] px-5 py-3 text-sm font-semibold"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
