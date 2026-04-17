import { NextResponse } from "next/server";

import { getStudentAuthRedirectPathForUser as getCcmaStudentAuthRedirectPathForUser } from "@/lib/ccma/progression/stage";
import { resolveProductFromMetadata } from "@/lib/auth/session";
import { getStudentAuthRedirectPathForUser } from "@/lib/progression/stage";
import { createClient } from "@/lib/supabase/server";

function buildSignInRedirect(requestUrl: URL, message: string) {
  const nextUrl = new URL("/sign-in", requestUrl.origin);
  nextUrl.searchParams.set("message", message);
  return NextResponse.redirect(nextUrl);
}

function shouldHonorRequestedNext(next: string | null) {
  return next === "/reset-password";
}

async function getStudentRedirect(args: {
  product: "cna" | "ccma";
  user: Parameters<typeof getStudentAuthRedirectPathForUser>[0]["user"];
  userId: string;
}) {
  if (args.product === "ccma") {
    return getCcmaStudentAuthRedirectPathForUser({
      user: args.user,
      userId: args.userId,
    });
  }

  return getStudentAuthRedirectPathForUser({
    user: args.user,
    userId: args.userId,
  });
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const errorCode = requestUrl.searchParams.get("error_code");
  const requestedNext = requestUrl.searchParams.get("next");
  let next = requestedNext ?? "/";

  if (errorDescription) {
    const message = errorCode === "otp_expired"
      ? "That confirmation link is invalid or has expired. Request a new email confirmation and try again."
      : errorDescription;

    return buildSignInRedirect(requestUrl, message);
  }

  if (code) {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return buildSignInRedirect(
        requestUrl,
        error.code === "otp_expired"
          ? "That confirmation link is invalid or has expired. Request a new email confirmation and try again."
          : error.message,
      );
    }

    if (user) {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("product")
        .eq("id", user.id)
        .maybeSingle();
      const product =
        existingProfile?.product === "ccma"
          ? "ccma"
          : resolveProductFromMetadata(user.user_metadata?.product);
      next = shouldHonorRequestedNext(requestedNext)
        ? requestedNext ?? "/reset-password"
        : user.user_metadata?.role === "admin"
          ? product === "ccma"
            ? "/ccma-admin"
            : "/admin"
          : await getStudentRedirect({
              product,
              user,
              userId: user.id,
            });
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}

