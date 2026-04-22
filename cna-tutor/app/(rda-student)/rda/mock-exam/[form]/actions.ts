"use server";

import { redirect } from "next/navigation";

import { rdaMockExamBank } from "@/content/rda/exam-bank";
import { requireRdaViewer } from "@/lib/rda/auth/session";
import { createRdaAdminClient } from "@/lib/rda/supabase";
import { scoreRdaMockExam, type RdaSelectedAnswer } from "@/lib/rda/readiness/scoring";

const VALID_FORMS = ["formA", "formB", "formC"] as const;
type MockExamForm = (typeof VALID_FORMS)[number];

function isValidForm(value: string): value is MockExamForm {
  return (VALID_FORMS as readonly string[]).includes(value);
}

export async function submitMockExamAction(form: string, formData: FormData) {
  const viewer = await requireRdaViewer();

  if (!isValidForm(form)) redirect("/rda/mock-exam");

  const questions = rdaMockExamBank[form];
  const completedAt = new Date().toISOString();

  const answers: RdaSelectedAnswer[] = questions.map((question) => ({
    questionId: question.id,
    domainId: question.domainSlug,
    selectedAnswer: formData.get(question.id) as string | null,
    correctAnswer: question.correctChoiceId,
    completedAt,
  }));

  const scored = scoreRdaMockExam(answers);
  const admin = createRdaAdminClient();

  await admin.from("rda_mock_exam_attempts").insert({
    user_id: viewer.user.id,
    exam_version: form,
    score: scored.score,
    timed: false,
    domain_scores: scored.domainScores,
    weak_areas: scored.weakAreas.map((w) => w.domainId),
    answers: answers.map((a) => ({
      questionId: a.questionId,
      domainId: a.domainId,
      selectedAnswer: a.selectedAnswer,
      correctAnswer: a.correctAnswer,
      correct: a.selectedAnswer === a.correctAnswer,
    })),
  });

  await admin.from("rda_study_sessions").insert({
    user_id: viewer.user.id,
    session_type: "mock_exam",
    completed: true,
    score: scored.score,
    metadata: { form, questionCount: questions.length, passed: scored.passed },
  });

  redirect(`/rda/mock-exam?completed=${form}&score=${scored.score}&passed=${scored.passed}`);
}
