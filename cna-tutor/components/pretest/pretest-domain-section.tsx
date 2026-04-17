import type { PretestResultsDomain } from "@/lib/onboarding/pretest-results";

export function PretestDomainSection({
  title,
  eyebrow,
  emptyMessage,
  items,
}: {
  title: string;
  eyebrow: string;
  emptyMessage: string;
  items: PretestResultsDomain[];
}) {
  return (
    <section className="panel rounded-[1.75rem] p-6">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
      <div className="mt-5 space-y-3">
        {items.length ? (
          items.map((item) => (
            <article
              key={item.domainSlug}
              className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold">{item.domainTitle}</p>
                <span className="text-sm font-semibold">{item.percent}%</span>
              </div>
              <p className="text-muted mt-2 text-sm leading-6">{item.description}</p>
              <p className="mt-3 text-sm leading-6">
                <span className="font-semibold">Pre-test result:</span> {item.correctCount}/
                {item.totalQuestions} correct
              </p>
            </article>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-4">
            <p className="text-muted text-sm leading-6">{emptyMessage}</p>
          </div>
        )}
      </div>
    </section>
  );
}
