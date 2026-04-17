import type { AssessmentResultPayload } from "@/lib/ccma/exams/types";
import type { ProgressionSnapshot } from "@/lib/ccma/progression/readiness";

export const MOCK_EXAM_RESULT_STORAGE_KEY = "cnaTutor.mockExamResult";

export function getMockExamTimeLimitSeconds(args: {
  questionCount: number;
  fullTest: boolean;
}) {
  if (args.fullTest) {
    return Math.max(45 * 60, Math.min(75 * 60, args.questionCount * 90));
  }

  return Math.max(15 * 60, Math.min(35 * 60, args.questionCount * 75));
}

export function buildMockExamStartHref(domainSlug?: string) {
  return domainSlug ? `/mock-exam/start?domain=${domainSlug}` : "/mock-exam/start";
}

export function buildMockExamResultsHref(domainSlug?: string) {
  return domainSlug ? `/mock-exam/results?domain=${domainSlug}` : "/mock-exam/results";
}

export type StoredMockExamResult = {
  result: AssessmentResultPayload;
  domainSlug?: string;
  completedAt: string;
};

export function createStoredMockExamResult(args: {
  result: AssessmentResultPayload;
  domainSlug?: string;
}) {
  return {
    result: args.result,
    domainSlug: args.domainSlug,
    completedAt: new Date().toISOString(),
  } satisfies StoredMockExamResult;
}

export function parseStoredMockExamResult(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as StoredMockExamResult;
  } catch {
    return null;
  }
}

export function formatExamTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (!hours) {
    return `${minutes} minutes`;
  }

  if (!minutes) {
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }

  return `${hours} hour${hours === 1 ? "" : "s"} ${minutes} minutes`;
}

export function formatCountdown(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function getMockExamResultGuidance(args: {
  result: AssessmentResultPayload;
  progression: ProgressionSnapshot;
  domainSlug?: string;
}) {
  const lowestBreakdown = [...args.result.breakdown].sort(
    (a, b) => a.percent - b.percent || a.domainTitle.localeCompare(b.domainTitle),
  )[0];
  const weakestDomainHref = lowestBreakdown
    ? `/ccma/study-plan?topics=${lowestBreakdown.domainSlug}`
    : "/ccma/study-plan";

  if (args.domainSlug) {
    if (args.result.summary.score < args.progression.config.thresholds.mockExamPassingScore) {
      return {
        statusLabel: "Target this section again",
        headline: `This ${lowestBreakdown?.domainTitle ?? "section"} still needs work.`,
        summary:
          "This section mock did its job. It showed you where to slow down and review before you move on.",
        nextStep:
          "Return to the guided lesson for this section, then use the quiz to check whether the main ideas stick before you run another section mock.",
        primaryAction: {
          label: "Return to targeted study",
          href: weakestDomainHref,
        },
        secondaryAction: {
          label: "Take section quiz",
          href: args.domainSlug ? `/ccma/quiz?domain=${args.domainSlug}` : "/ccma/quiz",
        },
      };
    }

    return {
      statusLabel: "This section is getting stronger",
      headline: `You are building stronger performance in ${lowestBreakdown?.domainTitle ?? "this section"}.`,
      summary:
        "That score shows progress inside this topic. Keep moving through the ranked plan so the rest of the blueprint catches up.",
      nextStep:
        args.progression.practiceExamUnlocked && args.progression.nextBestTask.type === "mock_exam"
          ? "You have enough foundation to use the full practice exam as your next major check."
          : "Return to the ranked study plan and keep working from weakest to strongest so your readiness score rises across the whole exam.",
      primaryAction: {
        label:
          args.progression.practiceExamUnlocked && args.progression.nextBestTask.type === "mock_exam"
            ? "Open full practice exam"
            : "Continue study plan",
        href:
          args.progression.practiceExamUnlocked && args.progression.nextBestTask.type === "mock_exam"
            ? "/ccma/mock-exam"
            : "/ccma/study-plan",
      },
      secondaryAction: {
        label: "Go to dashboard",
        href: "/ccma/dashboard",
      },
    };
  }

  if (args.result.summary.score < args.progression.config.thresholds.mockExamPassingScore) {
    return {
      statusLabel: "Not ready yet",
      headline: "This full practice exam showed where to focus next.",
      summary:
        "You are not in the target range yet, but this result gives you a clear plan instead of a guess. Go back to the weakest categories first.",
      nextStep:
        "Return to targeted study on the lowest-scoring categories, then use short quizzes to confirm improvement before you rely on another full mock.",
      primaryAction: {
        label: "Return to targeted study",
        href: weakestDomainHref,
      },
      secondaryAction: {
        label: "Check your progress",
        href: "/ccma/dashboard",
      },
    };
  }

  if (args.progression.examReady) {
    return {
      statusLabel: "Exam Ready",
      headline: "You are now in the exam-ready range.",
      summary:
        "This full-practice result is strong enough to support exam-ready messaging. Keep your routine steady and protect the weakest category from slipping.",
      nextStep:
        "Use the dashboard to monitor readiness, then do one more short review or full mock before test day if you want to keep confidence high.",
      primaryAction: {
        label: "Check your progress",
        href: "/ccma/dashboard",
      },
      secondaryAction: {
        label: "Keep study plan steady",
        href: "/ccma/study-plan",
      },
    };
  }

  return {
    statusLabel:
      args.progression.readinessState === "nearly_ready"
        ? "Almost There"
        : "Making Progress",
    headline: "This full practice exam moved you forward.",
    summary:
      "You are closer, and the next gains will come from tightening the weakest categories instead of repeating strong ones.",
    nextStep:
      "Use the breakdown below to choose the next targeted study block, then come back for another full mock when those weak areas improve.",
    primaryAction: {
      label: "Target weakest categories",
      href: weakestDomainHref,
    },
    secondaryAction: {
      label: "Check your progress",
      href: "/ccma/dashboard",
    },
  };
}


