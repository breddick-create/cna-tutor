export function ProgressBar({
  value,
}: {
  value: number;
}) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="h-3 overflow-hidden rounded-full bg-[rgba(123,144,158,0.14)]">
      <div
        className="h-full rounded-full bg-[linear-gradient(135deg,var(--brand),var(--accent))]"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
