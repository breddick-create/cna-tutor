function getStatusTone(status: string) {
  if (status === "Exam ready") {
    return "bg-[rgba(23,60,255,0.12)] text-[color:var(--brand-strong)]";
  }

  if (status === "Progressing") {
    return "bg-[rgba(255,185,0,0.16)] text-[color:#7a5700]";
  }

  if (status === "Pre-test not completed") {
    return "bg-[rgba(123,144,158,0.14)] text-[color:var(--foreground)]";
  }

  return "bg-[rgba(166,60,47,0.12)] text-[color:var(--danger)]";
}

export function ParticipantsTable({
  rows,
}: {
  rows: Array<{
    id: string;
    name: string;
    email: string;
    cohort: string;
    statusLabel: string;
    readinessLabel: string;
    readinessScore: number | null;
    weakAreasPreview: string;
    nextAction: string;
    activeHours: string;
    lessonsCompleted: number;
    quizzesTaken: number;
    mockExamsTaken: number;
    lastActivity: string;
  }>;
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-white/75">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-[rgba(123,144,158,0.08)]">
            <tr>
              <th className="px-4 py-3 font-medium">Student</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Readiness</th>
              <th className="px-4 py-3 font-medium">Activity</th>
              <th className="px-4 py-3 font-medium">Work Completed</th>
              <th className="px-4 py-3 font-medium">Weak Areas</th>
              <th className="px-4 py-3 font-medium">Next Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-[var(--border)] align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium">{row.name}</p>
                    <p className="text-muted mt-1 text-xs">{row.email}</p>
                    <p className="text-muted mt-1 text-xs uppercase tracking-[0.16em]">{row.cohort}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${getStatusTone(row.statusLabel)}`}
                    >
                      {row.statusLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">
                      {row.readinessScore !== null ? `${row.readinessScore}%` : "Not scored yet"}
                    </p>
                    <p className="text-muted mt-1 text-xs">{row.readinessLabel}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{row.activeHours}</p>
                    <p className="text-muted mt-1 text-xs">{row.lastActivity}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{row.lessonsCompleted} lessons</p>
                    <p className="text-muted mt-1 text-xs">
                      {row.quizzesTaken} quizzes, {row.mockExamsTaken} full mocks
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="max-w-xs leading-6">{row.weakAreasPreview}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="max-w-sm leading-6">{row.nextAction}</p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-6 text-sm text-[color:var(--muted)]" colSpan={7}>
                  No participants match the current filter set.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
