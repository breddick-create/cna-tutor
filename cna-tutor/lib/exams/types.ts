export type ExamMode = "quiz" | "mock_exam" | "pretest" | "weak_area_drill";

export type QuizConfidenceLevel =
  | "not_confident"
  | "somewhat_confident"
  | "very_confident";

export type ExamChoice = {
  id: string;
  label: string;
  text: string;
};

export type ExamQuestionType = "knowledge" | "scenario";

export type ExamQuestion = {
  id: string;
  domainSlug: string;
  domainTitle: string;
  prompt: string;
  type?: ExamQuestionType;
  choices: ExamChoice[];
  correctChoiceId: string;
  rationale: string;
  memoryTip: string;
  difficulty: 1 | 2 | 3;
};

export type PublicExamQuestion = Omit<ExamQuestion, "correctChoiceId" | "rationale" | "memoryTip">;

export type ExamResultQuestion = {
  id: string;
  domainSlug: string;
  domainTitle: string;
  prompt: string;
  selectedChoiceId: string | null;
  selectedChoiceText: string | null;
  correctChoiceId: string;
  correctChoiceText: string;
  correct: boolean;
  rationale: string;
  memoryTip: string;
};

export type AssessmentResultSummary = {
  mode: ExamMode;
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  weakDomains: string[];
};

export type AssessmentResultBreakdown = {
  domainSlug: string;
  domainTitle: string;
  correctCount: number;
  totalQuestions: number;
  percent: number;
};

export type AssessmentResultPayload = {
  summary: AssessmentResultSummary;
  breakdown: AssessmentResultBreakdown[];
  questions: ExamResultQuestion[];
  newAchievements?: Array<{
    slug: string;
    title: string;
    description: string;
  }>;
  drillComparisons?: Array<{
    domainSlug: string;
    domainTitle: string;
    drillScore: number;
    pretestBaseline: number | null;
    deltaFromBaseline: number | null;
  }>;
};

export type AssessmentErrorPayload = {
  error?: string;
};
