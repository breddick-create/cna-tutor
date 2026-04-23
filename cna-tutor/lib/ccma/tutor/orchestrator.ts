import type { SupportedLanguage } from "@/lib/ccma/i18n/languages";
import { buildTutorSystemPrompt } from "@/lib/ccma/tutor/prompts";
import { getTutorLesson, resolveLessonMode } from "@/lib/ccma/tutor/lessons";
import { DEFAULT_TUTOR_MODEL, getOpenAIClient } from "@/lib/ccma/tutor/openai";
import type {
  LessonSegment,
  TopicState,
  TutorEvaluation,
  TutorLesson,
  TutorMode,
  TutorSessionState,
} from "@/lib/ccma/tutor/types";

const MAX_ATTEMPTS_PER_TOPIC = 3;

// ─── Text helpers ──────────────────────────────────────────────────────────

function normalizeText(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function getWords(s: string) {
  return normalizeText(s).split(/\s+/).filter(Boolean);
}

// ─── Grading ───────────────────────────────────────────────────────────────

const UNSAFE_PHRASES = [
  "do nothing", "ignore", "wait until later", "skip hand hygiene",
  "dont report", "do not report", "never report", "share private",
  "reuse needle", "skip documentation", "give medication without checking",
  "diagnose", "prescribe",
];

function prefixMatch(a: string, b: string) {
  return a === b || a.startsWith(b) || b.startsWith(a);
}

// Fraction of meaningful ideal-answer words present in student answer (0–1)
function semanticOverlap(studentText: string, idealAnswer: string): number {
  const studentWords = getWords(studentText);
  const idealWords = getWords(idealAnswer).filter((w) => w.length >= 4);
  if (idealWords.length === 0) return 1;
  const hits = idealWords.filter((iw) => studentWords.some((sw) => prefixMatch(sw, iw))).length;
  return hits / idealWords.length;
}

function keywordConceptsMatch(studentText: string, segment: LessonSegment) {
  const normalized = normalizeText(studentText);
  const studentWords = getWords(normalized);

  const matched = segment.acceptableConcepts
    .filter((concept) => {
      const kws = concept.keywords.map((k) => normalizeText(k).trim()).filter(Boolean);
      const phraseHit = kws.some((k) => k.includes(" ") && normalized.includes(k));
      if (phraseHit) return true;
      const tokenHits = kws.filter(
        (k) => !k.includes(" ") && studentWords.some((sw) => prefixMatch(sw, k)),
      ).length;
      return tokenHits >= (kws.length <= 1 ? 1 : 2);
    })
    .map((c) => c.label);

  const missed = segment.acceptableConcepts
    .map((c) => c.label)
    .filter((l) => !matched.includes(l));

  return { matched, missed, meetsThreshold: matched.length >= segment.passThreshold };
}

function gradeAnswer(studentText: string, segment: LessonSegment): TutorEvaluation {
  const unsafe = UNSAFE_PHRASES.some((p) => normalizeText(studentText).includes(normalizeText(p)));

  if (unsafe) {
    return {
      correct: false,
      matchedConcepts: [],
      missedConcepts: segment.acceptableConcepts.map((c) => c.label),
      score: 0,
      idealAnswer: segment.idealAnswer,
      correctExplanation: segment.correctExplanation,
      incorrectExplanation: segment.incorrectExplanation,
      memoryTip: segment.memoryTip,
    };
  }

  const { matched, missed, meetsThreshold } = keywordConceptsMatch(studentText, segment);
  const overlap = semanticOverlap(studentText, segment.idealAnswer);

  // Correct if keyword concepts pass OR semantic overlap >= 50% of ideal answer
  const correct = meetsThreshold || overlap >= 0.5;
  const score = Math.round(Math.max(
    segment.acceptableConcepts.length > 0 ? matched.length / segment.acceptableConcepts.length : 0,
    overlap,
  ) * 100);

  return {
    correct,
    matchedConcepts: matched,
    missedConcepts: correct ? [] : missed,
    score,
    idealAnswer: segment.idealAnswer,
    correctExplanation: segment.correctExplanation,
    incorrectExplanation: segment.incorrectExplanation,
    memoryTip: segment.memoryTip,
  };
}

// ─── Session state ─────────────────────────────────────────────────────────

function topicsFromLesson(lesson: TutorLesson): TopicState[] {
  return lesson.segments.map((seg) => ({
    id: seg.id,
    title: seg.title,
    taught: false,
    attempts: 0,
    mastered: false,
  }));
}

export function createInitialTutorSessionState(
  lessonId: string,
  modeOverride?: TutorMode,
  weakAreasSnapshot: string[] = [],
  preferredLanguage: SupportedLanguage = "en",
): TutorSessionState {
  const lesson = getTutorLesson(lessonId);
  if (!lesson) throw new Error(`Unknown lesson id: ${lessonId}`);
  const mode = resolveLessonMode(lesson, modeOverride);

  return {
    lessonId: lesson.id,
    mode,
    preferredLanguage,
    topics: topicsFromLesson(lesson),
    currentTopicIndex: 0,
    currentTopicAttempts: 0,
    awaitingAnswer: false,
    tutorLastGaveAnswer: false,
    correctCount: 0,
    masteryScore: 0,
    weakAreasSnapshot,
    sessionComplete: false,
    lastStudentMessage: null,
    lastTutorMessage: null,
    step: "intro",
  };
}

export function parseTutorSessionState(
  input: unknown,
  lessonId?: string,
  modeOverride?: TutorMode,
): TutorSessionState | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return lessonId ? createInitialTutorSessionState(lessonId, modeOverride) : null;
  }

  const raw = input as Record<string, unknown>;

  if (!raw.lessonId || !raw.mode) {
    return lessonId ? createInitialTutorSessionState(lessonId, modeOverride) : null;
  }

  // Old-format state (no topics array) — rebuild from the lesson definition
  if (!Array.isArray(raw.topics) || raw.topics.length === 0) {
    const id = lessonId ?? (raw.lessonId as string | undefined);
    if (!id) return null;
    const fresh = createInitialTutorSessionState(id, modeOverride);
    return {
      ...fresh,
      mode: modeOverride ?? (raw.mode as TutorMode),
      preferredLanguage: (raw.preferredLanguage as SupportedLanguage) ?? "en",
      weakAreasSnapshot: Array.isArray(raw.weakAreasSnapshot)
        ? (raw.weakAreasSnapshot as string[])
        : [],
    };
  }

  return {
    lessonId: raw.lessonId as string,
    mode: modeOverride ?? (raw.mode as TutorMode),
    preferredLanguage: (raw.preferredLanguage as SupportedLanguage) ?? "en",
    topics: raw.topics as TopicState[],
    currentTopicIndex: (raw.currentTopicIndex as number) ?? 0,
    currentTopicAttempts: (raw.currentTopicAttempts as number) ?? 0,
    awaitingAnswer: (raw.awaitingAnswer as boolean) ?? false,
    tutorLastGaveAnswer: (raw.tutorLastGaveAnswer as boolean) ?? false,
    correctCount: (raw.correctCount as number) ?? 0,
    masteryScore: (raw.masteryScore as number) ?? 0,
    weakAreasSnapshot: Array.isArray(raw.weakAreasSnapshot)
      ? (raw.weakAreasSnapshot as string[])
      : [],
    sessionComplete: (raw.sessionComplete as boolean) ?? false,
    lastStudentMessage: (raw.lastStudentMessage as string | null) ?? null,
    lastTutorMessage: (raw.lastTutorMessage as string | null) ?? null,
    step: (raw.step as TutorSessionState["step"]) ?? "teach",
  };
}

// ─── Message generation ────────────────────────────────────────────────────

type TurnAction = "intro" | "correct" | "incorrect" | "force_advance" | "wrap";

type MessageArgs = {
  action: TurnAction;
  lesson: TutorLesson;
  currentSegment: LessonSegment;
  nextSegment: LessonSegment | null;
  topicNumber: number;
  totalTopics: number;
  attemptNumber: number; // 1-indexed attempt that just happened
  evaluation: TutorEvaluation | null;
  studentMessage: string | null;
  masteredTitles: string[];
  struggledTitles: string[];
  state: TutorSessionState;
};

function buildPrompt(args: MessageArgs): string {
  const {
    action, lesson, currentSegment, nextSegment,
    topicNumber, totalTopics, attemptNumber,
    evaluation, studentMessage, masteredTitles, struggledTitles, state,
  } = args;

  const lines: string[] = [];

  switch (action) {
    case "intro":
      lines.push(
        `ACTION: Begin the lesson. Introduce "${lesson.title}" warmly in 1-2 sentences.`,
        `TOPIC 1 OF ${totalTopics}: "${currentSegment.title}"`,
        `CONCEPT TO TEACH: ${currentSegment.concept}`,
        `EXAMPLE TO SHARE: ${currentSegment.example}`,
        `REQUIRED CLOSING QUESTION — end your response with this question exactly:`,
        `"${currentSegment.question}"`,
      );
      break;

    case "correct":
      if (nextSegment) {
        lines.push(
          `ACTION: Student answered correctly. Confirm it in one sentence using the explanation below.`,
          `EXPLANATION: ${evaluation?.correctExplanation ?? currentSegment.correctExplanation}`,
          `TRANSITION (say this out loud): "Good — now let's move on to topic ${topicNumber + 1} of ${totalTopics}: ${nextSegment.title}."`,
          `NEXT CONCEPT: ${nextSegment.concept}`,
          `NEXT EXAMPLE: ${nextSegment.example}`,
          `REQUIRED CLOSING QUESTION — end your response with this question exactly:`,
          `"${nextSegment.question}"`,
        );
      } else {
        lines.push(
          `ACTION: Student answered the final topic correctly. Lesson complete.`,
          `EXPLANATION: ${evaluation?.correctExplanation ?? currentSegment.correctExplanation}`,
          `Give a 2-3 sentence summary of the lesson.`,
          masteredTitles.length > 0 ? `Topics mastered: ${masteredTitles.join(", ")}.` : "",
          struggledTitles.length > 0
            ? `Tell the student to revisit these before the NHA CCMA exam: ${struggledTitles.join(", ")}.`
            : "Celebrate — they mastered every topic.",
          `Do NOT ask another question. Prompt them to take the quiz or start the next lesson.`,
        );
      }
      break;

    case "incorrect":
      if (attemptNumber === 1) {
        lines.push(
          `ACTION: Student answered incorrectly on attempt 1. Explain why, then ask again.`,
          `TOPIC ${topicNumber} OF ${totalTopics}: "${currentSegment.title}"`,
          `STUDENT SAID: "${studentMessage ?? ""}"`,
          `WHY IT WAS WRONG: ${evaluation?.incorrectExplanation ?? currentSegment.incorrectExplanation}`,
          `MEMORY TIP: ${currentSegment.memoryTip}`,
          `REQUIRED CLOSING QUESTION — end with this question, rephrased slightly if needed:`,
          `"${currentSegment.question}"`,
        );
      } else {
        lines.push(
          `ACTION: Student answered incorrectly on attempt ${attemptNumber}. State the answer directly, then ask one more time.`,
          `TOPIC ${topicNumber} OF ${totalTopics}: "${currentSegment.title}"`,
          `STUDENT SAID: "${studentMessage ?? ""}"`,
          `STATE THIS ANSWER EXPLICITLY: "${currentSegment.idealAnswer}"`,
          `MEMORY TIP: ${currentSegment.memoryTip}`,
          `REQUIRED CLOSING QUESTION — end with this question one final time:`,
          `"${currentSegment.question}"`,
        );
      }
      break;

    case "force_advance":
      if (nextSegment) {
        lines.push(
          `ACTION: Student did not master topic ${topicNumber} after ${MAX_ATTEMPTS_PER_TOPIC} attempts. Give them the answer and move on.`,
          `CORRECT ANSWER TO STATE: "${currentSegment.idealAnswer}"`,
          `MEMORY TIP: ${currentSegment.memoryTip}`,
          `TRANSITION (say this): "Let's keep moving — topic ${topicNumber + 1} of ${totalTopics}: ${nextSegment.title}."`,
          `NEXT CONCEPT: ${nextSegment.concept}`,
          `NEXT EXAMPLE: ${nextSegment.example}`,
          `REQUIRED CLOSING QUESTION — end your response with this question exactly:`,
          `"${nextSegment.question}"`,
          `Tone: supportive and forward-looking. Do NOT say "correct" or "great job."`,
        );
      } else {
        lines.push(
          `ACTION: Student did not master the final topic after ${MAX_ATTEMPTS_PER_TOPIC} attempts. Give answer and summarize.`,
          `CORRECT ANSWER TO STATE: "${currentSegment.idealAnswer}"`,
          `MEMORY TIP: ${currentSegment.memoryTip}`,
          `Give a brief lesson summary.`,
          masteredTitles.length > 0 ? `Topics mastered: ${masteredTitles.join(", ")}.` : "",
          `Topics to review before the NHA CCMA exam: ${[...struggledTitles, currentSegment.title].join(", ")}.`,
          `Do NOT ask another question.`,
        );
      }
      break;

    case "wrap":
      lines.push(
        `ACTION: All topics complete. Give a lesson summary.`,
        lesson.completionMessage,
        masteredTitles.length > 0 ? `Topics mastered: ${masteredTitles.join(", ")}.` : "",
        struggledTitles.length > 0
          ? `Tell the student to revisit these before the NHA CCMA exam: ${struggledTitles.join(", ")}.`
          : "All topics mastered — strong session.",
        `Do NOT ask another question. Prompt them to take the quiz or start another lesson.`,
      );
      break;
  }

  lines.push(
    `---`,
    `LESSON: ${lesson.title}`,
    `LESSON GOAL: ${lesson.learningGoal}`,
    `TUTORING MODE: ${state.mode}`,
    `LANGUAGE: ${state.preferredLanguage}`,
    `Output: keep it under 200 words. Sound like a warm CCMA instructor. No bullet walls.`,
  );

  return lines.filter(Boolean).join("\n");
}

function fallbackMessage(args: MessageArgs): string {
  const { action, currentSegment, nextSegment, lesson, evaluation, topicNumber, totalTopics, masteredTitles, struggledTitles } = args;

  switch (action) {
    case "intro":
      return [
        `Today we're covering ${lesson.title}.`,
        currentSegment.concept,
        `Example: ${currentSegment.example}`,
        currentSegment.question,
      ].join("\n\n");

    case "correct":
      if (!nextSegment) {
        return [
          evaluation?.correctExplanation ?? "Great work!",
          lesson.completionMessage,
          struggledTitles.length > 0
            ? `Review before your exam: ${struggledTitles.join(", ")}.`
            : "You showed strong understanding throughout.",
        ].join("\n\n");
      }
      return [
        evaluation?.correctExplanation ?? "That's right.",
        `Moving on — topic ${topicNumber + 1} of ${totalTopics}: ${nextSegment.title}.`,
        nextSegment.concept,
        nextSegment.question,
      ].join("\n\n");

    case "incorrect":
      return [
        evaluation?.incorrectExplanation ?? "Not quite — let's work through it.",
        args.attemptNumber >= 2 ? `The answer is: ${currentSegment.idealAnswer}` : null,
        `Memory tip: ${currentSegment.memoryTip}`,
        currentSegment.question,
      ].filter(Boolean).join("\n\n");

    case "force_advance":
      if (!nextSegment) {
        return [
          `The answer: ${currentSegment.idealAnswer}`,
          `Memory tip: ${currentSegment.memoryTip}`,
          lesson.completionMessage,
          struggledTitles.length > 0 ? `Review before your exam: ${[...struggledTitles, currentSegment.title].join(", ")}.` : "",
        ].filter(Boolean).join("\n\n");
      }
      return [
        `The answer: ${currentSegment.idealAnswer}`,
        `Memory tip: ${currentSegment.memoryTip}`,
        `Moving on — topic ${topicNumber + 1} of ${totalTopics}: ${nextSegment.title}.`,
        nextSegment.concept,
        nextSegment.question,
      ].join("\n\n");

    case "wrap":
      return [
        lesson.completionMessage,
        struggledTitles.length > 0
          ? `Review before your exam: ${struggledTitles.join(", ")}.`
          : "Great session — solid understanding throughout.",
      ].join("\n\n");
  }
}

async function generateMessage(args: MessageArgs): Promise<string> {
  const client = getOpenAIClient();

  if (client) {
    try {
      const response = await client.responses.create({
        model: DEFAULT_TUTOR_MODEL,
        instructions: buildTutorSystemPrompt({
          mode: args.state.mode,
          topic: args.lesson.title,
          weakAreas: args.state.weakAreasSnapshot,
          preferredLanguage: args.state.preferredLanguage,
        }),
        input: buildPrompt(args),
        store: false,
        max_output_tokens: 320,
      });
      const text = response.output_text?.trim();
      if (text) return text;
    } catch {
      // Fall through to deterministic fallback
    }
  }

  return fallbackMessage(args);
}

// ─── Public API ────────────────────────────────────────────────────────────

// Kept for backward compat with progress.ts and any callers
export function evaluateStudentAnswer(segment: LessonSegment, studentMessage: string): TutorEvaluation {
  return gradeAnswer(studentMessage, segment);
}

export async function buildInitialTutorTurnForMode(args: {
  lessonId: string;
  mode?: TutorMode;
  weakAreasSnapshot?: string[];
  preferredLanguage?: SupportedLanguage;
}) {
  const lesson = getTutorLesson(args.lessonId);
  if (!lesson) throw new Error(`Unknown lesson id: ${args.lessonId}`);

  const state = createInitialTutorSessionState(
    args.lessonId,
    args.mode,
    args.weakAreasSnapshot ?? [],
    args.preferredLanguage ?? "en",
  );

  const currentSegment = lesson.segments[0];
  if (!currentSegment) throw new Error(`Lesson has no segments: ${args.lessonId}`);

  const message = await generateMessage({
    action: "intro",
    lesson,
    currentSegment,
    nextSegment: lesson.segments[1] ?? null,
    topicNumber: 1,
    totalTopics: lesson.segments.length,
    attemptNumber: 0,
    evaluation: null,
    studentMessage: null,
    masteredTitles: [],
    struggledTitles: [],
    state,
  });

  return {
    lesson,
    state: {
      ...state,
      step: "teach" as const,
      awaitingAnswer: true,
      lastTutorMessage: message,
    },
    message,
  };
}

export async function buildInitialTutorTurn(lessonId: string) {
  return buildInitialTutorTurnForMode({ lessonId });
}

export async function processTutorReply(args: {
  lessonId: string;
  state: TutorSessionState;
  studentMessage: string;
}) {
  const lesson = getTutorLesson(args.lessonId);
  if (!lesson) throw new Error(`Unknown lesson id: ${args.lessonId}`);

  const { state, studentMessage } = args;
  const topicIndex = state.currentTopicIndex;
  const currentSegment = lesson.segments[topicIndex];
  const totalTopics = lesson.segments.length;

  if (!currentSegment) throw new Error(`Invalid topic index: ${topicIndex}`);

  // ── 1. Grade ─────────────────────────────────────────────────────────────

  let evaluation: TutorEvaluation;

  if (state.tutorLastGaveAnswer) {
    // Tutor stated the answer last turn — auto-credit any restatement
    evaluation = {
      correct: true,
      matchedConcepts: currentSegment.acceptableConcepts.map((c) => c.label),
      missedConcepts: [],
      score: 100,
      idealAnswer: currentSegment.idealAnswer,
      correctExplanation: currentSegment.correctExplanation,
      incorrectExplanation: currentSegment.incorrectExplanation,
      memoryTip: currentSegment.memoryTip,
    };
  } else {
    evaluation = gradeAnswer(studentMessage, currentSegment);
  }

  const correct = evaluation.correct;

  // ── 2. Decide progression ─────────────────────────────────────────────────

  const newAttempts = state.currentTopicAttempts + 1;
  const forceAdvance = !correct && newAttempts >= MAX_ATTEMPTS_PER_TOPIC;
  const advance = correct || forceAdvance;

  // ── 3. Update topic list ──────────────────────────────────────────────────

  const updatedTopics = state.topics.map((t, i) =>
    i === topicIndex
      ? { ...t, attempts: newAttempts, mastered: correct, taught: advance || t.taught }
      : t,
  );

  const nextTopicIndex = advance ? topicIndex + 1 : topicIndex;
  const sessionComplete = nextTopicIndex >= totalTopics;
  const nextTopicAttempts = advance ? 0 : newAttempts;

  const masteredTitles = updatedTopics.filter((t) => t.mastered).map((t) => t.title);
  const struggledTitles = updatedTopics.filter((t) => t.taught && !t.mastered).map((t) => t.title);

  // ── 4. Determine action for message generation ────────────────────────────

  let action: TurnAction;
  let step: TutorSessionState["step"];

  if (sessionComplete) {
    action = forceAdvance ? "force_advance" : "correct";
    step = "completed";
  } else if (advance) {
    action = forceAdvance ? "force_advance" : "correct";
    step = "advance";
  } else {
    action = "incorrect";
    step = "remediate";
  }

  const nextSegment = sessionComplete ? null : lesson.segments[nextTopicIndex];

  // ── 5. Generate message ───────────────────────────────────────────────────

  const message = await generateMessage({
    action,
    lesson,
    currentSegment,
    nextSegment,
    topicNumber: topicIndex + 1,
    totalTopics,
    attemptNumber: newAttempts,
    evaluation,
    studentMessage,
    masteredTitles,
    struggledTitles,
    state: { ...state, currentTopicAttempts: newAttempts },
  });

  // ── 6. Build next state ───────────────────────────────────────────────────

  const correctCount = state.correctCount + (correct ? 1 : 0);
  const masteryScore = Math.round((masteredTitles.length / totalTopics) * 100);

  // tutorLastGaveAnswer = true when we stay on the same topic and just stated the answer
  // (either attempt 2+ incorrect, or the model overlapped with ideal answer in its message)
  const tutorLastGaveAnswer =
    !advance &&
    (newAttempts >= 2 ||
      semanticOverlap(message, currentSegment.idealAnswer) >= 0.5);

  const nextState: TutorSessionState = {
    ...state,
    topics: updatedTopics,
    currentTopicIndex: nextTopicIndex,
    currentTopicAttempts: nextTopicAttempts,
    awaitingAnswer: !sessionComplete,
    tutorLastGaveAnswer,
    correctCount,
    masteryScore,
    sessionComplete,
    lastStudentMessage: studentMessage,
    lastTutorMessage: message,
    step,
  };

  return { lesson, evaluation, nextState, message };
}
