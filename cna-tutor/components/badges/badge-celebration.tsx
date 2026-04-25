"use client";

import { useEffect, useState } from "react";

import { BadgeIcon } from "@/components/badges/badge-icon";
import { getBadgeBySlug } from "@/lib/learning/badge-definitions";

type BadgeCelebrationItem = {
  slug: string;
  title: string;
  description: string;
};

export function BadgeCelebration({
  badges,
  storageKey,
}: {
  badges: BadgeCelebrationItem[];
  storageKey?: string;
}) {
  const [visibleBadges, setVisibleBadges] = useState<BadgeCelebrationItem[]>([]);

  useEffect(() => {
    if (!badges.length) {
      return;
    }

    if (storageKey && typeof window !== "undefined") {
      const fingerprint = JSON.stringify(badges.map((badge) => badge.slug).sort());
      const seen = window.sessionStorage.getItem(storageKey);

      if (seen === fingerprint) {
        return;
      }

      window.sessionStorage.setItem(storageKey, fingerprint);
    }

    setVisibleBadges(badges);
  }, [badges, storageKey]);

  if (!visibleBadges.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 mx-auto flex max-w-2xl flex-col gap-3 px-4">
      {visibleBadges.map((badge) => {
        const definition = getBadgeBySlug(badge.slug);

        return (
          <div
            key={badge.slug}
            className="pointer-events-auto rounded-[1.5rem] border border-[rgba(32,77,141,0.14)] bg-[linear-gradient(135deg,rgba(255,249,242,0.98),rgba(247,250,255,0.98))] p-4 shadow-[0_16px_36px_rgba(32,48,61,0.18)]"
          >
            <div className="flex items-start gap-4">
              <BadgeIcon className="h-12 w-12 shrink-0" iconSlug={definition?.iconSlug ?? "trophy"} />
              <div className="min-w-0 flex-1">
                <p className="eyebrow text-[color:#9a4f17]">Badge Earned</p>
                <h3 className="mt-2 text-lg font-semibold">{badge.title}</h3>
                <p className="text-muted mt-2 text-sm leading-6">{badge.description}</p>
              </div>
              <button
                className="button-secondary shrink-0"
                onClick={() =>
                  setVisibleBadges((current) => current.filter((item) => item.slug !== badge.slug))
                }
                type="button"
              >
                Dismiss
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
