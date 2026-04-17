import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <section className="panel-strong rounded-[2rem] p-8 sm:p-10">
      <BrandLogo className="w-[220px]" priority width={220} />
      <p className="eyebrow mt-6">Reset Password</p>
      <h2 className="mt-4 text-3xl font-semibold">Choose a new password for your account.</h2>
      <p className="text-muted mt-3 leading-7">
        After you save your new password, sign in again and continue with your study plan.
      </p>

      <ResetPasswordForm />

      <p className="text-muted mt-6 text-sm">
        Need to start over?{" "}
        <Link className="font-semibold text-[color:var(--brand-strong)]" href="/forgot-password">
          Request another reset link
        </Link>
        .
      </p>
    </section>
  );
}
