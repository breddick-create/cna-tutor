import type { SupportedLanguage } from "@/lib/ccma/i18n/languages";
import { buildTutorSystemPrompt } from "@/lib/ccma/tutor/prompts";
import { getTutorLesson, resolveLessonMode } from "@/lib/ccma/tutor/lessons";
import { DEFAULT_TUTOR_MODEL, getOpenAIClient } from "@/lib/ccma/tutor/openai";
import type {
  LessonSegment,
  TutorEvaluation,
  TutorDifficultyTier,
  TutorLesson,
  TutorMessageContext,
  TutorMode,
  TutorSessionState,
} from "@/lib/ccma/tutor/types";

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function getWords(value: string) {
  return normalizeText(value)
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);
}

const unsafeContradictionPhrases = [
  "do nothing",
  "ignore",
  "wait until later",
  "skip hand hygiene",
  "dont report",
  "do not report",
  "never report",
  "share private",
  "tell the family",
  "reuse needle",
  "skip documentation",
  "give medication without checking",
  "diagnose",
  "prescribe",
];

function includesNormalizedPhrase(value: string, phrase: string) {
  return normalizeText(value).includes(normalizeText(phrase));
}

function keywordMatches(normalizedStudentMessage: string, keyword: string) {
  const normalizedKeyword = normalizeText(keyword).trim();

  if (!normalizedKeyword) {
    return false;
  }

  const studentWords = new Set(getWords(normalizedStudentMessage));
  const keywordWords = getWords(normalizedKeyword);

  if (keywordWords.length <= 1) {
    return studentWords.has(normalizedKeyword);
  }

  return normalizedStudentMessage
    .split(/\s+/)
    .join(" ")
    .includes(keywordWords.join(" "));
}

function conceptMatchesStudentAnswer(
  normalizedStudentMessage: string,
  concept: LessonSegment["acceptableConcepts"][number],
) {
  const normalizedKeywords = concept.keywords
    .map((keyword) => normalizeText(keyword).trim())
    .filter(Boolean);
  const phraseMatched = normalizedKeywords.some(
    (keyword) => keyword.includes(" ") && keywordMatches(normalizedStudentMessage, keyword),
  );

  if (phraseMatched) {
    return true;
  }

  const tokenHits = normalizedKeywords.filter(
    (keyword) => !keyword.includes(" ") && keywordMatches(normalizedStudentMessage, keyword),
  ).length;
  const requiredTokenHits = normalizedKeywords.length <= 1 ? 1 : 2;

  return tokenHits >= requiredTokenHits;
}

function hasUnsafeContradiction(segment: LessonSegment, studentMessage: string) {
  const combinedSegmentText = normalizeText(
    [
      segment.concept,
      segment.example,
      segment.question,
      segment.idealAnswer,
      segment.correctExplanation,
      segment.incorrectExplanation,
    ].join(" "),
  );
  const safetyOrScopeQuestion =
    /\b(report|notify|provider|physician|nurse|emergency|infection|hand hygiene|glove|ppe|standard precaution|hipaa|privacy|medication|six rights|specimen|ecg|ekg|clia|scope)\b/.test(
      combinedSegmentText,
    );

  if (!safetyOrScopeQuestion) {
    return false;
  }

  return unsafeContradictionPhrases.some((phrase) =>
    includesNormalizedPhrase(studentMessage, phrase),
  );
}

function isTooVagueForMastery(
  segment: LessonSegment,
  studentMessage: string,
  matchedConcepts: string[],
) {
  const words = getWords(studentMessage);

  if (matchedConcepts.length < segment.passThreshold) {
    return false;
  }

  if (segment.passThreshold > 1 && words.length <= 2) {
    return true;
  }

  if (segment.questionType === "scenario" && words.length < 5) {
    return true;
  }

  if (segment.questionType === "critical_thinking" && words.length < 6) {
    return true;
  }

  return false;
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
    return "We're doing a quick guided check today — I'll keep the teaching brief and get right to the question.";
  }

  if (mode === "rapid_review") {
    return "We're moving fast today — short reminders, high-yield points, and quick questions to keep your recall sharp.";
  }

  if (mode === "weak_area_review") {
    return "We're going to slow down and really nail this one — I'll keep coming back to it until it clicks.";
  }

  return "We'll work through this together step by step — I'll teach one idea, check that it landed, then we'll move on.";
}

export function createInitialTutorSessionState(
  lessonId: string,
  modeOverride?: TutorMode,
  weakAreasSnapshot: string[] = [],
  preferredLanguage: SupportedLanguage = "en",
): TutorSessionState {
  const lesson = getTutorLesson(lessonId);

  if (!lesson) {
    throw new Error(`Unknown lesson id: ${lessonId}`);
  }

  const mode = resolveLessonMode(lesson, modeOverride);

  return {
    lessonId: lesson.id,
    mode,
    preferredLanguage,
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

    return createInitialTutorSessionState(lessonId, modeOverride, [], "en");
  }

  const raw = input as Partial<TutorSessionState>;

  if (!raw.lessonId || !raw.mode) {
    if (!lessonId) {
      return null;
    }

    return createInitialTutorSessionState(lessonId, modeOverride, [], "en");
  }

  return {
    lessonId: raw.lessonId,
    mode: modeOverride ?? raw.mode,
    preferredLanguage: raw.preferredLanguage ?? "en",
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
    .filter((concept) => conceptMatchesStudentAnswer(normalized, concept))
    .map((concept) => concept.label);

  const missedConcepts = segment.acceptableConcepts
    .map((concept) => concept.label)
    .filter((label) => !matchedConcepts.includes(label));

  const hasRequiredConcepts = matchedConcepts.length >= segment.passThreshold;
  const unsafeContradiction = hasUnsafeContradiction(segment, studentMessage);
  const tooVagueForMastery = isTooVagueForMastery(segment, studentMessage, matchedConcepts);
  const correct = hasRequiredConcepts && !unsafeContradiction && !tooVagueForMastery;
  const score = Math.min(
    100,
    Math.round((matchedConcepts.length / segment.acceptableConcepts.length) * 100),
  );

  return {
    correct,
    matchedConcepts,
    missedConcepts: [
      ...missedConcepts,
      unsafeContradiction ? "safe CMA action" : null,
      tooVagueForMastery ? "complete direct answer" : null,
    ].filter((concept): concept is string => Boolean(concept)),
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
        `Alright, let's check your knowledge on ${context.lesson.title}.`,
        modePrefix,
        `Here's a quick reminder before we dive in: ${context.segment.concept}`,
        context.segment.question,
      ].join("\n\n");
    }

    return [
      `Okay, today we're tackling ${context.lesson.title}.`,
      modePrefix,
      context.segment.concept,
      `Here's a real-world example: ${context.segment.example}`,
      context.segment.question,
    ].join("\n\n");
  }

  if (context.action === "advance") {
    const nextSegment = context.segment;

    return [
      context.evaluation?.correctExplanation ?? "Yep, that's it!",
      context.state.mode === "quiz"
        ? `Good — let's keep going. Next up: ${nextSegment.title}.`
        : `Nice. Let's build on that — next idea: ${nextSegment.title}.`,
      context.state.mode === "quiz" ? `Keep this in mind: ${nextSegment.concept}` : nextSegment.concept,
      context.state.mode === "rapid_review" ? null : `Example: ${nextSegment.example}`,
      nextSegment.question,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (context.action === "retry") {
    return [
      context.evaluation?.incorrectExplanation ??
        "Not quite — but that's okay, let's work through it.",
      context.evaluation?.missedConcepts.length
        ? `What was missing: ${context.evaluation.missedConcepts.join(", ")}.`
        : null,
      context.state.remediationLevel > 1
        ? `Let's slow it down. The key thing to remember here: ${context.evaluation?.idealAnswer}`
        : null,
      `Memory tip: ${context.evaluation?.memoryTip ?? context.segment.memoryTip}`,
      `Give it another shot: ${context.segment.question}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  return [
    context.evaluation?.correctExplanation ?? "Great work making it through this one.",
    context.lesson.completionMessage,
    `The big thing to take away: ${context.segment.idealAnswer}`,
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
    context.segment.questionType ? `Question type: ${context.segment.questionType}` : null,
    context.segment.difficulty ? `Question difficulty: ${context.segment.difficulty}` : null,
    `Action: ${context.action}`,
    `Tutoring mode: ${context.state.mode}`,
    `Preferred teaching language: ${context.state.preferredLanguage}`,
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
    context.action === "retry"
      ? `Mastery rule: do not advance. Explain precisely why the answer was incomplete or inaccurate, name the missed concept, reteach briefly, and ask the same question or a close follow-up.`
      : null,
    context.action === "wrap"
      ? `Summary rule: close with concise key takeaways the student should remember for the NHA CCMA exam.`
      : null,
    context.state.mode === "quiz"
      ? `Mode rules: keep teaching minimal, ask the checkpoint quickly, and frame feedback like a guided exam coach.`
      : null,
    context.state.mode === "rapid_review"
      ? `Mode rules: keep it brisk, high-yield, and exam-focused.`
      : null,
    context.state.mode === "weak_area_review"
      ? `Mode rules: reinforce the weak idea with patient, repetitive coaching and a simple memory anchor.`
      : null,
    context.action === "wrap"
      ? `Output rules: keep it under 180 words, sound like a supportive CCMA instructor, recap the lesson, celebrate progress, and do not end with a question.`
      : `Output rules: keep it under 180 words, sound like a supportive CCMA instructor, evaluate strictly, and end with exactly one clear question.`,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await client.responses.create({
    model: DEFAULT_TUTOR_MODEL,
    instructions: buildTutorSystemPrompt({
      mode: context.state.mode,
      topic: context.lesson.title,
      weakAreas: [],
      preferredLanguage: context.state.preferredLanguage,
    }),
    input: prompt,
    store: false,
    max_output_tokens: 360,
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
  preferredLanguage?: SupportedLanguage;
}) {
  const lesson = getTutorLesson(args.lessonId);

  if (!lesson) {
    throw new Error(`Unknown lesson id: ${args.lessonId}`);
  }

  const state = createInitialTutorSessionState(
    args.lessonId,
    args.mode,
    args.weakAreasSnapshot ?? [],
    args.preferredLanguage ?? "en",
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
