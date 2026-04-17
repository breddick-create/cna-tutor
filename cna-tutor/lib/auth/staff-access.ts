import { env } from "@/lib/env";

function readFirstString(value: string | string[] | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

export function isValidStaffAccessToken(token: string) {
  return Boolean(env.adminSignUpCode) && token === env.adminSignUpCode;
}

export function resolveStaffAccessToken(
  params: Record<string, string | string[] | undefined>,
) {
  const candidates = [
    readFirstString(params.invite),
    readFirstString(params.code),
    readFirstString(params.setup_code),
  ];

  return candidates.find((candidate) => isValidStaffAccessToken(candidate)) ?? null;
}
