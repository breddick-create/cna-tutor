import { RDA_DOMAINS, rdaDomainById, type RdaDomainId } from "@/content/rda/domains";
import {
  evaluateShortAnswer,
  evaluateTutorAnswer,
  type ShortAnswerEvaluation,
  type TutorEvaluationInput,
  type TutorEvaluationResult,
} from "@/lib/rda/tutor/evaluation";

export type RdaReadinessLabel = "Not Ready" | "Making Progress" | "Almost There" | "Exam Ready";
export type ReadinessLabel = RdaReadinessLabel;
export type RdaAttemptKind = "pretest" | "quiz" | "mock";

export type DomainScoreMap = Record<string, number>;

export type AttemptTrend = {
  date: string;
  score: number;
};

export type ReadinessInput = {
  pretestScore: number | null;
  lessonMasteryAverage: number | null;
  quizAverage: number | null;
  mockAverage: number | null;
  domainScores: DomainScoreMap;
  mockAttempts: number;
  recentMockTrend: AttemptTrend[];
};

export type ReadinessResult = {
  score: number;
  label: ReadinessLabel;
  weakAreas: string[];
  strengths: string[];
  nextBestAction: string;
  checklist: string[];
  recoverySignals: string[];
  confidenceTrend: number;
};

export type RdaSelectedAnswer = {
  questionId: string;
  domainId: RdaDomainId;
  selectedAnswer: string | null;
  correctAnswer: string;
  completedAt?: string | null;
};

export type RdaDomainScore = {
  domainId: RdaDomainId;
  domainName: string;
  correctCount: number;
  totalQuestions: number;
  percent: number;
  weightedContribution: number;
};

export type RdaAttemptScore = {
  kind: RdaAttemptKind;
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  domainScores: RdaDomainScore[];
  weakAreas: RdaDomainScore[];
  persistentWeakAreaFlags: string[];
  remediationMessages: string[];
};

export type RdaReadinessAttemptInput = {
  kind: RdaAttemptKind;
  score: number;
  domainScores?: RdaDomainScore[];
  completedAt?: string | null;
};

export type RdaReadinessInput = {
  pretest?: RdaAttemptScore | null;
  quizAttempts?: RdaReadinessAttemptInput[];
  mockAttempts?: RdaReadinessAttemptInput[];
  lessonMasteryByDomain?: Partial<Record<RdaDomainId, number>>;
};

export type RdaReadinessScore = {
  readinessScore: number;
  label: RdaReadinessLabel;
  confidenceTrend: number;
  capsApplied: string[];
  blockingReason: string | null;
  weakAreaPersistenceFlags: string[];
  remediationMessages: string[];
  domainReadiness: RdaDomainScore[];
  signals: {
    pretestScore: number | null;
    recentQuizScore: number | null;
    recentMockScore: number | null;
    bestMockScore: number | null;
    improvementStreak: number;
  };
};

const MOCK_PASSING_SCORE = 80;
const QUIZ_PASSING_SCORE = 75;
const CRITICAL_DOMAIN_CAP = 78;
const TEXAS_SCOPE_EXAM_READY_MIN = 70;
const CRITICAL_DOMAIN_MIN = 65;
const RECENT_WEIGHTS = [1, 0.82, 0.66, 0.52, 0.4, 0.32] as const;

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function clampRange(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function round(value: number) {
  return Math.round(value);
}

function percent(correctCount: number, totalQuestions: number) {
  if (!totalQuestions) return 0;
  return clamp((correctCount / totalQuestions) * 100);
}

function isCorrectAnswer(answer: RdaSelectedAnswer) {
  return (
    typeof answer.selectedAnswer === "string" &&
    answer.selectedAnswer.trim() === answer.correctAnswer.trim()
  );
}

function weightedRecentAverage(values: number[]) {
  if (!values.length) return null;
  const weights = RECENT_WEIGHTS.slice(0, values.length);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const total = values.reduce((sum, value, index) => sum + value * weights[index], 0);
  return round(total / totalWeight);
}

function getDomainScores(answers: RdaSelectedAnswer[]): RdaDomainScore[] {
  return RDA_DOMAINS.map((domain) => {
    const domainAnswers = answers.filter((answer) => answer.domainId === domain.id);
    const correctCount = domainAnswers.filter(isCorrectAnswer).length;
    const totalQuestions = domainAnswers.length;
    const score = percent(correctCount, totalQuestions);

    return {
      domainId: domain.id,
      domainName: domain.name,
      correctCount,
      totalQuestions,
      percent: score,
      weightedContribution: Number((score * domain.weight).toFixed(2)),
    };
  });
}

function getWeightedDomainScore(domainScores: RdaDomainScore[]) {
  const weightedTotal = domainScores.reduce(
    (sum, domain) => sum + domain.percent * rdaDomainById[domain.domainId].weight,
    0,
  );

  return clamp(weightedTotal);
}

function getWeakDomainScores(domainScores: RdaDomainScore[], threshold = 72) {
  return domainScores
    .filter((domain) => domain.totalQuestions > 0 && domain.percent < threshold)
    .sort((a, b) => a.percent - b.percent || b.weightedContribution - a.weightedContribution);
}

function getRepeatedMissFlags(answers: RdaSelectedAnswer[]) {
  const flags: string[] = [];

  for (const domain of RDA_DOMAINS) {
    const domainAnswers = answers.filter((answer) => answer.domainId === domain.id);
    const misses = domainAnswers.filter((answer) => !isCorrectAnswer(answer)).length;

    if (domainAnswers.length >= 3 && misses >= 3) {
      flags.push(`${domain.name}: repeated misses suggest this weak area is persisting.`);
    }
  }

  return flags;
}

function getAttemptRemediation(kind: RdaAttemptKind, weakAreas: RdaDomainScore[]) {
  if (!weakAreas.length) {
    return [`${kind === "mock" ? "Mock exam" : "Attempt"} shows no major weak domain under the mastery gate. Keep maintenance review active.`];
  }

  return weakAreas.slice(0, 3).map((domain) => {
    if (domain.domainId === "infection_control_safety") {
      return "Review infection control sequence: hand hygiene, PPE, cleaning before disinfection, sterilization integrity, and exposure reporting.";
    }

    if (domain.domainId === "dental_radiography") {
      return "Review radiography logic: ALARA, receptor placement, PID alignment, horizontal/vertical angulation, and justified retakes.";
    }

    if (domain.domainId === "texas_law_ethics_scope") {
      return "Review Texas scope awareness: do not diagnose, prescribe, or perform unfamiliar duties without training, delegation, and supervision.";
    }

    return `Review ${domain.domainName}: explain the safe first action, correct sequence, and why the tempting shortcut is unsafe.`;
  });
}

function scoreAttempt(args: {
  kind: RdaAttemptKind;
  answers: RdaSelectedAnswer[];
  passingScore: number;
}): RdaAttemptScore {
  const correctCount = args.answers.filter(isCorrectAnswer).length;
  const totalQuestions = args.answers.length;
  const domainScores = getDomainScores(args.answers);
  const score = getWeightedDomainScore(domainScores);
  const weakAreas = getWeakDomainScores(domainScores);
  const persistentWeakAreaFlags = getRepeatedMissFlags(args.answers);

  return {
    kind: args.kind,
    score,
    correctCount,
    totalQuestions,
    passed: score >= args.passingScore,
    domainScores,
    weakAreas,
    persistentWeakAreaFlags,
    remediationMessages: getAttemptRemediation(args.kind, weakAreas),
  };
}

export function scoreRdaPretest(answers: RdaSelectedAnswer[]) {
  return scoreAttempt({
    kind: "pretest",
    answers,
    passingScore: 999,
  });
}

export function scoreRdaQuiz(answers: RdaSelectedAnswer[]) {
  return scoreAttempt({
    kind: "quiz",
    answers,
    passingScore: QUIZ_PASSING_SCORE,
  });
}

export function scoreRdaMockExam(answers: RdaSelectedAnswer[]) {
  return scoreAttempt({
    kind: "mock",
    answers,
    passingScore: MOCK_PASSING_SCORE,
  });
}

function getImprovementStreak(attempts: RdaReadinessAttemptInput[]) {
  const recent = attempts.slice(0, 4);
  if (recent.length < 2) return 0;

  let streak = 0;
  for (let index = 0; index < recent.length - 1; index += 1) {
    if (recent[index].score > recent[index + 1].score) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

function combineDomainReadiness(args: RdaReadinessInput) {
  const pretestScores = args.pretest?.domainScores ?? [];
  const quizAttempts = args.quizAttempts ?? [];
  const mockAttempts = args.mockAttempts ?? [];

  return RDA_DOMAINS.map((domain) => {
    const pretest = pretestScores.find((score) => score.domainId === domain.id)?.percent ?? null;
    const quiz = weightedRecentAverage(
      quizAttempts
        .map((attempt) => attempt.domainScores?.find((score) => score.domainId === domain.id)?.percent)
        .filter((value): value is number => typeof value === "number"),
    );
    const mock = weightedRecentAverage(
      mockAttempts
        .map((attempt) => attempt.domainScores?.find((score) => score.domainId === domain.id)?.percent)
        .filter((value): value is number => typeof value === "number"),
    );
    const lesson = args.lessonMasteryByDomain?.[domain.id] ?? null;
    const signals = [
      pretest === null ? null : { value: pretest, weight: 0.18 },
      quiz === null ? null : { value: quiz, weight: 0.26 },
      mock === null ? null : { value: mock, weight: 0.42 },
      lesson === null ? null : { value: Math.min(lesson, 82), weight: 0.14 },
    ].filter((signal): signal is { value: number; weight: number } => Boolean(signal));
    const totalWeight = signals.reduce((sum, signal) => sum + signal.weight, 0);
    const combined = totalWeight
      ? signals.reduce((sum, signal) => sum + signal.value * signal.weight, 0) / totalWeight
      : 0;

    return {
      domainId: domain.id,
      domainName: domain.name,
      correctCount: 0,
      totalQuestions: 0,
      percent: clamp(combined),
      weightedContribution: Number((combined * domain.weight).toFixed(2)),
    };
  });
}

function getLabel(score: number, canBeExamReady: boolean): RdaReadinessLabel {
  if (score >= 85 && canBeExamReady) return "Exam Ready";
  if (score >= 75) return "Almost There";
  if (score >= 55) return "Making Progress";
  return "Not Ready";
}

function getCaps(args: {
  score: number;
  domainReadiness: RdaDomainScore[];
  mockAttempts: RdaReadinessAttemptInput[];
}) {
  const capsApplied: string[] = [];
  let cappedScore = args.score;
  let canBeExamReady = true;
  let blockingReason: string | null = null;
  const bestMockScore = args.mockAttempts.length
    ? Math.max(...args.mockAttempts.map((attempt) => attempt.score))
    : null;
  const infection = args.domainReadiness.find((domain) => domain.domainId === "infection_control_safety");
  const radiography = args.domainReadiness.find((domain) => domain.domainId === "dental_radiography");
  const texasScope = args.domainReadiness.find((domain) => domain.domainId === "texas_law_ethics_scope");

  if (!args.mockAttempts.length || (bestMockScore ?? 0) < MOCK_PASSING_SCORE) {
    canBeExamReady = false;
    capsApplied.push("Exam Ready is locked until at least one full mock exam is passed.");
    blockingReason ??= "You must pass at least one full mock exam to reach Exam Ready. Complete the mock exam to unlock the final readiness level.";
  }

  if ((infection?.percent ?? 100) < CRITICAL_DOMAIN_MIN) {
    cappedScore = Math.min(cappedScore, CRITICAL_DOMAIN_CAP);
    canBeExamReady = false;
    capsApplied.push("Readiness capped because infection control is critically weak.");
    blockingReason = `Your Infection Control & Safety score (${infection?.percent ?? 0}%) is critically low — this is capping your overall readiness. Complete the Infection Control module and retake the domain quiz to remove this block.`;
  }

  if ((radiography?.percent ?? 100) < CRITICAL_DOMAIN_MIN) {
    cappedScore = Math.min(cappedScore, CRITICAL_DOMAIN_CAP);
    canBeExamReady = false;
    capsApplied.push("Readiness capped because radiography safety/positioning is critically weak.");
    blockingReason ??= `Your Dental Radiography score (${radiography?.percent ?? 0}%) is critically low — this is capping your overall readiness. Complete the Radiography module and retake the domain quiz to remove this block.`;
  }

  if ((texasScope?.percent ?? 100) < TEXAS_SCOPE_EXAM_READY_MIN) {
    canBeExamReady = false;
    capsApplied.push("Exam Ready is locked until Texas law, ethics, and scope awareness reaches the mastery range.");
    blockingReason ??= `Your Texas Law, Ethics & Scope score (${texasScope?.percent ?? 0}%) is too low to reach Exam Ready — complete the Texas Law module and retake the domain quiz to unlock this level.`;
  }

  return {
    score: cappedScore,
    canBeExamReady,
    capsApplied,
    blockingReason,
  };
}

function getConfidenceTrend(args: {
  quizAttempts: RdaReadinessAttemptInput[];
  mockAttempts: RdaReadinessAttemptInput[];
}) {
  const quizStreak = getImprovementStreak(args.quizAttempts);
  const mockStreak = getImprovementStreak(args.mockAttempts);
  const trend = 45 + quizStreak * 9 + mockStreak * 12;
  return clamp(trend, 20, 95);
}

function getReadinessRemediation(args: {
  domainReadiness: RdaDomainScore[];
  capsApplied: string[];
  label: RdaReadinessLabel;
}) {
  const weakAreas = getWeakDomainScores(args.domainReadiness);
  const messages = [...args.capsApplied];

  if (weakAreas.length) {
    messages.push(...getAttemptRemediation("quiz", weakAreas));
  }

  if (args.label === "Almost There" && !args.capsApplied.length) {
    messages.push("Use a full mock exam or targeted weak-domain quiz to confirm readiness with stronger evidence.");
  }

  if (args.label === "Not Ready") {
    messages.push("Return to guided study before more mock exams; the next score should come from the weakest domain first.");
  }

  return [...new Set(messages)];
}

export function scoreRdaReadiness(input: RdaReadinessInput): RdaReadinessScore {
  const quizAttempts = input.quizAttempts ?? [];
  const mockAttempts = input.mockAttempts ?? [];
  const domainReadiness = combineDomainReadiness(input);
  const domainWeightedScore = getWeightedDomainScore(domainReadiness);
  const recentQuizScore = weightedRecentAverage(quizAttempts.map((attempt) => attempt.score));
  const recentMockScore = weightedRecentAverage(mockAttempts.map((attempt) => attempt.score));
  const bestMockScore = mockAttempts.length ? Math.max(...mockAttempts.map((attempt) => attempt.score)) : null;
  const pretestSignal = input.pretest?.score ?? null;
  const improvementStreak = Math.max(
    getImprovementStreak(quizAttempts),
    getImprovementStreak(mockAttempts),
  );
  const improvementBonus = Math.min(6, improvementStreak * 2);
  const rawScore = clamp(
    domainWeightedScore * 0.48 +
      (recentQuizScore ?? domainWeightedScore) * 0.2 +
      (recentMockScore ?? 0) * 0.24 +
      (pretestSignal ?? domainWeightedScore) * 0.08 +
      improvementBonus,
  );
  const cap = getCaps({
    score: rawScore,
    domainReadiness,
    mockAttempts,
  });
  const label = getLabel(cap.score, cap.canBeExamReady);
  const weakAreaPersistenceFlags = [
    ...(input.pretest?.persistentWeakAreaFlags ?? []),
    ...quizAttempts.flatMap((attempt) =>
      (attempt.domainScores ?? [])
        .filter((domain) => domain.totalQuestions >= 3 && domain.percent < 60)
        .map((domain) => `${domain.domainName}: repeated misses are persisting across recent quiz evidence.`),
    ),
    ...mockAttempts.flatMap((attempt) =>
      (attempt.domainScores ?? [])
        .filter((domain) => domain.percent < 65)
        .map((domain) => `${domain.domainName}: mock exam performance remains below readiness range.`),
    ),
  ];

  return {
    readinessScore: cap.score,
    label,
    confidenceTrend: getConfidenceTrend({ quizAttempts, mockAttempts }),
    capsApplied: cap.capsApplied,
    blockingReason: cap.blockingReason,
    weakAreaPersistenceFlags: [...new Set(weakAreaPersistenceFlags)],
    remediationMessages: getReadinessRemediation({
      domainReadiness,
      capsApplied: cap.capsApplied,
      label,
    }),
    domainReadiness,
    signals: {
      pretestScore: pretestSignal,
      recentQuizScore,
      recentMockScore,
      bestMockScore,
      improvementStreak,
    },
  };
}

function normalizeReadinessDomainId(domain: string) {
  if (domain === "radiography") return "dental_radiography";
  if (domain === "texas_law_ethics") return "texas_law_ethics_scope";
  return domain;
}

function getDomainScore(domainScores: DomainScoreMap, domain: string) {
  const canonical = normalizeReadinessDomainId(domain);
  return domainScores[canonical] ?? domainScores[domain] ?? 0;
}

function averageNumbers(numbers: number[]) {
  return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : 0;
}

export function calculateConfidenceTrend(trend: AttemptTrend[]): number {
  if (trend.length < 2) return 0;
  const recent = trend.slice(-3).map((attempt) => attempt.score);
  const first = recent[0];
  const last = recent[recent.length - 1];
  return clampRange(last - first, -20, 20);
}

export function getWeakAreas(domainScores: DomainScoreMap): string[] {
  return Object.entries(domainScores)
    .map(([domain, score]) => [normalizeReadinessDomainId(domain), score] as const)
    .filter(([, score]) => score < 75)
    .sort((a, b) => a[1] - b[1])
    .map(([domain]) => domain)
    .filter((domain, index, domains) => domains.indexOf(domain) === index)
    .slice(0, 3);
}

export function getStrengths(domainScores: DomainScoreMap): string[] {
  return Object.entries(domainScores)
    .map(([domain, score]) => [normalizeReadinessDomainId(domain), score] as const)
    .filter(([, score]) => score >= 85)
    .sort((a, b) => b[1] - a[1])
    .map(([domain]) => domain)
    .filter((domain, index, domains) => domains.indexOf(domain) === index)
    .slice(0, 3);
}

export function calculateRdaReadiness(input: ReadinessInput): ReadinessResult {
  const pretest = input.pretestScore ?? 0;
  const lessons = input.lessonMasteryAverage ?? 0;
  const quizzes = input.quizAverage ?? 0;
  const mocks = input.mockAverage ?? 0;

  let score = pretest * 0.2 + lessons * 0.15 + quizzes * 0.25 + mocks * 0.4;
  const infection = getDomainScore(input.domainScores, "infection_control_safety");
  const radiography = getDomainScore(input.domainScores, "dental_radiography");
  const law = getDomainScore(input.domainScores, "texas_law_ethics_scope");
  const recoverySignals: string[] = [];
  const checklist: string[] = [];

  if (input.mockAttempts === 0) {
    score = Math.min(score, 84);
    checklist.push("Complete at least one full mock exam.");
  }

  if (infection < 65 || radiography < 65) {
    score = Math.min(score, 72);
    recoverySignals.push(
      "Critical safety domain weakness detected in infection control or radiography.",
    );
    checklist.push("Rebuild safety foundation before advancing readiness.");
  }

  if (law < 65) {
    score = Math.min(score, 84);
    recoverySignals.push(
      "Texas law and scope awareness is too weak for Exam Ready status.",
    );
    checklist.push("Review jurisprudence and scope-awareness lessons.");
  }

  const confidenceTrend = calculateConfidenceTrend(input.recentMockTrend);
  if (confidenceTrend > 0) {
    recoverySignals.push("Recent performance trend is improving.");
  }

  const roundedScore = clamp(Math.round(score));
  let label: ReadinessLabel = "Not Ready";
  if (roundedScore >= 85) label = "Exam Ready";
  else if (roundedScore >= 75) label = "Almost There";
  else if (roundedScore >= 60) label = "Making Progress";

  if (input.mockAttempts === 0 && label === "Exam Ready") {
    label = "Almost There";
  }

  if (law < 65 && label === "Exam Ready") {
    label = "Almost There";
  }

  const weakAreas = getWeakAreas(input.domainScores);
  const strengths = getStrengths(input.domainScores);
  let nextBestAction = "Continue your guided study plan.";

  if (weakAreas.includes("infection_control_safety")) {
    nextBestAction = "Complete the infection control remediation lesson and retake the quiz.";
  } else if (weakAreas.includes("dental_radiography")) {
    nextBestAction = "Complete a radiography lesson sequence and then take a focused quiz.";
  } else if (input.mockAttempts === 0) {
    nextBestAction = "Take your first full mock exam to validate readiness.";
  } else if (weakAreas.includes("texas_law_ethics_scope")) {
    nextBestAction = "Review Texas law and scope-awareness before your next mock exam.";
  }

  if (!checklist.length) {
    const weakAverage = averageNumbers(weakAreas.map((domain) => getDomainScore(input.domainScores, domain)));
    if (weakAreas.length && weakAverage < 75) {
      checklist.push("Complete one focused quiz in your weakest domain.");
    } else {
      checklist.push("Maintain readiness with mixed review and mock-exam practice.");
    }
  }

  return {
    score: roundedScore,
    label,
    weakAreas,
    strengths,
    nextBestAction,
    checklist,
    recoverySignals,
    confidenceTrend,
  };
}

export function evaluateRdaShortAnswer(input: TutorEvaluationInput): TutorEvaluationResult {
  return evaluateTutorAnswer(input);
}

export function evaluateRdaLessonShortAnswer(args: {
  answer: string;
  expectedTraits: string[];
  safetyCritical?: boolean;
}): ShortAnswerEvaluation {
  return evaluateShortAnswer(args);
}
