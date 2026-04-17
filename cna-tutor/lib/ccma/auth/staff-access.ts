import { env } from "@/lib/env";

const FALLBACK_INVITE = "ccma-staff";

export function resolveCcmaStaffAccessToken(raw: string | null | undefined) {
  return typeof raw === "string" ? raw.trim() : "";
}

export function isValidCcmaStaffAccessToken(raw: string | null | undefined) {
  const token = resolveCcmaStaffAccessToken(raw);
  const expected = env.adminSignUpCode?.trim() || FALLBACK_INVITE;
  return Boolean(token) && token === expected;
}

