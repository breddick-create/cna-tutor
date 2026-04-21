import { redirect } from "next/navigation";

import { rdaPretestBank } from "@/content/rda/exam-bank";
import { rdaDomains } from "@/content/rda/domains";
import { RdaAssessmentRunner } from "@/components/rda/rda-assessment-runner";
import { submitRdaPretestAction } from "@/app/(rda-student)/rda/pretest/actions";
import { requireRdaViewer } from "@/lib/rda/auth/session";
import { hasCompletedRdaPretest } from "@/lib/rda/progression";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function RdaPretestPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const viewer = await requireRdaViewer();
  if (await hasCompletedRdaPretest(viewer.user)) redirect("/rda/dashboard");

  const params = await searchParams;
  const message = typeof params.message === "string" ? decodeURIComponent(params.message) : null;

  return (
    <section className="panel-strong rounded-[1.75rem] p-6">
      <p className="eyebrow">Required Pre-Test</p>
      <h1 className="mt-3 text-3xl font-semibold">Start with the 30-question RDA diagnostic.</h1>
      <p className="text-muted mt-3 max-w-3xl leading-7">
        This diagnostic is mandatory because the RDA study path is sequenced by weak areas,
        not open browsing. Results are stored domain by domain and drive the next best action.
      </p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {rdaDomains.map((domain) => (
          <div key={domain.slug} className="rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4">
            <p className="font-semibold">{domain.title}</p>
            <p className="text-muted mt-2 text-sm">{domain.weightPercent}% readiness weight</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm font-semibold">{rdaPretestBank.length} diagnostic questions loaded.</p>
      {message ? (
        <div className="mt-4 rounded-2xl border border-[rgba(166,60,47,0.18)] bg-[rgba(166,60,47,0.08)] px-4 py-3 text-sm font-semibold text-[color:var(--danger)]">
          {message}
        </div>
      ) : null}
      <RdaAssessmentRunner action={submitRdaPretestAction} questions={rdaPretestBank} />
    </section>
  );
}
