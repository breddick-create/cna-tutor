import type { SupportedLanguage } from "@/lib/ccma/i18n/languages";
import { buildTutorSystemPrompt } from "@/lib/ccma/tutor/prompts";
import { getTutorLesson, resolveLessonMode } from "@/lib/ccma/tutor/lessons";
import { DEFAULT_TUTOR_MODEL, getOpenAIClient } from "@/lib/ccma/tutor/openai";
import {
  AFFIRMATIONS,
  CORRECTIONS,
  nextIndex,
  selectAffirmation,
  selectCorrection,
} from "@/lib/ccma/tutor/feedback-library";
import type {
  LessonQuestionType,
  LessonSegment,
  SessionPhase,
  TopicState,
  TutorEvaluation,
  TutorLesson,
  TutorMode,
  TutorSessionState,
} from "@/lib/ccma/tutor/types";

const MAX_ATTEMPTS_PER_TOPIC = 3;

function normalizeText(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function getWords(s: string) {
  return normalizeText(s).split(/\s+/).filter(Boolean);
}

function inferBloomLevel(questionType: LessonQuestionType | undefined): number {
  switch (questionType) {
    case "recall":
      return 1;
    case "application":
      return 3;
    case "scenario":
      return 4;
    case "critical_thinking":
      return 5;
    case "misconception":
      return 3;
    case "summary":
      return 2;
    default:
      return 2;
  }
}

function deriveSessionPhase(
  topicIndex: number,
  totalTopics: number,
  sessionComplete: boolean,
): SessionPhase {
  if (sessionComplete) return "completed";
  if (topicIndex === 0) return "open";
  if (topicIndex >= totalTopics - 1) return "close";
  return "core";
}

const UNSAFE_PHRASES = [
  "do nothing",
  "ignore",
  "wait until later",
  "skip hand hygiene",
  "dont report",
  "do not report",
  "never report",
  "share private",
  "reuse needle",
  "skip documentation",
  "give medication without checking",
  "diagnose",
  "prescribe",
];

function prefixMatch(a: string, b: string) {
  return a === b || a.startsWith(b) || b.startsWith(a);
}

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
  const correct = meetsThreshold || overlap >= 0.5;
  const score = Math.round(
    Math.max(
      segment.acceptableConcepts.length > 0 ? matched.length / segment.acceptableConcepts.length : 0,
      overlap,
    ) * 100,
  );

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

function topicsFromLesson(lesson: TutorLesson): TopicState[] {
  return lesson.segments.map((seg) => ({
    id: seg.id,
    title: seg.title,
    taught: false,
    attempts: 0,
    mastered: false,
  }));
}

function clampIndex(value: number, max: number) {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(value, max));
}

function normalizePersistedTopics(args: {
  lesson: TutorLesson;
  rawTopics: TopicState[];
  rawCurrentTopicIndex?: number;
  rawCurrentTopicAttempts?: number;
  modeOverride?: TutorMode;
  preferredLanguage: SupportedLanguage;
  weakAreasSnapshot: string[];
}) {
  const freshState = createInitialTutorSessionState(
    args.lesson.id,
    args.modeOverride,
    args.weakAreasSnapshot,
    args.preferredLanguage,
  );

  const normalizedTopics = freshState.topics.map((freshTopic) => {
    const matches = args.rawTopics.filter(
      (rawTopic) => rawTopic.id === freshTopic.id || rawTopic.id.startsWith(`${freshTopic.id}-`),
    );

    if (!matches.length) {
      return freshTopic;
    }

    const attempts = matches.reduce((maxAttempts, topic) => {
      const nextAttempts = typeof topic.attempts === "number" ? topic.attempts : 0;
      return Math.max(maxAttempts, nextAttempts);
    }, 0);

    return {
      ...freshTopic,
      taught: matches.some((topic) => topic.taught || topic.mastered || topic.attempts > 0),
      mastered: matches.some((topic) => topic.mastered),
      attempts,
    };
  });

  const rawCurrentTopic =
    typeof args.rawCurrentTopicIndex === "number" && args.rawCurrentTopicIndex >= 0
      ? args.rawTopics[args.rawCurrentTopicIndex] ?? null
      : null;

  const mappedCurrentTopicIndex = rawCurrentTopic?.id
    ? normalizedTopics.findIndex(
        (topic) => rawCurrentTopic.id === topic.id || rawCurrentTopic.id.startsWith(`${topic.id}-`),
      )
    : -1;

  const firstUnfinishedTopicIndex = normalizedTopics.findIndex((topic) => !topic.mastered);
  const fallbackCurrentTopicIndex =
    firstUnfinishedTopicIndex >= 0 ? firstUnfinishedTopicIndex : normalizedTopics.length - 1;
  const currentTopicIndex = clampIndex(
    mappedCurrentTopicIndex >= 0 ? mappedCurrentTopicIndex : fallbackCurrentTopicIndex,
    normalizedTopics.length - 1,
  );

  const currentTopic = normalizedTopics[currentTopicIndex] ?? null;
  const currentTopicAttempts =
    mappedCurrentTopicIndex >= 0 && typeof args.rawCurrentTopicAttempts === "number"
      ? args.rawCurrentTopicAttempts
      : currentTopic?.mastered
        ? 0
        : (currentTopic?.attempts ?? 0);

  const sessionComplete = normalizedTopics.length > 0 && normalizedTopics.every((topic) => topic.taught);

  return {
    topics: normalizedTopics,
    currentTopicIndex,
    currentTopicAttempts,
    masteryScore:
      normalizedTopics.length > 0
        ? Math.round(
            (normalizedTopics.filter((topic) => topic.mastered).length / normalizedTopics.length) * 100,
          )
        : 0,
    sessionComplete,
  };
}

export function createInitialTutorSessionState(
  lessonId: string,
  modeOverride?: TutorMode,
  weakAreasSnapshot: string[] = [],
  preferredLanguage: SupportedLanguage = "en",
  priorLessonTitle: string | null = null,
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
    sessionPhase: "open",
    affirmationIndex: 0,
    correctionIndex: 0,
    topicsSinceSynthesis: 0,
    synthesisMode: false,
    priorLessonTitle,
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
  const resolvedLessonId =
    lessonId ?? (typeof raw.lessonId === "string" ? raw.lessonId : undefined);

  if (!resolvedLessonId || !raw.mode) {
    return resolvedLessonId ? createInitialTutorSessionState(resolvedLessonId, modeOverride) : null;
  }

  const lesson = getTutorLesson(resolvedLessonId);
  if (!lesson) return null;

  if (!Array.isArray(raw.topics) || raw.topics.length === 0) {
    const fresh = createInitialTutorSessionState(resolvedLessonId, modeOverride);
    return {
      ...fresh,
      mode: modeOverride ?? (raw.mode as TutorMode),
      preferredLanguage: (raw.preferredLanguage as SupportedLanguage) ?? "en",
      weakAreasSnapshot: Array.isArray(raw.weakAreasSnapshot)
        ? (raw.weakAreasSnapshot as string[])
        : [],
    };
  }

  const preferredLanguage = (raw.preferredLanguage as SupportedLanguage) ?? "en";
  const weakAreasSnapshot = Array.isArray(raw.weakAreasSnapshot)
    ? (raw.weakAreasSnapshot as string[])
    : [];
  const normalized = normalizePersistedTopics({
    lesson,
    rawTopics: raw.topics as TopicState[],
    rawCurrentTopicIndex:
      typeof raw.currentTopicIndex === "number" ? raw.currentTopicIndex : undefined,
    rawCurrentTopicAttempts:
      typeof raw.currentTopicAttempts === "number" ? raw.currentTopicAttempts : undefined,
    modeOverride: modeOverride ?? (raw.mode as TutorMode),
    preferredLanguage,
    weakAreasSnapshot,
  });

  const sessionComplete = (raw.sessionComplete as boolean) ?? normalized.sessionComplete;

  return {
    lessonId: resolvedLessonId,
    mode: modeOverride ?? (raw.mode as TutorMode),
    preferredLanguage,
    topics: normalized.topics,
    currentTopicIndex: normalized.currentTopicIndex,
    currentTopicAttempts: normalized.currentTopicAttempts,
    awaitingAnswer: (raw.awaitingAnswer as boolean) ?? false,
    tutorLastGaveAnswer: (raw.tutorLastGaveAnswer as boolean) ?? false,
    correctCount: (raw.correctCount as number) ?? 0,
    masteryScore: normalized.masteryScore,
    weakAreasSnapshot,
    sessionComplete,
    lastStudentMessage: (raw.lastStudentMessage as string | null) ?? null,
    lastTutorMessage: (raw.lastTutorMessage as string | null) ?? null,
    step: (raw.step as TutorSessionState["step"]) ?? "teach",
    sessionPhase:
      (raw.sessionPhase as SessionPhase) ??
      deriveSessionPhase(normalized.currentTopicIndex, normalized.topics.length, sessionComplete),
    affirmationIndex: (raw.affirmationIndex as number) ?? 0,
    correctionIndex: (raw.correctionIndex as number) ?? 0,
    topicsSinceSynthesis: (raw.topicsSinceSynthesis as number) ?? 0,
    synthesisMode: (raw.synthesisMode as boolean) ?? false,
    priorLessonTitle: (raw.priorLessonTitle as string | null) ?? null,
  };
}

type TurnAction = "intro" | "correct" | "incorrect" | "force_advance" | "wrap" | "synthesis_prompt" | "synthesis_ack";

type MessageArgs = {
  action: TurnAction;
  lesson: TutorLesson;
  currentSegment: LessonSegment;
  nextSegment: LessonSegment | null;
  topicNumber: number;
  totalTopics: number;
  attemptNumber: number;
  evaluation: TutorEvaluation | null;
  studentMessage: string | null;
  masteredTitles: string[];
  struggledTitles: string[];
  state: TutorSessionState;
  affirmationPhrase: string;
  correctionPhrase: string;
  synthesisTopicTitles?: string[];
};

function buildPrompt(args: MessageArgs): string {
  const {
    action,
    lesson,
    currentSegment,
    nextSegment,
    topicNumber,
    totalTopics,
    attemptNumber,
    evaluation,
    studentMessage,
    masteredTitles,
    struggledTitles,
    state,
    affirmationPhrase,
    correctionPhrase,
    synthesisTopicTitles,
  } = args;

  const lines: string[] = [];

  switch (action) {
    case "intro": {
      const priorLine = state.priorLessonTitle
        ? `PRIOR LESSON: Student last studied "${state.priorLessonTitle}". Open with a single bridging sentence connecting it to today's lesson.`
        : "";
      lines.push(
        `ACTION: Begin the lesson. Introduce "${lesson.title}" warmly in 1-2 sentences.`,
        priorLine,
        `TODAY'S GOAL: ${lesson.learningGoal}`,
        `TOPIC 1 OF ${totalTopics}: "${currentSegment.title}"`,
        `CONCEPT TO TEACH: ${currentSegment.concept}`,
        `EXAMPLE TO SHARE: ${currentSegment.example}`,
        `REQUIRED CLOSING QUESTION - end your response with this question exactly:`,
        `"${currentSegment.question}"`,
      );
      break;
    }

    case "correct":
      if (nextSegment) {
        lines.push(
          `ACTION: Student answered correctly. Open naturally with this affirmation: "${affirmationPhrase}"`,
          `EXPLANATION: ${evaluation?.correctExplanation ?? currentSegment.correctExplanation}`,
          `TRANSITION (say this out loud): "Good - now let's move on to topic ${topicNumber + 1} of ${totalTopics}: ${nextSegment.title}."`,
          `NEXT CONCEPT: ${nextSegment.concept}`,
          `NEXT EXAMPLE: ${nextSegment.example}`,
          `REQUIRED CLOSING QUESTION - end your response with this question exactly:`,
          `"${nextSegment.question}"`,
        );
      } else {
        const nextLessonTitle = lesson.nextRecommendedLessonIds.length > 0
          ? (getTutorLesson(lesson.nextRecommendedLessonIds[0])?.title ?? null)
          : null;
        lines.push(
          `ACTION: Student answered the final topic correctly. Lesson complete.`,
          `Open naturally with this affirmation: "${affirmationPhrase}"`,
          `EXPLANATION: ${evaluation?.correctExplanation ?? currentSegment.correctExplanation}`,
          ``,
          `SESSION CLOSE - write as flowing prose (no numbered headers):`,
          `1. In 1-2 sentences, summarize the main concepts covered: ${masteredTitles.join(", ")}.${struggledTitles.length ? ` Note ${struggledTitles.join(", ")} still need review.` : " All topics mastered."}`,
          `2. Call out the single most important thing to remember before next time.`,
          `3. ${nextLessonTitle ? `Preview the next lesson: "${nextLessonTitle}" in 1 sentence.` : "Encourage them to take the quiz to lock in their knowledge."}`,
          `Do NOT ask another question.`,
        );
      }
      break;

    case "incorrect":
      if (attemptNumber === 1) {
        lines.push(
          `ACTION: Student answered incorrectly on attempt 1. Open naturally with this corrective phrase: "${correctionPhrase}"`,
          `TOPIC ${topicNumber} OF ${totalTopics}: "${currentSegment.title}"`,
          `STUDENT SAID: "${studentMessage ?? ""}"`,
          `WHY IT WAS WRONG: ${evaluation?.incorrectExplanation ?? currentSegment.incorrectExplanation}`,
          `MEMORY TIP: ${currentSegment.memoryTip}`,
          `REQUIRED CLOSING QUESTION - end with this question, rephrased slightly if needed:`,
          `"${currentSegment.question}"`,
        );
      } else {
        lines.push(
          `ACTION: Student answered incorrectly on attempt ${attemptNumber}. Open with "${correctionPhrase}" and then state the answer directly.`,
          `TOPIC ${topicNumber} OF ${totalTopics}: "${currentSegment.title}"`,
          `STUDENT SAID: "${studentMessage ?? ""}"`,
          `STATE THIS ANSWER EXPLICITLY: "${currentSegment.idealAnswer}"`,
          `MEMORY TIP: ${currentSegment.memoryTip}`,
          `REQUIRED CLOSING QUESTION - end with this question one final time:`,
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
          `TRANSITION (say this): "Let's keep moving - topic ${topicNumber + 1} of ${totalTopics}: ${nextSegment.title}."`,
          `NEXT CONCEPT: ${nextSegment.concept}`,
          `NEXT EXAMPLE: ${nextSegment.example}`,
          `REQUIRED CLOSING QUESTION - end your response with this question exactly:`,
          `"${nextSegment.question}"`,
          `Tone: supportive and forward-looking. Do NOT say "correct" or "great job."`,
        );
      } else {
        const nextLessonTitle = lesson.nextRecommendedLessonIds.length > 0
          ? (getTutorLesson(lesson.nextRecommendedLessonIds[0])?.title ?? null)
          : null;
        const allTitles = [...masteredTitles, ...struggledTitles, currentSegment.title];
        lines.push(
          `ACTION: Student did not master the final topic after ${MAX_ATTEMPTS_PER_TOPIC} attempts. Give answer and close session.`,
          `CORRECT ANSWER TO STATE: "${currentSegment.idealAnswer}"`,
          `MEMORY TIP: ${currentSegment.memoryTip}`,
          ``,
          `SESSION CLOSE - write as flowing prose (no numbered headers):`,
          `1. Summarize the concepts covered: ${[...new Set(allTitles)].join(", ")}.`,
          `2. Identify the single most important concept for them to review before next time.`,
          `3. ${nextLessonTitle ? `Preview the next lesson: "${nextLessonTitle}" in 1 sentence.` : "Encourage them to review and take the quiz."}`,
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
          : "All topics mastered - strong session.",
        `Do NOT ask another question. Prompt them to take the quiz or start another lesson.`,
      );
      break;

    case "synthesis_prompt": {
      const covered = synthesisTopicTitles ?? [];
      lines.push(
        `ACTION: Mid-session synthesis check-in. The student has covered ${covered.length} topics. Pause the Q&A briefly.`,
        `TOPICS COVERED SO FAR: ${covered.join(" → ")}`,
        `Ask 1 open-ended synthesis question that connects these concepts to a real clinical situation.`,
        `Frame it naturally - e.g. "Thinking about what we've covered - if you were assisting with a patient who..."`,
        `Keep it concise: 1-2 sentences of setup, then the question. Do NOT introduce the next topic yet.`,
      );
      break;
    }

    case "synthesis_ack": {
      lines.push(
        `ACTION: Student responded to a synthesis check-in. In 1 sentence, acknowledge their response (affirm the insight or gently add to it).`,
        `STUDENT SAID: "${studentMessage ?? ""}"`,
        `Then transition naturally into the next topic.`,
        `TOPIC ${topicNumber} OF ${totalTopics}: "${currentSegment.title}"`,
        `CONCEPT TO TEACH: ${currentSegment.concept}`,
        `EXAMPLE TO SHARE: ${currentSegment.example}`,
        `REQUIRED CLOSING QUESTION - end your response with this question exactly:`,
        `"${currentSegment.question}"`,
      );
      break;
    }
  }

  lines.push(
    `---`,
    `LESSON: ${lesson.title}`,
    `LESSON GOAL: ${lesson.learningGoal}`,
    `TUTORING MODE: ${state.mode}`,
    `SESSION PHASE: ${state.sessionPhase} (open=orientation, core=main teaching, close=wrap-up)`,
    `LANGUAGE: ${state.preferredLanguage}`,
    `Output: keep it under 220 words. Sound like a warm CCMA instructor. No bullet walls.`,
  );

  return lines.filter(Boolean).join("\n");
}

function fallbackMessage(args: MessageArgs): string {
  const {
    action,
    currentSegment,
    nextSegment,
    lesson,
    evaluation,
    topicNumber,
    totalTopics,
    masteredTitles,
    struggledTitles,
    synthesisTopicTitles,
    studentMessage,
    state,
  } = args;

  switch (action) {
    case "intro":
      return [
        state.priorLessonTitle
          ? `Building on what you covered in ${state.priorLessonTitle}, today we're tackling ${lesson.title}.`
          : `Today we're covering ${lesson.title}.`,
        currentSegment.concept,
        `Example: ${currentSegment.example}`,
        currentSegment.question,
      ].filter(Boolean).join("\n\n");

    case "correct":
      if (!nextSegment) {
        const nextLessonTitle = lesson.nextRecommendedLessonIds.length > 0
          ? (getTutorLesson(lesson.nextRecommendedLessonIds[0])?.title ?? null)
          : null;
        return [
          evaluation?.correctExplanation ?? "Great work!",
          `Topics covered: ${masteredTitles.join(", ")}.`,
          masteredTitles.length > 0 ? `Key concept to hold onto: ${masteredTitles[masteredTitles.length - 1]}.` : "",
          nextLessonTitle ? `Up next: ${nextLessonTitle}.` : "Take the quiz to lock in your knowledge.",
        ].filter(Boolean).join("\n\n");
      }
      return [
        evaluation?.correctExplanation ?? "That's right.",
        `Moving on - topic ${topicNumber + 1} of ${totalTopics}: ${nextSegment.title}.`,
        nextSegment.concept,
        nextSegment.question,
      ].join("\n\n");

    case "incorrect":
      return [
        evaluation?.incorrectExplanation ?? "Not quite - let's work through it.",
        args.attemptNumber >= 2 ? `The answer is: ${currentSegment.idealAnswer}` : null,
        `Memory tip: ${currentSegment.memoryTip}`,
        currentSegment.question,
      ].filter(Boolean).join("\n\n");

    case "force_advance":
      if (!nextSegment) {
        const nextLessonTitle = lesson.nextRecommendedLessonIds.length > 0
          ? (getTutorLesson(lesson.nextRecommendedLessonIds[0])?.title ?? null)
          : null;
        return [
          `The answer: ${currentSegment.idealAnswer}`,
          `Memory tip: ${currentSegment.memoryTip}`,
          `Topics covered: ${[...masteredTitles, ...struggledTitles, currentSegment.title].join(", ")}.`,
          nextLessonTitle ? `Up next: ${nextLessonTitle}.` : "Review these concepts, then take the quiz.",
        ].filter(Boolean).join("\n\n");
      }
      return [
        `The answer: ${currentSegment.idealAnswer}`,
        `Memory tip: ${currentSegment.memoryTip}`,
        `Moving on - topic ${topicNumber + 1} of ${totalTopics}: ${nextSegment.title}.`,
        nextSegment.concept,
        nextSegment.question,
      ].join("\n\n");

    case "wrap":
      return [
        lesson.completionMessage,
        struggledTitles.length > 0
          ? `Review before your exam: ${struggledTitles.join(", ")}.`
          : "Great session - solid understanding throughout.",
      ].join("\n\n");

    case "synthesis_prompt":
      return [
        `Great work covering ${(synthesisTopicTitles ?? []).join(" and ")}.`,
        `Before we continue - how would these concepts apply if you were in a clinical setting and a patient needed urgent attention? What steps would you prioritize?`,
      ].join("\n\n");

    case "synthesis_ack":
      return [
        studentMessage ? `Good thinking on that.` : `Good reflection.`,
        `Let's continue - topic ${topicNumber} of ${totalTopics}: ${currentSegment.title}.`,
        currentSegment.concept,
        currentSegment.question,
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
          sessionPhase: args.state.sessionPhase,
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

export function evaluateStudentAnswer(segment: LessonSegment, studentMessage: string): TutorEvaluation {
  return gradeAnswer(studentMessage, segment);
}

export async function buildInitialTutorTurnForMode(args: {
  lessonId: string;
  mode?: TutorMode;
  weakAreasSnapshot?: string[];
  preferredLanguage?: SupportedLanguage;
  priorLessonTitle?: string | null;
}) {
  const lesson = getTutorLesson(args.lessonId);
  if (!lesson) throw new Error(`Unknown lesson id: ${args.lessonId}`);

  const state = createInitialTutorSessionState(
    args.lessonId,
    args.mode,
    args.weakAreasSnapshot ?? [],
    args.preferredLanguage ?? "en",
    args.priorLessonTitle ?? null,
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
    affirmationPhrase: selectAffirmation(state.affirmationIndex),
    correctionPhrase: selectCorrection(state.correctionIndex),
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

  // ── 0. Synthesis ack: student responded to a synthesis check-in ───────────

  if (state.synthesisMode) {
    const syntheticEval: TutorEvaluation = {
      correct: true,
      matchedConcepts: [],
      missedConcepts: [],
      score: 100,
      idealAnswer: "",
      correctExplanation: "",
      incorrectExplanation: "",
      memoryTip: "",
    };

    const message = await generateMessage({
      action: "synthesis_ack",
      lesson,
      currentSegment,
      nextSegment: lesson.segments[topicIndex + 1] ?? null,
      topicNumber: topicIndex + 1,
      totalTopics,
      attemptNumber: 0,
      evaluation: null,
      studentMessage,
      masteredTitles: state.topics.filter((t) => t.mastered).map((t) => t.title),
      struggledTitles: state.topics.filter((t) => t.taught && !t.mastered).map((t) => t.title),
      state,
      affirmationPhrase: selectAffirmation(state.affirmationIndex),
      correctionPhrase: selectCorrection(state.correctionIndex),
    });

    const nextState: TutorSessionState = {
      ...state,
      synthesisMode: false,
      topicsSinceSynthesis: 0,
      awaitingAnswer: true,
      tutorLastGaveAnswer: false,
      lastStudentMessage: studentMessage,
      lastTutorMessage: message,
      step: "synthesis_ack",
    };

    return {
      lesson,
      evaluation: syntheticEval,
      nextState,
      message,
      bloomLevel: 2,
      segmentId: currentSegment.id,
      isSynthesisTurn: true,
    };
  }

  // ── 1. Grade ──────────────────────────────────────────────────────────────

  let evaluation: TutorEvaluation;

  if (state.tutorLastGaveAnswer) {
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
  const newAttempts = state.currentTopicAttempts + 1;
  const forceAdvance = !correct && newAttempts >= MAX_ATTEMPTS_PER_TOPIC;
  const advance = correct || forceAdvance;

  const updatedTopics = state.topics.map((topic, index) =>
    index === topicIndex
      ? { ...topic, attempts: newAttempts, mastered: correct, taught: advance || topic.taught }
      : topic,
  );

  const nextTopicIndex = advance ? topicIndex + 1 : topicIndex;
  const sessionComplete = nextTopicIndex >= totalTopics;
  const nextTopicAttempts = advance ? 0 : newAttempts;
  const masteredTitles = updatedTopics.filter((topic) => topic.mastered).map((topic) => topic.title);
  const struggledTitles = updatedTopics
    .filter((topic) => topic.taught && !topic.mastered)
    .map((topic) => topic.title);

  // ── 2. Check synthesis trigger ────────────────────────────────────────────

  const newTopicsSinceSynthesis = advance ? state.topicsSinceSynthesis + 1 : state.topicsSinceSynthesis;
  const triggerSynthesis = advance && !sessionComplete && newTopicsSinceSynthesis >= 2;

  // ── 3. Determine action ───────────────────────────────────────────────────

  let action: TurnAction;
  let step: TutorSessionState["step"];

  if (triggerSynthesis) {
    action = "synthesis_prompt";
    step = "synthesis_prompt";
  } else if (sessionComplete) {
    action = forceAdvance ? "force_advance" : "correct";
    step = "completed";
  } else if (advance) {
    action = forceAdvance ? "force_advance" : "correct";
    step = "advance";
  } else {
    action = "incorrect";
    step = "remediate";
  }

  const nextSegment = (triggerSynthesis || sessionComplete) ? null : lesson.segments[nextTopicIndex];

  const synthesisTopicTitles = triggerSynthesis
    ? lesson.segments
        .slice(Math.max(0, nextTopicIndex - newTopicsSinceSynthesis), nextTopicIndex)
        .map((s) => s.title)
    : undefined;

  const nextAffirmationIndex = correct
    ? nextIndex(state.affirmationIndex, AFFIRMATIONS.length)
    : state.affirmationIndex;
  const nextCorrectionIndex = !correct
    ? nextIndex(state.correctionIndex, CORRECTIONS.length)
    : state.correctionIndex;

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
    affirmationPhrase: selectAffirmation(state.affirmationIndex),
    correctionPhrase: selectCorrection(state.correctionIndex),
    synthesisTopicTitles,
  });

  const correctCount = state.correctCount + (correct ? 1 : 0);
  const masteryScore = Math.round((masteredTitles.length / totalTopics) * 100);
  const tutorLastGaveAnswer =
    !advance && (newAttempts >= 2 || semanticOverlap(message, currentSegment.idealAnswer) >= 0.5);
  const nextPhase = deriveSessionPhase(nextTopicIndex, totalTopics, sessionComplete);

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
    sessionPhase: nextPhase,
    affirmationIndex: nextAffirmationIndex,
    correctionIndex: nextCorrectionIndex,
    synthesisMode: triggerSynthesis,
    topicsSinceSynthesis: triggerSynthesis ? 0 : newTopicsSinceSynthesis,
  };

  return {
    lesson,
    evaluation,
    nextState,
    message,
    bloomLevel: inferBloomLevel(currentSegment.questionType),
    segmentId: currentSegment.id,
    isSynthesisTurn: false,
  };
}
