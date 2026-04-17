export function TrendLine({
  values,
  tone = "brand",
}: {
  values: number[];
  tone?: "brand" | "accent";
}) {
  if (values.length < 2) {
    return (
      <div className="flex h-20 items-center justify-center rounded-[1.25rem] border border-[var(--border)] bg-white/70 text-sm text-[color:var(--muted)]">
        Trend will appear after a few check-ins.
      </div>
    );
  }

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(1, max - min);
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  const stroke = tone === "accent" ? "var(--accent)" : "var(--brand)";

  return (
    <div className="rounded-[1.25rem] border border-[var(--border)] bg-white/70 p-3">
      <svg aria-hidden="true" className="h-20 w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          points={points}
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
