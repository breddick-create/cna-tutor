// Feedback phrase rotation. Indices are stored in session_state_json so
// students hear variety across a session rather than the same phrasing each turn.

export const AFFIRMATIONS = [
  "That's exactly right — solid understanding.",
  "Perfect — you've got that down.",
  "Right on target.",
  "Correct — that's the safe CNA response.",
  "Well done — that's exactly what Texas HHSC expects.",
  "That's the answer — you're building real exam confidence.",
  "Good clinical thinking.",
  "Yes — that's the sequence.",
  "Spot on.",
  "That's it — you're thinking like a CNA.",
  "Exactly — safety first, then report.",
  "You've got the right instinct.",
  "That's the correct protocol.",
  "Yes — you remembered the sequence correctly.",
  "Right — and that matters on the clinical exam too.",
  "Correct — infection control handled properly.",
  "That's accurate — and it protects the resident.",
  "Good — you're applying the concept, not just recalling it.",
  "That's the textbook answer and the right instinct.",
  "Yes — that protects both you and your resident.",
  "Correct response — that's exactly what you'd chart.",
  "You've got the reasoning. That's what the exam tests.",
] as const;

export const CORRECTIONS = [
  "Not quite — let's work through it.",
  "Close, but there's a key step missing.",
  "That's not the safe CNA response. Let me clarify.",
  "Review this one with me — the answer is more specific.",
  "Not the right sequence here — let's back up.",
  "That would put the resident at risk. Here's the correct approach.",
  "Almost — but the exam expects something more precise.",
  "Let's slow down on this one.",
  "That's outside CNA scope. Here's what you'd actually do.",
  "The concept is right, but the sequence isn't.",
  "Good instinct, but missing a critical step.",
  "That's a common mistake — here's the distinction.",
  "Not quite — think about resident safety first.",
  "Let's look at this again. The wording matters here.",
  "That's close to a correct answer — but not exact enough for the exam.",
  "Remember: assess, report, then act.",
  "That would skip a step. Here's the full sequence.",
  "This is the kind of question where the order of steps matters.",
  "The reasoning is off — let's reset from the resident's perspective.",
  "Not the right answer for a Texas CNA exam question. Let me show you the distinction.",
  "That's a partial answer — there's one more thing the CNA needs to do.",
  "Close — but on the exam, that distinction is what separates a pass from a fail.",
] as const;

export function nextIndex(current: number, length: number): number {
  return (current + 1) % length;
}

export function selectAffirmation(index: number): string {
  return AFFIRMATIONS[index % AFFIRMATIONS.length];
}

export function selectCorrection(index: number): string {
  return CORRECTIONS[index % CORRECTIONS.length];
}
