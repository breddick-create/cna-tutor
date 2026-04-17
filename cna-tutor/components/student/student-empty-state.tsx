import Link from "next/link";

export function StudentEmptyState({
  eyebrow = "Start Here",
  title,
  description,
  primaryAction,
  secondaryAction,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  primaryAction?: {
    href: string;
    label: string;
  };
  secondaryAction?: {
    href: string;
    label: string;
  };
  compact?: boolean;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-5 shadow-[0_12px_30px_rgba(32,48,61,0.05)]">
      <p className="eyebrow">{eyebrow}</p>
      <h3 className={`mt-3 font-semibold ${compact ? "text-lg" : "text-2xl"}`}>{title}</h3>
      <p className="text-muted mt-3 text-sm leading-6">{description}</p>
      {primaryAction || secondaryAction ? (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {primaryAction ? (
            <Link className="button-primary w-full sm:w-auto" href={primaryAction.href}>
              {primaryAction.label}
            </Link>
          ) : null}
          {secondaryAction ? (
            <Link className="button-secondary w-full sm:w-auto" href={secondaryAction.href}>
              {secondaryAction.label}
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
