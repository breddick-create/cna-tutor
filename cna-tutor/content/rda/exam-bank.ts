import { RDA_DOMAINS, rdaDomainById, type RdaDomainId } from "@/content/rda/domains";

export type RdaExamItemDifficulty = "easy" | "medium" | "hard";
export type RdaExamItemType = "pretest" | "quiz" | "mock";

export type RdaExamBankItem = {
  id: string;
  domainId: RdaDomainId;
  difficulty: RdaExamItemDifficulty;
  type: RdaExamItemType;
  stem: string;
  options: string[];
  correctAnswer: string;
  rationale: string;
  wrongOptionRationales: string[];
  safetyFlag: boolean;
  keywords: string[];
  visualPlaceholder?: string;
};

export type RDAExamMode = "pretest" | "quiz" | "mock_exam";
export type RDADifficulty = RdaExamItemDifficulty;

export type RDAExamQuestion = {
  id: string;
  mode: RDAExamMode;
  domainSlug: RdaDomainId;
  domainTitle: string;
  difficulty: RDADifficulty;
  prompt: string;
  choices: Array<{ id: "a" | "b" | "c" | "d"; text: string }>;
  correctChoiceId: "a" | "b" | "c" | "d";
  rationale: string;
  memoryTip: string;
};

type ItemBlueprint = Omit<RdaExamBankItem, "id" | "type"> & {
  stemPrefix: string;
};

// ─── Infection Control & Safety (20 blueprints) ──────────────────────────────

const icsBlueprints: ItemBlueprint[] = [
  {
    domainId: "infection_control_safety",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "Which action is required before putting on gloves for routine chairside care?",
    options: ["Perform hand hygiene.", "Open sterile packs.", "Seat the patient.", "Chart the procedure."],
    correctAnswer: "Perform hand hygiene.",
    rationale: "Hand hygiene is performed before gloves because gloves do not replace clean hands.",
    wrongOptionRationales: [
      "Sterile packs are opened after the assistant is ready to maintain asepsis.",
      "Seating the patient does not replace hand hygiene.",
      "Charting does not address contamination risk.",
    ],
    safetyFlag: true,
    keywords: ["hand hygiene", "ppe", "standard precautions", "recall"],
  },
  {
    domainId: "infection_control_safety",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "After a restorative appointment, a bracket table has visible composite dust and saliva. What should the RDA do before disinfecting?",
    options: ["Clean visible debris first.", "Spray disinfectant and immediately wipe dry.", "Place new barriers over the debris.", "Seat the next patient if gloves are changed."],
    correctAnswer: "Clean visible debris first.",
    rationale: "Disinfection is reliable only after visible debris is removed according to product directions.",
    wrongOptionRationales: [
      "Immediate wiping can prevent the required wet contact time.",
      "Barriers do not make contaminated debris safe.",
      "Changing gloves does not disinfect the environment.",
    ],
    safetyFlag: true,
    keywords: ["surface disinfection", "contact time", "clinical contact surface", "application"],
  },
  {
    domainId: "infection_control_safety",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "During cleanup, an assistant feels a puncture through a glove from an instrument. What is the best first response?",
    options: ["Stop, wash the area, report it, and follow the exposure-control plan.", "Finish cleanup so the room is safe for others.", "Cover the puncture and report it if swelling develops.", "Ask the patient whether they have any bloodborne disease."],
    correctAnswer: "Stop, wash the area, report it, and follow the exposure-control plan.",
    rationale: "A sharps exposure requires immediate first aid, reporting, and follow-up through the office exposure-control process.",
    wrongOptionRationales: [
      "Cleanup does not come before exposure response.",
      "Waiting for symptoms delays required follow-up.",
      "Patient questioning is not the immediate exposure response.",
    ],
    safetyFlag: true,
    keywords: ["sharps", "exposure", "bloodborne pathogen", "scenario"],
  },
  {
    domainId: "infection_control_safety",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A sterile instrument pouch is torn when the assistant picks it up. What should happen next?",
    options: ["Do not use it; reprocess the instrument according to protocol.", "Tape the pouch and open it carefully.", "Use it if the internal indicator changed color.", "Wipe the instrument with disinfectant before use."],
    correctAnswer: "Do not use it; reprocess the instrument according to protocol.",
    rationale: "A torn pouch breaks sterile integrity even if an indicator changed during processing.",
    wrongOptionRationales: [
      "Tape does not restore sterility.",
      "Indicator change does not overcome damaged packaging.",
      "Surface disinfectant does not replace sterilization for critical instruments.",
    ],
    safetyFlag: true,
    keywords: ["sterile pouch", "instrument processing", "sterility", "application"],
    visualPlaceholder: "Future diagram: torn sterilization pouch and indicator location.",
  },
  {
    domainId: "infection_control_safety",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "What does contact time mean for an operatory disinfectant?",
    options: ["How long the surface must stay wet with the product.", "How long the bottle can stay open.", "How long gloves may be worn.", "How long instruments stay sterile."],
    correctAnswer: "How long the surface must stay wet with the product.",
    rationale: "Disinfectants need the labeled wet contact time to work as intended.",
    wrongOptionRationales: [
      "Bottle-open time is not the disinfection contact time.",
      "Glove wear time is a PPE issue.",
      "Instrument sterility depends on packaging and storage.",
    ],
    safetyFlag: true,
    keywords: ["contact time", "disinfectant", "surface", "recall"],
  },
  {
    domainId: "infection_control_safety",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "A disinfectant spray bottle has no readable label. The room is behind schedule. What is the safest RDA action?",
    options: ["Do not use it until the product and directions are verified.", "Use it if the smell matches the usual product.", "Use extra spray to make up for the missing label.", "Ask the patient to wait while the surface air dries."],
    correctAnswer: "Do not use it until the product and directions are verified.",
    rationale: "Chemical safety requires product identity, directions, PPE, and contact time; guessing is unsafe.",
    wrongOptionRationales: [
      "Odor is not reliable product identification.",
      "More spray does not prove correct dilution or contact time.",
      "Air drying does not solve unlabeled chemical risk.",
    ],
    safetyFlag: true,
    keywords: ["chemical safety", "label", "sds", "scenario"],
  },
  {
    domainId: "infection_control_safety",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "Which sequence best protects the clean-to-dirty flow in instrument processing?",
    options: ["Transport covered cassette, clean, dry, package, sterilize, store.", "Package, clean, sterilize, dry, transport, store.", "Sterilize, clean, package, transport, store, dry.", "Clean chairside, store, package, sterilize when needed."],
    correctAnswer: "Transport covered cassette, clean, dry, package, sterilize, store.",
    rationale: "Instrument processing depends on correct order from contaminated transport to sterile storage.",
    wrongOptionRationales: [
      "Packaging before cleaning traps debris.",
      "Sterilization does not come before cleaning.",
      "Storage before sterilization breaks the processing chain.",
    ],
    safetyFlag: true,
    keywords: ["instrument processing", "sterilization", "sequence", "application"],
  },
  {
    domainId: "infection_control_safety",
    difficulty: "hard",
    stemPrefix: "Image-compatible scenario",
    stem: "A sterilization area shows contaminated cassettes beside wrapped sterile packs. What is the main safety concern?",
    options: ["Clean and contaminated zones are not separated.", "The packs are wrapped too tightly.", "The cassettes should be opened in the operatory.", "The sterile packs should be sprayed with disinfectant."],
    correctAnswer: "Clean and contaminated zones are not separated.",
    rationale: "Sterile packs must be protected from cross-contamination by maintaining clear clean and dirty areas.",
    wrongOptionRationales: [
      "Tight wrapping is not the concern shown in the setup.",
      "Opening contaminated cassettes chairside increases exposure risk.",
      "Spraying sterile packs can compromise packaging and does not fix zoning.",
    ],
    safetyFlag: true,
    keywords: ["image-placeholder", "sterilization area", "clean dirty separation", "scenario"],
    visualPlaceholder: "Future diagram: sterilization work area with clean and contaminated zones.",
  },
  // New ICS blueprints
  {
    domainId: "infection_control_safety",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "In which order should PPE be removed after a contaminated procedure?",
    options: ["Gloves first, then mask and eye protection, then gown, then hand hygiene.", "Mask first, then gloves, then gown.", "Gown first, then gloves, then mask.", "Order does not matter as long as hand hygiene follows."],
    correctAnswer: "Gloves first, then mask and eye protection, then gown, then hand hygiene.",
    rationale: "Proper doffing sequence minimizes transfer of contamination from the most contaminated item (gloves) outward.",
    wrongOptionRationales: [
      "Removing the mask before gloves risks contaminating the face with gloved hands.",
      "Removing the gown first can drag contamination across the face.",
      "Order matters; incorrect doffing can transfer pathogens.",
    ],
    safetyFlag: true,
    keywords: ["ppe doffing", "removal sequence", "standard precautions", "recall"],
  },
  {
    domainId: "infection_control_safety",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "An assistant notices a splash of blood on their safety glasses during a procedure. What is the correct immediate response?",
    options: ["Keep the glasses on until the procedure ends, then decontaminate them properly.", "Remove the glasses in the operatory and rinse them in the sink.", "Tell the patient and ask them to stop moving.", "Switch to a face shield while keeping the contaminated glasses on."],
    correctAnswer: "Keep the glasses on until the procedure ends, then decontaminate them properly.",
    rationale: "Removing contaminated PPE mid-procedure can spread contamination; complete the immediate step, then follow decontamination protocol.",
    wrongOptionRationales: [
      "Removing glasses in the operatory and rinsing without protocol can spread contamination.",
      "Patient movement is not the issue; PPE is.",
      "Adding a face shield over contaminated glasses does not resolve the contamination.",
    ],
    safetyFlag: true,
    keywords: ["eye protection", "splash", "ppe", "application"],
  },
  {
    domainId: "infection_control_safety",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A dental assistant's uniform has visible blood after a procedure. What is the correct next action?",
    options: ["Change into a clean uniform before treating the next patient.", "Cover the stain with a lab coat and continue.", "Wipe the area with a surface disinfectant.", "Only change if the patient comments on it."],
    correctAnswer: "Change into a clean uniform before treating the next patient.",
    rationale: "Contaminated clinical attire must be removed before patient contact to prevent cross-contamination.",
    wrongOptionRationales: [
      "A lab coat over contaminated clothing does not eliminate the risk.",
      "Surface disinfectants are not for clothing; fabric requires laundering.",
      "Patient observation is not the standard for changing contaminated attire.",
    ],
    safetyFlag: true,
    keywords: ["clinical attire", "uniform", "contamination", "application"],
  },
  {
    domainId: "infection_control_safety",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "During instrument processing, the ultrasonic cleaner alarm sounds mid-cycle. What should the RDA do?",
    options: ["Stop the cycle, consult the manual, and do not process instruments until the issue is resolved.", "Open the lid and check the water level manually.", "Remove instruments and hand-scrub them instead without PPE.", "Restart the cycle once without investigating."],
    correctAnswer: "Stop the cycle, consult the manual, and do not process instruments until the issue is resolved.",
    rationale: "Equipment malfunction during processing can compromise safety; instruments should not be used until the unit is confirmed functional.",
    wrongOptionRationales: [
      "Opening the lid mid-cycle can expose the assistant to aerosols and chemicals.",
      "Hand-scrubbing without PPE creates sharps exposure risk.",
      "Restarting without investigating repeats an unknown problem.",
    ],
    safetyFlag: true,
    keywords: ["ultrasonic cleaner", "equipment malfunction", "instrument processing", "scenario"],
  },
  {
    domainId: "infection_control_safety",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "What is the purpose of placing barriers on frequently touched surfaces before a patient appointment?",
    options: ["To prevent surface contamination during treatment and speed turnover.", "To make the room look cleaner for the patient.", "To replace disinfection after the appointment.", "To protect instruments from the patient."],
    correctAnswer: "To prevent surface contamination during treatment and speed turnover.",
    rationale: "Barriers limit the spread of contamination to touch points and allow quick changeover between patients.",
    wrongOptionRationales: [
      "Appearance is not the clinical reason for barriers.",
      "Barriers do not replace disinfection; they supplement it.",
      "Barriers protect surfaces, not instruments.",
    ],
    safetyFlag: true,
    keywords: ["surface barriers", "contamination prevention", "infection control", "recall"],
  },
  {
    domainId: "infection_control_safety",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A used sharps container is three-quarters full. What should happen next?",
    options: ["Close and replace it according to the office protocol for regulated waste.", "Continue using it until it is completely full.", "Empty it into the regular trash to save space.", "Move it to a different room to reduce crowding."],
    correctAnswer: "Close and replace it according to the office protocol for regulated waste.",
    rationale: "Sharps containers should be replaced when they reach the fill line (commonly three-quarters) to prevent needlestick injuries.",
    wrongOptionRationales: [
      "Overfilling increases the risk of needlestick injury.",
      "Sharps are regulated waste and cannot go in regular trash.",
      "Moving the container does not address the fill level.",
    ],
    safetyFlag: true,
    keywords: ["sharps container", "regulated waste", "needlestick prevention", "application"],
  },
  {
    domainId: "infection_control_safety",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "A new staff member asks whether Hepatitis B vaccination is required. What is the most accurate response?",
    options: ["Employers must offer the vaccine series at no cost; the employee may decline in writing.", "The vaccine is optional and the employee pays for it.", "The vaccine is only required for clinical staff who handle blood.", "It is required only after a known exposure."],
    correctAnswer: "Employers must offer the vaccine series at no cost; the employee may decline in writing.",
    rationale: "OSHA Bloodborne Pathogen Standard requires employers to offer Hepatitis B vaccination at no cost to employees with occupational exposure; employees may decline with a signed declination.",
    wrongOptionRationales: [
      "Cost is the employer's responsibility under OSHA.",
      "All staff with potential occupational blood exposure are included, not only those who handle instruments.",
      "Vaccination should be offered before exposure, not after.",
    ],
    safetyFlag: true,
    keywords: ["hepatitis b", "vaccination", "osha", "bloodborne pathogens", "scenario"],
  },
  {
    domainId: "infection_control_safety",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "Which describes the correct use of a spore test (biological indicator) for a sterilizer?",
    options: ["Run it at regular intervals and confirm the result before using loads from that cycle.", "Run it only when a new sterilizer is installed.", "Use a chemical indicator instead; spore tests are optional.", "Run it monthly regardless of manufacturer recommendation."],
    correctAnswer: "Run it at regular intervals and confirm the result before using loads from that cycle.",
    rationale: "Biological indicators confirm sterilizer function; loads should not be released if the test result is pending or failed.",
    wrongOptionRationales: [
      "Spore testing is ongoing, not a one-time installation check.",
      "Chemical indicators do not confirm sterilization efficacy; biological indicators are the gold standard.",
      "Frequency is per manufacturer and regulatory guidance, which is often weekly or more frequent.",
    ],
    safetyFlag: true,
    keywords: ["biological indicator", "spore test", "sterilizer", "application"],
  },
  {
    domainId: "infection_control_safety",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "Which category of instrument requires sterilization between patients?",
    options: ["Critical instruments that penetrate soft tissue or bone.", "Semicritical instruments that only touch mucous membranes.", "Noncritical items that contact only intact skin.", "Single-use items that are discarded after one use."],
    correctAnswer: "Critical instruments that penetrate soft tissue or bone.",
    rationale: "Critical instruments must be sterilized between patients because they contact sterile tissue and blood.",
    wrongOptionRationales: [
      "Semicritical instruments require at minimum high-level disinfection, but sterilization is preferred.",
      "Noncritical items require low- to intermediate-level disinfection.",
      "Single-use items are discarded; they are not reprocessed.",
    ],
    safetyFlag: true,
    keywords: ["critical instruments", "sterilization", "spaulding classification", "recall"],
  },
  {
    domainId: "infection_control_safety",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "The office exposure-control plan has not been reviewed in two years. What does OSHA require?",
    options: ["Annual review and update of the plan, with documentation.", "Review only when a new employee is hired.", "Review only after a known exposure incident.", "No formal review schedule is required if no exposures occurred."],
    correctAnswer: "Annual review and update of the plan, with documentation.",
    rationale: "OSHA's Bloodborne Pathogen Standard requires annual review and update of the exposure-control plan.",
    wrongOptionRationales: [
      "Annual review is required regardless of new hires.",
      "An exposure incident triggers additional review, but does not replace the annual requirement.",
      "OSHA requires the annual review even without incidents.",
    ],
    safetyFlag: true,
    keywords: ["exposure control plan", "osha", "annual review", "scenario"],
  },
  {
    domainId: "infection_control_safety",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "After applying barriers to a dental unit, the assistant realizes they forgot to place a barrier on the air-water syringe handle. What is the correct action?",
    options: ["Glove up, add the barrier now before the patient is seated.", "Skip it and disinfect the syringe handle after the appointment instead.", "Ask the patient to avoid touching it.", "Use a new syringe tip and consider it resolved."],
    correctAnswer: "Glove up, add the barrier now before the patient is seated.",
    rationale: "All frequently touched surfaces need barriers before patient care; correcting the omission before seating maintains infection control.",
    wrongOptionRationales: [
      "Skipping the barrier means the surface will become a contamination source, and post-appointment disinfection does not restore pre-procedural protection.",
      "Patient cooperation does not replace proper barrier technique.",
      "The syringe tip is separate from the handle; both require protection.",
    ],
    safetyFlag: true,
    keywords: ["surface barriers", "pre-procedure setup", "air water syringe", "application"],
  },
  {
    domainId: "infection_control_safety",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "An assistant who is pregnant asks whether they should be excluded from taking radiographs. What is the most accurate answer?",
    options: ["They may continue if proper shielding and distance protocols are followed; consult the employer and healthcare provider.", "Pregnant staff must not take any radiographs.", "No special precautions are needed because digital radiography is radiation-free.", "They should stop taking radiographs only in the third trimester."],
    correctAnswer: "They may continue if proper shielding and distance protocols are followed; consult the employer and healthcare provider.",
    rationale: "With proper distance, shielding, and ALARA practices, radiation exposure in dental radiography is very low; the decision is made individually with input from the employer and healthcare provider.",
    wrongOptionRationales: [
      "Blanket exclusion is not required; individual assessment and proper protocols address the risk.",
      "Digital radiography still uses ionizing radiation; 'radiation-free' is inaccurate.",
      "Trimester-based restrictions are not supported by general dental radiation safety guidelines; the risk is low throughout with proper protocols.",
    ],
    safetyFlag: true,
    keywords: ["pregnant staff", "radiation safety", "occupational exposure", "scenario"],
  },
];

// ─── Chairside Assisting (20 blueprints) ─────────────────────────────────────

const caBlueprints: ItemBlueprint[] = [
  {
    domainId: "chairside_assisting",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "What is the main purpose of high-volume evacuation during many dental procedures?",
    options: ["Remove fluid, aerosols, and debris from the field.", "Replace the need for PPE.", "Sterilize the tooth surface.", "Diagnose pulpal symptoms."],
    correctAnswer: "Remove fluid, aerosols, and debris from the field.",
    rationale: "High-volume evacuation supports visibility, moisture control, and exposure reduction.",
    wrongOptionRationales: [
      "PPE is still required.",
      "Evacuation does not sterilize tooth structure.",
      "Diagnosis is the dentist's role.",
    ],
    safetyFlag: true,
    keywords: ["hve", "evacuation", "aerosol", "recall"],
  },
  {
    domainId: "chairside_assisting",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "During a composite restoration, saliva pools near the preparation. What should the assistant do before the next bonding step?",
    options: ["Improve evacuation and isolation and alert the dentist that the field was contaminated.", "Hand the curing light quickly.", "Ask the patient to swallow while the dentist continues.", "Ignore it if the tooth still looks mostly dry."],
    correctAnswer: "Improve evacuation and isolation and alert the dentist that the field was contaminated.",
    rationale: "Bonding depends on isolation; contamination must be addressed before continuing.",
    wrongOptionRationales: [
      "Curing does not fix contamination.",
      "Swallowing around active treatment can be unsafe.",
      "Mostly dry is not reliable isolation.",
    ],
    safetyFlag: true,
    keywords: ["moisture control", "isolation", "bonding", "application"],
  },
  {
    domainId: "chairside_assisting",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "The patient coughs while the dentist is using a handpiece. What is the assistant's safest immediate support action?",
    options: ["Maintain suction, help clear the field, and follow the dentist's direction to pause safely.", "Remove PPE to communicate clearly.", "Tell the patient to hold still until the bur is removed.", "Reach across the field to grab the handpiece."],
    correctAnswer: "Maintain suction, help clear the field, and follow the dentist's direction to pause safely.",
    rationale: "The assistant supports airway/field control and coordinated pausing without creating a new hazard.",
    wrongOptionRationales: [
      "Removing PPE increases exposure risk.",
      "The patient may not be able to hold still during coughing.",
      "Reaching for the handpiece can create injury risk.",
    ],
    safetyFlag: true,
    keywords: ["chairside safety", "field control", "patient movement", "scenario"],
  },
  {
    domainId: "chairside_assisting",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A Class II restoration is planned. Which setup best supports the procedure?",
    options: ["Matrix system, wedge, isolation supplies, evacuation, and restorative instruments.", "Only diagnostic mirror and explorer.", "Radiographic holders and bite blocks only.", "Suture scissors and forceps only."],
    correctAnswer: "Matrix system, wedge, isolation supplies, evacuation, and restorative instruments.",
    rationale: "Class II restorative workflow commonly requires proximal wall support, dry field, and restorative instruments.",
    wrongOptionRationales: [
      "Diagnostic instruments alone are insufficient for restorative support.",
      "Radiographic holders do not support a Class II restoration.",
      "Surgical instruments are not the primary restorative setup.",
    ],
    safetyFlag: false,
    keywords: ["matrix band", "wedge", "restorative setup", "application"],
  },
  {
    domainId: "chairside_assisting",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "In four-handed dentistry, why should the working end be oriented correctly during transfer?",
    options: ["So the dentist can receive it safely and efficiently.", "So the instrument becomes sterile.", "So the assistant can diagnose the next step.", "So suction is no longer needed."],
    correctAnswer: "So the dentist can receive it safely and efficiently.",
    rationale: "Correct orientation reduces dropped instruments, delays, and soft-tissue risk.",
    wrongOptionRationales: [
      "Orientation does not sterilize an instrument.",
      "Diagnosis is not the assistant's role.",
      "Suction needs are separate from transfer orientation.",
    ],
    safetyFlag: true,
    keywords: ["instrument transfer", "working end", "four-handed dentistry", "recall"],
  },
  {
    domainId: "chairside_assisting",
    difficulty: "medium",
    stemPrefix: "Image-compatible application",
    stem: "An instrument transfer diagram labels the transfer zone near the patient's chin. What should the assistant focus on?",
    options: ["Deliver the handle while controlling the working end and retrieving the used instrument safely.", "Pass over the patient's face to shorten the movement.", "Lay instruments on the patient napkin for speed.", "Hold suction away from the field during every transfer."],
    correctAnswer: "Deliver the handle while controlling the working end and retrieving the used instrument safely.",
    rationale: "Safe transfer uses controlled delivery and retrieval without crossing unsafe areas.",
    wrongOptionRationales: [
      "Passing over the face increases injury risk.",
      "The patient napkin is not an instrument staging surface.",
      "Suction may still be needed during transfer.",
    ],
    safetyFlag: true,
    keywords: ["image-placeholder", "transfer zone", "instrument safety", "application"],
    visualPlaceholder: "Future diagram: four-handed dentistry transfer zones.",
  },
  {
    domainId: "chairside_assisting",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "The scheduled sealant tray is missing isolation supplies, but the patient is already seated. What is the best next step?",
    options: ["Correct the tray setup before the procedure starts.", "Begin and ask for supplies if moisture becomes a problem.", "Use extraction supplies because they are sterile.", "Tell the patient the procedure must be canceled."],
    correctAnswer: "Correct the tray setup before the procedure starts.",
    rationale: "Sealants require isolation; readiness means correcting missing supplies before care begins.",
    wrongOptionRationales: [
      "Waiting creates avoidable contamination risk.",
      "Sterile extraction supplies do not match the procedure.",
      "Missing supplies usually require setup correction, not automatic cancellation.",
    ],
    safetyFlag: false,
    keywords: ["tray setup", "sealant", "isolation", "scenario"],
  },
  {
    domainId: "chairside_assisting",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "When retracting a cheek during a procedure, what should the assistant monitor?",
    options: ["Soft-tissue pressure, visibility, suction position, and patient comfort.", "Only whether the dentist asks for another instrument.", "Whether the patient can answer questions.", "The shade guide selection."],
    correctAnswer: "Soft-tissue pressure, visibility, suction position, and patient comfort.",
    rationale: "Retraction supports access but must avoid unnecessary soft-tissue trauma.",
    wrongOptionRationales: [
      "Instrument requests are only one part of chairside support.",
      "The patient should not be expected to answer during active treatment.",
      "Shade selection is unrelated to retraction safety.",
    ],
    safetyFlag: true,
    keywords: ["retraction", "soft tissue", "visibility", "application"],
  },
  // New CA blueprints
  {
    domainId: "chairside_assisting",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "Why is the dental unit light positioned to avoid direct shining into the patient's eyes?",
    options: ["To prevent discomfort and protect the patient's vision.", "To improve air circulation in the operatory.", "To allow the patient to watch the procedure.", "To keep the light from heating the instrument tray."],
    correctAnswer: "To prevent discomfort and protect the patient's vision.",
    rationale: "The dental light is bright and can cause discomfort or temporary vision disturbance; it should be aimed at the mouth, not the eyes.",
    wrongOptionRationales: [
      "Air circulation is not affected by light position.",
      "Patients generally should not watch the procedure in progress.",
      "Instrument heating from the light is not a primary concern addressed by light positioning.",
    ],
    safetyFlag: true,
    keywords: ["dental light", "patient comfort", "vision protection", "recall"],
  },
  {
    domainId: "chairside_assisting",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A patient is being prepared for a mandibular procedure. What is the correct chair position for access?",
    options: ["Reclined with the mandibular arch parallel to the floor when the mouth is open.", "Fully upright with the mouth at the dentist's eye level.", "Head tilted back maximally at all times.", "Chair position does not affect access to the mandibular arch."],
    correctAnswer: "Reclined with the mandibular arch parallel to the floor when the mouth is open.",
    rationale: "For mandibular work, the chair is reclined so that the lower arch is roughly parallel to the floor, giving the dentist ergonomic access.",
    wrongOptionRationales: [
      "Fully upright does not provide optimal access for mandibular procedures.",
      "Maximum head tilt is not always appropriate and may compromise airway management.",
      "Chair position directly affects access, visibility, and ergonomics.",
    ],
    safetyFlag: false,
    keywords: ["chair positioning", "mandibular", "access", "application"],
  },
  {
    domainId: "chairside_assisting",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "An assistant is using an air-water syringe to rinse the field. What technique prevents aspiration risk?",
    options: ["Keep suction active while rinsing and rinse away from the throat.", "Rinse directly toward the back of the mouth for thoroughness.", "Pause suction so the patient can swallow.", "Use air only and skip water rinse."],
    correctAnswer: "Keep suction active while rinsing and rinse away from the throat.",
    rationale: "Active suction and directional control prevent pooled fluid from reaching the airway.",
    wrongOptionRationales: [
      "Directing rinse toward the throat increases aspiration risk.",
      "Pausing suction allows fluid to accumulate near the airway.",
      "Water rinse is often necessary; eliminating it is not the safest solution.",
    ],
    safetyFlag: true,
    keywords: ["air water syringe", "aspiration risk", "suction", "application"],
  },
  {
    domainId: "chairside_assisting",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "A patient asks during a procedure whether the dentist found any cavities. What is the safest response?",
    options: ["Tell the patient the dentist will discuss findings with them after the procedure.", "Confirm or deny based on what the assistant observed.", "Change the subject to avoid the question.", "Tell the patient to ask the front desk."],
    correctAnswer: "Tell the patient the dentist will discuss findings with them after the procedure.",
    rationale: "Clinical findings and diagnoses must be communicated by the dentist; the assistant should redirect the question appropriately.",
    wrongOptionRationales: [
      "Confirming or denying observations crosses into diagnosis.",
      "Changing the subject is evasive and unprofessional.",
      "Referring the patient to front desk for a clinical question is inappropriate.",
    ],
    safetyFlag: true,
    keywords: ["scope", "patient communication", "diagnosis redirect", "scenario"],
  },
  {
    domainId: "chairside_assisting",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "What is the purpose of articulating paper in restorative dentistry?",
    options: ["To identify high spots in a restoration by marking occlusal contacts.", "To protect the restoration from moisture.", "To check the shade of composite.", "To measure the depth of a cavity preparation."],
    correctAnswer: "To identify high spots in a restoration by marking occlusal contacts.",
    rationale: "Articulating paper marks where teeth contact during occlusion, allowing the dentist to identify and adjust high areas.",
    wrongOptionRationales: [
      "Articulating paper is not a moisture barrier.",
      "Shade checking uses a shade guide.",
      "Preparation depth is measured with a probe or explorer.",
    ],
    safetyFlag: false,
    keywords: ["articulating paper", "occlusal adjustment", "restoration", "recall"],
  },
  {
    domainId: "chairside_assisting",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "After a patient receives local anesthesia, they ask how long they will be numb. What is the safest RDA response?",
    options: ["Give a general estimate and advise the patient to avoid eating or biting until sensation returns.", "Tell them exactly two hours.", "Say numbness does not affect eating safety.", "Refuse to answer and redirect to the front desk."],
    correctAnswer: "Give a general estimate and advise the patient to avoid eating or biting until sensation returns.",
    rationale: "Duration varies by agent; the assistant can give a general range and safety guidance about avoiding injury while numb.",
    wrongOptionRationales: [
      "Exact timing depends on the anesthetic agent, volume, and patient factors.",
      "Numbness does affect eating safety — patients can bite their cheek or lip without realizing it.",
      "This is a routine patient education question the assistant can address within scope.",
    ],
    safetyFlag: true,
    keywords: ["local anesthesia", "post-procedure instruction", "patient education", "application"],
  },
  {
    domainId: "chairside_assisting",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "A young child patient begins crying and refuses to open their mouth. The dentist has not yet entered. What is the most appropriate action?",
    options: ["Stay calm, speak at the child's level, and notify the dentist of the behavior before starting.", "Proceed with the exam using a mouth prop.", "Ask the parent to leave so the child focuses.", "Tell the child the appointment will be very quick."],
    correctAnswer: "Stay calm, speak at the child's level, and notify the dentist of the behavior before starting.",
    rationale: "Behavior management is a clinical decision; the assistant should use supportive communication and inform the dentist so the appropriate approach can be chosen.",
    wrongOptionRationales: [
      "Using a mouth prop without dentist direction and patient cooperation is inappropriate.",
      "Parent presence often helps pediatric patients; removal is a clinical decision.",
      "Rushing through the appointment does not address the child's distress.",
    ],
    safetyFlag: true,
    keywords: ["pediatric patient", "behavior management", "communication", "scenario"],
  },
  {
    domainId: "chairside_assisting",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "What is the RDA's primary role when the dentist administers a local anesthetic injection?",
    options: ["Monitor the patient, maintain the field, and have emergency supplies accessible.", "Aspirate for the dentist.", "Document the injection location independently.", "Alert the office manager."],
    correctAnswer: "Monitor the patient, maintain the field, and have emergency supplies accessible.",
    rationale: "Injection monitoring includes observing the patient for adverse reactions, keeping the field ready, and ensuring emergency equipment is available.",
    wrongOptionRationales: [
      "Aspiration during injection is the dentist's technique.",
      "Documentation follows the injection; it is not the primary intra-procedure role.",
      "The office manager is not involved in routine injection monitoring.",
    ],
    safetyFlag: true,
    keywords: ["local anesthesia", "monitoring", "emergency readiness", "application"],
  },
  {
    domainId: "chairside_assisting",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "A patient becomes pale and says they feel faint shortly after the local anesthetic injection. What is the best first action?",
    options: ["Lower the chair, elevate the legs, monitor the patient, and alert the dentist immediately.", "Give the patient water and ask them to breathe slowly.", "Proceed with the procedure quickly before the patient feels worse.", "Ask the patient to stand and walk it off."],
    correctAnswer: "Lower the chair, elevate the legs, monitor the patient, and alert the dentist immediately.",
    rationale: "Syncope is managed by lowering the chair, elevating the legs to restore cerebral blood flow, monitoring vitals, and getting the dentist involved.",
    wrongOptionRationales: [
      "Water and breathing coaching alone do not address a syncopal event properly.",
      "Proceeding with treatment when the patient is showing syncope symptoms is inappropriate.",
      "Standing increases the risk of fall and worsens syncope.",
    ],
    safetyFlag: true,
    keywords: ["syncope", "vasovagal", "emergency", "patient safety", "scenario"],
  },
  {
    domainId: "chairside_assisting",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "What does the RDA do with post-operative instructions after a dental extraction?",
    options: ["Provide written and verbal instructions as directed by the dentist.", "Explain only if the patient asks.", "Give instructions only to adults, not minors.", "Skip verbal instructions if written ones are provided."],
    correctAnswer: "Provide written and verbal instructions as directed by the dentist.",
    rationale: "Post-operative instructions reinforce patient safety and require both written and verbal delivery to support patient understanding.",
    wrongOptionRationales: [
      "Waiting for the patient to ask means critical information may be missed.",
      "Minors and their guardians both need to understand post-operative care.",
      "Both formats reinforce understanding; skipping verbal reduces retention.",
    ],
    safetyFlag: true,
    keywords: ["post-op instructions", "patient education", "extraction", "recall"],
  },
  {
    domainId: "chairside_assisting",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A patient receiving nitrous oxide and oxygen says they feel dizzy and anxious mid-procedure. What is the correct response?",
    options: ["Reduce or stop nitrous oxide, increase oxygen flow, alert the dentist, and monitor the patient.", "Increase nitrous to help the patient relax faster.", "Tell the patient these feelings are normal and continue.", "Stop all gases and remove the mask without telling the dentist."],
    correctAnswer: "Reduce or stop nitrous oxide, increase oxygen flow, alert the dentist, and monitor the patient.",
    rationale: "Adverse nitrous oxide response requires reducing the agent, delivering 100% oxygen, and immediately involving the dentist.",
    wrongOptionRationales: [
      "Increasing nitrous when the patient has adverse symptoms worsens the reaction.",
      "Dizziness and anxiety are not normal responses that should be dismissed.",
      "The dentist must be involved in managing any adverse reaction to nitrous oxide.",
    ],
    safetyFlag: true,
    keywords: ["nitrous oxide", "adverse reaction", "oxygen", "emergency", "application"],
  },
];

// ─── Dental Radiography (16 blueprints) ──────────────────────────────────────

const drBlueprints: ItemBlueprint[] = [
  {
    domainId: "dental_radiography",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "What does ALARA mean in dental radiography?",
    options: ["Keep radiation exposure as low as reasonably achievable.", "Always retake unclear images.", "Use the highest setting for the clearest image.", "Avoid all radiographs for every patient."],
    correctAnswer: "Keep radiation exposure as low as reasonably achievable.",
    rationale: "ALARA balances diagnostic need with minimizing unnecessary exposure.",
    wrongOptionRationales: [
      "Retakes must be justified, not automatic.",
      "Higher exposure is not a safety principle.",
      "Avoiding all radiographs ignores diagnostic need.",
    ],
    safetyFlag: true,
    keywords: ["alara", "radiation safety", "recall"],
  },
  {
    domainId: "dental_radiography",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A bitewing shows overlapped contacts. Which correction best matches the error?",
    options: ["Adjust horizontal angulation.", "Increase exposure time.", "Use a smaller receptor.", "Ask the patient to bite harder only."],
    correctAnswer: "Adjust horizontal angulation.",
    rationale: "Overlapped contacts usually indicate incorrect horizontal angulation.",
    wrongOptionRationales: [
      "Exposure time affects density, not contact overlap.",
      "Receptor size does not correct beam angle.",
      "Biting harder alone does not correct horizontal angulation.",
    ],
    safetyFlag: false,
    keywords: ["overlap", "horizontal angulation", "bitewing", "application"],
    visualPlaceholder: "Future diagram: bitewing with overlapped contacts.",
  },
  {
    domainId: "dental_radiography",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A periapical image has a clear cone cut. What should be corrected?",
    options: ["PID alignment with the receptor.", "The patient's medical history form.", "The exposure button pressure.", "The charting abbreviation."],
    correctAnswer: "PID alignment with the receptor.",
    rationale: "A cone cut occurs when the x-ray beam does not cover the receptor.",
    wrongOptionRationales: [
      "Medical history does not cause cone cut.",
      "Button pressure does not align the beam.",
      "Charting terms do not affect exposure geometry.",
    ],
    safetyFlag: false,
    keywords: ["cone cut", "pid", "receptor", "application"],
    visualPlaceholder: "Future diagram: receptor partially outside x-ray beam.",
  },
  {
    domainId: "dental_radiography",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "A nervous patient moves during exposure and the image is nondiagnostic. What is the best response before retaking?",
    options: ["Explain the procedure again, reposition, coach stillness, and retake only if needed.", "Retake immediately without explanation.", "Tell the patient movement is not allowed and proceed.", "Increase exposure to compensate for motion."],
    correctAnswer: "Explain the procedure again, reposition, coach stillness, and retake only if needed.",
    rationale: "Patient coaching and correct positioning reduce motion retakes while honoring ALARA.",
    wrongOptionRationales: [
      "Immediate retake may repeat the same error.",
      "Scolding does not support patient cooperation.",
      "Exposure settings do not solve movement blur appropriately.",
    ],
    safetyFlag: true,
    keywords: ["motion", "retake", "patient instruction", "scenario"],
  },
  {
    domainId: "dental_radiography",
    difficulty: "hard",
    stemPrefix: "Image-compatible scenario",
    stem: "A periapical image shows elongated roots. What technique issue is most likely?",
    options: ["Insufficient vertical angulation.", "Too much horizontal angulation.", "Expired disinfectant.", "Wrong matrix band size."],
    correctAnswer: "Insufficient vertical angulation.",
    rationale: "Elongation is commonly associated with insufficient vertical angulation.",
    wrongOptionRationales: [
      "Horizontal angulation is more associated with overlapped contacts.",
      "Disinfectant status does not change image geometry.",
      "Matrix band size is restorative, not radiographic.",
    ],
    safetyFlag: false,
    keywords: ["image-placeholder", "elongation", "vertical angulation", "scenario"],
    visualPlaceholder: "Future diagram: elongated periapical radiograph.",
  },
  {
    domainId: "dental_radiography",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A patient asks if the assistant can interpret a dark area on a radiograph. What is the best response?",
    options: ["Tell the patient the dentist will review and explain the image.", "Diagnose it if it looks obvious.", "Say it is definitely decay.", "Delete the image if the patient is worried."],
    correctAnswer: "Tell the patient the dentist will review and explain the image.",
    rationale: "The RDA can support imaging but diagnosis and interpretation belong to the dentist.",
    wrongOptionRationales: [
      "Obvious appearance does not authorize diagnosis.",
      "A definite diagnosis is outside RDA role.",
      "Deleting the image is inappropriate and does not address the concern.",
    ],
    safetyFlag: true,
    keywords: ["scope", "radiograph interpretation", "patient question", "application"],
  },
  {
    domainId: "dental_radiography",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "What should be checked before exposing a dental radiograph?",
    options: ["Correct receptor placement, beam alignment, patient instructions, and operator position.", "Only whether the patient has paid.", "Only whether the room lights are off.", "Whether the dentist is in the room for every exposure."],
    correctAnswer: "Correct receptor placement, beam alignment, patient instructions, and operator position.",
    rationale: "Technique and safety checks reduce retakes and exposure risk.",
    wrongOptionRationales: [
      "Payment status is not an exposure safety check.",
      "Room lighting is not the core radiography safety issue.",
      "Office rules vary, but the technique and safety checks remain necessary.",
    ],
    safetyFlag: true,
    keywords: ["receptor placement", "beam alignment", "operator safety", "recall"],
  },
  {
    domainId: "dental_radiography",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "A patient refuses a radiograph because of radiation concerns. What is the best RDA response?",
    options: ["Acknowledge the concern and alert the dentist so the need and options can be discussed.", "Tell the patient radiographs are mandatory and proceed.", "Cancel the appointment without notifying anyone.", "Promise there is no radiation exposure."],
    correctAnswer: "Acknowledge the concern and alert the dentist so the need and options can be discussed.",
    rationale: "The assistant should communicate respectfully and involve the dentist for clinical decisions.",
    wrongOptionRationales: [
      "Proceeding over refusal is not appropriate.",
      "Canceling independently is not the best chairside response.",
      "Radiographs involve radiation, even when minimized.",
    ],
    safetyFlag: true,
    keywords: ["patient refusal", "radiation concern", "scope", "scenario"],
  },
  // New DR blueprints
  {
    domainId: "dental_radiography",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "Which protective item should always be placed on the patient before dental radiograph exposure?",
    options: ["Lead apron with thyroid collar.", "Surgical drape only.", "Safety glasses only.", "Sterile gloves."],
    correctAnswer: "Lead apron with thyroid collar.",
    rationale: "A lead apron and thyroid collar protect the patient's body and thyroid gland from scatter radiation.",
    wrongOptionRationales: [
      "A surgical drape does not attenuate radiation.",
      "Safety glasses do not protect against scatter radiation to the body.",
      "Sterile gloves are infection control items, not radiation protection.",
    ],
    safetyFlag: true,
    keywords: ["lead apron", "thyroid collar", "patient protection", "recall"],
  },
  {
    domainId: "dental_radiography",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A periapical image shows foreshortened roots. What technique correction is indicated?",
    options: ["Decrease vertical angulation.", "Increase horizontal angulation.", "Use a larger receptor.", "Increase exposure time."],
    correctAnswer: "Decrease vertical angulation.",
    rationale: "Foreshortening occurs when vertical angulation is too steep; decreasing it elongates the image back toward true length.",
    wrongOptionRationales: [
      "Horizontal angulation correction addresses overlapping, not length distortion.",
      "Receptor size does not correct angulation error.",
      "Exposure time affects density, not image geometry.",
    ],
    safetyFlag: false,
    keywords: ["foreshortening", "vertical angulation", "periapical", "application"],
    visualPlaceholder: "Future diagram: foreshortened periapical radiograph.",
  },
  {
    domainId: "dental_radiography",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "When positioning a patient for a panoramic radiograph, the assistant notices the patient's chin is tilted upward. What error will this likely cause?",
    options: ["Reverse smile line with blurred anterior teeth.", "Overlapped posterior contacts.", "Cone cut on the anterior region.", "Ghost images of dental restorations."],
    correctAnswer: "Reverse smile line with blurred anterior teeth.",
    rationale: "Chin tilted up causes the Frankfort plane to be angled down, producing a reverse (frowning) smile line on the panoramic image.",
    wrongOptionRationales: [
      "Overlapped contacts are a periapical/bitewing positioning error.",
      "Cone cut results from PID-receptor misalignment.",
      "Ghost images are caused by radiopaque objects outside the focal trough, not head tilt.",
    ],
    safetyFlag: false,
    keywords: ["panoramic", "chin position", "frankfort plane", "application"],
  },
  {
    domainId: "dental_radiography",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "The assistant is about to expose a digital sensor. The bite tab is contaminated from a prior patient. What is the correct action?",
    options: ["Replace the bite tab barrier and ensure the sensor is properly covered before proceeding.", "Wipe the bite tab with disinfectant and continue.", "Use the same tab because the barrier was on top.", "Ask the patient to hold the sensor in their hand first."],
    correctAnswer: "Replace the bite tab barrier and ensure the sensor is properly covered before proceeding.",
    rationale: "Digital sensors are critical items; cross-contamination risk requires replacing barriers and confirming proper coverage before any patient use.",
    wrongOptionRationales: [
      "Surface disinfectant does not make the bite tab suitable for intraoral use.",
      "The barrier being present previously does not mean it can be reused.",
      "Patient handling of the uncovered sensor without barriers is not safe.",
    ],
    safetyFlag: true,
    keywords: ["digital sensor", "barrier", "infection control", "scenario"],
  },
  {
    domainId: "dental_radiography",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "What is the paralleling technique designed to achieve in periapical radiography?",
    options: ["The receptor is parallel to the long axis of the tooth and the beam is perpendicular to both.", "The beam bisects the angle between tooth and receptor.", "The receptor is angled to minimize patient discomfort.", "The PID is aimed at the back of the patient's head."],
    correctAnswer: "The receptor is parallel to the long axis of the tooth and the beam is perpendicular to both.",
    rationale: "The paralleling technique produces the most accurate image by keeping the receptor parallel to the tooth and the beam at right angles to both.",
    wrongOptionRationales: [
      "Bisecting the angle is a different technique associated with more distortion.",
      "Patient comfort is secondary to accurate technique.",
      "Aiming at the back of the head is not a radiographic principle.",
    ],
    safetyFlag: false,
    keywords: ["paralleling technique", "receptor position", "periapical", "recall"],
  },
  {
    domainId: "dental_radiography",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "An image on the monitor appears very dark (overexposed). What is the most likely cause?",
    options: ["Exposure settings are too high for the patient or area.", "The receptor was placed incorrectly.", "The patient moved during exposure.", "The cone was placed too far from the face."],
    correctAnswer: "Exposure settings are too high for the patient or area.",
    rationale: "Overexposure (too dark on digital) is primarily caused by excessive kVp, mA, or exposure time settings.",
    wrongOptionRationales: [
      "Incorrect receptor placement causes geometric errors, not overall density.",
      "Patient movement causes blurring, not a uniformly dark image.",
      "PID distance affects magnification and penumbra, not overall density this way.",
    ],
    safetyFlag: true,
    keywords: ["overexposure", "density", "digital radiograph", "scenario"],
  },
  {
    domainId: "dental_radiography",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A child patient needs bitewings but gags easily. What technique adjustment is most appropriate?",
    options: ["Use smaller receptors, place them quickly and precisely, and coach the child calmly.", "Increase the exposure time to compensate for shorter placement.", "Skip the bitewings and take only a panoramic.", "Ask the parent to hold the receptor in place."],
    correctAnswer: "Use smaller receptors, place them quickly and precisely, and coach the child calmly.",
    rationale: "Pediatric radiography uses size-appropriate receptors; efficient technique and positive reinforcement reduce gag reflex triggering.",
    wrongOptionRationales: [
      "Exposure time does not address the gag reflex.",
      "Panoramic alone may not provide the diagnostic detail of bitewings; that is a dentist decision, not an automatic substitution.",
      "Parent-held receptors create exposure risk for the parent.",
    ],
    safetyFlag: true,
    keywords: ["pediatric radiography", "gag reflex", "receptor size", "application"],
  },
  {
    domainId: "dental_radiography",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "An assistant notices the operator's barrier at the exposure panel was not changed between patients. What is the priority action?",
    options: ["Decontaminate the panel now, update the exposure log, and review the barrier protocol with staff.", "Leave it because the panel is not in the patient's mouth.", "Cover the panel with a new barrier without cleaning underneath.", "Report it only if a patient complains.", ],
    correctAnswer: "Decontaminate the panel now, update the exposure log, and review the barrier protocol with staff.",
    rationale: "The exposure panel is a touch surface that must be covered between patients; discovered lapses require correction and protocol reinforcement.",
    wrongOptionRationales: [
      "Touch surfaces outside the mouth are still cross-contamination vectors.",
      "Adding a new barrier over a contaminated surface does not decontaminate it.",
      "Patient complaints are not the standard for identifying infection control failures.",
    ],
    safetyFlag: true,
    keywords: ["exposure panel", "surface barrier", "cross-contamination", "scenario"],
  },
];

// ─── Dental Anatomy & Terminology (14 blueprints) ────────────────────────────

const datBlueprints: ItemBlueprint[] = [
  {
    domainId: "dental_anatomy_terminology",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "In dental surface terminology, what does occlusal refer to?",
    options: ["The chewing surface of posterior teeth.", "The tongue side of all teeth.", "The surface toward the midline.", "The root tip."],
    correctAnswer: "The chewing surface of posterior teeth.",
    rationale: "Occlusal refers to the biting or chewing surface of posterior teeth.",
    wrongOptionRationales: [
      "Tongue side is lingual.",
      "Toward the midline is mesial.",
      "Root tip is apical.",
    ],
    safetyFlag: false,
    keywords: ["occlusal", "surfaces", "recall"],
  },
  {
    domainId: "dental_anatomy_terminology",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "The dentist says tooth #30 MO. What should the assistant understand?",
    options: ["Tooth #30, mesial-occlusal surfaces.", "Tooth #30, facial-lingual surfaces.", "Primary tooth M, occlusal surface.", "All surfaces of tooth #30."],
    correctAnswer: "Tooth #30, mesial-occlusal surfaces.",
    rationale: "MO means mesial-occlusal; accurate surface language prevents wrong-surface errors.",
    wrongOptionRationales: [
      "FL means facial-lingual, not MO.",
      "#30 is permanent numbering, not a primary letter.",
      "MO does not mean all surfaces.",
    ],
    safetyFlag: true,
    keywords: ["tooth numbering", "mesial", "occlusal", "application"],
  },
  {
    domainId: "dental_anatomy_terminology",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "Which term describes the surface of a mandibular molar facing the tongue?",
    options: ["Lingual.", "Buccal.", "Labial.", "Occlusal."],
    correctAnswer: "Lingual.",
    rationale: "Lingual surfaces face the tongue.",
    wrongOptionRationales: [
      "Buccal faces the cheek.",
      "Labial faces the lip, usually anterior teeth.",
      "Occlusal is the chewing surface.",
    ],
    safetyFlag: false,
    keywords: ["lingual", "surface", "terminology", "application"],
  },
  {
    domainId: "dental_anatomy_terminology",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "The assistant is unsure whether the dentist said #18 DO or #19 DO during charting. What should the assistant do?",
    options: ["Clarify before entering the chart note.", "Choose the tooth that looks more likely.", "Enter both teeth to be safe.", "Leave the chart blank and say nothing."],
    correctAnswer: "Clarify before entering the chart note.",
    rationale: "Unclear tooth information should be clarified to prevent wrong-tooth documentation.",
    wrongOptionRationales: [
      "Guessing creates record and safety risk.",
      "Entering both teeth adds false information.",
      "Silence leaves an unresolved documentation problem.",
    ],
    safetyFlag: true,
    keywords: ["charting", "clarify", "wrong tooth", "scenario"],
  },
  {
    domainId: "dental_anatomy_terminology",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "Which dentition stage includes both primary and permanent teeth?",
    options: ["Mixed dentition.", "Primary dentition.", "Permanent dentition.", "Edentulous dentition."],
    correctAnswer: "Mixed dentition.",
    rationale: "Mixed dentition means both primary and permanent teeth are present.",
    wrongOptionRationales: [
      "Primary dentition contains baby teeth only.",
      "Permanent dentition contains adult teeth only.",
      "Edentulous means no natural teeth in an arch or mouth.",
    ],
    safetyFlag: false,
    keywords: ["mixed dentition", "eruption", "recall"],
  },
  {
    domainId: "dental_anatomy_terminology",
    difficulty: "medium",
    stemPrefix: "Image-compatible application",
    stem: "A tooth diagram labels mesial and distal surfaces. What should the assistant remember?",
    options: ["Mesial is toward the midline; distal is away from the midline.", "Mesial is always left; distal is always right.", "Mesial means tongue side; distal means cheek side.", "Mesial and distal only apply to primary teeth."],
    correctAnswer: "Mesial is toward the midline; distal is away from the midline.",
    rationale: "Mesial and distal are directional terms based on the dental midline, not left or right.",
    wrongOptionRationales: [
      "Left and right change depending on side of the arch.",
      "Tongue and cheek sides are lingual and buccal/facial.",
      "The terms apply to primary and permanent teeth.",
    ],
    safetyFlag: false,
    keywords: ["image-placeholder", "mesial", "distal", "application"],
    visualPlaceholder: "Future diagram: arch midline and proximal surfaces.",
  },
  {
    domainId: "dental_anatomy_terminology",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A patient asks what 'facial staining on #8' means. What is an RDA-safe response?",
    options: ["Explain that facial refers to the front-facing surface and the dentist can discuss significance.", "Tell the patient it means decay.", "Say it means the tooth needs whitening.", "Ignore the question because assistants cannot speak to patients."],
    correctAnswer: "Explain that facial refers to the front-facing surface and the dentist can discuss significance.",
    rationale: "The assistant may explain terminology without diagnosing the finding.",
    wrongOptionRationales: [
      "Staining is not automatically decay.",
      "Whitening recommendation is a treatment suggestion.",
      "Assistants can communicate within role and escalate clinical interpretation.",
    ],
    safetyFlag: true,
    keywords: ["facial", "patient communication", "scope", "application"],
  },
  {
    domainId: "dental_anatomy_terminology",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "A chart entry is about to be made for a planned restoration, but the assistant only heard the surface and not the tooth number. What is the best action?",
    options: ["Ask for clarification before charting.", "Use the last tooth mentioned.", "Record the surface without a tooth number.", "Wait until the end and try to remember."],
    correctAnswer: "Ask for clarification before charting.",
    rationale: "Incomplete charting information should be clarified immediately to protect record accuracy.",
    wrongOptionRationales: [
      "Using the last tooth mentioned is guessing.",
      "A surface without a tooth number is incomplete.",
      "Waiting increases the chance of documentation error.",
    ],
    safetyFlag: true,
    keywords: ["charting accuracy", "clarification", "scenario"],
  },
  // New DAT blueprints
  {
    domainId: "dental_anatomy_terminology",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "How many teeth are in a complete permanent adult dentition?",
    options: ["32 teeth.", "28 teeth.", "20 teeth.", "24 teeth."],
    correctAnswer: "32 teeth.",
    rationale: "A complete permanent dentition includes 32 teeth, including four third molars (wisdom teeth).",
    wrongOptionRationales: [
      "28 teeth is the count when third molars are absent or not yet erupted.",
      "20 teeth is the primary dentition count.",
      "24 is not a standard dentition count.",
    ],
    safetyFlag: false,
    keywords: ["permanent dentition", "tooth count", "recall"],
  },
  {
    domainId: "dental_anatomy_terminology",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "Using the Universal Numbering System, which tooth is the maxillary left first molar?",
    options: ["Tooth #14.", "Tooth #3.", "Tooth #19.", "Tooth #30."],
    correctAnswer: "Tooth #14.",
    rationale: "In the Universal System, #14 is the maxillary left first molar; numbering begins at the upper right third molar (#1) and proceeds clockwise.",
    wrongOptionRationales: [
      "#3 is the maxillary right first molar.",
      "#19 is the mandibular left first molar.",
      "#30 is the mandibular right first molar.",
    ],
    safetyFlag: false,
    keywords: ["universal numbering", "maxillary", "first molar", "application"],
  },
  {
    domainId: "dental_anatomy_terminology",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A dentist charts 'perio pocket 5 mm #30 MB.' What does MB indicate?",
    options: ["Mesiobuccal root or surface of tooth #30.", "Mandibular buccal surface of tooth #30.", "Mesial and buccal cusps together.", "Mid-buccal groove location."],
    correctAnswer: "Mesiobuccal root or surface of tooth #30.",
    rationale: "MB is a standard abbreviation for the mesiobuccal surface or root, used during periodontal charting of posterior teeth.",
    wrongOptionRationales: [
      "Mandibular buccal is not standard notation; the arch is indicated by tooth number.",
      "Cusp identification uses different notation during charting.",
      "Mid-buccal groove is anatomic notation not used in periodontal charting.",
    ],
    safetyFlag: false,
    keywords: ["mesiobuccal", "periodontal charting", "abbreviation", "application"],
  },
  {
    domainId: "dental_anatomy_terminology",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "An assistant charts 'DO composite #29' but the dentist actually said '#19 DO composite.' What is the immediate concern?",
    options: ["Wrong-tooth documentation that could lead to treatment errors.", "Spelling differences in the abbreviation.", "Whether the composite was the right material.", "The chart is electronic so corrections are automatic."],
    correctAnswer: "Wrong-tooth documentation that could lead to treatment errors.",
    rationale: "Wrong-tooth chart entries create patient safety risk; immediate correction with documentation of the error is required.",
    wrongOptionRationales: [
      "Abbreviation format is not the primary concern here.",
      "Material choice is a separate clinical decision not related to the entry error.",
      "Electronic records do not auto-correct human documentation errors.",
    ],
    safetyFlag: true,
    keywords: ["wrong tooth", "documentation error", "patient safety", "scenario"],
  },
  {
    domainId: "dental_anatomy_terminology",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "Which surface of an anterior tooth faces the lip?",
    options: ["Labial.", "Lingual.", "Mesial.", "Incisal."],
    correctAnswer: "Labial.",
    rationale: "The labial surface of anterior teeth faces the lips.",
    wrongOptionRationales: [
      "Lingual faces the tongue.",
      "Mesial faces the midline.",
      "Incisal is the biting edge of anterior teeth.",
    ],
    safetyFlag: false,
    keywords: ["labial", "anterior teeth", "surface", "recall"],
  },
  {
    domainId: "dental_anatomy_terminology",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "The dentist asks for the tooth with two cusps and two roots in the maxillary arch. Which type of tooth is this most likely describing?",
    options: ["Maxillary first premolar.", "Maxillary canine.", "Maxillary central incisor.", "Maxillary second molar."],
    correctAnswer: "Maxillary first premolar.",
    rationale: "The maxillary first premolar characteristically has two cusps (buccal and lingual) and two roots (buccal and lingual).",
    wrongOptionRationales: [
      "The maxillary canine has one cusp and one root.",
      "The maxillary central incisor has one root and an incisal edge.",
      "The maxillary second molar typically has three roots and more than two cusps.",
    ],
    safetyFlag: false,
    keywords: ["premolar", "maxillary", "root anatomy", "application"],
  },
];

// ─── Instruments & Materials (14 blueprints) ─────────────────────────────────

const imBlueprints: ItemBlueprint[] = [
  {
    domainId: "instruments_materials",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "Which instrument is commonly used to detect irregularities on tooth surfaces?",
    options: ["Explorer.", "Cotton pliers.", "Amalgam carrier.", "Matrix retainer."],
    correctAnswer: "Explorer.",
    rationale: "An explorer is a diagnostic instrument used to feel surface irregularities.",
    wrongOptionRationales: [
      "Cotton pliers carry small items.",
      "An amalgam carrier transports amalgam.",
      "A matrix retainer holds a matrix band.",
    ],
    safetyFlag: false,
    keywords: ["explorer", "instrument identification", "recall"],
  },
  {
    domainId: "instruments_materials",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A cement has a short working time. What should the assistant do?",
    options: ["Prepare only when the field and dentist are ready and follow manufacturer timing.", "Mix early to stay ahead.", "Add extra liquid if it starts to thicken.", "Use it after set if it can still be moved."],
    correctAnswer: "Prepare only when the field and dentist are ready and follow manufacturer timing.",
    rationale: "Working time affects material performance; preparation should match readiness and instructions.",
    wrongOptionRationales: [
      "Mixing early can waste working time.",
      "Changing proportions can alter material properties.",
      "Material past working time should not be forced into use.",
    ],
    safetyFlag: false,
    keywords: ["cement", "working time", "manufacturer instructions", "application"],
  },
  {
    domainId: "instruments_materials",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "An impression patient starts gagging after tray insertion. What is the best assistant response?",
    options: ["Support the patient calmly, maintain safety, and alert or follow the dentist's direction.", "Tell the patient not to move until the material sets.", "Leave the room to get another tray.", "Push the tray farther back to finish faster."],
    correctAnswer: "Support the patient calmly, maintain safety, and alert or follow the dentist's direction.",
    rationale: "Patient distress requires calm support, monitoring, and provider-directed response.",
    wrongOptionRationales: [
      "Demanding stillness ignores distress.",
      "Leaving removes needed monitoring.",
      "Pushing farther can worsen gagging and safety risk.",
    ],
    safetyFlag: true,
    keywords: ["impression", "gagging", "patient safety", "scenario"],
  },
  {
    domainId: "instruments_materials",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A Class II restoration requires restoring proximal contour. Which item is most relevant to have ready?",
    options: ["Matrix band and wedge.", "Thyroid collar.", "Suture needle.", "Fluoride tray only."],
    correctAnswer: "Matrix band and wedge.",
    rationale: "A matrix band and wedge support proximal wall contour and adaptation during restorative care.",
    wrongOptionRationales: [
      "A thyroid collar is radiography protection.",
      "Suture needles are surgical supplies.",
      "A fluoride tray is preventive, not Class II restorative support.",
    ],
    safetyFlag: false,
    keywords: ["matrix band", "wedge", "proximal contour", "application"],
  },
  {
    domainId: "instruments_materials",
    difficulty: "medium",
    stemPrefix: "Image-compatible application",
    stem: "A tray includes a mouth mirror, explorer, cotton pliers, and condenser. Which item carries small objects such as cotton pellets?",
    options: ["Cotton pliers.", "Mouth mirror.", "Explorer.", "Condenser."],
    correctAnswer: "Cotton pliers.",
    rationale: "Cotton pliers transfer small items to and from the mouth.",
    wrongOptionRationales: [
      "The mirror supports vision and retraction.",
      "The explorer detects irregularities.",
      "The condenser packs restorative material.",
    ],
    safetyFlag: false,
    keywords: ["image-placeholder", "cotton pliers", "tray setup", "application"],
    visualPlaceholder: "Future diagram: basic restorative tray instruments.",
  },
  {
    domainId: "instruments_materials",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "A material container is expired but appears normal. The schedule is running late. What should the assistant do?",
    options: ["Do not use it; follow office protocol for replacement or escalation.", "Use it because appearance is more important than date.", "Mix longer to compensate.", "Ask the patient whether they mind."],
    correctAnswer: "Do not use it; follow office protocol for replacement or escalation.",
    rationale: "Expiration and storage matter for material performance and patient safety.",
    wrongOptionRationales: [
      "Appearance does not confirm material integrity.",
      "Longer mixing does not reverse expiration.",
      "Patient permission does not make expired material appropriate.",
    ],
    safetyFlag: true,
    keywords: ["expiration", "material safety", "protocol", "scenario"],
  },
  {
    domainId: "instruments_materials",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "What is the purpose of an SDS in a dental office?",
    options: ["Provide hazard, handling, storage, and exposure information for chemicals.", "List patient treatment plans.", "Replace manufacturer directions for all clinical steps.", "Diagnose allergic reactions."],
    correctAnswer: "Provide hazard, handling, storage, and exposure information for chemicals.",
    rationale: "Safety Data Sheets support safe chemical handling and exposure response.",
    wrongOptionRationales: [
      "Treatment plans belong in patient records.",
      "SDS does not replace product-specific clinical instructions.",
      "Diagnosis is not an SDS function.",
    ],
    safetyFlag: true,
    keywords: ["sds", "chemical safety", "storage", "recall"],
  },
  {
    domainId: "instruments_materials",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "Which action best protects material accuracy when taking an alginate impression?",
    options: ["Follow powder-water ratio, mix time, tray loading, and seating timing.", "Add water until the material looks smooth.", "Reuse a partially set mix.", "Skip patient instructions to save working time."],
    correctAnswer: "Follow powder-water ratio, mix time, tray loading, and seating timing.",
    rationale: "Alginate accuracy depends on proportions, timing, and patient management.",
    wrongOptionRationales: [
      "Appearance alone does not confirm correct ratio.",
      "Partially set material can distort.",
      "Skipping instructions can increase movement and retakes.",
    ],
    safetyFlag: false,
    keywords: ["alginate", "impression", "mixing", "application"],
  },
  // New IM blueprints
  {
    domainId: "instruments_materials",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "What is the function of a spoon excavator?",
    options: ["Remove carious dentin and debris from a cavity preparation.", "Carry amalgam to the preparation.", "Check occlusion after restoration.", "Hold matrix bands in position."],
    correctAnswer: "Remove carious dentin and debris from a cavity preparation.",
    rationale: "A spoon excavator has a rounded, sharp bowl for scooping out decay and soft dentin during cavity preparation.",
    wrongOptionRationales: [
      "Amalgam carriers transport the mixed alloy.",
      "Occlusal checking is done with articulating paper.",
      "Matrix retainers hold matrix bands.",
    ],
    safetyFlag: false,
    keywords: ["spoon excavator", "caries removal", "instrument identification", "recall"],
  },
  {
    domainId: "instruments_materials",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A light-curing unit has a cracked light guide tip. What should happen before the next use?",
    options: ["Replace the tip; do not use a cracked guide because it can reduce curing output and injure patients.", "Continue using it if the light still turns on.", "Cover the crack with tape and check it after the day's appointments.", "Use a longer cure time to compensate."],
    correctAnswer: "Replace the tip; do not use a cracked guide because it can reduce curing output and injure patients.",
    rationale: "A cracked light guide scatters the curing beam, reducing composite polymerization and potentially concentrating heat or light in unintended directions.",
    wrongOptionRationales: [
      "The unit powering on does not confirm adequate curing delivery.",
      "Tape does not restore curing output and is not a dental-grade fix.",
      "Longer cure time does not compensate for a cracked tip's compromised delivery.",
    ],
    safetyFlag: true,
    keywords: ["curing light", "equipment maintenance", "composite", "application"],
  },
  {
    domainId: "instruments_materials",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "Zinc oxide eugenol (ZOE) is used as a temporary restoration. Which patient situation requires extra caution about using eugenol-containing materials?",
    options: ["Patient with a known eugenol sensitivity or allergy.", "Patient with a latex allergy.", "Patient who is pregnant.", "Patient with a history of penicillin allergy."],
    correctAnswer: "Patient with a known eugenol sensitivity or allergy.",
    rationale: "Eugenol can cause tissue irritation or allergic response in sensitive patients; materials with eugenol should be avoided or substituted when a patient has known sensitivity.",
    wrongOptionRationales: [
      "Latex allergy requires latex-free supplies, not eugenol substitution.",
      "Pregnancy is not a standard contraindication to ZOE in temporary restorations.",
      "Penicillin allergy is unrelated to eugenol chemistry.",
    ],
    safetyFlag: true,
    keywords: ["zinc oxide eugenol", "zoe", "allergy", "temporary restoration", "application"],
  },
  {
    domainId: "instruments_materials",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "An impression just removed from the mouth has a visible tear in the critical area of the preparation. What is the best next action?",
    options: ["Alert the dentist before pouring; the impression may need to be retaken.", "Pour it anyway and see if the model is usable.", "Fill the tear with fresh alginate.", "Send it to the lab and note the tear in writing."],
    correctAnswer: "Alert the dentist before pouring; the impression may need to be retaken.",
    rationale: "A tear in the impression of the prepared area compromises the accuracy of the model; the dentist must evaluate whether it is acceptable or requires retaking.",
    wrongOptionRationales: [
      "Pouring a compromised impression wastes lab time if it cannot be used.",
      "Adding fresh alginate to a set impression does not bond and will distort.",
      "Sending a known defective impression to the lab without dentist review delays treatment.",
    ],
    safetyFlag: false,
    keywords: ["impression tear", "alginate", "quality check", "scenario"],
  },
  {
    domainId: "instruments_materials",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "What is the primary use of evacuation tip selection (saliva ejector vs. HVE) during procedures?",
    options: ["HVE removes large volumes of fluid and aerosols; a saliva ejector removes low-volume seepage.", "Both serve identical purposes and are interchangeable.", "Saliva ejectors are for surgical procedures; HVE is for exams only.", "HVE is used only during radiographs."],
    correctAnswer: "HVE removes large volumes of fluid and aerosols; a saliva ejector removes low-volume seepage.",
    rationale: "High-volume evacuators handle the heavy fluid and aerosol load during active procedures; saliva ejectors manage slow pooling between procedures.",
    wrongOptionRationales: [
      "They are not interchangeable; their capacity and function differ.",
      "Saliva ejectors and HVE both serve general dentistry; neither is limited to surgery or exams.",
      "HVE is used during active procedures, not specifically for radiographs.",
    ],
    safetyFlag: false,
    keywords: ["hve", "saliva ejector", "evacuation", "recall"],
  },
  {
    domainId: "instruments_materials",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "An assistant mixes glass ionomer cement and notices it has already begun to set before loading into the crown. What is the safest action?",
    options: ["Discard the mix and prepare a fresh batch following the manufacturer's working time.", "Use it quickly because it can still be packed if forced.", "Add more powder to extend the setting time.", "Ask the patient to stay still and seat the crown anyway."],
    correctAnswer: "Discard the mix and prepare a fresh batch following the manufacturer's working time.",
    rationale: "Cement that has begun to set should not be used; its marginal adaptation and bond strength are compromised, and forcing it risks an ill-fitting restoration.",
    wrongOptionRationales: [
      "Forcing a setting material into place creates poor margins and bond failure.",
      "Adding powder to setting cement alters the chemical reaction unpredictably.",
      "Seating with compromised cement risks restoration failure and patient harm.",
    ],
    safetyFlag: false,
    keywords: ["glass ionomer", "cement", "setting time", "scenario"],
  },
];

// ─── Texas Law, Ethics & Scope (12 blueprints) ───────────────────────────────

const tlBlueprints: ItemBlueprint[] = [
  {
    domainId: "texas_law_ethics_scope",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "A patient asks an RDA whether a tooth needs extraction. What is the best response?",
    options: ["Acknowledge the concern and tell the dentist so the dentist can evaluate.", "Give an opinion if the tooth looks broken.", "Recommend antibiotics.", "Tell the patient to search online."],
    correctAnswer: "Acknowledge the concern and tell the dentist so the dentist can evaluate.",
    rationale: "The RDA can support communication but does not diagnose or treatment plan.",
    wrongOptionRationales: [
      "Appearance does not authorize diagnosis.",
      "Medication recommendations are outside RDA role.",
      "Online searching does not address patient care safely.",
    ],
    safetyFlag: true,
    keywords: ["texas scope", "diagnosis", "patient question", "recall"],
  },
  {
    domainId: "texas_law_ethics_scope",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "An assistant is asked to perform a task they have not been trained to do. What should happen first?",
    options: ["Pause and confirm training, delegation, and supervision.", "Perform it if the office is busy.", "Ask another assistant to sign the note.", "Proceed if the patient agrees."],
    correctAnswer: "Pause and confirm training, delegation, and supervision.",
    rationale: "Scope-safe practice depends on training, authorization, delegation, and supervision.",
    wrongOptionRationales: [
      "Busyness does not expand role boundaries.",
      "Another assistant's note does not authorize the task.",
      "Patient agreement does not replace scope requirements.",
    ],
    safetyFlag: true,
    keywords: ["delegation", "supervision", "training", "application"],
  },
  {
    domainId: "texas_law_ethics_scope",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A neighbor calls asking whether a patient is in the office today. What should the RDA do?",
    options: ["Do not confirm or disclose patient information.", "Confirm only the appointment time.", "Say the patient is there but not why.", "Share information if the caller sounds worried."],
    correctAnswer: "Do not confirm or disclose patient information.",
    rationale: "Privacy includes not confirming patient presence to unauthorized people.",
    wrongOptionRationales: [
      "Appointment time is private information.",
      "Presence alone can be private information.",
      "Caller concern does not authorize disclosure.",
    ],
    safetyFlag: true,
    keywords: ["confidentiality", "privacy", "ethics", "application"],
  },
  {
    domainId: "texas_law_ethics_scope",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "The assistant realizes they charted the wrong tooth number. What is the best next action?",
    options: ["Notify the appropriate team member and follow the correction policy.", "Delete the entry and pretend it did not happen.", "Change it later if anyone notices.", "Add a second note with a guess."],
    correctAnswer: "Notify the appropriate team member and follow the correction policy.",
    rationale: "Accurate correction protects record integrity and patient safety.",
    wrongOptionRationales: [
      "Hiding an error undermines documentation integrity.",
      "Waiting can allow incorrect information to affect care.",
      "Guessing adds more unreliable information.",
    ],
    safetyFlag: true,
    keywords: ["documentation", "chart correction", "ethics", "scenario"],
  },
  {
    domainId: "texas_law_ethics_scope",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "A patient asks whether a radiographic dark area is decay. What is the safest RDA response?",
    options: ["Say the dentist will review the image and explain the findings.", "Tell the patient it is decay if it looks dark.", "Say it is nothing serious.", "Prescribe better brushing."],
    correctAnswer: "Say the dentist will review the image and explain the findings.",
    rationale: "Radiographic interpretation and diagnosis are dentist responsibilities.",
    wrongOptionRationales: [
      "Dark areas require professional interpretation.",
      "Reassurance without diagnosis can mislead the patient.",
      "Prescribing or diagnosing is outside RDA role.",
    ],
    safetyFlag: true,
    keywords: ["jurisprudence awareness", "radiograph", "scope", "scenario"],
  },
  {
    domainId: "texas_law_ethics_scope",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "Which phrase best reflects Texas scope awareness for an RDA?",
    options: ["Perform only trained and properly delegated duties under appropriate supervision.", "Perform any duty after watching it once.", "Perform dentist duties if the patient consents.", "Avoid asking questions about scope."],
    correctAnswer: "Perform only trained and properly delegated duties under appropriate supervision.",
    rationale: "Scope awareness means checking training, delegation, and supervision rather than assuming authority.",
    wrongOptionRationales: [
      "Watching once is not the same as training and authorization.",
      "Patient consent does not expand scope.",
      "Asking questions protects safety.",
    ],
    safetyFlag: true,
    keywords: ["texas law", "scope", "supervision", "recall"],
  },
  // New TL blueprints
  {
    domainId: "texas_law_ethics_scope",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A coworker asks to see a patient's chart to settle a billing question. What is the correct RDA action?",
    options: ["Direct the request to the appropriate person; do not share the chart without authorization.", "Show the chart briefly because it is for office use.", "Print the chart and give it to the coworker.", "Tell the coworker the patient's diagnosis verbally."],
    correctAnswer: "Direct the request to the appropriate person; do not share the chart without authorization.",
    rationale: "HIPAA requires the minimum necessary standard; only authorized personnel with a valid purpose may access records.",
    wrongOptionRationales: [
      "Office use does not automatically authorize chart access for all staff.",
      "Printing and sharing the chart without authorization is a HIPAA violation.",
      "Verbal disclosure of diagnoses is also protected health information.",
    ],
    safetyFlag: true,
    keywords: ["hipaa", "minimum necessary", "chart access", "application"],
  },
  {
    domainId: "texas_law_ethics_scope",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "During a procedure, an assistant notices signs that a child patient may have been abused. What should happen?",
    options: ["Report the concern to the dentist immediately; dental professionals have mandatory reporting obligations in Texas.", "Ignore it because it is outside the RDA's role.", "Ask the child directly whether they are being abused.", "Wait until the next appointment to see whether signs are still present."],
    correctAnswer: "Report the concern to the dentist immediately; dental professionals have mandatory reporting obligations in Texas.",
    rationale: "Texas law requires dental professionals to report reasonable suspicion of child abuse or neglect; the assistant should involve the dentist immediately.",
    wrongOptionRationales: [
      "Mandatory reporting applies to all dental team members who observe signs of abuse.",
      "Questioning the child directly can compromise a subsequent investigation.",
      "Waiting delays a legally required and ethically necessary response.",
    ],
    safetyFlag: true,
    keywords: ["mandatory reporting", "child abuse", "texas law", "scenario"],
  },
  {
    domainId: "texas_law_ethics_scope",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A patient wants to post a photo of their new veneers on social media and includes the dental assistant in the photo. What must the assistant consider first?",
    options: ["Patient privacy and office social media policy; the patient may post their own images but staff appearance in patient-linked posts requires policy compliance.", "There is no issue because the patient is choosing to post.", "Post it immediately to promote the office.", "Refuse any social media interaction."],
    correctAnswer: "Patient privacy and office social media policy; the patient may post their own images but staff appearance in patient-linked posts requires policy compliance.",
    rationale: "Even patient-initiated social media activity can implicate office policy and privacy concerns; the assistant should follow office protocol.",
    wrongOptionRationales: [
      "Patient choice does not override staff privacy or office media policy.",
      "Immediately promoting the office without policy review can violate HIPAA or office guidelines.",
      "Complete refusal may be unnecessary; the correct response is to follow policy.",
    ],
    safetyFlag: true,
    keywords: ["social media", "patient privacy", "office policy", "application"],
  },
  {
    domainId: "texas_law_ethics_scope",
    difficulty: "easy",
    stemPrefix: "Recall",
    stem: "What is the purpose of the Texas Dental Practice Act for RDAs?",
    options: ["Define the legal scope of practice, supervision requirements, and allowable delegated duties.", "Set fees for dental services.", "License dental insurance companies.", "Regulate advertising for dental products."],
    correctAnswer: "Define the legal scope of practice, supervision requirements, and allowable delegated duties.",
    rationale: "The Texas Dental Practice Act establishes what dental assistants may legally do, under what level of supervision, and with what training or credentials.",
    wrongOptionRationales: [
      "Fee-setting is not the purpose of the practice act.",
      "Insurance company regulation falls under a different authority.",
      "Advertising regulation is separate from the practice act's primary purpose.",
    ],
    safetyFlag: true,
    keywords: ["texas dental practice act", "scope", "supervision", "recall"],
  },
  {
    domainId: "texas_law_ethics_scope",
    difficulty: "hard",
    stemPrefix: "Scenario",
    stem: "A dentist asks an RDA to perform a procedure that is outside the RDA's legal scope under Texas law. What is the correct action?",
    options: ["Respectfully decline, explain the scope limitation, and offer to involve appropriate personnel.", "Perform it because the dentist has authority.", "Perform it but document the dentist's request.", "Ask the patient if they consent before proceeding."],
    correctAnswer: "Respectfully decline, explain the scope limitation, and offer to involve appropriate personnel.",
    rationale: "The RDA cannot legally perform duties outside their defined scope, regardless of who requests it; the dentist's authority does not override the law.",
    wrongOptionRationales: [
      "Dentist authority does not permit delegating duties outside the assistant's legal scope.",
      "Documenting the request does not make an out-of-scope act legal or safe.",
      "Patient consent does not expand the RDA's legal scope of practice.",
    ],
    safetyFlag: true,
    keywords: ["scope violation", "delegation", "texas law", "scenario"],
  },
  {
    domainId: "texas_law_ethics_scope",
    difficulty: "medium",
    stemPrefix: "Application",
    stem: "A patient signs a consent form but then says they want more information before the procedure starts. What should the RDA do?",
    options: ["Stop, inform the dentist, and allow the patient to receive the information they need before proceeding.", "Proceed because the consent form was already signed.", "Tell the patient questions should be asked before signing.", "Start the procedure and answer questions simultaneously."],
    correctAnswer: "Stop, inform the dentist, and allow the patient to receive the information they need before proceeding.",
    rationale: "Informed consent is an ongoing process; a patient can withdraw or pause consent at any time and must receive the information needed to make a voluntary decision.",
    wrongOptionRationales: [
      "A signed form is not irrevocable; patients retain the right to more information.",
      "Telling the patient it is too late undermines the consent process.",
      "Proceeding while the patient has unanswered questions compromises informed consent.",
    ],
    safetyFlag: true,
    keywords: ["informed consent", "patient rights", "ethics", "application"],
  },
];

// ─── Combined blueprint list and bank construction ───────────────────────────

const itemBlueprints: ItemBlueprint[] = [
  ...icsBlueprints,
  ...caBlueprints,
  ...drBlueprints,
  ...datBlueprints,
  ...imBlueprints,
  ...tlBlueprints,
];

function rotateCorrectOption(item: ItemBlueprint, index: number) {
  const correctIndex = index % item.options.length;
  const distractors = item.options.filter((option) => option !== item.correctAnswer);
  const options = [...distractors];
  options.splice(correctIndex, 0, item.correctAnswer);
  return options;
}

function makeItem(blueprint: ItemBlueprint, sequence: number, domainSequence: number): RdaExamBankItem {
  const typeCycle: RdaExamItemType[] = ["pretest", "quiz", "mock", "quiz", "mock"];
  const type = typeCycle[sequence % typeCycle.length];
  const domainCode = blueprint.domainId
    .split("_")
    .map((part) => part[0])
    .join("");
  const options = rotateCorrectOption(blueprint, sequence);
  const correctIndex = options.findIndex((option) => option === blueprint.correctAnswer);
  const wrongRationalesByOption = new Map(
    blueprint.options
      .filter((option) => option !== blueprint.correctAnswer)
      .map((option, index) => [option, blueprint.wrongOptionRationales[index] ?? "This option does not address the safest RDA action."]),
  );

  return {
    id: `rda-${domainCode}-${String(domainSequence + 1).padStart(3, "0")}`,
    domainId: blueprint.domainId,
    difficulty: blueprint.difficulty,
    type,
    stem: `${blueprint.stemPrefix}: ${blueprint.stem}`,
    options,
    correctAnswer: blueprint.correctAnswer,
    rationale: blueprint.rationale,
    wrongOptionRationales: options.map((option, index) =>
      index === correctIndex
        ? "Correct answer."
        : (wrongRationalesByOption.get(option) ?? "This option is not the best RDA-safe response."),
    ),
    safetyFlag: blueprint.safetyFlag,
    keywords: [...new Set([...blueprint.keywords, type, blueprint.difficulty])],
    visualPlaceholder: blueprint.visualPlaceholder,
  };
}

// Build exam bank: each blueprint becomes exactly one unique item (no cycling).
function buildExamBank(): RdaExamBankItem[] {
  const items: RdaExamBankItem[] = [];

  for (const domain of RDA_DOMAINS) {
    const blueprints = itemBlueprints.filter((item) => item.domainId === domain.id);
    blueprints.forEach((blueprint, index) => {
      items.push(makeItem(blueprint, items.length, index));
    });
  }

  return items;
}

export const RDA_EXAM_BANK: RdaExamBankItem[] = buildExamBank();
export const rdaExamBank = RDA_EXAM_BANK;

// Domain-proportional targets per 75-question mock form (based on domain weights).
const mockFormDomainTargets: Record<RdaDomainId, number> = {
  infection_control_safety: 15,
  chairside_assisting: 18,
  dental_radiography: 12,
  dental_anatomy_terminology: 10,
  instruments_materials: 10,
  texas_law_ethics_scope: 10,
};

// Build a mock form by selecting blueprints from a domain-proportional offset so
// each of the three forms draws a different segment of each domain's pool.
function buildMockForm(formIndex: 0 | 1 | 2): RdaExamBankItem[] {
  const items: RdaExamBankItem[] = [];

  for (const domain of RDA_DOMAINS) {
    const domainBlueprints = itemBlueprints.filter((bp) => bp.domainId === domain.id);
    const target = mockFormDomainTargets[domain.id];
    const poolSize = domainBlueprints.length;
    const offset = Math.floor((poolSize / 3) * formIndex);

    for (let i = 0; i < target; i++) {
      const bp = domainBlueprints[(offset + i) % poolSize];
      items.push(makeItem(bp, items.length + formIndex * 200, i + formIndex * 100));
    }
  }

  return items;
}

const pretestDomainTargets: Record<RdaDomainId, number> = {
  infection_control_safety: 6,
  chairside_assisting: 7,
  dental_radiography: 5,
  dental_anatomy_terminology: 4,
  instruments_materials: 4,
  texas_law_ethics_scope: 4,
};

function toLegacyQuestion(item: RdaExamBankItem, modeOverride?: RDAExamMode): RDAExamQuestion {
  const labels = ["a", "b", "c", "d"] as const;
  const correctIndex = item.options.findIndex((option) => option === item.correctAnswer);
  const mode: RDAExamMode = modeOverride ?? (item.type === "mock" ? "mock_exam" : item.type);
  const domain = rdaDomainById[item.domainId];

  return {
    id: item.id,
    mode,
    domainSlug: item.domainId,
    domainTitle: domain.title,
    difficulty: item.difficulty,
    prompt: item.stem,
    choices: item.options.map((option, index) => ({
      id: labels[index],
      text: option,
    })),
    correctChoiceId: labels[Math.max(0, correctIndex)],
    rationale: item.rationale,
    memoryTip: item.keywords.slice(0, 3).join(", "),
  };
}

function selectDistributedPretestItems() {
  const grouped = RDA_DOMAINS.map((domain) => ({
    domain,
    items: RDA_EXAM_BANK.filter((item) => item.domainId === domain.id).slice(
      0,
      pretestDomainTargets[domain.id],
    ),
  }));
  const selected: RdaExamBankItem[] = [];
  const maxLength = Math.max(...grouped.map((group) => group.items.length));

  for (let index = 0; index < maxLength; index += 1) {
    for (const group of grouped) {
      const item = group.items[index];
      if (item) selected.push(item);
    }
  }

  return selected;
}

export const rdaPretestBank = selectDistributedPretestItems().map((item) =>
  toLegacyQuestion(item, "pretest"),
);
export const rdaQuizBank = RDA_EXAM_BANK.map((item) =>
  toLegacyQuestion(item, "quiz"),
);
export const rdaMockExamBank = {
  formA: buildMockForm(0).map((item) => toLegacyQuestion(item, "mock_exam")),
  formB: buildMockForm(1).map((item) => toLegacyQuestion(item, "mock_exam")),
  formC: buildMockForm(2).map((item) => toLegacyQuestion(item, "mock_exam")),
};

export const rdaAllQuestions = [
  ...rdaPretestBank,
  ...rdaQuizBank,
  ...rdaMockExamBank.formA,
  ...rdaMockExamBank.formB,
  ...rdaMockExamBank.formC,
];

export function getRdaQuestionsByDomain(domainId: RdaDomainId) {
  return RDA_EXAM_BANK.filter((question) => question.domainId === domainId);
}

export const rdaExamBankStats = {
  domains: RDA_DOMAINS.length,
  totalItems: RDA_EXAM_BANK.length,
  pretestQuestions: rdaPretestBank.length,
  quizQuestions: rdaQuizBank.length,
  mockExamForms: 3,
  mockExamQuestionsPerForm: rdaMockExamBank.formA.length,
  totalQuestions: rdaAllQuestions.length,
  byDomain: RDA_DOMAINS.map((domain) => ({
    domainId: domain.id,
    count: RDA_EXAM_BANK.filter((item) => item.domainId === domain.id).length,
  })),
};
