export type BadgeNotification = {
  slug: string;
};

const BADGE_QUERY_KEY = "earned_badges";

export function appendEarnedBadgesParam(path: string, badges: BadgeNotification[]): string {
  const uniqueSlugs = [...new Set(badges.map((badge) => badge.slug).filter(Boolean))].slice(0, 6);

  if (!uniqueSlugs.length) {
    return path;
  }

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${BADGE_QUERY_KEY}=${encodeURIComponent(uniqueSlugs.join(","))}`;
}

export function getEarnedBadgesQueryKey() {
  return BADGE_QUERY_KEY;
}
