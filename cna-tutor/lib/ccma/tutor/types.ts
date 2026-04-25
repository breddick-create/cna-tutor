import type { SupportedLanguage } from "@/lib/ccma/i18n/languages";
import type { Database } from "@/types/database";

export type TutorMode = Database["public"]["Tables"]["tutor_sessions"]["Row"]["mode"];

export type TutorStep =
  | "intro"
  | "teach"
  | "remediate"
  | "advance"
  | "wrap"
  | "completed"
  | "synthesis_prompt"
  | "synthesis_ack"
  | "open_review"
  | "review_ack";

export type LessonConceptMatch = {
  label: string;
  keywords: string[];
};

export type LessonQuestionType =
  | "recall"
  | "application"
  | "scenario"
  | "critical_thinking"
  | "misconception"
  | "summary";

export type LessonSegment = {
  id: string;
  title: string;
  questionType?: LessonQuestionType;
  difficulty?: 1 | 2 | 3;
  concept: string;
  example: string;
  question: string;
  idealAnswer: string;
  memoryTip: string;
  correctExplanation: string;
  incorrectExplanation: string;
  passThreshold: number;
  acceptableConcepts: LessonConceptMatch[];
};

export type TutorLesson = {
  id: string;
  slug: string;
  title: string;
  domainSlug: string;
  domainTitle: string;
  summary: string;
  learningGoal: string;
  estimatedMinutes: number;
  defaultMode: TutorMode;
  supportedModes: TutorMode[];
  segments: LessonSegment[];
  completionMessage: string;
  nextRecommendedLessonIds: string[];
};

// Per-topic tracking — the source of truth for progression
export type TopicState = {
  id: string;
  title: string;
  taught: boolean;   // true when covered (whether mastered or force-advanced)
  attempts: number;
  mastered: boolean; // true only when the student answered correctly
};

export type SessionPhase = "open" | "core" | "close" | "completed";

export type TutorSessionState = {
  lessonId: string;
  mode: TutorMode;
  preferredLanguage: SupportedLanguage;
  // Explicit topic list — control flow is driven by this, not the model
  topics: TopicState[];
  currentTopicIndex: number;
  currentTopicAttempts: number;
  awaitingAnswer: boolean;
  tutorLastGaveAnswer: boolean; // if true, auto-credit the next student response
  // Progress summary (used by API route and progress tracker)
  correctCount: number;
  masteryScore: number;
  weakAreasSnapshot: string[];
  sessionComplete: boolean;
  lastStudentMessage: string | null;
  lastTutorMessage: string | null;
  step: TutorStep; // used by API route for DB turn_type logging
  sessionPhase: SessionPhase;
  affirmationIndex: number;
  correctionIndex: number;
  // Session flow
  topicsSinceSynthesis: number;
  synthesisMode: boolean;
  priorLessonTitle: string | null;
  openReviewMode: boolean;
};

export type TutorEvaluation = {
  correct: boolean;
  matchedConcepts: string[];
  missedConcepts: string[];
  score: number;
  idealAnswer: string;
  correctExplanation: string;
  incorrectExplanation: string;
  memoryTip: string;
};
