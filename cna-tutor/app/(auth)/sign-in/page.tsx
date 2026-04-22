import Link from "next/link";
import { redirect } from "next/navigation";

import { signInAction } from "@/app/(auth)/actions";
import { SubmitButton } from "@/components/auth/submit-button";
import {
  getProductAdminPath,
  getStudentAuthRedirectPathForProduct,
  isProductTrack,
  persistUserProductTrack,
  PRODUCT_TRACK_OPTIONS,
  resolveEffectiveProductTrack,
} from "@/lib/auth/product-routing";
import { getViewer, resolveProductFromProfile } from "@/lib/auth/session";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const message =
    typeof params.message === "string" ? decodeURIComponent(params.message) : null;
  const requestedProduct = isProductTrack(params.product) ? params.product : "";
  const signUpHref = requestedProduct ? `/sign-up?product=${requestedProduct}` : "/sign-up";
  const viewer = await getViewer();

  if (viewer) {
    const storedProduct = resolveProductFromProfile(viewer.profile);
    const product = await resolveEffectiveProductTrack({
      userId: viewer.user.id,
      selectedProduct: requestedProduct || null,
      profileProduct: storedProduct,
    });
    if (requestedProduct || product !== storedProduct || viewer.user.user_metadata?.product !== product) {
      await persistUserProductTrack({ user: viewer.user, product });
    }
    if (viewer.profile.role === "admin") {
      redirect(getProductAdminPath(product));
    }

    redirect(
      await getStudentAuthRedirectPathForProduct({
        product,
        user: viewer.user,
        userId: viewer.user.id,
      }),
    );
  }

  return (
    <section className="panel-strong rounded-[2rem] p-8 sm:p-10">
      <p className="eyebrow">Welcome Back</p>
      <h1 className="mt-4 text-3xl font-semibold">Welcome back. Sign in to continue.</h1>

      <form action={signInAction} className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="product">
            Exam track
          </label>
          <select className="input-base" defaultValue={requestedProduct} id="product" name="product">
            <option value="">Use my saved exam track</option>
            {PRODUCT_TRACK_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-muted mt-2 text-xs leading-6">
            Pick a track here only if you need to switch or repair the saved exam path for this account.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            className="input-base"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            className="input-base"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
        </div>

        {message ? (
          <div
            aria-live="polite"
            className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.9)] px-4 py-3 text-sm"
          >
            {message}
          </div>
        ) : null}

        <SubmitButton className="button-primary w-full" pendingText="Signing in...">
          Sign In and Continue
        </SubmitButton>
      </form>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <Link className="font-semibold text-[color:var(--brand-strong)]" href="/forgot-password">
          Forgot password?
        </Link>
        <Link className="font-semibold text-[color:var(--brand-strong)]" href="/support">
          Need help?
        </Link>
        <Link className="font-semibold text-[color:var(--brand-strong)]" href="/privacy">
          Privacy
        </Link>
        <Link className="font-semibold text-[color:var(--brand-strong)]" href="/security">
          Security
        </Link>
      </div>

      <div className="mt-8 border-t border-[var(--border)] pt-8">
        <p className="text-center text-sm font-medium">New to HCCI Tutor?</p>
        <div className="mt-4 flex justify-center">
          <Link className="button-secondary w-full sm:w-auto" href={signUpHref}>
            Create your account
          </Link>
        </div>
      </div>

    </section>
  );
}

