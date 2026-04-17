type CohortProgressRow = {
  id: string;
  name: string;
  cohort: string;
  readinessLabel: string;
  topWeakAreas: string[];
  lastActivity: string;
  mockExamsTaken: number;
};

export function CohortProgressReport({
  rows,
}: {
  rows: CohortProgressRow[];
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-white/80 cohort-progress-report-table">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-[rgba(123,144,158,0.08)]">
            <tr>
              <th className="px-4 py-3 font-medium">Student Name</th>
              <th className="px-4 py-3 font-medium">Cohort</th>
              <th className="px-4 py-3 font-medium">Readiness</th>
              <th className="px-4 py-3 font-medium">Weak Area 1</th>
              <th className="px-4 py-3 font-medium">Weak Area 2</th>
              <th className="px-4 py-3 font-medium">Last Activity</th>
              <th className="px-4 py-3 font-medium">Mock Exams Completed</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-[var(--border)] align-top">
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="px-4 py-3">{row.cohort}</td>
                  <td className="px-4 py-3">{row.readinessLabel}</td>
                  <td className="px-4 py-3">{row.topWeakAreas[0] ?? "None flagged"}</td>
                  <td className="px-4 py-3">{row.topWeakAreas[1] ?? "None flagged"}</td>
                  <td className="px-4 py-3">{row.lastActivity}</td>
                  <td className="px-4 py-3">{row.mockExamsTaken}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-6 text-sm text-[color:var(--muted)]" colSpan={7}>
                  No students match the current cohort filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
