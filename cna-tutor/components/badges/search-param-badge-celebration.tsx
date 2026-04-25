"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { BadgeCelebrationModal, type EarnedBadgePresentation } from "@/components/badges/badge-celebration-modal";
import { getBadgeBySlug } from "@/lib/learning/badge-definitions";

export function SearchParamBadgeCelebration() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);

  const badges = useMemo(() => {
    const slugs = (searchParams.get("earned_badges") ?? "")
      .split(",")
      .map((slug) => slug.trim())
      .filter(Boolean);

    return slugs
      .map((slug) => {
        const definition = getBadgeBySlug(slug);
        if (!definition) {
          return null;
        }

        return {
          slug,
          title: definition.title,
          description: definition.description,
          iconSlug: definition.iconSlug,
        } satisfies EarnedBadgePresentation;
      })
      .filter((badge) => badge !== null);
  }, [searchParams]);

  useEffect(() => {
    setDismissed(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!badges.length || typeof window === "undefined") {
      return;
    }

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.delete("earned_badges");
    window.history.replaceState({}, "", nextUrl.toString());
  }, [badges]);

  if (!badges.length || dismissed) {
    return null;
  }

  return <BadgeCelebrationModal badges={badges} onDismiss={() => setDismissed(true)} />;
}
