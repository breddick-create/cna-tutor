import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/env";
import {
  isAnyPretestPath,
  isPretestIntroPath,
  isPretestStartPath,
  isStudentProtectedPath,
} from "@/lib/progression/paths";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabase = createServerClient<Database>(
    env.supabaseUrl,
    env.supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isStudentProtectedPath(request.nextUrl.pathname)) {
    return response;
  }

  const role = user.user_metadata?.role === "admin" ? "admin" : "student";
  const pretestComplete = typeof user.user_metadata?.pretest_completed_at === "string";
  const onPretestIntroPath = isPretestIntroPath(request.nextUrl.pathname);
  const onPretestStartPath = isPretestStartPath(request.nextUrl.pathname);
  const onAnyPretestPath = isAnyPretestPath(request.nextUrl.pathname);

  if (role === "student" && !pretestComplete && !onAnyPretestPath) {
    return NextResponse.redirect(new URL("/pretest", request.url));
  }

  if (role === "student" && pretestComplete && (onPretestIntroPath || onPretestStartPath)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
