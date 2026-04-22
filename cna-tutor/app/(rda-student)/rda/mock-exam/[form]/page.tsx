import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { rdaMockExamBank } from "@/content/rda/exam-bank";
import { RdaAssessmentRunner } from "@/components/rda/rda-assessment-runner";
import { requireRdaViewer } from "@/lib/rda/auth/session";
import { hasCompletedRdaPretest } from "@/lib/rda/progression";
import { submitMockExamAction } from "./actions";

const VALID_FORMS = ["formA", "formB", "formC"] as const;
type MockExamForm = (typeof VALID_FORMS)[number];

function isValidForm(value: string): value is MockExamForm {
  return (VALID_FORMS as readonly string[]).includes(value);
}

const FORM_LABELS: Record<MockExamForm, string> = {
  formA: "Form A",
  formB: "Form B",
  formC: "Form C",
};

type Props = { params: Promise<{ form: string }> };

export default async function RdaMockExamFormPage({ params }: Props) {
  const viewer = await requireRdaViewer();
  if (!(await hasCompletedRdaPretest(viewer.user))) redirect("/rda/pretest");

  const { form } = await params;
  if (!isValidForm(form)) notFound();

  const questions = rdaMockExamBank[form];
  const boundAction = submitMockExamAction.bind(null, form);

  return (
    <section className="panel-strong rounded-[1.75rem] p-6">
      <Link
        className="text-sm font-semibold text-[color:var(--brand-strong)] hover:underline"
        href="/rda/mock-exam"
      >
        ← Back to mock exams
      </Link>
      <p className="eyebrow mt-4">Readiness Gate</p>
      <h1 className="mt-2 text-3xl font-semibold">
        Mock Exam — {FORM_LABELS[form]}
      </h1>
      <p className="text-muted mt-3 max-w-3xl leading-7">
        {questions.length} mixed-domain questions. Answer every question before submitting.
        Passing is 80%. Results count toward your Exam Ready gate.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4">
          <p className="text-sm font-semibold">Questions</p>
          <p className="mt-1 text-2xl font-semibold">{questions.length}</p>
        </div>
        <div className="rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4">
          <p className="text-sm font-semibold">Passing score</p>
          <p className="mt-1 text-2xl font-semibold">80%</p>
        </div>
        <div className="rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4">
          <p className="text-sm font-semibold">Domains covered</p>
          <p className="mt-1 text-2xl font-semibold">All 6</p>
        </div>
      </div>
      <RdaAssessmentRunner
        action={boundAction}
        questions={questions}
        submitLabel="Submit mock exam"
      />
    </section>
  );
}
