import { writtenExamDomains } from "@/content/texas-cna/written-domains";
import { writtenExamBank } from "@/content/texas-cna/written-exam-bank";
import type { ExamQuestion, ExamResultQuestion, PublicExamQuestion } from "@/lib/exams/types";

export { writtenExamDomains };

const WRITTEN_PRETEST_QUESTIONS_PER_DOMAIN = 3;
const WRITTEN_QUIZ_QUESTION_COUNT = 10;
const WRITTEN_FULL_MOCK_QUESTIONS_PER_DOMAIN = 8;
const WRITTEN_FULL_MOCK_TARGET = 60;

function toPublicQuestion(question: ExamQuestion): PublicExamQuestion {
  const { correctChoiceId: _correctChoiceId, rationale: _rationale, memoryTip: _memoryTip, ...rest } = question;
  return rest;
}

function questionsForDomain(domainSlug: string): ExamQuestion[] {
  return writtenExamBank.filter((q) => q.domainSlug === domainSlug);
}

function shuffleQuestions<T>(items: T[]): T[] {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function getQuestionsByIds(pool: ExamQuestion[], questionIds?: string[]): ExamQuestion[] {
  if (!questionIds?.length) return pool;
  const byId = new Map(pool.map((q) => [q.id, q]));
  return questionIds.map((id) => byId.get(id)).filter((q): q is ExamQuestion => Boolean(q));
}

function scoreResults(questions: ExamQuestion[], answers: Record<string, string>) {
  const results: ExamResultQuestion[] = questions.map((question) => {
    const selectedChoiceId = answers[question.id] ?? null;
    const correct = selectedChoiceId === question.correctChoiceId;
    return {
      id: question.id,
      domainSlug: question.domainSlug,
      domainTitle: question.domainTitle,
      prompt: question.prompt,
      selectedChoiceId,
      selectedChoiceText: question.choices.find((c) => c.id === selectedChoiceId)?.text ?? null,
      correctChoiceId: question.correctChoiceId,
      correctChoiceText:
        question.choices.find((c) => c.id === question.correctChoiceId)?.text ?? "Correct answer unavailable",
      correct,
      rationale: question.rationale,
      memoryTip: question.memoryTip,
    };
  });

  const correctCount = results.filter((r) => r.correct).length;
  const percent = Math.round((correctCount / Math.max(1, questions.length)) * 100);

  const domainBreakdown = Array.from(
    results
      .reduce((map, result) => {
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
      }, new Map<string, { domainSlug: string; domainTitle: string; correctCount: number; totalQuestions: number }>())
      .values(),
  ).map((item) => ({
    ...item,
    percent: Math.round((item.correctCount / Math.max(1, item.totalQuestions)) * 100),
  }));

  return { results, correctCount, percent, domainBreakdown };
}

// ─── Pretest ──────────────────────────────────────────────────────────────────

export function getWrittenPretestQuestions(): PublicExamQuestion[] {
  return writtenExamDomains.flatMap((domain) =>
    questionsForDomain(domain.slug)
      .slice(0, WRITTEN_PRETEST_QUESTIONS_PER_DOMAIN)
      .map(toPublicQuestion),
  );
}

export function scoreWrittenPretest(args: {
  answers: Record<string, string>;
  questionIds?: string[];
}) {
  const pool = writtenExamDomains.flatMap((domain) =>
    questionsForDomain(domain.slug).slice(0, WRITTEN_PRETEST_QUESTIONS_PER_DOMAIN),
  );
  const questions = args.questionIds?.length
    ? (() => {
        const byId = new Map(pool.map((q) => [q.id, q]));
        return args.questionIds.map((id) => byId.get(id)).filter((q): q is ExamQuestion => Boolean(q));
      })()
    : pool;

  const { results, correctCount, percent, domainBreakdown } = scoreResults(questions, args.answers);
  return {
    results,
    correctCount,
    totalQuestions: questions.length,
    percent,
    passed: percent >= 70,
    domainBreakdown,
  };
}

// ─── Quiz & Mock Exam ─────────────────────────────────────────────────────────

function getWrittenQuizQuestions(domainSlug?: string): ExamQuestion[] {
  const pool = domainSlug ? questionsForDomain(domainSlug) : writtenExamBank;
  return shuffleQuestions(pool).slice(0, WRITTEN_QUIZ_QUESTION_COUNT);
}

function getWrittenMockExamQuestions(domainSlug?: string): ExamQuestion[] {
  if (domainSlug) {
    return questionsForDomain(domainSlug);
  }
  const seeded = writtenExamDomains.flatMap((domain) =>
    shuffleQuestions(questionsForDomain(domain.slug)).slice(0, WRITTEN_FULL_MOCK_QUESTIONS_PER_DOMAIN),
  );
  return seeded.slice(0, WRITTEN_FULL_MOCK_TARGET);
}

export function listWrittenExamDomains() {
  return writtenExamDomains.map((domain) => ({
    slug: domain.slug,
    title: domain.title,
    questionCount: questionsForDomain(domain.slug).length,
  }));
}

export function getWrittenAssessmentQuestions(
  mode: "quiz" | "mock_exam",
  domainSlug?: string,
): PublicExamQuestion[] {
  const questions =
    mode === "quiz"
      ? getWrittenQuizQuestions(domainSlug)
      : getWrittenMockExamQuestions(domainSlug);
  return questions.map(toPublicQuestion);
}

export function scoreWrittenAssessment(args: {
  mode: "quiz" | "mock_exam";
  answers: Record<string, string>;
  domainSlug?: string;
  questionIds?: string[];
}) {
  const pool =
    args.mode === "quiz"
      ? getWrittenQuizQuestions(args.domainSlug)
      : getWrittenMockExamQuestions(args.domainSlug);
  const questions = getQuestionsByIds(pool, args.questionIds);
  const { results, correctCount, percent, domainBreakdown } = scoreResults(questions, args.answers);

  return {
    questions,
    results,
    correctCount,
    totalQuestions: questions.length,
    percent,
    passed: args.mode === "quiz" ? percent >= 80 : percent >= 75,
    domainBreakdown,
  };
}
