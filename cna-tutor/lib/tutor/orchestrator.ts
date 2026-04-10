import { buildTutorSystemPrompt } from "@/lib/tutor/prompts";
import { getTutorLesson, resolveLessonMode } from "@/lib/tutor/lessons";
import { DEFAULT_TUTOR_MODEL, getOpenAIClient } from "@/lib/tutor/openai";
import type {
  LessonSegment,
  TutorEvaluation,
  TutorDifficultyTier,
  TutorLesson,
  TutorMessageContext,
  TutorMode,
  TutorSessionState,
} from "@/lib/tutor/types";

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function getCurrentSegment(lesson: TutorLesson, state: TutorSessionState) {
  return lesson.segments[Math.min(state.currentSegmentIndex, lesson.segments.length - 1)];
}

function calculateMastery(correctCount: number, totalQuestions: number) {
  if (totalQuestions === 0) {
    return 0;
  }

  return Math.round((correctCount / totalQuestions) * 100);
}

function determineDifficultyTier(args: {
  mode: TutorMode;
  correctCount: number;
  attemptsOnCurrentQuestion: number;
}): TutorDifficultyTier {
  if (args.mode === "rapid_review") {
    return "challenge";
  }

  if (args.mode === "quiz") {
    return args.attemptsOnCurrentQuestion > 0 ? "foundation" : "standard";
  }

  if (args.attemptsOnCurrentQuestion >= 2) {
    return "foundation";
  }

  if (args.correctCount >= 2) {
    return "challenge";
  }

  return "standard";
}

function getModeIntro(mode: TutorMode) {
  if (mode === "quiz") {
    return "We are in quiz mode, so I will keep teaching brief and check your answer more directly.";
  }

  if (mode === "rapid_review") {
    return "We are in rapid review mode, so I will move quickly and focus on high-yield reminders.";
  }

  if (mode === "weak_area_review") {
    return "We are in weak-area review mode, so I will revisit key points until the reasoning feels solid.";
  }

  return "We are in learn mode, so I will teach step by step and check your understanding as we go.";
}

export function createInitialTutorSessionState(
  lessonId: string,
  modeOverride?: TutorMode,
  weakAreasSnapshot: string[] = [],
): TutorSessionState {
  const lesson = getTutorLesson(lessonId);

  if (!lesson) {
    throw new Error(`Unknown lesson id: ${lessonId}`);
  }

  const mode = resolveLessonMode(lesson, modeOverride);

  return {
    lessonId: lesson.id,
    mode,
    currentSegmentIndex: 0,
    step: "intro",
    attemptsOnCurrentQuestion: 0,
    remediationLevel: 0,
    difficultyTier: determineDifficultyTier({
      mode,
      correctCount: 0,
      attemptsOnCurrentQuestion: 0,
    }),
    correctCount: 0,
    totalQuestions: lesson.segments.length,
    masteryScore: 0,
    lastStudentMessage: null,
    lastMatchedConcepts: [],
    weakAreasSnapshot,
    sessionComplete: false,
  };
}

export function parseTutorSessionState(
  input: unknown,
  lessonId?: string,
  modeOverride?: TutorMode,
) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    if (!lessonId) {
      return null;
    }

    return createInitialTutorSessionState(lessonId, modeOverride);
  }

  const raw = input as Partial<TutorSessionState>;

  if (!raw.lessonId || !raw.mode) {
    if (!lessonId) {
      return null;
    }

    return createInitialTutorSessionState(lessonId, modeOverride);
  }

  return {
    lessonId: raw.lessonId,
    mode: modeOverride ?? raw.mode,
    currentSegmentIndex: raw.currentSegmentIndex ?? 0,
    step: raw.step ?? "intro",
    attemptsOnCurrentQuestion: raw.attemptsOnCurrentQuestion ?? 0,
    remediationLevel: raw.remediationLevel ?? 0,
    difficultyTier:
      raw.difficultyTier ??
      determineDifficultyTier({
        mode: modeOverride ?? raw.mode,
        correctCount: raw.correctCount ?? 0,
        attemptsOnCurrentQuestion: raw.attemptsOnCurrentQuestion ?? 0,
      }),
    correctCount: raw.correctCount ?? 0,
    totalQuestions: raw.totalQuestions ?? 0,
    masteryScore: raw.masteryScore ?? 0,
    lastStudentMessage: raw.lastStudentMessage ?? null,
    lastMatchedConcepts: raw.lastMatchedConcepts ?? [],
    weakAreasSnapshot: raw.weakAreasSnapshot ?? [],
    sessionComplete: raw.sessionComplete ?? false,
  } satisfies TutorSessionState;
}

export function evaluateStudentAnswer(
  segment: LessonSegment,
  studentMessage: string,
): TutorEvaluation {
  const normalized = normalizeText(studentMessage);

  const matchedConcepts = segment.acceptableConcepts
    .filter((concept) =>
      concept.keywords.some((keyword) => normalized.includes(normalizeText(keyword))),
    )
    .map((concept) => concept.label);

  const missedConcepts = segment.acceptableConcepts
    .map((concept) => concept.label)
    .filter((label) => !matchedConcepts.includes(label));

  const correct = matchedConcepts.length >= segment.passThreshold;
  const score = Math.min(
    100,
    Math.round((matchedConcepts.length / segment.acceptableConcepts.length) * 100),
  );

  return {
    correct,
    matchedConcepts,
    missedConcepts,
    score,
    idealAnswer: segment.idealAnswer,
    correctExplanation: segment.correctExplanation,
    incorrectExplanation: segment.incorrectExplanation,
    memoryTip: segment.memoryTip,
  };
}

export function advanceTutorSessionState(
  lesson: TutorLesson,
  state: TutorSessionState,
  studentMessage: string,
  evaluation: TutorEvaluation,
) {
  const baseState: TutorSessionState = {
    ...state,
    lastStudentMessage: studentMessage,
    lastMatchedConcepts: evaluation.matchedConcepts,
  };

  if (evaluation.correct) {
    const correctCount = state.correctCount + 1;
    const nextSegmentIndex = state.currentSegmentIndex + 1;
    const sessionComplete = nextSegmentIndex >= lesson.segments.length;
    const attemptsOnCurrentQuestion = 0;

    return {
      nextState: {
        ...baseState,
        currentSegmentIndex: sessionComplete ? state.currentSegmentIndex : nextSegmentIndex,
        step: sessionComplete ? "wrap" : "advance",
        attemptsOnCurrentQuestion,
        remediationLevel: 0,
        difficultyTier: determineDifficultyTier({
          mode: state.mode,
          correctCount,
          attemptsOnCurrentQuestion,
        }),
        correctCount,
        masteryScore: calculateMastery(correctCount, state.totalQuestions),
        sessionComplete,
      } satisfies TutorSessionState,
      action: sessionComplete ? "wrap" : "advance",
    } as const;
  }

  return {
    nextState: {
      ...baseState,
      step: "remediate",
      attemptsOnCurrentQuestion: state.attemptsOnCurrentQuestion + 1,
      remediationLevel: state.remediationLevel + 1,
      difficultyTier: determineDifficultyTier({
        mode: state.mode,
        correctCount: state.correctCount,
        attemptsOnCurrentQuestion: state.attemptsOnCurrentQuestion + 1,
      }),
      masteryScore: calculateMastery(state.correctCount, state.totalQuestions),
      sessionComplete: false,
    } satisfies TutorSessionState,
    action: "retry",
  } as const;
}

function renderFallbackMessage(context: TutorMessageContext) {
  const modePrefix = getModeIntro(context.state.mode);

  if (context.action === "intro") {
    if (context.state.mode === "quiz") {
      return [
        `Today we're checking ${context.lesson.title}.`,
        modePrefix,
        `Quick reminder: ${context.segment.concept}`,
        context.segment.question,
      ].join("\n\n");
    }

    return [
      `Today we're working on ${context.lesson.title}.`,
      modePrefix,
      context.segment.concept,
      `Example: ${context.segment.example}`,
      context.segment.question,
    ].join("\n\n");
  }

  if (context.action === "advance") {
    const nextSegment = context.segment;

    return [
      context.evaluation?.correctExplanation ?? "That's right.",
      context.state.mode === "quiz"
        ? `Let's check the next question in ${nextSegment.title}.`
        : `Let's move to the next idea: ${nextSegment.title}.`,
      context.state.mode === "quiz" ? `Focus point: ${nextSegment.concept}` : nextSegment.concept,
      context.state.mode === "rapid_review" ? null : `Example: ${nextSegment.example}`,
      nextSegment.question,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (context.action === "retry") {
    return [
      context.evaluation?.incorrectExplanation ??
        "Not quite. Let's tighten up the reasoning together.",
      context.state.remediationLevel > 1
        ? `Let's slow this down. The missing idea is: ${context.evaluation?.idealAnswer}`
        : null,
      `Memory tip: ${context.evaluation?.memoryTip ?? context.segment.memoryTip}`,
      `Try this again: ${context.segment.question}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  return [
    context.evaluation?.correctExplanation ?? "Nice work.",
    context.lesson.completionMessage,
    `Big takeaway: ${context.segment.idealAnswer}`,
  ].join("\n\n");
}

async function generateModelMessage(context: TutorMessageContext) {
  const client = getOpenAIClient();

  if (!client) {
    return null;
  }

  const prompt = [
    `Lesson title: ${context.lesson.title}`,
    `Lesson goal: ${context.lesson.learningGoal}`,
    `Current segment: ${context.segment.title}`,
    `Current segment concept: ${context.segment.concept}`,
    `Current segment example: ${context.segment.example}`,
    `Current segment checkpoint question: ${context.segment.question}`,
    `Action: ${context.action}`,
    `Tutoring mode: ${context.state.mode}`,
    `Difficulty tier: ${context.state.difficultyTier}`,
    `Remediation level: ${context.state.remediationLevel}`,
    `Session step: ${context.state.step}`,
    context.state.weakAreasSnapshot.length
      ? `Weak areas snapshot: ${context.state.weakAreasSnapshot.join(", ")}`
      : null,
    context.studentMessage ? `Student answer: ${context.studentMessage}` : null,
    context.evaluation
      ? `Evaluation summary: correct=${context.evaluation.correct}; matched=${context.evaluation.matchedConcepts.join(
          ", ",
        )}; missed=${context.evaluation.missedConcepts.join(", ")}`
      : null,
    context.evaluation ? `Ideal answer: ${context.evaluation.idealAnswer}` : null,
    context.evaluation
      ? `Use this memory tip if needed: ${context.evaluation.memoryTip}`
      : `Ask the checkpoint question at the end.`,
    context.state.mode === "quiz"
      ? `Mode rules: keep teaching minimal, ask the checkpoint quickly, and frame feedback like an exam coach.`
      : null,
    context.state.mode === "rapid_review"
      ? `Mode rules: keep it brisk, high-yield, and exam-focused.`
      : null,
    context.state.mode === "weak_area_review"
      ? `Mode rules: reinforce the weak idea with patient, repetitive coaching and a simple memory anchor.`
      : null,
    context.action === "wrap"
      ? `Output rules: keep it under 140 words, sound like a supportive CNA instructor, recap the lesson, celebrate progress, and do not end with a question.`
      : `Output rules: keep it under 140 words, sound like a supportive CNA instructor, and end with exactly one clear question.`,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await client.responses.create({
    model: DEFAULT_TUTOR_MODEL,
    instructions: buildTutorSystemPrompt({
      mode: context.state.mode,
      topic: context.lesson.title,
      weakAreas: [],
    }),
    input: prompt,
    store: false,
    max_output_tokens: 220,
  });

  return response.output_text.trim();
}

export async function generateTutorMessage(context: TutorMessageContext) {
  try {
    const modelMessage = await generateModelMessage(context);

    if (modelMessage) {
      return modelMessage;
    }
  } catch {
    // Fall through to deterministic messaging so the study flow still works.
  }

  return renderFallbackMessage(context);
}

export async function buildInitialTutorTurn(lessonId: string) {
  const lesson = getTutorLesson(lessonId);

  if (!lesson) {
    throw new Error(`Unknown lesson id: ${lessonId}`);
  }

  const state = createInitialTutorSessionState(lessonId);
  const segment = getCurrentSegment(lesson, state);
  const message = await generateTutorMessage({
    action: "intro",
    lesson,
    segment,
    state,
    evaluation: null,
    studentMessage: null,
  });

  return {
    lesson,
    state: {
      ...state,
      step: "teach",
    } satisfies TutorSessionState,
    message,
  };
}

export async function buildInitialTutorTurnForMode(args: {
  lessonId: string;
  mode?: TutorMode;
  weakAreasSnapshot?: string[];
}) {
  const lesson = getTutorLesson(args.lessonId);

  if (!lesson) {
    throw new Error(`Unknown lesson id: ${args.lessonId}`);
  }

  const state = createInitialTutorSessionState(
    args.lessonId,
    args.mode,
    args.weakAreasSnapshot ?? [],
  );
  const segment = getCurrentSegment(lesson, state);
  const message = await generateTutorMessage({
    action: "intro",
    lesson,
    segment,
    state,
    evaluation: null,
    studentMessage: null,
  });

  return {
    lesson,
    state: {
      ...state,
      step: "teach",
    } satisfies TutorSessionState,
    message,
  };
}

export async function processTutorReply(args: {
  lessonId: string;
  state: TutorSessionState;
  studentMessage: string;
}) {
  const lesson = getTutorLesson(args.lessonId);

  if (!lesson) {
    throw new Error(`Unknown lesson id: ${args.lessonId}`);
  }

  const currentSegment = getCurrentSegment(lesson, args.state);
  const evaluation = evaluateStudentAnswer(currentSegment, args.studentMessage);
  const transition = advanceTutorSessionState(
    lesson,
    args.state,
    args.studentMessage,
    evaluation,
  );

  const messageSegment =
    transition.action === "advance" && !transition.nextState.sessionComplete
      ? getCurrentSegment(lesson, transition.nextState)
      : currentSegment;

  const message = await generateTutorMessage({
    action: transition.action,
    lesson,
    segment: messageSegment,
    state: transition.nextState,
    evaluation,
    studentMessage: args.studentMessage,
  });

  return {
    lesson,
    evaluation,
    nextState:
      transition.action === "wrap"
        ? {
            ...transition.nextState,
            step: "completed",
          }
        : transition.nextState,
    message,
  };
}
