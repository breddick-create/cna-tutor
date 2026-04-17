import type { TutorMode } from "@/lib/ccma/tutor/types";

export function getTutorModeLabel(mode: TutorMode) {
  const labels: Record<TutorMode, string> = {
    learn: "Learn",
    quiz: "Guided Check",
    mock_exam: "Mock Support",
    weak_area_review: "Weak-Area Review",
    study_plan: "Study Plan",
    rapid_review: "Rapid Review",
  };

  return labels[mode];
}

