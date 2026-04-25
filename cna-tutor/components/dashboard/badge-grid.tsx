import { BadgeIcon } from "@/components/badges/badge-icon";

type BadgeGridBadge = {
  slug: string;
  title: string;
  description: string;
  iconSlug: string;
  unlockConditionText: string;
  category: string;
  earned: boolean;
  earnedAt: string | null;
};

export function BadgeGrid({
  badges,
}: {
  badges: BadgeGridBadge[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {badges.map((badge) => (
        <div
          key={badge.slug}
          className={`rounded-[1.5rem] border p-4 transition-all ${
            badge.earned
              ? "border-[rgba(217,111,50,0.22)] bg-[linear-gradient(135deg,rgba(255,247,237,0.98),rgba(255,255,255,0.98))] shadow-[0_18px_34px_rgba(217,111,50,0.12)]"
              : "border-[var(--border)] bg-[rgba(248,250,252,0.86)] opacity-70"
          }`}
        >
          <div className="flex items-start gap-4">
            <BadgeIcon
              className={`h-16 w-16 shrink-0 ${badge.earned ? "text-[color:#d97706]" : "text-[color:var(--muted)]"}`}
              iconSlug={badge.iconSlug}
            />
            <div className="min-w-0">
              <p className="eyebrow">{badge.category}</p>
              <h3 className="mt-2 text-lg font-semibold">{badge.title}</h3>
              <p className="text-muted mt-2 text-sm leading-6">
                {badge.earned ? badge.description : badge.unlockConditionText}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--muted)]">
                {badge.earned
                  ? `Earned${badge.earnedAt ? ` • ${new Date(badge.earnedAt).toLocaleDateString()}` : ""}`
                  : "Locked"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
