import Link from "next/link";
import { redirect } from "next/navigation";

import { rdaMockExamBank } from "@/content/rda/exam-bank";
import { requireRdaViewer } from "@/lib/rda/auth/session";
import { hasCompletedRdaPretest } from "@/lib/rda/progression";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const FORM_LABELS: Record<string, string> = { formA: "Form A", formB: "Form B", formC: "Form C" };

export default async function RdaMockExamPage({ searchParams }: { searchParams: SearchParams }) {
  const viewer = await requireRdaViewer();
  if (!(await hasCompletedRdaPretest(viewer.user))) redirect("/rda/pretest");

  const params = await searchParams;
  const completed = typeof params.completed === "string" ? params.completed : null;
  const score = typeof params.score === "string" ? Number(params.score) : null;
  const passed = params.passed === "true";

  const forms = Object.entries(rdaMockExamBank);

  return (
    <section className="panel-strong rounded-[1.75rem] p-6">
      <p className="eyebrow">Readiness Gate</p>
      <h1 className="mt-3 text-3xl font-semibold">Full mock exams are required for Exam Ready.</h1>
      <p className="text-muted mt-3 max-w-3xl leading-7">
        RDA Tutor will not mark a student Exam Ready without at least one full 75-question mock exam.
        Mock exams count more than quizzes because they measure stamina, mixed-domain recall, and judgment.
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
            {passed ? "Mock exam passed — Exam Ready gate unlocked" : "Mock exam complete — score below passing"}
          </p>
          <p className={`mt-1 text-sm leading-6 ${passed ? "text-[color:#145f50]" : "text-amber-700"}`}>
            {FORM_LABELS[completed] ?? completed} — score: <strong>{score}%</strong>.{" "}
            {passed
              ? "You cleared the 80% gate. Check your dashboard to see your updated readiness."
              : "Passing is 80%. Review your weak areas in the study plan, then retake a different form."}
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {forms.map(([form, questions], index) => (
          <Link
            key={form}
            href={`/rda/mock-exam/${form}`}
            className="block rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-5 transition-colors hover:border-[color:var(--brand)] hover:bg-white"
          >
            <p className="text-sm font-semibold text-[color:var(--brand-strong)]">
              Form {String.fromCharCode(65 + index)}
            </p>
            <h2 className="mt-2 text-xl font-semibold">{questions.length} questions</h2>
            <p className="text-muted mt-2 text-sm leading-6">
              Mixed-domain readiness check with rationales after scoring.
            </p>
            <p className="mt-3 text-xs font-semibold text-[color:var(--brand-strong)]">
              Start exam →
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
