import type { TutorLesson } from "@/lib/tutor/types";

export const tutorLessonLibrary: TutorLesson[] = [
  {
    id: "foundational-knowledge-basic-science",
    slug: "foundational-knowledge-basic-science",
    title: "Foundational Knowledge and Basic Science",
    domainSlug: "foundational-knowledge-basic-science",
    domainTitle: "Foundational Knowledge and Basic Science",
    summary:
      "Build the CCMA base layer: scope, terminology, pharmacology language, and core science habits.",
    learningGoal:
      "Recognize the language and safety concepts that show up across the CCMA blueprint.",
    estimatedMinutes: 14,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "scope-and-foundation",
        title: "Scope, terminology, and medication safety",
        concept:
          "Foundational CCMA questions often test whether the MA stays within scope, recognizes basic medical language, and uses medication information safely by thinking about dose, route, side effects, and precautions.",
        example:
          "If a task requires provider judgment or a medication question raises concern about dose, route, or side effects, the safest response centers on scope, accuracy, and verified medication information.",
        question: "Name two high-yield concepts from foundational CCMA prep.",
        idealAnswer:
          "Examples include staying within MA scope, medical terminology, dosage conversions, medication routes, side effects, and basic pharmacology safety.",
        memoryTip: "Scope, terms, dose, route.",
        correctExplanation:
          "Exactly. Foundational questions are often about safe thinking more than obscure facts.",
        incorrectExplanation:
          "A strong answer mentions scope, terminology, dosage conversion, medication route, side effects, or pharmacology safety.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "scope", keywords: ["scope", "provider", "escalate"] },
          { label: "terminology", keywords: ["term", "prefix", "suffix", "abbreviation"] },
          { label: "dose or route", keywords: ["dosage", "convert", "route", "pharmacology"] },
        ],
      },
      {
        id: "word-building",
        title: "Building meaning from unfamiliar terms",
        concept:
          "Medical terminology becomes easier when the learner separates prefixes, roots, and suffixes instead of trying to memorize every whole word.",
        example:
          "A suffix such as -itis points toward inflammation, while a prefix like brady- suggests something slower than expected.",
        question:
          "When you see a medical term you do not recognize, what is a strong first strategy?",
        idealAnswer:
          "Break the term into prefix, root, and suffix, then connect those parts to the body system or condition being described.",
        memoryTip: "Split the word before guessing the meaning.",
        correctExplanation:
          "Right. Word-building is one of the safest shortcuts on terminology questions.",
        incorrectExplanation:
          "A strong answer includes breaking terms into parts and linking the parts to system or condition meaning.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "prefix", keywords: ["prefix", "start", "first part"] },
          { label: "root", keywords: ["root", "main part", "word root"] },
          { label: "suffix or meaning", keywords: ["suffix", "ending", "meaning", "system"] },
        ],
      },
      {
        id: "conversions-and-safety",
        title: "Conversions and dose-awareness",
        concept:
          "Medication math questions stay high yield because a wrong conversion can become a patient-safety error, even before the medication reaches the patient.",
        example:
          "If an order is written in grams and the supply label is in milligrams, the learner should slow down, convert accurately, and avoid rushing past the unit mismatch.",
        question:
          "Why do conversion questions matter so much in CCMA preparation?",
        idealAnswer:
          "They matter because unit mistakes can cause dosing errors, so the MA has to recognize mismatched units, convert accurately, and stay inside safe workflow.",
        memoryTip: "Check the units before the dose.",
        correctExplanation:
          "Exactly. Conversion questions are really patient-safety questions in disguise.",
        incorrectExplanation:
          "A strong answer includes mismatched units, accurate conversion, dosing safety, or preventing medication error.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "unit mismatch", keywords: ["unit", "gram", "milligram", "convert"] },
          { label: "dose safety", keywords: ["dose", "dosing", "medication error", "safety"] },
          { label: "accuracy", keywords: ["accurate", "check", "verify"] },
        ],
      },
    ],
    completionMessage:
      "Nice work. That foundation will help every other CCMA topic feel more manageable.",
    nextRecommendedLessonIds: ["anatomy-and-physiology", "patient-intake-and-vitals"],
  },
  {
    id: "anatomy-and-physiology",
    slug: "anatomy-and-physiology",
    title: "Anatomy and Physiology",
    domainSlug: "anatomy-and-physiology",
    domainTitle: "Anatomy and Physiology",
    summary:
      "Connect body systems, function, common disorders, and diagnostics in a test-friendly way.",
    learningGoal:
      "Use body-system reasoning to answer disease-process and diagnostic questions more accurately.",
    estimatedMinutes: 14,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "systems-and-homeostasis",
        title: "Systems and homeostasis",
        concept:
          "A&P questions are easiest when you connect symptoms, diagnostics, and treatment choices back to the body system involved and whether normal balance has been disrupted.",
        example:
          "Oxygenation points toward the respiratory system, while fluid-balance problems can affect several systems at once.",
        question:
          "What two ideas help most with anatomy-and-physiology CCMA questions?",
        idealAnswer:
          "Know the body system involved and think about how disease disrupts normal function or homeostasis.",
        memoryTip: "Find the system, then the imbalance.",
        correctExplanation:
          "Right. System-function reasoning is the shortcut for many A&P items.",
        incorrectExplanation:
          "A strong answer includes body-system identification and loss of normal balance or function.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "body system", keywords: ["system", "organ", "respiratory", "cardio"] },
          { label: "function", keywords: ["function", "job", "normal"] },
          { label: "homeostasis or disease", keywords: ["homeostasis", "balance", "disease", "disrupt"] },
        ],
      },
      {
        id: "organ-and-job",
        title: "Pairing organs with primary jobs",
        concept:
          "Many test items stay simple if the learner can match a structure with its main job before worrying about disease names or treatment details.",
        example:
          "The kidneys filter waste and help regulate fluid balance, while the pancreas supports blood-glucose regulation.",
        question:
          "Why is organ-function pairing useful on the CCMA exam?",
        idealAnswer:
          "It helps you connect signs, symptoms, and diagnostics to the correct body system instead of memorizing isolated facts.",
        memoryTip: "Know the structure, then the job.",
        correctExplanation:
          "Exactly. If you know what an organ normally does, many symptoms make more sense.",
        incorrectExplanation:
          "A strong answer includes matching organ to function and using that match to interpret symptoms or diagnostics.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "organ function", keywords: ["organ", "function", "job", "does"] },
          { label: "signs and symptoms", keywords: ["symptom", "sign", "problem", "diagnostic"] },
          { label: "system reasoning", keywords: ["system", "connect", "pair", "match"] },
        ],
      },
      {
        id: "diagnostics-context",
        title: "Using diagnostics in body-system context",
        concept:
          "A diagnostic test becomes easier to remember when it is tied to the system it evaluates rather than memorized by name alone.",
        example:
          "An EKG fits cardiovascular questions because it records electrical activity from the heart, while oxygenation testing aligns with respiratory function.",
        question:
          "How should a learner think about diagnostics in A&P review?",
        idealAnswer:
          "Link each test to the body system and function it evaluates so the purpose of the test is easier to recognize.",
        memoryTip: "Test names stick better when they have a system anchor.",
        correctExplanation:
          "Right. Diagnostic questions become more manageable when the system anchor is clear.",
        incorrectExplanation:
          "A strong answer includes linking diagnostics to a body system, purpose, or function being measured.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "diagnostic purpose", keywords: ["purpose", "measures", "evaluates", "test"] },
          { label: "body system", keywords: ["system", "heart", "lungs", "kidneys"] },
          { label: "function", keywords: ["function", "activity", "balance", "job"] },
        ],
      },
    ],
    completionMessage:
      "Great. Thinking in systems beats trying to memorize disconnected facts.",
    nextRecommendedLessonIds: ["patient-intake-and-vitals", "general-patient-care"],
  },
  {
    id: "patient-intake-and-vitals",
    slug: "patient-intake-and-vitals",
    title: "Patient Intake and Vitals",
    domainSlug: "patient-intake-and-vitals",
    domainTitle: "Patient Intake and Vitals",
    summary:
      "Practice patient identification, history gathering, screening, and abnormal-vitals reasoning.",
    learningGoal:
      "Collect intake information safely, spot abnormal findings, and know what to report.",
    estimatedMinutes: 15,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "id-vitals-escalation",
        title: "Identification, vitals, and escalation",
        concept:
          "Patient identification comes before data collection, and vital signs are useful only when you understand what they measure and what abnormal findings require verification, documentation, and escalation rather than guesswork.",
        example:
          "A reading that seems far outside the expected range should not be ignored just because the patient looks comfortable; blood pressure, pulse, respirations, and temperature all matter because they reflect how the body is functioning.",
        question:
          "What should happen before and after an abnormal vital-sign reading?",
        idealAnswer:
          "Before collecting vitals, identify the patient correctly. If a reading is abnormal, verify it appropriately, document it, and report or escalate it.",
        memoryTip: "Identify first, then verify, document, escalate.",
        correctExplanation:
          "Exactly. The exam rewards safe sequence and follow-through.",
        incorrectExplanation:
          "A strong answer includes patient identification first and verification, documentation, and escalation for abnormal findings.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "identify patient", keywords: ["identify", "identifier", "dob", "name"] },
          { label: "verify abnormal", keywords: ["verify", "recheck", "repeat"] },
          { label: "document or escalate", keywords: ["document", "chart", "report", "provider"] },
        ],
      },
      {
        id: "history-and-chief-complaint",
        title: "Chief complaint and focused history",
        concept:
          "The chief complaint tells why the patient came today, while the rest of the history adds context that helps the provider interpret what the patient is experiencing.",
        example:
          "A patient may say, 'I came because of chest tightness,' while medication history, symptom timing, and allergies help build the fuller picture.",
        question:
          "Why is it useful to separate the chief complaint from the rest of the history?",
        idealAnswer:
          "It keeps the reason for today's visit clear while the rest of the history adds details that guide safe clinical decisions.",
        memoryTip: "Reason for visit first, context right after.",
        correctExplanation:
          "Right. Intake gets cleaner when the learner knows what belongs to today's concern and what adds supporting detail.",
        incorrectExplanation:
          "A strong answer includes today's reason for the visit plus the added context from symptoms, medication history, allergies, or timing.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "reason for visit", keywords: ["chief complaint", "reason", "today", "visit"] },
          { label: "history details", keywords: ["history", "allergy", "medication", "timing"] },
          { label: "clinical decisions", keywords: ["decision", "context", "guide", "provider"] },
        ],
      },
      {
        id: "measure-what-matters",
        title: "Knowing what vital signs actually measure",
        concept:
          "Vital-sign questions are stronger when the learner knows what each number represents instead of treating them as isolated boxes on a chart.",
        example:
          "Blood pressure reflects force in the vessels, pulse reflects heart beats, respirations reflect breathing, and temperature reflects body heat regulation.",
        question:
          "How does understanding what a vital sign measures help the MA?",
        idealAnswer:
          "It helps the MA recognize why the finding matters, communicate it clearly, and notice when a value may need prompt follow-up.",
        memoryTip: "Every number represents body function.",
        correctExplanation:
          "Exactly. Meaning leads to better recognition and safer reporting.",
        incorrectExplanation:
          "A strong answer includes body function, recognizing importance, or clearer reporting and follow-up.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "body function", keywords: ["function", "body", "measures", "represents"] },
          { label: "recognition", keywords: ["recognize", "abnormal", "importance", "meaning"] },
          { label: "reporting", keywords: ["report", "communicate", "follow-up", "provider"] },
        ],
      },
    ],
    completionMessage:
      "Strong work. Intake questions usually reward safe workflow more than speed.",
    nextRecommendedLessonIds: ["general-patient-care", "infection-control-and-safety"],
  },
  {
    id: "general-patient-care",
    slug: "general-patient-care",
    title: "General Patient Care",
    domainSlug: "general-patient-care",
    domainTitle: "General Patient Care",
    summary:
      "Cover room prep, medications, procedures, emergencies, and documentation priorities.",
    learningGoal:
      "Choose the safest action sequence during common ambulatory-care tasks and procedures.",
    estimatedMinutes: 15,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "safe-sequencing",
        title: "Safe sequencing in patient care",
        concept:
          "General patient care questions often test preparation, patient safety during procedures or medication support, and accurate documentation afterward.",
        example:
          "If a patient becomes symptomatic during care, safety and response come before routine cleanup or paperwork.",
        question:
          "What usually matters most in general patient care questions?",
        idealAnswer:
          "Safe preparation, patient protection during the task, and accurate documentation and escalation when needed.",
        memoryTip: "Prepare, protect, document.",
        correctExplanation:
          "Right. The safest first action usually wins.",
        incorrectExplanation:
          "A strong answer includes preparation, patient safety, and documentation or escalation.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "prepare", keywords: ["prepare", "setup", "room", "supplies"] },
          { label: "protect patient", keywords: ["safe", "safety", "protect", "respond"] },
          { label: "document or escalate", keywords: ["document", "chart", "provider", "report"] },
        ],
      },
      {
        id: "positioning-and-draping",
        title: "Positioning, draping, and comfort",
        concept:
          "Questions about procedures often include patient positioning, privacy, and comfort because those steps affect both safety and trust.",
        example:
          "A prepared room still falls short if the patient is not positioned safely, draped appropriately, or told what to expect.",
        question:
          "Why do positioning and draping matter in routine patient care?",
        idealAnswer:
          "They support patient safety, privacy, comfort, and help the provider perform the procedure more effectively.",
        memoryTip: "Position for safety, drape for dignity.",
        correctExplanation:
          "Exactly. Patient care includes both technical preparation and respectful setup.",
        incorrectExplanation:
          "A strong answer includes safety, privacy, dignity, comfort, or provider efficiency.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "safety", keywords: ["safe", "safety", "position"] },
          { label: "privacy or dignity", keywords: ["privacy", "dignity", "drape", "respect"] },
          { label: "comfort or procedure", keywords: ["comfort", "provider", "procedure", "support"] },
        ],
      },
      {
        id: "meds-and-response",
        title: "Medication support and response to change",
        concept:
          "Medication-related questions reward careful workflow, route awareness, and immediate response if the patient becomes symptomatic after treatment.",
        example:
          "Even when the injection technique is correct, the encounter is not finished if the patient becomes lightheaded, short of breath, or otherwise unstable.",
        question:
          "If a patient becomes symptomatic after a medication or procedure, what should guide the MA's actions?",
        idealAnswer:
          "Patient safety should guide the response first, followed by prompt escalation, monitoring, and accurate documentation.",
        memoryTip: "A change in condition changes the priority.",
        correctExplanation:
          "Right. Patient response outranks routine cleanup or paperwork.",
        incorrectExplanation:
          "A strong answer includes safety first, escalation, monitoring, or accurate documentation.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "safety first", keywords: ["safety", "first", "protect", "respond"] },
          { label: "escalation", keywords: ["escalate", "provider", "notify", "emergency"] },
          { label: "documentation", keywords: ["document", "chart", "record", "monitor"] },
        ],
      },
    ],
    completionMessage:
      "Nice job. General-care questions become simpler when safety leads the sequence.",
    nextRecommendedLessonIds: ["infection-control-and-safety", "point-of-care-testing-and-laboratory-procedures"],
  },
  {
    id: "infection-control-and-safety",
    slug: "infection-control-and-safety",
    title: "Infection Control and Safety",
    domainSlug: "infection-control-and-safety",
    domainTitle: "Infection Control and Safety",
    summary:
      "Reinforce standard precautions, asepsis, exposure response, and clinical safety checks.",
    learningGoal:
      "Apply infection-control and safety decisions consistently across patient care and testing workflows.",
    estimatedMinutes: 14,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "precautions-and-correction",
        title: "Precautions and immediate correction",
        concept:
          "Standard precautions apply to every patient, and strong answers usually include hand hygiene, PPE when exposure is possible, respiratory hygiene, sharps safety, and immediate correction and reporting of any break in asepsis or exposure event.",
        example:
          "A contaminated sterile glove or a sharps exposure cannot be rationalized away; it has to be addressed right then, because blood and other potentially infectious materials create real occupational risk.",
        question:
          "What two infection-control habits stay high yield on the CCMA exam?",
        idealAnswer:
          "Use standard precautions with every patient, and correct and report contamination or exposure events immediately.",
        memoryTip: "Standard always; correct contamination now.",
        correctExplanation:
          "Exactly. Infection-control questions often reward the most immediate safe correction.",
        incorrectExplanation:
          "A strong answer includes standard precautions for all patients and immediate correction or reporting of contamination or exposure.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "standard precautions", keywords: ["standard", "all patients", "precautions"] },
          { label: "correct immediately", keywords: ["correct", "replace", "immediate"] },
          { label: "reporting", keywords: ["report", "exposure", "policy", "notify"] },
        ],
      },
      {
        id: "hand-hygiene-and-ppe",
        title: "Hand hygiene and PPE choices",
        concept:
          "Infection-control answers strengthen when the learner chooses hand hygiene and PPE based on exposure risk instead of treating gloves or gowns like automatic substitutes for clean technique.",
        example:
          "Wearing gloves does not remove the need for hand hygiene, and splash risk may call for face and eye protection in addition to gloves.",
        question:
          "How should the MA think about hand hygiene and PPE?",
        idealAnswer:
          "Use hand hygiene consistently and choose PPE based on expected exposure risk rather than relying on one item alone.",
        memoryTip: "Clean hands plus the right barrier.",
        correctExplanation:
          "Right. PPE works best when it matches the task and does not replace clean technique.",
        incorrectExplanation:
          "A strong answer includes hand hygiene, exposure risk, or choosing PPE to match likely contact with blood or body fluids.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "hand hygiene", keywords: ["hand hygiene", "wash", "sanitize", "hands"] },
          { label: "exposure risk", keywords: ["risk", "exposure", "blood", "body fluid"] },
          { label: "right PPE", keywords: ["ppe", "gloves", "gown", "mask", "eye protection"] },
        ],
      },
      {
        id: "safety-logs-and-equipment",
        title: "Safety checks, logs, and workspace discipline",
        concept:
          "CCMA questions treat equipment checks, cleaning workflows, and quality logs as patient-safety tasks, not low-value paperwork.",
        example:
          "A test machine that has not passed control checks or a room that was not cleaned correctly can undermine the entire patient encounter.",
        question:
          "Why do equipment checks and safety logs matter in clinical workflow?",
        idealAnswer:
          "They help prove the environment and equipment are safe and functioning correctly before patient care or testing continues.",
        memoryTip: "Safety paperwork supports real safety.",
        correctExplanation:
          "Exactly. Quality and safety systems exist to protect patients and staff before problems occur.",
        incorrectExplanation:
          "A strong answer includes equipment functioning, cleaning, logs, controls, or protecting patients and staff.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "equipment or environment", keywords: ["equipment", "machine", "room", "environment"] },
          { label: "safe function", keywords: ["safe", "function", "working", "controls"] },
          { label: "patient or staff protection", keywords: ["patient", "staff", "protect", "quality"] },
        ],
      },
    ],
    completionMessage:
      "Strong work. Infection-control questions usually reward the safest corrective action.",
    nextRecommendedLessonIds: ["point-of-care-testing-and-laboratory-procedures", "phlebotomy"],
  },
  {
    id: "point-of-care-testing-and-laboratory-procedures",
    slug: "point-of-care-testing-and-laboratory-procedures",
    title: "Point of Care Testing and Laboratory Procedures",
    domainSlug: "point-of-care-testing-and-laboratory-procedures",
    domainTitle: "Point of Care Testing and Laboratory Procedures",
    summary:
      "Learn how specimen integrity, waived testing, and quality control are framed on the exam.",
    learningGoal:
      "Protect specimen quality and test validity from collection through reporting.",
    estimatedMinutes: 14,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "specimen-and-qc",
        title: "Specimen integrity and quality control",
        concept:
          "Lab questions often hinge on labeling, storage, transport, contamination control, and whether quality control proves the result is trustworthy.",
        example:
          "A correct collection can still become unusable if the sample is mislabeled or the control is out of range.",
        question:
          "What makes a point-of-care or lab result trustworthy?",
        idealAnswer:
          "Correct specimen handling plus valid quality-control performance make the result more trustworthy.",
        memoryTip: "Handle it right and prove the system works.",
        correctExplanation:
          "Right. The exam often asks whether the workflow supports a valid result before asking what the result means.",
        incorrectExplanation:
          "A strong answer mentions specimen handling, labeling, storage, contamination control, or valid quality control.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "specimen handling", keywords: ["label", "storage", "transport", "specimen"] },
          { label: "quality control", keywords: ["quality control", "control", "valid"] },
          { label: "trustworthy result", keywords: ["accurate", "trust", "reliable", "valid"] },
        ],
      },
      {
        id: "timing-and-technique",
        title: "Timing, technique, and invalidation",
        concept:
          "Waived testing questions frequently turn on timing, expired supplies, incomplete steps, or reading a test outside the accepted window.",
        example:
          "A urine dipstick can look simple, but a delay in reading or a skipped step can still invalidate what the learner thinks they saw.",
        question:
          "Why do timing and technique matter so much in point-of-care testing?",
        idealAnswer:
          "Because even a simple test can become invalid if the steps, timing, or materials are not used correctly.",
        memoryTip: "Simple tests still need disciplined timing.",
        correctExplanation:
          "Exactly. Many waived-testing questions are really workflow-validity questions.",
        incorrectExplanation:
          "A strong answer includes timing, technique, expired materials, missed steps, or protecting validity.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "timing", keywords: ["timing", "time", "window", "read"] },
          { label: "technique", keywords: ["technique", "steps", "procedure", "correctly"] },
          { label: "invalid result", keywords: ["invalid", "validity", "trust", "expired"] },
        ],
      },
      {
        id: "result-workflow",
        title: "Result reporting and follow-through",
        concept:
          "A testing task is not complete just because a strip changes color; the learner still has to document, communicate, and handle abnormal results safely.",
        example:
          "An abnormal or questionable result may require repeat workflow, escalation, or provider notification rather than casual reassurance.",
        question:
          "What happens after the MA gets a test result?",
        idealAnswer:
          "The result should be documented correctly and any abnormal, questionable, or urgent finding should be handled according to policy and provider workflow.",
        memoryTip: "Read it, record it, route it safely.",
        correctExplanation:
          "Right. The last step in testing is safe follow-through, not just observation.",
        incorrectExplanation:
          "A strong answer mentions documentation, abnormal results, provider workflow, repeat testing, or escalation.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "documentation", keywords: ["document", "record", "chart"] },
          { label: "abnormal follow-through", keywords: ["abnormal", "questionable", "repeat", "notify"] },
          { label: "policy or provider workflow", keywords: ["policy", "provider", "workflow", "report"] },
        ],
      },
    ],
    completionMessage:
      "Great. Lab questions get easier when you think about validity first.",
    nextRecommendedLessonIds: ["phlebotomy", "ekg-and-cardiovascular-testing"],
  },
  {
    id: "phlebotomy",
    slug: "phlebotomy",
    title: "Phlebotomy",
    domainSlug: "phlebotomy",
    domainTitle: "Phlebotomy",
    summary:
      "Practice the phlebotomy habits that show up repeatedly: ID, labels, order of draw, and post-draw safety.",
    learningGoal:
      "Recognize safe venipuncture workflow from patient ID through post-draw handling.",
    estimatedMinutes: 14,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "phlebotomy-workflow",
        title: "ID, order, and post-draw safety",
        concept:
          "Phlebotomy questions often reward strong workflow: correct patient ID, accurate labeling, proper order of draw, sharps safety, and bleeding control.",
        example:
          "A technically smooth draw is still unsafe if the wrong patient's tube is labeled or the safety device is not activated.",
        question:
          "What are two high-yield safety themes in phlebotomy questions?",
        idealAnswer:
          "Examples include correct patient identification, accurate specimen labeling, order of draw, sharps safety, and hemostasis after the draw.",
        memoryTip: "Correct patient, correct tube, correct finish.",
        correctExplanation:
          "Exactly. Phlebotomy safety is workflow discipline more than heroics.",
        incorrectExplanation:
          "A strong answer mentions patient ID, labeling, order of draw, sharps safety, or bleeding control.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "patient ID or labeling", keywords: ["identify", "label", "patient", "specimen"] },
          { label: "order of draw", keywords: ["order", "draw", "tube"] },
          { label: "post-draw safety", keywords: ["sharps", "bleeding", "pressure", "hemostasis"] },
        ],
      },
      {
        id: "before-the-stick",
        title: "Preparing before venipuncture starts",
        concept:
          "A safe blood draw begins before the needle enters the skin, with proper identification, supplies, site choice, and patient readiness.",
        example:
          "A rushed start can lead to wrong-tube use, poor site selection, or a patient who was never told what to expect.",
        question:
          "Why is pre-draw preparation such a high-yield part of phlebotomy?",
        idealAnswer:
          "Because it helps prevent patient-identification mistakes, equipment mistakes, and avoidable problems before the draw even begins.",
        memoryTip: "Most preventable errors start before the puncture.",
        correctExplanation:
          "Right. Preparation prevents downstream errors that are harder to fix later.",
        incorrectExplanation:
          "A strong answer includes preparation, patient ID, supplies, site choice, or preventing avoidable error.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "preparation", keywords: ["prepare", "supplies", "before", "ready"] },
          { label: "identification", keywords: ["identify", "patient", "label", "correct"] },
          { label: "error prevention", keywords: ["prevent", "mistake", "avoidable", "error"] },
        ],
      },
      {
        id: "after-the-draw",
        title: "Closing the draw safely",
        concept:
          "Once the specimen is collected, the learner still has to protect the patient, the team, and the sample through hemostasis, sharps safety, and correct handling.",
        example:
          "The draw is not truly complete if the patient is still bleeding, the needle is unsafe, or the tubes have not entered the right workflow.",
        question:
          "What must be protected after the blood draw is finished?",
        idealAnswer:
          "The patient, the staff, and the specimen all need protection through bleeding control, sharps safety, and correct specimen handling.",
        memoryTip: "End the draw as safely as you began it.",
        correctExplanation:
          "Exactly. The closing steps are where many preventable phlebotomy errors happen.",
        incorrectExplanation:
          "A strong answer includes patient bleeding control, sharps safety, or correct specimen handling.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "patient", keywords: ["patient", "bleeding", "pressure", "hemostasis"] },
          { label: "staff", keywords: ["staff", "sharps", "needle", "safety"] },
          { label: "specimen", keywords: ["specimen", "tube", "label", "handling"] },
        ],
      },
    ],
    completionMessage:
      "Nice job. Good phlebotomy answers usually come from disciplined workflow.",
    nextRecommendedLessonIds: ["ekg-and-cardiovascular-testing", "patient-care-coordination-and-education"],
  },
  {
    id: "ekg-and-cardiovascular-testing",
    slug: "ekg-and-cardiovascular-testing",
    title: "EKG and Cardiovascular Testing",
    domainSlug: "ekg-and-cardiovascular-testing",
    domainTitle: "EKG and Cardiovascular Testing",
    summary:
      "Focus on patient prep, lead placement, tracing quality, and when to escalate concerning findings.",
    learningGoal:
      "Produce cleaner tracings and answer EKG questions through setup, accuracy, and patient safety.",
    estimatedMinutes: 14,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "ekg-quality-and-escalation",
        title: "Tracing quality and escalation",
        concept:
          "EKG questions frequently test skin prep, lead placement, artifact reduction, and prompt escalation of concerning cardiovascular symptoms or findings such as chest pain, irregular heartbeat, dizziness, fatigue, or shortness of breath.",
        example:
          "A poor tracing may reflect motion artifact or bad lead adhesion, while chest pain with a concerning tracing deserves prompt provider attention.",
        question:
          "What two ideas matter most in EKG and cardiovascular testing questions?",
        idealAnswer:
          "Get a clean tracing through proper prep and placement, and document and escalate concerning findings promptly.",
        memoryTip: "Clean tracing, quick escalation.",
        correctExplanation:
          "Right. EKG questions usually separate setup problems from true urgent findings.",
        incorrectExplanation:
          "A strong answer mentions clean setup or lead placement plus documentation or escalation of concerning findings.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "prep or placement", keywords: ["skin prep", "lead", "placement", "artifact"] },
          { label: "clean tracing", keywords: ["clean", "quality", "still", "motion"] },
          { label: "document or escalate", keywords: ["document", "report", "provider", "prompt"] },
        ],
      },
      {
        id: "purpose-of-ekg",
        title: "Knowing what the EKG is for",
        concept:
          "The learner should understand that the EKG records electrical activity from the heart, which helps explain why the test appears in symptom-driven questions.",
        example:
          "Chest pain, irregular heartbeat, dizziness, shortness of breath, or reduced exercise tolerance can all make cardiovascular testing more relevant.",
        question:
          "Why does the EKG show up so often in cardiovascular testing questions?",
        idealAnswer:
          "Because it records the heart's electrical activity and helps support evaluation when symptoms or findings raise cardiovascular concern.",
        memoryTip: "Electrical activity explains the test.",
        correctExplanation:
          "Exactly. The EKG makes more sense when the learner remembers what it is measuring.",
        incorrectExplanation:
          "A strong answer includes electrical activity, heart function, or symptom-driven cardiovascular evaluation.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "electrical activity", keywords: ["electrical", "activity", "signal", "heart"] },
          { label: "evaluation", keywords: ["evaluate", "monitor", "diagnose", "test"] },
          { label: "symptoms", keywords: ["chest pain", "dizziness", "shortness", "irregular"] },
        ],
      },
      {
        id: "artifact-vs-urgency",
        title: "Separating technical artifact from urgent concern",
        concept:
          "Production-ready cardiovascular judgment means knowing when a poor tracing is likely a setup issue and when the patient presentation itself demands immediate attention.",
        example:
          "Motion artifact may improve when the patient relaxes and the leads are secured, but a patient with active chest pain still needs prompt escalation even if the first tracing is messy.",
        question:
          "What is the difference between artifact management and urgent escalation?",
        idealAnswer:
          "Artifact management fixes technical issues like movement or poor adhesion, while urgent escalation responds to concerning patient symptoms or findings right away.",
        memoryTip: "Fix the setup, but never delay the safety response.",
        correctExplanation:
          "Right. Technical cleanup and clinical urgency are related, but they are not the same priority.",
        incorrectExplanation:
          "A strong answer includes technical issues like movement or adhesion plus urgent patient symptoms that require prompt response.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "artifact", keywords: ["artifact", "movement", "lead", "adhesion"] },
          { label: "technical fix", keywords: ["fix", "repeat", "setup", "clean"] },
          { label: "urgent symptoms", keywords: ["urgent", "symptom", "chest pain", "escalate"] },
        ],
      },
    ],
    completionMessage:
      "Great. Cardiovascular questions make more sense when setup quality and escalation stay separate in your mind.",
    nextRecommendedLessonIds: ["patient-care-coordination-and-education", "communication-and-customer-service"],
  },
  {
    id: "patient-care-coordination-and-education",
    slug: "patient-care-coordination-and-education",
    title: "Patient Care Coordination and Education",
    domainSlug: "patient-care-coordination-and-education",
    domainTitle: "Patient Care Coordination and Education",
    summary:
      "Practice referrals, preventive care, follow-up, continuity, and patient-teaching decisions.",
    learningGoal:
      "Help patients move from visit to next step with fewer gaps, misunderstandings, and missed services.",
    estimatedMinutes: 14,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "coordination-and-teaching",
        title: "Close the loop with education",
        concept:
          "Care coordination means helping the patient complete the next step, while patient education works best when it matches the plan of care, the patient's needs, and uses teach-back to confirm understanding.",
        example:
          "A referral is stronger when the patient knows where to go, what to bring, what follow-up to expect, and can explain the instructions back in their own words.",
        question:
          "What makes patient care coordination effective?",
        idealAnswer:
          "It closes the loop with follow-up, referrals, resources, and clear education that matches the provider plan and patient needs.",
        memoryTip: "Follow through, do not just hand off.",
        correctExplanation:
          "Exactly. Coordination questions reward continuity and clarity.",
        incorrectExplanation:
          "A strong answer mentions follow-up, referrals, resources, provider-plan alignment, or patient-centered education.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "follow-up or continuity", keywords: ["follow up", "continuity", "next step"] },
          { label: "referrals or resources", keywords: ["referral", "resource", "community", "service"] },
          { label: "education", keywords: ["teach", "education", "clear", "understand"] },
        ],
      },
      {
        id: "teach-back",
        title: "Using teach-back to confirm understanding",
        concept:
          "Teach-back is not asking, 'Do you understand?'; it is asking the patient or caregiver to explain the plan, medication, or follow-up steps in their own words.",
        example:
          "After medication teaching, the MA might ask the patient to describe when they will take the medicine and what problem they should report.",
        question:
          "Why is teach-back stronger than simply asking if the patient understands?",
        idealAnswer:
          "It confirms real understanding by having the patient explain the plan back instead of just saying yes.",
        memoryTip: "Understanding is shown, not assumed.",
        correctExplanation:
          "Right. Teach-back gives the team a better way to check whether instructions truly landed.",
        incorrectExplanation:
          "A strong answer mentions having the patient explain instructions back, confirming real understanding, or avoiding false reassurance.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "explain back", keywords: ["own words", "explain back", "repeat back", "teach-back"] },
          { label: "confirm understanding", keywords: ["confirm", "understanding", "real", "verify"] },
          { label: "not just yes/no", keywords: ["yes", "understand", "assume", "not enough"] },
        ],
      },
      {
        id: "prevention-and-follow-up",
        title: "Prevention, reminders, and next-step reliability",
        concept:
          "Preventive care questions often reward the learner who helps the patient remember the next needed step and understands why follow-up matters.",
        example:
          "Screening reminders, referral completion, and return precautions all support continuity rather than leaving the patient to piece the plan together later.",
        question:
          "How does preventive follow-up fit into care coordination?",
        idealAnswer:
          "It helps the patient complete needed screenings, appointments, and plan-of-care steps so care continues safely after the visit.",
        memoryTip: "The visit is one step, not the whole plan.",
        correctExplanation:
          "Exactly. Coordination includes what happens after the patient walks out the door.",
        incorrectExplanation:
          "A strong answer includes screenings, reminders, follow-up appointments, or continuing the plan of care after the visit.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "screenings or prevention", keywords: ["screening", "preventive", "reminder", "wellness"] },
          { label: "follow-up", keywords: ["follow-up", "appointment", "next step", "return"] },
          { label: "continuity", keywords: ["continuity", "plan of care", "continue", "after visit"] },
        ],
      },
    ],
    completionMessage:
      "Nice job. Good coordination questions are really about clarity and follow-through.",
    nextRecommendedLessonIds: ["administrative-assisting", "communication-and-customer-service"],
  },
  {
    id: "administrative-assisting",
    slug: "administrative-assisting",
    title: "Administrative Assisting",
    domainSlug: "administrative-assisting",
    domainTitle: "Administrative Assisting",
    summary:
      "Reinforce scheduling, records, insurance, referrals, billing support, and office workflow.",
    learningGoal:
      "Understand front-office and back-office choices that support safe, efficient care.",
    estimatedMinutes: 15,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "admin-workflow",
        title: "Scheduling, records, and coverage flow",
        concept:
          "Administrative questions often test urgency, visit type, documentation requirements, insurance workflow, and accurate records or charge support, including patient-facing terms like deductible, copayment, and coinsurance.",
        example:
          "A same-day concern should not be scheduled like a routine follow-up, and some services need prior authorization before the visit can proceed cleanly; front-desk explanations about coverage should stay clear and accurate.",
        question:
          "What two ideas are especially important in administrative-assisting questions?",
        idealAnswer:
          "Examples include matching urgency to the correct appointment type, and supporting care with accurate records, referrals, authorizations, insurance, or billing workflow.",
        memoryTip: "Right visit, right paperwork, right follow-through.",
        correctExplanation:
          "Exactly. Administrative work is part of patient care quality.",
        incorrectExplanation:
          "A strong answer mentions urgency or visit type, plus accurate records, authorizations, referrals, insurance, or billing support.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "urgency or visit type", keywords: ["urgent", "visit type", "schedule", "appointment"] },
          { label: "records or referrals", keywords: ["record", "referral", "authorization", "documentation"] },
          { label: "insurance or billing", keywords: ["insurance", "billing", "coverage", "charge"] },
        ],
      },
      {
        id: "insurance-language",
        title: "Using insurance terms correctly",
        concept:
          "Administrative confidence improves when the learner can explain deductible, copayment, and coinsurance in plain language without drifting outside office role or policy.",
        example:
          "A deductible is what the patient may owe before the plan starts paying for covered services subject to the deductible, while a copayment is a fixed amount and coinsurance is a percentage share.",
        question:
          "What is the value of knowing deductible, copayment, and coinsurance clearly?",
        idealAnswer:
          "It helps the MA communicate coverage basics accurately and support smoother scheduling, check-in, and billing conversations.",
        memoryTip: "Coverage language is part of front-desk safety.",
        correctExplanation:
          "Right. Clear insurance vocabulary reduces confusion and helps patients know what to expect.",
        incorrectExplanation:
          "A strong answer includes accurate coverage communication, check-in workflow, billing clarity, or patient expectations.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "coverage communication", keywords: ["coverage", "insurance", "copayment", "deductible", "coinsurance"] },
          { label: "accuracy", keywords: ["accurate", "clear", "correctly", "plain language"] },
          { label: "workflow support", keywords: ["workflow", "check-in", "billing", "schedule"] },
        ],
      },
      {
        id: "records-and-authorizations",
        title: "Records, authorizations, and clean follow-through",
        concept:
          "A well-run administrative workflow keeps records accurate, supports authorizations and referrals, and prevents delays that could interrupt care.",
        example:
          "If records are incomplete or an authorization is missing, the patient may arrive ready for care only to face avoidable rescheduling.",
        question:
          "Why do accurate records and authorizations matter so much in ambulatory workflow?",
        idealAnswer:
          "They help prevent delays, support coverage and compliance, and keep the patient's care plan moving without avoidable interruptions.",
        memoryTip: "Administrative gaps can become care gaps.",
        correctExplanation:
          "Exactly. Good administrative work keeps care timely, accurate, and better coordinated.",
        incorrectExplanation:
          "A strong answer includes delays, coverage, compliance, accurate records, or keeping care moving.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "prevent delays", keywords: ["delay", "reschedule", "interrupt", "timely"] },
          { label: "coverage or compliance", keywords: ["coverage", "compliance", "authorization", "policy"] },
          { label: "care continuity", keywords: ["care plan", "moving", "continuity", "workflow"] },
        ],
      },
    ],
    completionMessage:
      "Well done. Strong CCMA candidates treat administrative workflow as part of safe care.",
    nextRecommendedLessonIds: ["communication-and-customer-service", "medical-law-and-ethics"],
  },
  {
    id: "communication-and-customer-service",
    slug: "communication-and-customer-service",
    title: "Communication and Customer Service",
    domainSlug: "communication-and-customer-service",
    domainTitle: "Communication and Customer Service",
    summary:
      "Build the communication habits that make patients feel safe and help teams work cleanly.",
    learningGoal:
      "Use clear, respectful, audience-aware communication in person, by phone, and in writing.",
    estimatedMinutes: 14,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "audience-aware-professionalism",
        title: "Audience-aware professionalism",
        concept:
          "Communication questions reward clear, respectful language that adapts to the patient or audience and stays calm during difficult interactions.",
        example:
          "A frustrated patient needs acknowledgment, clear next steps, and proper escalation, not an argument.",
        question:
          "What two habits usually lead to the best communication answers on the CCMA exam?",
        idealAnswer:
          "Adapt communication to the patient's needs and stay calm, professional, and ready to escalate through the proper chain when needed.",
        memoryTip: "Adapt, stay calm, escalate when needed.",
        correctExplanation:
          "Right. Respect, clarity, and emotional control are central here.",
        incorrectExplanation:
          "A strong answer mentions adapting communication plus calm professionalism, listening, or proper escalation.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "adapt communication", keywords: ["adapt", "audience", "language", "needs"] },
          { label: "professional calm", keywords: ["calm", "professional", "respectful", "listen"] },
          { label: "escalation", keywords: ["escalate", "chain", "supervisor", "provider"] },
        ],
      },
      {
        id: "therapeutic-listening",
        title: "Listening before solving",
        concept:
          "Many communication questions improve when the MA listens actively first, because premature problem-solving can miss the patient's real concern.",
        example:
          "A patient who sounds angry on the phone may actually be confused about instructions, worried about pain, or unable to get a medication filled.",
        question:
          "Why is active listening so important in communication questions?",
        idealAnswer:
          "It helps the MA understand the real concern, respond more accurately, and avoid escalating the interaction unnecessarily.",
        memoryTip: "Listen for the problem before answering the emotion.",
        correctExplanation:
          "Exactly. Strong listening leads to safer next steps and better rapport.",
        incorrectExplanation:
          "A strong answer mentions understanding the real concern, responding accurately, or avoiding unnecessary escalation.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "understand concern", keywords: ["understand", "concern", "real problem", "clarify"] },
          { label: "accurate response", keywords: ["accurate", "respond", "next step", "help"] },
          { label: "de-escalation", keywords: ["de-escalate", "avoid", "calm", "escalation"] },
        ],
      },
      {
        id: "phone-and-teamwork",
        title: "Phone communication and team handoff",
        concept:
          "Professional communication includes accurate messages, clear handoff details, and knowing when a patient concern needs immediate routing instead of routine follow-up.",
        example:
          "A vague message like 'patient called' is weak compared with a clear note that captures the patient's concern, contact information, urgency, and needed callback path.",
        question:
          "What makes a good phone message or team handoff in the clinic?",
        idealAnswer:
          "It should be clear, accurate, include the patient's concern and urgency, and route the information to the right person.",
        memoryTip: "Good messages move care forward.",
        correctExplanation:
          "Right. Communication is stronger when the next person has what they need to act safely.",
        incorrectExplanation:
          "A strong answer includes clarity, accuracy, urgency, patient concern, or routing to the right person.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "clarity or accuracy", keywords: ["clear", "accurate", "message", "details"] },
          { label: "patient concern", keywords: ["concern", "reason", "callback", "information"] },
          { label: "urgency or routing", keywords: ["urgent", "route", "right person", "handoff"] },
        ],
      },
    ],
    completionMessage:
      "Strong work. Communication questions tend to reward respect, clarity, and emotional control.",
    nextRecommendedLessonIds: ["medical-law-and-ethics", "patient-intake-and-vitals"],
  },
  {
    id: "medical-law-and-ethics",
    slug: "medical-law-and-ethics",
    title: "Medical Law and Ethics",
    domainSlug: "medical-law-and-ethics",
    domainTitle: "Medical Law and Ethics",
    summary:
      "Review privacy, consent, directives, reporting, and the ethical habits expected of a CCMA.",
    learningGoal:
      "Protect patient rights, confidentiality, and legal-ethical compliance during routine workflow.",
    estimatedMinutes: 14,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "privacy-consent-reporting",
        title: "Privacy, consent, and reporting",
        concept:
          "Law-and-ethics questions repeatedly test confidentiality, informed consent, release of information, minimum-necessary privacy thinking, mandatory reporting, and unbiased patient protection.",
        example:
          "Helpful intent does not excuse sharing information with an unauthorized person or ignoring a reportable concern; share only what is needed for the purpose unless a clear exception applies.",
        question:
          "What two ideas are most central in medical law and ethics questions?",
        idealAnswer:
          "Examples include protecting privacy and records, respecting consent and directives, and reporting concerns according to legal and policy requirements.",
        memoryTip: "Protect information and protect the patient.",
        correctExplanation:
          "Exactly. Privacy and patient protection lead many legal-ethical items.",
        incorrectExplanation:
          "A strong answer mentions privacy, confidentiality, consent, records, directives, or mandatory reporting.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "privacy or records", keywords: ["privacy", "hipaa", "record", "confidentiality"] },
          { label: "consent or directives", keywords: ["consent", "directive", "authorization", "informed"] },
          { label: "reporting", keywords: ["report", "mandatory", "policy", "abuse"] },
        ],
      },
      {
        id: "minimum-necessary",
        title: "Using the minimum-necessary mindset",
        concept:
          "The minimum-necessary mindset means limiting use, disclosure, and requests for information to what is needed for the intended purpose rather than sharing more just because it is available.",
        example:
          "A patient question may be valid, but that does not make it appropriate to discuss unrelated details where others can hear them or with people who do not need the information.",
        question:
          "How does minimum necessary help the MA make better privacy decisions?",
        idealAnswer:
          "It reminds the MA to share only the information needed for the purpose and avoid unnecessary disclosure of protected health information.",
        memoryTip: "Needed, not everything known.",
        correctExplanation:
          "Right. Minimum necessary gives the learner a practical privacy filter.",
        incorrectExplanation:
          "A strong answer includes limiting disclosure, using only needed information, or protecting PHI from unnecessary sharing.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "limit disclosure", keywords: ["limit", "minimum", "necessary", "only needed"] },
          { label: "protect PHI", keywords: ["phi", "privacy", "protected", "disclosure"] },
          { label: "purpose", keywords: ["purpose", "intended", "reason", "appropriate"] },
        ],
      },
      {
        id: "consent-and-protection",
        title: "Consent, directives, and patient protection",
        concept:
          "Ethical and legal questions become easier when the learner asks whether the patient's rights, choices, and safety are being protected in the moment.",
        example:
          "Advance directives, informed consent, and reportable safety concerns all push the learner to think about patient rights and protective action rather than convenience.",
        question:
          "What should anchor the MA's thinking when legal and ethical questions feel uncertain?",
        idealAnswer:
          "The anchor should be protecting the patient's rights, safety, and privacy while following policy and escalating appropriately.",
        memoryTip: "Protect the patient, then follow the safe path.",
        correctExplanation:
          "Exactly. When in doubt, patient protection and policy-based escalation are strong guideposts.",
        incorrectExplanation:
          "A strong answer includes patient rights, safety, privacy, policy, or escalation.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "patient rights", keywords: ["rights", "choice", "directive", "consent"] },
          { label: "safety or privacy", keywords: ["safety", "privacy", "protect", "patient"] },
          { label: "policy or escalation", keywords: ["policy", "escalate", "report", "appropriate"] },
        ],
      },
    ],
    completionMessage:
      "Excellent. Law-and-ethics questions become easier when patient protection leads every decision.",
    nextRecommendedLessonIds: ["communication-and-customer-service", "foundational-knowledge-basic-science"],
  },
];
