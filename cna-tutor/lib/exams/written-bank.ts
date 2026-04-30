import { texasCnaExamBank } from "@/content/texas-cna/exam-bank";
import type { ExamQuestion, ExamResultQuestion, PublicExamQuestion } from "@/lib/exams/types";

const WRITTEN_PRETEST_QUESTIONS_PER_DOMAIN = 3;

export const writtenExamDomains = [
  { slug: "health-care-team", title: "Member of the Health Care Team" },
  { slug: "basic-nursing-care", title: "Basic Nursing Care" },
  { slug: "function-and-health", title: "Function and Health of the Resident" },
  { slug: "restorative-care", title: "Restorative Care" },
  { slug: "promotion-of-safety", title: "Promotion of Safety" },
  { slug: "legal-ethical", title: "Legal and Ethical Issues" },
  { slug: "emotional-mental-health", title: "Emotional and Mental Health Needs" },
  { slug: "cognitive-impairment", title: "Caring for Cognitively Impaired Residents" },
];

function toPublicQuestion(question: ExamQuestion): PublicExamQuestion {
  const { correctChoiceId: _correctChoiceId, rationale: _rationale, memoryTip: _memoryTip, ...rest } = question;
  return rest;
}

function questionsForDomain(domainSlug: string): ExamQuestion[] {
  return texasCnaExamBank.filter((q) => q.domainSlug === domainSlug);
}

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
        return args.questionIds
          .map((id) => byId.get(id))
          .filter((q): q is ExamQuestion => Boolean(q));
      })()
    : pool;

  const results: ExamResultQuestion[] = questions.map((question) => {
    const selectedChoiceId = args.answers[question.id] ?? null;
    const correct = selectedChoiceId === question.correctChoiceId;
    const selectedChoiceText =
      question.choices.find((c) => c.id === selectedChoiceId)?.text ?? null;
    const correctChoiceText =
      question.choices.find((c) => c.id === question.correctChoiceId)?.text ??
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

  const correctCount = results.filter((r) => r.correct).length;
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
        new Map<string, { domainSlug: string; domainTitle: string; correctCount: number; totalQuestions: number }>(),
      )
      .values(),
  ).map((item) => ({
    ...item,
    percent: Math.round((item.correctCount / Math.max(1, item.totalQuestions)) * 100),
  }));

  return {
    results,
    correctCount,
    totalQuestions: questions.length,
    percent,
    passed: percent >= 70,
    domainBreakdown,
  };
}
