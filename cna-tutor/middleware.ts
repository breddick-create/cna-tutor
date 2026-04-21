import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? request.nextUrl.hostname;

  if (host === "cna-tutor.vercel.app") {
    const nextUrl = request.nextUrl.clone();
    nextUrl.hostname = "hcci-tutor.vercel.app";
    return NextResponse.redirect(nextUrl, 308);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
