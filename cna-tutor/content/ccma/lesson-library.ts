import type { LessonSegment, TutorLesson } from "@/lib/ccma/tutor/types";

const baseCcmaTutorLessonLibrary: TutorLesson[] = [
  {
    id: "ccma-clinical-patient-care",
    slug: "ccma-clinical-patient-care",
    title: "Clinical Patient Care Essentials",
    domainSlug: "clinical-patient-care",
    domainTitle: "Clinical Patient Care",
    summary: "Vital signs, standard precautions, specimen collection, and medication administration within CCMA scope.",
    learningGoal: "Apply the six rights of medication administration and the standard precautions expected on the NHA CCMA exam.",
    estimatedMinutes: 15,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "weak_area_review", "rapid_review"],
    completionMessage: "You covered the core clinical patient care competencies. Confirm these with a 10-question quiz.",
    nextRecommendedLessonIds: ["ccma-pharmacology"],
    segments: [
      {
        id: "vital-signs-norms",
        title: "Normal vital sign ranges",
        concept: "Normal adult vital signs: BP < 120/80 mmHg, pulse 60–100 bpm, respirations 12–20/min, temperature 98.6°F oral, SpO2 95–100%. Values outside these ranges require reporting to the provider.",
        example: "A patient has a blood pressure of 148/92 mmHg. This is above normal (Stage 2 hypertension by AHA). The CCMA should document and notify the provider.",
        question: "What is the normal resting SpO2 range for a healthy adult?",
        idealAnswer: "95 to 100 percent",
        memoryTip: "95–100% is the green zone. Below 90% means call for help immediately.",
        correctExplanation: "Correct. SpO2 95–100% is normal. Below 90% indicates hypoxemia.",
        incorrectExplanation: "Normal SpO2 is 95–100%. Anything below 90% needs urgent evaluation.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "95 to 100", keywords: ["95", "100", "ninety-five", "one hundred"] },
        ],
      },
      {
        id: "six-rights-medication",
        title: "The six rights of medication administration",
        concept: "The six rights are: right patient, right medication, right dose, right route, right time, and right documentation. The CCMA must verify all six before administering any medication.",
        example: "Before giving a scheduled antibiotic, the CCMA verifies patient identity with two identifiers, confirms the medication name and dose on the label, checks the prescribed route and time, then documents immediately after administration.",
        question: "What is the sixth right of medication administration?",
        idealAnswer: "Right documentation",
        memoryTip: "Patient, Med, Dose, Route, Time, DOCUMENTATION — in that order.",
        correctExplanation: "Yes. Documentation confirms what was given and when, completing the safe administration cycle.",
        incorrectExplanation: "The sixth right is documentation. Always record immediately after — never before — administration.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "documentation", keywords: ["document", "record", "chart", "log"] },
        ],
      },
    ],
  },
  {
    id: "ccma-patient-care-coordination",
    slug: "ccma-patient-care-coordination",
    title: "Patient Care Coordination and Education",
    domainSlug: "patient-care-coordination-and-education",
    domainTitle: "Patient Care Coordination and Education",
    summary: "Patient teaching principles, referral workflows, and chronic disease support within CMA scope.",
    learningGoal: "Explain patient education best practices and identify when a referral or follow-up is needed.",
    estimatedMinutes: 10,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "weak_area_review", "rapid_review"],
    completionMessage: "You covered the key patient care coordination concepts. Confirm with a short quiz.",
    nextRecommendedLessonIds: ["ccma-administrative-assisting"],
    segments: [
      {
        id: "teach-back-method",
        title: "The teach-back method",
        concept: "Teach-back is the most reliable patient education technique. After explaining instructions, ask the patient to repeat the key information in their own words. If they cannot, re-teach and check again.",
        example: "After explaining a diabetic diet, the CCMA says: 'Can you tell me in your own words which foods you should limit?' If the patient cannot, the CCMA re-explains and checks understanding again.",
        question: "What is the purpose of the teach-back method in patient education?",
        idealAnswer: "To confirm the patient understood the instructions by having them repeat the information in their own words.",
        memoryTip: "Teach-back = hear it back. If they can't say it, they haven't learned it yet.",
        correctExplanation: "Exactly. Teach-back confirms comprehension, not just that the patient was told information.",
        incorrectExplanation: "Teach-back confirms understanding by having the patient repeat instructions back. It is not just asking yes/no questions.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "confirm understanding", keywords: ["understand", "comprehend", "confirm", "repeat", "own words"] },
        ],
      },
      {
        id: "referral-and-followup",
        title: "Referral and follow-up support",
        concept: "The CCMA supports referrals by scheduling appointments, confirming insurance coverage, and sending clinical records. Follow-up calls confirm the patient received care and understands next steps.",
        example: "A patient with uncontrolled hypertension is referred to a cardiologist. The CCMA schedules the appointment, sends the referral packet, and follows up to confirm the patient attended.",
        question: "Which action is the CCMA's primary responsibility when coordinating a specialist referral?",
        idealAnswer: "Scheduling the appointment, sending clinical records, and confirming the patient completed the referral.",
        memoryTip: "Schedule, send records, confirm completion — the three referral C's.",
        correctExplanation: "Right. The CCMA handles the logistics: scheduling, paperwork, and follow-up confirmation.",
        incorrectExplanation: "The CCMA's role is to schedule, send records, and confirm the patient followed through — not to make the clinical decision to refer.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "schedule and confirm", keywords: ["schedul", "appoint", "confirm", "record", "follow"] },
        ],
      },
    ],
  },
  {
    id: "ccma-administrative-assisting",
    slug: "ccma-administrative-assisting",
    title: "Administrative Assisting Foundations",
    domainSlug: "administrative-assisting",
    domainTitle: "Administrative Assisting",
    summary: "Scheduling, EHR basics, HIPAA compliance, and billing support in the medical office.",
    learningGoal: "Apply HIPAA rules correctly and describe the steps for accurate medical billing workflow.",
    estimatedMinutes: 12,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "weak_area_review", "rapid_review"],
    completionMessage: "You covered the core administrative competencies. Confirm with a 10-question quiz.",
    nextRecommendedLessonIds: ["ccma-laboratory-procedures"],
    segments: [
      {
        id: "hipaa-minimum-necessary",
        title: "HIPAA minimum necessary rule",
        concept: "HIPAA requires that only the minimum necessary PHI (protected health information) be shared or accessed. The CCMA should not access records for patients not in their care, and should not share PHI without a valid authorization or an exception (treatment, payment, operations).",
        example: "A coworker asks the CCMA to pull up a family member's chart 'just to check something.' The CCMA must decline — this request does not meet the minimum necessary standard and has no valid TPO basis.",
        question: "Under HIPAA, what does the minimum necessary rule require?",
        idealAnswer: "Only the minimum amount of PHI needed to accomplish the purpose should be used or disclosed.",
        memoryTip: "Minimum necessary = access only what you need, when you need it, for the right reason.",
        correctExplanation: "Correct. The minimum necessary rule limits both access and disclosure to only what is required.",
        incorrectExplanation: "The minimum necessary rule requires limiting PHI access and disclosure to only what is needed for a specific, permitted purpose.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "minimum PHI needed", keywords: ["minimum", "necessary", "need", "required", "limit"] },
        ],
      },
      {
        id: "medical-billing-workflow",
        title: "Medical billing and coding basics",
        concept: "The medical billing cycle: patient registration → insurance verification → encounter documentation → coding (ICD-10 diagnosis + CPT procedure) → claim submission → payment posting → denial management. The CCMA supports documentation accuracy and may verify insurance eligibility.",
        example: "Before a patient visit, the CCMA verifies insurance eligibility. After the visit, the provider documents the encounter and the coder assigns ICD-10 and CPT codes. The claim is submitted to the payer.",
        question: "Which two code sets are used in medical billing for diagnoses and procedures?",
        idealAnswer: "ICD-10 for diagnoses and CPT codes for procedures.",
        memoryTip: "ICD-10 = why (diagnosis). CPT = what was done (procedure).",
        correctExplanation: "Correct. ICD-10 describes the diagnosis (why the patient was seen) and CPT describes the service (what was done).",
        incorrectExplanation: "ICD-10 is used for diagnoses and CPT (Current Procedural Terminology) is used for procedures.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "ICD-10 and CPT", keywords: ["icd", "cpt", "diagnosis", "procedure", "code"] },
        ],
      },
    ],
  },
  {
    id: "ccma-laboratory-procedures",
    slug: "ccma-laboratory-procedures",
    title: "Laboratory Procedures",
    domainSlug: "laboratory-procedures",
    domainTitle: "Laboratory Procedures",
    summary: "CLIA-waived testing, quality control, chain of custody, and lab safety for the CCMA.",
    learningGoal: "Perform CLIA-waived tests correctly and explain quality control requirements.",
    estimatedMinutes: 12,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "weak_area_review", "rapid_review"],
    completionMessage: "You covered the core lab procedure competencies. Confirm with a 10-question quiz.",
    nextRecommendedLessonIds: ["ccma-diagnostic-testing"],
    segments: [
      {
        id: "clia-waived-tests",
        title: "CLIA-waived tests",
        concept: "CLIA-waived tests are simple lab tests approved by the FDA for point-of-care use. Common examples: urine dipstick, blood glucose (glucometer), rapid strep, rapid influenza, urine pregnancy (hCG), and fecal occult blood. CCMAs may perform these after proper training.",
        example: "A patient complains of increased thirst and frequent urination. The CCMA performs a fingerstick glucose test (CLIA-waived) and obtains a result of 245 mg/dL. This is above normal and must be reported to the provider.",
        question: "Which of the following is an example of a CLIA-waived test the CCMA may perform?",
        idealAnswer: "A fingerstick blood glucose test or a urine dipstick.",
        memoryTip: "CLIA-waived = simple, fast, FDA-cleared for point of care. Glucose, strep, urine dip, flu.",
        correctExplanation: "Correct. CLIA-waived tests are cleared by the FDA for point-of-care use and require minimal training.",
        incorrectExplanation: "CLIA-waived tests include fingerstick glucose, urine dipstick, rapid strep, and rapid flu. These are approved for point-of-care use with minimal complexity.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "CLIA-waived examples", keywords: ["glucose", "glucomet", "urine dip", "strep", "influenza", "flu", "pregnancy", "clia"] },
        ],
      },
      {
        id: "quality-control-lab",
        title: "Quality control in the lab",
        concept: "Quality control (QC) verifies that test equipment and reagents are performing correctly before patient testing. CCMAs must run control samples (known values) and document results. If controls fail, do not test patients until the problem is resolved.",
        example: "Before running patient glucose samples, the CCMA runs a low-control and high-control sample on the glucometer. Both read within the expected range — QC passes and patient testing can proceed.",
        question: "What is the purpose of running quality control samples before patient testing?",
        idealAnswer: "To verify that the equipment and reagents are working correctly before testing patient samples.",
        memoryTip: "QC first, patients second. Controls pass = equipment is reliable.",
        correctExplanation: "Right. QC ensures the instrument and reagents are performing within acceptable limits before real patient results are generated.",
        incorrectExplanation: "QC samples verify the equipment and reagents are accurate. If controls fail, patient testing must stop until the issue is resolved.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "verify equipment accuracy", keywords: ["verif", "accurate", "working", "reliable", "equipment", "reagent", "control"] },
        ],
      },
    ],
  },
  {
    id: "ccma-diagnostic-testing",
    slug: "ccma-diagnostic-testing",
    title: "Diagnostic Testing",
    domainSlug: "diagnostic-testing",
    domainTitle: "Diagnostic Testing",
    summary: "ECG, spirometry, artifact recognition, and patient preparation for diagnostic procedures.",
    learningGoal: "Set up a 12-lead ECG correctly and identify common sources of artifact.",
    estimatedMinutes: 12,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "weak_area_review", "rapid_review"],
    completionMessage: "You covered the core diagnostic testing competencies. Confirm with a 10-question quiz.",
    nextRecommendedLessonIds: ["ccma-pharmacology"],
    segments: [
      {
        id: "ecg-lead-placement",
        title: "12-lead ECG lead placement",
        concept: "A 12-lead ECG uses 10 electrodes: 4 limb leads (RA, LA, RL, LL) and 6 precordial leads (V1–V6). V1 and V2 are placed at the 4th intercostal space right and left of the sternum. V3–V4 between. V5–V6 along the anterior and mid-axillary lines.",
        example: "When placing electrodes, the CCMA must ensure skin is clean, dry, and free of lotions. Hair may need to be shaved. Patient should lie still with arms relaxed to reduce artifact.",
        question: "Where is electrode V1 placed for a 12-lead ECG?",
        idealAnswer: "At the 4th intercostal space to the right of the sternum.",
        memoryTip: "V1 = 4th ICS, right sternal border. V2 = same level, left sternal border.",
        correctExplanation: "Correct. V1 is at the 4th intercostal space, right sternal border.",
        incorrectExplanation: "V1 goes at the 4th intercostal space on the right side of the sternum. V2 mirrors it on the left.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "4th ICS right sternum", keywords: ["4th", "fourth", "intercostal", "right", "sternum", "sternal"] },
        ],
      },
      {
        id: "ecg-artifact",
        title: "Identifying and correcting ECG artifact",
        concept: "Common ECG artifacts: somatic tremor (patient movement/shaking), AC interference (60-cycle noise, improper grounding), wandering baseline (breathing, loose leads, skin prep). Solutions: have patient stay still, ensure good skin contact, use properly grounded equipment.",
        example: "An ECG tracing shows a regular fuzzy baseline at 60 cycles. This is AC interference. The CCMA should check for electrode contact, remove the patient from electrical interference, and re-run.",
        question: "What type of ECG artifact is caused by patient movement or muscle tremors?",
        idealAnswer: "Somatic (muscle) artifact.",
        memoryTip: "Somatic = movement. AC = electrical buzz. Wandering baseline = breathing or loose leads.",
        correctExplanation: "Correct. Somatic artifact appears as irregular rapid deflections from muscle movement.",
        incorrectExplanation: "Muscle or somatic artifact is caused by patient movement. Ask the patient to relax and breathe normally, then retrace.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "somatic or muscle artifact", keywords: ["somatic", "muscle", "tremor", "movement", "motion"] },
        ],
      },
    ],
  },
  {
    id: "ccma-pharmacology",
    slug: "ccma-pharmacology",
    title: "Pharmacology for the CCMA",
    domainSlug: "pharmacology",
    domainTitle: "Pharmacology",
    summary: "Drug classifications, controlled substance schedules, sig codes, and medication safety basics.",
    learningGoal: "Identify DEA schedule categories and interpret common prescription sig codes accurately.",
    estimatedMinutes: 12,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "weak_area_review", "rapid_review"],
    completionMessage: "You covered the core pharmacology competencies. Confirm with a 10-question quiz.",
    nextRecommendedLessonIds: ["ccma-medical-terminology"],
    segments: [
      {
        id: "dea-schedules",
        title: "DEA controlled substance schedules",
        concept: "DEA schedules classify drugs by abuse potential: Schedule I (high abuse, no accepted medical use — heroin, LSD), Schedule II (high abuse, accepted medical use with severe restrictions — oxycodone, Adderall), Schedule III–V (decreasing abuse potential — Tylenol with codeine, benzodiazepines, cough syrups).",
        example: "A patient brings in a prescription for oxycodone. This is a Schedule II controlled substance. It requires a written, signed prescription — no phone-in or fax refills are permitted in most states.",
        question: "Which DEA schedule has the highest accepted medical use and least abuse potential?",
        idealAnswer: "Schedule V.",
        memoryTip: "I = no medical use. II = highest abuse with medical use. V = lowest abuse potential.",
        correctExplanation: "Correct. Schedule V has the lowest abuse potential and includes products like cough suppressants with small amounts of codeine.",
        incorrectExplanation: "Schedule V has the lowest abuse potential. Schedule I has no accepted medical use. Schedule II has high abuse potential with accepted medical use.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "Schedule V", keywords: ["schedule v", "schedule 5", "five", "lowest"] },
        ],
      },
      {
        id: "sig-codes",
        title: "Prescription sig codes",
        concept: "Common sig codes: QD = once daily, BID = twice daily, TID = three times daily, QID = four times daily, PRN = as needed, PO = by mouth, SL = sublingual, IM = intramuscular, IV = intravenous, AC = before meals, PC = after meals, HS = at bedtime.",
        example: "The prescription reads: 'Amoxicillin 500 mg PO TID × 10d.' This means: take 500 mg by mouth three times daily for 10 days.",
        question: "What does the sig abbreviation 'PRN' mean?",
        idealAnswer: "As needed.",
        memoryTip: "PRN = pro re nata (Latin) = as the situation demands = as needed.",
        correctExplanation: "Correct. PRN means as needed. It is used for pain medications, anti-nausea drugs, and other non-scheduled medications.",
        incorrectExplanation: "PRN means as needed. It is used when medication is taken only when a specific symptom arises, not on a fixed schedule.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "as needed", keywords: ["as needed", "needed", "when needed", "pro re nata", "prn"] },
        ],
      },
    ],
  },
  {
    id: "ccma-medical-terminology",
    slug: "ccma-medical-terminology",
    title: "Medical Terminology and Anatomy",
    domainSlug: "medical-terminology-and-anatomy",
    domainTitle: "Medical Terminology and Anatomy",
    summary: "Prefixes, suffixes, root words, common abbreviations, and body system anatomy within CMA scope.",
    learningGoal: "Break down medical terms using prefixes, roots, and suffixes, and identify the major body systems tested on the NHA CCMA exam.",
    estimatedMinutes: 10,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "weak_area_review", "rapid_review"],
    completionMessage: "You covered the core medical terminology and anatomy competencies. Confirm with a 10-question quiz.",
    nextRecommendedLessonIds: ["ccma-clinical-patient-care"],
    segments: [
      {
        id: "word-parts",
        title: "Breaking down medical terms",
        concept: "Medical terms have three components: prefix (before the root), root (the main meaning), and suffix (after the root). Example: 'tachycardia' = tachy- (fast) + cardi (heart) + -ia (condition). Knowing common parts allows you to decode unfamiliar terms.",
        example: "The term 'gastroenteritis': gastro (stomach) + enter (intestine) + -itis (inflammation). Meaning: inflammation of the stomach and intestines.",
        question: "What does the suffix '-itis' mean in medical terminology?",
        idealAnswer: "Inflammation.",
        memoryTip: "-itis = inflammation. Tonsillitis, gastritis, appendicitis — all inflammation.",
        correctExplanation: "Correct. -itis always means inflammation. Gastritis = stomach inflammation. Appendicitis = appendix inflammation.",
        incorrectExplanation: "-itis means inflammation. It is one of the most common medical suffixes and appears in many diagnoses.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "inflammation", keywords: ["inflam", "swelling", "itis"] },
        ],
      },
      {
        id: "body-planes-directional",
        title: "Directional terms and body planes",
        concept: "Key directional terms: anterior/posterior (front/back), superior/inferior (above/below), medial/lateral (toward midline/away from midline), proximal/distal (closer to/farther from origin). Body planes: sagittal (divides left/right), frontal/coronal (divides front/back), transverse/horizontal (divides top/bottom).",
        example: "The knee is distal to the hip (farther from the body's origin). The elbow is proximal to the wrist (closer to the origin).",
        question: "What does the directional term 'medial' mean?",
        idealAnswer: "Toward the midline of the body.",
        memoryTip: "Medial = middle = midline. Lateral = to the side (like a lateral pass in football).",
        correctExplanation: "Correct. Medial refers to structures closer to the body's midline.",
        incorrectExplanation: "Medial means toward the midline. Lateral means away from the midline, toward the sides of the body.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "toward midline", keywords: ["midline", "middle", "center", "toward middle"] },
        ],
      },
    ],
  },
];

function conceptLabels(segment: LessonSegment) {
  return segment.acceptableConcepts.map((concept) => concept.label).join(", ");
}

function strengthenExplanation(segment: LessonSegment) {
  return `${segment.incorrectExplanation} To move forward, your answer needs to directly show: ${conceptLabels(segment)}.`;
}

function buildMasterySegments(lesson: TutorLesson, segment: LessonSegment): LessonSegment[] {
  const requiredConcepts = conceptLabels(segment);
  const misconception = segment.incorrectExplanation.replace(/\.$/, "");

  return [
    {
      ...segment,
      questionType: "recall",
      difficulty: 1,
      incorrectExplanation: strengthenExplanation(segment),
    },
    {
      ...segment,
      id: `${segment.id}-apply`,
      title: `${segment.title}: Apply it`,
      questionType: "application",
      difficulty: 2,
      question: `In your own words, how would a medical assistant apply this in a clinic: ${segment.idealAnswer}`,
      idealAnswer: `Apply it by taking the correct CMA action: ${segment.idealAnswer}`,
      correctExplanation: "Correct. You connected the rule to what a medical assistant should actually do.",
      incorrectExplanation: `Not yet. This answer has to apply the action, not just name the topic. Include: ${requiredConcepts}.`,
    },
    {
      ...segment,
      id: `${segment.id}-scenario`,
      title: `${segment.title}: Scenario judgment`,
      questionType: "scenario",
      difficulty: 2,
      question: `A patient presents with a situation that tests this exact idea. What should the medical assistant do first, and why?`,
      idealAnswer: `${segment.idealAnswer} The reason is that it supports patient safety, accuracy, privacy, and CMA scope of practice.`,
      correctExplanation: "Right. You identified the safe first action and the reason behind it.",
      incorrectExplanation: `Not quite. The scenario answer must name the correct first action and why it matters. Include: ${requiredConcepts}.`,
    },
    {
      ...segment,
      id: `${segment.id}-misconception`,
      title: `${segment.title}: Common misconception`,
      questionType: "misconception",
      difficulty: 2,
      question: `A common mistake is thinking, "${misconception}." What is the corrected medical assistant action?`,
      idealAnswer: segment.idealAnswer,
      correctExplanation: "Correct. You corrected the misconception with the safer CMA action.",
      incorrectExplanation: `That still leaves the misconception in place. Correct it clearly by including: ${requiredConcepts}.`,
    },
    {
      ...segment,
      id: `${segment.id}-challenge`,
      title: `${segment.title}: Exam reasoning`,
      questionType: "critical_thinking",
      difficulty: 3,
      question: `On the NHA CCMA exam, what words or clues would tell you this is the correct answer instead of a distractor?`,
      idealAnswer: `The clues point back to: ${segment.idealAnswer}`,
      correctExplanation: "Good exam reasoning. You connected the clue words to the safest CMA response.",
      incorrectExplanation: `This needs stronger exam reasoning. Name the clue and connect it to: ${requiredConcepts}.`,
    },
  ];
}

function buildSummarySegment(lesson: TutorLesson): LessonSegment {
  const coreConcepts = lesson.segments
    .flatMap((segment) => segment.acceptableConcepts.map((concept) => concept.label))
    .slice(0, 4);

  return {
    id: `${lesson.id}-summary`,
    title: "End-of-lesson summary",
    questionType: "summary",
    difficulty: 3,
    concept: `Before this lesson closes, connect the major ideas from ${lesson.title}: ${coreConcepts.join(", ")}.`,
    example: "A strong CCMA exam answer names the correct medical assistant action, protects the patient, and stays within scope.",
    question: "Give a brief recap of the most important takeaways from this subject.",
    idealAnswer: `The key takeaways are: ${coreConcepts.join(", ")}. A CMA should choose the safest first action, protect privacy, escalate appropriately, and stay within scope.`,
    memoryTip: "Patient safety, accuracy, privacy, CMA scope.",
    correctExplanation: "Strong recap. You connected the lesson ideas instead of memorizing isolated facts.",
    incorrectExplanation: `Your recap needs to include the main lesson ideas: ${coreConcepts.join(", ")}.`,
    passThreshold: Math.min(3, Math.max(1, coreConcepts.length)),
    acceptableConcepts: coreConcepts.map((label) => ({
      label,
      keywords: label.split(/\s+/).filter(Boolean),
    })),
  };
}

function enrichLesson(lesson: TutorLesson): TutorLesson {
  const expandedSegments = lesson.segments.flatMap((segment) =>
    buildMasterySegments(lesson, segment),
  );
  const masterySegments = expandedSegments.slice(0, 9);

  return {
    ...lesson,
    estimatedMinutes: Math.max(lesson.estimatedMinutes, 40),
    completionMessage: `${lesson.completionMessage} Recap the safe first action, the reason it matters, and the CMA scope boundary before moving on.`,
    segments: [...masterySegments, buildSummarySegment(lesson)],
  };
}

export const ccmaTutorLessonLibrary: TutorLesson[] =
  baseCcmaTutorLessonLibrary.map(enrichLesson);
