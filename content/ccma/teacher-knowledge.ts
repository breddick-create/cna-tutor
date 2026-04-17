export const ccmaTeacherKnowledge = {
  examOverview: {
    credential: "Certified Clinical Medical Assistant (CCMA)",
    authority: "National Healthcareer Association (NHA)",
    scoredItems: 150,
    pretestItems: 30,
    examTime: "3 hours",
    note: "Use practice scores directionally. NHA sets the official passing standard.",
  },
  sources: {
    official: [
      {
        title: "CCMA Test Plan for the CCMA Exam",
        authority: "NHA",
        revision: "2022 job analysis; hosted by NHA in 2025/2026",
        webReference:
          "https://www.nhanow.com/docs/default-source/test-plans/nha_ccma_test_plan_2022.pdf",
      },
      {
        title: "Medical Assistant Certification | CCMA",
        authority: "NHA",
        revision: "Current certification overview page",
        webReference:
          "https://www.nhanow.com/certification/nha-certifications/certified-clinical-medical-assistant-(ccma)",
      },
      {
        title: "NHA Candidate Handbook",
        authority: "NHA",
        revision: "Current handbook hub",
        webReference: "https://knowledge.nhanow.com/nha-candidate-handbook",
      },
    ],
    supplemental: [
      {
        title: "Standard Precautions for All Patient Care",
        authority: "CDC",
        focus: "Infection control basics for all patient care",
        webReference:
          "https://www.cdc.gov/infection-control/hcp/basics/standard-precautions.html",
      },
      {
        title: "Bloodborne Pathogens - General Guidance",
        authority: "OSHA",
        focus: "Occupational exposure, sharps, and bloodborne pathogen safety",
        webReference: "https://www.osha.gov/bloodborne-pathogens/general",
      },
      {
        title: "Minimum Necessary Requirement",
        authority: "HHS",
        focus: "HIPAA minimum-necessary privacy expectations",
        webReference:
          "https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/minimum-necessary-requirement/index.html",
      },
      {
        title: "Tool: Teach-Back",
        authority: "AHRQ",
        focus: "Patient education, confirmation of understanding, and health literacy",
        webReference:
          "https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/teachback.html",
      },
      {
        title: "Health Insurance Terms You Should Know",
        authority: "CMS",
        focus: "Administrative insurance vocabulary and patient-facing billing language",
        webReference: "https://www.cms.gov/medical-bill-rights/help/guides/health-insurance-terms",
      },
      {
        title: "Vital Signs",
        authority: "MedlinePlus",
        focus: "Core vital-sign concepts and common adult reference framing",
        webReference: "https://medlineplus.gov/vitalsigns.html",
      },
      {
        title: "Electrocardiogram",
        authority: "MedlinePlus",
        focus: "EKG purpose, indications, and symptom context",
        webReference: "https://medlineplus.gov/lab-tests/electrocardiogram/",
      },
      {
        title: "Drugs, Herbs and Supplements",
        authority: "MedlinePlus",
        focus: "Medication information, side effects, dosage, precautions, and interactions",
        webReference: "https://medlineplus.gov/druginformation.html",
      },
    ],
  },
  courseObjectives: [
    "Apply foundational science, terminology, and pharmacology concepts to ambulatory care questions.",
    "Recognize anatomy, physiology, and common disease processes that shape patient care decisions.",
    "Perform safe patient intake, screening, vital-sign collection, and escalation of abnormal findings.",
    "Prepare for exams, procedures, medications, testing, and documentation within MA scope.",
    "Use infection control, specimen handling, phlebotomy, and EKG workflows safely and accurately.",
    "Support continuity of care, scheduling, records, communication, and patient education.",
    "Protect privacy, consent, professionalism, and legal-ethical obligations in every encounter.",
  ],
  examBlueprint: [
    {
      section: "1",
      title: "Foundational Knowledge and Basic Science",
      emphasis: "15 scored items covering systems, terminology, pharmacology, nutrition, and psychology.",
    },
    {
      section: "2",
      title: "Anatomy and Physiology",
      emphasis: "8 scored items on body systems, function, disease processes, and diagnostics.",
    },
    {
      section: "3A",
      title: "Patient Intake and Vitals",
      emphasis: "14 scored items on identification, history, screenings, vitals, and abnormal signs.",
    },
    {
      section: "3B",
      title: "General Patient Care",
      emphasis: "28 scored items on room prep, medications, procedures, emergencies, and charting.",
    },
    {
      section: "3C-3F",
      title: "Clinical Testing and Safety",
      emphasis:
        "42 scored items across infection control, waived testing, phlebotomy, and EKG/cardiovascular testing.",
    },
    {
      section: "4",
      title: "Patient Care Coordination and Education",
      emphasis: "12 scored items on continuity of care, referrals, prevention, and teaching.",
    },
    {
      section: "5",
      title: "Administrative Assisting",
      emphasis: "12 scored items on scheduling, records, coding support, billing, and office flow.",
    },
    {
      section: "6",
      title: "Communication and Customer Service",
      emphasis: "12 scored items on cultural awareness, phone etiquette, teamwork, and conflict management.",
    },
    {
      section: "7",
      title: "Medical Law and Ethics",
      emphasis: "7 scored items on HIPAA, consent, directives, reporting, and unbiased care.",
    },
  ],
  workflowAnchors: {
    beforeVisit: [
      "Confirm the correct patient using approved identifiers before collecting clinical data.",
      "Prepare the room, supplies, and documentation before the patient encounter begins.",
      "Know the purpose of the visit so the correct screening, testing, and forms are ready.",
    ],
    duringVisit: [
      "Protect patient safety, privacy, dignity, and infection control in every step.",
      "Collect history, vitals, and procedure data accurately and document in the correct place.",
      "Stay inside medical-assistant scope and escalate abnormal findings, emergencies, or unclear orders promptly.",
    ],
    afterVisit: [
      "Label, store, transport, and document specimens and test results correctly.",
      "Review discharge instructions, referrals, follow-up needs, and patient education points clearly.",
      "Close the loop on records, scheduling, inventory, billing support, and safety checks.",
    ],
  },
  sourceGroundedAnchors: {
    infectionControl: [
      "CDC standard precautions apply to all patient care, not only to patients with known infection risk.",
      "Use hand hygiene, PPE when exposure is possible, respiratory hygiene, equipment cleaning/disinfection, and safe injection habits as part of routine workflow.",
      "OSHA bloodborne-pathogen principles matter whenever there is reasonably anticipated exposure to blood or other potentially infectious materials.",
    ],
    privacyAndEthics: [
      "HIPAA minimum necessary means limiting use, disclosure, and requests for protected health information to what is needed for the intended purpose.",
      "Do not confuse treatment access with casual access. Treatment is an important exception, but unnecessary sharing is still unsafe and unprofessional.",
      "When privacy questions are ambiguous, default to the smallest appropriate disclosure, follow policy, and escalate when needed.",
    ],
    communicationAndEducation: [
      "Teach-back is used to confirm understanding by asking the patient or caregiver to explain the plan or action steps in their own words.",
      "Do not rely on 'Do you understand?' as proof of comprehension.",
      "Teach-back is especially useful for medication instructions, follow-up testing, treatment plans, and home-care steps.",
    ],
    administrativeLiteracy: [
      "Deductible: what a patient may owe before the plan begins to pay for covered services subject to the deductible.",
      "Copayment: a fixed amount a patient pays for a covered service, often at the time of service.",
      "Coinsurance: the patient's percentage share of the allowed amount for a covered service.",
    ],
    vitalsAndDiagnostics: [
      "Vital signs show how well the body is functioning. High-yield vital signs include blood pressure, pulse, respiratory rate, and temperature.",
      "Adult blood pressure is often framed directionally with normal below 120/80 and above 90/60, but the test focus is usually recognition, documentation, and escalation of abnormal findings.",
      "An EKG helps diagnose or monitor heart conditions and becomes especially relevant with chest pain, irregular heartbeat, shortness of breath, dizziness, fatigue, or decreased exercise tolerance.",
    ],
    pharmacologyAndMedicationInfo: [
      "Medication questions often center on dose, route, side effects, precautions, and knowing when to escalate concerns instead of improvising.",
      "Drug-information tools are used to confirm safe medication facts rather than guessing from memory.",
      "When medication teaching is involved, clear instructions plus teach-back produce the safest patient-centered answer.",
    ],
  },
  highYieldFacts: {
    foundational: [
      "Know medical assistant scope, allied health roles, delivery models, and common credential language.",
      "Break medical terms into prefixes, roots, and suffixes when a term looks unfamiliar.",
      "Differentiate indication, contraindication, side effect, adverse effect, and route of administration.",
      "Medication math and standard-metric conversions stay high yield because dosing errors are safety errors.",
      "For medication-reference questions, think in terms of dose, side effects, precautions, and interactions rather than brand-name trivia alone.",
    ],
    anatomyAndPhysiology: [
      "Pair each organ system with its main function, common disorders, and typical diagnostics.",
      "Homeostasis questions often test what happens when a body system drifts out of balance.",
      "Link signs and symptoms to the affected body system rather than memorizing isolated facts.",
    ],
    patientIntakeAndVitals: [
      "Patient identification comes before history, vitals, testing, or treatment.",
      "Abnormal vital signs are not just numbers; they require recognition, documentation, and escalation.",
      "Height, weight, BMI, pain score, and screening information matter because they guide clinical decisions.",
      "Vital-sign questions are strongest when the learner can explain what blood pressure, pulse, respiratory rate, and temperature are actually measuring.",
    ],
    generalPatientCare: [
      "Room setup, positioning, draping, and sterile technique support both safety and provider efficiency.",
      "The rights of medication administration and route-specific technique are common exam anchors.",
      "First aid, wound care, and emergency response questions usually reward calm prioritization and escalation.",
    ],
    infectionControlAndSafety: [
      "Standard precautions apply to every patient, every time.",
      "Breaks in asepsis, sharps injuries, or exposure events require immediate corrective action and reporting.",
      "Quality control, equipment logs, and safety checks are patient-safety tasks, not paperwork extras.",
      "Hand hygiene, PPE selection, respiratory hygiene, environmental cleaning, and safe injection practices are routine infection-control expectations.",
    ],
    labAndDiagnostics: [
      "Specimen integrity depends on correct collection, labeling, storage, transport, and documentation.",
      "Point-of-care testing questions often hinge on controls, timing, and what invalidates a result.",
      "EKG quality starts with skin prep, lead placement, and motion reduction before rhythm interpretation.",
      "EKG questions often separate technical tracing quality problems from symptoms that require prompt escalation.",
    ],
    careCoordinationAndEducation: [
      "Preventive care questions often connect screenings, chronic disease support, and follow-up.",
      "Patient education should match the visit type, the learner's needs, and the provider plan of care.",
      "Referrals and continuity tasks are about closing the loop, not just handing out paperwork.",
      "Teach-back is a high-yield way to verify true understanding of medications, follow-up steps, and home-care instructions.",
    ],
    administration: [
      "Scheduling and check-in questions often test urgency, visit type, insurance, and documentation requirements.",
      "Know the purpose of referrals, prior authorizations, coding support, charge posting, and records management.",
      "Administrative workflow still includes safety awareness, inventory support, and telehealth logistics.",
      "Know the patient-facing differences among deductible, copayment, and coinsurance so you can support clear front-desk communication.",
    ],
    communication: [
      "Therapeutic communication is clear, respectful, patient-centered, and adapted to the audience.",
      "Active listening and proper escalation matter more than winning an argument with a frustrated patient.",
      "Professional tone applies in person, by phone, and in written or electronic messages.",
      "The best patient-education answers usually confirm understanding instead of assuming it.",
    ],
    lawAndEthics: [
      "HIPAA, consent, directives, release of information, and mandatory reporting are frequent exam targets.",
      "Ethical care requires privacy, fairness, and unbiased treatment even when beliefs differ.",
      "When legal or ethical doubt appears, protect the patient, follow policy, and escalate appropriately.",
      "Minimum necessary is a practical filter: share only what is needed for the purpose, unless a clear exception applies.",
    ],
  },
  coachingPatterns: {
    questionStyle: [
      "Look for the safest first action before looking for the most complete action.",
      "When two answers seem reasonable, prefer the one that protects patient identity, safety, scope, or documentation.",
      "Translate dense wording into visit flow: before visit, during visit, after visit.",
    ],
    memorizationAids: [
      "Identify, prepare, perform, document, and report.",
      "Clean to clean stays clean; once contaminated, correct it immediately.",
      "Label before leaving the patient or specimen workflow.",
      "When a finding is abnormal, do not normalize it away; document and escalate.",
    ],
  },
} as const;

export type CcmaTeacherKnowledge = typeof ccmaTeacherKnowledge;
