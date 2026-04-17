type StudentStatusListRow = {
  id: string;
  name: string;
  email: string;
  cohort: string;
  readinessLabel: string;
  readinessScore: number | null;
  weakAreasPreview: string;
  nextAction: string;
};

export function StudentStatusList({
  title,
  eyebrow,
  emptyMessage,
  tone,
  rows,
}: {
  title: string;
  eyebrow: string;
  emptyMessage: string;
  tone: string;
  rows: StudentStatusListRow[];
}) {
  return (
    <section className="panel rounded-[1.75rem] p-6">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
      <div className="mt-5 space-y-3">
        {rows.length ? (
          rows.map((row) => (
            <article
              key={row.id}
              className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{row.name}</p>
                  <p className="text-muted mt-1 text-sm">{row.email}</p>
                  <p className="text-muted mt-1 text-xs uppercase tracking-[0.16em]">{row.cohort}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${tone}`}>
                  {row.readinessScore !== null ? `${row.readinessScore}% ${row.readinessLabel}` : row.readinessLabel}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6">
                <span className="font-semibold">Weak areas:</span> {row.weakAreasPreview}
              </p>
              <p className="text-muted mt-2 text-sm leading-6">
                <span className="font-semibold text-[color:var(--foreground)]">Next action:</span> {row.nextAction}
              </p>
            </article>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4 text-sm text-[color:var(--muted)]">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}
