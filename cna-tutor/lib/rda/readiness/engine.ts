import { rdaDomains, rdaDomainBySlug, type RDADomainSlug } from "@/content/rda/domains";
import { rdaTutorLessonLibrary } from "@/content/rda/lesson-library";
import {
  scoreRdaReadiness,
  type RdaReadinessAttemptInput,
} from "@/lib/rda/readiness/scoring";

export type RDAReadinessLabel = "Not Ready" | "Making Progress" | "Almost There" | "Exam Ready";

export type RDADomainPerformance = {
  domainSlug: RDADomainSlug;
  domainTitle: string;
  correctCount: number;
  totalQuestions: number;
  percent: number;
};

export type RDAAttemptSignal = {
  domainSlug?: RDADomainSlug | null;
  score: number;
  completedAt?: string | null;
};

export type RDAMockSignal = {
  score: number;
  passed?: boolean;
  completedAt?: string | null;
};

export type RDALessonProgressSignal = {
  domainSlug: RDADomainSlug;
  masteryScore: number;
  completed: boolean;
  completedAt?: string | null;
};

export type RDAPretestAnalysis = {
  readinessScore: number;
  label: RDAReadinessLabel;
  weakAreas: RDADomainPerformance[];
  nextBestAction: string;
  confidenceEstimate: number;
  studyPlan: Array<{
    domainSlug: RDADomainSlug;
    domainTitle: string;
    priority: number;
    lessonId: string | null;
    reason: string;
  }>;
  domainBreakdown: RDADomainPerformance[];
};

export type RDAReadinessSnapshot = {
  readinessScore: number;
  label: RDAReadinessLabel;
  blockingReason: string | null;
  weakAreas: RDADomainPerformance[];
  nextBestTask: {
    title: string;
    description: string;
    href: string;
  };
  studyChecklist: Array<{
    id: string;
    title: string;
    met: boolean;
    href: string;
  }>;
  recentQuizPerformance: number | null;
  mockExamsCompleted: number;
  lastActivity: string | null;
  confidenceTrend: number;
  capsApplied: string[];
  weakAreaPersistenceFlags: string[];
  remediationMessages: string[];
  recoveryTrend: Array<{
    domainSlug: RDADomainSlug;
    domainTitle: string;
    baseline: number;
    current: number;
    delta: number;
  }>;
  domainBreakdown: RDADomainPerformance[];
};

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function average(values: number[]) {
  if (!values.length) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function weightedAverage(rows: RDADomainPerformance[]) {
  const weighted = rows.reduce((sum, row) => {
    const domain = rdaDomainBySlug[row.domainSlug];
    return sum + row.percent * domain.weight;
  }, 0);

  return clamp(weighted);
}

function labelForScore(score: number, hasMockExam: boolean, bestMockScore: number | null): RDAReadinessLabel {
  if (score >= 85 && hasMockExam && (bestMockScore ?? 0) >= 80) return "Exam Ready";
  if (score >= 74) return "Almost There";
  if (score >= 55) return "Making Progress";
  return "Not Ready";
}

function normalizeBreakdown(rows: RDADomainPerformance[]) {
  const bySlug = new Map(rows.map((row) => [row.domainSlug, row]));

  return rdaDomains.map((domain) => {
    const row = bySlug.get(domain.slug);
    if (row) return row;
    return {
      domainSlug: domain.slug,
      domainTitle: domain.title,
      correctCount: 0,
      totalQuestions: 0,
      percent: 0,
    };
  });
}

function getStudyPlan(rows: RDADomainPerformance[]) {
  return [...rows]
    .sort((a, b) => a.percent - b.percent || rdaDomainBySlug[b.domainSlug].weight - rdaDomainBySlug[a.domainSlug].weight)
    .map((domain, index) => {
      const lesson = rdaTutorLessonLibrary.find((item) => item.domainSlug === domain.domainSlug);
      return {
        domainSlug: domain.domainSlug,
        domainTitle: domain.domainTitle,
        priority: index + 1,
        lessonId: lesson?.id ?? null,
        reason:
          domain.percent < 70
            ? `${domain.domainTitle} is below the mastery gate and should come before stronger topics.`
            : `${domain.domainTitle} is in maintenance range; revisit after weaker domains improve.`,
      };
    });
}

export function analyzeRdaPretest(domainBreakdown: RDADomainPerformance[]): RDAPretestAnalysis {
  const normalized = normalizeBreakdown(domainBreakdown);
  const readinessScore = Math.min(72, weightedAverage(normalized));
  const weakAreas = normalized.filter((domain) => domain.percent < 70).sort((a, b) => a.percent - b.percent);
  const label = labelForScore(readinessScore, false, null);
  const studyPlan = getStudyPlan(normalized);
  const confidenceEstimate = clamp(
    45 + normalized.filter((domain) => domain.percent >= 70).length * 6 - weakAreas.length * 4,
    20,
    78,
  );
  const next = studyPlan[0];

  return {
    readinessScore,
    label,
    weakAreas,
    nextBestAction: next
      ? `Start ${next.domainTitle} in guided study, then prove it with a short quiz.`
      : "Start the first guided RDA lesson.",
    confidenceEstimate,
    studyPlan,
    domainBreakdown: normalized,
  };
}

export function buildRdaReadinessSnapshot(args: {
  pretestBreakdown: RDADomainPerformance[];
  quizAttempts?: RDAAttemptSignal[];
  mockAttempts?: RDAMockSignal[];
  lessonProgress?: RDALessonProgressSignal[];
  lastActivity?: string | null;
}): RDAReadinessSnapshot {
  const baseline = normalizeBreakdown(args.pretestBreakdown);
  const quizAttempts = args.quizAttempts ?? [];
  const mockAttempts = args.mockAttempts ?? [];
  const lessonProgress = args.lessonProgress ?? [];
  const recentQuizPerformance = average(quizAttempts.slice(0, 5).map((attempt) => attempt.score));
  const bestMockScore = mockAttempts.length ? Math.max(...mockAttempts.map((attempt) => attempt.score)) : null;
  const recentMockAverage = average(mockAttempts.slice(0, 2).map((attempt) => attempt.score));

  const currentDomainRows = baseline.map((domain) => {
    const domainQuizzes = quizAttempts.filter((attempt) => attempt.domainSlug === domain.domainSlug);
    const quizAverage = average(domainQuizzes.map((attempt) => attempt.score));
    const progress = lessonProgress.find((row) => row.domainSlug === domain.domainSlug);
    const masteryEvidence = progress?.masteryScore ?? null;
    const current = average(
      [domain.percent, quizAverage, masteryEvidence].filter((value): value is number => typeof value === "number"),
    );

    return {
      ...domain,
      percent: clamp(current ?? domain.percent),
    };
  });

  const weightedDomainScore = weightedAverage(currentDomainRows);
  const quizAttemptInputs: RdaReadinessAttemptInput[] = quizAttempts.map((attempt) => ({
    kind: "quiz",
    score: attempt.score,
    completedAt: attempt.completedAt,
    domainScores: attempt.domainSlug
      ? currentDomainRows
          .filter((domain) => domain.domainSlug === attempt.domainSlug)
          .map((domain) => ({
            domainId: domain.domainSlug,
            domainName: domain.domainTitle,
            correctCount: 0,
            totalQuestions: 0,
            percent: attempt.score,
            weightedContribution: Number((attempt.score * rdaDomainBySlug[domain.domainSlug].weight).toFixed(2)),
          }))
      : undefined,
  }));
  const mockAttemptInputs: RdaReadinessAttemptInput[] = mockAttempts.map((attempt) => ({
    kind: "mock",
    score: attempt.score,
    completedAt: attempt.completedAt,
    domainScores: currentDomainRows.map((domain) => ({
      domainId: domain.domainSlug,
      domainName: domain.domainTitle,
      correctCount: 0,
      totalQuestions: 0,
      percent: domain.percent,
      weightedContribution: Number((domain.percent * rdaDomainBySlug[domain.domainSlug].weight).toFixed(2)),
    })),
  }));
  const scoredReadiness = scoreRdaReadiness({
    pretest: {
      kind: "pretest",
      score: weightedDomainScore,
      correctCount: 0,
      totalQuestions: 0,
      passed: false,
      domainScores: currentDomainRows.map((domain) => ({
        domainId: domain.domainSlug,
        domainName: domain.domainTitle,
        correctCount: domain.correctCount,
        totalQuestions: domain.totalQuestions,
        percent: domain.percent,
        weightedContribution: Number((domain.percent * rdaDomainBySlug[domain.domainSlug].weight).toFixed(2)),
      })),
      weakAreas: [],
      persistentWeakAreaFlags: [],
      remediationMessages: [],
    },
    quizAttempts: quizAttemptInputs,
    mockAttempts: mockAttemptInputs,
    lessonMasteryByDomain: Object.fromEntries(
      lessonProgress.map((row) => [row.domainSlug, row.masteryScore]),
    ),
  });
  const readinessScore = scoredReadiness.readinessScore;
  const label = scoredReadiness.label;
  const weakAreas = currentDomainRows.filter((domain) => domain.percent < 72).sort((a, b) => a.percent - b.percent);
  const weakest = weakAreas[0] ?? currentDomainRows[0];
  const mockGateMet = mockAttempts.length > 0 && (bestMockScore ?? 0) >= 80;
  const nextBestTask =
    label === "Exam Ready"
      ? {
          title: "Use the exam-day checklist",
          description: "You have the mock-exam evidence needed for exam readiness. Keep weak areas warm.",
          href: "/rda/exam-day",
        }
      : mockAttempts.length === 0 && recentQuizPerformance !== null && recentQuizPerformance >= 75
        ? {
            title: "Take a full RDA mock exam",
            description: "A full mock exam is the next meaningful gate before readiness can reach Exam Ready.",
            href: "/rda/mock-exam",
          }
        : {
            title: `Recover ${weakest.domainTitle}`,
            description: "This weak area is holding readiness down. Study it, then confirm with a quiz.",
            href: `/rda/study-plan?domain=${weakest.domainSlug}`,
          };

  return {
    readinessScore,
    label: mockGateMet ? label : label === "Exam Ready" ? "Almost There" : label,
    blockingReason: scoredReadiness.blockingReason,
    weakAreas,
    nextBestTask,
    studyChecklist: [
      {
        id: "pretest",
        title: "Complete the required 30-question pre-test",
        met: baseline.some((domain) => domain.totalQuestions > 0),
        href: "/rda/pretest",
      },
      {
        id: "weak-domain-recovery",
        title: `Bring ${weakest.domainTitle} to 72%+`,
        met: weakest.percent >= 72,
        href: `/rda/study-plan?domain=${weakest.domainSlug}`,
      },
      {
        id: "quiz-evidence",
        title: "Score 75%+ on recent quizzes",
        met: (recentQuizPerformance ?? 0) >= 75,
        href: "/rda/quiz",
      },
      {
        id: "mock-gate",
        title: "Pass at least one full 75-question mock exam",
        met: mockGateMet,
        href: "/rda/mock-exam",
      },
    ],
    recentQuizPerformance,
    mockExamsCompleted: mockAttempts.length,
    lastActivity: args.lastActivity ?? null,
    confidenceTrend: scoredReadiness.confidenceTrend,
    capsApplied: scoredReadiness.capsApplied,
    weakAreaPersistenceFlags: scoredReadiness.weakAreaPersistenceFlags,
    remediationMessages: scoredReadiness.remediationMessages,
    recoveryTrend: currentDomainRows.map((domain) => {
      const start = baseline.find((row) => row.domainSlug === domain.domainSlug)?.percent ?? 0;
      return {
        domainSlug: domain.domainSlug,
        domainTitle: domain.domainTitle,
        baseline: start,
        current: domain.percent,
        delta: domain.percent - start,
      };
    }),
    domainBreakdown: currentDomainRows,
  };
}
