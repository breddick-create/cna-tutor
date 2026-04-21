import Link from "next/link";
import { redirect } from "next/navigation";

import { requestPasswordResetAction } from "@/app/(auth)/actions";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SubmitButton } from "@/components/auth/submit-button";
import {
  getProductAdminPath,
  getStudentAuthRedirectPathForProduct,
  resolveEffectiveProductTrack,
} from "@/lib/auth/product-routing";
import { getViewer, resolveProductFromProfile } from "@/lib/auth/session";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const viewer = await getViewer();

  if (viewer) {
    const product = await resolveEffectiveProductTrack({
      userId: viewer.user.id,
      profileProduct: resolveProductFromProfile(viewer.profile),
    });
    redirect(
      viewer.profile.role === "admin"
        ? getProductAdminPath(product)
        : await getStudentAuthRedirectPathForProduct({
            product,
            user: viewer.user,
            userId: viewer.user.id,
          }),
    );
  }

  const params = await searchParams;
  const message =
    typeof params.message === "string" ? decodeURIComponent(params.message) : null;

  return (
    <section className="panel-strong rounded-[2rem] p-8 sm:p-10">
      <BrandLogo className="w-[220px]" priority width={220} />
      <p className="eyebrow mt-6">Forgot Password</p>
      <h2 className="mt-4 text-3xl font-semibold">Reset your password and get back to your study plan.</h2>
      <p className="text-muted mt-3 leading-7">
        Enter your email and we will send a secure reset link if that account exists.
      </p>

      <form action={requestPasswordResetAction} className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            autoComplete="email"
            className="input-base"
            id="email"
            name="email"
            placeholder="name@example.com"
            required
            type="email"
          />
        </div>

        {message ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.9)] px-4 py-3 text-sm">
            {message}
          </div>
        ) : null}

        <SubmitButton className="button-primary w-full" pendingText="Sending reset link...">
          Send reset link
        </SubmitButton>
      </form>

      <p className="text-muted mt-6 text-sm">
        Remembered it?{" "}
        <Link className="font-semibold text-[color:var(--brand-strong)]" href="/sign-in">
          Back to sign in
        </Link>
        .
      </p>
    </section>
  );
}
