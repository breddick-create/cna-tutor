import { env } from "@/lib/env";

type HeaderStoreLike = {
  get(name: string): string | null;
};

function stripTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function resolveAppUrl(headers?: HeaderStoreLike) {
  const origin = headers?.get("origin");
  if (origin) {
    return stripTrailingSlash(origin);
  }

  const forwardedHost = headers?.get("x-forwarded-host");
  if (forwardedHost) {
    const forwardedProto = headers?.get("x-forwarded-proto") ?? "https";
    return `${forwardedProto}://${stripTrailingSlash(forwardedHost)}`;
  }

  const host = headers?.get("host");
  if (host) {
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    return `${protocol}://${stripTrailingSlash(host)}`;
  }

  return stripTrailingSlash(env.appUrl);
}
