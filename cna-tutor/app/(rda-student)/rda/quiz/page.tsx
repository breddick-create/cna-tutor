import Link from "next/link";
import { redirect } from "next/navigation";

import { rdaQuizBank } from "@/content/rda/exam-bank";
import { rdaDomains } from "@/content/rda/domains";
import { requireRdaViewer } from "@/lib/rda/auth/session";
import { hasCompletedRdaPretest } from "@/lib/rda/progression";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function RdaQuizPage({ searchParams }: { searchParams: SearchParams }) {
  const viewer = await requireRdaViewer();
  if (!(await hasCompletedRdaPretest(viewer.user))) redirect("/rda/pretest");

  const params = await searchParams;
  const completed = typeof params.completed === "string" ? params.completed : null;
  const score = typeof params.score === "string" ? Number(params.score) : null;
  const passed = params.passed === "true";

  return (
    <section className="panel-strong rounded-[1.75rem] p-6">
      <p className="eyebrow">Short Checks</p>
      <h1 className="mt-3 text-3xl font-semibold">Use quizzes to prove weak-area recovery.</h1>
      <p className="text-muted mt-3 leading-7">
        Quizzes count more than passive study time, but less than a full mock exam. Aim for
        75% or higher in the weak domain before moving to larger readiness gates.
      </p>

      {completed && score !== null && (
        <div
          className={`mt-5 rounded-[1.5rem] border p-5 ${
            passed
              ? "border-[rgba(20,95,80,0.2)] bg-[rgba(20,95,80,0.06)]"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <p className={`font-semibold ${passed ? "text-[color:#145f50]" : "text-amber-800"}`}>
            {passed ? "Quiz passed" : "Quiz complete — keep studying"}
          </p>
          <p className={`mt-1 text-sm leading-6 ${passed ? "text-[color:#145f50]" : "text-amber-700"}`}>
            {rdaDomains.find((d) => d.slug === completed)?.title ?? completed} — score:{" "}
            <strong>{score}%</strong>.{" "}
            {passed
              ? "This domain is above the mastery gate. Reinforce with more practice or move to the next weak area."
              : "Score below 75%. Return to the study plan for this domain before retaking."}
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {rdaDomains.map((domain) => {
          const count = rdaQuizBank.filter((q) => q.domainSlug === domain.slug).length;
          return (
            <Link
              key={domain.slug}
              href={`/rda/quiz/${domain.slug}`}
              className="block rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4 transition-colors hover:border-[color:var(--brand)] hover:bg-white"
            >
              <p className="font-semibold">{domain.title}</p>
              <p className="text-muted mt-2 text-sm">{count} questions</p>
              <p className="mt-3 text-xs font-semibold text-[color:var(--brand-strong)]">
                Take quiz →
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
