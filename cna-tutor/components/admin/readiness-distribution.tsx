export function ReadinessDistribution({
  rows,
  studentCount,
}: {
  rows: Array<{ label: string; count: number; color: string }>;
  studentCount: number;
}) {
  const total = Math.max(1, studentCount);
  const maxCount = Math.max(1, ...rows.map((r) => r.count));

  return (
    <section className="panel rounded-[1.75rem] p-6">
      <p className="eyebrow">Readiness Distribution</p>
      <h2 className="mt-3 text-2xl font-semibold">Where the cohort stands today.</h2>
      <p className="text-muted mt-3 text-sm leading-6">
        Each band shows how many students fall in that readiness score range. Use this to spot whether the
        cohort is clustered at early stages or advancing toward exam readiness.
      </p>
      <div className="mt-5 space-y-3">
        {rows.map((row) => {
          const pct = Math.round((row.count / total) * 100);
          const barWidth = row.count === 0 ? 0 : Math.max(6, (row.count / maxCount) * 100);
          return (
            <div key={row.label} className="flex items-center gap-4">
              <span className="w-20 shrink-0 text-right text-sm font-semibold tabular-nums">
                {row.label}
              </span>
              <div className="relative flex-1">
                <div className="h-8 w-full overflow-hidden rounded-full bg-[rgba(123,144,158,0.1)]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${row.color}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
              <span className="w-24 shrink-0 text-sm tabular-nums text-[color:var(--muted)]">
                {row.count} student{row.count !== 1 ? "s" : ""}{" "}
                <span className="text-xs">({pct}%)</span>
              </span>
            </div>
          );
        })}
      </div>
      {studentCount === 0 && (
        <p className="mt-4 text-sm text-[color:var(--muted)]">
          Distribution will appear once students begin the program.
        </p>
      )}
    </section>
  );
}
