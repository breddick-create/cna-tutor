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
