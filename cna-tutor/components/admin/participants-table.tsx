export function ParticipantsTable({
  rows,
}: {
  rows: Array<{
    id: string;
    name: string;
    email: string;
    cohort: string;
    totalHours: string;
    activeHours: string;
    lessonsCompleted: number;
    quizzesTaken: number;
    mockExamsTaken: number;
    averageScore: number;
    masteryLevel: string;
    masteryScore: number;
    lastLogin: string;
    lastActivity: string;
    completionPercent: number;
  }>;
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-white/75">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-[rgba(29,42,38,0.04)]">
            <tr>
              <th className="px-4 py-3 font-medium">Participant</th>
              <th className="px-4 py-3 font-medium">Cohort</th>
              <th className="px-4 py-3 font-medium">Total Hours</th>
              <th className="px-4 py-3 font-medium">Active Hours</th>
              <th className="px-4 py-3 font-medium">Lessons</th>
              <th className="px-4 py-3 font-medium">Quizzes</th>
              <th className="px-4 py-3 font-medium">Mock Exams</th>
              <th className="px-4 py-3 font-medium">Avg Score</th>
              <th className="px-4 py-3 font-medium">Mastery</th>
              <th className="px-4 py-3 font-medium">Last Login</th>
              <th className="px-4 py-3 font-medium">Last Activity</th>
              <th className="px-4 py-3 font-medium">Completion</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-[var(--border)] align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium">{row.name}</p>
                    <p className="text-muted mt-1 text-xs">{row.email}</p>
                  </td>
                  <td className="px-4 py-3">{row.cohort}</td>
                  <td className="px-4 py-3">{row.totalHours}</td>
                  <td className="px-4 py-3">{row.activeHours}</td>
                  <td className="px-4 py-3">{row.lessonsCompleted}</td>
                  <td className="px-4 py-3">{row.quizzesTaken}</td>
                  <td className="px-4 py-3">{row.mockExamsTaken}</td>
                  <td className="px-4 py-3">{row.averageScore}%</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{row.masteryLevel}</p>
                    <p className="text-muted mt-1 text-xs">{row.masteryScore}% mastery</p>
                  </td>
                  <td className="px-4 py-3">{row.lastLogin}</td>
                  <td className="px-4 py-3">{row.lastActivity}</td>
                  <td className="px-4 py-3">{row.completionPercent}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-6 text-sm text-[color:var(--muted)]" colSpan={12}>
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
