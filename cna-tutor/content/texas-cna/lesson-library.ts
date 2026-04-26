import type { LessonSegment, TutorLesson } from "@/lib/tutor/types";

const baseTutorLessonLibrary: TutorLesson[] = [
  {
    id: "infection-control-foundations",
    slug: "infection-control-foundations",
    title: "Infection Control Foundations",
    domainSlug: "infection-control-and-safety",
    domainTitle: "Infection Control and Safety",
    summary: "Build the exam-ready habits for hand hygiene, standard precautions, and isolation basics.",
    learningGoal:
      "Explain why infection control matters and apply the safest first-step thinking on written exam questions.",
    estimatedMinutes: 28,
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
        questionType: "recall",
        difficulty: 1,
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
      {
        id: "chain-of-infection",
        title: "Breaking the chain of infection",
        questionType: "application",
        difficulty: 2,
        concept:
          "Infection spreads through a chain: germs need a source, a way out, a way to travel, a way in, and a person who can get sick. CNAs help break that chain through hand hygiene, PPE, cleaning, and reporting signs of infection.",
        example:
          "Cleaning hands after contact with drainage breaks the chain before germs can move to another resident or surface.",
        question:
          "Name two CNA actions that help break the chain of infection.",
        idealAnswer:
          "Hand hygiene and correct PPE use help break the chain of infection. Cleaning equipment and reporting signs of infection also help.",
        memoryTip: "Break the chain before germs travel.",
        correctExplanation:
          "Yes. You connected CNA actions with stopping germs from moving to another person or surface.",
        incorrectExplanation:
          "A complete answer should name actions that stop transmission, such as hand hygiene, PPE, cleaning equipment, or reporting signs of infection.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "hand hygiene",
            keywords: ["hand hygiene", "wash hands", "clean hands"],
          },
          {
            label: "ppe",
            keywords: ["ppe", "gloves", "gown", "mask"],
          },
          {
            label: "clean equipment",
            keywords: ["clean equipment", "disinfect", "clean surfaces"],
          },
          {
            label: "report infection signs",
            keywords: ["report", "nurse", "signs of infection", "fever", "drainage"],
          },
        ],
      },
      {
        id: "gloves-do-not-replace-handwashing",
        title: "Gloves do not replace hand hygiene",
        questionType: "critical_thinking",
        difficulty: 2,
        concept:
          "Gloves are a barrier, but they can have tiny defects and become contaminated during care. A CNA still performs hand hygiene before putting gloves on and after removing them.",
        example:
          "After removing gloves used for perineal care, the CNA washes hands before touching clean supplies.",
        question:
          "A student says, 'I wore gloves, so I do not need to wash my hands.' What should the CNA remember?",
        idealAnswer:
          "Gloves do not replace hand hygiene. The CNA should clean hands before gloves and after removing gloves because gloves can become contaminated.",
        memoryTip: "Gloves help, clean hands finish the job.",
        correctExplanation:
          "Correct. The exam often tests the misconception that gloves are enough by themselves.",
        incorrectExplanation:
          "The missing idea is that gloves are not a substitute for hand hygiene. Hands are cleaned before gloves and after glove removal.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "gloves do not replace hand hygiene",
            keywords: ["do not replace", "not enough", "still wash", "still clean"],
          },
          {
            label: "before gloves",
            keywords: ["before gloves", "before putting gloves", "before wearing gloves"],
          },
          {
            label: "after gloves",
            keywords: ["after gloves", "after removing gloves", "take off gloves"],
          },
          {
            label: "contamination risk",
            keywords: ["contaminated", "germs", "dirty", "spread"],
          },
        ],
      },
      {
        id: "ppe-removal-contamination",
        title: "Avoiding contamination when removing PPE",
        questionType: "scenario",
        difficulty: 2,
        concept:
          "When removing PPE, the CNA avoids touching contaminated outside surfaces and performs hand hygiene after removal. The goal is to keep germs away from skin, clothing, and clean areas.",
        example:
          "A CNA removes gloves by touching glove-to-glove and skin-to-skin, then cleans hands after removal.",
        question:
          "A resident is on contact precautions. After care, what should the CNA focus on while removing PPE?",
        idealAnswer:
          "The CNA should avoid touching contaminated surfaces, remove PPE according to facility procedure, dispose of it properly, and perform hand hygiene.",
        memoryTip: "Dirty touches dirty, clean touches clean.",
        correctExplanation:
          "Right. The safe reasoning is to prevent contamination during removal, then clean hands.",
        incorrectExplanation:
          "A complete answer needs both parts: avoid contaminating yourself or clean areas, and perform hand hygiene after PPE removal.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "avoid contaminated surfaces",
            keywords: ["avoid touching", "contaminated", "dirty outside", "clean areas"],
          },
          {
            label: "follow procedure",
            keywords: ["procedure", "policy", "correct order", "facility"],
          },
          {
            label: "dispose properly",
            keywords: ["dispose", "trash", "discard"],
          },
          {
            label: "hand hygiene after ppe",
            keywords: ["hand hygiene", "wash hands", "clean hands"],
          },
        ],
      },
      {
        id: "isolation-common-misconception",
        title: "Isolation does not remove dignity",
        questionType: "critical_thinking",
        difficulty: 3,
        concept:
          "Isolation precautions add infection-control steps, but they do not remove resident rights. CNAs still knock, explain care, protect privacy, answer call lights, and treat the resident with dignity.",
        example:
          "A CNA should not avoid a resident's call light just because PPE is required. The CNA prepares correctly and responds.",
        question:
          "What is wrong with ignoring a call light because a resident is on isolation precautions?",
        idealAnswer:
          "Isolation precautions do not remove the resident's right to care. The CNA should use the required PPE, respond to the call light, and protect dignity and safety.",
        memoryTip: "Precautions add steps, not neglect.",
        correctExplanation:
          "Exactly. Infection control and resident rights must both be protected.",
        incorrectExplanation:
          "The key is that isolation means use precautions, not ignore care. The CNA should put on PPE and respond.",
        passThreshold: 3,
        acceptableConcepts: [
          {
            label: "isolation does not remove rights",
            keywords: ["right", "rights", "dignity", "care"],
          },
          {
            label: "use ppe",
            keywords: ["ppe", "gloves", "gown", "mask"],
          },
          {
            label: "respond to call light",
            keywords: ["respond", "call light", "answer", "help"],
          },
          {
            label: "protect safety",
            keywords: ["safety", "safe", "protect"],
          },
        ],
      },
      {
        id: "soiled-linen-handling",
        title: "Handling soiled linen safely",
        questionType: "scenario",
        difficulty: 3,
        concept:
          "Soiled linen can spread germs. CNAs should hold it away from the uniform, avoid shaking it, place it in the correct container, and clean hands after handling.",
        example:
          "Shaking sheets can spread microorganisms into the air or onto surfaces.",
        question:
          "A resident's sheets are soiled. What should the CNA do to handle the linen safely?",
        idealAnswer:
          "Hold soiled linen away from the uniform, do not shake it, place it in the proper container, and perform hand hygiene afterward.",
        memoryTip: "Do not hug it, do not shake it, contain it.",
        correctExplanation:
          "Good. That answer protects the CNA, the resident, and the environment from contamination.",
        incorrectExplanation:
          "A safe answer should include not shaking linen, keeping it away from the uniform, using the proper container, and cleaning hands.",
        passThreshold: 3,
        acceptableConcepts: [
          {
            label: "hold away from uniform",
            keywords: ["away from uniform", "away from body", "do not hold against"],
          },
          {
            label: "do not shake",
            keywords: ["do not shake", "dont shake", "not shake"],
          },
          {
            label: "proper container",
            keywords: ["proper container", "linen bag", "hamper", "bag"],
          },
          {
            label: "hand hygiene afterward",
            keywords: ["hand hygiene", "wash hands", "clean hands"],
          },
        ],
      },
    ],
    completionMessage:
      "You finished a strong infection-control foundation. Key takeaways: clean hands break transmission, gloves never replace hand hygiene, PPE must be removed without contamination, isolation still protects dignity, and soiled items must be contained safely.",
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
    estimatedMinutes: 26,
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
        questionType: "recall",
        difficulty: 1,
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
      {
        id: "refusal-of-care",
        title: "Refusal of care",
        questionType: "application",
        difficulty: 2,
        concept:
          "A resident has the right to refuse care. The CNA should not force care, argue, or threaten. The CNA should listen, try to understand the reason, offer appropriate choices, and report the refusal to the nurse.",
        example:
          "If a resident refuses a shower, the CNA can ask about the concern and offer a different time, then report the refusal.",
        question:
          "What should a CNA do if a resident refuses care?",
        idealAnswer:
          "Respect the refusal, do not force care, try to understand the reason, offer appropriate choices, and report the refusal to the nurse.",
        memoryTip: "Respect, ask, offer, report.",
        correctExplanation:
          "Correct. Refusal questions test both resident rights and nurse notification.",
        incorrectExplanation:
          "A complete answer must protect the resident's right to refuse and report the refusal to the nurse.",
        passThreshold: 3,
        acceptableConcepts: [
          {
            label: "respect refusal",
            keywords: ["respect", "refuse", "right"],
          },
          {
            label: "do not force",
            keywords: ["do not force", "dont force", "not force", "cannot force"],
          },
          {
            label: "understand or offer choices",
            keywords: ["ask why", "understand", "choice", "different time", "offer"],
          },
          {
            label: "report to nurse",
            keywords: ["report", "nurse", "notify", "tell"],
          },
        ],
      },
      {
        id: "hipaa-confidentiality",
        title: "HIPAA and confidentiality",
        questionType: "scenario",
        difficulty: 2,
        concept:
          "CNAs protect confidentiality by sharing resident information only with staff who need it for care. Private information should not be discussed in hallways, elevators, social media, or with visitors who are not authorized.",
        example:
          "If a family member asks for details the CNA is not authorized to share, the CNA should refer them to the nurse.",
        question:
          "A visitor asks why a resident is on a new medication. What should the CNA do?",
        idealAnswer:
          "The CNA should not share private medical information and should refer the visitor to the nurse.",
        memoryTip: "Need-to-know for care, otherwise refer.",
        correctExplanation:
          "Right. CNA privacy questions often reward referring medical questions to the nurse.",
        incorrectExplanation:
          "The safe answer is to protect confidentiality and refer the visitor's medical question to the nurse.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "do not share private information",
            keywords: ["do not share", "private", "confidential", "hipaa"],
          },
          {
            label: "refer to nurse",
            keywords: ["nurse", "refer", "tell them to ask", "notify"],
          },
          {
            label: "authorized need to know",
            keywords: ["authorized", "need to know", "allowed"],
          },
        ],
      },
      {
        id: "abuse-reporting-duty",
        title: "Reporting suspected abuse",
        questionType: "critical_thinking",
        difficulty: 3,
        concept:
          "A CNA must report suspected abuse, neglect, or misappropriation according to facility policy. The CNA does not investigate, confront the accused person, or decide whether the suspicion is serious enough.",
        example:
          "If a resident says a staff member hit them, the CNA reports the statement immediately to the nurse or supervisor.",
        question:
          "Why should a CNA report suspected abuse instead of investigating it personally?",
        idealAnswer:
          "The CNA's role is to report suspected abuse immediately to the nurse or supervisor, not investigate or decide if it is true.",
        memoryTip: "Suspect it, report it.",
        correctExplanation:
          "Exactly. The CNA protects the resident by reporting through the proper chain.",
        incorrectExplanation:
          "The missing point is scope. CNAs report suspected abuse promptly; they do not investigate or confront.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "report immediately",
            keywords: ["report", "immediately", "right away", "tell"],
          },
          {
            label: "nurse or supervisor",
            keywords: ["nurse", "supervisor", "charge nurse"],
          },
          {
            label: "do not investigate",
            keywords: ["do not investigate", "dont investigate", "not investigate", "not decide"],
          },
        ],
      },
      {
        id: "dignity-during-personal-care",
        title: "Dignity during personal care",
        questionType: "scenario",
        difficulty: 2,
        concept:
          "Dignity during bathing, dressing, toileting, and perineal care means explaining care, offering choices, exposing only the area being washed, and keeping the resident covered as much as possible.",
        example:
          "During a bed bath, uncover one area at a time instead of leaving the resident exposed.",
        question:
          "During a bed bath, how can a CNA protect dignity while still completing care?",
        idealAnswer:
          "Explain the care, offer choices when possible, keep the resident covered, and expose only the area being washed.",
        memoryTip: "Explain, choose, cover.",
        correctExplanation:
          "Good. You connected dignity with specific care actions.",
        incorrectExplanation:
          "A strong answer should include explaining care and keeping the resident covered except for the area being washed.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "explain care",
            keywords: ["explain", "tell", "before"],
          },
          {
            label: "offer choices",
            keywords: ["choice", "choose", "preference"],
          },
          {
            label: "keep covered",
            keywords: ["cover", "covered", "drape", "blanket"],
          },
          {
            label: "expose only care area",
            keywords: ["only the area", "area being washed", "one area"],
          },
        ],
      },
      {
        id: "rights-vs-convenience",
        title: "Resident rights versus convenience",
        questionType: "critical_thinking",
        difficulty: 3,
        concept:
          "Resident rights do not disappear because staff are busy or a routine is easier. CNAs should avoid shortcuts that remove choice, privacy, call light access, mobility aids, or respectful communication.",
        example:
          "Taking away a call light because a resident uses it often is not a time-saver. It violates safety and rights.",
        question:
          "Why is it wrong to remove a call light because a resident uses it often?",
        idealAnswer:
          "The resident has a right to call for help. Removing the call light violates safety and dignity, and the CNA should report concerns rather than take it away.",
        memoryTip: "Busy is not a reason to remove rights.",
        correctExplanation:
          "Exactly. The exam expects resident rights to win over staff convenience.",
        incorrectExplanation:
          "The key idea is that call lights protect safety and the resident's right to ask for help. Staff convenience is not a reason to remove them.",
        passThreshold: 3,
        acceptableConcepts: [
          {
            label: "right to call for help",
            keywords: ["right", "call for help", "call light", "help"],
          },
          {
            label: "safety",
            keywords: ["safety", "safe", "fall", "danger"],
          },
          {
            label: "dignity",
            keywords: ["dignity", "respect"],
          },
          {
            label: "report concerns",
            keywords: ["report", "nurse", "supervisor"],
          },
        ],
      },
    ],
    completionMessage:
      "Nice work. Key takeaways: residents keep the right to dignity, privacy, refusal, confidentiality, call light access, and safe care; CNAs protect those rights and report suspected abuse or concerns promptly.",
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
    estimatedMinutes: 26,
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
        questionType: "application",
        difficulty: 1,
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
      {
        id: "temperature-change",
        title: "Temperature changes",
        questionType: "application",
        difficulty: 2,
        concept:
          "A temperature reading matters most when it is unusual for the resident or paired with symptoms. CNAs do not diagnose infection, but they report fever, chills, sweating, or sudden temperature changes to the nurse.",
        example:
          "A resident who is normally 98.2 and is now 101.1 with chills needs nurse notification.",
        question:
          "What should a CNA do when a resident has a fever or sudden temperature change?",
        idealAnswer:
          "Record the temperature accurately, observe symptoms, and report the fever or sudden change to the nurse.",
        memoryTip: "Measure, notice, report.",
        correctExplanation:
          "Correct. The CNA does not diagnose; the CNA observes and reports.",
        incorrectExplanation:
          "A complete answer should include accurate measurement, observing symptoms, and reporting the change to the nurse.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "record accurately",
            keywords: ["record", "document", "measure", "accurate"],
          },
          {
            label: "observe symptoms",
            keywords: ["symptoms", "chills", "sweating", "change"],
          },
          {
            label: "report to nurse",
            keywords: ["report", "nurse", "notify", "tell"],
          },
        ],
      },
      {
        id: "irregular-pulse",
        title: "Irregular or unusual pulse",
        questionType: "scenario",
        difficulty: 2,
        concept:
          "CNAs should report a pulse that is very fast, very slow, irregular, weak, or different from the resident's usual baseline. The CNA measures carefully and reports rather than interpreting the rhythm medically.",
        example:
          "If a resident's pulse feels irregular and the resident seems dizzy, the CNA reports this promptly.",
        question:
          "A resident's pulse feels irregular and the resident says they feel dizzy. What should the CNA do?",
        idealAnswer:
          "The CNA should measure carefully, stay with the resident if needed, and report the irregular pulse and dizziness to the nurse promptly.",
        memoryTip: "Unusual pulse plus symptoms equals report.",
        correctExplanation:
          "Yes. You included both the abnormal observation and nurse notification.",
        incorrectExplanation:
          "The safest answer is to report the irregular pulse and dizziness to the nurse promptly.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "measure carefully",
            keywords: ["measure", "check", "count", "carefully"],
          },
          {
            label: "symptom observation",
            keywords: ["dizzy", "dizziness", "symptom", "irregular"],
          },
          {
            label: "report to nurse",
            keywords: ["report", "nurse", "notify", "tell"],
          },
        ],
      },
      {
        id: "count-respirations-discreetly",
        title: "Counting respirations discreetly",
        questionType: "critical_thinking",
        difficulty: 2,
        concept:
          "Respirations are often counted without telling the resident at that exact moment because people may change their breathing if they know it is being counted. The CNA still treats the resident respectfully and records accurately.",
        example:
          "After taking pulse, the CNA may keep fingers in place and count respirations while the resident remains relaxed.",
        question:
          "Why might a CNA count respirations without announcing it at that exact moment?",
        idealAnswer:
          "Because a resident may change their breathing if they know it is being counted, so discreet counting helps get an accurate rate.",
        memoryTip: "Quiet count, accurate breathing.",
        correctExplanation:
          "Right. This is about accuracy, not secrecy or disrespect.",
        incorrectExplanation:
          "The key idea is that announcing the count can change breathing, so discreet counting helps accuracy.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "breathing may change",
            keywords: ["change breathing", "breathe differently", "alter", "change"],
          },
          {
            label: "accuracy",
            keywords: ["accurate", "accuracy", "correct rate"],
          },
        ],
      },
      {
        id: "blood-pressure-reporting",
        title: "Blood pressure reporting",
        questionType: "scenario",
        difficulty: 3,
        concept:
          "A blood pressure reading should be measured according to procedure, recorded correctly, and reported when it is outside the resident's normal range or paired with symptoms like dizziness, headache, weakness, or chest discomfort.",
        example:
          "If the reading is unusual and the resident reports dizziness, the CNA should notify the nurse rather than simply charting and leaving.",
        question:
          "A resident's blood pressure is much higher than usual and they report a headache. What should the CNA do?",
        idealAnswer:
          "The CNA should ensure the reading was taken correctly, observe the symptoms, and report the high blood pressure and headache to the nurse promptly.",
        memoryTip: "Unusual number plus symptom needs nurse attention.",
        correctExplanation:
          "Correct. You kept the CNA in scope: measure accurately, observe, and report.",
        incorrectExplanation:
          "A safe CNA answer includes checking accuracy and reporting the unusual reading and symptom to the nurse.",
        passThreshold: 3,
        acceptableConcepts: [
          {
            label: "check accuracy",
            keywords: ["correctly", "accurate", "recheck", "taken correctly"],
          },
          {
            label: "symptom observation",
            keywords: ["headache", "symptom", "dizzy", "weak"],
          },
          {
            label: "report high reading",
            keywords: ["report", "nurse", "notify", "tell"],
          },
        ],
      },
      {
        id: "vital-signs-safety-summary",
        title: "Vital signs safety judgment",
        questionType: "summary",
        difficulty: 3,
        concept:
          "The exam pattern for vital signs is not just knowing numbers. The CNA observes the resident, compares with what is normal for that resident, documents accurately, and reports concerning changes to the nurse.",
        example:
          "A normal-looking number can still matter if it is a sudden change for that resident and symptoms are present.",
        question:
          "What is the overall CNA pattern for handling concerning vital sign changes?",
        idealAnswer:
          "Measure accurately, observe the resident, compare with their usual baseline when known, document correctly, and report concerning changes or symptoms to the nurse.",
        memoryTip: "Accurate number, whole resident, prompt report.",
        correctExplanation:
          "Excellent. That is the exam-ready vital signs pattern.",
        incorrectExplanation:
          "The full pattern is measure accurately, observe the whole resident, document, and report concerning changes or symptoms.",
        passThreshold: 3,
        acceptableConcepts: [
          {
            label: "measure accurately",
            keywords: ["measure", "accurate", "correctly"],
          },
          {
            label: "observe resident",
            keywords: ["observe", "symptoms", "whole resident"],
          },
          {
            label: "baseline or change",
            keywords: ["baseline", "usual", "change", "normal for them"],
          },
          {
            label: "document and report",
            keywords: ["document", "record", "report", "nurse"],
          },
        ],
      },
    ],
    completionMessage:
      "Great work. Key takeaways: measure vital signs accurately, watch the whole resident, compare changes to baseline when known, and report unusual readings or symptoms to the nurse promptly.",
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
    estimatedMinutes: 26,
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
        questionType: "application",
        difficulty: 1,
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
      {
        id: "objective-reporting",
        title: "Objective reporting",
        questionType: "application",
        difficulty: 2,
        concept:
          "CNAs should report what they see, hear, smell, measure, or are told by the resident. Objective reporting avoids judgmental labels and gives the nurse useful facts.",
        example:
          "Instead of saying 'Mr. Lee is being difficult,' say 'Mr. Lee refused breakfast and said his stomach hurts.'",
        question:
          "How can a CNA turn 'the resident is being difficult' into an objective report?",
        idealAnswer:
          "Report the specific facts, such as what the resident did or said, instead of using a judgmental label.",
        memoryTip: "Facts, not labels.",
        correctExplanation:
          "Correct. Objective communication gives the nurse usable information.",
        incorrectExplanation:
          "The key is to remove the label and report specific facts: what happened, what was said, and what you observed.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "specific facts",
            keywords: ["facts", "specific", "what happened", "what they said"],
          },
          {
            label: "avoid judgment",
            keywords: ["not judgmental", "avoid labels", "not difficult", "label"],
          },
          {
            label: "report to nurse",
            keywords: ["report", "nurse", "tell"],
          },
        ],
      },
      {
        id: "de-escalating-frustration",
        title: "Responding to frustration",
        questionType: "scenario",
        difficulty: 2,
        concept:
          "When a resident is upset, the CNA should stay calm, listen, use respectful language, keep the resident safe, and report concerns. Arguing or matching the resident's tone can escalate the situation.",
        example:
          "If a resident shouts, the CNA can lower their voice and say, 'I can see you are upset. Let me understand what you need.'",
        question:
          "A resident is yelling because care is taking too long. What should the CNA do first?",
        idealAnswer:
          "Stay calm, listen to the resident's concern, respond respectfully, keep the resident safe, and report concerns if needed.",
        memoryTip: "Calm voice, listening ears.",
        correctExplanation:
          "Yes. You chose de-escalation instead of arguing or ignoring.",
        incorrectExplanation:
          "A safe answer starts with staying calm and listening respectfully, not arguing, threatening, or walking away without ensuring safety.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "stay calm",
            keywords: ["calm", "lower voice", "stay calm"],
          },
          {
            label: "listen",
            keywords: ["listen", "understand", "concern"],
          },
          {
            label: "respectful response",
            keywords: ["respect", "respectful", "courteous"],
          },
          {
            label: "safety or report",
            keywords: ["safe", "safety", "report", "nurse"],
          },
        ],
      },
      {
        id: "hearing-vision-support",
        title: "Supporting hearing or vision needs",
        questionType: "scenario",
        difficulty: 2,
        concept:
          "Communication should be adapted to the resident's needs. CNAs can face the resident, speak clearly, reduce background noise, make sure hearing aids or glasses are available, and confirm understanding.",
        example:
          "For a resident with hearing loss, standing behind them and speaking quickly makes care harder and less respectful.",
        question:
          "How should a CNA communicate with a resident who has trouble hearing?",
        idealAnswer:
          "Face the resident, speak clearly, reduce noise, make sure hearing aids are in place if used, and confirm understanding.",
        memoryTip: "Face, clear, confirm.",
        correctExplanation:
          "Good. You adapted communication instead of assuming the resident cannot understand.",
        incorrectExplanation:
          "A complete answer should include facing the resident, speaking clearly, reducing noise, and confirming understanding.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "face resident",
            keywords: ["face", "look at", "front"],
          },
          {
            label: "speak clearly",
            keywords: ["clearly", "slowly", "speak clear"],
          },
          {
            label: "reduce noise or use aid",
            keywords: ["noise", "hearing aid", "glasses", "quiet"],
          },
          {
            label: "confirm understanding",
            keywords: ["understand", "confirm", "repeat back"],
          },
        ],
      },
      {
        id: "family-questions-scope",
        title: "Family questions and CNA scope",
        questionType: "critical_thinking",
        difficulty: 3,
        concept:
          "CNAs can share basic non-private care observations with the care team, but they should not explain diagnoses, medications, test results, or treatment plans to family. Those questions should be referred to the nurse.",
        example:
          "If a daughter asks why a medication changed, the CNA should say the nurse can answer that question.",
        question:
          "A family member asks what the resident's diagnosis means. What should the CNA do?",
        idealAnswer:
          "The CNA should not explain the diagnosis and should refer the family member to the nurse.",
        memoryTip: "Diagnosis questions go to the nurse.",
        correctExplanation:
          "Correct. That keeps the CNA within scope and protects privacy.",
        incorrectExplanation:
          "The safe answer is to avoid explaining diagnoses or treatment and refer the question to the nurse.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "do not explain diagnosis",
            keywords: ["do not explain", "dont explain", "not explain", "diagnosis"],
          },
          {
            label: "refer to nurse",
            keywords: ["nurse", "refer", "ask the nurse"],
          },
          {
            label: "scope or privacy",
            keywords: ["scope", "privacy", "hipaa", "not allowed"],
          },
        ],
      },
      {
        id: "communication-summary",
        title: "Communication summary judgment",
        questionType: "summary",
        difficulty: 3,
        concept:
          "Exam-ready CNA communication is respectful, objective, clear, and within scope. The CNA listens, explains care, reports facts to the nurse, and refers questions that require nursing judgment.",
        example:
          "The CNA can say what they observed, but the nurse explains what it means medically.",
        question:
          "What is the overall communication pattern a CNA should use on exam questions?",
        idealAnswer:
          "Be respectful, listen, explain care, report objective facts to the nurse, and refer medical or private questions to the nurse.",
        memoryTip: "Respectful words, factual reports, nurse for medical questions.",
        correctExplanation:
          "Excellent. That pattern works across many communication questions.",
        incorrectExplanation:
          "The full pattern includes respect, listening, explaining care, objective reporting, and staying within CNA scope.",
        passThreshold: 3,
        acceptableConcepts: [
          {
            label: "respect and listen",
            keywords: ["respect", "listen", "courteous"],
          },
          {
            label: "explain care",
            keywords: ["explain", "care", "procedure"],
          },
          {
            label: "objective facts",
            keywords: ["objective", "facts", "specific"],
          },
          {
            label: "refer to nurse",
            keywords: ["nurse", "refer", "medical question"],
          },
        ],
      },
    ],
    completionMessage:
      "Strong work. Key takeaways: CNA communication should be respectful, calm, objective, adapted to the resident, and within scope; medical explanations and private questions go to the nurse.",
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
    estimatedMinutes: 26,
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
        questionType: "application",
        difficulty: 1,
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
      {
        id: "objective-documentation",
        title: "Objective documentation",
        questionType: "application",
        difficulty: 2,
        concept:
          "Documentation should be factual, timely, and based on what the CNA observed, measured, did, or heard the resident say. Avoid opinions, blame, and vague words.",
        example:
          "Write 'resident ate 25% of breakfast and said, \"I feel nauseated\"' instead of 'resident was impossible at breakfast.'",
        question:
          "What makes CNA documentation objective?",
        idealAnswer:
          "It records facts the CNA observed, measured, did, or heard the resident say without opinions or judgmental labels.",
        memoryTip: "Chart facts, not feelings about the resident.",
        correctExplanation:
          "Correct. Objective documentation protects the resident and gives the care team useful information.",
        incorrectExplanation:
          "A complete answer should mention factual observations or measurements and avoiding opinions or labels.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "facts observed or measured",
            keywords: ["facts", "observed", "measured", "what happened"],
          },
          {
            label: "resident statements",
            keywords: ["said", "resident stated", "told"],
          },
          {
            label: "avoid opinions",
            keywords: ["opinion", "judgment", "label", "not vague"],
          },
        ],
      },
      {
        id: "timely-charting",
        title: "Timely charting",
        questionType: "critical_thinking",
        difficulty: 2,
        concept:
          "Documentation should be completed according to facility policy as soon as practical after care. Delayed charting can lead to forgotten details, inaccurate records, and unsafe follow-up.",
        example:
          "If intake is not recorded until hours later, the amount may be remembered incorrectly.",
        question:
          "Why should a CNA document care and observations promptly?",
        idealAnswer:
          "Prompt documentation helps keep the record accurate, prevents forgotten details, and helps the nurse follow up on changes.",
        memoryTip: "Chart soon while facts are fresh.",
        correctExplanation:
          "Right. Timely charting is part of safe communication.",
        incorrectExplanation:
          "The key is accuracy and follow-up. Waiting too long can cause missed or incorrect information.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "accuracy",
            keywords: ["accurate", "accuracy", "correct"],
          },
          {
            label: "prevents forgotten details",
            keywords: ["forget", "forgotten", "fresh", "remember"],
          },
          {
            label: "supports follow-up",
            keywords: ["follow up", "nurse", "changes", "safe"],
          },
        ],
      },
      {
        id: "skin-change-scenario",
        title: "Skin change reporting",
        questionType: "scenario",
        difficulty: 2,
        concept:
          "CNAs should report skin changes such as redness, warmth, open areas, drainage, bruising, swelling, or complaints of pain. The CNA does not diagnose pressure injuries but reports observations promptly.",
        example:
          "Redness over the tailbone after repositioning should be reported, especially if it does not fade quickly.",
        question:
          "While helping a resident turn, you notice new redness on the tailbone. What should you do?",
        idealAnswer:
          "Observe the redness, keep the resident positioned safely, and report the new skin change to the nurse promptly.",
        memoryTip: "New skin change equals nurse report.",
        correctExplanation:
          "Correct. You stayed in CNA scope and reported the observation.",
        incorrectExplanation:
          "The safe CNA action is to report new skin redness or breakdown to the nurse. Do not ignore it or diagnose it.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "observe skin change",
            keywords: ["observe", "redness", "skin", "tailbone"],
          },
          {
            label: "position safely",
            keywords: ["position", "safe", "reposition"],
          },
          {
            label: "report to nurse",
            keywords: ["report", "nurse", "notify", "tell"],
          },
        ],
      },
      {
        id: "correcting-documentation-errors",
        title: "Correcting documentation errors",
        questionType: "application",
        difficulty: 3,
        concept:
          "If a CNA makes a documentation error, they should follow facility policy for correction. They should not erase, hide, falsify, backdate, or chart care that was not done.",
        example:
          "If the CNA forgot to document a completed task, they follow policy for a late entry rather than pretending it was charted earlier.",
        question:
          "What should a CNA do if they realize they made a documentation mistake?",
        idealAnswer:
          "Follow facility policy to correct the error honestly. Do not erase, falsify, backdate, or chart care that was not done.",
        memoryTip: "Correct honestly, never falsify.",
        correctExplanation:
          "Exactly. Honesty in documentation is a safety and legal issue.",
        incorrectExplanation:
          "The important idea is to follow policy and correct the record honestly, not erase, hide, backdate, or falsify.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "follow policy",
            keywords: ["policy", "facility", "procedure"],
          },
          {
            label: "correct honestly",
            keywords: ["honest", "correct", "error", "mistake"],
          },
          {
            label: "do not falsify",
            keywords: ["do not falsify", "dont falsify", "not falsify", "erase", "backdate"],
          },
        ],
      },
      {
        id: "documentation-summary",
        title: "Observe, report, document",
        questionType: "summary",
        difficulty: 3,
        concept:
          "The CNA documentation pattern is observe carefully, report important changes to the nurse, document facts according to policy, and never chart false or assumed information.",
        example:
          "If a resident refuses lunch and says they feel sick, the CNA reports the change and documents the refusal and statement according to policy.",
        question:
          "What is the overall observe-report-document pattern a CNA should remember?",
        idealAnswer:
          "Observe carefully, report important changes to the nurse, document factual information according to policy, and never chart false or assumed care.",
        memoryTip: "See it, say it, chart facts.",
        correctExplanation:
          "Excellent. That pattern is central to safe CNA practice.",
        incorrectExplanation:
          "The full pattern is observe carefully, report important changes, document facts, and never falsify or assume.",
        passThreshold: 3,
        acceptableConcepts: [
          {
            label: "observe carefully",
            keywords: ["observe", "notice", "watch"],
          },
          {
            label: "report changes",
            keywords: ["report", "nurse", "changes"],
          },
          {
            label: "document facts",
            keywords: ["document", "chart", "facts"],
          },
          {
            label: "never falsify",
            keywords: ["never falsify", "not falsify", "false", "assume"],
          },
        ],
      },
    ],
    completionMessage:
      "Well done. Key takeaways: observe changes carefully, report important findings promptly, document objective facts on time, measure I&O accurately, and never falsify or assume care.",
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
    estimatedMinutes: 26,
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
        questionType: "scenario",
        difficulty: 1,
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
      {
        id: "fall-prevention-basics",
        title: "Fall prevention basics",
        questionType: "application",
        difficulty: 2,
        concept:
          "Fall prevention includes keeping the bed low, call light within reach, clutter cleared, needed items nearby, non-skid footwear in place, and assistive devices used as instructed.",
        example:
          "A resident who uses a walker should have it within reach before standing, not across the room.",
        question:
          "Name two actions a CNA can take to reduce fall risk before leaving a resident's room.",
        idealAnswer:
          "Keep the bed low, place the call light and needed items within reach, clear clutter, use non-skid footwear, and follow the care plan for mobility aids.",
        memoryTip: "Low bed, clear path, call light close.",
        correctExplanation:
          "Good. Those are practical fall-prevention actions.",
        incorrectExplanation:
          "A complete answer should name specific fall-prevention steps like bed low, call light close, clutter cleared, and non-skid footwear.",
        passThreshold: 2,
        acceptableConcepts: [
          {
            label: "bed low",
            keywords: ["bed low", "lowest position", "low bed"],
          },
          {
            label: "call light and items close",
            keywords: ["call light", "within reach", "needed items"],
          },
          {
            label: "clear clutter",
            keywords: ["clutter", "clear path", "clear floor"],
          },
          {
            label: "non-skid footwear or aids",
            keywords: ["non skid", "nonskid", "footwear", "walker", "assistive"],
          },
        ],
      },
      {
        id: "restraints-safety",
        title: "Restraints and safety",
        questionType: "critical_thinking",
        difficulty: 2,
        concept:
          "Restraints are not used for staff convenience or punishment. CNAs follow the care plan and facility policy, monitor residents as assigned, protect dignity, and report concerns to the nurse.",
        example:
          "A CNA should not tie a resident into a chair because they are wandering. That creates a restraint issue and must be handled through the nurse and care plan.",
        question:
          "Why is it wrong for a CNA to restrain a resident just because the resident is wandering?",
        idealAnswer:
          "Restraints cannot be used for convenience or punishment. The CNA should follow the care plan, keep the resident safe, and report wandering concerns to the nurse.",
        memoryTip: "Safety plan, not convenience restraint.",
        correctExplanation:
          "Correct. Restraint questions are rights and safety questions together.",
        incorrectExplanation:
          "The key is that restraints are not a CNA shortcut. Report the safety concern and follow the care plan.",
        passThreshold: 3,
        acceptableConcepts: [
          {
            label: "not for convenience",
            keywords: ["convenience", "punishment", "not allowed", "wrong"],
          },
          {
            label: "follow care plan",
            keywords: ["care plan", "policy", "facility"],
          },
          {
            label: "keep safe",
            keywords: ["safe", "safety", "protect"],
          },
          {
            label: "report to nurse",
            keywords: ["report", "nurse", "notify"],
          },
        ],
      },
      {
        id: "fire-response",
        title: "Fire response priorities",
        questionType: "scenario",
        difficulty: 2,
        concept:
          "In a fire or smoke emergency, CNAs follow facility emergency procedures, protect residents in immediate danger, alert others, contain the hazard when safe, and never use elevators during a fire.",
        example:
          "If smoke is seen near a resident room, the CNA alerts staff and follows the facility's fire plan rather than trying to handle it alone.",
        question:
          "If a CNA sees smoke near a resident room, what should the CNA do?",
        idealAnswer:
          "Follow facility fire procedures, protect residents in immediate danger, alert staff, contain the area if safe, and avoid elevators.",
        memoryTip: "Protect, alert, contain, follow the plan.",
        correctExplanation:
          "Right. Fire questions reward calm facility-procedure thinking.",
        incorrectExplanation:
          "A safe answer should include protecting residents, alerting others, following facility procedure, and not using elevators.",
        passThreshold: 3,
        acceptableConcepts: [
          {
            label: "follow fire procedure",
            keywords: ["procedure", "fire plan", "policy", "facility"],
          },
          {
            label: "protect residents",
            keywords: ["protect", "resident", "danger", "rescue"],
          },
          {
            label: "alert staff",
            keywords: ["alert", "call", "alarm", "staff"],
          },
          {
            label: "avoid elevators",
            keywords: ["no elevator", "avoid elevator", "stairs"],
          },
        ],
      },
      {
        id: "elopement-response",
        title: "Elopement and wandering",
        questionType: "scenario",
        difficulty: 3,
        concept:
          "A resident at risk for elopement needs supervision according to the care plan. If a resident is missing or trying to leave unsafely, the CNA alerts the nurse or supervisor immediately and follows facility procedure.",
        example:
          "If a confused resident is seen heading toward an exit, the CNA calmly redirects if safe and gets help right away.",
        question:
          "A confused resident is walking toward an exit and says they are going home. What should the CNA do?",
        idealAnswer:
          "Stay calm, keep the resident safe, redirect if possible, and notify the nurse or supervisor immediately according to facility procedure.",
        memoryTip: "Redirect calmly, report immediately.",
        correctExplanation:
          "Correct. You protected safety without using force or ignoring the risk.",
        incorrectExplanation:
          "The safe response is calm redirection if possible, immediate reporting, and following facility procedure.",
        passThreshold: 3,
        acceptableConcepts: [
          {
            label: "stay calm",
            keywords: ["calm", "stay calm", "gently"],
          },
          {
            label: "keep safe or redirect",
            keywords: ["safe", "redirect", "guide", "supervise"],
          },
          {
            label: "notify nurse or supervisor",
            keywords: ["notify", "report", "nurse", "supervisor"],
          },
          {
            label: "follow procedure",
            keywords: ["procedure", "policy", "facility"],
          },
        ],
      },
      {
        id: "emergency-summary",
        title: "Safety-first emergency pattern",
        questionType: "summary",
        difficulty: 3,
        concept:
          "The safety-first CNA pattern is assess the immediate danger, call for help or notify the nurse, protect the resident within CNA scope, and follow facility procedure. Do not delay emergencies or act outside scope.",
        example:
          "For falls, choking, fire, and elopement, the first answer is usually the one that protects safety and gets the right help quickly.",
        question:
          "What safety-first pattern should a CNA use for emergency exam questions?",
        idealAnswer:
          "Assess immediate safety, call for help or notify the nurse, protect the resident within CNA scope, and follow facility procedure.",
        memoryTip: "Assess, call, act within scope.",
        correctExplanation:
          "Excellent. That safety-first pattern will help across emergency questions.",
        incorrectExplanation:
          "The full pattern is assess safety, call for help or notify the nurse, protect the resident, and follow procedure within CNA scope.",
        passThreshold: 3,
        acceptableConcepts: [
          {
            label: "assess safety",
            keywords: ["assess", "safety", "danger"],
          },
          {
            label: "call or notify",
            keywords: ["call", "help", "notify", "nurse"],
          },
          {
            label: "protect resident",
            keywords: ["protect", "resident", "safe"],
          },
          {
            label: "follow procedure and scope",
            keywords: ["procedure", "scope", "policy"],
          },
        ],
      },
    ],
    completionMessage:
      "Good job. Key takeaways: prevent falls before they happen, never use restraints for convenience, respond immediately to airway or fire risks, redirect elopement calmly, and use the safety-first pattern: assess, call, then act within CNA scope.",
    nextRecommendedLessonIds: ["infection-control-foundations", "communication-and-professional-boundaries"],
  },

  // ─── CLINICAL SKILLS ────────────────────────────────────────────────────────

  {
    id: "clinical-skill-handwashing",
    slug: "clinical-skill-handwashing",
    title: "Clinical Skill: Handwashing",
    domainSlug: "infection-control-and-safety",
    domainTitle: "Infection Control and Safety",
    summary: "Master the evaluator checkpoints for the handwashing clinical skill: friction technique, correct direction, 20-second minimum, and faucet closure without recontamination.",
    learningGoal: "Perform handwashing correctly and explain the critical steps that evaluators specifically watch for.",
    estimatedMinutes: 15,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "handwashing-step-2-friction-direction",
        title: "Friction technique and hand direction",
        questionType: "recall",
        difficulty: 1,
        concept: "During handwashing, use friction to distribute soap and create lather, cleaning the front and back of hands, between fingers, around cuticles, under nails, and wrists. Keep hands pointed DOWN toward the sink throughout to avoid recontamination.",
        example: "If hands point upward while lathering, contaminated water can run back toward the wrists and re-contaminate areas already cleaned.",
        question: "Which direction should hands point during handwashing, and why?",
        idealAnswer: "Hands should point DOWN toward the sink to avoid recontamination.",
        memoryTip: "Hands down, germs out — water flows away from you, not back.",
        correctExplanation: "Correct. The evaluator specifically checks that hands stay pointed down during lathering and rinsing.",
        incorrectExplanation: "Hands must point DOWN toward the sink. Pointing them upward allows contaminated water to run back over clean areas.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "hands pointed down", keywords: ["down", "downward", "toward sink", "toward drain"] },
          { label: "avoid recontamination", keywords: ["recontamination", "prevent", "contamination", "clean areas"] },
        ],
      },
      {
        id: "handwashing-step-3-twenty-seconds",
        title: "Twenty seconds of friction",
        questionType: "recall",
        difficulty: 1,
        concept: "Provide cleansing friction for a minimum of 20 seconds with hands lathered with soap. This duration is required to adequately remove transient microorganisms from all surfaces.",
        example: "Humming 'Happy Birthday' twice takes roughly 20 seconds and is a common way to time the friction step.",
        question: "What is the minimum friction time required during the handwashing clinical skill?",
        idealAnswer: "A minimum of 20 seconds of friction with soapy lathered hands.",
        memoryTip: "20 seconds — every surface, every time.",
        correctExplanation: "Right. The evaluator checks for a full 20 seconds of friction, not a quick scrub.",
        incorrectExplanation: "The required minimum is 20 seconds of friction with lathered hands — not 10 seconds or a quick rinse.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "twenty seconds minimum", keywords: ["20 seconds", "twenty seconds", "minimum", "full 20"] },
        ],
      },
      {
        id: "handwashing-step-6-faucet-closure",
        title: "Closing the faucet without recontamination",
        questionType: "critical_thinking",
        difficulty: 2,
        concept: "The handwashing skill ends by using a dry, clean paper towel to close the faucet. The faucet handle is contaminated because dirty hands touched it at the start. Touching it with clean bare hands undoes the entire wash.",
        example: "After drying hands, use the paper towel from drying to turn the faucet off, then discard the towel in the trash.",
        question: "A student washes hands correctly but then turns off the faucet with bare clean hands. What evaluator criterion does this violate?",
        idealAnswer: "The faucet handle is contaminated from initial dirty-hand contact. Clean hands should not touch it — use a dry clean paper towel to close the faucet.",
        memoryTip: "Paper towel closes the faucet — never bare clean hands.",
        correctExplanation: "Exactly. This is a classic evaluator checkpoint. The skill is not complete until the faucet is closed without recontaminating clean hands.",
        incorrectExplanation: "The faucet carries germs from the initial dirty-hand contact. Using bare clean hands to close it fails the skill. A clean dry paper towel must close the faucet.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "paper towel to close faucet", keywords: ["paper towel", "towel", "close faucet", "turn off"] },
          { label: "faucet is contaminated", keywords: ["contaminated", "dirty", "germs", "touched with dirty"] },
        ],
      },
    ],
    completionMessage: "Solid handwashing foundation. Evaluator checkpoints: hands pointed down, 20 seconds of friction on all surfaces, and a clean dry paper towel to close the faucet.",
    nextRecommendedLessonIds: ["infection-control-foundations", "clinical-skill-perineal-care"],
  },

  {
    id: "clinical-skill-radial-pulse",
    slug: "clinical-skill-radial-pulse",
    title: "Clinical Skill: Radial Pulse",
    domainSlug: "vital-signs-basics",
    domainTitle: "Vital Signs Basics",
    summary: "Master the evaluator criteria for measuring and recording a radial pulse: correct finger placement, full-minute count, evaluator notification, and ±4 BPM accuracy standard.",
    learningGoal: "Locate the radial pulse correctly, count for one full minute, and record within the required accuracy range.",
    estimatedMinutes: 15,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "radial-pulse-step-4-finger-placement",
        title: "Two-finger placement on the inner wrist",
        questionType: "recall",
        difficulty: 1,
        concept: "Use two fingers — the index and middle fingers — to find the pulse on the inner wrist closest to the patient's thumb. Place your thumb on the back of the outer wrist. Never use your thumb to take a pulse because your thumb has its own detectable pulse.",
        example: "Place index and middle fingers on the thumb-side of the inner wrist, feel for the artery. Your thumb rests on the back of the wrist for support without pressing.",
        question: "Which fingers does the checklist require for taking a radial pulse, and where on the wrist are they placed?",
        idealAnswer: "Use the index and middle fingers on the inner wrist closest to the patient's thumb. The thumb rests on the back of the outer wrist.",
        memoryTip: "Two fingers, thumb side, inner wrist — never use your own thumb.",
        correctExplanation: "Correct. The evaluator checks both the correct fingers and the correct site: thumb side of the inner wrist.",
        incorrectExplanation: "The checklist requires the index and middle fingers placed on the inner wrist closest to the patient's thumb. The thumb goes on the back of the wrist only for support.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "index and middle fingers", keywords: ["index", "middle", "two fingers", "index and middle"] },
          { label: "inner wrist near thumb", keywords: ["inner wrist", "thumb side", "closest to thumb", "radial"] },
        ],
      },
      {
        id: "radial-pulse-step-5-full-minute-count",
        title: "Count for one full minute and announce to evaluator",
        questionType: "application",
        difficulty: 1,
        concept: "Count the pulse for one full minute. Tell the evaluator when you begin counting and when you stop counting. Ask the resident to remain quiet during the skill. Counting for 30 seconds and doubling is not acceptable on the clinical skills exam.",
        example: "Say 'I am beginning to count now' to the evaluator, count for a full 60 seconds, then say 'I have finished counting.'",
        question: "Why must the pulse be counted for one full minute on the clinical skills exam, and what must the candidate tell the evaluator?",
        idealAnswer: "One full minute is required for accuracy. Tell the evaluator when counting begins and when it stops.",
        memoryTip: "Full minute, announce to evaluator — 30-second doubling is not allowed.",
        correctExplanation: "Correct. Announcing start and stop to the evaluator is a specific checklist requirement, not just good practice.",
        incorrectExplanation: "Counting for 30 seconds and doubling is not permitted. One full minute is required, and the evaluator must be told when counting starts and ends.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "one full minute", keywords: ["full minute", "one minute", "60 seconds", "full 60"] },
          { label: "tell evaluator start and stop", keywords: ["tell evaluator", "announce", "begin counting", "stop counting"] },
        ],
      },
      {
        id: "radial-pulse-step-9-accuracy-standard",
        title: "Accuracy standard: ±4 beats per minute",
        questionType: "scenario",
        difficulty: 2,
        concept: "The candidate must record the resident's pulse rate within plus or minus 4 beats per minute of the nurse's measurement. If the nurse measures 72 bpm, any value from 68 to 76 bpm is acceptable. After documenting, wash hands one final time to end the skill.",
        example: "Nurse measures 80 bpm. Candidate records 76 bpm. That is within ±4 and passes. Recording 74 bpm also passes. Recording 84 bpm fails.",
        question: "The nurse measures a pulse of 78 bpm. What range of recorded values will pass the clinical skills accuracy requirement?",
        idealAnswer: "Any value from 74 to 82 bpm (78 ± 4) is within the acceptable range.",
        memoryTip: "±4 BPM — four above or four below passes.",
        correctExplanation: "Right. ±4 BPM is the radial pulse accuracy standard. Anything outside that range fails even if technique was perfect.",
        incorrectExplanation: "The accuracy standard is ±4 beats per minute. With a nurse measurement of 78, the acceptable range is 74 to 82 bpm.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "plus or minus four BPM", keywords: ["±4", "plus or minus 4", "four beats", "4 bpm", "four bpm"] },
          { label: "correct range given the scenario", keywords: ["74", "82", "74 to 82", "within range"] },
        ],
      },
    ],
    completionMessage: "Strong radial pulse technique. Key checkpoints: index and middle fingers on the inner wrist near the thumb, count one full minute, announce start and stop to evaluator, and record within ±4 BPM.",
    nextRecommendedLessonIds: ["clinical-skill-respirations", "vital-signs-basics"],
  },

  {
    id: "clinical-skill-respirations",
    slug: "clinical-skill-respirations",
    title: "Clinical Skill: Respirations",
    domainSlug: "vital-signs-basics",
    domainTitle: "Vital Signs Basics",
    summary: "Master the evaluator criteria for counting respirations: counting covertly, defining one respiration correctly, counting one full minute, and meeting the ±2 breath per minute accuracy standard.",
    learningGoal: "Count respirations for one full minute without alerting the resident, and record within the required accuracy range.",
    estimatedMinutes: 15,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "respirations-step-3-covert-counting",
        title: "Count without coaching — pretend to take the pulse",
        questionType: "critical_thinking",
        difficulty: 2,
        concept: "Tell the patient you are going to take their vital signs and pretend to take the pulse. Do NOT tell the resident you are counting respirations. If a resident knows their breathing is being measured, they may consciously alter it, making the count inaccurate. When this skill is tested separately from the pulse skill, the candidate is allowed to tell the resident their pulse is being counted.",
        example: "Keep fingers on the wrist as if counting a pulse while watching the chest rise and fall. The resident stays relaxed and breathes naturally.",
        question: "Why should the CNA pretend to take the pulse while counting respirations?",
        idealAnswer: "If the resident knows respirations are being counted, they may change their breathing pattern, making the count inaccurate. Counting covertly produces a more accurate baseline.",
        memoryTip: "Pretend pulse, watch chest — resident breathes naturally.",
        correctExplanation: "Exactly. The evaluator checks that the candidate does not tell the resident their breathing is being counted.",
        incorrectExplanation: "Telling the resident you are counting their breathing causes them to alter the pattern. The correct approach is to count covertly while appearing to take the pulse.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "pretend to take pulse", keywords: ["pretend", "fake", "pulse", "appear to"] },
          { label: "resident may change breathing", keywords: ["alter", "change breathing", "conscious", "voluntary", "inaccurate"] },
        ],
      },
      {
        id: "respirations-step-4-definition",
        title: "One inspiration plus one expiration equals one respiration",
        questionType: "recall",
        difficulty: 1,
        concept: "Count respirations for one full minute. One inspiration (breathing in) plus one expiration (breathing out) equals one respiration. Count only one rise-and-fall cycle as a single breath, not each chest movement separately.",
        example: "Chest rises — that is the inspiration. Chest falls — that is the expiration. Together they equal one respiration. Count 16 of these cycles in one minute and record 16.",
        question: "How is one respiration defined on the clinical skills checklist?",
        idealAnswer: "One inspiration plus one expiration equals one respiration.",
        memoryTip: "In + out = one breath.",
        correctExplanation: "Correct. Counting each movement separately would double the recorded rate.",
        incorrectExplanation: "A respiration is a complete breath cycle: one inspiration and one expiration together equal one respiration.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "one inspiration plus one expiration", keywords: ["inspiration", "expiration", "in and out", "one cycle", "rise and fall"] },
        ],
      },
      {
        id: "respirations-step-8-accuracy-standard",
        title: "Accuracy standard: ±2 breaths per minute",
        questionType: "scenario",
        difficulty: 2,
        concept: "The candidate must record the resident's respiration rate within plus or minus 2 breaths per minute of the nurse's measurement. This is a tighter standard than the pulse (±4 BPM). After documenting, wash hands one final time to end the skill.",
        example: "Nurse measures 18 breaths per minute. The acceptable recorded range is 16 to 20. Recording 15 would fail.",
        question: "The nurse measures respirations at 20 breaths per minute. What is the acceptable recorded range for the candidate?",
        idealAnswer: "Any value from 18 to 22 breaths per minute (20 ± 2) is within the acceptable range.",
        memoryTip: "±2 for breathing — tighter than the pulse standard.",
        correctExplanation: "Right. ±2 is a strict standard. Technique and a full-minute count are what make it achievable.",
        incorrectExplanation: "The respiration accuracy standard is ±2 breaths per minute. With a nurse measurement of 20, the acceptable range is 18 to 22.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "plus or minus two breaths", keywords: ["±2", "plus or minus 2", "two breaths", "2 breaths"] },
          { label: "correct range given the scenario", keywords: ["18", "22", "18 to 22", "within range"] },
        ],
      },
    ],
    completionMessage: "Strong respiration technique. Key checkpoints: count covertly while pretending to take the pulse, count a full minute, define one respiration as one in-and-out cycle, and record within ±2 breaths per minute.",
    nextRecommendedLessonIds: ["clinical-skill-radial-pulse", "vital-signs-basics"],
  },

  {
    id: "clinical-skill-rom-elbow-wrist",
    slug: "clinical-skill-rom-elbow-wrist",
    title: "Clinical Skill: ROM — Elbow and Wrist",
    domainSlug: "restorative-care",
    domainTitle: "Restorative Care",
    summary: "Master the evaluator criteria for passive ROM to the elbow and wrist: keeping the elbow on the bed, correct joint support positions, three repetitions each, and smooth non-forceful movement.",
    learningGoal: "Perform elbow flexion/extension and wrist flexion/hyperextension correctly with proper support and discomfort monitoring.",
    estimatedMinutes: 15,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "rom-elbow-wrist-step-4-elbow-on-bed",
        title: "Elbow ROM: keep elbow on bed, support wrist, x3",
        questionType: "recall",
        difficulty: 1,
        concept: "Bend and straighten the arm at the elbow through ROM while supporting the wrist and keeping the elbow on the bed, three repetitions. The elbow must remain on the bed surface throughout to protect the joint and prevent strain on the shoulder.",
        example: "Support the resident's wrist with one hand while the other hand keeps the elbow on the bed. Bend the forearm up toward the shoulder, then straighten back down — that is one repetition. Repeat three times.",
        question: "What must the CNA keep on the bed surface during elbow ROM, and how many repetitions are required?",
        idealAnswer: "The elbow must remain on the bed surface throughout. Support the wrist and perform three repetitions of flexion and extension.",
        memoryTip: "Elbow stays on bed, wrist supported — three times.",
        correctExplanation: "Correct. The evaluator checks that the elbow stays on the bed and that the wrist is supported throughout all three reps.",
        incorrectExplanation: "The elbow must stay on the bed surface during elbow ROM. Support the wrist and complete three repetitions of flexion and extension.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "elbow on bed", keywords: ["elbow on bed", "elbow stays", "on the bed", "bed surface"] },
          { label: "three repetitions", keywords: ["three", "3", "x3", "three times", "three reps"] },
        ],
      },
      {
        id: "rom-elbow-wrist-step-5-wrist-rom",
        title: "Wrist ROM: bend down and back, support hand and arm x3",
        questionType: "recall",
        difficulty: 1,
        concept: "Move the wrist through ROM by bending the wrist to move the hand down and back (dorsiflexion and hyperextension), while supporting the hand and arm, three repetitions.",
        example: "Hold the resident's hand and lower arm. Bend the wrist downward (hand goes toward the floor), then bend it back the other way (hand goes toward the forearm). That is one repetition. Repeat three times.",
        question: "Describe the wrist ROM movement and what the CNA must support during the exercise.",
        idealAnswer: "Move the wrist by bending the hand down and then back, supporting the hand and arm throughout, three repetitions.",
        memoryTip: "Wrist: down and back, support hand and arm, three times.",
        correctExplanation: "Right. The evaluator checks that the hand and arm are supported and that both directions of wrist movement are performed.",
        incorrectExplanation: "Wrist ROM moves the hand down and then back. Support both the hand and the arm throughout, and perform three repetitions.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "hand down and back", keywords: ["down and back", "down then back", "flex and extend", "both directions"] },
          { label: "support hand and arm", keywords: ["support", "hand and arm", "hand supported", "arm supported"] },
        ],
      },
      {
        id: "rom-elbow-wrist-step-6-7-smooth-discomfort",
        title: "Smooth, slow, non-forceful movement and discomfort monitoring",
        questionType: "application",
        difficulty: 2,
        concept: "Control the extremity throughout ROM exercises providing smooth, slow, non-forceful movement. Ask the resident to report discomfort during ROM, or ask if the resident has discomfort during the exercises. Forced or jerky movement can cause injury.",
        example: "Move the arm gently through the range without pushing past resistance. Ask 'Are you feeling any discomfort?' before or during the exercises.",
        question: "What two things must a CNA monitor and control during passive ROM exercises?",
        idealAnswer: "Movement must be smooth, slow, and non-forceful. The resident must be asked about discomfort during the exercises.",
        memoryTip: "Smooth and slow, ask about pain — never push past resistance.",
        correctExplanation: "Exactly. Both movement quality and resident comfort monitoring are evaluator checkpoints for ROM.",
        incorrectExplanation: "ROM requires smooth, slow, non-forceful movement AND monitoring the resident for discomfort by asking about it during the exercises.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "smooth slow non-forceful", keywords: ["smooth", "slow", "non-forceful", "gentle", "controlled"] },
          { label: "ask about discomfort", keywords: ["discomfort", "pain", "ask", "report", "how do you feel"] },
        ],
      },
    ],
    completionMessage: "Good ROM technique. Key checkpoints: elbow on bed during elbow ROM, wrist supported during wrist ROM, three reps of each, smooth/slow/non-forceful movement, and ask about discomfort.",
    nextRecommendedLessonIds: ["clinical-skill-rom-shoulder", "clinical-skill-rom-hip-knee-ankle"],
  },

  {
    id: "clinical-skill-rom-shoulder",
    slug: "clinical-skill-rom-shoulder",
    title: "Clinical Skill: ROM — Shoulder",
    domainSlug: "restorative-care",
    domainTitle: "Restorative Care",
    summary: "Master the evaluator criteria for passive ROM to the shoulder: lifting the arm for flexion/extension, the snow angel motion for abduction/adduction, supporting wrist and elbow throughout, and three repetitions each.",
    learningGoal: "Perform shoulder flexion/extension and abduction/adduction correctly with proper support at the wrist and elbow.",
    estimatedMinutes: 15,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "rom-shoulder-step-4-flexion-extension",
        title: "Shoulder flexion and extension: lift straight arm x3",
        questionType: "recall",
        difficulty: 1,
        concept: "Lift the straightened arm through ROM while supporting the wrist and elbow, three repetitions. This is shoulder flexion (arm goes up) and extension (arm comes back down). The arm remains straight, and both the wrist and elbow must be supported at all times.",
        example: "One hand supports under the resident's wrist, the other hand supports under the elbow. Lift the straight arm up (flexion) and lower it back down (extension). That is one repetition. Perform three.",
        question: "During shoulder flexion/extension ROM, what does the CNA support and how many repetitions are required?",
        idealAnswer: "Support both the wrist and elbow while lifting the straightened arm up and lowering it back down, three repetitions.",
        memoryTip: "Lift straight arm: wrist AND elbow supported, three times.",
        correctExplanation: "Right. The evaluator checks that both the wrist and elbow are supported throughout all three reps.",
        incorrectExplanation: "Shoulder flexion/extension requires supporting both the wrist and elbow while lifting the straightened arm. Perform three repetitions.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "support wrist and elbow", keywords: ["wrist and elbow", "both supported", "wrist", "elbow"] },
          { label: "three repetitions", keywords: ["three", "3", "x3", "three times"] },
        ],
      },
      {
        id: "rom-shoulder-step-5-abduction-adduction",
        title: "Shoulder abduction and adduction: snow angel motion x3",
        questionType: "recall",
        difficulty: 1,
        concept: "Move the straightened arm out through ROM by moving it in and out away from and back toward the body — like making a snow angel — while supporting the wrist and elbow, three repetitions. This is shoulder abduction (arm moves away from body) and adduction (arm returns to body).",
        example: "Support wrist and elbow. Slide the straight arm out to the side (abduction) and back in toward the body (adduction). That is one snow-angel repetition. Perform three.",
        question: "What does the 'snow angel' motion test in shoulder ROM, and what must be supported?",
        idealAnswer: "The snow angel motion tests shoulder abduction (out) and adduction (back in). Support the wrist and elbow throughout all three repetitions.",
        memoryTip: "Snow angel: arm out and back in, wrist and elbow supported, three times.",
        correctExplanation: "Exactly. Abduction/adduction is distinct from flexion/extension — the evaluator will check for both movements as separate items.",
        incorrectExplanation: "The snow angel motion tests abduction (arm moves away from body) and adduction (arm returns). Support the wrist and elbow throughout and perform three reps.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "abduction and adduction", keywords: ["abduction", "adduction", "out and back", "away from body", "snow angel"] },
          { label: "support wrist and elbow", keywords: ["wrist and elbow", "supported", "support"] },
        ],
      },
      {
        id: "rom-shoulder-step-6-7-smooth-discomfort",
        title: "Smooth, slow, non-forceful and discomfort monitoring",
        questionType: "scenario",
        difficulty: 2,
        concept: "Control the extremity throughout ROM exercises providing smooth, slow, non-forceful movement. Ask the resident to report discomfort during ROM exercises. Exercising only the correct joint on the correct side is an evaluator checkpoint — verify the instructions before beginning.",
        example: "If the instructions say left shoulder ROM, perform all exercises on the left side only. Moving the right shoulder fails the skill even if technique is perfect.",
        question: "During shoulder ROM, the resident grimaces. What should the CNA do?",
        idealAnswer: "Stop and ask the resident about discomfort. Do not continue forcing movement past resistance. Report pain to the nurse.",
        memoryTip: "Smooth and slow, ask about discomfort — stop if there is pain.",
        correctExplanation: "Correct. ROM should never be forced past resistance or pain. Asking about discomfort is a checklist item.",
        incorrectExplanation: "When a resident shows signs of discomfort during ROM, stop the exercise and ask about pain. Never push past resistance. Report discomfort to the nurse.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "stop and ask about discomfort", keywords: ["stop", "ask", "discomfort", "pain"] },
          { label: "do not force", keywords: ["not force", "no force", "don't force", "gentle", "resistance"] },
        ],
      },
    ],
    completionMessage: "Solid shoulder ROM technique. Key checkpoints: wrist and elbow supported throughout, lift arm for flexion/extension, snow angel for abduction/adduction, three reps each, smooth/slow/non-forceful, and ask about discomfort.",
    nextRecommendedLessonIds: ["clinical-skill-rom-elbow-wrist", "clinical-skill-rom-hip-knee-ankle"],
  },

  {
    id: "clinical-skill-rom-hip-knee-ankle",
    slug: "clinical-skill-rom-hip-knee-ankle",
    title: "Clinical Skill: ROM — Hip, Knee, and Ankle",
    domainSlug: "restorative-care",
    domainTitle: "Restorative Care",
    summary: "Master the evaluator criteria for passive ROM to the hip, knee, and ankle: knee-to-chest with support under knee and heel, ankle dorsiflexion/plantar flexion with support at ankle and ball of foot, and three repetitions each.",
    learningGoal: "Perform hip/knee and ankle ROM correctly with proper hand placement and discomfort monitoring.",
    estimatedMinutes: 15,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "rom-hip-knee-step-4-knee-to-chest",
        title: "Hip and knee ROM: knee to chest, support under knee and heel x3",
        questionType: "recall",
        difficulty: 1,
        concept: "Bring the knee up to the chest and back down, while providing support under the knee and under the heel, three repetitions. This exercises hip flexion/extension and knee flexion/extension simultaneously. Supporting under the knee and under the heel protects both joints.",
        example: "One hand goes under the knee, the other hand goes under the heel. Bring the knee toward the resident's chest (flexion), then lower the leg back down flat (extension). That is one repetition. Perform three.",
        question: "During hip and knee ROM, where must the CNA place their hands and how many repetitions are required?",
        idealAnswer: "One hand supports under the knee, the other supports under the heel. Bring the knee to the chest and back down, three repetitions.",
        memoryTip: "Under the knee AND under the heel — knee to chest and back, three times.",
        correctExplanation: "Correct. The evaluator specifically checks hand placement: support must be under the knee and under the heel, not just the foot or thigh.",
        incorrectExplanation: "Hip/knee ROM requires support under the knee and under the heel. Bring the knee to chest and back down for three repetitions.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "support under knee and heel", keywords: ["under knee", "under heel", "knee and heel", "support under"] },
          { label: "three repetitions knee to chest", keywords: ["three", "x3", "three times", "knee to chest"] },
        ],
      },
      {
        id: "rom-ankle-step-5-dorsi-plantar",
        title: "Ankle ROM: forward and backward, support ankle and ball of foot x3",
        questionType: "recall",
        difficulty: 1,
        concept: "Move the foot through ROM in a forward and backward motion (dorsiflexion and plantar flexion), while supporting the ankle and the ball of the foot, three repetitions. The hand supporting the ball of the foot guides the movement; the hand at the ankle stabilizes the joint.",
        example: "One hand at the ankle, one hand at the ball of the foot. Push the foot forward (toes toward shin — dorsiflexion), then point the foot back down (plantar flexion). Three repetitions.",
        question: "During ankle ROM, where are the CNA's hands placed and what motions are performed?",
        idealAnswer: "Support the ankle with one hand and the ball of the foot with the other. Move the foot forward (dorsiflexion) and backward (plantar flexion) for three repetitions.",
        memoryTip: "Ankle and ball of foot supported — forward and back, three times.",
        correctExplanation: "Right. The evaluator checks both hand positions: ankle AND ball of foot, not just the foot or the heel.",
        incorrectExplanation: "Ankle ROM requires support at the ankle and at the ball of the foot. Perform dorsiflexion (foot forward) and plantar flexion (foot back) for three repetitions.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "support ankle and ball of foot", keywords: ["ankle", "ball of foot", "ankle and ball", "support at"] },
          { label: "forward and backward three times", keywords: ["forward", "backward", "three", "x3", "dorsiflexion", "plantar"] },
        ],
      },
      {
        id: "rom-hip-knee-ankle-step-6-7-discomfort",
        title: "Discomfort monitoring and correct side",
        questionType: "application",
        difficulty: 2,
        concept: "Ask the resident to report discomfort during ROM or ask if the resident has discomfort during the exercises. Exercise only the correct joints and only the correct side when performing range of motion. Smooth, slow, non-forceful movement protects the resident throughout.",
        example: "If the instructions say right hip/knee/ankle ROM, work only on the right leg. Doing the left leg by mistake fails the skill even if technique is correct.",
        question: "What two things does the evaluator check regarding sides and safety during ROM exercises?",
        idealAnswer: "The evaluator checks that the CNA exercises only the correct side specified in the instructions, and that the resident is asked about discomfort during the exercises.",
        memoryTip: "Correct side only — and always ask about discomfort.",
        correctExplanation: "Exactly. Wrong-side errors and failing to ask about discomfort are two separate evaluator checkpoints.",
        incorrectExplanation: "ROM must be performed on the specified side only. The resident must also be asked about discomfort during the exercises — both are evaluator checkpoints.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "correct side only", keywords: ["correct side", "right side", "specified side", "only the correct"] },
          { label: "ask about discomfort", keywords: ["discomfort", "pain", "ask", "report", "how do you feel"] },
        ],
      },
    ],
    completionMessage: "Good hip, knee, and ankle ROM technique. Key checkpoints: support under the knee and heel for hip/knee ROM, support at the ankle and ball of foot for ankle ROM, three reps each, correct side only, and ask about discomfort.",
    nextRecommendedLessonIds: ["clinical-skill-rom-elbow-wrist", "clinical-skill-rom-shoulder"],
  },

  {
    id: "clinical-skill-ambulation",
    slug: "clinical-skill-ambulation",
    title: "Clinical Skill: Ambulate Resident Using a Transfer/Gait Belt",
    domainSlug: "basic-nursing-skills",
    domainTitle: "Basic Nursing Skills",
    summary: "Master the evaluator criteria for ambulating a resident with a gait belt: 4-finger fit, count-of-3 stand cue, walking at least 10 steps, two dizzy checks, and proper seated return with belt removed after sitting.",
    learningGoal: "Apply and use a gait belt correctly, walk the resident safely for 10+ steps, and return them to the chair using proper body mechanics.",
    estimatedMinutes: 20,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "ambulation-step-3-belt-application",
        title: "Apply the gait belt: 4 fingers, over clothing, avoid skin folds",
        questionType: "recall",
        difficulty: 1,
        concept: "Apply the transfer/gait belt before standing the resident, placing it around the resident's waist and over clothing, secure so that only flat fingers/hand fit under the belt, and the belt does not catch skin or skin folds (e.g., breast tissue). The 4-finger rule confirms correct tightness. Apply nonskid shoes before standing — if shoes are already on, verbally acknowledge that they are wearing nonskid footwear.",
        example: "Slide four fingers flat under the belt after securing. If they slide without effort and the belt doesn't slide around, the fit is correct. If only two fingers fit, it is too tight.",
        question: "How tight should a gait belt be, and how does the CNA confirm correct fit?",
        idealAnswer: "The belt should be snug enough so that only flat fingers fit underneath. Four fingers should fit under the belt — not too loose, not too tight, and not catching skin folds.",
        memoryTip: "4 flat fingers under the belt — tight enough to hold, loose enough to breathe.",
        correctExplanation: "Correct. The evaluator checks the 4-finger fit AND that the belt is over clothing and not pinching skin or skin folds.",
        incorrectExplanation: "The gait belt must be applied over clothing with only flat fingers able to fit underneath — about 4 fingers. It must not catch skin folds.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "four fingers fit under belt", keywords: ["four fingers", "4 fingers", "flat fingers", "finger fit"] },
          { label: "over clothing, no skin folds", keywords: ["over clothing", "skin fold", "breast tissue", "not too tight"] },
        ],
      },
      {
        id: "ambulation-step-4-5-stand-cue",
        title: "Count-of-3 stand cue and resident holds your shoulder",
        questionType: "recall",
        difficulty: 1,
        concept: "Provide a signal or cue to the resident before assisting to stand. Have the resident hold your shoulder to assist in standing and place your foot in front of their foot. Use the count of three: 'On the count of three we're going to stand.' Assist to stand while holding the gait belt with both hands on both sides.",
        example: "'On the count of three we're going to stand. One, two, three.' Resident holds your shoulder; your hands hold the belt at both sides as they rise.",
        question: "What cue must the CNA give before standing the resident, and how does the CNA hold the gait belt while standing them?",
        idealAnswer: "Tell the resident 'On the count of three we're going to stand.' Hold the gait belt with both hands on both sides while assisting the resident to stand.",
        memoryTip: "Count of three, both hands on belt, resident holds your shoulder.",
        correctExplanation: "Right. The verbal cue, bilateral belt hold, and shoulder support are all evaluator checkpoints for the stand assist.",
        incorrectExplanation: "A count-of-three cue is required before standing the resident. Hold the gait belt with both hands on both sides throughout the stand.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "count of three cue", keywords: ["count of three", "on the count", "three", "cue", "signal"] },
          { label: "both hands on belt", keywords: ["both hands", "both sides", "bilateral", "hold belt"] },
        ],
      },
      {
        id: "ambulation-step-6-9-dizzy-checks",
        title: "Ask about dizziness twice: after standing and during walking",
        questionType: "application",
        difficulty: 2,
        concept: "Ask about how the resident feels upon standing ('Are you dizzy?') and ask about how the resident feels during ambulation ('Are you dizzy?'). There are two separate dizzy checks. Walk the resident at least 10 steps total while standing to the side and slightly behind with an arm around the resident's back holding the gait belt.",
        example: "After the resident stands: 'Are you dizzy?' They begin walking. After a few steps: 'Are you dizzy? Are you feeling okay?' Walk at least 10 full steps before beginning the return.",
        question: "At which two points during ambulation must the CNA ask about dizziness?",
        idealAnswer: "Ask after the resident stands up and again during the walk. Walk at least 10 steps total.",
        memoryTip: "Two dizzy checks: after standing AND during the walk.",
        correctExplanation: "Correct. Each dizzy check is a separate evaluator criterion — missing either one is a missed item.",
        incorrectExplanation: "There are two required dizzy checks: one immediately after standing and one during ambulation. Both must happen, and the resident must walk at least 10 steps.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "ask after standing", keywords: ["after standing", "upon standing", "when they stand", "first check"] },
          { label: "ask during walking", keywords: ["during walking", "during ambulation", "while walking", "second check"] },
        ],
      },
      {
        id: "ambulation-step-10-12-seated-return",
        title: "Return: back of legs against seat, then remove belt after sitting",
        questionType: "critical_thinking",
        difficulty: 2,
        concept: "Assist the resident to turn and have the back of their legs positioned against the seat of the chair before the resident sits. Remove the transfer/gait belt from the resident's waist after the resident is seated in the chair — never remove it before they sit. Leave the resident in proper body alignment with hips against the back of the seat.",
        example: "Guide the resident until the back of their legs touch the chair seat, then support them to sit. Only after they are fully seated do you remove the belt.",
        question: "When should the gait belt be removed — before or after the resident sits, and what must happen before sitting begins?",
        idealAnswer: "The back of the resident's legs must be positioned against the seat before sitting. The gait belt is removed only after the resident is fully seated.",
        memoryTip: "Legs touch chair first, sit down, then belt comes off — never before.",
        correctExplanation: "Exactly. Removing the belt before the resident is seated removes the safety control at the most dangerous moment of the transfer.",
        incorrectExplanation: "Position the back of the legs against the chair first, then sit. The belt is removed only after the resident is fully seated — not before.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "back of legs against seat first", keywords: ["back of legs", "against seat", "legs against", "before sitting"] },
          { label: "remove belt after seated", keywords: ["remove after", "after seated", "after sitting", "seated first"] },
        ],
      },
    ],
    completionMessage: "Strong ambulation technique. Key checkpoints: 4-finger belt fit over clothing, count-of-3 stand cue, both hands on belt, 10+ steps, two dizzy checks (after standing and during walk), back of legs to seat before sitting, belt removed after seated.",
    nextRecommendedLessonIds: ["clinical-skill-transfer-wheelchair", "basic-nursing-skills"],
  },

  {
    id: "clinical-skill-transfer-wheelchair",
    slug: "clinical-skill-transfer-wheelchair",
    title: "Clinical Skill: Transfer Bed to Wheelchair — Pivot Technique",
    domainSlug: "basic-nursing-skills",
    domainTitle: "Basic Nursing Skills",
    summary: "Master the evaluator criteria for a pivot transfer: wheelchair angle and lock, gait belt before standing, count-of-3 cue, true pivot without steps, back of legs to seat before sitting, and feet on footrests.",
    learningGoal: "Execute a safe pivot transfer from bed to wheelchair using a gait belt with no steps taken and proper alignment at the destination.",
    estimatedMinutes: 20,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "transfer-wc-step-6-angle-lock",
        title: "Wheelchair angle, footrests cleared, and LOCK before transfer",
        questionType: "recall",
        difficulty: 1,
        concept: "Move wheelchair footrests out of the way before standing the resident for transfer. Position the wheelchair at an angle with the front interior wheel close enough to the bed so the transfer can be completed as a pivot. LOCK THE WHEELCHAIR before beginning the transfer. An unlocked wheelchair during transfer is a critical safety failure.",
        example: "Place the wheelchair at roughly a 45-degree angle to the bed with the front wheel near the bed. Flip footrests up or out of the way, then lock both wheels before standing the resident.",
        question: "What three things must be done to the wheelchair before the CNA stands the resident for a pivot transfer?",
        idealAnswer: "Move the footrests out of the way, position the wheelchair at an angle near the bed, and lock the wheelchair before standing the resident.",
        memoryTip: "Footrests clear, angle to bed, LOCK — then stand.",
        correctExplanation: "Correct. All three are evaluator checkpoints and must happen before the resident stands, not after.",
        incorrectExplanation: "Before standing the resident: move footrests out of the way, angle the wheelchair near the bed, and lock the wheels. All three must happen first.",
        passThreshold: 3,
        acceptableConcepts: [
          { label: "footrests out of the way", keywords: ["footrests", "footrest", "out of the way", "clear footrests"] },
          { label: "wheelchair at angle near bed", keywords: ["angle", "angled", "near bed", "front wheel", "position"] },
          { label: "lock wheelchair", keywords: ["lock", "locked", "brakes", "wheel lock"] },
        ],
      },
      {
        id: "transfer-wc-step-7-8-stand-and-hold",
        title: "Count-of-3, hold belt at sides, brace resident's legs",
        questionType: "application",
        difficulty: 2,
        concept: "Verbalize that feet are flat on the floor. Provide a cue before assisting to stand: 'On the count of three, we're going to lift, pivot, and sit.' Stand in front of the resident, reaching under the arms to hold the gait belt at the sides or around the back throughout the transfer. Brace one or both of the resident's legs during transfer.",
        example: "Stand facing the resident. Hands hold the belt at the sides. One foot or knee braces the resident's knee to prevent buckling during the pivot.",
        question: "Where should the CNA's hands hold the gait belt during a pivot transfer, and what additional body mechanic must the CNA use?",
        idealAnswer: "Hold the gait belt at the sides or around the back. Brace one or both of the resident's legs during the stand, turn, and sit.",
        memoryTip: "Hands on belt sides, brace their legs — pivot together.",
        correctExplanation: "Right. Holding the belt at the sides rather than the front gives better control. Bracing the legs prevents a knee buckle.",
        incorrectExplanation: "Hold the gait belt at the sides or around the back throughout the transfer. Brace one or both of the resident's legs to prevent buckling.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "hold belt at sides or back", keywords: ["sides", "around back", "hold belt", "belt at sides"] },
          { label: "brace resident's legs", keywords: ["brace", "legs", "knee", "brace legs"] },
        ],
      },
      {
        id: "transfer-wc-step-9-true-pivot",
        title: "True pivot: no steps, back of legs to seat before sitting",
        questionType: "critical_thinking",
        difficulty: 2,
        concept: "Transfer the resident as a pivot completed without the resident taking steps to reach the wheelchair. Before assisting the resident to sit, position the back of the resident's legs against the seat of the wheelchair. Support the resident to provide controlled, gentle lowering into the seat.",
        example: "The resident's feet stay in place on the floor. The CNA turns their body so the wheelchair is behind them. Once the back of the legs touch the seat, the CNA lowers them in. No shuffling steps are allowed.",
        question: "What makes a transfer a true pivot, and what must happen before the resident is lowered into the seat?",
        idealAnswer: "A true pivot means the resident takes no steps. The back of the resident's legs must be positioned against the wheelchair seat before the resident is lowered to sit.",
        memoryTip: "No steps = true pivot. Legs touch seat, then sit.",
        correctExplanation: "Exactly. Any shuffling steps by the resident means the skill was not performed as a pivot. Legs against the seat before lowering is also a separate evaluator item.",
        incorrectExplanation: "A pivot transfer means no steps are taken. The back of the resident's legs must touch the wheelchair seat before controlled lowering begins.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "no steps taken", keywords: ["no steps", "without steps", "pivot", "feet stay"] },
          { label: "back of legs to seat first", keywords: ["back of legs", "legs against seat", "against seat", "before sitting"] },
        ],
      },
    ],
    completionMessage: "Strong pivot transfer technique. Key checkpoints: footrests cleared, wheelchair angled and locked before standing, count-of-3 cue, hold belt at sides, brace legs, no steps during pivot, legs against seat before lowering, feet on footrests, belt removed after seated.",
    nextRecommendedLessonIds: ["clinical-skill-ambulation", "basic-nursing-skills"],
  },

  {
    id: "clinical-skill-bedpan",
    slug: "clinical-skill-bedpan",
    title: "Clinical Skill: Assist Resident Needing to Use a Bedpan",
    domainSlug: "personal-care-adls",
    domainTitle: "Personal Care and ADLs",
    summary: "Master the evaluator criteria for bedpan assistance: chucks placement before bedpan, widest-side positioning, HOB raised with resident on pan, and gloves on before removal.",
    learningGoal: "Assist a resident onto and off a bedpan safely with correct positioning, infection control, and call-light use.",
    estimatedMinutes: 18,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "bedpan-step-2-3-setup-chucks",
        title: "Do not touch bedpan without gloves; chucks under buttocks before bedpan",
        questionType: "recall",
        difficulty: 1,
        concept: "Do not touch the bedpan until gloves are on. Do not touch supplies to your clothes. Place a barrier on the bedside table and supplies on top. Prepare and place the protective underpad (chucks) on the bed under the buttocks and upper thigh area before placing the bedpan. Position the chucks, then the bedpan.",
        example: "Place the barrier on the bedside table first, then set supplies on top. Put on gloves before touching the bedpan. Roll the chucks and position under the buttocks before sliding the bedpan in.",
        question: "What must the CNA put on before touching the bedpan, and what must be placed on the bed before the bedpan is positioned?",
        idealAnswer: "Gloves must be on before touching the bedpan. The chucks (underpad) must be placed under the buttocks area before the bedpan.",
        memoryTip: "Gloves first, chucks second, bedpan third.",
        correctExplanation: "Correct. Touching the bedpan bare-handed is an infection control failure. Chucks must be down before the bedpan goes under.",
        incorrectExplanation: "Gloves must be on before handling the bedpan. The underpad (chucks) must be placed under the buttocks first, then the bedpan is positioned.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "gloves before touching bedpan", keywords: ["gloves", "before touching", "gloves on", "before bedpan"] },
          { label: "chucks before bedpan", keywords: ["chucks", "underpad", "protective pad", "before bedpan"] },
        ],
      },
      {
        id: "bedpan-step-4-widest-side",
        title: "Widest side to wider buttocks, narrow side toward feet",
        questionType: "recall",
        difficulty: 1,
        concept: "Position the bedpan under the resident according to the shape of the bedpan. The widest side goes toward the wider side of the buttocks, and the narrow side faces toward the feet and is centered. After positioning, remove gloves.",
        example: "A standard bedpan is wider at one end. That wider end goes against the back of the buttocks. The narrow open end points toward the feet. Center left-to-right so urine and stool go into the pan.",
        question: "How should the bedpan be oriented under the resident?",
        idealAnswer: "The widest side of the bedpan faces the wider side of the buttocks. The narrow side faces toward the feet, and the bedpan is centered.",
        memoryTip: "Wide end to back, narrow end to feet — centered.",
        correctExplanation: "Right. Incorrect orientation is one of the most common errors on this skill. The evaluator checks that the shape matches the anatomy.",
        incorrectExplanation: "The widest side of the bedpan faces the wider buttocks area. The narrow end faces toward the feet. The pan must be centered.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "widest side to buttocks", keywords: ["widest side", "wide end", "back", "buttocks", "wider side"] },
          { label: "narrow side toward feet", keywords: ["narrow", "feet", "toward feet", "narrow end"] },
        ],
      },
      {
        id: "bedpan-step-5-6-hob-call-light",
        title: "Raise HOB after positioning; give call light before leaving",
        questionType: "application",
        difficulty: 2,
        concept: "Raise the head of the bed after positioning the resident on the bedpan. Ask about comfort and tell the resident they can relax their legs. Ask the resident to call when finished or if they need help, leaving the call light within the resident's reach and giving toilet paper before leaving.",
        example: "Once the bedpan is in place, raise the HOB so the resident is in a semi-sitting position. Hand them the call light and toilet paper before stepping away from the bedside.",
        question: "What two things must the CNA give the resident and do to the bed before leaving the resident on the bedpan?",
        idealAnswer: "Raise the head of the bed, then give the resident the call light and toilet paper before leaving.",
        memoryTip: "HOB up, call light and toilet paper in hand, then leave.",
        correctExplanation: "Correct. Leaving a resident flat on a bedpan without HOB elevation and without a call light are both evaluator-checkable failures.",
        incorrectExplanation: "After positioning the resident on the bedpan, raise the HOB. Give the resident the call light and toilet paper before leaving the bedside.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "raise HOB", keywords: ["HOB", "head of bed", "raise", "elevate", "semi-sitting"] },
          { label: "call light and toilet paper", keywords: ["call light", "toilet paper", "before leaving", "within reach"] },
        ],
      },
    ],
    completionMessage: "Good bedpan assistance technique. Key checkpoints: gloves before touching bedpan, chucks before bedpan, widest side to buttocks, HOB raised after positioning, call light and toilet paper given before leaving, gloves on for removal.",
    nextRecommendedLessonIds: ["clinical-skill-perineal-care", "personal-care-adls"],
  },

  {
    id: "clinical-skill-bed-linen",
    slug: "clinical-skill-bed-linen",
    title: "Clinical Skill: Change Bed Linen With Resident in Bed",
    domainSlug: "basic-nursing-skills",
    domainTitle: "Basic Nursing Skills",
    summary: "Master the evaluator criteria for occupied bed linen change: privacy blanket before removing top sheet, no shaking linen, no heel exposure on mattress, military corner tuck, and pillow open end away from door.",
    learningGoal: "Change both sheets and the pillowcase safely while protecting the resident from friction, cold exposure, and skin shearing.",
    estimatedMinutes: 18,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "bed-linen-step-3-privacy-blanket-no-shake",
        title: "Privacy blanket first; never shake linen in the air",
        questionType: "recall",
        difficulty: 1,
        concept: "Apply the privacy blanket and remove the top sheet in a ball away from your body, placing it on the unused part of the barrier table. Never shake sheets in the air — shaking can spread microorganisms into the air or onto surfaces and also dislodges crumbs or debris.",
        example: "Drape the privacy blanket over the resident, then gather the top sheet into a ball at the foot of the bed, holding it away from your uniform, and set it on the barrier table.",
        question: "What must the CNA apply before removing the top sheet, and why should sheets never be shaken?",
        idealAnswer: "Apply the privacy blanket before removing the top sheet. Sheets should never be shaken because shaking spreads microorganisms and debris into the air.",
        memoryTip: "Privacy blanket on, then top sheet off — roll it, never shake it.",
        correctExplanation: "Right. Both the privacy blanket first and no-shaking rule are evaluator checkpoints. Shaking linen is also flagged in the Indirect Care criteria.",
        incorrectExplanation: "The privacy blanket must be in place before the top sheet comes off. Sheets are never shaken because it spreads microorganisms and debris.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "privacy blanket first", keywords: ["privacy blanket", "blanket first", "before removing", "drape"] },
          { label: "no shaking linen", keywords: ["no shaking", "do not shake", "never shake", "microorganisms"] },
        ],
      },
      {
        id: "bed-linen-step-5-no-heel-on-mattress",
        title: "Resident's heels must not touch exposed mattress",
        questionType: "critical_thinking",
        difficulty: 2,
        concept: "Keep the resident positioned on the bottom sheet throughout the procedure so that the resident's heels are not against any exposed mattress. A bare mattress can cause skin irritation. The sheet swap involves rolling dirty sheet under the resident and rolling the new sheet from the other side — the resident must not be left lying on bare mattress at any point.",
        example: "As you roll the dirty fitted sheet under the resident, the clean sheet is already partly tucked in on the other side. The resident transitions from dirty sheet to clean sheet without touching the mattress cover.",
        question: "What specific body part must the CNA ensure does not rest on the exposed mattress during a linen change?",
        idealAnswer: "The resident's heels must not rest on exposed mattress. The resident must stay on the bottom sheet throughout the procedure.",
        memoryTip: "Heels on sheet always — never on bare mattress.",
        correctExplanation: "Exactly. The heel criterion is a specific evaluator item. The rolling technique is what allows this to be done safely.",
        incorrectExplanation: "The resident's heels must not rest on exposed mattress at any point. The CNA must keep the resident on sheet throughout by rolling clean sheet under before removing dirty sheet.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "heels not on bare mattress", keywords: ["heels", "mattress", "bare mattress", "exposed mattress"] },
          { label: "resident stays on sheet", keywords: ["stays on sheet", "on sheet throughout", "sheet throughout"] },
        ],
      },
      {
        id: "bed-linen-step-9-11-top-sheet-pillow",
        title: "Military corner tuck; pillow open end away from door",
        questionType: "recall",
        difficulty: 2,
        concept: "Tuck the top sheet under the foot of the mattress leaving the sheet placed loosely to avoid pressure against toes and allow foot movement — military corner tucking. When replacing the pillowcase, place the open side of the pillow facing away from the door.",
        example: "After tucking the military corners at the foot, the sheet lies loosely over the resident's feet rather than tight across the toes. Slide the pillow into the case and position it with the opening facing toward the wall, away from the door.",
        question: "What two specific placement rules apply to the top sheet foot tuck and the pillowcase orientation?",
        idealAnswer: "Use military corner tucks at the foot but leave the sheet loose over the toes. Place the pillow with the open end of the pillowcase facing away from the door.",
        memoryTip: "Military corner at foot, loose over toes — pillow open end away from door.",
        correctExplanation: "Correct. Both are evaluator-specific items. Tight toe pressure fails one criterion; open-end-toward-door fails another.",
        incorrectExplanation: "Military corner tucks at the foot of the mattress, but the sheet must be left loose over the toes to allow movement. The open end of the pillowcase must face away from the door.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "military corner tuck loose at toes", keywords: ["military corner", "tuck", "loose", "toes", "foot movement"] },
          { label: "pillow open end away from door", keywords: ["open end", "away from door", "pillow opening", "facing away"] },
        ],
      },
    ],
    completionMessage: "Good occupied bed change technique. Key checkpoints: privacy blanket before top sheet, never shake linen, heels off bare mattress throughout, military corner tuck with loose toe room, open pillow end away from door, and soiled linen into hamper at close.",
    nextRecommendedLessonIds: ["clinical-skill-side-lying", "basic-nursing-skills"],
  },

  {
    id: "clinical-skill-side-lying",
    slug: "clinical-skill-side-lying",
    title: "Clinical Skill: Position Resident in Supported Side-Lying",
    domainSlug: "basic-nursing-skills",
    domainTitle: "Basic Nursing Skills",
    summary: "Master the evaluator criteria for side-lying positioning: three-pillow support system (back, between legs, arm), chin and neck pillow placement, shoulder/arm free from pressure, and call light placed on the side the resident is facing.",
    learningGoal: "Position a resident safely on their side with all three support pillows correctly placed and no pressure on bony prominences.",
    estimatedMinutes: 15,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "side-lying-step-4-5-6-three-pillows",
        title: "Three pillows: back support, between legs, under top arm",
        questionType: "recall",
        difficulty: 1,
        concept: "Place a pillow rolled and tucked against the back for support. Place a pillow between the legs so the bony prominences of the knees and ankles are separated and legs are not directly on top of each other. Place a pillow to support the resident's upper arm, supporting both the shoulder and arm at the elbow area.",
        example: "Pillow 1: tucked behind the back to maintain the side position. Pillow 2: between the knees and ankles so bones don't grind against each other. Pillow 3: under the top arm supporting the elbow so the shoulder is not strained.",
        question: "Name the three pillow positions required for a properly supported side-lying position.",
        idealAnswer: "One pillow behind the back for support, one between the legs to separate bony prominences at the knee and ankle, and one under the top arm to support the shoulder and elbow.",
        memoryTip: "Back, between legs, under top arm — three pillows, three purposes.",
        correctExplanation: "Correct. Each pillow addresses a specific pressure or joint risk. The evaluator checks all three positions.",
        incorrectExplanation: "Three pillows are required: one behind the back, one between the legs (separating knee and ankle bony prominences), and one under the top arm supporting the shoulder and elbow.",
        passThreshold: 3,
        acceptableConcepts: [
          { label: "pillow behind back", keywords: ["behind back", "back support", "rolled behind", "back pillow"] },
          { label: "pillow between legs", keywords: ["between legs", "between knees", "knee", "ankle", "bony prominences"] },
          { label: "pillow under top arm", keywords: ["top arm", "upper arm", "elbow", "shoulder", "arm pillow"] },
        ],
      },
      {
        id: "side-lying-step-7-8-shoulder-neck",
        title: "Resident not lying on shoulder; head pillow supports neck and chin",
        questionType: "recall",
        difficulty: 2,
        concept: "Leave the resident positioned on the side without lying on the shoulder, arm, and hand — the bottom arm is tucked under the head pillow. Place the head pillow to support the resident's neck and chin, not beneath the shoulders. The bottom arm goes beneath the head pillow.",
        example: "The lower arm slides under the pillow edge so the resident's weight is on their back, not on the shoulder joint. The pillow supports neck and chin — not the shoulders.",
        question: "Where does the bottom arm go during side-lying positioning, and what does the head pillow support?",
        idealAnswer: "The bottom arm is placed beneath the head pillow so the resident is not lying on the shoulder. The pillow supports the neck and chin, not the shoulders.",
        memoryTip: "Bottom arm under head pillow — pillow supports neck and chin, not shoulders.",
        correctExplanation: "Right. Lying on the shoulder is a pressure injury risk. The head pillow placement at the neck and chin (not shoulders) is a specific evaluator item.",
        incorrectExplanation: "The bottom arm goes beneath the head pillow so the shoulder is not compressed. The head pillow supports the neck and chin — not the shoulders.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "bottom arm under head pillow", keywords: ["bottom arm", "under pillow", "beneath pillow", "lower arm"] },
          { label: "pillow at neck and chin not shoulders", keywords: ["neck and chin", "not shoulders", "neck support", "chin"] },
        ],
      },
      {
        id: "side-lying-step-12-call-light-side",
        title: "Call light on the side the resident is facing",
        questionType: "application",
        difficulty: 1,
        concept: "Give the patient the call light on the side that they are lying — meaning the side they face, which is the accessible side. If the resident is lying on their left side (facing right), the call light should be on the right side where they can reach it.",
        example: "Resident rolled to face left (right side is their back). Call light should be on the left side — in front of them. That is the side they can reach.",
        question: "If a resident is positioned in a side-lying position facing the window on the right side of the room, where should the call light be placed?",
        idealAnswer: "The call light should be placed on the right side of the room — on the side the resident is facing so they can reach it.",
        memoryTip: "Call light on the side they face — where their hand can reach.",
        correctExplanation: "Correct. The call light must be accessible from the side the resident faces, not the side they are lying against.",
        incorrectExplanation: "The call light goes on the side the resident is facing — the accessible side where their hand can reach it.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "call light on facing side", keywords: ["side facing", "facing", "the side they face", "accessible side"] },
          { label: "resident can reach it", keywords: ["reach", "accessible", "within reach", "their hand"] },
        ],
      },
    ],
    completionMessage: "Good side-lying positioning technique. Key checkpoints: pillow behind back, pillow between legs separating bony prominences, pillow under top arm at elbow, bottom arm under head pillow, head pillow at neck and chin not shoulders, and call light on the side the resident faces.",
    nextRecommendedLessonIds: ["clinical-skill-bed-linen", "basic-nursing-skills"],
  },

  {
    id: "clinical-skill-dressing",
    slug: "clinical-skill-dressing",
    title: "Clinical Skill: Dress a Resident With a Weak Arm",
    domainSlug: "personal-care-adls",
    domainTitle: "Personal Care and ADLs",
    summary: "Master the evaluator criteria for dressing with a weak arm: socks first then pants, undress strong arm first, dress affected arm first, include resident in clothing choices, and gentle movement without overextension.",
    learningGoal: "Dress a resident with a weak arm in the correct sequence while protecting the affected extremity and involving the resident in choices.",
    estimatedMinutes: 15,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "dressing-step-2-clothing-choice",
        title: "Include resident in clothing choices",
        questionType: "recall",
        difficulty: 1,
        concept: "Include the resident in decision-making about clothing to wear. This is an Indirect Care criterion for resident rights — the resident chooses their clothing even if they cannot dress themselves. Ask the resident what they would like to wear before gathering garments.",
        example: "Show the resident two shirt options and ask which they prefer before beginning the dressing procedure.",
        question: "What Indirect Care criterion must the CNA demonstrate before collecting the resident's clothing?",
        idealAnswer: "Include the resident in choosing their clothing. Ask what they would like to wear before gathering garments.",
        memoryTip: "Resident chooses their clothes — ask before you grab.",
        correctExplanation: "Right. Clothing choice is an evaluated resident rights criterion, not a courtesy step. Missing it is a missed checklist item.",
        incorrectExplanation: "The resident must be included in clothing choices before garments are collected. This is a resident rights criterion on the evaluator's checklist.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "include resident in clothing choice", keywords: ["clothing choice", "choose", "preference", "what to wear", "ask resident"] },
        ],
      },
      {
        id: "dressing-step-4-5-order-socks-pants",
        title: "Socks first, pants second — before removing gown",
        questionType: "recall",
        difficulty: 1,
        concept: "Begin with socks: scrunch until the toe seam, place on toes, lift leg from below and pull gently, making sure the heel is in proper place with no wrinkles. Next apply pants: scrunch the pant leg until the bottom opening, put hand through the bottom opening, hold the foot and slide the pant leg over the foot while supporting the leg. Have the patient lift hips to pull pants over legs and hips. Collect all garments BEFORE removing the hospital gown.",
        example: "Socks go on both feet first. Pants are threaded over both feet and pulled up before the gown comes off. This keeps the resident warm and covered throughout.",
        question: "In what order does the CNA apply clothing to the lower body, and when should the gown be removed?",
        idealAnswer: "Apply socks first, then pants. Collect all garments before removing the hospital gown so the resident stays covered.",
        memoryTip: "Socks, pants, gown last — resident stays warm and covered.",
        correctExplanation: "Correct. The socks-pants-then-gown sequence is a specific evaluator order criterion. Removing the gown first exposes the resident unnecessarily.",
        incorrectExplanation: "Apply socks first, then pants over both feet. The gown is removed only after all garments are collected and lower body is dressed.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "socks first then pants", keywords: ["socks first", "socks then pants", "socks before pants", "lower body first"] },
          { label: "collect garments before removing gown", keywords: ["before removing gown", "gown last", "garments first", "collected first"] },
        ],
      },
      {
        id: "dressing-step-6-7-undress-dress-sequence",
        title: "Undress STRONG arm first; Dress AFFECTED arm first",
        questionType: "critical_thinking",
        difficulty: 2,
        concept: "When removing the hospital gown, UNDRESS THE STRONG ARM FIRST. When applying the shirt, DRESS THE AFFECTED ARM FIRST. This sequence protects the weak arm — undressing the strong arm first creates slack to gently remove from the affected side without force, and dressing the affected arm first allows threading the sleeve without struggling with limited range of motion.",
        example: "Remove gown sleeve from the strong arm. Gently slide it off the affected arm with support. For the shirt, scrunch the sleeve, slide it up the affected arm first, then have the resident put the strong arm through.",
        question: "What is the correct sequence for undressing and dressing a resident with a weak arm?",
        idealAnswer: "Undress the strong arm first, then the affected arm. Dress the affected arm first, then the strong arm.",
        memoryTip: "Strong off first, affected on first — protect the weak side.",
        correctExplanation: "Exactly. This is one of the most tested sequences on the CNA exam. Strong off first, affected on first.",
        incorrectExplanation: "The sequence is: undress strong arm first, then affected arm. For dressing: affected arm first, then strong arm. This sequence protects the weak limb.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "undress strong first", keywords: ["undress strong", "strong arm first", "remove strong", "strong first"] },
          { label: "dress affected first", keywords: ["dress affected", "affected arm first", "affected first", "weak arm first"] },
        ],
      },
    ],
    completionMessage: "Strong dressing technique. Key sequence: collect all garments first, socks then pants then gown removal, undress strong arm first, dress affected arm first, include resident in clothing choices, gentle movement without overextension.",
    nextRecommendedLessonIds: ["clinical-skill-partial-bed-bath", "personal-care-adls"],
  },

  {
    id: "clinical-skill-urinary-drainage-bag",
    slug: "clinical-skill-urinary-drainage-bag",
    title: "Clinical Skill: Empty Urinary Drainage Bag",
    domainSlug: "basic-nursing-skills",
    domainTitle: "Basic Nursing Skills",
    summary: "Master the evaluator criteria for emptying a urinary drainage bag: gloves before handling, eye-level measurement, drainage bag lower than bladder always, no floor contact, and correct I&O documentation after removing gloves.",
    learningGoal: "Empty and measure urine output correctly while maintaining catheter system integrity and documenting within ±50 mL.",
    estimatedMinutes: 18,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "drainage-bag-step-3-4-gloves-before",
        title: "Gloves on before handling the bag, barrier on floor for graduate",
        questionType: "recall",
        difficulty: 1,
        concept: "Wear gloves while handling the urinary drainage bag, graduate, or any urine-filled container. Remove gloves before documenting I&O. Set the graduate or bedpan on a barrier placed on the floor — the barrier protects from floor contamination. Empty the full contents of the drainage bag into the graduate.",
        example: "Lay the barrier pad on the floor. Set the graduate on the barrier. Put gloves on before unclipping the drainage tube. Empty the bag into the graduate, then clamp and tuck the drain.",
        question: "What must be on before handling the drainage bag, and what goes on the floor before the graduate is set down?",
        idealAnswer: "Gloves must be on before handling the drainage bag. A barrier pad must be on the floor before setting the graduate down.",
        memoryTip: "Gloves on, barrier down, graduate on barrier — then open the drain.",
        correctExplanation: "Correct. Both are infection control checkpoints. Gloves protect the CNA; the barrier prevents floor contamination of the graduate.",
        incorrectExplanation: "Gloves must be on before handling the bag or graduate. A floor barrier must be in place before setting the graduate down.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "gloves before handling bag", keywords: ["gloves", "before handling", "before touching", "gloves on"] },
          { label: "barrier on floor for graduate", keywords: ["barrier", "floor barrier", "on barrier", "floor pad"] },
        ],
      },
      {
        id: "drainage-bag-step-6-eye-level",
        title: "Read the graduate at eye level on a flat barrier surface",
        questionType: "recall",
        difficulty: 1,
        concept: "Set the graduate on a flat surface protected with a barrier to read it. Obtain the measurement by reading the graduate at eye level. Reading from above or below will introduce parallax error and produce an inaccurate measurement.",
        example: "Place the graduate on the overbed table on a fresh barrier. Bend or crouch so your eyes are level with the meniscus line of the urine in the graduate.",
        question: "At what level should the CNA's eyes be when reading the urine measurement in the graduate?",
        idealAnswer: "At eye level — the CNA positions eyes level with the measurement line on the graduate for an accurate reading.",
        memoryTip: "Eye level reads true — looking down or up gives a wrong number.",
        correctExplanation: "Right. Eye-level reading is a specific evaluator checkpoint on the I&O skill.",
        incorrectExplanation: "The graduate must be read at eye level. The evaluator specifically checks this. Reading from above or below produces an inaccurate measurement.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "eye level measurement", keywords: ["eye level", "at eye level", "eyes level", "meniscus"] },
        ],
      },
      {
        id: "drainage-bag-step-7-bag-position-no-floor",
        title: "Drainage bag lower than bladder; no floor contact; document after removing gloves",
        questionType: "application",
        difficulty: 2,
        concept: "Observe that there are no kinks in catheter tubing. Leave the bag hanging from the bed frame (not the side rail). The drainage bag and tubing must not touch the floor. Keep the urinary drainage bag positioned lower than the bladder throughout care. Remove gloves before documenting, then wash hands one final time after documenting.",
        example: "After emptying, hang the bag back on the bed frame below mattress level. Check that the tubing is not kinked or looped on the floor. Remove gloves, document the measurement, then wash hands again.",
        question: "Where must the drainage bag be positioned relative to the bladder, and when are gloves removed relative to documentation?",
        idealAnswer: "The drainage bag must be positioned lower than the bladder at all times. Gloves are removed before documenting, and hands are washed again after documentation.",
        memoryTip: "Bag lower than bladder always. Gloves off before charting, wash after charting.",
        correctExplanation: "Exactly. Gravity drainage requires the bag to stay below the bladder. The glove-then-document-then-wash sequence is a separate evaluator item.",
        incorrectExplanation: "The drainage bag must always be lower than the bladder. Remove gloves before documenting, then wash hands one final time after completing documentation.",
        passThreshold: 3,
        acceptableConcepts: [
          { label: "bag lower than bladder", keywords: ["lower than bladder", "below bladder", "gravity", "drainage"] },
          { label: "no floor contact", keywords: ["not touching floor", "off floor", "no floor", "above floor"] },
          { label: "gloves off before documenting", keywords: ["gloves off before", "remove gloves before", "document after removing", "clean hands to document"] },
        ],
      },
    ],
    completionMessage: "Strong urinary drainage technique. Key checkpoints: gloves before touching bag, barrier on floor for graduate, eye-level measurement, bag lower than bladder, no floor contact for tubing or bag, remove gloves before documenting, wash hands after documenting.",
    nextRecommendedLessonIds: ["clinical-skill-catheter-care", "basic-nursing-skills"],
  },

  {
    id: "clinical-skill-feeding",
    slug: "clinical-skill-feeding",
    title: "Clinical Skill: Feed a Resident Sitting in a Chair",
    domainSlug: "personal-care-adls",
    domainTitle: "Personal Care and ADLs",
    summary: "Master the evaluator criteria for feeding: upright position first, resident hand hygiene, CNA sits to feed, half-full spoon, fluids every 2-3 bites, and food intake documentation within 25% of nurse's measurement.",
    learningGoal: "Feed a resident safely using correct aspiration-prevention positioning, pacing, and accurate intake documentation.",
    estimatedMinutes: 18,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "feeding-step-3-4-upright-handwash",
        title: "Resident upright first; offer hand hygiene to resident",
        questionType: "recall",
        difficulty: 1,
        concept: "Assist or cue the resident to sit upright in the chair before feeding. An upright posture reduces aspiration risk. Offer or assist the resident to wash hands before feeding using a damp washcloth, paper towel, or hand wipe. Dispose with a clean paper towel.",
        example: "If the resident is slumped in the chair, reposition them upright before touching the meal tray. Then offer the hand wipe: 'Would you like to clean your hands before eating?'",
        question: "What two things must happen before the CNA begins offering food?",
        idealAnswer: "The resident must be sitting upright, and the resident must be offered the opportunity to clean their hands.",
        memoryTip: "Sit up straight, clean hands — then eat.",
        correctExplanation: "Correct. Both are evaluator checkpoints. Feeding a slumped resident fails the positioning criterion. Skipping hand hygiene fails the infection control criterion.",
        incorrectExplanation: "Before feeding begins: the resident must be sitting upright (aspiration prevention) and offered hand hygiene. Both are required evaluator steps.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "resident upright before feeding", keywords: ["upright", "sitting up", "sit up", "before feeding"] },
          { label: "offer hand hygiene to resident", keywords: ["hand hygiene", "wash hands", "hand wipe", "clean hands"] },
        ],
      },
      {
        id: "feeding-step-6-7-cna-sits-half-spoon",
        title: "CNA sits while feeding; spoon only half full",
        questionType: "recall",
        difficulty: 1,
        concept: "The CNA sits while feeding the resident — this positions the feeder at the resident's level, reduces rushed pacing, and communicates dignity and engagement. Fill the spoon only half full to reduce choking risk. Converse with the resident during the meal to encourage intake.",
        example: "Pull up a chair beside the resident. A half-full spoon of mashed potatoes is less likely to cause a swallow problem than an overloaded spoon.",
        question: "What posture must the CNA maintain while feeding, and how full should the spoon be?",
        idealAnswer: "The CNA must sit while feeding. The spoon should be filled only half full.",
        memoryTip: "Sit to feed, half-full spoon — slow, safe, dignified.",
        correctExplanation: "Right. Standing while feeding is a checklist failure. An overfull spoon is a separate safety and dignity error.",
        incorrectExplanation: "The CNA must sit while feeding the resident — not stand. The spoon is filled only half full to reduce aspiration risk.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "cna sits while feeding", keywords: ["sit", "seated", "sits while", "not standing"] },
          { label: "half-full spoon", keywords: ["half full", "half-full", "only half", "not overfull"] },
        ],
      },
      {
        id: "feeding-step-8-14-fluids-documentation",
        title: "Fluids every 2-3 bites; document intake within 25%",
        questionType: "application",
        difficulty: 2,
        concept: "Offer fluids to drink throughout feeding — at least every 2 to 3 bites of food. Allow the resident to swallow before feeding the next bite. Record the amount of the resident's food intake on the Food and Fluid Intake Form within 25% of the nurse's measurement. Wash hands one final time after documenting.",
        example: "Two bites of food, then offer the juice cup. Three bites, then offer water. If the nurse records the meal as 75% consumed, the candidate's record must show between 50% and 100% (±25%).",
        question: "How often must the CNA offer fluids, and what is the documentation accuracy requirement for food intake?",
        idealAnswer: "Offer fluids at least every 2 to 3 bites. Document food intake within 25% of the nurse's measurement.",
        memoryTip: "Every 2-3 bites, offer fluids — intake documented within 25%.",
        correctExplanation: "Correct. Fluid frequency and documentation accuracy are both evaluator checkpoints. Waiting too long to offer fluids is a safety issue.",
        incorrectExplanation: "Fluids must be offered at least every 2 to 3 bites. Document food intake within 25% of the nurse's measurement — not just 'some' or 'most.'",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "fluids every 2-3 bites", keywords: ["every 2-3 bites", "2 to 3 bites", "fluids throughout", "every few bites"] },
          { label: "document within 25 percent", keywords: ["25%", "twenty-five percent", "within 25", "nurse's measurement"] },
        ],
      },
    ],
    completionMessage: "Good feeding technique. Key checkpoints: resident upright before food, resident hand hygiene offered, CNA sits while feeding, spoon half full, fluids every 2-3 bites, allow swallowing between bites, intake documented within 25% of nurse's measurement.",
    nextRecommendedLessonIds: ["clinical-skill-mouth-care-teeth", "personal-care-adls"],
  },

  {
    id: "clinical-skill-catheter-care",
    slug: "clinical-skill-catheter-care",
    title: "Clinical Skill: Catheter Care for Female Resident",
    domainSlug: "personal-care-adls",
    domainTitle: "Personal Care and ADLs",
    summary: "Master the evaluator criteria for female catheter care: 5-corner first washcloth technique for the perineum, 4-corner third washcloth for the catheter tube 3-4 inches away from body, pat dry front to back, and bag lower than bladder throughout.",
    learningGoal: "Provide catheter care safely using the correct cleaning direction, correct number of washcloth strokes, and proper catheter tubing management.",
    estimatedMinutes: 20,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "catheter-care-step-7-five-corner-first",
        title: "First washcloth: 5 corners for the perineal area",
        questionType: "recall",
        difficulty: 2,
        concept: "First washcloth — wring it out, apply soap to five corners. Open the labia with the free hand, clean top to bottom (down center), then use a new corner to clean outer labia, a new corner for the other outer labia, a new corner for the outer leg fold, and a new corner for the other outer leg fold. Place dirty washcloth on barrier. Use a new washcloth to rinse in the same manner.",
        example: "Wring, soap 5 corners. Open labia, clean down center (corner 1). New corner: outer labia left (corner 2). New corner: outer labia right (corner 3). New corner: left leg fold (corner 4). New corner: right leg fold (corner 5). Rinse with new cloth in same pattern.",
        question: "How many corners of the first washcloth are used for perineal cleansing, and what is cleaned with the first corner?",
        idealAnswer: "Five corners are used. The first corner cleans down the center (labia open, top to bottom). Each remaining corner cleans a separate area: outer labia, other outer labia, leg fold, other leg fold.",
        memoryTip: "5 corners: center first, then outer labia x2, then leg folds x2.",
        correctExplanation: "Correct. Each corner touches only one area — reusing a corner spreads contamination. The evaluator counts the corners.",
        incorrectExplanation: "Five corners are needed: first cleans down the center (labia opened, top to bottom), then two corners for the outer labia, and two corners for the leg folds.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "five corners total", keywords: ["five corners", "5 corners", "five", "corner for each"] },
          { label: "first corner down center", keywords: ["center first", "down center", "first corner", "top to bottom"] },
        ],
      },
      {
        id: "catheter-care-step-8-catheter-tube",
        title: "Third washcloth: 4 corners, clean catheter 3-4 inches away from body",
        questionType: "recall",
        difficulty: 2,
        concept: "Third washcloth — wring out, apply soap to 4 corners. Hold the catheter at the insertion site, and use one corner to clean away from the body at least 3 to 4 inches. Repeat with a new corner, for a total of 4 times. Rinse in the same manner with a new washcloth.",
        example: "Hold the catheter at the meatus. With corner 1, wipe the tube away from the body for 3-4 inches. New corner, repeat. New corner, repeat. New corner, repeat — four wipes total on the catheter tube.",
        question: "When cleaning the catheter tube, how far from the body must cleaning extend, and how many times is it cleaned?",
        idealAnswer: "The catheter tube is cleaned at least 3 to 4 inches away from the body. This is done 4 times using a new corner of the washcloth each time.",
        memoryTip: "Catheter tube: 3-4 inches out, 4 separate corners — hold at insertion site.",
        correctExplanation: "Right. The 4-corner catheter cleaning is a specific evaluator item. Moving less than 3-4 inches or reusing corners both fail separate criteria.",
        incorrectExplanation: "The catheter tube is cleaned away from the body for at least 3-4 inches, using 4 separate corners of the washcloth. Hold at the insertion site throughout.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "3-4 inches from body", keywords: ["3-4 inches", "three to four", "3 to 4", "away from body"] },
          { label: "four corners on catheter", keywords: ["four corners", "4 corners", "four times", "4 times"] },
        ],
      },
      {
        id: "catheter-care-step-9-10-dry-bag",
        title: "Pat dry front to back; bag lower than bladder, tubing off floor",
        questionType: "application",
        difficulty: 2,
        concept: "Pat dry the perineal area from front to back after completing cleansing and rinsing. Verbalize that tubing is free of kinks or obstructions. Keep tubing and urinary drainage bag off the floor. Keep the urinary drainage bag positioned lower than the bladder throughout the procedure.",
        example: "After rinsing, pat dry starting at the urethra and moving toward the rectal area — front to back. Check that the drainage tube hangs freely without kinks and does not touch the floor.",
        question: "What direction is used for drying the perineal area, and what must be verbalized about the catheter tubing?",
        idealAnswer: "Pat dry front to back. Verbalize that tubing is free of kinks or obstructions and that the bag is positioned lower than the bladder with tubing off the floor.",
        memoryTip: "Front to back drying; tubing check verbalized; bag lower than bladder.",
        correctExplanation: "Exactly. Front-to-back drying and the tubing verbalization are both separate evaluator items for catheter care.",
        incorrectExplanation: "Dry front to back to avoid spreading bacteria toward the catheter. Verbalize that tubing is free of kinks, bag is below the bladder, and tubing is off the floor.",
        passThreshold: 3,
        acceptableConcepts: [
          { label: "pat dry front to back", keywords: ["front to back", "front-to-back", "pat dry", "drying direction"] },
          { label: "verbalize tubing check", keywords: ["verbalize", "kinks", "obstructions", "tubing free"] },
          { label: "bag lower than bladder", keywords: ["lower than bladder", "below bladder", "bag position"] },
        ],
      },
    ],
    completionMessage: "Strong catheter care technique. Key checkpoints: 5-corner first washcloth (center then outer labia then leg folds), 4-corner third washcloth (catheter tube 3-4 inches, 4 times), rinse in same pattern, pat dry front to back, verbalize tubing check, bag lower than bladder.",
    nextRecommendedLessonIds: ["clinical-skill-perineal-care", "personal-care-adls"],
  },

  {
    id: "clinical-skill-foot-care",
    slug: "clinical-skill-foot-care",
    title: "Clinical Skill: Foot Care for Resident in a Chair",
    domainSlug: "personal-care-adls",
    domainTitle: "Personal Care and ADLs",
    summary: "Master the evaluator criteria for foot care: barrier large enough for CNA's knees, soap applied to washcloth not basin, lotion excluding between toes, heel in place on sock, and barefoot never touches the floor.",
    learningGoal: "Provide foot care safely using proper soaking, correct lotion application, and complete prevention of barefoot floor contact.",
    estimatedMinutes: 18,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "foot-care-step-2-3-barrier-size",
        title: "Barrier large enough for CNA's knees too; gloves and temperature check",
        questionType: "recall",
        difficulty: 1,
        concept: "Set up with a barrier on the floor with supplies. Make sure the barrier is large enough for your knees to also be on the barrier. Obtain water in the basin, check temperature with the inner wrist, ask the patient to check water temperature. Apply gloves. Remove the sock if the patient has one on. Support the foot throughout the skill.",
        example: "Use a large barrier sheet so that when you kneel to work on the foot, your own knees are on the barrier and not on the floor. This also protects you from floor contamination.",
        question: "How large must the floor barrier be for foot care, and what is checked before the foot is placed in the basin?",
        idealAnswer: "The barrier must be large enough for the CNA's knees as well as the basin. Check the water temperature with the inner wrist and ask the resident to verify it is comfortable.",
        memoryTip: "Barrier covers knees too — inner wrist temp check, then resident confirms.",
        correctExplanation: "Right. The knee coverage is a specific evaluator item. The dual temperature check (CNA's inner wrist, then resident) is also separately evaluated.",
        incorrectExplanation: "The barrier must be large enough for both the basin and the CNA's knees. Check temperature with the inner wrist, then ask the resident to confirm it is comfortable.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "barrier large enough for knees", keywords: ["knees", "CNA knees", "large enough", "knees on barrier"] },
          { label: "inner wrist temperature check", keywords: ["inner wrist", "temperature", "check temp", "before soaking"] },
        ],
      },
      {
        id: "foot-care-step-5-soap-on-cloth-not-basin",
        title: "Apply soap to washcloth only — never add soap to the basin",
        questionType: "critical_thinking",
        difficulty: 2,
        concept: "Wring out the washcloth and apply soap to the washcloth to wash the foot — do not add soap directly to the basin of water. Do not put the soapy washcloth back into the basin. Adding soap to the basin makes it difficult to rinse the foot cleanly, and a soapy basin would require changing the water.",
        example: "Remove foot from basin, place on the large towel. Apply soap directly to the washcloth. Wash foot. Set soapy cloth aside. Place foot back in basin to rinse with a clean wrung-out washcloth.",
        question: "Why should soap never be added directly to the foot-care basin?",
        idealAnswer: "Soap in the basin makes clean rinsing impossible — the foot would be rinsed in soapy water. Apply soap to the washcloth only and do not put the soapy cloth back in the basin.",
        memoryTip: "Soap on cloth only — never in the basin.",
        correctExplanation: "Correct. This is a specific evaluator criterion. Adding soap to the basin is a technique error that fails this item.",
        incorrectExplanation: "Soap goes on the washcloth, not in the basin. Putting soap in the basin means the foot rinses in soapy water and the water may need to be changed.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "soap on washcloth not basin", keywords: ["soap on cloth", "not in basin", "not the water", "washcloth only"] },
          { label: "soapy cloth not back in basin", keywords: ["not back in basin", "don't put in basin", "set cloth aside"] },
        ],
      },
      {
        id: "foot-care-step-9-13-lotion-sock-floor",
        title: "Lotion excluding between toes; heel in sock; barefoot never touches floor",
        questionType: "recall",
        difficulty: 2,
        concept: "Warm lotion in hands before applying to the foot. Apply lotion to the foot excluding between the toes — moisture between toes promotes fungal growth. Apply the sock smoothly with the toe seam in place and the heel area correct. Avoid placing the resident's barefoot directly on the floor before, during, or after foot care.",
        example: "Apply lotion to the top, bottom, and sides of the foot, avoiding between the toes. Slide the sock on with the heel cup in the right place, then place the foot back on the barrier or into the shoe — never bare on the floor.",
        question: "Where must lotion NOT be applied during foot care, and where must the bare foot never be placed?",
        idealAnswer: "Lotion must not be applied between the toes. The resident's barefoot must never touch the floor before, during, or after foot care.",
        memoryTip: "No lotion between toes, no barefoot on floor — ever.",
        correctExplanation: "Exactly. Both are specific evaluator criteria. Lotion between toes promotes infection; barefoot on floor is a safety and fall risk.",
        incorrectExplanation: "Lotion is applied to all surfaces of the foot EXCEPT between the toes. The barefoot must not touch the floor at any point during or after foot care.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "no lotion between toes", keywords: ["between toes", "not between toes", "exclude between toes", "excluding toes"] },
          { label: "barefoot never on floor", keywords: ["barefoot", "not on floor", "never touch floor", "floor contact"] },
        ],
      },
    ],
    completionMessage: "Solid foot care technique. Key checkpoints: barrier covers CNA's knees, inner wrist temperature check then resident confirms, soap on washcloth not in basin, inspect bottom of foot, lotion excluding between toes, sock heel in place, barefoot never on floor.",
    nextRecommendedLessonIds: ["clinical-skill-hand-nail-care", "personal-care-adls"],
  },

  {
    id: "clinical-skill-mouth-care-denture",
    slug: "clinical-skill-mouth-care-denture",
    title: "Clinical Skill: Mouth Care — Resident With Dentures",
    domainSlug: "personal-care-adls",
    domainTitle: "Personal Care and ADLs",
    summary: "Master the evaluator criteria for denture care: cold water throughout, washcloth in sink to protect denture, brush all surfaces, store in cold water in cup, second set of gloves for mouth care.",
    learningGoal: "Clean a resident's denture safely and provide mouth care to gums, using correct water temperature and protecting the denture from damage throughout.",
    estimatedMinutes: 18,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "denture-step-4-5-cold-water-washcloth",
        title: "Cold water throughout; washcloth in sink to protect denture from breaking",
        questionType: "recall",
        difficulty: 1,
        concept: "Use cold water for the denture at all times — hot water can warp or crack acrylic dentures. Protect the denture from damage while cleaning by lining the sink with a washcloth and filling the sink with cold water before handling the denture over the sink. Brush all surfaces of the denture. Rinse using cold water.",
        example: "Before placing the denture over the sink, fold a washcloth and lay it in the sink basin. Fill the sink partway with cold water. If the denture slips, it lands on the cloth in water — not hard porcelain.",
        question: "Why is cold water required for denture care, and what protects the denture if it slips while being cleaned?",
        idealAnswer: "Cold water is required because hot water can warp or crack dentures. A washcloth placed in the sink filled with cold water prevents the denture from breaking if dropped.",
        memoryTip: "Cold water always; washcloth in sink — dentures crack in heat and fall.",
        correctExplanation: "Right. Cold water and the washcloth/sink-fill are separate evaluator checkpoints — both must be done.",
        incorrectExplanation: "Hot water warps or cracks dentures — cold water only. Line the sink with a washcloth and cold water before handling the denture, to cushion any drop.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "cold water only", keywords: ["cold water", "not hot", "cool water", "no hot water"] },
          { label: "washcloth in sink", keywords: ["washcloth in sink", "cloth in sink", "protect from breaking", "cushion"] },
        ],
      },
      {
        id: "denture-step-6-7-storage",
        title: "Store cleaned denture in cold water in a covered cup",
        questionType: "recall",
        difficulty: 1,
        concept: "Handle the clean denture maintaining cleanliness after brushing. Dispose of the old denture cup water, rinse the cup out, place the denture in the cup filled with clean cool water, and cover with a lid. Leave the denture cup on the resident's bedside cabinet or overbed table — or wherever the resident prefers. Place a new paper towel under the denture cup.",
        example: "Empty the old solution, rinse the cup, fill with fresh cold water, place denture in cup, put the lid on. Set on bedside table on a fresh paper towel.",
        question: "After cleaning, where should the denture be stored and in what?",
        idealAnswer: "The denture should be stored in a covered cup filled with clean cold water, placed on the resident's bedside cabinet or overbed table.",
        memoryTip: "Clean cold water, covered cup, on the bedside table.",
        correctExplanation: "Correct. Storing dentures dry can cause warping. The covered cup placement is a care-completion criterion.",
        incorrectExplanation: "After cleaning, the denture is stored in a covered cup filled with clean cold water, placed on the bedside table unless the resident prefers another location.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "cold water in covered cup", keywords: ["cold water", "covered cup", "cup with lid", "clean water"] },
          { label: "on bedside table or resident preference", keywords: ["bedside", "overbed table", "resident preference", "table"] },
        ],
      },
      {
        id: "denture-step-8-9-second-gloves-mouth",
        title: "Second set of gloves for mouth care; offer rinse water",
        questionType: "application",
        difficulty: 2,
        concept: "Remove gloves after denture care and replace with a new set of gloves before providing mouth care to the gums. Use a moistened foam-tipped applicator or toothbrush with toothpaste to clean upper and lower gums in all areas. Offer the resident a cup of water to rinse the mouth after mouth care.",
        example: "Remove gloves used for the denture, wash or sanitize hands, apply fresh gloves. Wet the mouth swab, apply toothpaste, clean all gum surfaces. Offer water to rinse.",
        question: "Why must the CNA use a second set of gloves for the gum care portion of this skill?",
        idealAnswer: "Gloves used during denture handling are contaminated from the old denture. A fresh pair prevents cross-contamination when touching the resident's mouth.",
        memoryTip: "Denture gloves off, new gloves on — then clean the gums.",
        correctExplanation: "Exactly. Two separate pairs of gloves are required. Continuing with denture-soiled gloves to do mouth care is an infection control failure.",
        incorrectExplanation: "The gloves used to handle the denture are contaminated. Remove them, and apply a new pair before providing mouth care to the gums.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "new set of gloves for mouth care", keywords: ["new gloves", "second gloves", "fresh pair", "new pair", "change gloves"] },
          { label: "denture gloves contaminated", keywords: ["contaminated", "cross-contamination", "denture gloves", "soiled gloves"] },
        ],
      },
    ],
    completionMessage: "Strong denture care technique. Key checkpoints: cold water throughout, washcloth in sink for drop protection, brush all surfaces, clean cold water in covered cup for storage, remove first gloves and apply second pair before gum care, offer rinse water.",
    nextRecommendedLessonIds: ["clinical-skill-mouth-care-teeth", "personal-care-adls"],
  },

  {
    id: "clinical-skill-mouth-care-teeth",
    slug: "clinical-skill-mouth-care-teeth",
    title: "Clinical Skill: Mouth Care — Resident With Natural Teeth",
    domainSlug: "personal-care-adls",
    domainTitle: "Personal Care and ADLs",
    summary: "Master the evaluator criteria for mouth care with natural teeth: HOB at 60–90 degrees before offering fluid, moisten brush before applying paste, gloves worn throughout including when rinsing basin, and area around mouth clean and dry at close.",
    learningGoal: "Provide mouth care safely to a bed-lying resident using correct positioning, glove use throughout, and proper cleanup.",
    estimatedMinutes: 15,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "mouth-care-teeth-step-3-hob-position",
        title: "HOB at 60–90 degrees before offering fluid or brushing",
        questionType: "recall",
        difficulty: 1,
        concept: "Assist the resident to a sitting position in bed by raising the HOB and using pillows as needed to position the resident upright at 60 to 90 degrees before offering fluid or brushing teeth. This positioning prevents aspiration during rinsing and spitting.",
        example: "Raise the HOB to 60–90 degrees and use a pillow behind the back if needed. Only then offer the water cup or begin brushing.",
        question: "What must be done to the resident's position before offering fluid or beginning to brush teeth?",
        idealAnswer: "The resident must be positioned upright at 60 to 90 degrees HOB before offering any fluid or brushing begins.",
        memoryTip: "HOB 60–90 first — upright before brushing or rinsing.",
        correctExplanation: "Correct. Raising HOB before brushing or offering fluids is an evaluator-specific aspiration-prevention step.",
        incorrectExplanation: "The HOB must be raised to 60–90 degrees before offering fluid or brushing teeth. This prevents aspiration.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "HOB 60-90 degrees before fluids or brushing", keywords: ["60", "90", "HOB", "upright", "before brushing", "before fluid"] },
        ],
      },
      {
        id: "mouth-care-teeth-step-4-5-moisten-gloves",
        title: "Moisten brush before toothpaste; gloves worn throughout",
        questionType: "recall",
        difficulty: 1,
        concept: "Protect the resident's clothing with a towel before providing mouth care. Moisten the toothbrush with water before applying toothpaste — this helps distribute the paste and ensures correct technique order. Apply gloves before brushing and wear them throughout mouth care, including when rinsing the basin and toothbrush.",
        example: "Wet the toothbrush, apply a small amount of toothpaste, then begin brushing. Keep gloves on when rinsing and cleaning up after.",
        question: "In what order must the toothbrush be prepared, and must gloves be worn during the cleanup steps?",
        idealAnswer: "Moisten the brush with water first, then apply toothpaste. Gloves must be worn throughout all of mouth care, including when rinsing the basin and toothbrush.",
        memoryTip: "Wet brush, then paste — gloves on through cleanup.",
        correctExplanation: "Right. Moistening before paste and wearing gloves through cleanup are both evaluator checkpoints.",
        incorrectExplanation: "The brush is moistened first, then toothpaste is applied. Gloves must remain on throughout mouth care, including cleanup of the basin and brush.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "moisten brush before paste", keywords: ["moisten first", "wet brush", "water first", "before toothpaste"] },
          { label: "gloves throughout including cleanup", keywords: ["gloves throughout", "including cleanup", "rinsing basin", "throughout mouth care"] },
        ],
      },
      {
        id: "mouth-care-teeth-step-6-7-rinse-dry",
        title: "Offer rinse water; leave mouth area clean and dry",
        questionType: "application",
        difficulty: 1,
        concept: "Offer the resident a cup of water to rinse the mouth after brushing. Provide an emesis basin or disposable cup to use for spitting. Leave the area around the resident's mouth clean and dry when care is completed. Remove the towel and place it in the soiled linen hamper.",
        example: "After brushing, hold the water cup to the resident. Hold the emesis basin near the chin for spitting. When done, use a dry cloth to clean and dry the skin around the mouth.",
        question: "What must the CNA offer for rinsing and what must the area around the resident's mouth look like at the end of the skill?",
        idealAnswer: "Offer a cup of water for rinsing and provide an emesis basin for spitting. The area around the mouth must be clean and dry when care is complete.",
        memoryTip: "Rinse water and emesis basin — mouth clean and dry at the end.",
        correctExplanation: "Correct. Both the rinse offer and the clean/dry completion are evaluator criteria.",
        incorrectExplanation: "After brushing: offer rinse water and provide an emesis basin for spitting. Leave the area around the mouth clean and dry at completion.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "offer rinse water and emesis basin", keywords: ["rinse water", "water to rinse", "emesis basin", "cup for spitting"] },
          { label: "mouth area clean and dry", keywords: ["clean and dry", "dry the area", "clean area", "around mouth"] },
        ],
      },
    ],
    completionMessage: "Strong mouth care technique. Key checkpoints: HOB 60–90 degrees before fluid or brushing, moisten brush then apply paste, gloves throughout including cleanup, offer rinse water with emesis basin, leave mouth area clean and dry.",
    nextRecommendedLessonIds: ["clinical-skill-mouth-care-denture", "personal-care-adls"],
  },

  {
    id: "clinical-skill-perineal-care",
    slug: "clinical-skill-perineal-care",
    title: "Clinical Skill: Perineal Care — Female Resident Incontinent of Urine",
    domainSlug: "personal-care-adls",
    domainTitle: "Personal Care and ADLs",
    summary: "Master the evaluator criteria for perineal care: 5-corner first washcloth for front perineum, pat dry front to back, replace water if cold or soapy, 4-corner third washcloth for buttocks/rectal area (anal opening upward), and soiled chucks replaced on both sides.",
    learningGoal: "Provide complete perineal care safely using correct cleaning direction, correct washcloth technique front and back, and proper underpad management.",
    estimatedMinutes: 20,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "peri-care-step-6-5-corner-front",
        title: "Front perineum: 5-corner first washcloth, front to back",
        questionType: "recall",
        difficulty: 2,
        concept: "First washcloth — wring it out, apply soap to five corners. Open the labia with the free hand, clean top to bottom (down center with corner 1), new corner for each outer labia, new corner for each outer leg fold. Place dirty washcloth on barrier. Use a new washcloth to rinse the same way. Pat dry the front perineum after washing and rinsing, using the towel to pat dry from front to back.",
        example: "This is the same 5-corner pattern as catheter care: center first, outer labia x2, leg folds x2. Rinse with the same pattern. Pat dry with a towel — always front to back, never back to front.",
        question: "How many corners does the first washcloth use for the front perineum, and what direction is used for pat drying?",
        idealAnswer: "Five corners: center first, then outer labia (2 corners), then leg folds (2 corners). Pat dry from front to back.",
        memoryTip: "5 corners front, dry front to back — never back to front.",
        correctExplanation: "Right. Five corners and front-to-back drying are both evaluator checkpoints. Back-to-front contamination is a common failure mode.",
        incorrectExplanation: "Five corners for the front perineum: center first, two corners for outer labia, two corners for leg folds. Pat dry from front to back — always.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "five corners for front perineum", keywords: ["five corners", "5 corners", "front perineum", "corner for each"] },
          { label: "pat dry front to back", keywords: ["front to back", "front-to-back", "pat dry", "direction"] },
        ],
      },
      {
        id: "peri-care-step-8-water-change",
        title: "Replace water if it becomes cold or soapy",
        questionType: "recall",
        difficulty: 1,
        concept: "Replace water in the basin during care if it becomes cold or soapy. Avoid placing used washcloths in the water. Avoid placing soap directly in the water — these practices would require an early water change. Pull down the gown and privacy blanket after drying the front perineum, before turning the resident for the rectal area.",
        example: "If the water feels cool to the inner wrist during care, or if soapy residue is visible, change the water before continuing.",
        question: "Under what two conditions must the basin water be replaced during perineal care?",
        idealAnswer: "Replace the water if it becomes cold or if it becomes soapy.",
        memoryTip: "Cold or soapy — change the water.",
        correctExplanation: "Correct. Both are evaluator conditions. Continuing with cold or soapy water risks resident discomfort and ineffective rinsing.",
        incorrectExplanation: "Replace the water if it becomes cold or soapy. This is why used washcloths and soap should not go directly into the basin water.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "replace if cold", keywords: ["cold", "cool", "not warm", "water temperature"] },
          { label: "replace if soapy", keywords: ["soapy", "soap in water", "sudsy"] },
        ],
      },
      {
        id: "peri-care-step-9-buttocks-rectal",
        title: "Buttocks/rectal area: 4-corner third washcloth, anal opening moving upward",
        questionType: "recall",
        difficulty: 2,
        concept: "After turning the resident to their side, use the third washcloth — wring and apply soap to 4 corners. Begin at the anal opening and clean UP toward the back with the first corner. With a new corner, clean one buttock toward the back. With a new corner, clean the other buttock. With the last corner, clean down the middle again from the anal opening up toward the back. Rinse in the same manner. Pat dry.",
        example: "Four corners, anal opening first and last (cleaning upward/toward back), with each buttock in between. This upward direction carries bacteria away from vaginal area.",
        question: "For the rectal/buttocks area, where does cleaning begin and in which direction does each stroke move?",
        idealAnswer: "Begin at the anal opening and clean upward toward the back (away from the vaginal area). Use 4 corners total: anal area, one buttock, other buttock, anal area again.",
        memoryTip: "Anal opening first, clean upward — 4 corners, anal first and last.",
        correctExplanation: "Correct. Cleaning from the anal opening upward prevents fecal contamination of the perineum. The 4-corner pattern is a specific evaluator item.",
        incorrectExplanation: "For the rectal area: start at the anal opening and clean upward toward the back. Use 4 corners: anal opening (toward back), one buttock, other buttock, then anal opening again (toward back).",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "start at anal opening", keywords: ["anal opening", "start at", "begin at", "anus first"] },
          { label: "clean upward toward back", keywords: ["upward", "toward back", "away from vagina", "up toward"] },
        ],
      },
    ],
    completionMessage: "Strong perineal care technique. Key checkpoints: 5-corner front washcloth (center then labia then leg folds), rinse same pattern, pat dry front to back, replace water if cold or soapy, 4-corner rectal washcloth (anal opening upward), replace soiled chucks on both sides.",
    nextRecommendedLessonIds: ["clinical-skill-catheter-care", "personal-care-adls"],
  },

  {
    id: "clinical-skill-hand-nail-care",
    slug: "clinical-skill-hand-nail-care",
    title: "Clinical Skill: Resident Hand and Nail Care",
    domainSlug: "personal-care-adls",
    domainTitle: "Personal Care and ADLs",
    summary: "Master the evaluator criteria for hand and nail care: soak full hand, clean under each nail with orange stick edge (wipe between nails), file in one direction toward center, lotion to hand without exclusion, and support arm if raised.",
    learningGoal: "Provide hand and nail care correctly including soaking, nail residue removal, smooth filing, and proper lotion application.",
    estimatedMinutes: 15,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "hand-nail-step-4-5-soak-wash",
        title: "Soak full hand before cleaning; wash with soapy cloth then rinse",
        questionType: "recall",
        difficulty: 1,
        concept: "Place the full hand into the basin of water to soak before removing residue from under nails. Put washcloths in basin. Clean hand surfaces using a wet washcloth, cleaning between fingers. Remove hand from basin and place on towel. Wring washcloth out, apply soap, clean hand. Put hand back in basin to rinse or remove soap using a clean, soap-free, wet washcloth. Pat dry all surfaces.",
        example: "Full hand soaks in warm water first. Then the hand comes out onto a towel. Soapy washcloth washes all surfaces and between fingers. Hand goes back in the basin to rinse, or a fresh cloth rinses it. Then pat dry.",
        question: "What does the full hand do first, and what is the order of washing and rinsing?",
        idealAnswer: "The full hand soaks in the basin first. Then it is washed with a soapy washcloth, rinsed in the basin or with a clean cloth, and pat dried.",
        memoryTip: "Full hand soak first, then soapy wash, then rinse, then dry.",
        correctExplanation: "Correct. The soak-before-clean order and full-hand placement are evaluator checkpoints.",
        incorrectExplanation: "The full hand soaks in the basin first — then wash with soapy cloth, rinse, and pat dry. The hand goes all the way in the water, not just the fingers.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "full hand soak first", keywords: ["full hand", "soak first", "full hand in basin", "submerge"] },
          { label: "wash then rinse then dry", keywords: ["wash then rinse", "soapy then rinse", "rinse after wash", "pat dry"] },
        ],
      },
      {
        id: "hand-nail-step-7-orange-stick",
        title: "Flat edge of orange stick under each nail; wipe stick between nails",
        questionType: "recall",
        difficulty: 2,
        concept: "Use the flat edge of the orangewood stick to remove residue under the tips of each fingernail. Remove residue from the edge of the orangewood stick — wipe it off — before using it again to clean under another fingernail. Clean all nails.",
        example: "Use the flat edge (not the pointed tip) under nail 1 to scoop out residue. Wipe the stick on a paper towel or cloth to remove the debris. Then clean nail 2, wipe, nail 3, wipe, and so on for all nails.",
        question: "What part of the orange stick cleans under nails, and what must be done to the stick between each nail?",
        idealAnswer: "The flat edge of the orange stick is used under each nail. The stick must be wiped clean between each nail before using it on the next.",
        memoryTip: "Flat edge under each nail — wipe stick before the next nail.",
        correctExplanation: "Right. Using the pointed tip or reusing without wiping are both evaluator errors. The flat edge and between-nail cleaning are specific items.",
        incorrectExplanation: "Use the flat edge of the orange stick under each fingernail. Wipe the stick clean before moving to the next nail to prevent spreading debris.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "flat edge of orange stick", keywords: ["flat edge", "flat end", "orangewood stick", "flat side"] },
          { label: "wipe stick between nails", keywords: ["wipe between", "wipe stick", "clean stick", "before next nail"] },
        ],
      },
      {
        id: "hand-nail-step-8-emery-board",
        title: "File with emery board in one direction toward the center",
        questionType: "recall",
        difficulty: 1,
        concept: "Leave nails smooth using an emery board, filing toward the center in one direction only. Back-and-forth sawing motion with an emery board can split or crack the nail. File in one direction from the outer edge toward the center on each side.",
        example: "File from the left edge inward toward the center of the nail. Then from the right edge inward toward the center. One direction only — never back and forth.",
        question: "In what direction should the emery board move when filing nails, and why?",
        idealAnswer: "File toward the center in one direction only. Back-and-forth filing can split or crack nails.",
        memoryTip: "One direction toward center — never saw back and forth.",
        correctExplanation: "Exactly. Unidirectional filing is an evaluator criterion. Sawing motion is the most common filing error.",
        incorrectExplanation: "File the nails toward the center, in one direction only. Sawing back and forth can crack or split the nail.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "one direction toward center", keywords: ["one direction", "toward center", "center", "not back and forth"] },
          { label: "prevent splitting", keywords: ["split", "crack", "sawing", "damage nail"] },
        ],
      },
    ],
    completionMessage: "Good hand and nail care technique. Key checkpoints: full hand soaks first, soapy wash then rinse, flat edge of orange stick under each nail with wipe between nails, emery board one direction toward center, lotion applied to hand, support arm if raised.",
    nextRecommendedLessonIds: ["clinical-skill-foot-care", "personal-care-adls"],
  },

  {
    id: "clinical-skill-partial-bed-bath",
    slug: "clinical-skill-partial-bed-bath",
    title: "Clinical Skill: Partial Bed Bath and Back Rub",
    domainSlug: "personal-care-adls",
    domainTitle: "Personal Care and ADLs",
    summary: "Master the evaluator criteria for partial bed bath: 4-corner first washcloth for the face (inner-to-outer eye first), washcloth mitt formation for body washing, clean-to-dirty order, and back rub with long gliding and circular motions from shoulders to waist x3.",
    learningGoal: "Provide a partial bed bath safely using the correct face-washing technique, mitt formation, clean-to-dirty order, and proper back rub technique.",
    estimatedMinutes: 20,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "bed-bath-step-4-four-corner-face",
        title: "Face: 4-corner first washcloth — inner to outer eye first",
        questionType: "recall",
        difficulty: 2,
        concept: "First washcloth — wring out. With the first corner, cleanse inner to outer on one eye. With the second corner, wipe the other eye. With the third corner, wash the remaining skin of the face. With the fourth corner, wipe the nose. Pat dry face with a towel. Each eye gets its own corner to prevent cross-eye contamination.",
        example: "Corner 1: wipe from the inner corner of the right eye outward. Corner 2: inner to outer of the left eye. Corner 3: forehead, cheeks, chin. Corner 4: nose.",
        question: "In what order do the 4 corners of the face washcloth clean the face, and where does each eye-corner start?",
        idealAnswer: "Corner 1: inner to outer on one eye. Corner 2: inner to outer on the other eye. Corner 3: remaining face. Corner 4: nose. Each eye starts from the inner corner and moves outward.",
        memoryTip: "Eye 1, eye 2, face, nose — inner to outer on each eye.",
        correctExplanation: "Right. Inner-to-outer eye direction and separate corners for each eye are evaluator items. Reusing an eye corner spreads infection.",
        incorrectExplanation: "The 4 corners for the face: first corner inner to outer on one eye, second corner inner to outer on the other eye, third corner for the rest of the face, fourth corner for the nose.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "inner to outer eye direction", keywords: ["inner to outer", "inner corner outward", "inner edge", "inside out"] },
          { label: "separate corner each eye", keywords: ["separate corner", "each eye", "different corner", "new corner for each eye"] },
        ],
      },
      {
        id: "bed-bath-step-5-mitt",
        title: "Form a washcloth mitt for body washing",
        questionType: "recall",
        difficulty: 1,
        concept: "Contain the corners of the washcloth while washing and rinsing the body by forming a mitt. A mitt prevents loose corners from dragging against the resident's skin and keeps the cloth under control. Protect bed linen from becoming wet during washing and rinsing of body areas.",
        example: "Wrap the washcloth around the hand so all four corners are tucked in and contained. The flat surface of the mitt contacts the resident's skin — no flapping ends.",
        question: "What form must the washcloth take when washing the body, and what does this prevent?",
        idealAnswer: "The washcloth must be formed into a mitt by containing all corners. This prevents loose ends from dragging on the skin and keeps the cloth controlled.",
        memoryTip: "Form a mitt — no loose corners flapping on the skin.",
        correctExplanation: "Correct. Mitt formation is an evaluator criterion for body washing. Loose corners are flagged as poor technique.",
        incorrectExplanation: "A washcloth mitt is formed by tucking all corners in. This prevents dragging loose ends across the resident's skin during body washing.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "form a mitt", keywords: ["mitt", "form mitt", "washcloth mitt", "tuck corners"] },
          { label: "prevents loose ends dragging", keywords: ["loose ends", "dragging", "flapping", "corners contained"] },
        ],
      },
      {
        id: "bed-bath-step-10-back-rub",
        title: "Back rub: long gliding and circular motions, shoulders to waist x3",
        questionType: "recall",
        difficulty: 1,
        concept: "After washing and rinsing the back, apply lotion to the hands and warm it. Provide a back rub using long gliding and circular motions from the shoulders down to the waist, three times. Remove excess lotion if present. Then tie the clean gown around the neck and return the resident to a centered position in bed.",
        example: "Both hands on the back — long gliding stroke from shoulders to waist, then circular strokes along the same path. Three full passes. Wipe excess lotion, tie gown.",
        question: "Describe the required back rub technique: motion type and number of passes.",
        idealAnswer: "Long gliding and circular motions from the shoulders down to the waist, three times.",
        memoryTip: "Long gliding + circular, shoulders to waist, three passes.",
        correctExplanation: "Right. Both motion types (gliding and circular) and three passes are evaluator items. Doing only one motion type or fewer than three passes fails.",
        incorrectExplanation: "The back rub uses long gliding AND circular motions from the shoulders down to the waist, repeated three times. Both motion types are required.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "long gliding and circular motions", keywords: ["long gliding", "circular", "gliding and circular", "both motions"] },
          { label: "shoulders to waist three times", keywords: ["shoulders to waist", "three times", "x3", "three passes"] },
        ],
      },
    ],
    completionMessage: "Strong partial bed bath technique. Key checkpoints: 4-corner face washcloth (eye-eye-face-nose, inner to outer on each eye), washcloth mitt for body, clean to dirty order, back rub with long gliding and circular motions shoulders to waist x3, clean gown applied.",
    nextRecommendedLessonIds: ["clinical-skill-dressing", "personal-care-adls"],
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
      question: `In your own words, how would you apply this on the floor: ${segment.idealAnswer}`,
      idealAnswer: `Apply it by doing this safely and directly: ${segment.idealAnswer}`,
      correctExplanation: `Correct. You connected the rule to what a CNA should actually do.`,
      incorrectExplanation: `Not yet. This answer has to apply the action, not just name the topic. Include: ${requiredConcepts}.`,
    },
    {
      ...segment,
      id: `${segment.id}-scenario`,
      title: `${segment.title}: Scenario judgment`,
      questionType: "scenario",
      difficulty: 2,
      question: `A resident care situation tests this exact idea. What should the CNA do first, and why?`,
      idealAnswer: `${segment.idealAnswer} The reason is that it protects resident safety, dignity, and scope of practice.`,
      correctExplanation: `Right. You identified the safe first action and the reason behind it.`,
      incorrectExplanation: `Not quite. The scenario answer must name the safe first action and why it matters. Include: ${requiredConcepts}.`,
    },
    {
      ...segment,
      id: `${segment.id}-misconception`,
      title: `${segment.title}: Common misconception`,
      questionType: "misconception",
      difficulty: 2,
      question: `A common mistake is thinking, "${misconception}." What is the corrected CNA action?`,
      idealAnswer: segment.idealAnswer,
      correctExplanation: `Correct. You corrected the misconception with the safer CNA action.`,
      incorrectExplanation: `That still leaves the misconception in place. Correct it clearly by including: ${requiredConcepts}.`,
    },
    {
      ...segment,
      id: `${segment.id}-challenge`,
      title: `${segment.title}: Exam reasoning`,
      questionType: "critical_thinking",
      difficulty: 3,
      question: `On the exam, what words or clues would tell you this is the correct answer instead of a distractor?`,
      idealAnswer: `The clues point back to: ${segment.idealAnswer}`,
      correctExplanation: `Good exam reasoning. You connected the clue words to the safest CNA response.`,
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
    example: `A strong CNA exam answer names the safe action, stays within scope, and explains why the resident is protected.`,
    question: `Give a brief recap of the most important takeaways from this subject.`,
    idealAnswer: `The key takeaways are: ${coreConcepts.join(", ")}. A CNA should choose the safest first action, protect dignity, report appropriately, and stay within scope.`,
    memoryTip: "Safe action, clear reason, CNA scope.",
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
    completionMessage: `${lesson.completionMessage} Recap the safe first action, the reason it matters, and the CNA scope boundary before moving on.`,
    segments: [...masterySegments, buildSummarySegment(lesson)],
  };
}

export const tutorLessonLibrary: TutorLesson[] = baseTutorLessonLibrary.map(enrichLesson);
