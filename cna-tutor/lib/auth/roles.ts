export const APP_ROLES = ["student", "admin"] as const;

export type AppRole = (typeof APP_ROLES)[number];
