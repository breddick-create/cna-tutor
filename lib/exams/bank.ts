import { texasCnaExamBank } from "@/content/texas-cna/exam-bank";
import type {
  ExamMode,
  ExamQuestion,
  ExamResultQuestion,
  PublicExamQuestion,
} from "@/lib/exams/types";

function toPublicQuestion(question: ExamQuestion): PublicExamQuestion {
  const { correctChoiceId: _correctChoiceId, rationale: _rationale, memoryTip: _memoryTip, ...rest } =
    question;

  return rest;
}

export function listExamDomains() {
  return Array.from(
    new Map(
      texasCnaExamBank.map((question) => [
        question.domainSlug,
        {
          slug: question.domainSlug,
          title: question.domainTitle,
          questionCount: texasCnaExamBank.filter((item) => item.domainSlug === question.domainSlug)
            .length,
        },
      ]),
    ).values(),
  );
}

export function getQuizQuestions(domainSlug?: string) {
  const filtered = domainSlug
    ? texasCnaExamBank.filter((question) => question.domainSlug === domainSlug)
    : texasCnaExamBank;

  return filtered.slice(0, 5);
}

export function getMockExamQuestions() {
  return texasCnaExamBank.slice(0, 15);
}

export function getAssessmentQuestions(mode: ExamMode, domainSlug?: string) {
  const questions = mode === "mock_exam" ? getMockExamQuestions() : getQuizQuestions(domainSlug);

  return questions.map(toPublicQuestion);
}

export function scoreAssessment(args: {
  mode: ExamMode;
  answers: Record<string, string>;
  domainSlug?: string;
}) {
  const questions = args.mode === "mock_exam" ? getMockExamQuestions() : getQuizQuestions(args.domainSlug);
  const results: ExamResultQuestion[] = questions.map((question) => {
    const selectedChoiceId = args.answers[question.id] ?? null;
    const correct = selectedChoiceId === question.correctChoiceId;
    const selectedChoiceText =
      question.choices.find((choice) => choice.id === selectedChoiceId)?.text ?? null;
    const correctChoiceText =
      question.choices.find((choice) => choice.id === question.correctChoiceId)?.text ??
      "Correct answer unavailable";

    return {
      id: question.id,
      domainSlug: question.domainSlug,
      domainTitle: question.domainTitle,
      prompt: question.prompt,
      selectedChoiceId,
      selectedChoiceText,
      correctChoiceId: question.correctChoiceId,
      correctChoiceText,
      correct,
      rationale: question.rationale,
      memoryTip: question.memoryTip,
    };
  });

  const correctCount = results.filter((question) => question.correct).length;
  const percent = Math.round((correctCount / Math.max(1, questions.length)) * 100);

  const domainBreakdown = Array.from(
    results.reduce((map, result) => {
      const current = map.get(result.domainSlug) ?? {
        domainSlug: result.domainSlug,
        domainTitle: result.domainTitle,
        correctCount: 0,
        totalQuestions: 0,
      };

      current.totalQuestions += 1;
      current.correctCount += result.correct ? 1 : 0;
      map.set(result.domainSlug, current);
      return map;
    }, new Map<string, {
      domainSlug: string;
      domainTitle: string;
      correctCount: number;
      totalQuestions: number;
    }>()),
  ).map((item) => ({
    ...item,
    percent: Math.round((item.correctCount / Math.max(1, item.totalQuestions)) * 100),
  }));

  return {
    questions,
    results,
    correctCount,
    totalQuestions: questions.length,
    percent,
    passed: args.mode === "mock_exam" ? percent >= 75 : percent >= 80,
    domainBreakdown,
  };
}
