import { ccmaExamBank } from "@/content/ccma/exam-bank";
import { ccmaDomains } from "@/content/ccma/domains";
import type {
  ExamMode,
  ExamQuestion,
  ExamResultQuestion,
  PublicExamQuestion,
} from "@/lib/exams/types";

const QUIZ_QUESTION_COUNT = 5;
const MOCK_QUESTIONS_PER_DOMAIN = 2;
const MOCK_MIN_QUESTION_COUNT = 24;

function toPublicQuestion(question: ExamQuestion): PublicExamQuestion {
  const { correctChoiceId, rationale, memoryTip, ...rest } = question;
  void correctChoiceId;
  void rationale;
  void memoryTip;

  return rest;
}

function questionsForDomain(domainSlug: string) {
  return ccmaExamBank.filter((question) => question.domainSlug === domainSlug);
}

function shuffleQuestions<T>(items: T[]) {
  const clone = [...items];

  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }

  return clone;
}

export function listExamDomains() {
  return ccmaDomains.map((domain) => ({
    slug: domain.slug,
    title: domain.title,
    questionCount: questionsForDomain(domain.slug).length,
  }));
}

export function getQuizQuestions(domainSlug?: string) {
  const filtered = domainSlug ? questionsForDomain(domainSlug) : ccmaExamBank;

  return shuffleQuestions(filtered).slice(0, QUIZ_QUESTION_COUNT);
}

export function getMockExamQuestions() {
  const seededQuestions = listExamDomains().flatMap((domain) =>
    shuffleQuestions(questionsForDomain(domain.slug)).slice(0, MOCK_QUESTIONS_PER_DOMAIN),
  );

  if (seededQuestions.length >= MOCK_MIN_QUESTION_COUNT) {
    return shuffleQuestions(seededQuestions);
  }

  const seededIds = new Set(seededQuestions.map((question) => question.id));
  const remainingQuestions = shuffleQuestions(
    ccmaExamBank.filter((question) => !seededIds.has(question.id)),
  );

  return shuffleQuestions([...seededQuestions, ...remainingQuestions]).slice(0, MOCK_MIN_QUESTION_COUNT);
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
    }>()).values(),
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
