import { texasCnaDomains } from "@/content/texas-cna/domains";
import { texasCnaExamBank } from "@/content/texas-cna/exam-bank";
import type {
  ExamMode,
  ExamQuestion,
  ExamResultQuestion,
  PublicExamQuestion,
} from "@/lib/exams/types";

const PRETEST_QUESTIONS_PER_DOMAIN = 3;
const FULL_MOCK_QUESTIONS_PER_DOMAIN = 5;
const FULL_MOCK_MIN_QUESTIONS = 50;
const FULL_MOCK_MIN_SCENARIO_QUESTIONS = 15;
const QUIZ_MIN_QUESTION_COUNT = 10;
const WEAK_AREA_DRILL_QUESTION_COUNT = 10;

function toPublicQuestion(question: ExamQuestion): PublicExamQuestion {
  const { correctChoiceId: _correctChoiceId, rationale: _rationale, memoryTip: _memoryTip, ...rest } =
    question;

  return rest;
}

function questionsForDomain(domainSlug: string) {
  return texasCnaExamBank.filter((question) => question.domainSlug === domainSlug);
}

function getQuestionType(question: ExamQuestion) {
  return question.type ?? "knowledge";
}

function shuffleQuestions<T>(items: T[]) {
  const clone = [...items];

  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }

  return clone;
}

function getQuestionsByIds(pool: ExamQuestion[], questionIds?: string[]) {
  if (!questionIds?.length) {
    return pool;
  }

  const byId = new Map(pool.map((question) => [question.id, question]));

  return questionIds
    .map((questionId) => byId.get(questionId))
    .filter((question): question is ExamQuestion => Boolean(question));
}

export function listExamDomains() {
  return texasCnaDomains.map((domain) => ({
    slug: domain.slug,
    title: domain.title,
    questionCount: questionsForDomain(domain.slug).length,
  }));
}

export function getQuizQuestions(domainSlug?: string) {
  const filtered = domainSlug
    ? questionsForDomain(domainSlug)
    : texasCnaExamBank;

  return shuffleQuestions(filtered).slice(0, QUIZ_MIN_QUESTION_COUNT);
}

export function getWeakAreaDrillQuestions(domainSlugs: string[]) {
  const uniqueSlugs = Array.from(new Set(domainSlugs.filter(Boolean)));

  if (!uniqueSlugs.length) {
    return [];
  }

  const perDomainMinimum = Math.max(1, Math.floor(WEAK_AREA_DRILL_QUESTION_COUNT / uniqueSlugs.length));
  const seededQuestions = uniqueSlugs.flatMap((domainSlug) =>
    shuffleQuestions(questionsForDomain(domainSlug)).slice(0, perDomainMinimum),
  );
  const seededIds = new Set(seededQuestions.map((question) => question.id));
  const remainingPool = shuffleQuestions(
    texasCnaExamBank.filter(
      (question) => uniqueSlugs.includes(question.domainSlug) && !seededIds.has(question.id),
    ),
  );

  return [...seededQuestions, ...remainingPool].slice(0, WEAK_AREA_DRILL_QUESTION_COUNT);
}

export function getPretestQuestions() {
  return listExamDomains().flatMap((domain) =>
    questionsForDomain(domain.slug).slice(0, PRETEST_QUESTIONS_PER_DOMAIN),
  );
}

export function getMockExamQuestions(domainSlug?: string) {
  if (domainSlug) {
    return questionsForDomain(domainSlug);
  }

  const scenarioQuestions = shuffleQuestions(
    texasCnaExamBank.filter((question) => getQuestionType(question) === "scenario"),
  ).slice(0, FULL_MOCK_MIN_SCENARIO_QUESTIONS);
  const seededIds = new Set(scenarioQuestions.map((question) => question.id));

  const seededByDomain = listExamDomains().flatMap((domain) =>
    shuffleQuestions(
      questionsForDomain(domain.slug).filter((question) => !seededIds.has(question.id)),
    ).slice(0, FULL_MOCK_QUESTIONS_PER_DOMAIN),
  );

  const combinedSeededQuestions = [...scenarioQuestions, ...seededByDomain];

  if (combinedSeededQuestions.length >= FULL_MOCK_MIN_QUESTIONS) {
    return combinedSeededQuestions.slice(0, FULL_MOCK_MIN_QUESTIONS);
  }

  const combinedIds = new Set(combinedSeededQuestions.map((question) => question.id));
  const remainingQuestions = shuffleQuestions(
    texasCnaExamBank.filter((question) => !combinedIds.has(question.id)),
  );

  return [...combinedSeededQuestions, ...remainingQuestions].slice(0, FULL_MOCK_MIN_QUESTIONS);
}

export function getAssessmentQuestions(mode: ExamMode, domainSlug?: string, domainSlugs?: string[]) {
  const questions =
    mode === "mock_exam"
      ? getMockExamQuestions(domainSlug)
      : mode === "pretest"
        ? getPretestQuestions()
        : mode === "weak_area_drill"
          ? getWeakAreaDrillQuestions(domainSlugs ?? [])
        : getQuizQuestions(domainSlug);

  return questions.map(toPublicQuestion);
}

export function scoreAssessment(args: {
  mode: ExamMode;
  answers: Record<string, string>;
  domainSlug?: string;
  domainSlugs?: string[];
  questionIds?: string[];
}) {
  const questionPool =
    args.mode === "mock_exam"
      ? getMockExamQuestions(args.domainSlug)
      : args.mode === "pretest"
        ? getPretestQuestions()
        : args.mode === "weak_area_drill"
          ? getWeakAreaDrillQuestions(args.domainSlugs ?? [])
        : getQuizQuestions(args.domainSlug);
  const questions = getQuestionsByIds(questionPool, args.questionIds);

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
    results
      .reduce(
        (map, result) => {
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
        },
        new Map<
          string,
          {
            domainSlug: string;
            domainTitle: string;
            correctCount: number;
            totalQuestions: number;
          }
        >(),
      )
      .values(),
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
    passed:
      args.mode === "quiz" || args.mode === "weak_area_drill"
        ? percent >= 80
        : args.mode === "mock_exam"
          ? percent >= 75
          : percent >= 70,
    domainBreakdown,
  };
}
