import { NextResponse } from "next/server";

import {
  getProductAdminPath,
  getStudentAuthRedirectPathForProduct,
  persistUserProductTrack,
  resolveEffectiveProductTrack,
} from "@/lib/auth/product-routing";
import { resolveProductFromMetadata } from "@/lib/auth/session";
import { ensureRdaProfileForUser } from "@/lib/rda/auth/session";
import { createClient } from "@/lib/supabase/server";

function buildSignInRedirect(requestUrl: URL, message: string) {
  const nextUrl = new URL("/sign-in", requestUrl.origin);
  nextUrl.searchParams.set("message", message);
  return NextResponse.redirect(nextUrl);
}

function shouldHonorRequestedNext(next: string | null) {
  return next === "/reset-password";
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
      const product = await resolveEffectiveProductTrack({
        userId: user.id,
        profileProduct: existingProfile?.product ?? resolveProductFromMetadata(user.user_metadata?.product),
      });
      if (existingProfile?.product !== product || user.user_metadata?.product !== product) {
        await persistUserProductTrack({ user, product });
        if (product === "rda") {
          await ensureRdaProfileForUser({
            ...user,
            user_metadata: {
              ...user.user_metadata,
              product,
            },
          });
        }
      }
      next = shouldHonorRequestedNext(requestedNext)
        ? requestedNext ?? "/reset-password"
        : user.user_metadata?.role === "admin"
          ? getProductAdminPath(product)
          : await getStudentAuthRedirectPathForProduct({
              product,
              user,
              userId: user.id,
            });
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}

