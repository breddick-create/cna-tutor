"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function RdaStudentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[RDA] Page error:", error);
  }, [error]);

  return (
    <div className="space-y-6">
      <section className="panel-strong rounded-[1.75rem] p-6">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-3 text-2xl font-semibold">
          This page could not load right now.
        </h1>
        <p className="text-muted mt-3 leading-7">
          This is usually a temporary issue. Try reloading, or return to your
          dashboard.
        </p>
        {error.digest && (
          <p className="text-muted mt-2 font-mono text-xs">
            Error ref: {error.digest}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="button-primary" type="button" onClick={reset}>
            Try again
          </button>
          <Link className="button-secondary" href="/rda/dashboard">
            Back to dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
