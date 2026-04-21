export type TutorEvaluationInput = {
  answer: string;
  requiredConcepts: string[];
  optionalConcepts?: string[];
  forbiddenConcepts?: string[];
  safetyConcepts?: string[];
  reasoningSignals?: string[];
  terminologySignals?: string[];
};

export type TutorEvaluationResult = {
  score: number;
  passed: boolean;
  band: "mastery" | "near_mastery" | "partial" | "incorrect";
  dimensionScores: {
    factual: number;
    completeness: number;
    safety: number;
    reasoning: number;
    terminology: number;
  };
  missingConcepts: string[];
  unsafeFlags: string[];
  feedback: string;
};

export type ShortAnswerRubric = {
  accuracy: number;
  completeness: number;
  safetyAwareness: number;
  reasoning: number;
  terminology: number;
};

export type ShortAnswerEvaluation = {
  passed: boolean;
  score: number;
  rubric: ShortAnswerRubric;
  missingElements: string[];
  feedback: string;
  retryHint: string;
};

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const containsConcept = (answer: string, concept: string) => {
  const a = normalize(answer);
  const c = normalize(concept);
  return a.includes(c);
};

const countMatches = (answer: string, concepts: string[] = []) =>
  concepts.filter((concept) => containsConcept(answer, concept));

export function evaluateTutorAnswer(input: TutorEvaluationInput): TutorEvaluationResult {
  const {
    answer,
    requiredConcepts,
    optionalConcepts = [],
    forbiddenConcepts = [],
    safetyConcepts = [],
    reasoningSignals = [],
    terminologySignals = [],
  } = input;

  const normalized = normalize(answer);

  const requiredHits = countMatches(normalized, requiredConcepts);
  const optionalHits = countMatches(normalized, optionalConcepts);
  const safetyHits = countMatches(normalized, safetyConcepts);
  const reasoningHits = countMatches(normalized, reasoningSignals);
  const terminologyHits = countMatches(normalized, terminologySignals);
  const unsafeFlags = forbiddenConcepts.filter((concept) =>
    containsConcept(normalized, concept),
  );
  const missingConcepts = requiredConcepts.filter(
    (concept) => !containsConcept(normalized, concept),
  );

  let factual = requiredConcepts.length
    ? requiredHits.length / requiredConcepts.length
    : 1;
  let completeness =
    (requiredHits.length + optionalHits.length * 0.5) /
    Math.max(requiredConcepts.length + optionalConcepts.length * 0.5, 1);
  let safety = safetyConcepts.length ? safetyHits.length / safetyConcepts.length : 1;
  let reasoning = reasoningSignals.length
    ? reasoningHits.length / reasoningSignals.length
    : normalized.length > 80
      ? 0.6
      : 0.2;
  let terminology = terminologySignals.length
    ? terminologyHits.length / terminologySignals.length
    : normalized.length > 50
      ? 0.7
      : 0.3;

  if (normalized.length < 25) {
    completeness *= 0.5;
    reasoning *= 0.4;
    terminology *= 0.6;
  }

  if (unsafeFlags.length > 0) {
    safety = Math.min(safety, 0.2);
    factual = Math.min(factual, 0.4);
  }

  const score =
    factual * 0.35 +
    completeness * 0.2 +
    safety * 0.2 +
    reasoning * 0.15 +
    terminology * 0.1;

  const passed =
    score >= 0.9 && unsafeFlags.length === 0 && missingConcepts.length === 0;
  const band =
    score >= 0.9 && unsafeFlags.length === 0
      ? "mastery"
      : score >= 0.75
        ? "near_mastery"
        : score >= 0.5
          ? "partial"
          : "incorrect";

  let feedback = "";

  if (unsafeFlags.length > 0) {
    feedback += `Your answer included unsafe or not-allowed ideas: ${unsafeFlags.join(", ")}. `;
  }

  if (missingConcepts.length > 0) {
    feedback += `You missed these key points: ${missingConcepts.join(", ")}. `;
  }

  if (band === "mastery") {
    feedback +=
      "Strong answer. You included the critical facts, safety steps, and reasoning needed to move forward.";
  } else if (band === "near_mastery") {
    feedback +=
      "Almost there. Your answer is mostly correct, but it still needs stronger completeness or safer reasoning before advancement.";
  } else if (band === "partial") {
    feedback +=
      "Partial understanding. You have some correct ideas, but the answer is incomplete and would not be reliable in a real patient-care workflow.";
  } else {
    feedback +=
      "This answer is not sufficient yet. Rebuild it using the required concepts, patient-safety framing, and clearer dental terminology.";
  }

  return {
    score: Number(score.toFixed(2)),
    passed,
    band,
    dimensionScores: {
      factual: Number(factual.toFixed(2)),
      completeness: Number(completeness.toFixed(2)),
      safety: Number(safety.toFixed(2)),
      reasoning: Number(reasoning.toFixed(2)),
      terminology: Number(terminology.toFixed(2)),
    },
    missingConcepts,
    unsafeFlags,
    feedback,
  };
}

export function evaluateShortAnswer(args: {
  answer: string;
  expectedTraits: string[];
  safetyCritical?: boolean;
}): ShortAnswerEvaluation {
  const text = args.answer.toLowerCase().trim();
  const traitHits = args.expectedTraits.filter((trait) =>
    text.includes(trait.toLowerCase()),
  ).length;
  const completenessRatio =
    args.expectedTraits.length > 0 ? traitHits / args.expectedTraits.length : 0;
  const vague =
    text.length < 20 ||
    ["be careful", "use safety", "follow procedure", "do it right"].includes(text);
  const accuracy = vague ? 1 : traitHits >= 2 ? 4 : 2;
  const completeness = Math.round(completenessRatio * 5);
  const safetyAwareness =
    args.safetyCritical && !/safe|safety|contamination|exposure|protect/i.test(text)
      ? 1
      : 4;
  const reasoning = /because|so that|to prevent|therefore|which means/i.test(text)
    ? 4
    : 2;
  const terminology = /ppe|steril|disinfect|radiograph|contamination|barrier|scope/i.test(text)
    ? 4
    : 2;
  const score =
    accuracy * 0.3 +
    completeness * 0.25 +
    safetyAwareness * 0.2 +
    reasoning * 0.15 +
    terminology * 0.1;
  const missingElements = args.expectedTraits.filter(
    (trait) => !text.includes(trait.toLowerCase()),
  );
  const passed =
    !vague &&
    score >= 3.4 &&
    (!args.safetyCritical || safetyAwareness >= 3) &&
    completenessRatio >= 0.5;

  return {
    passed,
    score: Number(score.toFixed(2)),
    rubric: {
      accuracy,
      completeness,
      safetyAwareness,
      reasoning,
      terminology,
    },
    missingElements,
    feedback: passed
      ? "Your answer shows enough accuracy, reasoning, and safety awareness to advance."
      : "Your answer is not strong enough yet. It is missing key details, safety reasoning, or specific terminology needed for mastery.",
    retryHint:
      missingElements.length > 0
        ? `Revise your answer and include: ${missingElements.slice(0, 4).join(", ")}.`
        : "Be more specific. Explain what should be done, why it matters, and what safety risk is being prevented.",
  };
}
