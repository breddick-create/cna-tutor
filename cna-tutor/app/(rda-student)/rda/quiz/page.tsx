import { redirect } from "next/navigation";

import { rdaQuizBank } from "@/content/rda/exam-bank";
import { rdaDomains } from "@/content/rda/domains";
import { requireRdaViewer } from "@/lib/rda/auth/session";
import { hasCompletedRdaPretest } from "@/lib/rda/progression";

export default async function RdaQuizPage() {
  const viewer = await requireRdaViewer();
  if (!(await hasCompletedRdaPretest(viewer.user))) redirect("/rda/pretest");

  return (
    <section className="panel-strong rounded-[1.75rem] p-6">
      <p className="eyebrow">Short Checks</p>
      <h1 className="mt-3 text-3xl font-semibold">Use quizzes to prove weak-area recovery.</h1>
      <p className="text-muted mt-3 leading-7">
        Quizzes count more than passive study time, but less than a full mock exam. Aim for
        75% or higher in the weak domain before moving to larger readiness gates.
      </p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {rdaDomains.map((domain) => (
          <div key={domain.slug} className="rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4">
            <p className="font-semibold">{domain.title}</p>
            <p className="text-muted mt-2 text-sm">
              {rdaQuizBank.filter((question) => question.domainSlug === domain.slug).length} questions
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
