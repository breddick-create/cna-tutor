import type { QuizConfidenceLevel } from "@/lib/ccma/exams/types";

export const confidenceLabelMap: Record<QuizConfidenceLevel, string> = {
  not_confident: "Not confident",
  somewhat_confident: "Somewhat confident",
  very_confident: "Very confident",
};

export const confidenceScoreMap: Record<QuizConfidenceLevel, number> = {
  not_confident: 1,
  somewhat_confident: 2,
  very_confident: 3,
};

export function formatConfidenceScore(score: number | null) {
  if (score === null) {
    return "No check-ins yet";
  }

  if (score <= 1.4) {
    return confidenceLabelMap.not_confident;
  }

  if (score <= 2.4) {
    return confidenceLabelMap.somewhat_confident;
  }

  return confidenceLabelMap.very_confident;
}


