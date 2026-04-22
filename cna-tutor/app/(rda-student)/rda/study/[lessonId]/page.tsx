import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { requireRdaViewer } from "@/lib/rda/auth/session";
import { hasCompletedRdaPretest } from "@/lib/rda/progression";
import { getRdaTutorLesson } from "@/lib/rda/tutor/lessons";

const questionTypeLabel: Record<string, string> = {
  concept_teaching: "Concept",
  recall: "Recall",
  application: "Application",
  scenario: "Scenario",
  misconception: "Misconception",
  safety_reasoning: "Safety",
  workflow_reasoning: "Workflow",
  exam_challenge: "Exam Challenge",
  remediation: "Remediation",
  mastery_checkpoint: "Mastery Check",
};

type Props = { params: Promise<{ lessonId: string }> };

export default async function RdaStudyLessonPage({ params }: Props) {
  const viewer = await requireRdaViewer();
  if (!(await hasCompletedRdaPretest(viewer.user))) redirect("/rda/pretest");

  const { lessonId } = await params;
  const lesson = getRdaTutorLesson(lessonId);
  if (!lesson) notFound();

  return (
    <div className="space-y-6">
      <section className="panel-strong rounded-[1.75rem] p-6">
        <Link
          className="text-sm font-semibold text-[color:var(--brand-strong)] hover:underline"
          href="/rda/study-plan"
        >
          ← Back to study plan
        </Link>
        <p className="eyebrow mt-4">{lesson.domainTitle}</p>
        <h1 className="mt-2 text-3xl font-semibold">{lesson.title}</h1>
        <p className="text-muted mt-3 max-w-3xl leading-7">{lesson.summary}</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4">
            <p className="text-sm font-semibold">Learning goal</p>
            <p className="text-muted mt-2 text-sm leading-6">{lesson.learningGoal}</p>
          </div>
          <div className="rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4">
            <p className="text-sm font-semibold">Steps</p>
            <p className="mt-2 text-2xl font-semibold">{lesson.segments.length}</p>
          </div>
          <div className="rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4">
            <p className="text-sm font-semibold">Est. time</p>
            <p className="mt-2 text-2xl font-semibold">{lesson.estimatedMinutes} min</p>
          </div>
        </div>
      </section>

      <section className="panel rounded-[1.75rem] p-6">
        <p className="eyebrow">10-Step Mastery Sequence</p>
        <p className="text-muted mt-2 text-sm leading-6">
          Each step builds toward the mastery checkpoint. Answer with the clinical action and the
          safety, workflow, or scope reason — not just a keyword.
        </p>
        <ol className="mt-5 space-y-4">
          {lesson.segments.map((segment, index) => (
            <li
              key={segment.id}
              className="rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand)] text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span className="rounded-full bg-[rgba(23,60,255,0.1)] px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-[color:var(--brand-strong)]">
                  {questionTypeLabel[segment.questionType] ?? segment.questionType}
                </span>
                <span className="font-semibold">{segment.title}</span>
              </div>
              <p className="text-muted mt-3 text-sm leading-6">{segment.concept}</p>
              <p className="mt-3 text-sm font-semibold leading-6">{segment.question}</p>
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-semibold text-[color:var(--brand-strong)]">
                  Show ideal answer
                </summary>
                <p className="text-muted mt-2 text-sm leading-6">{segment.idealAnswer}</p>
                <p className="mt-2 text-sm leading-6">
                  <span className="font-semibold">Memory tip: </span>
                  {segment.memoryTip}
                </p>
              </details>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel rounded-[1.75rem] p-5">
        <p className="eyebrow">Completion</p>
        <p className="mt-3 text-sm leading-6">{lesson.completionMessage}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="button-primary" href="/rda/quiz">
            Test yourself with a quiz
          </Link>
          <Link className="button-secondary" href="/rda/study-plan">
            Back to study plan
          </Link>
        </div>
      </section>
    </div>
  );
}
