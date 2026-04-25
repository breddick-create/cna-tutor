"use client";

import { useMemo, useState } from "react";

import { BadgeIcon } from "@/components/badges/badge-icon";
import { getBadgeBySlug } from "@/lib/learning/badge-definitions";

export type EarnedBadgePresentation = {
  slug: string;
  title: string;
  description: string;
  iconSlug?: string;
};

function resolveBadge(badge: EarnedBadgePresentation): EarnedBadgePresentation & { iconSlug: string } {
  const definition = getBadgeBySlug(badge.slug);
  return {
    ...badge,
    iconSlug: badge.iconSlug ?? definition?.iconSlug ?? "star-first",
  };
}

export function BadgeCelebrationModal({
  badges,
  onDismiss,
}: {
  badges: EarnedBadgePresentation[];
  onDismiss: () => void;
}) {
  const [index, setIndex] = useState(0);
  const resolved = useMemo(() => badges.map(resolveBadge), [badges]);
  const badge = resolved[index];

  if (!badge) {
    return null;
  }

  const last = index === resolved.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(17,24,39,0.42)] p-4 sm:items-center">
      <div className="w-full max-w-md rounded-[2rem] border border-[rgba(255,255,255,0.45)] bg-[linear-gradient(180deg,rgba(255,250,244,0.98),rgba(255,255,255,0.98))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
        <p className="eyebrow text-[color:#9a4f17]">Badge Earned</p>
        <div className="mt-4 flex items-center gap-4">
          <BadgeIcon className="h-20 w-20 shrink-0 text-[color:#d97706]" iconSlug={badge.iconSlug} />
          <div>
            <h3 className="text-2xl font-semibold tracking-[-0.02em]">{badge.title}</h3>
            <p className="text-muted mt-2 text-sm leading-6">{badge.description}</p>
          </div>
        </div>
        <div className="mt-5 rounded-[1.25rem] border border-[rgba(217,111,50,0.18)] bg-[rgba(255,245,235,0.9)] px-4 py-3 text-sm leading-6 text-[color:#7c4a1d]">
          You earned this by hitting a real progress milestone. Keep stacking focused work and the next one will come.
        </div>
        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-muted text-xs">
            {index + 1} of {resolved.length}
          </p>
          <div className="flex gap-3">
            {!last ? (
              <button
                className="button-secondary"
                onClick={() => setIndex((current) => current + 1)}
                type="button"
              >
                Next badge
              </button>
            ) : null}
            <button className="button-primary" onClick={onDismiss} type="button">
              {last ? "Keep going" : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
