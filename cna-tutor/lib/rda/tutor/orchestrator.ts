import { getRdaTutorLesson, resolveRdaLessonMode } from "@/lib/rda/tutor/lessons";
import { evaluateTutorAnswer } from "@/lib/rda/tutor/evaluation";
import { createRdaAdminClient } from "@/lib/rda/supabase";
import type {
  LessonSegment,
  SupportedLanguage,
  TutorDifficultyTier,
  TutorEvaluation,
  TutorLesson,
  TutorMessageContext,
  TutorMode,
  TutorSessionState,
} from "@/lib/rda/tutor/types";

const unsafeContradictions = [
  "ignore",
  "do nothing",
  "skip",
  "guess",
  "diagnose",
  "prescribe",
  "reuse",
  "dont report",
  "do not report",
  "never report",
  "finish first",
  "outside scope",
];

function getCurrentSegment(lesson: TutorLesson, state: TutorSessionState) {
  return lesson.segments[Math.min(state.currentSegmentIndex, lesson.segments.length - 1)];
}

function calculateMastery(correctCount: number, totalQuestions: number) {
  if (!totalQuestions) return 0;
  return Math.round((correctCount / totalQuestions) * 100);
}

function determineDifficultyTier(args: {
  mode: TutorMode;
  correctCount: number;
  attemptsOnCurrentQuestion: number;
}): TutorDifficultyTier {
  if (args.mode === "rapid_review") return "challenge";
  if (args.attemptsOnCurrentQuestion >= 2) return "foundation";
  if (args.correctCount >= 5) return "challenge";
  return "standard";
}

function getSegmentRequiredConcepts(segment: LessonSegment) {
  return segment.acceptableConcepts.map((concept) => concept.label);
}

function getSegmentOptionalConcepts(segment: LessonSegment) {
  return segment.acceptableConcepts.flatMap((concept) => concept.keywords);
}

function getSegmentSafetyConcepts(segment: LessonSegment) {
  return [
    "safety",
    "patient",
    "report",
    "scope",
    ...segment.acceptableConcepts
      .filter((concept) => /safe|scope|patient|report|infection|steril|ppe/i.test(concept.label))
      .flatMap((concept) => concept.keywords),
  ];
}

function getSegmentReasoningSignals(segment: LessonSegment) {
  const baseSignals = ["because", "so that", "to prevent", "before", "after", "first", "then"];
  if (segment.questionType === "workflow_reasoning") {
    return [...baseSignals, "order", "sequence", "workflow"];
  }
  if (segment.questionType === "safety_reasoning" || segment.questionType === "scenario") {
    return [...baseSignals, "risk", "protect", "unsafe"];
  }
  return baseSignals;
}

function getSegmentTerminologySignals(segment: LessonSegment) {
  return [
    segment.title,
    segment.questionType,
    ...segment.acceptableConcepts.flatMap((concept) => concept.keywords),
  ];
}

export function createInitialRdaTutorSessionState(
  lessonId: string,
  modeOverride?: TutorMode,
  weakAreasSnapshot: string[] = [],
  preferredLanguage: SupportedLanguage = "en",
): TutorSessionState {
  const lesson = getRdaTutorLesson(lessonId);
  if (!lesson) throw new Error(`Unknown RDA lesson id: ${lessonId}`);
  const mode = resolveRdaLessonMode(lesson, modeOverride);

  return {
    lessonId: lesson.id,
    mode,
    preferredLanguage,
    currentSegmentIndex: 0,
    step: "intro",
    attemptsOnCurrentQuestion: 0,
    remediationLevel: 0,
    difficultyTier: determineDifficultyTier({ mode, correctCount: 0, attemptsOnCurrentQuestion: 0 }),
    correctCount: 0,
    totalQuestions: lesson.segments.length,
    masteryScore: 0,
    lastStudentMessage: null,
    lastMatchedConcepts: [],
    weakAreasSnapshot,
    sessionComplete: false,
  };
}

export function parseRdaTutorSessionState(input: unknown, lessonId?: string, modeOverride?: TutorMode) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return lessonId ? createInitialRdaTutorSessionState(lessonId, modeOverride) : null;
  }

  const raw = input as Partial<TutorSessionState>;
  if (!raw.lessonId || !raw.mode) {
    return lessonId ? createInitialRdaTutorSessionState(lessonId, modeOverride) : null;
  }

  return {
    lessonId: raw.lessonId,
    mode: modeOverride ?? raw.mode,
    preferredLanguage: raw.preferredLanguage ?? "en",
    currentSegmentIndex: raw.currentSegmentIndex ?? 0,
    step: raw.step ?? "intro",
    attemptsOnCurrentQuestion: raw.attemptsOnCurrentQuestion ?? 0,
    remediationLevel: raw.remediationLevel ?? 0,
    difficultyTier: raw.difficultyTier ?? "standard",
    correctCount: raw.correctCount ?? 0,
    totalQuestions: raw.totalQuestions ?? 10,
    masteryScore: raw.masteryScore ?? 0,
    lastStudentMessage: raw.lastStudentMessage ?? null,
    lastMatchedConcepts: raw.lastMatchedConcepts ?? [],
    weakAreasSnapshot: raw.weakAreasSnapshot ?? [],
    sessionComplete: raw.sessionComplete ?? false,
  } satisfies TutorSessionState;
}

export function evaluateRdaStudentAnswer(segment: LessonSegment, studentMessage: string): TutorEvaluation {
  const rubric = evaluateTutorAnswer({
    answer: studentMessage,
    requiredConcepts: getSegmentRequiredConcepts(segment),
    optionalConcepts: getSegmentOptionalConcepts(segment),
    forbiddenConcepts: unsafeContradictions,
    safetyConcepts: getSegmentSafetyConcepts(segment),
    reasoningSignals: getSegmentReasoningSignals(segment),
    terminologySignals: getSegmentTerminologySignals(segment),
  });
  const matchedConcepts = getSegmentRequiredConcepts(segment).filter(
    (concept) => !rubric.missingConcepts.includes(concept),
  );

  return {
    correct: rubric.passed,
    matchedConcepts,
    missedConcepts: [
      ...rubric.missingConcepts,
      ...rubric.unsafeFlags.map((flag) => `unsafe or not-allowed idea: ${flag}`),
      rubric.band === "near_mastery" ? "mastery-level completeness and reasoning" : null,
      rubric.band === "partial" ? "reliable patient-care reasoning" : null,
    ].filter((item): item is string => Boolean(item)),
    score: Math.round(rubric.score * 100),
    idealAnswer: segment.idealAnswer,
    correctExplanation: segment.correctExplanation,
    incorrectExplanation: `${segment.incorrectExplanation} ${rubric.feedback}`,
    memoryTip: segment.memoryTip,
  };
}

export function advanceRdaTutorSessionState(
  lesson: TutorLesson,
  state: TutorSessionState,
  studentMessage: string,
  evaluation: TutorEvaluation,
) {
  const baseState = {
    ...state,
    lastStudentMessage: studentMessage,
    lastMatchedConcepts: evaluation.matchedConcepts,
  };

  if (!evaluation.correct) {
    const attemptsOnCurrentQuestion = state.attemptsOnCurrentQuestion + 1;
    return {
      action: "retry" as const,
      nextState: {
        ...baseState,
        step: "remediate",
        attemptsOnCurrentQuestion,
        remediationLevel: state.remediationLevel + 1,
        difficultyTier: determineDifficultyTier({
          mode: state.mode,
          correctCount: state.correctCount,
          attemptsOnCurrentQuestion,
        }),
        masteryScore: calculateMastery(state.correctCount, state.totalQuestions),
        sessionComplete: false,
      } satisfies TutorSessionState,
    };
  }

  const correctCount = state.correctCount + 1;
  const nextSegmentIndex = state.currentSegmentIndex + 1;
  const sessionComplete = nextSegmentIndex >= lesson.segments.length;

  return {
    action: sessionComplete ? "wrap" as const : "advance" as const,
    nextState: {
      ...baseState,
      currentSegmentIndex: sessionComplete ? state.currentSegmentIndex : nextSegmentIndex,
      step: sessionComplete ? "wrap" : "advance",
      attemptsOnCurrentQuestion: 0,
      remediationLevel: 0,
      difficultyTier: determineDifficultyTier({ mode: state.mode, correctCount, attemptsOnCurrentQuestion: 0 }),
      correctCount,
      masteryScore: calculateMastery(correctCount, state.totalQuestions),
      sessionComplete,
    } satisfies TutorSessionState,
  };
}

function renderRdaTutorMessage(context: TutorMessageContext) {
  if (context.action === "intro") {
    return [
      `Today we are working on ${context.lesson.title}.`,
      "RDA Tutor uses a 10-step mastery path. For reasoning items, answer in short-answer form first: action plus why.",
      context.segment.concept,
      `Example: ${context.segment.example}`,
      context.segment.question,
    ].join("\n\n");
  }

  if (context.action === "retry") {
    return [
      context.evaluation?.incorrectExplanation ?? "Not yet.",
      context.evaluation?.missedConcepts.length
        ? `What was missing: ${context.evaluation.missedConcepts.join(", ")}.`
        : null,
      "Do not advance on a keyword-only answer. Name the RDA action and the patient-safety, workflow, or Texas-scope reason.",
      `Memory tip: ${context.evaluation?.memoryTip ?? context.segment.memoryTip}`,
      context.segment.question,
    ].filter(Boolean).join("\n\n");
  }

  if (context.action === "advance") {
    return [
      context.evaluation?.correctExplanation ?? "Correct.",
      `Next step: ${context.segment.title}.`,
      context.segment.concept,
      `Example: ${context.segment.example}`,
      context.segment.question,
    ].join("\n\n");
  }

  return [
    context.evaluation?.correctExplanation ?? "Strong finish.",
    context.lesson.completionMessage,
    "You demonstrated mastery because you gave both the clinical action and the safety or scope reason.",
  ].join("\n\n");
}

export async function generateRdaTutorMessage(context: TutorMessageContext) {
  return renderRdaTutorMessage(context);
}

export async function buildInitialRdaTutorTurn(lessonId: string) {
  const lesson = getRdaTutorLesson(lessonId);
  if (!lesson) throw new Error(`Unknown RDA lesson id: ${lessonId}`);
  const state = createInitialRdaTutorSessionState(lessonId);
  const segment = getCurrentSegment(lesson, state);
  const message = await generateRdaTutorMessage({
    action: "intro",
    lesson,
    segment,
    state,
    evaluation: null,
    studentMessage: null,
  });

  return { lesson, state: { ...state, step: "teach" } satisfies TutorSessionState, message };
}

async function maybeWriteRiskFlag(args: {
  userId: string | undefined;
  lesson: TutorLesson;
  segment: LessonSegment;
  nextState: TutorSessionState;
}) {
  if (!args.userId) return;
  const isCriticalSegment =
    args.segment.questionType === "remediation" ||
    args.segment.questionType === "mastery_checkpoint";
  if (!isCriticalSegment) return;
  if (args.nextState.attemptsOnCurrentQuestion !== 2) return;

  const note =
    `[Auto-flag] Student failed "${args.segment.title}" (${args.segment.questionType}) ` +
    `in lesson "${args.lesson.title}" — domain: ${args.lesson.domainTitle}. ` +
    `Attempts on this question: ${args.nextState.attemptsOnCurrentQuestion}. ` +
    `Current lesson mastery: ${args.nextState.masteryScore}%.`;

  // Use admin client so this insert bypasses RLS; admin_user_id is the student's own
  // profile since automated flags have no human author.
  const admin = createRdaAdminClient();
  await admin.from("rda_admin_notes").insert({
    user_id: args.userId,
    admin_user_id: args.userId,
    note,
    note_type: "risk",
  });
}

export async function buildRdaTutorResponse(args: {
  state: TutorSessionState;
  studentMessage: string;
  userId?: string;
}) {
  const lesson = getRdaTutorLesson(args.state.lessonId);
  if (!lesson) throw new Error(`Unknown RDA lesson id: ${args.state.lessonId}`);
  const segment = getCurrentSegment(lesson, args.state);
  const evaluation = evaluateRdaStudentAnswer(segment, args.studentMessage);
  const { nextState, action } = advanceRdaTutorSessionState(lesson, args.state, args.studentMessage, evaluation);
  const nextSegment = getCurrentSegment(lesson, nextState);
  const message = await generateRdaTutorMessage({
    action,
    lesson,
    segment: action === "advance" ? nextSegment : segment,
    state: nextState,
    evaluation,
    studentMessage: args.studentMessage,
  });

  if (action === "retry") {
    await maybeWriteRiskFlag({ userId: args.userId, lesson, segment, nextState });
  }

  return { lesson, state: nextState, evaluation, message };
}
