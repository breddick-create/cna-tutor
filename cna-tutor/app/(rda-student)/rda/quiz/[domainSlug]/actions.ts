"use server";

import { redirect } from "next/navigation";

import { rdaQuizBank } from "@/content/rda/exam-bank";
import { isRdaDomainId } from "@/content/rda/domains";
import { requireRdaViewer } from "@/lib/rda/auth/session";
import { createRdaAdminClient } from "@/lib/rda/supabase";
import { scoreRdaQuiz, type RdaSelectedAnswer } from "@/lib/rda/readiness/scoring";

export async function submitQuizAction(domainSlug: string, formData: FormData) {
  const viewer = await requireRdaViewer();

  if (!isRdaDomainId(domainSlug)) redirect("/rda/quiz");

  const questions = rdaQuizBank.filter((q) => q.domainSlug === domainSlug).slice(0, 15);
  const completedAt = new Date().toISOString();

  const answers: RdaSelectedAnswer[] = questions.map((question) => ({
    questionId: question.id,
    domainId: question.domainSlug,
    selectedAnswer: formData.get(question.id) as string | null,
    correctAnswer: question.correctChoiceId,
    completedAt,
  }));

  const scored = scoreRdaQuiz(answers);
  const admin = createRdaAdminClient();

  await admin.from("rda_quiz_attempts").insert({
    user_id: viewer.user.id,
    quiz_id: domainSlug,
    domain_id: domainSlug,
    score: scored.score,
    passed: scored.passed,
    answers: answers.map((a) => ({
      questionId: a.questionId,
      domainId: a.domainId,
      selectedAnswer: a.selectedAnswer,
      correctAnswer: a.correctAnswer,
      correct: a.selectedAnswer === a.correctAnswer,
    })),
    weak_areas: scored.weakAreas.map((w) => w.domainId),
  });

  await admin.from("rda_study_sessions").insert({
    user_id: viewer.user.id,
    domain_id: domainSlug,
    session_type: "quiz",
    completed: true,
    score: scored.score,
    metadata: { questionCount: questions.length, passed: scored.passed, domainSlug },
  });

  redirect(`/rda/quiz?completed=${domainSlug}&score=${scored.score}&passed=${scored.passed}`);
}
