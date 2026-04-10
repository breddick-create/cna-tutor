export type ExamMode = "quiz" | "mock_exam";

export type ExamChoice = {
  id: string;
  label: string;
  text: string;
};

export type ExamQuestion = {
  id: string;
  domainSlug: string;
  domainTitle: string;
  prompt: string;
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
