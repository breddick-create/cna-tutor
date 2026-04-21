import { redirect } from "next/navigation";

import { rdaMockExamBank } from "@/content/rda/exam-bank";
import { requireRdaViewer } from "@/lib/rda/auth/session";
import { hasCompletedRdaPretest } from "@/lib/rda/progression";

export default async function RdaMockExamPage() {
  const viewer = await requireRdaViewer();
  if (!(await hasCompletedRdaPretest(viewer.user))) redirect("/rda/pretest");

  const forms = Object.entries(rdaMockExamBank);

  return (
    <section className="panel-strong rounded-[1.75rem] p-6">
      <p className="eyebrow">Readiness Gate</p>
      <h1 className="mt-3 text-3xl font-semibold">Full mock exams are required for Exam Ready.</h1>
      <p className="text-muted mt-3 max-w-3xl leading-7">
        RDA Tutor will not mark a student Exam Ready without at least one full 75-question mock exam.
        Mock exams count more than quizzes because they measure stamina, mixed-domain recall, and judgment.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {forms.map(([form, questions], index) => (
          <article key={form} className="rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-5">
            <p className="text-sm font-semibold text-[color:var(--brand-strong)]">Form {String.fromCharCode(65 + index)}</p>
            <h2 className="mt-2 text-xl font-semibold">{questions.length} questions</h2>
            <p className="text-muted mt-2 text-sm leading-6">Mixed-domain readiness check with rationales after scoring.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
