import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { signOutAction } from "@/app/(rda-student)/actions";

import {
  getProductAdminPath,
  getStudentAuthRedirectPathForProduct,
  persistUserProductTrack,
  resolveEffectiveProductTrack,
} from "@/lib/auth/product-routing";
import { getViewer, resolveProductFromMetadata, resolveProductFromProfile } from "@/lib/auth/session";
import { ensureRdaProfileForUser } from "@/lib/rda/auth/session";

export default async function RdaStudentLayout({ children }: { children: ReactNode }) {
  const viewer = await getViewer();
  if (!viewer) {
    redirect("/sign-in?product=rda");
  }

  const storedProduct = resolveProductFromProfile(viewer.profile);
  const metadataProduct = resolveProductFromMetadata(viewer.user.user_metadata?.product);
  const product = await resolveEffectiveProductTrack({
    userId: viewer.user.id,
    // Trust metadata when it says rda — handles stale profile.product for new RDA users
    selectedProduct: metadataProduct !== "cna" ? metadataProduct : null,
    profileProduct: storedProduct,
  });

  if (viewer.profile.role === "admin") {
    redirect(getProductAdminPath(product));
  }

  if (product !== "rda") {
    redirect(
      await getStudentAuthRedirectPathForProduct({
        product,
        user: viewer.user,
        userId: viewer.user.id,
      }),
    );
  }

  if (storedProduct !== "rda" || viewer.user.user_metadata?.product !== "rda") {
    await persistUserProductTrack({ user: viewer.user, product: "rda" });
    await ensureRdaProfileForUser({
      ...viewer.user,
      user_metadata: {
        ...viewer.user.user_metadata,
        product: "rda",
      },
    });
  }

  return (
    <main className="page-shell px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="panel-strong rounded-[1.75rem] px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link className="text-lg font-semibold" href="/rda/dashboard">
              RDA Tutor
            </Link>
            <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold text-[color:var(--brand-strong)]">
              <Link href="/rda/dashboard">Dashboard</Link>
              <Link href="/rda/study-plan">Study Plan</Link>
              <Link href="/rda/quiz">Quiz</Link>
              <Link href="/rda/mock-exam">Mock Exam</Link>
              <Link href="/rda/exam-day">Exam Day</Link>
              <form action={signOutAction}>
                <button
                  className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)] transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand-strong)]"
                  type="submit"
                >
                  Sign out
                </button>
              </form>
            </nav>
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
