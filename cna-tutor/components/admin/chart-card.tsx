export function ChartCard({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle: string;
  data: Array<{ label: string; value: number }>;
}) {
  const maxValue = Math.max(1, ...data.map((item) => item.value));

  return (
    <div className="panel rounded-[1.75rem] p-6">
      <p className="eyebrow">{title}</p>
      <p className="text-muted mt-2 text-sm leading-6">{subtitle}</p>
      <div className="mt-5 space-y-3">
        {data.length ? (
          data.map((item) => (
            <div key={`${title}-${item.label}`} className="space-y-2">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span>{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[rgba(123,144,158,0.14)]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(135deg,var(--brand),var(--accent))]"
                  style={{ width: `${Math.max(8, (item.value / maxValue) * 100)}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted text-sm">No data yet for this time range.</p>
        )}
      </div>
    </div>
  );
}

