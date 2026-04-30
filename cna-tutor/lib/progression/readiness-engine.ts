import { texasCnaDomains } from "@/content/texas-cna/domains";
import type { PretestDomainBreakdown } from "@/lib/onboarding/pretest";
import type { ProgressionConfig } from "@/lib/progression/config";
import { DEFAULT_PROGRESSION_CONFIG } from "@/lib/progression/config";
import { getLessonByDomain, listTutorLessons } from "@/lib/tutor/lessons";

export type ProgressionDomainInput = {
  domainSlug: string;
  domainTitle: string;
  masteryScore: number;
  weakStreak: number;
};

export type ProgressionQuizAttempt = {
  id: string;
  score: number;
  totalQuestions: number;
  completedAt: string | null;
  domainSlug: string | null;
  domainTitle: string | null;
};

export type ProgressionMockAttempt = {
  id: string;
  percent: number;
  passed: boolean;
  completedAt: string | null;
};

export type ProgressionDomainSummary = {
  domainSlug: string;
  domainTitle: string;
  description: string;
  baselineScore: number;
  masteryScore: number;
  weakStreak: number;
  lessonTitle: string | null;
  priorityLabel: "Start first" | "Build next" | "Maintain";
  recommendation: string;
};

export type ReadinessState =
  | "not_ready"
  | "building_readiness"
  | "nearly_ready"
  | "exam_ready";

export type ReadinessLabel =
  | "Not Ready"
  | "Making Progress"
  | "Almost There"
  | "Exam Ready";

export type ReadinessActionType =
  | "continue_module_work"
  | "review_weak_area"
  | "take_quiz"
  | "take_full_practice_exam"
  | "prepare_for_actual_exam";

export type NextBestTask = {
  type: "study_plan" | "quiz" | "mock_exam" | "maintain";
  actionType: ReadinessActionType;
  title: string;
  description: string;
  href: string;
};

export type ReadinessChecklistItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  met: boolean;
};

export type ActivityRecencySignal = {
  daysSinceActivity: number | null;
  status: "unknown" | "active" | "cooling" | "stale" | "inactive";
  adjustment: number;
};

export type ProgressionSnapshot = {
  config: ProgressionConfig;
  readinessScore: number;
  readinessState: ReadinessState;
  readinessLabel: ReadinessLabel;
  summary: string;
  encouragement: string;
  practiceExamUnlocked: boolean;
  practiceExamGateReason: string;
  examReady: boolean;
  rankedDomains: ProgressionDomainSummary[];
  strengths: ProgressionDomainSummary[];
  weakAreas: ProgressionDomainSummary[];
  topWeakAreas: ProgressionDomainSummary[];
  priorityOrder: ProgressionDomainSummary[];
  readinessChecklist: ReadinessChecklistItem[];
  nextBestTask: NextBestTask;
  encouragements: {
    continueModuleWork: boolean;
    reviewWeakArea: boolean;
    takeQuiz: boolean;
    takeFullPracticeExam: boolean;
    prepareForActualExam: boolean;
  };
  signals: {
    pretestScore: number | null;
    masteryAverage: number | null;
    moduleCompletionPercent: number;
    recentQuizAverage: number | null;
    quizConsistencyScore: number | null;
    recentMockAverage: number | null;
    bestMockScore: number | null;
    lessonsCompleted: number;
    quizzesCompleted: number;
    qualifyingQuizzesCompleted: number;
    mockExamsCompleted: number;
    daysSinceActivity: number | null;
    activityAdjustment: number;
    repeatedImprovementBonus: number;
    improvementBonus: number;
    domainImprovementCount: number;
    recentPoorPenalty: number;
    repeatedLowPenalty: number;
  };
};

export type ProgressionDomainMeta = {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
};

export type BuildStudentProgressionSnapshotArgs = {
  pretestScore: number | null;
  pretestDomainBreakdown: PretestDomainBreakdown[];
  masteryRows: ProgressionDomainInput[];
  lessonsCompleted: number;
  quizzesCompleted: number;
  mockExamsCompleted: number;
  quizAttempts: ProgressionQuizAttempt[];
  mockAttempts: ProgressionMockAttempt[];
  totalModules?: number;
  daysSinceActivity?: number | null;
  config?: ProgressionConfig;
  domains?: ReadonlyArray<ProgressionDomainMeta>;
};

export const RECENT_ATTEMPT_WEIGHTS = [1, 0.85, 0.7, 0.55, 0.4, 0.3] as const;

export function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function roundNumber(value: number) {
  return Math.round(value);
}

export function averageScores(values: number[]) {
  if (!values.length) {
    return null;
  }

  return roundNumber(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function weightedRecentAverage(values: number[]) {
  if (!values.length) {
    return null;
  }

  const weights = RECENT_ATTEMPT_WEIGHTS.slice(0, values.length);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const weightedTotal = values.reduce((sum, value, index) => sum + value * weights[index], 0);

  return roundNumber(weightedTotal / totalWeight);
}

export function getScoreStandardDeviation(values: number[]) {
  if (values.length < 2) {
    return 0;
  }

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;

  return Math.sqrt(variance);
}

export function getLatestVsPreviousAverages(values: number[]) {
  if (values.length < 4) {
    return null;
  }

  const splitPoint = Math.ceil(values.length / 2);
  const latest = averageScores(values.slice(0, splitPoint));
  const previous = averageScores(values.slice(splitPoint));

  if (latest === null || previous === null) {
    return null;
  }

  return {
    latest,
    previous,
    delta: latest - previous,
  };
}

export function getDaysSinceDate(value: string | null) {
  if (!value) {
    return null;
  }

  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
}

function formatRemainingCount(
  remaining: number,
  singular: string,
  plural = `${singular}s`,
) {
  return `${remaining} more ${remaining === 1 ? singular : plural}`;
}

export function buildDomainSummaries(args: {
  pretestDomainBreakdown: PretestDomainBreakdown[];
  masteryRows: ProgressionDomainInput[];
  config: ProgressionConfig;
  domains?: ReadonlyArray<ProgressionDomainMeta>;
}) {
  const lessons = listTutorLessons();
  const pretestBySlug = new Map(
    args.pretestDomainBreakdown.map((domain) => [domain.domainSlug, domain]),
  );
  const masteryBySlug = new Map(args.masteryRows.map((row) => [row.domainSlug, row]));
  const domainList = args.domains ?? texasCnaDomains;

  return domainList
    .map((domain) => {
      const pretest = pretestBySlug.get(domain.slug);
      const mastery = masteryBySlug.get(domain.slug);
      const baselineScore = pretest?.percent ?? 50;
      const masteryScore = mastery?.masteryScore ?? baselineScore;
      const weakStreak = mastery?.weakStreak ?? 0;
      const lesson =
        lessons.find((item) => item.domainSlug === domain.slug) ??
        getLessonByDomain(domain.slug)[0] ??
        null;

      const priorityLabel =
        masteryScore < args.config.thresholds.urgentWeakAreaScore
          ? "Start first"
          : masteryScore < args.config.thresholds.practiceBuildScore
            ? "Build next"
            : "Maintain";

      return {
        domainSlug: domain.slug,
        domainTitle: domain.title,
        description: domain.description,
        baselineScore,
        masteryScore,
        weakStreak,
        lessonTitle: lesson?.title ?? null,
        priorityLabel,
        recommendation: lesson
          ? `Start with ${lesson.title}, then take the 10-question quiz and the section mock.`
          : "Keep this topic in your next study block before you move to stronger sections.",
      } satisfies ProgressionDomainSummary;
    })
    .sort(
      (a, b) =>
        a.masteryScore - b.masteryScore ||
        b.weakStreak - a.weakStreak ||
        a.domainTitle.localeCompare(b.domainTitle),
    );
}

export function calculateDomainImprovement(args: {
  domains: ProgressionDomainSummary[];
  config: ProgressionConfig;
}) {
  const improvedDomains = args.domains
    .map((domain) => ({
      domain,
      improvement: domain.masteryScore - domain.baselineScore,
    }))
    .filter((item) => item.improvement >= args.config.improvement.domainLiftThreshold)
    .sort((a, b) => b.improvement - a.improvement || a.domain.domainTitle.localeCompare(b.domain.domainTitle));

  const biggestLift = improvedDomains[0]?.improvement ?? 0;
  const bonus = Math.min(
    args.config.adjustments.domainImprovementBonusMax,
    roundNumber(improvedDomains.length * 1.5 + biggestLift / 18),
  );

  return {
    count: improvedDomains.length,
    biggestLift,
    bonus,
    improvedDomains,
  };
}

export function calculateQuizSignal(args: {
  quizAttempts: ProgressionQuizAttempt[];
  config: ProgressionConfig;
}) {
  const scores = args.quizAttempts.map((attempt) => attempt.score);
  const recentAverage = weightedRecentAverage(scores);

  if (recentAverage === null) {
    return {
      recentAverage: null,
      signal: null,
      consistencyScore: null,
      repeatedLowPenalty: 0,
      recentPoorPenalty: 0,
      improvementBonus: 0,
      repeatedImprovementBonus: 0,
    };
  }

  const consistencyScore =
    scores.length < 2
      ? null
      : clampNumber(
          roundNumber(
            100 -
              getScoreStandardDeviation(scores) * 1.6 -
              (scores.filter((score) => score < args.config.thresholds.urgentWeakAreaScore).length /
                scores.length) *
                35,
          ),
          35,
          100,
        );

  // Business rule: short quizzes should help readiness only when the scores are
  // reasonably steady. Wild swings often mean guessing or shallow recall.
  const reliabilityMultiplier =
    consistencyScore === null
      ? 0.88
      : clampNumber(0.68 + consistencyScore / 420, 0.68, 0.92);

  const repeatedLowAttempts = scores
    .slice(0, 4)
    .filter((score) => score < args.config.thresholds.urgentWeakAreaScore).length;
  const repeatedLowPenalty =
    repeatedLowAttempts >= 2
      ? roundNumber(
          (repeatedLowAttempts / 4) * args.config.adjustments.repeatedLowPenaltyMax,
        )
      : 0;

  const mostRecentLowScores = scores
    .slice(0, 3)
    .filter((score) => score < args.config.thresholds.practiceBuildScore).length;
  const recentPoorPenalty =
    mostRecentLowScores >= 2
      ? roundNumber(
          (mostRecentLowScores / 3) * args.config.adjustments.recentPoorPenaltyMax,
        )
      : 0;

  const trend = getLatestVsPreviousAverages(scores);
  const improvementBonus =
    trend && trend.delta >= args.config.improvement.quizDeltaForBonus
      ? roundNumber(
          Math.min(
            args.config.adjustments.improvementBonusMax,
            trend.delta / 2.5,
          ),
        )
      : 0;
  const repeatedImprovementBonus =
    scores.length >= 3 && scores[0] > scores[1] && scores[1] > scores[2]
      ? args.config.adjustments.repeatedImprovementBonusMax
      : 0;

  return {
    recentAverage,
    signal: roundNumber(recentAverage * reliabilityMultiplier),
    consistencyScore,
    repeatedLowPenalty,
    recentPoorPenalty,
    improvementBonus,
    repeatedImprovementBonus,
  };
}

export function calculatePracticeExamSignal(args: {
  mockAttempts: ProgressionMockAttempt[];
  config: ProgressionConfig;
}) {
  const scores = args.mockAttempts.map((attempt) => attempt.percent);

  if (!scores.length) {
    return {
      recentAverage: null,
      signal: null,
      bestScore: null,
      recentPoorPenalty: 0,
      improvementBonus: 0,
      repeatedImprovementBonus: 0,
    };
  }

  const recentAverage = weightedRecentAverage(scores);
  const bestScore = Math.max(...scores);

  // Business rule: full practice exams should matter more than short quizzes,
  // but one old strong mock should not hide a recent decline.
  const signal = roundNumber((recentAverage ?? bestScore) * 0.75 + bestScore * 0.25);
  const recentPoorPenalty =
    scores[0] < args.config.thresholds.mockExamPassingScore
      ? roundNumber(
          ((args.config.thresholds.mockExamPassingScore - scores[0]) /
            args.config.thresholds.mockExamPassingScore) *
            args.config.adjustments.recentPoorPenaltyMax,
        )
      : 0;

  const trend = getLatestVsPreviousAverages(scores);
  const improvementBonus =
    trend && trend.delta >= args.config.improvement.mockDeltaForBonus
      ? roundNumber(
          Math.min(
            args.config.adjustments.improvementBonusMax,
            trend.delta / 3,
          ),
        )
      : 0;
  const repeatedImprovementBonus =
    scores.length >= 2 && scores[0] > scores[1]
      ? Math.min(2, args.config.adjustments.repeatedImprovementBonusMax)
      : 0;

  return {
    recentAverage,
    signal,
    bestScore,
    recentPoorPenalty,
    improvementBonus,
    repeatedImprovementBonus,
  };
}

export function calculateActivityRecencySignal(args: {
  daysSinceActivity: number | null;
  config: ProgressionConfig;
}): ActivityRecencySignal {
  if (args.daysSinceActivity === null) {
    return {
      daysSinceActivity: null,
      status: "unknown",
      adjustment: 0,
    };
  }

  if (args.daysSinceActivity <= args.config.activity.recentDays) {
    return {
      daysSinceActivity: args.daysSinceActivity,
      status: "active",
      adjustment: 0,
    };
  }

  if (args.daysSinceActivity <= args.config.activity.coolingDays) {
    return {
      daysSinceActivity: args.daysSinceActivity,
      status: "cooling",
      adjustment: -1,
    };
  }

  if (args.daysSinceActivity <= args.config.activity.inactiveDays) {
    return {
      daysSinceActivity: args.daysSinceActivity,
      status: "stale",
      adjustment: -roundNumber(args.config.adjustments.inactivityPenaltyMax / 2),
    };
  }

  return {
    daysSinceActivity: args.daysSinceActivity,
    status: "inactive",
    adjustment: -args.config.adjustments.inactivityPenaltyMax,
  };
}

export function buildWeightedReadinessScore(args: {
  pretestScore: number | null;
  masteryAverage: number | null;
  moduleCompletionPercent: number;
  recentQuizSignal: number | null;
  practiceExamSignal: number | null;
  consistencyScore: number | null;
  activityAdjustment: number;
  recentPoorPenalty: number;
  repeatedLowPenalty: number;
  improvementBonus: number;
  repeatedImprovementBonus: number;
  config: ProgressionConfig;
}) {
  const baselineSignal =
    typeof args.pretestScore === "number"
      ? Math.min(args.pretestScore, args.config.caps.pretestBaselineMaxContribution)
      : null;
  const moduleSignal = Math.min(
    args.moduleCompletionPercent,
    args.config.caps.moduleCompletionMaxContribution,
  );
  const consistencyBonus =
    args.consistencyScore === null
      ? 0
      : roundNumber(
          ((Math.max(args.consistencyScore - 72, 0)) / 28) *
            args.config.adjustments.consistencyBonusMax,
        );

  const weightedSignals: Array<{ value: number | null; weight: number }> = [
    {
      value: baselineSignal,
      weight: args.config.readinessWeights.pretestBaseline,
    },
    {
      value: args.masteryAverage,
      weight: args.config.readinessWeights.mastery,
    },
    {
      value: moduleSignal,
      weight: args.config.readinessWeights.moduleCompletion,
    },
    {
      value: args.recentQuizSignal,
      weight: args.config.readinessWeights.recentQuizPerformance,
    },
    {
      value: args.practiceExamSignal,
      weight: args.config.readinessWeights.practiceExam,
    },
  ];

  const usableSignals = weightedSignals.filter(
    (signal): signal is { value: number; weight: number } =>
      typeof signal.value === "number",
  );

  if (!usableSignals.length) {
    return 0;
  }

  const weightedTotal = usableSignals.reduce(
    (sum, signal) => sum + signal.value * signal.weight,
    0,
  );
  const totalWeight = usableSignals.reduce((sum, signal) => sum + signal.weight, 0);
  const baseScore = weightedTotal / totalWeight;

  return clampNumber(
    roundNumber(
      baseScore +
        consistencyBonus +
        args.improvementBonus +
        args.repeatedImprovementBonus +
        args.activityAdjustment -
        args.recentPoorPenalty -
        args.repeatedLowPenalty,
    ),
    0,
    100,
  );
}

export function determinePracticeExamUnlock(args: {
  readinessScore: number;
  lessonsCompleted: number;
  quizzesCompleted: number;
  qualifyingQuizCount: number;
  config: ProgressionConfig;
}) {
  const meetsLessonThreshold =
    args.lessonsCompleted >= args.config.gates.practiceExamMinLessonsCompleted;
  const meetsQuizThreshold = args.qualifyingQuizCount >= args.config.gates.practiceExamMinQuizzesCompleted;

  const unlocked = meetsLessonThreshold && meetsQuizThreshold;

  if (unlocked) {
    return {
      unlocked: true,
      reason:
        "You've completed the lesson and quiz groundwork needed to unlock the full practice exam.",
    };
  }

  return {
    unlocked: false,
    reason:
      "Complete the guided lesson and quiz requirements first. Then the full practice exam will unlock.",
  };
}

export function determineReadinessState(args: {
  readinessScore: number;
  bestMockScore: number | null;
  recentMockAverage: number | null;
  urgentWeakAreaCount: number;
  practiceExamUnlocked: boolean;
  config: ProgressionConfig;
}) {
  if (
    args.readinessScore >= args.config.thresholds.examReadyScore &&
    args.urgentWeakAreaCount === 0 &&
    (args.bestMockScore ?? 0) >= args.config.thresholds.mockExamPassingScore
  ) {
    return {
      state: "exam_ready" as const,
      label: "Exam Ready" as const,
      summary: "You're in the exam-ready range right now.",
      encouragement:
        "Keep your routine steady with one more short review or full practice exam so your weakest topic doesn't slip before test day.",
    };
  }

  if (
    args.readinessScore >= args.config.thresholds.nearlyReadyScore ||
    ((args.recentMockAverage ?? 0) >= args.config.thresholds.mockExamPassingScore &&
      args.urgentWeakAreaCount <= 1)
  ) {
    return {
      state: "nearly_ready" as const,
      label: "Almost There" as const,
      summary: "You're getting close, but one or two areas still need to tighten up.",
      encouragement:
        "Stay with the weak areas now. This is the point where focused review matters more than extra random practice.",
    };
  }

  if (
    args.readinessScore >= args.config.thresholds.buildingReadinessScore ||
    args.practiceExamUnlocked
  ) {
    return {
      state: "building_readiness" as const,
      label: "Making Progress" as const,
      summary: "You're making real progress, and the foundation is starting to come together.",
      encouragement:
        "Keep working from weakest to strongest. Recent scores matter more than older ones, so steady practice will move this up.",
    };
  }

  return {
    state: "not_ready" as const,
    label: "Not Ready" as const,
    summary: "You're still building the foundation you need for the exam.",
    encouragement:
      "That's okay. Honest practice in the weakest areas will build a stronger study plan and a truer picture of your progress.",
  };
}

export function determineNextBestTask(args: {
  weakestDomain: ProgressionDomainSummary | null;
  readinessState: ReadinessState;
  bestMockScore: number | null;
  practiceExamUnlocked: boolean;
  moduleCompletionPercent: number;
  mockExamsCompleted: number;
  quizzesCompleted: number;
}) {
  if (
    args.weakestDomain &&
    args.weakestDomain.masteryScore < 70 &&
    args.readinessState !== "exam_ready"
  ) {
    return {
      type: "study_plan" as const,
      actionType: "review_weak_area" as const,
      title: `Review ${args.weakestDomain.domainTitle} next`,
      description:
        "This is your weakest area right now, so working on it is the fastest way to move forward.",
      href: "/study-plan",
    };
  }

  if (
    args.moduleCompletionPercent < 100 &&
    args.weakestDomain &&
    args.readinessState !== "exam_ready"
  ) {
    return {
      type: "study_plan" as const,
      actionType: "continue_module_work" as const,
      title: `Continue with ${args.weakestDomain.domainTitle}`,
      description:
        "Keep moving through the guided lessons in order so the weakest topics improve before you lean on bigger practice checks.",
      href: "/study-plan",
    };
  }

  if (args.quizzesCompleted < 2) {
    return {
      type: "quiz" as const,
      actionType: "take_quiz" as const,
      title: "Take a 10-question quiz next",
      description:
        "A short quiz will show whether the most recent lesson is sticking before you move into bigger practice checks.",
      href: args.weakestDomain?.domainSlug
        ? `/quiz?domain=${args.weakestDomain.domainSlug}`
        : "/quiz",
    };
  }

  if (!args.practiceExamUnlocked) {
    return {
      type: "study_plan" as const,
      actionType: "continue_module_work" as const,
      title: "Keep building before the full practice exam",
      description:
        "You still need a little more lesson and quiz work before a full practice exam is the right next step.",
      href: "/study-plan",
    };
  }

  if (!args.mockExamsCompleted || (args.bestMockScore ?? 0) < 75) {
    return {
      type: "mock_exam" as const,
      actionType: "take_full_practice_exam" as const,
      title: "Take a full practice exam",
      description:
        "You've built enough foundation for a full practice exam. That result will tell you more than another short quiz.",
      href: "/mock-exam",
    };
  }

  return {
    type: "maintain" as const,
    actionType: "prepare_for_actual_exam" as const,
    title: "Prepare for exam day",
    description:
      "You're in range. Keep your routine steady, protect your weakest topic, and get ready for the real exam.",
    href: "/exam-day",
  };
}

export function determineEncouragements(args: {
  nextBestTask: NextBestTask;
  examReady: boolean;
}) {
  return {
    continueModuleWork: args.nextBestTask.actionType === "continue_module_work",
    reviewWeakArea: args.nextBestTask.actionType === "review_weak_area",
    takeQuiz: args.nextBestTask.actionType === "take_quiz",
    takeFullPracticeExam: args.nextBestTask.actionType === "take_full_practice_exam",
    prepareForActualExam:
      args.nextBestTask.actionType === "prepare_for_actual_exam" || args.examReady,
  };
}

export function buildReadinessChecklist(args: {
  domains: ProgressionDomainSummary[];
  quizAttempts: ProgressionQuizAttempt[];
  lessonsCompleted: number;
  recentQuizAverage: number | null;
  bestMockScore: number | null;
  activitySignal: ActivityRecencySignal;
  config: ProgressionConfig;
}) {
  const items: ReadinessChecklistItem[] = [];
  const weakestDomain = args.domains[0] ?? null;
  const focusDomains = args.domains.slice(0, 2);
  const lessonTarget = args.config.gates.practiceExamMinLessonsCompleted;
  const lessonMet = args.lessonsCompleted >= lessonTarget;
  const lessonRemaining = Math.max(0, lessonTarget - args.lessonsCompleted);

  items.push({
    id: "guided-lessons",
    title: `Complete ${lessonTarget} guided lesson${lessonTarget === 1 ? "" : "s"}`,
    description: lessonMet
      ? `You've completed ${args.lessonsCompleted} guided lesson${args.lessonsCompleted === 1 ? "" : "s"}, so the study foundation is in place.`
      : `You need ${formatRemainingCount(lessonRemaining, "guided lesson")} before exam readiness has enough study evidence.`,
    href: "/study-plan",
    met: lessonMet,
  });

  if (weakestDomain) {
    const quizTarget = args.config.gates.practiceExamMinQuizzesCompleted;
    const quizzesInWeakestDomain = args.quizAttempts.filter(
      (attempt) => attempt.domainSlug === weakestDomain.domainSlug,
    ).length;
    const quizMet = quizzesInWeakestDomain >= quizTarget;
    const quizRemaining = Math.max(0, quizTarget - quizzesInWeakestDomain);

    items.push({
      id: `quizzes-${weakestDomain.domainSlug}`,
      title: `Complete ${quizTarget} quizzes in ${weakestDomain.domainTitle}`,
      description: quizMet
        ? `You've already built quiz evidence in ${weakestDomain.domainTitle}.`
        : `You need ${formatRemainingCount(quizRemaining, "quiz")} in ${weakestDomain.domainTitle} so the weakest area is backed by real practice.`,
      href: `/quiz?domain=${weakestDomain.domainSlug}`,
      met: quizMet,
    });
  }

  for (const domain of focusDomains) {
    const targetScore = args.config.thresholds.practiceBuildScore;
    const met = domain.masteryScore >= targetScore;

    items.push({
      id: `module-${domain.domainSlug}`,
      title: `Review ${domain.domainTitle} module`,
      description: met
        ? `${domain.domainTitle} is at ${domain.masteryScore}% and no longer looks like a readiness blocker.`
        : `Current mastery is ${domain.masteryScore}%. Bring this topic to ${targetScore}%+ before you trust your readiness.`,
      href: "/study-plan",
      met,
    });
  }

  const recentQuizTarget = args.config.thresholds.practiceBuildScore;
  const recentQuizMet =
    args.recentQuizAverage !== null && args.recentQuizAverage >= recentQuizTarget;

  items.push({
    id: "recent-quiz-average",
    title: `Keep your recent quiz average at ${recentQuizTarget}%+`,
    description: recentQuizMet
      ? `Your recent quiz average is ${args.recentQuizAverage}%, which supports steady readiness.`
      : args.recentQuizAverage === null
        ? "You need recent quiz results before readiness can trust short-check performance."
        : `Your recent quiz average is ${args.recentQuizAverage}%. Push it to ${recentQuizTarget}%+ so your short checks match your study work.`,
    href: weakestDomain?.domainSlug ? `/quiz?domain=${weakestDomain.domainSlug}` : "/quiz",
    met: recentQuizMet,
  });

  const mockTarget = args.config.thresholds.mockExamPassingScore;
  const mockMet = (args.bestMockScore ?? 0) >= mockTarget;

  items.push({
    id: "full-practice-exam",
    title: `Score ${mockTarget}%+ on a full practice exam`,
    description: mockMet
      ? `Your best full practice exam is ${args.bestMockScore}%, which is in range for exam readiness.`
      : args.bestMockScore === null
        ? "You still need a passing full practice exam. That is one of the clearest exam-ready checks."
        : `Your best full practice exam is ${args.bestMockScore}%. Raise it to ${mockTarget}%+ before you call yourself exam-ready.`,
    href: "/mock-exam",
    met: mockMet,
  });

  if (args.activitySignal.status === "stale" || args.activitySignal.status === "inactive") {
    items.push({
      id: "recent-activity",
      title: "Study again this week",
      description:
        args.activitySignal.daysSinceActivity === null
          ? "Recent activity helps readiness stay trustworthy."
          : `It has been ${args.activitySignal.daysSinceActivity} day${args.activitySignal.daysSinceActivity === 1 ? "" : "s"} since your last study session. A fresh study block will help your readiness reflect what you know now.`,
      href: "/study-plan",
      met: false,
    });
  }

  return items.sort((a, b) => Number(a.met) - Number(b.met));
}

export function buildStudentProgressionSnapshot(args: BuildStudentProgressionSnapshotArgs) {
  const config = args.config ?? DEFAULT_PROGRESSION_CONFIG;
  const domainSummaries = buildDomainSummaries({
    pretestDomainBreakdown: args.pretestDomainBreakdown,
    masteryRows: args.masteryRows,
    config,
    domains: args.domains,
  });
  const masteryAverage = averageScores(domainSummaries.map((domain) => domain.masteryScore));
  const totalModules = Math.max(1, args.totalModules ?? listTutorLessons().length);
  const moduleCompletionPercent = Math.min(
    100,
    roundNumber((Math.min(args.lessonsCompleted, totalModules) / totalModules) * 100),
  );

  const domainImprovement = calculateDomainImprovement({
    domains: domainSummaries,
    config,
  });
  const quizSignal = calculateQuizSignal({
    quizAttempts: args.quizAttempts,
    config,
  });
  const mockSignal = calculatePracticeExamSignal({
    mockAttempts: args.mockAttempts,
    config,
  });
  const activitySignal = calculateActivityRecencySignal({
    daysSinceActivity: args.daysSinceActivity ?? null,
    config,
  });
  const combinedImprovementBonus = Math.min(
    config.adjustments.improvementBonusMax,
    Math.max(quizSignal.improvementBonus, mockSignal.improvementBonus) +
      domainImprovement.bonus,
  );
  const repeatedImprovementBonus = Math.min(
    config.adjustments.repeatedImprovementBonusMax,
    Math.max(quizSignal.repeatedImprovementBonus, mockSignal.repeatedImprovementBonus),
  );

  const readinessScore = buildWeightedReadinessScore({
    pretestScore: args.pretestScore,
    masteryAverage,
    moduleCompletionPercent,
    recentQuizSignal: quizSignal.signal,
    practiceExamSignal: mockSignal.signal,
    consistencyScore: quizSignal.consistencyScore,
    activityAdjustment: activitySignal.adjustment,
    recentPoorPenalty: Math.max(
      quizSignal.recentPoorPenalty,
      mockSignal.recentPoorPenalty,
    ),
    repeatedLowPenalty: quizSignal.repeatedLowPenalty,
    improvementBonus: combinedImprovementBonus,
    repeatedImprovementBonus,
    config,
  });

  const urgentWeakAreaCount = domainSummaries.filter(
    (domain) => domain.masteryScore < config.thresholds.urgentWeakAreaScore,
  ).length;
  const practiceExamGate = determinePracticeExamUnlock({
    readinessScore,
    lessonsCompleted: args.lessonsCompleted,
      quizzesCompleted: args.quizzesCompleted,
      qualifyingQuizCount: args.quizAttempts.filter((attempt) => attempt.score >= 60).length,
      config,
    });
  const readiness = determineReadinessState({
    readinessScore,
    bestMockScore: mockSignal.bestScore,
    recentMockAverage: mockSignal.recentAverage,
    urgentWeakAreaCount,
    practiceExamUnlocked: practiceExamGate.unlocked,
    config,
  });
  const nextBestTask = determineNextBestTask({
    weakestDomain: domainSummaries[0] ?? null,
    readinessState: readiness.state,
    bestMockScore: mockSignal.bestScore,
    practiceExamUnlocked: practiceExamGate.unlocked,
    moduleCompletionPercent,
    mockExamsCompleted: args.mockExamsCompleted,
    quizzesCompleted: args.quizzesCompleted,
  });
  const readinessChecklist = buildReadinessChecklist({
    domains: domainSummaries,
    quizAttempts: args.quizAttempts,
    lessonsCompleted: args.lessonsCompleted,
    recentQuizAverage: quizSignal.recentAverage,
    bestMockScore: mockSignal.bestScore,
    activitySignal,
    config,
  });

  return {
    config,
    readinessScore,
    readinessState: readiness.state,
    readinessLabel: readiness.label,
    summary: readiness.summary,
    encouragement: readiness.encouragement,
    practiceExamUnlocked: practiceExamGate.unlocked,
    practiceExamGateReason: practiceExamGate.reason,
    examReady: readiness.state === "exam_ready",
    rankedDomains: domainSummaries,
    strengths: domainSummaries
      .filter((domain) => domain.masteryScore >= config.thresholds.strengthScore)
      .slice(0, 3),
    weakAreas: domainSummaries
      .filter((domain) => domain.masteryScore < config.thresholds.practiceBuildScore)
      .slice(0, 5),
    topWeakAreas: domainSummaries
      .filter((domain) => domain.masteryScore < config.thresholds.practiceBuildScore)
      .slice(0, 3),
    priorityOrder: domainSummaries.slice(0, 5),
    readinessChecklist,
    nextBestTask,
    encouragements: determineEncouragements({
      nextBestTask,
      examReady: readiness.state === "exam_ready",
    }),
    signals: {
      pretestScore: args.pretestScore,
      masteryAverage,
      moduleCompletionPercent,
      recentQuizAverage: quizSignal.recentAverage,
      quizConsistencyScore: quizSignal.consistencyScore,
      recentMockAverage: mockSignal.recentAverage,
      bestMockScore: mockSignal.bestScore,
      lessonsCompleted: args.lessonsCompleted,
      quizzesCompleted: args.quizzesCompleted,
      qualifyingQuizzesCompleted: args.quizAttempts.filter((attempt) => attempt.score >= 60).length,
      mockExamsCompleted: args.mockExamsCompleted,
      daysSinceActivity: activitySignal.daysSinceActivity,
      activityAdjustment: activitySignal.adjustment,
      repeatedImprovementBonus,
      improvementBonus: combinedImprovementBonus,
      domainImprovementCount: domainImprovement.count,
      recentPoorPenalty: Math.max(
        quizSignal.recentPoorPenalty,
        mockSignal.recentPoorPenalty,
      ),
      repeatedLowPenalty: quizSignal.repeatedLowPenalty,
    },
  } satisfies ProgressionSnapshot;
}
