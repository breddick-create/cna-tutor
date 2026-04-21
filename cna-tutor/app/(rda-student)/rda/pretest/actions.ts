"use server";

import { redirect } from "next/navigation";

import { rdaPretestBank } from "@/content/rda/exam-bank";
import { analyzeRdaPretest, type RDADomainPerformance } from "@/lib/rda/readiness/engine";
import { scoreRdaPretest, type RdaSelectedAnswer } from "@/lib/rda/readiness/scoring";
import { requireRdaViewer } from "@/lib/rda/auth/session";
import { createRdaAdminClient, createRdaClient } from "@/lib/rda/supabase";

function buildRedirect(message: string) {
  return `/rda/pretest?message=${encodeURIComponent(message)}`;
}

export async function submitRdaPretestAction(formData: FormData) {
  const viewer = await requireRdaViewer();
  const completedAt = new Date().toISOString();

  const answers: RdaSelectedAnswer[] = rdaPretestBank.map((question) => {
    const selected = formData.get(question.id);

    return {
      questionId: question.id,
      domainId: question.domainSlug,
      selectedAnswer: typeof selected === "string" ? selected : null,
      correctAnswer: question.correctChoiceId,
      completedAt,
    };
  });

  if (answers.some((answer) => !answer.selectedAnswer)) {
    redirect(buildRedirect("Answer every RDA pre-test question before submitting."));
  }

  const scored = scoreRdaPretest(answers);
  const domainBreakdown: RDADomainPerformance[] = scored.domainScores.map((domain) => ({
    domainSlug: domain.domainId,
    domainTitle: domain.domainName,
    correctCount: domain.correctCount,
    totalQuestions: domain.totalQuestions,
    percent: domain.percent,
  }));
  const analysis = analyzeRdaPretest(domainBreakdown);
  const strengths = domainBreakdown.filter((domain) => domain.percent >= 85);
  const answerRows = rdaPretestBank.map((question) => {
    const answer = answers.find((item) => item.questionId === question.id);
    return {
      questionId: question.id,
      domainId: question.domainSlug,
      selectedAnswer: answer?.selectedAnswer ?? null,
      correctAnswer: question.correctChoiceId,
      correct: answer?.selectedAnswer === question.correctChoiceId,
    };
  });

  const metadata = {
    ...viewer.user.user_metadata,
    product: "rda",
    rda_pretest_completed_at: completedAt,
    rda_pretest_score: scored.score,
    rda_pretest_domain_breakdown: domainBreakdown,
  };

  const supabase = await createRdaClient();
  await supabase.auth.updateUser({ data: metadata });

  const admin = createRdaAdminClient();
  await admin.auth.admin.updateUserById(viewer.user.id, {
    user_metadata: metadata,
  });

  await admin.from("rda_pretest_results").insert({
    user_id: viewer.user.id,
    overall_score: scored.score,
    domain_scores: domainBreakdown,
    weak_areas: analysis.weakAreas,
    strengths,
    readiness_score: analysis.readinessScore,
    readiness_label: analysis.label,
    confidence_estimate: analysis.confidenceEstimate,
    answers: answerRows,
  });

  await admin.from("rda_readiness_snapshots").insert({
    user_id: viewer.user.id,
    score: analysis.readinessScore,
    label: analysis.label,
    weak_areas: analysis.weakAreas,
    strengths,
    next_best_action: analysis.nextBestAction,
    checklist: analysis.studyPlan.map((item) => ({
      id: item.lessonId ?? item.domainSlug,
      title: `Study ${item.domainTitle}`,
      met: false,
      reason: item.reason,
    })),
    recovery_signals: analysis.weakAreas.map((area) => ({
      domainSlug: area.domainSlug,
      domainTitle: area.domainTitle,
      baseline: area.percent,
      message: `${area.domainTitle} starts below the mastery gate and should be recovered early.`,
    })),
    confidence_trend: analysis.confidenceEstimate,
  });

  await admin.from("rda_study_sessions").insert({
    user_id: viewer.user.id,
    session_type: "pretest",
    completed: true,
    score: scored.score,
    metadata: {
      questionCount: rdaPretestBank.length,
      weakAreas: analysis.weakAreas.map((area) => area.domainSlug),
      readinessLabel: analysis.label,
    },
  });

  await admin
    .from("profiles")
    .update({
      product: "rda",
      last_activity_at: completedAt,
    })
    .eq("id", viewer.user.id);

  redirect("/rda/dashboard");
}
