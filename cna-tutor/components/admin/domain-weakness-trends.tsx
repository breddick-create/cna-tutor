export function DomainWeaknessTrends({
  rows,
  studentCount,
}: {
  rows: Array<{
    domainSlug: string;
    domainTitle: string;
    studentCount: number;
    averageMastery: number;
  }>;
  studentCount: number;
}) {
  const maxStudentCount = Math.max(1, ...rows.map((row) => row.studentCount));

  return (
    <section className="panel rounded-[1.75rem] p-6">
      <p className="eyebrow">Category Weakness Trends</p>
      <h2 className="mt-3 text-2xl font-semibold">Where students are struggling most.</h2>
      <p className="text-muted mt-3 text-sm leading-6">
        These counts reflect how many students are still below the target range in each skill area.
      </p>
      <div className="mt-5 space-y-4">
        {rows.length ? (
          rows.map((row) => (
            <article
              key={row.domainSlug}
              className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{row.domainTitle}</p>
                  <p className="text-muted mt-1 text-sm">
                    {row.studentCount} of {studentCount} students below target
                  </p>
                </div>
                <span className="text-sm font-semibold">{row.averageMastery}% avg mastery</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-[rgba(123,144,158,0.14)]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(135deg,var(--accent),var(--brand))]"
                  style={{ width: `${Math.max(10, (row.studentCount / maxStudentCount) * 100)}%` }}
                />
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4 text-sm text-[color:var(--muted)]">
            Weakness trends will appear here once students complete the pre-test and begin guided study.
          </div>
        )}
      </div>
    </section>
  );
}
