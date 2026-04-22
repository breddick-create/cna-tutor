import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { rdaQuizBank } from "@/content/rda/exam-bank";
import { getRdaDomain, isRdaDomainId } from "@/content/rda/domains";
import { RdaAssessmentRunner } from "@/components/rda/rda-assessment-runner";
import { requireRdaViewer } from "@/lib/rda/auth/session";
import { hasCompletedRdaPretest } from "@/lib/rda/progression";
import { submitQuizAction } from "./actions";

type Props = { params: Promise<{ domainSlug: string }> };

export default async function RdaQuizDomainPage({ params }: Props) {
  const viewer = await requireRdaViewer();
  if (!(await hasCompletedRdaPretest(viewer.user))) redirect("/rda/pretest");

  const { domainSlug } = await params;
  if (!isRdaDomainId(domainSlug)) notFound();

  const domain = getRdaDomain(domainSlug);
  if (!domain) notFound();

  const questions = rdaQuizBank.filter((q) => q.domainSlug === domainSlug).slice(0, 15);
  const boundAction = submitQuizAction.bind(null, domainSlug);

  return (
    <section className="panel-strong rounded-[1.75rem] p-6">
      <Link
        className="text-sm font-semibold text-[color:var(--brand-strong)] hover:underline"
        href="/rda/quiz"
      >
        ← Back to quizzes
      </Link>
      <p className="eyebrow mt-4">{domain.title}</p>
      <h1 className="mt-2 text-3xl font-semibold">{questions.length}-question domain quiz</h1>
      <p className="text-muted mt-3 max-w-3xl leading-7">{domain.readinessFocus}</p>
      <p className="mt-3 text-sm">
        <span className="font-semibold">Passing score: </span>75% or higher.
      </p>
      <RdaAssessmentRunner
        action={boundAction}
        questions={questions}
        submitLabel="Submit quiz"
      />
    </section>
  );
}
