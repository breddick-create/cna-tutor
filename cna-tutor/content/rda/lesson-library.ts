import { rdaDomainById, type RdaDomainId } from "@/content/rda/domains";
import type { LessonQuestionType, LessonSegment, TutorLesson } from "@/lib/rda/tutor/types";

export type RdaLessonStep = {
  id: string;
  type:
    | "concept"
    | "recall"
    | "application"
    | "scenario"
    | "misconception"
    | "exam_reasoning"
    | "safety"
    | "workflow"
    | "exam_style"
    | "mastery";
  prompt: string;
  expectedTraits: string[];
  evaluatorNotes: string;
  retryHint: string;
};

export type RdaLesson = {
  id: string;
  domainId: string;
  title: string;
  objective: string;
  whyItMatters: string;
  masteryThreshold: number;
  remediationHints: string[];
  steps: RdaLessonStep[];
  summaryCheckpoint: string;
};

type InternalMasteryStep = {
  prompt: string;
  expectedAnswerTraits: string[];
  evaluatorNotes: string[];
  retryHint: string;
};

type LessonBlueprint = Omit<RdaLesson, "steps" | "masteryThreshold"> & {
  domainId: RdaDomainId;
  workplaceScenario: string;
  keyActions: string[];
  safetyPrinciple: string;
  sequence: string[];
  terms: string[];
  scopeBoundary: string;
  misconception: string;
  examSignal: string;
};

export const rdaLessonStandardPrecautions: RdaLesson = {
  id: "infection-standard-precautions",
  domainId: "infection_control_safety",
  title: "Standard Precautions and PPE",
  objective:
    "Help the student explain when and why standard precautions and PPE are used in dental settings.",
  whyItMatters:
    "Incorrect PPE use or weak infection-control judgment can expose patients and staff to preventable harm and is a core exam and workplace safety concept.",
  masteryThreshold: 0.85,
  remediationHints: [
    "Focus on the purpose of each PPE item, not just memorizing names.",
    "Think in terms of barrier protection, contamination prevention, and safe sequence.",
    "Connect each answer to patient and staff safety.",
  ],
  steps: [
    {
      id: "step-1",
      type: "concept",
      prompt:
        "Explain what standard precautions mean in a dental setting and why they are used for every patient.",
      expectedTraits: [
        "treat all patients as potentially infectious",
        "prevent transmission",
        "protect patient and staff",
        "applies routinely",
      ],
      evaluatorNotes:
        "Student should show universal application and infection-prevention logic, not define it vaguely as just being careful.",
      retryHint:
        "State who is protected, what is being prevented, and why it applies to all patients.",
    },
    {
      id: "step-2",
      type: "recall",
      prompt:
        "Name three common PPE items used during dental care and state one purpose for each.",
      expectedTraits: [
        "gloves barrier for hands",
        "mask reduces droplet exposure",
        "eyewear or face shield protects eyes",
        "gown protects clothing/skin",
      ],
      evaluatorNotes:
        "Student should connect each item to a protection function.",
      retryHint:
        "Do not just list items. Pair each one with the hazard it helps reduce.",
    },
    {
      id: "step-3",
      type: "application",
      prompt:
        "A patient arrives for a routine restorative procedure. What PPE would you expect the assistant to use and why?",
      expectedTraits: [
        "gloves",
        "mask",
        "protective eyewear or face shield",
        "protective clothing if splash risk",
        "match PPE to exposure risk",
      ],
      evaluatorNotes:
        "Student should apply PPE to a common procedure rather than reciting a memorized list only.",
      retryHint:
        "Think about splash, droplets, aerosols, and hand contact during routine treatment.",
    },
    {
      id: "step-4",
      type: "scenario",
      prompt:
        "During cleanup, an assistant touches a contaminated instrument tray and then reaches for a drawer handle with the same gloves. What is the problem here?",
      expectedTraits: [
        "cross-contamination",
        "contaminated gloves touching clean surface",
        "drawer handle becomes contaminated",
      ],
      evaluatorNotes:
        "Student must identify the contamination pathway clearly.",
      retryHint:
        "Explain what moved from dirty area to clean area and why that matters.",
    },
    {
      id: "step-5",
      type: "misconception",
      prompt:
        "A coworker says gloves alone are enough protection for most procedures. Correct this statement.",
      expectedTraits: [
        "gloves are not enough alone",
        "other PPE depends on exposure risk",
        "mask and eye protection often needed",
      ],
      evaluatorNotes:
        "Student must reject the oversimplification and explain multi-barrier protection.",
      retryHint:
        "Think beyond hand protection. What other body areas or exposure routes need protection?",
    },
    {
      id: "step-6",
      type: "exam_reasoning",
      prompt:
        "Why is it unsafe to think of PPE as only protecting the worker and not the patient?",
      expectedTraits: [
        "two-way protection",
        "prevents spread from staff to patient and patient to staff",
        "infection control is bidirectional",
      ],
      evaluatorNotes:
        "Student should explain bidirectional protection rather than one-sided risk.",
      retryHint:
        "Describe how contamination can move in either direction during care.",
    },
    {
      id: "step-7",
      type: "safety",
      prompt:
        "What safety risk increases when eye protection is skipped during a procedure that may create splash or debris?",
      expectedTraits: [
        "eye exposure",
        "splash injury",
        "contaminant contact with mucous membranes",
      ],
      evaluatorNotes:
        "Student should explicitly mention eye and mucous membrane exposure.",
      retryHint:
        "Name the body area at risk and the type of exposure.",
    },
    {
      id: "step-8",
      type: "workflow",
      prompt:
        "At what point in the workflow should PPE decisions be made: before seating the patient, after treatment starts, or during cleanup? Explain.",
      expectedTraits: [
        "before care begins",
        "based on expected procedure and exposure risk",
        "not delayed until contamination already exists",
      ],
      evaluatorNotes:
        "Student should connect planning to prevention.",
      retryHint:
        "Think about when prevention is most effective.",
    },
    {
      id: "step-9",
      type: "exam_style",
      prompt:
        "Which is the best reason standard precautions are applied to every patient? Answer in one or two sentences.",
      expectedTraits: [
        "unknown infection status",
        "consistent prevention",
        "protect everyone",
      ],
      evaluatorNotes:
        "Accept concise, accurate explanation only.",
      retryHint:
        "Use the ideas of routine use, unknown risk, and prevention.",
    },
    {
      id: "step-10",
      type: "mastery",
      prompt:
        "In your own words, summarize how standard precautions and PPE reduce risk during everyday dental care.",
      expectedTraits: [
        "routine use",
        "barrier protection",
        "cross-contamination prevention",
        "staff and patient safety",
      ],
      evaluatorNotes:
        "Student should synthesize key points clearly and safely.",
      retryHint:
        "Pull together the ideas of routine use, barriers, contamination control, and two-way protection.",
    },
  ],
  summaryCheckpoint:
    "Student can explain standard precautions as routine protection used for every patient, select appropriate PPE for common procedures, identify cross-contamination errors, and connect PPE use to patient and staff safety.",
};

const stepKinds: Array<{
  type: RdaLessonStep["type"];
  title: string;
  questionType: LessonQuestionType;
  difficulty: 1 | 2 | 3;
}> = [
  { type: "concept", title: "Concept teaching", questionType: "concept_teaching", difficulty: 1 },
  { type: "recall", title: "Recall check", questionType: "recall", difficulty: 1 },
  { type: "application", title: "Application", questionType: "application", difficulty: 2 },
  { type: "scenario", title: "Scenario judgment", questionType: "scenario", difficulty: 2 },
  { type: "misconception", title: "Misconception correction", questionType: "misconception", difficulty: 2 },
  { type: "safety", title: "Safety reasoning", questionType: "safety_reasoning", difficulty: 3 },
  { type: "workflow", title: "Workflow reasoning", questionType: "workflow_reasoning", difficulty: 3 },
  { type: "exam_style", title: "Exam-style challenge", questionType: "exam_challenge", difficulty: 3 },
  { type: "exam_reasoning", title: "Remediation if weak", questionType: "remediation", difficulty: 2 },
  { type: "mastery", title: "Final mastery checkpoint", questionType: "mastery_checkpoint", difficulty: 3 },
];

function buildInternalMasterySteps(lesson: LessonBlueprint): InternalMasteryStep[] {
  const actionList = lesson.keyActions.join(", ");
  const sequenceList = lesson.sequence.join(" -> ");
  const termList = lesson.terms.join(", ");

  return [
    {
      prompt: `Teach back the core responsibility in "${lesson.title}" using this workplace situation: ${lesson.workplaceScenario}`,
      expectedAnswerTraits: [
        `Names the assistant action: ${actionList}.`,
        `Connects the action to ${lesson.safetyPrinciple}.`,
        "Avoids making a diagnosis, treatment decision, or independent legal conclusion.",
      ],
      evaluatorNotes: [
        "Require a concrete chairside or administrative action, not a slogan.",
        "Block advancement if the answer omits safety or scope awareness.",
      ],
      retryHint: `Start with the action first: ${lesson.keyActions[0]}. Then explain why it protects the patient or keeps the RDA in role.`,
    },
    {
      prompt: `List three high-yield terms for this lesson and state what each one changes in the assistant's next move: ${termList}.`,
      expectedAnswerTraits: [
        "Uses at least three accurate dental terms from the lesson.",
        "Defines each term through an RDA-safe action or observation.",
        "Does not use a term as a substitute for reasoning.",
      ],
      evaluatorNotes: [
        "Accept plain language if the clinical meaning is precise.",
        "Do not pass answers that only repeat words without explaining their use.",
      ],
      retryHint: `Use this pattern: term, meaning, next assistant action. Good terms here include ${termList}.`,
    },
    {
      prompt: `Apply the lesson to this scenario: ${lesson.workplaceScenario} What should the RDA do before the procedure continues?`,
      expectedAnswerTraits: [
        `Chooses an action from the safe sequence: ${sequenceList}.`,
        "Explains why the action comes before the next clinical step.",
        "Keeps the dentist or hygienist role separate when escalation is needed.",
      ],
      evaluatorNotes: [
        "Look for correct sequence, not just correct vocabulary.",
        "If the answer rushes to continue care before safety is addressed, mark it incomplete.",
      ],
      retryHint: `Put the steps in order before answering. The safe sequence is ${sequenceList}.`,
    },
    {
      prompt: `A student says, "I know the general idea, so I can move on." Use this lesson to explain why readiness needs demonstrated mastery.`,
      expectedAnswerTraits: [
        "States that lesson completion alone is not mastery.",
        "Identifies the weak point that could affect patient safety or exam performance.",
        "Names the evidence needed before moving forward, such as a correct short answer or quiz score.",
      ],
      evaluatorNotes: [
        "The answer must defend blocking advancement until mastery.",
        "Give no credit for confidence-only responses.",
      ],
      retryHint: "Explain what could go wrong if the assistant guesses, then name the proof needed before advancement.",
    },
    {
      prompt: `Correct this misconception: ${lesson.misconception}`,
      expectedAnswerTraits: [
        "Directly rejects the misconception.",
        `Replaces it with the safer rule: ${lesson.safetyPrinciple}.`,
        `Uses at least one lesson term: ${lesson.terms.slice(0, 3).join(", ")}.`,
      ],
      evaluatorNotes: [
        "Do not pass answers that merely say the misconception is wrong.",
        "Require the corrected rule and the practical implication.",
      ],
      retryHint: `Say what is wrong, then say the safer replacement rule. Anchor it in ${lesson.safetyPrinciple}.`,
    },
    {
      prompt: `Explain the patient-safety reason for this lesson without using vague phrases like "be careful" or "do it right."`,
      expectedAnswerTraits: [
        `Names the specific safety principle: ${lesson.safetyPrinciple}.`,
        "Identifies the risk being reduced.",
        "States the RDA action that reduces the risk.",
      ],
      evaluatorNotes: [
        "Patient-safety reasoning must be specific and causal.",
        "Block answers that are only motivational or generic.",
      ],
      retryHint: "Use cause and effect: this action reduces this risk because this part of the workflow depends on it.",
    },
    {
      prompt: `Put the workflow in order and explain the handoff point: ${sequenceList}.`,
      expectedAnswerTraits: [
        "Orders the steps correctly.",
        "Explains what must be completed before the next step begins.",
        `Mentions the scope boundary: ${lesson.scopeBoundary}.`,
      ],
      evaluatorNotes: [
        "Workflow answers must show order and escalation point.",
        "Do not pass if the answer places documentation, disinfection, exposure response, or dentist notification after an unsafe delay.",
      ],
      retryHint: `Read the arrows as a safety chain: ${sequenceList}. Identify where the RDA stops and escalates.`,
    },
    {
      prompt: `Exam-style challenge: ${lesson.examSignal} What answer should you choose and what tempting answer should you avoid?`,
      expectedAnswerTraits: [
        "Chooses the safety-first or scope-aware answer.",
        "Names the tempting but unsafe shortcut.",
        "Explains why the exam is testing sequence, scope, or safety.",
      ],
      evaluatorNotes: [
        "Strong answers identify both the best answer and the distractor logic.",
        "Do not pass if the student chooses a dentist-level decision or skips a required safety step.",
      ],
      retryHint: "Find the answer that protects the patient first and keeps the RDA within assigned duties.",
    },
    {
      prompt: "If you missed this item on a quiz, write a two-step remediation plan before trying another question.",
      expectedAnswerTraits: [
        `Reviews the lesson anchor: ${lesson.safetyPrinciple}.`,
        `Practices the sequence: ${sequenceList}.`,
        "Uses a short-answer retry before another multiple-choice attempt.",
      ],
      evaluatorNotes: [
        "Remediation must be active and targeted to the weak point.",
        "Do not pass plans that say only 'study more' or 'review notes.'",
      ],
      retryHint: `Name one weak concept and one practice action. Example: rehearse ${lesson.sequence[0]} before answering another scenario.`,
    },
    {
      prompt: `Final checkpoint: summarize "${lesson.title}" as an RDA action, a safety reason, a sequence rule, and a scope boundary.`,
      expectedAnswerTraits: [
        `Includes key action: ${lesson.keyActions[0]}.`,
        `Includes safety reason: ${lesson.safetyPrinciple}.`,
        `Includes sequence rule: ${sequenceList}.`,
        `Includes scope boundary: ${lesson.scopeBoundary}.`,
      ],
      evaluatorNotes: [
        "Require all four parts for mastery.",
        "This is the advancement gate; near mastery should still trigger retry.",
      ],
      retryHint: "Answer in four clauses: action, safety reason, order, scope boundary.",
    },
  ];
}

const lessonBlueprints: LessonBlueprint[] = [
  {
    id: "rda-infection-control-standard-precautions",
    domainId: "infection_control_safety",
    title: "Standard Precautions for Every Patient",
    objective: "Apply standard precautions before, during, and after routine dental care.",
    whyItMatters:
      "The exam expects the assistant to treat blood, saliva, aerosols, and contaminated surfaces as possible exposure risks even when a patient appears healthy.",
    workplaceScenario:
      "The operatory is being turned over after a prophylaxis appointment with visible saliva on the bracket table and air-water syringe area.",
    keyActions: ["perform hand hygiene", "wear appropriate PPE", "clean before disinfecting", "replace barriers"],
    safetyPrinciple:
      "standard precautions reduce cross-contamination between patients and staff",
    sequence: ["remove contaminated disposables", "clean visible debris", "apply approved disinfectant for contact time", "replace barriers", "set out sterile items"],
    terms: ["standard precautions", "PPE", "clinical contact surface", "contact time"],
    scopeBoundary:
      "The RDA follows the office infection-control protocol and escalates exposure or policy uncertainty to the supervising dentist or designated safety lead.",
    misconception:
      "If a patient does not report illness, routine gloves are enough and surface disinfection can be shortened.",
    examSignal:
      "A question describes a healthy-looking patient but contaminated surfaces after aerosol-producing care.",
    remediationHints: [
      "Rebuild the room-turnover sequence out loud before answering.",
      "Separate cleaning from disinfecting; they are not the same step.",
      "Tie PPE choice to the anticipated exposure, not to the patient's appearance.",
    ],
    summaryCheckpoint:
      "Explain how standard precautions, surface turnover, and PPE work together to prevent cross-contamination.",
  },
  {
    id: "rda-infection-control-instrument-processing",
    domainId: "infection_control_safety",
    title: "Instrument Processing From Contaminated to Sterile",
    objective: "Place contaminated instruments into the correct processing sequence without breaking the sterile chain.",
    whyItMatters:
      "Instrument processing questions test whether the assistant understands sequence: transport, clean, package, sterilize, store, and open for patient care.",
    workplaceScenario:
      "A cassette from an extraction setup returns to sterilization with blood and debris on forceps and mirrors.",
    keyActions: ["transport instruments safely", "clean before packaging", "verify sterilization indicators", "store sterile packs intact"],
    safetyPrinciple:
      "sterilization is reliable only when instruments are cleaned, packaged, processed, and stored in the correct order",
    sequence: ["transport covered cassette", "clean instruments", "dry and inspect", "package with indicators", "sterilize", "store intact packs"],
    terms: ["contaminated", "ultrasonic cleaner", "sterilization indicator", "sterile storage"],
    scopeBoundary:
      "The RDA processes instruments according to training and office protocol and reports failed indicators or damaged packs instead of using them.",
    misconception:
      "A sterilizer cycle can make up for instruments that were packaged while still visibly dirty.",
    examSignal:
      "A sterile pack is torn or an indicator does not show the expected result before a procedure.",
    remediationHints: [
      "Memorize the processing order as a chain; one broken link makes the pack unreliable.",
      "Practice explaining why cleaning comes before sterilization.",
      "Treat failed indicators and damaged packaging as stop-and-report events.",
    ],
    summaryCheckpoint:
      "Describe the full instrument processing chain and what the RDA does when sterility is uncertain.",
  },
  {
    id: "rda-infection-control-sharps-exposure",
    domainId: "infection_control_safety",
    title: "Sharps Safety and Exposure Response",
    objective: "Respond to sharps hazards and exposure incidents with immediate, reportable safety steps.",
    whyItMatters:
      "RDA exam scenarios often hide the key issue in cleanup or recapping choices. The safest answer stops the exposure risk first.",
    workplaceScenario:
      "During cleanup, an assistant feels a puncture through a glove while handling an anesthetic syringe tray.",
    keyActions: ["stop the task", "wash the area", "report immediately", "follow the exposure-control plan"],
    safetyPrinciple:
      "possible bloodborne exposure requires immediate first aid, reporting, and documented follow-up",
    sequence: ["stop handling sharps", "wash or flush the exposed area", "notify the responsible supervisor", "follow exposure protocol", "document as required"],
    terms: ["sharps", "exposure incident", "bloodborne pathogen", "engineering control"],
    scopeBoundary:
      "The RDA does not decide whether follow-up is unnecessary; the office exposure-control process determines next steps.",
    misconception:
      "A small puncture can wait until the room is fully cleaned because the patient is still present.",
    examSignal:
      "A question asks what to do first after a puncture or splash exposure.",
    remediationHints: [
      "Answer exposure questions with immediate first aid before paperwork.",
      "Do not minimize exposure based on wound size.",
      "Use the phrase stop, wash or flush, report, follow protocol.",
    ],
    summaryCheckpoint:
      "State the first response to a sharps exposure and explain why delay is unsafe.",
  },
  {
    id: "rda-infection-control-chemical-safety",
    domainId: "infection_control_safety",
    title: "Chemical Safety, Labels, and SDS Use",
    objective: "Handle disinfectants and dental materials using label directions, PPE, ventilation, and SDS access.",
    whyItMatters:
      "Workplace-safe assistants do not guess with chemicals. They read labels, respect contact time, and know where hazard guidance lives.",
    workplaceScenario:
      "A disinfectant bottle has been refilled, but the label is smeared and the assistant is unsure of the contact time.",
    keyActions: ["do not use unclear chemicals", "verify label directions", "use PPE", "check SDS when needed"],
    safetyPrinciple:
      "chemical safety depends on correct identification, exposure protection, and manufacturer directions",
    sequence: ["pause use", "verify product identity", "confirm dilution and contact time", "wear required PPE", "store correctly"],
    terms: ["SDS", "contact time", "hazard label", "disinfectant"],
    scopeBoundary:
      "The RDA follows product instructions and office safety policy; uncertain chemical use is escalated rather than improvised.",
    misconception:
      "If the disinfectant smells strong, it is safe to use even without a readable label.",
    examSignal:
      "A question describes an unlabeled or questionable chemical container in the operatory.",
    remediationHints: [
      "Link every chemical answer to label, SDS, PPE, and contact time.",
      "Never use odor or color as proof of correct product.",
      "Treat unknown chemical identity as a pause-and-verify scenario.",
    ],
    summaryCheckpoint:
      "Explain how the RDA verifies safe chemical use before disinfecting or handling materials.",
  },
  {
    id: "rda-chairside-four-handed-transfer",
    domainId: "chairside_assisting",
    title: "Four-Handed Dentistry and Instrument Transfer",
    objective: "Transfer instruments safely while maintaining visibility, control, and patient protection.",
    whyItMatters:
      "Instrument-transfer questions test whether the assistant can support efficiency without creating dropped-instrument, puncture, or field-control risks.",
    workplaceScenario:
      "The dentist is working on a mandibular molar and requests an explorer followed by a spoon excavator while the patient moves their tongue.",
    keyActions: ["stabilize the transfer", "orient the working end", "protect soft tissue", "maintain suction and retraction"],
    safetyPrinciple:
      "controlled transfer prevents injury and keeps the operator's attention on the treatment field",
    sequence: ["anticipate request", "grasp instrument correctly", "signal transfer", "deliver handle to operator", "retrieve used instrument safely"],
    terms: ["transfer zone", "working end", "operator zone", "assistant zone"],
    scopeBoundary:
      "The RDA assists and observes; the dentist directs treatment decisions and operative use of instruments.",
    misconception:
      "A fast pass is always a good pass.",
    examSignal:
      "A scenario describes instrument exchange while suction, retraction, or patient movement is also occurring.",
    remediationHints: [
      "Slow the answer down to transfer zone, orientation, and retrieval.",
      "Mention soft-tissue protection when the tongue or cheek is in the field.",
      "Do not ignore suction just because the question names instruments.",
    ],
    summaryCheckpoint:
      "Describe a safe instrument transfer that supports four-handed dentistry without sacrificing field control.",
  },
  {
    id: "rda-chairside-moisture-control",
    domainId: "chairside_assisting",
    title: "Moisture Control, Isolation, and Evacuation",
    objective: "Use evacuation, isolation, and retraction to protect the airway and preserve procedure quality.",
    whyItMatters:
      "Moisture-control items are safety items. A flooded field can affect visibility, restorative success, and aspiration risk.",
    workplaceScenario:
      "During a composite restoration, saliva pools near the preparation and the cotton roll is saturated.",
    keyActions: ["increase high-volume evacuation", "replace saturated isolation", "retract soft tissue", "alert dentist if isolation is lost"],
    safetyPrinciple:
      "dry-field control protects visibility, material performance, and aspiration safety",
    sequence: ["recognize field contamination", "evacuate fluid", "replace isolation", "confirm visibility", "continue only when field is controlled"],
    terms: ["HVE", "saliva ejector", "isolation", "retraction"],
    scopeBoundary:
      "The RDA supports field control and alerts the dentist; the dentist decides whether restoration steps must be repeated.",
    misconception:
      "The patient can swallow around the handpiece if suction falls behind.",
    examSignal:
      "A question asks what to do when a restorative field becomes wet or visibility is lost.",
    remediationHints: [
      "Make evacuation and isolation the first corrective move.",
      "Connect moisture control to material success, not convenience.",
      "Do not choose an answer that continues the procedure through contamination.",
    ],
    summaryCheckpoint:
      "Explain the sequence for correcting a wet field during restorative care.",
  },
  {
    id: "rda-chairside-matrix-wedge",
    domainId: "chairside_assisting",
    title: "Matrix Bands, Wedges, and Class II Support",
    objective: "Recognize why matrix systems and wedges are prepared for proximal restorations.",
    whyItMatters:
      "The exam may test whether the assistant knows the purpose of a matrix and wedge without implying independent placement beyond assigned duties.",
    workplaceScenario:
      "A dentist prepares a Class II restoration and asks the assistant to have the matrix retainer, band, wedge, and burnisher ready.",
    keyActions: ["prepare matrix components", "anticipate wedge support", "maintain dry field", "pass items in procedure order"],
    safetyPrinciple:
      "proximal restoration support helps restore contour while reducing gingival trauma and material overhang risk",
    sequence: ["confirm Class II setup", "prepare matrix band and retainer", "prepare wedge", "support isolation", "pass finishing instruments when requested"],
    terms: ["matrix band", "wedge", "proximal surface", "contour"],
    scopeBoundary:
      "The RDA prepares and assists according to delegated duties; the dentist remains responsible for preparation and final restoration decisions.",
    misconception:
      "A matrix band is only a convenience item and does not affect restoration quality.",
    examSignal:
      "A question describes a proximal surface restoration and asks which item supports contour or separation.",
    remediationHints: [
      "Connect matrix to missing wall and wedge to adaptation/separation.",
      "Mention dry field because composite and cement handling depend on isolation.",
      "Avoid wording that suggests diagnosing or planning the restoration.",
    ],
    summaryCheckpoint:
      "Explain why matrix and wedge readiness matters during a Class II restoration.",
  },
  {
    id: "rda-chairside-tray-setup",
    domainId: "chairside_assisting",
    title: "Procedure Tray Setup and Patient Positioning",
    objective: "Set up procedure-specific trays and support safe positioning before treatment begins.",
    whyItMatters:
      "A readiness-first assistant prevents delays and safety breaks by preparing the correct instruments, barriers, and patient position before the dentist starts.",
    workplaceScenario:
      "A patient is seated for a sealant appointment, but the tray includes extraction instruments and no isolation materials.",
    keyActions: ["match tray to procedure", "verify isolation supplies", "position patient safely", "correct setup before treatment"],
    safetyPrinciple:
      "correct setup reduces wrong-procedure confusion, delays, contamination, and patient discomfort",
    sequence: ["review scheduled procedure", "select correct tray", "add isolation and PPE supplies", "position patient", "confirm readiness before provider entry"],
    terms: ["tray setup", "procedure sequence", "patient positioning", "barrier"],
    scopeBoundary:
      "The RDA prepares the environment and flags mismatches; the dentist confirms treatment plan and clinical decisions.",
    misconception:
      "Any clean tray is acceptable if the dentist can ask for missing items later.",
    examSignal:
      "A scenario describes a tray mismatch or missing isolation item before treatment.",
    remediationHints: [
      "Compare the scheduled procedure to the instruments present.",
      "Correct setup before treatment starts rather than improvising mid-procedure.",
      "Frame positioning around safety, airway comfort, and access.",
    ],
    summaryCheckpoint:
      "Describe the pre-procedure setup check that prevents wrong tray and missing-supply problems.",
  },
  {
    id: "rda-radiography-alara",
    domainId: "dental_radiography",
    title: "Radiation Safety and ALARA",
    objective: "Apply ALARA, patient protection, and exposure justification during dental imaging.",
    whyItMatters:
      "Radiography readiness is not just image taking. The assistant must reduce unnecessary exposure and follow dentist-directed imaging protocols.",
    workplaceScenario:
      "A patient asks why another image is needed after a previous image was nondiagnostic.",
    keyActions: ["confirm image need", "use protection as appropriate", "position accurately", "avoid unnecessary retakes"],
    safetyPrinciple:
      "ALARA means exposures should be justified, optimized, and limited to diagnostic need",
    sequence: ["confirm prescribed image", "prepare receptor and protection", "position correctly", "stand behind barrier", "evaluate before retake"],
    terms: ["ALARA", "thyroid collar", "lead apron", "retake"],
    scopeBoundary:
      "The RDA follows radiography authorization and office protocol; diagnostic interpretation and prescribing images remain dentist responsibilities.",
    misconception:
      "A quick retake is harmless if it might make the image look better.",
    examSignal:
      "A question asks whether to retake an image before deciding whether it is diagnostically necessary.",
    remediationHints: [
      "Use ALARA whenever a scenario mentions retake or exposure.",
      "Separate image acquisition from diagnosis.",
      "Tie patient explanation to safety and dentist-directed need.",
    ],
    summaryCheckpoint:
      "Explain how ALARA changes the RDA's behavior before and after exposing an image.",
  },
  {
    id: "rda-radiography-positioning-errors",
    domainId: "dental_radiography",
    title: "Positioning Errors and Retake Logic",
    objective: "Identify common radiographic errors and choose the correction that matches the cause.",
    whyItMatters:
      "Exam questions often describe the image error and expect the assistant to correct placement or angulation, not exposure settings.",
    workplaceScenario:
      "A bitewing shows overlapped contacts, and another periapical image shows a cone cut.",
    keyActions: ["identify the error", "match correction to cause", "reposition before retake", "avoid exposure-setting guesses"],
    safetyPrinciple:
      "retakes should be limited by correcting the actual positioning problem before exposing again",
    sequence: ["evaluate image error", "identify cause", "adjust receptor or PID", "retake only if needed", "document according to protocol"],
    terms: ["overlap", "cone cut", "horizontal angulation", "vertical angulation"],
    scopeBoundary:
      "The RDA corrects technique within training and protocol; the dentist determines diagnostic acceptability when needed.",
    misconception:
      "Increasing exposure fixes overlap and cone cuts.",
    examSignal:
      "A question names overlap, elongation, foreshortening, missing apices, or cone cut.",
    remediationHints: [
      "Memorize error to cause: overlap equals horizontal angulation; cone cut equals PID alignment.",
      "Do not use darker/lighter image logic for placement errors.",
      "Say why the correction reduces additional retakes.",
    ],
    summaryCheckpoint:
      "Match at least three radiographic errors to their likely correction.",
  },
  {
    id: "rda-radiography-receptor-placement",
    domainId: "dental_radiography",
    title: "Receptor Placement and Patient Instructions",
    objective: "Place receptors and coach patients in ways that reduce gagging, movement, and nondiagnostic images.",
    whyItMatters:
      "Patient communication affects image quality and safety. Calm, accurate instructions can reduce movement and retakes.",
    workplaceScenario:
      "A patient gags during a maxillary molar periapical image and pulls away before exposure.",
    keyActions: ["explain the image briefly", "place receptor gently", "coach breathing", "reposition if movement occurs"],
    safetyPrinciple:
      "clear instructions and correct placement reduce patient distress and unnecessary retakes",
    sequence: ["explain what the patient will feel", "place receptor correctly", "coach slow nasal breathing", "align PID", "expose when still"],
    terms: ["receptor", "periapical", "bitewing", "PID"],
    scopeBoundary:
      "The RDA gives procedural instructions and escalates pain, refusal, or unusual concerns to the dentist.",
    misconception:
      "If a patient gags, the assistant should hurry and expose before the patient can object.",
    examSignal:
      "A question describes gagging, movement, or a patient who cannot tolerate receptor placement.",
    remediationHints: [
      "Use patient communication as part of technique, not a separate courtesy.",
      "Do not choose hurried exposure when the patient is moving.",
      "Connect calm instruction to fewer retakes.",
    ],
    summaryCheckpoint:
      "Give a patient-safe script for receptor placement that reduces movement and retakes.",
  },
  {
    id: "rda-radiography-image-quality",
    domainId: "dental_radiography",
    title: "Image Quality Checks Before Moving On",
    objective: "Evaluate whether an image likely needs correction before the patient is dismissed or the next image begins.",
    whyItMatters:
      "Readiness depends on recognizing nondiagnostic images early while avoiding unnecessary retakes.",
    workplaceScenario:
      "A premolar image cuts off the apices and the patient is already sitting upright.",
    keyActions: ["review image quality", "identify missing anatomy", "ask for dentist guidance when needed", "retake only when justified"],
    safetyPrinciple:
      "image quality decisions balance diagnostic need with minimizing radiation exposure",
    sequence: ["inspect required anatomy", "identify error", "determine if diagnostic value is affected", "consult protocol or dentist", "retake only if needed"],
    terms: ["diagnostic quality", "apex", "contrast", "density"],
    scopeBoundary:
      "The RDA can identify technical quality concerns but does not diagnose pathology from the image.",
    misconception:
      "Any imperfect image must automatically be retaken.",
    examSignal:
      "A question asks whether the assistant should retake an image with missing anatomy or minor imperfection.",
    remediationHints: [
      "Ask what anatomy the image was meant to show.",
      "Differentiate technical quality from diagnosis.",
      "Use ALARA when deciding whether a retake is justified.",
    ],
    summaryCheckpoint:
      "Explain how the RDA checks image quality without overstepping into diagnosis.",
  },
  {
    id: "rda-anatomy-numbering-surfaces",
    domainId: "dental_anatomy_terminology",
    title: "Tooth Numbering and Surface Language",
    objective: "Use tooth numbers and surfaces accurately in charting and chairside communication.",
    whyItMatters:
      "Wrong tooth or wrong surface language can create serious treatment errors. The exam expects precise terminology.",
    workplaceScenario:
      "The dentist requests material for #30 MO and later asks the assistant to chart #8 facial staining.",
    keyActions: ["identify tooth number", "name the surface", "repeat back when uncertain", "chart exactly as directed"],
    safetyPrinciple:
      "accurate tooth and surface language helps prevent wrong-site and wrong-surface errors",
    sequence: ["hear tooth number", "identify arch and quadrant", "identify surface", "confirm if unclear", "chart according to protocol"],
    terms: ["mesial", "distal", "occlusal", "facial"],
    scopeBoundary:
      "The RDA records and communicates directed information; diagnosis and treatment planning remain dentist responsibilities.",
    misconception:
      "Mesial and distal mean left and right.",
    examSignal:
      "A question uses abbreviations such as MO, DO, MOD, facial, buccal, lingual, or occlusal.",
    remediationHints: [
      "Translate every abbreviation before answering.",
      "Tie surfaces to the tooth's position, not your left or right.",
      "Repeat back uncertain directions instead of guessing.",
    ],
    summaryCheckpoint:
      "Decode a tooth number and two-surface abbreviation into safe charting language.",
  },
  {
    id: "rda-anatomy-dentitions-eruption",
    domainId: "dental_anatomy_terminology",
    title: "Primary, Mixed, and Permanent Dentitions",
    objective: "Distinguish dentition stages and eruption language used in dental assisting scenarios.",
    whyItMatters:
      "Pediatric and mixed-dentition questions test whether the assistant understands numbering, eruption, and age-appropriate communication.",
    workplaceScenario:
      "A child presents with both primary molars and newly erupted permanent first molars.",
    keyActions: ["recognize mixed dentition", "use correct tooth identification", "avoid alarming language", "document directed findings"],
    safetyPrinciple:
      "correct dentition language supports accurate records and age-appropriate patient communication",
    sequence: ["identify dentition stage", "recognize tooth type", "use correct notation", "confirm unclear charting", "communicate calmly"],
    terms: ["primary dentition", "mixed dentition", "permanent dentition", "eruption"],
    scopeBoundary:
      "The RDA supports charting and education within role; eruption concerns or diagnoses are escalated to the dentist.",
    misconception:
      "All molars in a child are primary teeth until the teenage years.",
    examSignal:
      "A question describes a child with both baby teeth and adult teeth present.",
    remediationHints: [
      "Use dentition stage first, then tooth identification.",
      "Do not diagnose delayed eruption.",
      "Practice explaining mixed dentition in plain, calm language.",
    ],
    summaryCheckpoint:
      "Explain mixed dentition and how it changes tooth identification.",
  },
  {
    id: "rda-anatomy-charting-basics",
    domainId: "dental_anatomy_terminology",
    title: "Dental Charting Basics and Common Abbreviations",
    objective: "Recognize common charting entries and document directed information accurately.",
    whyItMatters:
      "Charting accuracy supports continuity of care, legal record integrity, and safe team communication.",
    workplaceScenario:
      "The dentist calls out existing restoration, missing tooth, and planned treatment entries during an exam.",
    keyActions: ["listen carefully", "record directed entries", "clarify uncertain abbreviations", "avoid adding personal diagnosis"],
    safetyPrinciple:
      "accurate charting prevents communication errors and protects the integrity of the patient record",
    sequence: ["listen to provider", "enter exact tooth and surface", "mark condition or treatment as directed", "clarify uncertainty", "save according to protocol"],
    terms: ["existing restoration", "missing tooth", "planned treatment", "chart note"],
    scopeBoundary:
      "The RDA documents directed information and does not independently diagnose conditions.",
    misconception:
      "If an entry looks obvious, the assistant can add it before the dentist says it.",
    examSignal:
      "A question asks what to do when the assistant is unsure about a charting abbreviation.",
    remediationHints: [
      "When uncertain, clarify before entry.",
      "Separate observed administrative documentation from diagnosis.",
      "Use exact tooth and surface language.",
    ],
    summaryCheckpoint:
      "State how an RDA handles uncertain charting information during an exam.",
  },
  {
    id: "rda-anatomy-oral-landmarks",
    domainId: "dental_anatomy_terminology",
    title: "Oral Landmarks and Directional Terms",
    objective: "Use oral landmarks and directional terms to support safe communication during care.",
    whyItMatters:
      "Dental teams use concise landmark language. The assistant must understand it quickly without guessing.",
    workplaceScenario:
      "The dentist asks for retraction near the buccal mucosa while evaluating the lingual surface of a mandibular molar.",
    keyActions: ["identify landmark", "retract safely", "protect soft tissue", "confirm unclear directions"],
    safetyPrinciple:
      "accurate landmark language supports visibility while reducing soft-tissue injury",
    sequence: ["identify requested area", "position mirror or retractor", "watch soft tissue", "adjust suction", "confirm if unclear"],
    terms: ["buccal mucosa", "lingual", "palatal", "gingiva"],
    scopeBoundary:
      "The RDA assists with access and visibility; abnormal findings and diagnoses are directed to the dentist.",
    misconception:
      "Buccal, facial, and lingual can be used interchangeably.",
    examSignal:
      "A question asks which surface or landmark faces the cheek, tongue, or palate.",
    remediationHints: [
      "Map terms to anatomy: cheek, tongue, palate, gum tissue.",
      "Do not move soft tissue aggressively to improve visibility.",
      "Use clarification when terms are confused.",
    ],
    summaryCheckpoint:
      "Use four oral landmark terms in a safe chairside communication example.",
  },
  {
    id: "rda-instruments-diagnostic-operative",
    domainId: "instruments_materials",
    title: "Diagnostic and Operative Instrument Identification",
    objective: "Identify common instruments by function and safe transfer need.",
    whyItMatters:
      "Instrument questions often test function, not appearance alone. The assistant must know what the instrument is used for and how to pass it safely.",
    workplaceScenario:
      "The dentist asks for an explorer, cotton pliers, and condenser during an operative appointment.",
    keyActions: ["identify instrument function", "orient working end safely", "pass by sequence", "retrieve used instruments safely"],
    safetyPrinciple:
      "correct instrument identification prevents delays, wrong passes, and soft-tissue injury",
    sequence: ["hear request", "select instrument", "orient working end", "transfer safely", "place used item in retrieval area"],
    terms: ["explorer", "cotton pliers", "condenser", "mouth mirror"],
    scopeBoundary:
      "The RDA selects and transfers instruments for assistance; clinical use and treatment decisions remain with the dentist.",
    misconception:
      "If two instruments look similar, either one can be passed as long as it is sterile.",
    examSignal:
      "A question asks which instrument detects irregularities, carries small items, or condenses material.",
    remediationHints: [
      "Study instruments by function and handling risk.",
      "Say what the instrument does, not just what it looks like.",
      "Include safe transfer orientation in scenario answers.",
    ],
    summaryCheckpoint:
      "Match four common instruments to their function and safe transfer consideration.",
  },
  {
    id: "rda-instruments-restorative-materials",
    domainId: "instruments_materials",
    title: "Restorative Materials and Working Time",
    objective: "Support restorative material handling by respecting working time, isolation, and instructions.",
    whyItMatters:
      "Materials can fail when mixed, delivered, or isolated incorrectly. The exam tests sequence and manufacturer-instruction awareness.",
    workplaceScenario:
      "A composite setup is ready, but isolation is poor and the assistant has already dispensed bonding supplies.",
    keyActions: ["protect dry field", "follow manufacturer instructions", "respect working time", "alert dentist to contamination"],
    safetyPrinciple:
      "restorative materials require correct timing and isolation to perform as intended",
    sequence: ["confirm dry field", "prepare material as directed", "track working time", "pass or assist promptly", "report contamination"],
    terms: ["composite", "bonding agent", "working time", "curing light"],
    scopeBoundary:
      "The RDA assists with materials under direction and does not independently choose treatment material or final placement.",
    misconception:
      "Material can be prepared early because it saves time later.",
    examSignal:
      "A question mentions working time, contamination, curing, or isolation during restorative care.",
    remediationHints: [
      "Pair every material with timing and isolation needs.",
      "Do not advance if the answer ignores contamination.",
      "Use manufacturer instructions as the safe default.",
    ],
    summaryCheckpoint:
      "Explain why isolation and working time control matter during restorative material support.",
  },
  {
    id: "rda-instruments-impression-materials",
    domainId: "instruments_materials",
    title: "Impression Materials and Tray Support",
    objective: "Prepare impression support steps without compromising timing, patient comfort, or accuracy.",
    whyItMatters:
      "Impression scenarios test tray readiness, material timing, patient instruction, and safe response to gagging or distortion.",
    workplaceScenario:
      "An alginate impression is planned, and the patient reports gagging easily during previous dental visits.",
    keyActions: ["select appropriate tray as directed", "prepare material on time", "coach breathing", "watch for gagging or distress"],
    safetyPrinciple:
      "impression accuracy and patient safety depend on correct tray fit, timing, and calm instructions",
    sequence: ["confirm tray and material", "explain procedure", "mix according to instructions", "seat under direction", "monitor patient until removal"],
    terms: ["alginate", "impression tray", "working time", "set time"],
    scopeBoundary:
      "The RDA supports impression procedures within delegated duties and alerts the dentist to distress or refusal.",
    misconception:
      "A gagging patient should be told to tolerate it because impressions are brief.",
    examSignal:
      "A question describes gagging, rushed mixing, tray fit, or distorted material.",
    remediationHints: [
      "Use patient coaching as a safety step.",
      "Tie material accuracy to timing and tray fit.",
      "Escalate distress instead of forcing completion.",
    ],
    summaryCheckpoint:
      "Describe the safe assistant sequence for an impression on a patient with gagging history.",
  },
  {
    id: "rda-instruments-sds-storage",
    domainId: "instruments_materials",
    title: "Material Storage, Expiration, and SDS Awareness",
    objective: "Check storage, expiration, labeling, and safety information before using dental materials.",
    whyItMatters:
      "Material safety is workplace safety. Expired or mislabeled materials can affect patient care and staff exposure.",
    workplaceScenario:
      "A cement kit is found open in a drawer with an unreadable expiration date and missing instructions.",
    keyActions: ["pause use", "check expiration", "verify instructions", "locate SDS if hazard guidance is needed"],
    safetyPrinciple:
      "safe material use requires correct identity, storage, expiration status, and hazard awareness",
    sequence: ["inspect label", "check expiration", "verify storage condition", "follow instructions", "discard or escalate questionable material"],
    terms: ["SDS", "expiration date", "storage condition", "cement"],
    scopeBoundary:
      "The RDA does not improvise material use when identity or safety information is uncertain.",
    misconception:
      "If material appears normal, expiration and storage do not matter.",
    examSignal:
      "A question describes unlabeled, expired, overheated, or questionable dental material.",
    remediationHints: [
      "Treat unknown material status as a pause-and-verify issue.",
      "Use SDS for hazard guidance, not as a treatment manual.",
      "Mention escalation instead of guessing.",
    ],
    summaryCheckpoint:
      "Explain the checks an RDA completes before using a questionable material.",
  },
  {
    id: "rda-texas-scope-delegated-duties",
    domainId: "texas_law_ethics_scope",
    title: "Delegated Duties and Texas Scope Awareness",
    objective: "Recognize when a task requires delegation, training, supervision, or dentist decision-making.",
    whyItMatters:
      "Scope questions test safe boundaries. This content is educational exam prep, not legal advice, and students should follow current board and employer rules.",
    workplaceScenario:
      "A busy schedule prompts someone to ask the assistant to perform a task they have not been trained or authorized to perform.",
    keyActions: ["pause the task", "confirm delegation", "confirm training", "ask supervising dentist when uncertain"],
    safetyPrinciple:
      "public safety depends on assistants performing only trained and authorized duties under appropriate supervision",
    sequence: ["identify requested task", "check training and authorization", "confirm supervision", "perform only if appropriate", "escalate uncertainty"],
    terms: ["delegation", "supervision", "scope", "authorization"],
    scopeBoundary:
      "The RDA should consult current Texas rules and the supervising dentist for task-specific authority; this lesson does not provide legal advice.",
    misconception:
      "Experience alone expands what an assistant is allowed to do.",
    examSignal:
      "A question asks whether the assistant should perform a task because the office is busy or the patient agrees.",
    remediationHints: [
      "Use scope, training, delegation, and supervision as four separate checks.",
      "Avoid legal conclusions beyond the exam-safe principle.",
      "When uncertain, stop and escalate.",
    ],
    summaryCheckpoint:
      "State the four checks before an RDA performs a delegated task.",
  },
  {
    id: "rda-texas-ethics-confidentiality",
    domainId: "texas_law_ethics_scope",
    title: "Ethics, Confidentiality, and Professional Boundaries",
    objective: "Protect patient privacy and communicate professionally in common dental-office scenarios.",
    whyItMatters:
      "Ethics questions often test whether the assistant chooses confidentiality and respectful escalation over convenience or curiosity.",
    workplaceScenario:
      "A neighbor asks whether a patient they recognize is having a procedure today.",
    keyActions: ["do not disclose patient information", "redirect politely", "protect records", "notify supervisor if needed"],
    safetyPrinciple:
      "confidentiality protects patient trust and limits information to appropriate care-related use",
    sequence: ["recognize private information", "decline disclosure", "avoid confirming visit details", "secure records", "report concerning requests"],
    terms: ["confidentiality", "privacy", "professional boundary", "patient record"],
    scopeBoundary:
      "The RDA follows privacy policy and does not provide patient information to unauthorized people.",
    misconception:
      "It is harmless to confirm a patient is in the office if the requester already knows them.",
    examSignal:
      "A question asks what to say when family, friends, or community members request patient details.",
    remediationHints: [
      "Do not confirm or deny patient presence.",
      "Use a short professional response.",
      "Secure the record and escalate repeated pressure.",
    ],
    summaryCheckpoint:
      "Write a privacy-safe response to an unauthorized request for patient information.",
  },
  {
    id: "rda-texas-documentation-incident-reporting",
    domainId: "texas_law_ethics_scope",
    title: "Documentation, Incident Reporting, and Honesty",
    objective: "Document accurately and report safety events without altering or hiding information.",
    whyItMatters:
      "Readiness includes ethical documentation. The exam may test what to do after an error, exposure, patient complaint, or charting mistake.",
    workplaceScenario:
      "An assistant realizes a note was entered under the wrong tooth number after the dentist has left the room.",
    keyActions: ["do not hide the error", "notify appropriate team member", "follow correction policy", "document accurately"],
    safetyPrinciple:
      "honest documentation protects patient safety and continuity of care",
    sequence: ["recognize documentation concern", "pause assumptions", "notify supervisor or dentist", "correct according to policy", "record factual information"],
    terms: ["documentation", "incident report", "correction", "factual note"],
    scopeBoundary:
      "The RDA follows office correction policy and does not falsify, backdate, or independently reinterpret clinical findings.",
    misconception:
      "A small charting error can be quietly overwritten if no one has used the note yet.",
    examSignal:
      "A question asks how to handle an error in charting, exposure reporting, or incident documentation.",
    remediationHints: [
      "Choose honesty and policy-based correction.",
      "Avoid deleting, hiding, or changing facts to look better.",
      "Mention notifying the appropriate clinician or supervisor.",
    ],
    summaryCheckpoint:
      "Describe how an RDA responds to a charting error without falsifying the record.",
  },
  {
    id: "rda-texas-patient-questions-boundaries",
    domainId: "texas_law_ethics_scope",
    title: "Handling Patient Questions Without Diagnosing",
    objective: "Respond to patient questions with empathy while staying inside the assistant role.",
    whyItMatters:
      "Patients often ask assistants for diagnoses, treatment recommendations, or guarantees. Exam-safe answers acknowledge the concern and involve the dentist.",
    workplaceScenario:
      "A patient points to a painful tooth and asks whether it needs a crown, extraction, or antibiotics.",
    keyActions: ["acknowledge concern", "avoid diagnosis", "tell the dentist", "provide only approved procedural information"],
    safetyPrinciple:
      "patient safety improves when clinical decisions come from the licensed provider responsible for diagnosis and treatment planning",
    sequence: ["listen to patient", "acknowledge symptom", "avoid diagnosis or treatment promise", "notify dentist", "document according to protocol"],
    terms: ["diagnosis", "treatment plan", "symptom", "provider notification"],
    scopeBoundary:
      "The RDA may support communication but does not diagnose, prescribe, or choose treatment.",
    misconception:
      "If the answer seems obvious, reassuring the patient with a likely diagnosis is helpful.",
    examSignal:
      "A patient asks the assistant to interpret pain, radiographs, treatment need, or medication need.",
    remediationHints: [
      "Use empathetic language without clinical conclusions.",
      "Escalate symptoms and questions to the dentist.",
      "Do not promise outcomes or prescribe advice.",
    ],
    summaryCheckpoint:
      "Write a patient-safe response to a diagnosis or treatment-plan question.",
  },
];

const generatedRdaLessons: RdaLesson[] = lessonBlueprints
  .filter((lesson) => lesson.id !== rdaLessonStandardPrecautions.id)
  .map((lesson) => ({
    id: lesson.id,
    domainId: lesson.domainId,
    title: lesson.title,
    objective: lesson.objective,
    whyItMatters: lesson.whyItMatters,
    masteryThreshold: 0.9,
    remediationHints: lesson.remediationHints,
    steps: buildInternalMasterySteps(lesson).map((step, index) => {
      const kind = stepKinds[index] ?? stepKinds[stepKinds.length - 1];

      return {
        id: `${lesson.id}-step-${index + 1}`,
        type: kind.type,
        prompt: step.prompt,
        expectedTraits: step.expectedAnswerTraits,
        evaluatorNotes: step.evaluatorNotes.join(" "),
        retryHint: step.retryHint,
      };
    }),
    summaryCheckpoint: lesson.summaryCheckpoint,
  }));

export const rdaLessonLibrary: RdaLesson[] = [
  rdaLessonStandardPrecautions,
  ...generatedRdaLessons,
];

function getNextLessonIds(index: number) {
  const next = rdaLessonLibrary[index + 1]?.id ?? rdaLessonLibrary[0]?.id;
  return next ? [next] : [];
}

function stepToSegment(lesson: RdaLesson, step: RdaLessonStep, index: number): LessonSegment {
  const kind = stepKinds[index] ?? stepKinds[stepKinds.length - 1];
  const requiredConcepts = step.expectedTraits.slice(0, 2);
  const optionalConcepts = step.expectedTraits.slice(2);

  return {
    id: step.id,
    title: kind.title,
    questionType: kind.questionType,
    difficulty: kind.difficulty,
    concept: `${lesson.objective} ${lesson.whyItMatters}`,
    example: step.evaluatorNotes,
    question: step.prompt,
    idealAnswer: step.expectedTraits.join(" "),
    memoryTip: step.retryHint,
    correctExplanation:
      "Correct. The answer gives a specific RDA-safe action, explains the safety or sequence reason, and stays within role boundaries.",
    incorrectExplanation:
      "Not ready to advance. The answer must include the required action traits, patient-safety reasoning, and precise dental language.",
    passThreshold: 2,
    acceptableConcepts: [
      {
        label: "required clinical action",
        keywords: requiredConcepts,
      },
      {
        label: "safety, sequence, or scope reasoning",
        keywords: optionalConcepts.length ? optionalConcepts : requiredConcepts,
      },
    ],
  };
}

export const rdaTutorLessonLibrary: TutorLesson[] = rdaLessonLibrary.map((lesson, index) => {
  const domainId = lesson.domainId as RdaDomainId;
  const domain = rdaDomainById[domainId];

  return {
    id: lesson.id,
    slug: lesson.id,
    title: lesson.title,
    domainSlug: domainId,
    domainTitle: domain.title,
    summary: lesson.whyItMatters,
    learningGoal: lesson.objective,
    estimatedMinutes: 18,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "weak_area_review", "rapid_review"],
    segments: lesson.steps.map((step, stepIndex) =>
      stepToSegment(lesson, step, stepIndex),
    ),
    completionMessage: lesson.summaryCheckpoint,
    nextRecommendedLessonIds: getNextLessonIds(index),
  };
});
