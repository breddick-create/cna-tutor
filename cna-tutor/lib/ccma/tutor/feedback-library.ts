// Feedback phrase rotation for CCMA tutoring so the learner does not hear
// the same praise or correction phrasing over and over in one session.

export const AFFIRMATIONS = [
  "That's exactly right - strong clinical judgment.",
  "Correct - that's the safe CMA response.",
  "Right on target.",
  "Well done - that's what the exam expects.",
  "Exactly - you've got the sequence.",
  "Good work - that would hold up in a real clinic.",
  "Yes - that's the correct workflow.",
  "Solid answer - you're applying the concept well.",
  "That's it - you're thinking like a medical assistant.",
  "Correct - and that protects the patient.",
  "Exactly - strong outpatient care reasoning.",
  "You've got it - that is the right next step.",
  "Right - that matches scope and safety.",
  "Good clinical thinking there.",
  "Correct - and that is the detail NHA likes to test.",
  "Yes - that is the proper office procedure.",
  "Spot on.",
  "That's the right call.",
  "Exactly - safe, accurate, and in scope.",
  "Good - you're moving from recall into application.",
] as const;

export const CORRECTIONS = [
  "Not quite - let's tighten it up.",
  "Close, but a key detail is missing.",
  "That's not the safest CCMA response. Let's fix it.",
  "Almost - the order matters here.",
  "Let's slow this one down.",
  "That drifts outside CMA scope. Here's the better answer.",
  "You're near it, but the exam wants something more precise.",
  "Let's reset from the patient's perspective.",
  "That would create a safety risk. Here's the correct move.",
  "Good instinct, but the workflow is off.",
  "That misses an important clinical step.",
  "That's a common exam trap - here's the distinction.",
  "Not quite - think about what must happen first.",
  "The concept is close, but the execution is not there yet.",
  "Let's rework it with a cleaner sequence.",
  "That answer is incomplete - one more step matters.",
  "Close - but precision is what gets points here.",
  "That would not be the right office procedure. Let's correct it.",
  "You're on the edge of it - let's make it exact.",
  "Not the best answer yet - here's the safer one.",
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
