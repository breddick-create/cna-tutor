import type { ExamQuestion } from "@/lib/ccma/exams/types";
import { CCMA_EXAM_BANK } from "@/lib/ccma/exams/ccma-exam-bank";
import type { CcmaExamBankDomainSlug } from "@/lib/ccma/exams/ccma-exam-bank";

// NHA CCMA blueprint weights (percent of 130 scored questions)
const DOMAIN_WEIGHTS: Record<CcmaExamBankDomainSlug, number> = {
  "clinical-patient-care": 0.24,
  "patient-care-coordination-and-education": 0.08,
  "administrative-assisting": 0.20,
  "laboratory-procedures": 0.14,
  "diagnostic-testing": 0.14,
  "pharmacology": 0.10,
  "medical-terminology-and-anatomy": 0.10,
};

export function shuffleQuestions<T>(questions: T[]): T[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getCcmaExamBank(): ExamQuestion[] {
  return CCMA_EXAM_BANK;
}

export function getQuestionsForDomain(
  domainSlug: string,
  count?: number,
  shuffle = true,
): ExamQuestion[] {
  const filtered = CCMA_EXAM_BANK.filter((q) => q.domainSlug === domainSlug);
  const result = shuffle ? shuffleQuestions(filtered) : filtered;
  return count ? result.slice(0, count) : result;
}

export function getQuizQuestions(domainSlug: string, count = 10): ExamQuestion[] {
  return getQuestionsForDomain(domainSlug, count, true);
}

export function getDrillQuestions(domainSlugs: string[], questionsPerDomain = 4): ExamQuestion[] {
  const questions: ExamQuestion[] = [];
  for (const slug of domainSlugs) {
    questions.push(...getQuestionsForDomain(slug, questionsPerDomain, true));
  }
  return shuffleQuestions(questions);
}

export function getMockExamQuestions(count = 50): ExamQuestion[] {
  const selected: ExamQuestion[] = [];

  for (const [slug, weight] of Object.entries(DOMAIN_WEIGHTS)) {
    const domainCount = Math.max(1, Math.round(count * weight));
    const domainQuestions = getQuestionsForDomain(slug, domainCount, true);
    selected.push(...domainQuestions);
  }

  // Ensure at least 15 scenario questions per spec
  const scenarioCount = selected.filter((q) => q.type === "scenario").length;
  if (scenarioCount < 15) {
    const allScenarios = CCMA_EXAM_BANK.filter(
      (q) => q.type === "scenario" && !selected.some((s) => s.id === q.id),
    );
    const needed = 15 - scenarioCount;
    selected.push(...shuffleQuestions(allScenarios).slice(0, needed));
  }

  return shuffleQuestions(selected).slice(0, count);
}

export function getPretestQuestions(count = 35): ExamQuestion[] {
  return getMockExamQuestions(count);
}

export function getDomainTitles(): Record<string, string> {
  const titles: Record<string, string> = {};
  for (const question of CCMA_EXAM_BANK) {
    if (!titles[question.domainSlug]) {
      titles[question.domainSlug] = question.domainTitle;
    }
  }
  return titles;
}

export function listExamDomains(): Array<{ slug: string; title: string }> {
  const seen = new Set<string>();
  const domains: Array<{ slug: string; title: string }> = [];
  for (const question of CCMA_EXAM_BANK) {
    if (!seen.has(question.domainSlug)) {
      seen.add(question.domainSlug);
      domains.push({ slug: question.domainSlug, title: question.domainTitle });
    }
  }
  return domains;
}

export function getAssessmentQuestions(
  mode: "quiz" | "mock_exam" | "pretest" | "weak_area_drill",
  domainSlug?: string,
  domainSlugs?: string[],
): ExamQuestion[] {
  if (mode === "mock_exam" && !domainSlug) {
    return getMockExamQuestions(50);
  }

  if (mode === "mock_exam" && domainSlug) {
    return getQuestionsForDomain(domainSlug, undefined, true);
  }

  if (mode === "pretest") {
    return getPretestQuestions(35);
  }

  if (mode === "weak_area_drill") {
    const slugs = domainSlugs ?? (domainSlug ? [domainSlug] : []);
    return getDrillQuestions(slugs, 4);
  }

  // quiz
  return getQuestionsForDomain(domainSlug ?? "", 10, true);
}

type ScoreResult = {
  percent: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  domainBreakdown: Array<{
    domainSlug: string;
    domainTitle: string;
    correctCount: number;
    totalQuestions: number;
    percent: number;
  }>;
  results: Array<{
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
  }>;
};

export function scoreAssessment(args: {
  mode: "quiz" | "mock_exam" | "pretest" | "weak_area_drill";
  answers: Record<string, string>;
  domainSlug?: string;
  domainSlugs?: string[];
  questionIds?: string[];
}): ScoreResult {
  const questionPool = getAssessmentQuestions(args.mode, args.domainSlug, args.domainSlugs);

  const questions = args.questionIds?.length
    ? questionPool.filter((q) => args.questionIds!.includes(q.id))
    : questionPool;

  if (!questions.length) {
    return {
      percent: 0,
      correctCount: 0,
      totalQuestions: 0,
      passed: false,
      domainBreakdown: [],
      results: [],
    };
  }

  const domainMap = new Map<
    string,
    { title: string; correct: number; total: number }
  >();

  const results = questions.map((q) => {
    const selectedId = args.answers[q.id] ?? null;
    const correct = selectedId === q.correctChoiceId;
    const selectedChoice = q.choices.find((c) => c.id === selectedId) ?? null;
    const correctChoice = q.choices.find((c) => c.id === q.correctChoiceId)!;

    const domain = domainMap.get(q.domainSlug) ?? { title: q.domainTitle, correct: 0, total: 0 };
    domain.total += 1;
    if (correct) domain.correct += 1;
    domainMap.set(q.domainSlug, domain);

    return {
      id: q.id,
      domainSlug: q.domainSlug,
      domainTitle: q.domainTitle,
      prompt: q.prompt,
      selectedChoiceId: selectedId,
      selectedChoiceText: selectedChoice?.text ?? null,
      correctChoiceId: q.correctChoiceId,
      correctChoiceText: correctChoice.text,
      correct,
      rationale: q.rationale,
      memoryTip: q.memoryTip,
    };
  });

  const correctCount = results.filter((r) => r.correct).length;
  const totalQuestions = results.length;
  const percent = Math.round((correctCount / totalQuestions) * 100);

  const domainBreakdown = Array.from(domainMap.entries()).map(([slug, data]) => ({
    domainSlug: slug,
    domainTitle: data.title,
    correctCount: data.correct,
    totalQuestions: data.total,
    percent: Math.round((data.correct / data.total) * 100),
  }));

  return {
    percent,
    correctCount,
    totalQuestions,
    passed: percent >= 75,
    domainBreakdown,
    results,
  };
}
