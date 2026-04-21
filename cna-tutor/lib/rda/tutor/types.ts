export type SupportedLanguage = "en";

export type TutorMode = "learn" | "quiz" | "mock_exam" | "weak_area_review" | "study_plan" | "rapid_review";
export type TutorDifficultyTier = "foundation" | "standard" | "challenge";
export type TutorStep = "intro" | "teach" | "remediate" | "advance" | "wrap" | "completed";

export type LessonConceptMatch = {
  label: string;
  keywords: string[];
};

export type LessonQuestionType =
  | "concept_teaching"
  | "recall"
  | "application"
  | "scenario"
  | "misconception"
  | "safety_reasoning"
  | "workflow_reasoning"
  | "exam_challenge"
  | "remediation"
  | "mastery_checkpoint";

export type LessonSegment = {
  id: string;
  title: string;
  questionType: LessonQuestionType;
  difficulty: 1 | 2 | 3;
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

export type TutorSessionState = {
  lessonId: string;
  mode: TutorMode;
  preferredLanguage: SupportedLanguage;
  currentSegmentIndex: number;
  step: TutorStep;
  attemptsOnCurrentQuestion: number;
  remediationLevel: number;
  difficultyTier: TutorDifficultyTier;
  correctCount: number;
  totalQuestions: number;
  masteryScore: number;
  lastStudentMessage: string | null;
  lastMatchedConcepts: string[];
  weakAreasSnapshot: string[];
  sessionComplete: boolean;
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

export type TutorMessageContext = {
  action: "intro" | "advance" | "retry" | "wrap";
  lesson: TutorLesson;
  segment: LessonSegment;
  state: TutorSessionState;
  evaluation: TutorEvaluation | null;
  studentMessage: string | null;
};
