import type { PretestDomainBreakdown } from "@/lib/ccma/onboarding/pretest";
import { createClient } from "@/lib/supabase/server";
import { getStudentProgressionSnapshot } from "@/lib/ccma/progression/student";
import { formatDateTime } from "@/lib/utils";
import type { ProgressionSnapshot } from "@/lib/ccma/progression/readiness";

function average(values: number[]) {
  if (!values.length) return null;
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
}

function getQuizTrend(scores: number[]) {
  const latestAverage = average(scores.slice(0, 3));
  const previousAverage = average(scores.slice(3, 6));

  if (latestAverage === null) {
    return {
      label: "No quiz history yet",
      direction: "steady" as const,
      summary: "Your quiz trend will show here after you complete a few 10-question quizzes.",
    };
  }

  if (previousAverage === null) {
    return {
      label: "Getting started",
      direction: "steady" as const,
      summary: "Keep taking short quizzes so you can see whether your scores start moving up over time.",
    };
  }

  const delta = latestAverage - previousAverage;

  if (delta >= 4) {
    return {
      label: "Trending up",
      direction: "up" as const,
      summary: "Your recent quiz scores are improving. That is a good sign that the study plan is working.",
    };
  }

  if (delta <= -4) {
    return {
      label: "Needs attention",
      direction: "down" as const,
      summary: "Your recent quiz scores dipped. Go back to the weakest topics before moving into harder practice.",
    };
  }

  return {
    label: "Holding steady",
    direction: "steady" as const,
    summary: "Your quiz scores are steady. Keep tightening weak areas to move readiness higher.",
  };
}

function getConfidenceTrend(scores: number[]) {
  const latestAverage = average(scores.slice(0, 3));
  const previousAverage = average(scores.slice(3, 6));

  if (latestAverage === null) {
    return {
      label: "No confidence check-ins yet",
      direction: "steady" as const,
      summary: "Your confidence trend will show here after you check in before a few quizzes.",
    };
  }

  if (previousAverage === null) {
    return {
      label: "Getting started",
      direction: "steady" as const,
      summary: "Keep checking in before quizzes so you can see whether confidence is rising with your scores.",
    };
  }

  const delta = latestAverage - previousAverage;

  if (delta >= 1) {
    return {
      label: "Confidence rising",
      direction: "up" as const,
      summary: "You're reporting more confidence before quizzes — a good sign when it rises alongside performance.",
    };
  }

  if (delta <= -1) {
    return {
      label: "Confidence dipped",
      direction: "down" as const,
      summary: "Your confidence dipped recently. Slow down, tighten the topic, and let the next quiz rebuild certainty.",
    };
  }

  return {
    label: "Confidence steady",
    direction: "steady" as const,
    summary: "Your confidence is holding steady. Keep practicing in order so it keeps matching what you know.",
  };
}

function getImprovementHighlights(progression: ProgressionSnapshot) {
  const highlights = progression.rankedDomains
    .map((domain) => ({
      domainSlug: domain.domainSlug,
      domainTitle: domain.domainTitle,
      baselineScore: domain.baselineScore,
      currentScore: domain.masteryScore,
      improvement: domain.masteryScore - domain.baselineScore,
    }))
    .filter((domain) => domain.improvement >= 8)
    .sort((a, b) => b.improvement - a.improvement || a.domainTitle.localeCompare(b.domainTitle))
    .slice(0, 3);

  return {
    count: highlights.length,
    items: highlights.map((highlight) => ({
      ...highlight,
      message: `You improved ${highlight.domainTitle} from ${highlight.baselineScore}% to ${highlight.currentScore}%.`,
    })),
  };
}

function getProgressEncouragement(args: {
  progression: ProgressionSnapshot;
  improvementCount: number;
}) {
  if (args.improvementCount > 0) {
    return "Your work is showing up in the weaker topics. Keep moving in order so the gains stick.";
  }

  if (args.progression.signals.lessonsCompleted === 0) {
    return "Start the first guided lesson to build early momentum.";
  }

  if (args.progression.signals.mockExamsCompleted > 0) {
    return "You have real practice data now. Stay with the weakest areas and keep tightening them.";
  }

  return "Steady work in the weakest topics will move readiness more than jumping between stronger ones.";
}

function getDaysSince(value: string | null) {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return null;
  return Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
}

function isInactive(lastActivityAt: string | null) {
  const daysSince = getDaysSince(lastActivityAt);
  return daysSince !== null && daysSince > 5;
}

function getFailureRecoveryPlan(args: {
  progression: ProgressionSnapshot;
  quizAttempts: Array<{ score: number }>;
  mockAttempts: Array<{ percent: number }>;
  lastActivityAt: string | null;
  improvementCount: number;
  quizTrend: ReturnType<typeof getQuizTrend>;
  resumableSessionId: string | null;
  resumableLessonTitle: string | null;
  resumableLessonDomainSlug: string | null;
}) {
  const weakestDomain = args.progression.priorityOrder[0] ?? null;
  const daysSince = getDaysSince(args.lastActivityAt);
  const recentLowQuizCount = args.quizAttempts
    .slice(0, 4)
    .filter((a) => a.score < args.progression.config.thresholds.urgentWeakAreaScore).length;
  const recentLowMockCount = args.mockAttempts
    .slice(0, 2)
    .filter((a) => a.percent < args.progression.config.thresholds.mockExamPassingScore).length;
  const repeatedLowScores = recentLowQuizCount >= 2 || recentLowQuizCount + recentLowMockCount >= 2;
  const lackOfProgress =
    !repeatedLowScores &&
    args.progression.signals.lessonsCompleted >= 2 &&
    args.progression.signals.quizzesCompleted >= 2 &&
    args.improvementCount === 0 &&
    args.progression.readinessState === "not_ready";
  const inactivity =
    !repeatedLowScores &&
    !lackOfProgress &&
    !args.progression.examReady &&
    daysSince !== null &&
    daysSince >= 7;

  if (!repeatedLowScores && !lackOfProgress && !inactivity) {
    return { active: false } as const;
  }

  const targetDomainTitle = weakestDomain?.domainTitle ?? "your weakest topic";
  const reviewHref = weakestDomain?.domainSlug
    ? `/ccma/study-plan?topics=${weakestDomain.domainSlug}`
    : "/ccma/study-plan";
  const resumeWeakLesson =
    weakestDomain?.domainSlug &&
    args.resumableSessionId &&
    args.resumableLessonDomainSlug === weakestDomain.domainSlug
      ? {
          href: `/ccma/study/${args.resumableSessionId}`,
          label: args.resumableLessonTitle
            ? `Resume ${args.resumableLessonTitle}`
            : `Resume ${targetDomainTitle}`,
        }
      : null;
  const primaryAction = resumeWeakLesson ?? { href: reviewHref, label: `Review ${targetDomainTitle}` };

  if (repeatedLowScores) {
    return {
      active: true,
      reason: "repeated_low_scores" as const,
      headline: `Slow down and rebuild ${targetDomainTitle}.`,
      summary:
        "Your recent quiz or mock scores stayed below the target range. The best next move is to return to the weakest topic before taking another bigger check.",
      encouragement:
        "You are not stuck. One focused review block can turn a rough stretch into real progress again.",
      nextStep: {
        title: `Review ${targetDomainTitle} before more practice`,
        description:
          "Go back to the guided lesson for this topic, then use one short quiz to confirm improvement before another mock.",
        ctaLabel: primaryAction.label,
        ctaHref: primaryAction.href,
      },
    } as const;
  }

  if (lackOfProgress) {
    return {
      active: true,
      reason: "lack_of_progress" as const,
      headline: "Tighten one topic instead of spreading your effort around.",
      summary:
        "You have been putting in work, but the weakest topics have not moved enough yet. A narrower recovery step will help more than doing more of everything.",
      encouragement:
        "Keep it simple: one weak topic, one guided review, one short quiz. That is enough to get momentum back.",
      nextStep: {
        title: `Rebuild ${targetDomainTitle} next`,
        description:
          "Focus on one weak section first, then use a 10-question quiz to check whether the main ideas are sticking.",
        ctaLabel: primaryAction.label,
        ctaHref: primaryAction.href,
      },
    } as const;
  }

  return {
    active: true,
    reason: "inactivity" as const,
    headline: "Restart with one focused step.",
    summary:
      daysSince !== null
        ? `It has been ${daysSince} day${daysSince === 1 ? "" : "s"} since your last study activity. The fastest way back in is one targeted review block, not a full reset.`
        : "You have been away from study for a bit. The fastest way back in is one targeted review block, not a full reset.",
    encouragement:
      args.quizTrend.direction === "down"
        ? "Start with your weakest topic so you rebuild confidence and accuracy together."
        : "You do not need to do everything at once. Restart with the weakest topic and let the next step guide the rest.",
    nextStep: {
      title: `Restart with ${targetDomainTitle}`,
      description:
        "Come back through the weakest topic first. Once that lesson is fresh again, take one short quiz to get moving.",
      ctaLabel: primaryAction.label,
      ctaHref: primaryAction.href,
    },
  } as const;
}

export async function getStudentDashboard(args: {
  userId: string;
  pretestScore: number | null;
  pretestDomainBreakdown: PretestDomainBreakdown[];
}) {
  return getCcmaStudentDashboard(args);
}

export async function getCcmaStudentDashboard(args: {
  userId: string;
  pretestScore: number | null;
  pretestDomainBreakdown: PretestDomainBreakdown[];
}) {
  const supabase = await createClient();
  const progression = await getStudentProgressionSnapshot({
    userId: args.userId,
    pretestScore: args.pretestScore,
    pretestDomainBreakdown: args.pretestDomainBreakdown,
  });

  const [
    { data: rawQuizAttempts },
    { data: rawMockAttempts },
    { data: rawTutorSessions },
    { data: profileRow },
    { data: confidenceEvents },
  ] = await Promise.all([
    supabase
      .from("quiz_attempts")
      .select("id, score, total_questions, completed_at, domain_id")
      .eq("user_id", args.userId)
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false })
      .limit(6),
    supabase
      .from("mock_exam_attempts")
      .select("id, percent, passed, completed_at")
      .eq("user_id", args.userId)
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false })
      .limit(6),
    supabase
      .from("tutor_sessions")
      .select("id, status, mode, last_activity_at, session_state_json")
      .eq("user_id", args.userId)
      .order("last_activity_at", { ascending: false })
      .limit(6),
    supabase
      .from("profiles")
      .select("last_activity_at")
      .eq("id", args.userId)
      .eq("product", "ccma")
      .single(),
    supabase
      .from("activity_events")
      .select("metadata_json, occurred_at")
      .eq("user_id", args.userId)
      .in("event_type", ["quiz_completed", "weak_area_drill_completed"])
      .order("occurred_at", { ascending: false })
      .limit(12),
  ]);

  const quizAttempts = rawQuizAttempts ?? [];
  const mockAttempts = rawMockAttempts ?? [];
  const tutorSessions = rawTutorSessions ?? [];

  const quizDomainIds = quizAttempts
    .map((a) => a.domain_id)
    .filter((v): v is string => Boolean(v));
  const { data: quizDomains } = quizDomainIds.length
    ? await supabase.from("domains").select("id, title").in("id", quizDomainIds)
    : { data: [] };
  const quizDomainMap = new Map((quizDomains ?? []).map((d) => [d.id, d.title]));

  const confidenceScoresByOccurredAt = new Map(
    (confidenceEvents ?? []).map((event) => {
      const metadata = event.metadata_json as { confidenceScore?: number; confidenceLevel?: string } | null;
      return [
        event.occurred_at,
        {
          confidenceScore: typeof metadata?.confidenceScore === "number" ? metadata.confidenceScore : null,
          confidenceLabel: typeof metadata?.confidenceLevel === "string" ? metadata.confidenceLevel : null,
        },
      ];
    }),
  );

  const recentQuizConfidenceScores = quizAttempts
    .map((a) =>
      a.completed_at
        ? (confidenceScoresByOccurredAt.get(a.completed_at)?.confidenceScore ?? null)
        : null,
    )
    .filter((v): v is number => typeof v === "number");

  const qualifyingQuizCount = quizAttempts.filter((a) => a.score >= 60).length;
  const practiceExamRequirements = {
    lessonsCompleted: progression.signals.lessonsCompleted,
    lessonsRequired: progression.config.gates.practiceExamMinLessonsCompleted,
    lessonsMet:
      progression.signals.lessonsCompleted >= progression.config.gates.practiceExamMinLessonsCompleted,
    qualifyingQuizCount,
    qualifyingQuizRequired: 1,
    qualifyingQuizMet: qualifyingQuizCount >= 1,
  };

  const quizTrend = getQuizTrend(quizAttempts.map((a) => a.score));
  const confidenceTrend = getConfidenceTrend(recentQuizConfidenceScores);
  const improvementHighlights = getImprovementHighlights(progression);

  const resumableSession =
    tutorSessions.find((s) => s.status === "active" || s.status === "paused") ?? null;

  let resumableLesson: { title: string; domainSlug: string } | null = null;
  if (resumableSession?.session_state_json) {
    const state = resumableSession.session_state_json as { lessonId?: string } | null;
    if (state?.lessonId) {
      const { getLessonByDomain } = await import("@/lib/ccma/tutor/lessons");
      const lessons = getLessonByDomain("");
      const found = lessons.find((l: { id: string }) => l.id === state.lessonId) ?? null;
      resumableLesson = found
        ? { title: (found as { title: string }).title, domainSlug: (found as { domainSlug: string }).domainSlug }
        : null;
    }
  }

  const recoveryPlan = getFailureRecoveryPlan({
    progression,
    quizAttempts,
    mockAttempts,
    lastActivityAt: profileRow?.last_activity_at ?? null,
    improvementCount: improvementHighlights.count,
    quizTrend,
    resumableSessionId: resumableSession?.id ?? null,
    resumableLessonTitle: resumableLesson?.title ?? null,
    resumableLessonDomainSlug: resumableLesson?.domainSlug ?? null,
  });

  const nextStep =
    recoveryPlan.active
      ? {
          title: recoveryPlan.nextStep.title,
          description: recoveryPlan.nextStep.description,
          ctaLabel: recoveryPlan.nextStep.ctaLabel,
          ctaHref: recoveryPlan.nextStep.ctaHref,
        }
      : resumableSession && resumableLesson
        ? {
            title: `Resume ${resumableLesson.title}`,
            description:
              "You already started this lesson. Picking it back up is the best way to make progress today.",
            ctaLabel: "Resume lesson",
            ctaHref: `/ccma/study/${resumableSession.id}`,
          }
        : {
            title: progression.nextBestTask.title,
            description: progression.nextBestTask.description,
            ctaLabel:
              progression.nextBestTask.type === "mock_exam"
                ? "Take practice exam"
                : progression.nextBestTask.type === "quiz"
                  ? "Take practice quiz"
                  : progression.nextBestTask.type === "maintain"
                    ? "Open exam-day plan"
                    : "Continue study plan",
            ctaHref: progression.nextBestTask.href,
          };

  const inactive = isInactive(profileRow?.last_activity_at ?? null);

  return {
    progression,
    isInactive: inactive,
    nextStep,
    recoveryPlan,
    weakAreas: progression.weakAreas.map((area) => ({
      domainId: area.domainSlug,
      domainSlug: area.domainSlug,
      title: area.domainTitle,
      lessonTitle: area.lessonTitle,
      masteryScore: area.masteryScore,
      weakStreak: area.weakStreak,
      urgency:
        area.priorityLabel === "Start first"
          ? "High"
          : area.priorityLabel === "Build next"
            ? "Medium"
            : "Low",
      recommendation: area.recommendation,
    })),
    studyPlanProgress: {
      completedModules: Math.min(
        progression.signals.lessonsCompleted,
        Math.max(1, progression.priorityOrder.length),
      ),
      remainingModules: Math.max(
        0,
        progression.signals.lessonsCompleted >= progression.priorityOrder.length
          ? 0
          : progression.priorityOrder.length - progression.signals.lessonsCompleted,
      ),
      totalModules:
        progression.signals.lessonsCompleted >= progression.priorityOrder.length
          ? progression.signals.lessonsCompleted || progression.priorityOrder.length
          : progression.priorityOrder.length,
      percentComplete: progression.signals.moduleCompletionPercent,
      improvedAreasCount: improvementHighlights.count,
      nextFocus: progression.priorityOrder[0]?.domainTitle ?? "your next recommended topic",
      summary:
        progression.signals.moduleCompletionPercent < 100
          ? `Keep working from weakest to strongest. ${progression.priorityOrder[0]?.domainTitle ?? "The next topic"} should stay first until it improves.`
          : "You have worked through the guided lessons. Keep using quizzes and full practice exams to confirm you are ready.",
      encouragement: getProgressEncouragement({
        progression,
        improvementCount: improvementHighlights.count,
      }),
      improvementHighlights: improvementHighlights.items,
    },
    practicePerformance: {
      averageRecentScore: progression.signals.recentQuizAverage,
      trendLabel: quizTrend.label,
      trendDirection: quizTrend.direction,
      summary: quizTrend.summary,
      confidenceLabel: confidenceTrend.label,
      confidenceDirection: confidenceTrend.direction,
      confidenceSummary: confidenceTrend.summary,
      recentScores: quizAttempts.map((a) => ({
        id: a.id,
        score: a.score,
        confidenceScore: a.completed_at
          ? (confidenceScoresByOccurredAt.get(a.completed_at)?.confidenceScore ?? null)
          : null,
        confidenceLabel: a.completed_at
          ? (confidenceScoresByOccurredAt.get(a.completed_at)?.confidenceLabel ?? null)
          : null,
        totalQuestions: a.total_questions,
        domainTitle: a.domain_id ? quizDomainMap.get(a.domain_id) ?? "Practice quiz" : "Practice quiz",
        completedAt: a.completed_at ? formatDateTime(a.completed_at) : "Recently completed",
      })),
    },
    practiceExamStatus: {
      unlocked: progression.practiceExamUnlocked,
      completed: mockAttempts.length > 0,
      requirements: practiceExamRequirements,
      attempts: progression.signals.mockExamsCompleted,
      bestScore: progression.signals.bestMockScore,
      lastScore: mockAttempts[0]?.percent ?? null,
      lastCompletedAt: mockAttempts[0]?.completed_at
        ? formatDateTime(mockAttempts[0].completed_at)
        : null,
      statusLabel:
        !progression.practiceExamUnlocked
          ? "Locked until more foundation work is done"
          : mockAttempts.length === 0
            ? "Ready for a full practice exam"
            : (progression.signals.bestMockScore ?? 0) >=
                progression.config.thresholds.mockExamPassingScore
              ? "Completed and in range"
              : "Completed, more work needed",
      summary:
        !progression.practiceExamUnlocked
          ? progression.practiceExamGateReason
          : mockAttempts.length === 0
            ? "You have enough foundation now for a full practice exam. Use it as one of your clearest readiness checks."
            : (progression.signals.bestMockScore ?? 0) >=
                progression.config.thresholds.mockExamPassingScore
              ? "Your best full practice exam is in range. Keep tightening weak areas so that score stays steady."
              : "Your full practice results show there is still targeted review to do before final readiness.",
    },
  };
}
