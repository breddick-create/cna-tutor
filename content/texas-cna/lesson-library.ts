import type { TutorLesson } from "@/lib/tutor/types";

export const tutorLessonLibrary: TutorLesson[] = [
  {
    id: "infection-control-foundations",
    slug: "infection-control-foundations",
    title: "Infection Control Foundations",
    domainSlug: "infection-control-and-safety",
    domainTitle: "Infection Control and Safety",
    summary: "Build the exam-ready habits for hand hygiene, standard precautions, and isolation basics.",
    learningGoal:
      "Explain why infection control matters and apply the safest first-step thinking on written exam questions.",
    estimatedMinutes: 12,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "why-hand-hygiene-matters",
        title: "Why hand hygiene matters",
        concept:
          "Hand hygiene is the single most important method to prevent and control infection because it removes germs and helps stop spread from resident to resident, surface to resident, or worker to resident.",
        example:
          "If you adjust a dirty brief and then touch a clean tray without cleaning your hands, you can spread germs even if your hands do not look dirty.",
        question:
          "In your own words, why is hand hygiene so important for a CNA?",
        idealAnswer:
          "Hand hygiene removes germs and helps prevent infection from spreading between residents, staff, and surfaces.",
        memoryTip: "Clean hands break the chain of infection.",
        correctExplanation:
          "Exactly. The exam wants you to connect hand hygiene with stopping spread, not just looking clean.",
        incorrectExplanation:
          "The key idea is not just cleanliness. Hand hygiene matters because it removes germs and helps prevent infection from spreading.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "removes germs",
            keywords: ["germ", "pathogen", "microorganism", "infection"],
          },
          {
            label: "prevents spread",
            keywords: ["spread", "transmission", "cross contamination", "prevent"],
          },
          {
            label: "protects people",
            keywords: ["resident", "patient", "staff", "everyone", "others"],
          },
        ],
      },
      {
        id: "when-to-clean-hands",
        title: "When to clean hands",
        concept:
          "A CNA should perform hand hygiene before and after resident care, before gloves, after gloves, after PPE, after contact with body fluids, after contact with objects in the room, and whenever hands are visibly soiled.",
        example:
          "You put on gloves to help with incontinent care. After removing the gloves, you still wash your hands because gloves do not replace hand hygiene.",
        question:
          "Give me two times a CNA should clean their hands.",
        idealAnswer:
          "Examples include before resident care, after resident care, before gloves, after gloves, after body fluid contact, after room contact, or when hands are visibly soiled.",
        memoryTip: "Before and after care, before and after gloves.",
        correctExplanation:
          "Good. Those are exactly the kinds of moments the written exam tests.",
        incorrectExplanation:
          "Think about the big moments: before and after resident care, before and after gloves, and after contamination.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "before care",
            keywords: ["before caring", "before care", "before resident", "before touching"],
          },
          {
            label: "after care",
            keywords: ["after caring", "after care", "after resident", "after touching"],
          },
          {
            label: "glove moment",
            keywords: ["before gloves", "after gloves", "remove gloves", "gloves"],
          },
          {
            label: "contamination moment",
            keywords: ["body fluid", "soiled", "dirty", "ppe", "room objects"],
          },
        ],
      },
      {
        id: "precaution-types",
        title: "Standard, contact, droplet, airborne",
        concept:
          "Standard precautions apply to all residents. Contact precautions add gloves and sometimes gowns for direct or indirect spread. Droplet precautions focus on close-range respiratory droplets. Airborne precautions require special respirator use and closed-door room practices when indicated.",
        example:
          "C-diff and scabies fit contact precautions. A coughing illness spread by large droplets may require a mask within about 3 feet. Tuberculosis is a classic airborne example.",
        question:
          "Which precaution type applies to every resident: standard, contact, droplet, or airborne?",
        idealAnswer: "Standard precautions apply to every resident.",
        memoryTip: "Standard is the starting line for everyone.",
        correctExplanation:
          "Right. Standard precautions are the baseline, and the others are added only when indicated.",
        incorrectExplanation:
          "The right answer is standard precautions. They apply to all residents no matter the diagnosis.",
        passThreshold: 1,
        acceptableConcepts: [
          {
            label: "standard precautions",
            keywords: ["standard"],
          },
        ],
      },
    ],
    completionMessage:
      "You finished a strong infection-control foundation. Next we should either reinforce resident rights or move into basic nursing skills.",
    nextRecommendedLessonIds: ["resident-rights-core", "vital-signs-basics"],
  },
  {
    id: "resident-rights-core",
    slug: "resident-rights-core",
    title: "Resident Rights Core Concepts",
    domainSlug: "patient-rights-and-ethics",
    domainTitle: "Patient Rights and Ethics",
    summary: "Practice the dignity, choice, privacy, and respect concepts that appear throughout CNA exam questions.",
    learningGoal:
      "Recognize what protects resident rights and spot common care behaviors that violate those rights.",
    estimatedMinutes: 10,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "dignity-and-choice",
        title: "Dignity and choice",
        concept:
          "Person-centered care means the resident stays at the center of decisions. CNAs support dignity by respecting preferences, offering choices, and involving the resident in care as much as possible.",
        example:
          "Instead of choosing clothing for the resident without asking, the CNA offers options and allows the resident to decide when possible.",
        question:
          "What is one way a CNA can support resident dignity or choice?",
        idealAnswer:
          "A CNA can offer choices, respect preferences, involve the resident in care decisions, and speak respectfully.",
        memoryTip: "Ask, do not assume.",
        correctExplanation:
          "Yes. Offering choice and respecting preferences are classic person-centered care behaviors.",
        incorrectExplanation:
          "A strong answer includes offering choices, respecting preferences, or involving the resident in decisions.",
        passThreshold: 1,
        acceptableConcepts: [
          {
            label: "offer choice",
            keywords: ["choice", "choose", "preference", "decide"],
          },
          {
            label: "respect dignity",
            keywords: ["respect", "dignity", "privacy", "courteous"],
          },
          {
            label: "involve resident",
            keywords: ["involve", "participate", "decision", "ask"],
          },
        ],
      },
      {
        id: "privacy",
        title: "Privacy",
        concept:
          "Residents have a right to privacy of person and condition. CNAs protect privacy by knocking, identifying themselves, explaining care, closing curtains or doors, and covering the resident appropriately.",
        example:
          "Before providing perineal care, the CNA closes the curtain, explains the care, and drapes the resident to reduce exposure.",
        question:
          "Name one action that protects a resident's privacy during care.",
        idealAnswer:
          "Examples include knocking first, closing the curtain or door, draping the resident, explaining care, and covering the resident appropriately.",
        memoryTip: "Knock, explain, cover.",
        correctExplanation:
          "Good. Privacy is protected through respectful setup, not just by moving quickly.",
        incorrectExplanation:
          "Think about what happens before and during care: knock, explain, close the curtain or door, and drape the resident.",
        passThreshold: 1,
        acceptableConcepts: [
          {
            label: "knock or explain",
            keywords: ["knock", "explain", "introduce"],
          },
          {
            label: "close space",
            keywords: ["curtain", "door", "privacy"],
          },
          {
            label: "cover resident",
            keywords: ["drape", "cover", "sheet", "blanket"],
          },
        ],
      },
      {
        id: "abuse-neglect-misappropriation",
        title: "Abuse, neglect, misappropriation",
        concept:
          "Abuse means willful harm or intimidation. Neglect means failing to provide needed goods or services. Misappropriation means wrongfully using or taking a resident's property. These are serious violations and are not allowed.",
        example:
          "Taking a resident's money without permission is not just rude, it is misappropriation of property.",
        question:
          "If someone takes a resident's belongings without permission, what is that called?",
        idealAnswer: "That is misappropriation of resident property.",
        memoryTip: "Property taken = misappropriation.",
        correctExplanation:
          "Correct. The exam often separates misappropriation from abuse and neglect, so that distinction matters.",
        incorrectExplanation:
          "The correct term is misappropriation of resident property.",
        passThreshold: 1,
        acceptableConcepts: [
          {
            label: "misappropriation",
            keywords: ["misappropriation", "property", "belongings", "money"],
          },
        ],
      },
    ],
    completionMessage:
      "Nice work. You covered dignity, privacy, and major rights violations. That foundation helps on both written questions and bedside care decisions.",
    nextRecommendedLessonIds: ["infection-control-foundations", "vital-signs-basics"],
  },
  {
    id: "vital-signs-basics",
    slug: "vital-signs-basics",
    title: "Vital Signs Basics",
    domainSlug: "vital-signs-basics",
    domainTitle: "Vital Signs Basics",
    summary: "Learn the written-exam basics for pulse, respirations, observation, and when to report changes.",
    learningGoal:
      "Build confidence with vital-sign terms and the CNA habit of observing and reporting changes promptly.",
    estimatedMinutes: 10,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "why-vital-signs-matter",
        title: "Why vital signs matter",
        concept:
          "Vital signs give quick information about a resident's condition. CNAs measure and report them because changes can show illness, distress, or a need for nurse follow-up.",
        example:
          "If respirations suddenly become fast and labored, the number matters, but the change matters too.",
        question:
          "Why should a CNA pay close attention to changes in vital signs?",
        idealAnswer:
          "Because changes in vital signs can show a problem with the resident's condition and should be reported to the nurse.",
        memoryTip: "Measure, notice changes, report.",
        correctExplanation:
          "Exactly. The exam often wants the CNA to recognize that noticing and reporting change is part of safe care.",
        incorrectExplanation:
          "The important idea is that changes in vital signs can signal a problem and should be reported.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "change matters",
            keywords: ["change", "different", "abnormal", "sudden"],
          },
          {
            label: "signals problem",
            keywords: ["problem", "condition", "illness", "distress"],
          },
          {
            label: "report to nurse",
            keywords: ["report", "nurse", "tell", "notify"],
          },
        ],
      },
      {
        id: "pulse-basics",
        title: "Pulse basics",
        concept:
          "Pulse reflects the heartbeat felt at an artery. On skills testing, the CNA is commonly asked to measure and record a radial pulse accurately.",
        example:
          "The radial pulse is taken at the wrist on the thumb side.",
        question:
          "Where is the radial pulse usually measured?",
        idealAnswer:
          "The radial pulse is measured at the wrist, usually on the thumb side.",
        memoryTip: "Radial = wrist.",
        correctExplanation:
          "Right. That is a straightforward but very common exam fact.",
        incorrectExplanation:
          "The radial pulse is measured at the wrist.",
        passThreshold: 1,
        acceptableConcepts: [
          {
            label: "wrist",
            keywords: ["wrist", "thumb side", "radial"],
          },
        ],
      },
      {
        id: "respiration-observation",
        title: "Respiration observation",
        concept:
          "Respirations are not only a number. A CNA also watches ease of breathing, rhythm, and signs of distress. Changes should be reported.",
        example:
          "Even if the count is finished, labored breathing or obvious shortness of breath still needs attention.",
        question:
          "Besides the number of breaths, what else should a CNA notice about respirations?",
        idealAnswer:
          "A CNA should notice ease of breathing, rhythm, effort, and any signs of distress such as labored breathing.",
        memoryTip: "Count plus comfort.",
        correctExplanation:
          "Exactly. Respirations are about both count and breathing quality.",
        incorrectExplanation:
          "A strong answer mentions breathing effort, rhythm, ease, or signs of distress.",
        passThreshold: 1,
        acceptableConcepts: [
          {
            label: "effort or ease",
            keywords: ["effort", "easy", "labored", "distress", "shortness of breath"],
          },
          {
            label: "rhythm",
            keywords: ["rhythm", "regular", "pattern"],
          },
        ],
      },
    ],
    completionMessage:
      "Great work. You now have a practical vital-signs foundation with the exam habit that matters most: notice changes and report them.",
    nextRecommendedLessonIds: ["infection-control-foundations", "resident-rights-core"],
  },
  {
    id: "communication-and-professional-boundaries",
    slug: "communication-and-professional-boundaries",
    title: "Communication and Professional Boundaries",
    domainSlug: "communication-skills",
    domainTitle: "Communication Skills",
    summary: "Practice how a CNA should speak, listen, explain care, and maintain respectful professional boundaries.",
    learningGoal:
      "Use CNA communication habits that protect dignity, support understanding, and avoid boundary problems.",
    estimatedMinutes: 10,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "introduce-and-explain",
        title: "Introduce and explain",
        concept:
          "A CNA should knock, identify themselves, greet the resident respectfully, and explain the care before beginning.",
        example:
          "Before taking vital signs, the CNA says who they are, explains the task, and keeps the resident informed.",
        question:
          "What should a CNA do before starting care with a resident?",
        idealAnswer:
          "Knock, introduce themselves, greet the resident respectfully, and explain the care before starting.",
        memoryTip: "Knock, greet, explain.",
        correctExplanation:
          "Yes. The safest communication starts before hands-on care begins.",
        incorrectExplanation:
          "Start with respectful entry: knock, identify yourself, greet the resident, and explain what you will do.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "knock or greet",
            keywords: ["knock", "greet", "hello", "preferred name"],
          },
          {
            label: "introduce self",
            keywords: ["introduce", "name", "title", "who you are"],
          },
          {
            label: "explain care",
            keywords: ["explain", "procedure", "what you are going to do", "before starting"],
          },
        ],
      },
      {
        id: "listen-and-respond",
        title: "Listen and respond",
        concept:
          "Good CNA communication includes listening to the resident, responding to questions, and staying calm and courteous.",
        example:
          "If a resident says they are uncomfortable, the CNA should not ignore it or rush past it.",
        question:
          "Why is listening important during resident care?",
        idealAnswer:
          "Listening helps the CNA understand needs, respond appropriately, and provide safe respectful care.",
        memoryTip: "Care starts with listening.",
        correctExplanation:
          "Exactly. Listening helps you notice needs and protects resident-centered care.",
        incorrectExplanation:
          "The key is that listening helps the CNA understand and respond to the resident's needs safely and respectfully.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "understand needs",
            keywords: ["needs", "understand", "concern", "question"],
          },
          {
            label: "respond appropriately",
            keywords: ["respond", "answer", "help", "appropriate"],
          },
          {
            label: "safe respectful care",
            keywords: ["safe", "respect", "courteous", "calm"],
          },
        ],
      },
      {
        id: "professional-boundaries",
        title: "Professional boundaries",
        concept:
          "A CNA should maintain professional boundaries and should not share personal problems or use pet names that reduce respect.",
        example:
          "Calling every resident 'honey' may feel friendly, but it can ignore their preference and dignity.",
        question:
          "What is one example of maintaining professional boundaries?",
        idealAnswer:
          "Use respectful names, stay courteous, and do not share personal problems or inappropriate personal information.",
        memoryTip: "Friendly, not overly personal.",
        correctExplanation:
          "Right. Boundaries protect both respect and professionalism.",
        incorrectExplanation:
          "A strong answer mentions respectful names, avoiding pet names, or not sharing personal problems.",
        passThreshold: 1,
        acceptableConcepts: [
          {
            label: "respectful naming",
            keywords: ["proper name", "respectful", "avoid pet names", "mr", "ms"],
          },
          {
            label: "do not overshare",
            keywords: ["personal problems", "personal information", "boundaries", "professional"],
          },
        ],
      },
    ],
    completionMessage:
      "Strong work. Communication is not extra polish in CNA care. It is part of safety, dignity, and exam success.",
    nextRecommendedLessonIds: ["resident-rights-core", "documentation-and-reporting"],
  },
  {
    id: "documentation-and-reporting",
    slug: "documentation-and-reporting",
    title: "Documentation and Reporting Basics",
    domainSlug: "documentation",
    domainTitle: "Documentation",
    summary: "Learn what CNAs should observe, report, and document when resident condition or care changes.",
    learningGoal:
      "Recognize the CNA habit of noticing changes and reporting important observations promptly to the nurse.",
    estimatedMinutes: 9,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "report-changes",
        title: "Report changes",
        concept:
          "CNAs observe residents closely and report changes in condition, behavior, skin, breathing, pain, or participation to the nurse promptly.",
        example:
          "If a resident suddenly becomes more confused or refuses care in an unusual way, that change should be reported.",
        question:
          "What should a CNA do if a resident's condition changes unexpectedly?",
        idealAnswer:
          "Observe the change carefully and report it promptly to the nurse.",
        memoryTip: "Notice it, report it.",
        correctExplanation:
          "Exactly. CNA exam questions often reward the answer that includes prompt reporting to the nurse.",
        incorrectExplanation:
          "The safe CNA action is to observe the change and report it promptly to the nurse.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "observe",
            keywords: ["observe", "notice", "watch", "change"],
          },
          {
            label: "report to nurse",
            keywords: ["report", "nurse", "notify", "tell"],
          },
        ],
      },
      {
        id: "skin-and-procedure-observations",
        title: "Skin and procedure observations",
        concept:
          "The Texas curriculum emphasizes being alert to problems or complaints related to procedures, changes in participation, other significant observations, and changes in skin condition.",
        example:
          "During repositioning, redness on the coccyx is not something to ignore and 'see later.'",
        question:
          "Name one kind of observation a CNA should report after care or a procedure.",
        idealAnswer:
          "Examples include problems or complaints, change in participation, skin changes, pain, or other significant observations.",
        memoryTip: "Complaints, changes, skin.",
        correctExplanation:
          "Good. That matches the curriculum's observe-report-document pattern.",
        incorrectExplanation:
          "Think of the big categories: complaints, participation changes, skin changes, and other important observations.",
        passThreshold: 1,
        acceptableConcepts: [
          {
            label: "complaint or pain",
            keywords: ["complaint", "pain", "problem"],
          },
          {
            label: "participation change",
            keywords: ["change in participation", "unable", "different ability", "cooperate"],
          },
          {
            label: "skin change",
            keywords: ["skin", "redness", "pressure", "breakdown"],
          },
        ],
      },
      {
        id: "intake-output-basics",
        title: "Intake and output basics",
        concept:
          "When a resident is on intake and output, fluid amounts matter and measurable output should not be discarded without following the correct process.",
        example:
          "If urine output needs measurement, the CNA should not empty it without measuring and recording according to policy.",
        question:
          "Why does intake and output matter in CNA care?",
        idealAnswer:
          "It helps track fluid balance and gives the nurse important information about the resident's condition.",
        memoryTip: "Fluid in, fluid out, condition clue.",
        correctExplanation:
          "Right. I&O is about more than numbers. It helps show fluid balance and possible problems.",
        incorrectExplanation:
          "The key idea is that intake and output helps track fluid balance and gives important condition information.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "fluid balance",
            keywords: ["fluid balance", "intake and output", "hydration", "balance"],
          },
          {
            label: "condition clue",
            keywords: ["condition", "problem", "nurse", "important information"],
          },
        ],
      },
    ],
    completionMessage:
      "Well done. You reinforced one of the best CNA exam habits: see the change, say the change, and protect the resident.",
    nextRecommendedLessonIds: ["vital-signs-basics", "communication-and-professional-boundaries"],
  },
  {
    id: "safety-and-emergency-response",
    slug: "safety-and-emergency-response",
    title: "Safety and Emergency Response",
    domainSlug: "emergency-procedures",
    domainTitle: "Emergency Procedures",
    summary: "Build calm first-step responses for falls, fainting, choking, and immediate safety concerns.",
    learningGoal:
      "Choose the safest CNA action first in urgent situations and know when not to move a resident.",
    estimatedMinutes: 9,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "fall-first-response",
        title: "First response to a fall",
        concept:
          "If a resident falls, stay with the resident, call for help, notify the nurse, and do not move the resident until the nurse assesses and gives instructions.",
        example:
          "Trying to lift the resident quickly may worsen an injury if a fracture is present.",
        question:
          "What is the safest first action if a resident falls?",
        idealAnswer:
          "Stay with the resident, call for help, and notify the nurse without moving the resident until instructed.",
        memoryTip: "Stay, call, wait.",
        correctExplanation:
          "Correct. The test often checks whether you avoid moving the resident too soon.",
        incorrectExplanation:
          "The safest first response is to stay with the resident, call for help, and notify the nurse. Do not move the resident until instructed.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "stay and call",
            keywords: ["stay", "call for help", "help", "with resident"],
          },
          {
            label: "notify nurse",
            keywords: ["notify nurse", "report", "tell the nurse", "nurse"],
          },
          {
            label: "do not move",
            keywords: ["do not move", "don't move", "wait", "until assessed"],
          },
        ],
      },
      {
        id: "fainting-response",
        title: "Fainting response",
        concept:
          "If a resident faints, lower the head to help blood flow to the brain, assist safely, and stay with the resident while help is obtained.",
        example:
          "A standing resident who faints may need help to lie down or sit safely rather than being left upright.",
        question:
          "Why is lowering the resident's head important during fainting?",
        idealAnswer:
          "It helps increase blood supply to the brain while keeping the resident safer.",
        memoryTip: "Low head, more brain blood flow.",
        correctExplanation:
          "Exactly. The purpose is to improve blood flow to the brain and reduce risk.",
        incorrectExplanation:
          "Lowering the head helps increase blood flow to the brain and supports safer response to fainting.",
        passThreshold: 1,
        acceptableConcepts: [
          {
            label: "blood flow to brain",
            keywords: ["blood", "brain", "flow", "supply"],
          },
        ],
      },
      {
        id: "choking-escalation",
        title: "Choking awareness",
        concept:
          "Meal and airway emergencies require immediate attention. If choking occurs, the CNA follows the proper emergency guideline and gets help quickly.",
        example:
          "A resident who cannot cough or speak during a meal is not a wait-and-see situation.",
        question:
          "If a resident starts choking during a meal, should a CNA ignore it, finish the meal, or respond immediately?",
        idealAnswer:
          "Respond immediately and follow the emergency guideline while getting help.",
        memoryTip: "Choking is now, not later.",
        correctExplanation:
          "Right. Choking requires immediate action, not delay.",
        incorrectExplanation:
          "The safe answer is to respond immediately and get help.",
        passThreshold: 1,
        acceptableConcepts: [
          {
            label: "immediate response",
            keywords: ["immediately", "right away", "emergency", "help"],
          },
        ],
      },
    ],
    completionMessage:
      "Good job. In emergencies, the exam rewards calm first-step safety thinking more than rushing or guessing.",
    nextRecommendedLessonIds: ["infection-control-foundations", "communication-and-professional-boundaries"],
  },
];
