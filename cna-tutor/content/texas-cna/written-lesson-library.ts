import type { TutorLesson } from "@/lib/tutor/types";

export const writtenDomainLessons: TutorLesson[] = [

  // ─── Member of the Health Care Team ──────────────────────────────────────────

  {
    id: "hct-role-and-scope",
    slug: "hct-role-and-scope",
    title: "Your Role and Scope of Practice",
    domainSlug: "health-care-team",
    domainTitle: "Member of the Health Care Team",
    summary: "Understand what a CNA does, what they do not do, and what happens when scope is crossed.",
    learningGoal: "Define scope of practice and apply it correctly on written exam questions about task assignment and refusal.",
    estimatedMinutes: 25,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "hct-scope-definition",
        title: "What scope of practice means",
        concept:
          "Scope of practice defines the tasks a CNA is legally and professionally allowed to perform. Tasks outside scope — such as administering medications, performing sterile wound care, or interpreting lab results — belong to licensed staff. Performing out-of-scope tasks puts the resident and the aide at legal risk.",
        example:
          "A nurse asks the aide to give an oral medication because the nurse is busy. The aide must decline — medication administration is outside CNA scope regardless of who asks.",
        question: "What should a CNA do if asked to perform a task outside their scope of practice?",
        idealAnswer:
          "The CNA should decline the task and explain that it is outside their scope, then notify the supervising nurse.",
        memoryTip: "Scope protects the resident. Decline out-of-scope tasks — always.",
        correctExplanation: "Correct. Declining out-of-scope tasks is not insubordination — it is the safe and legally required action.",
        incorrectExplanation: "The CNA must decline tasks outside their scope. Performing them, even when directed, puts the resident and the aide at legal risk.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "decline the task", keywords: ["decline", "refuse", "not do", "say no"] },
          { label: "notify the nurse", keywords: ["nurse", "supervisor", "report", "tell"] },
        ],
      },
      {
        id: "hct-delegation",
        title: "Delegation: only nurses can delegate",
        concept:
          "Delegation is the process by which a licensed nurse assigns a nursing task to a CNA. Only a licensed nurse (RN or LVN/LPN) can delegate tasks. The nurse retains supervisory responsibility for all delegated tasks, even after they are assigned.",
        example:
          "Another CNA tells you to do a dressing change. You should decline — only a licensed nurse can delegate tasks, not a coworker.",
        question: "Who has the authority to delegate a nursing task to a CNA?",
        idealAnswer: "Only a licensed nurse — an RN or LVN/LPN — can delegate tasks to a CNA.",
        memoryTip: "Only nurses delegate. The nurse stays responsible.",
        correctExplanation: "Correct. Delegation authority belongs to licensed nurses only.",
        incorrectExplanation: "Only a licensed nurse can delegate to a CNA. Coworkers, aides, or other non-licensed staff cannot assign nursing tasks.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "licensed nurse", keywords: ["nurse", "rn", "lvn", "lpn", "licensed"] },
        ],
      },
      {
        id: "hct-accountability",
        title: "Professional accountability",
        concept:
          "Accountability means the CNA is answerable for their actions and omissions. If a CNA makes an error — such as forgetting to reposition a resident or performing care incorrectly — they must report it to the nurse immediately. Hiding mistakes is more dangerous than the mistake itself.",
        example:
          "A CNA accidentally skips a repositioning due to being busy. They tell the nurse right away so the nurse can assess the resident for any skin changes.",
        question: "A CNA makes a care error. What is the professional and legally correct action?",
        idealAnswer: "Report the error to the supervising nurse immediately so the nurse can assess and intervene if needed.",
        memoryTip: "Accountability = own it and report it immediately.",
        correctExplanation: "Yes. Immediate disclosure allows the nurse to protect the resident.",
        incorrectExplanation: "Errors must be reported to the nurse immediately. Hiding or delaying the report endangers the resident and the aide.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "report immediately", keywords: ["report", "tell nurse", "notify", "disclose", "immediately"] },
          { label: "nurse assesses", keywords: ["assess", "check", "nurse", "intervene", "protect"] },
        ],
      },
    ],
    completionMessage: "Good. On the exam: decline out-of-scope tasks, remember only nurses delegate, and report errors immediately.",
    nextRecommendedLessonIds: ["hct-team-and-care-planning", "hct-professionalism-obra"],
  },

  {
    id: "hct-team-and-care-planning",
    slug: "hct-team-and-care-planning",
    title: "The Interdisciplinary Team and Care Planning",
    domainSlug: "health-care-team",
    domainTitle: "Member of the Health Care Team",
    summary: "Learn who is on the health care team, the purpose of the care plan, and how CNAs contribute.",
    learningGoal: "Describe the interdisciplinary team's roles and explain the CNA's contribution to care planning.",
    estimatedMinutes: 25,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "hct-team-members",
        title: "Who is on the health care team",
        concept:
          "The interdisciplinary team includes the physician, RN, LVN/LPN, CNA, physical therapist, occupational therapist, speech therapist, social worker, dietitian, and chaplain. Each member has a defined role. The CNA's role is daily hands-on care and observation reporting.",
        example:
          "After noticing a resident is eating less and seems sad, the CNA reports this to the nurse. The nurse may involve the dietitian, physician, and social worker to address the change.",
        question: "What is the CNA's main contribution to the interdisciplinary health care team?",
        idealAnswer: "The CNA provides daily hands-on care and reports observations of the resident's condition, function, and mood to the nurse.",
        memoryTip: "CNA: the team's daily eyes, ears, and hands.",
        correctExplanation: "Correct. The CNA's daily proximity to residents makes their observations invaluable to the team.",
        incorrectExplanation: "The CNA's main contribution is direct care and reporting observations — not making clinical decisions. Those belong to licensed team members.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "daily hands-on care", keywords: ["daily care", "direct care", "hands-on", "personal care"] },
          { label: "report observations", keywords: ["report", "observe", "notify", "observations"] },
        ],
      },
      {
        id: "hct-care-plan",
        title: "The care plan and care conference",
        concept:
          "The care plan is a written, individualized plan developed by the RN that describes a resident's needs, goals, and interventions. Care conferences bring together the team, resident, and family to review and update the plan. CNAs must follow the care plan and may contribute observations to it.",
        example:
          "During a care conference, the CNA mentions that a resident always resists morning baths but accepts showers in the afternoon. The team updates the care plan to schedule showers in the afternoon.",
        question: "What is the purpose of the resident care conference?",
        idealAnswer: "To bring together the interdisciplinary team, resident, and family to review and update the individualized care plan.",
        memoryTip: "Care conference = whole team reviews and updates the care plan.",
        correctExplanation: "Correct. Care conferences are about reviewing and updating the care plan with all parties.",
        incorrectExplanation: "Care conferences are not for staff evaluations or scheduling — they exist to review and update the individualized care plan with the team, resident, and family.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "review and update care plan", keywords: ["care plan", "review", "update", "revise"] },
          { label: "whole team involvement", keywords: ["team", "family", "resident", "interdisciplinary"] },
        ],
      },
      {
        id: "hct-communication",
        title: "Reporting and communicating with the team",
        concept:
          "CNAs communicate changes in resident condition to the nurse verbally and through documentation. Reports must be timely, accurate, and objective — describing what was seen, heard, or measured, not the aide's interpretation. Delaying a report can endanger the resident.",
        example:
          "A resident has a new cough after lunch. The CNA tells the nurse right away: 'Mr. Jones developed a cough after lunch. He coughed four times and brought up a small amount of clear sputum.' That is an objective, timely report.",
        question: "A resident's skin looks red over the hip. How should the CNA report this?",
        idealAnswer: "Tell the nurse immediately with objective details: the location, size, color, and how it looked — without guessing the cause.",
        memoryTip: "Report facts, not interpretations. Tell the nurse immediately.",
        correctExplanation: "Yes. Objective, timely reporting lets the nurse make the clinical assessment.",
        incorrectExplanation: "Reports must be objective (what you see/measure) and immediate. The CNA should not guess the cause — that is the nurse's role.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "report immediately", keywords: ["immediately", "right away", "now", "tell nurse"] },
          { label: "objective description", keywords: ["objective", "describe", "what you see", "location", "color", "size"] },
        ],
      },
    ],
    completionMessage: "Solid. CNA role: hands-on care + observations. Care conference = team updates the care plan. Reports: objective and immediate.",
    nextRecommendedLessonIds: ["hct-professionalism-obra"],
  },

  {
    id: "hct-professionalism-obra",
    slug: "hct-professionalism-obra",
    title: "Professionalism, OBRA, and the Registry",
    domainSlug: "health-care-team",
    domainTitle: "Member of the Health Care Team",
    summary: "Understand the federal rules that govern CNA training, certification, and conduct.",
    learningGoal: "State OBRA's training requirements, describe the nurse aide registry, and identify professional boundary violations.",
    estimatedMinutes: 22,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "hct-obra-requirements",
        title: "OBRA training requirements",
        concept:
          "The Omnibus Budget Reconciliation Act of 1987 (OBRA) established federal minimum standards for nursing home care, including a requirement for CNAs to complete at least 75 hours of training — with at least 16 hours of supervised clinical practice — before working with residents unsupervised. A competency evaluation must also be passed.",
        example:
          "A facility cannot let a new hire care for residents alone until they have completed 75 hours of training and passed the state competency test.",
        question: "What is the minimum number of training hours OBRA requires for CNAs?",
        idealAnswer: "OBRA requires a minimum of 75 hours of training, including at least 16 hours of supervised clinical practice.",
        memoryTip: "OBRA = 75 hours minimum, 16 clinical.",
        correctExplanation: "Correct. 75 total hours with 16 supervised clinical hours is the OBRA federal floor.",
        incorrectExplanation: "OBRA requires a minimum of 75 training hours — not 40 or 100. At least 16 of those hours must be supervised clinical practice.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "75 hours", keywords: ["75", "seventy-five"] },
        ],
      },
      {
        id: "hct-registry",
        title: "The nurse aide registry",
        concept:
          "Each state maintains a nurse aide registry that lists certified CNAs, their certification status, and any substantiated findings of abuse, neglect, or exploitation. Employers must check the registry before hiring. A finding of abuse on the registry prevents employment in a nursing facility.",
        example:
          "A CNA is substantiated for resident neglect after an investigation. This finding is added to the state registry, and the CNA cannot work in a certified facility until it is resolved.",
        question: "What does the nurse aide registry track in addition to certification status?",
        idealAnswer: "The registry tracks substantiated findings of abuse, neglect, or exploitation.",
        memoryTip: "Registry = credentials + any substantiated abuse findings.",
        correctExplanation: "Yes. The registry is both a credentialing and a protective record.",
        incorrectExplanation: "The registry tracks substantiated abuse, neglect, or exploitation findings — not just credentials. Employers must check it before hiring.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "abuse neglect exploitation findings", keywords: ["abuse", "neglect", "exploitation", "substantiated", "findings"] },
        ],
      },
      {
        id: "hct-professional-boundaries",
        title: "Professional boundaries",
        concept:
          "Professional boundaries define the appropriate limits of the therapeutic relationship. Violations include accepting gifts of significant value, sharing personal problems with residents, visiting residents at home, becoming a social media friend, or developing a romantic relationship. Boundary violations create dependency and ethical conflicts.",
        example:
          "A resident offers the CNA a $100 bill as a thank-you. Accepting it is a boundary violation even though the resident offered it freely.",
        question: "Give two examples of professional boundary violations by a CNA.",
        idealAnswer: "Accepting gifts of significant value and visiting residents outside the facility are both boundary violations. Sharing personal problems with residents and social media contact are also violations.",
        memoryTip: "Boundary violations: gifts, home visits, personal sharing, social media contact.",
        correctExplanation: "Correct. Professional relationships must stay within the therapeutic context — care setting only.",
        incorrectExplanation: "Boundary violations include accepting significant gifts, personal visits, sharing personal problems, and social media friendships. The relationship stays professional and within the care setting.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "accepting gifts", keywords: ["gift", "money", "valuable", "accept"] },
          { label: "outside relationship", keywords: ["home visit", "social media", "personal", "outside work", "romantic"] },
        ],
      },
    ],
    completionMessage: "Strong finish. OBRA = 75 hours (16 clinical). Registry = credentials + abuse findings. Boundaries: no gifts, no home visits, no personal sharing.",
    nextRecommendedLessonIds: [],
  },

  // ─── Basic Nursing Care ───────────────────────────────────────────────────────

  {
    id: "bnc-vital-signs-observations",
    slug: "bnc-vital-signs-observations",
    title: "Vital Signs and Reportable Changes",
    domainSlug: "basic-nursing-care",
    domainTitle: "Basic Nursing Care",
    summary: "Learn how to measure and report vital signs accurately and recognize changes that require immediate nursing attention.",
    learningGoal: "Identify normal vital sign ranges and state which findings require prompt reporting to the nurse.",
    estimatedMinutes: 25,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "bnc-normal-vitals",
        title: "Normal vital sign ranges",
        concept:
          "Normal adult vital sign ranges: temperature 97–99°F (oral); pulse 60–100 beats per minute; respirations 12–20 breaths per minute; blood pressure 120/80 mmHg as a standard reference. Values outside these ranges require reporting to the nurse. The CNA measures but does not interpret — the nurse decides what to do.",
        example:
          "A resident's pulse is 110 bpm and they feel 'fluttery.' The CNA measures, documents, and reports to the nurse immediately.",
        question: "What is the normal range for adult pulse rate?",
        idealAnswer: "60 to 100 beats per minute.",
        memoryTip: "Pulse 60–100; Resp 12–20; Temp 97–99°F.",
        correctExplanation: "Correct. 60–100 bpm is the normal adult resting pulse range.",
        incorrectExplanation: "Normal adult pulse is 60–100 bpm. Below 60 or above 100 should be reported to the nurse.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "60 to 100 bpm", keywords: ["60", "100", "sixty", "one hundred", "bpm", "per minute"] },
        ],
      },
      {
        id: "bnc-report-changes",
        title: "Reportable changes and observations",
        concept:
          "The CNA must report to the nurse immediately: vital signs outside normal range, sudden confusion or change in alertness, new pain or worsening pain, difficulty breathing, skin changes (redness, breakdown, rash), changes in urine color or odor, falls or injuries, refusal to eat or drink, and behavioral changes.",
        example:
          "A resident who was alert at breakfast is now confused and cannot remember where they are. The CNA reports this to the nurse right away — confusion can signal a UTI, stroke, medication reaction, or other emergency.",
        question: "Name two observations a CNA should report to the nurse immediately.",
        idealAnswer: "A sudden change in alertness or confusion and new or worsening pain are both immediate report items. Abnormal vital signs, breathing difficulty, skin breakdown, and refusal to eat are also reportable.",
        memoryTip: "Report changes from baseline — sudden confusion, pain, breathing, skin, falls.",
        correctExplanation: "Yes. Any change from the resident's normal baseline is worth reporting.",
        incorrectExplanation: "Reportable changes include sudden confusion, abnormal vital signs, new pain, breathing difficulty, skin changes, and falls. Report anything that has changed from the resident's usual state.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "change in mental status", keywords: ["confusion", "alert", "mental", "oriented", "aware"] },
          { label: "pain or breathing", keywords: ["pain", "breathing", "dyspnea", "respiratory", "hurt"] },
        ],
      },
      {
        id: "bnc-intake-output",
        title: "Intake and output",
        concept:
          "Intake and output (I&O) tracking measures fluids taken in (drinks, IV, tube feeds) and fluids released (urine, emesis, wound drainage). The CNA measures and records both. Output is measured in milliliters (mL) or cubic centimeters (cc). Normal adult urine output is approximately 30 mL or more per hour.",
        example:
          "A resident on I&O has a 200 mL cup of juice at breakfast. The CNA records 200 mL intake. The resident later voids 150 mL — the CNA records 150 mL output.",
        question: "What does intake and output tracking measure, and what is the minimum hourly urine output that should be reported?",
        idealAnswer: "I&O measures all fluids taken in and released. Less than 30 mL of urine per hour should be reported to the nurse.",
        memoryTip: "I&O: measure all in and all out. Report less than 30 mL/hr urine.",
        correctExplanation: "Correct. Tracking I&O helps detect fluid imbalance, dehydration, or kidney problems.",
        incorrectExplanation: "I&O tracks all fluid in (drinks, IV) and out (urine, emesis). Urine output less than 30 mL per hour signals a problem and must be reported.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "fluids in and out", keywords: ["intake", "output", "fluids", "in and out", "all fluids"] },
          { label: "30 mL per hour", keywords: ["30 ml", "30 cc", "30 milliliter", "per hour", "minimum"] },
        ],
      },
    ],
    completionMessage: "Good. Normal vitals: pulse 60–100, resp 12–20, temp 97–99°F. Report any change from baseline. I&O: report urine below 30 mL/hr.",
    nextRecommendedLessonIds: ["bnc-hygiene-skin-care", "bnc-elimination-catheter"],
  },

  {
    id: "bnc-hygiene-skin-care",
    slug: "bnc-hygiene-skin-care",
    title: "Personal Hygiene and Skin Care",
    domainSlug: "basic-nursing-care",
    domainTitle: "Basic Nursing Care",
    summary: "Master perineal care, oral hygiene, and skin inspection as CNA exam priorities.",
    learningGoal: "Perform safe, dignified personal hygiene care and identify early skin changes that indicate risk.",
    estimatedMinutes: 25,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "bnc-perineal-care",
        title: "Perineal care technique",
        concept:
          "Perineal care prevents infection. For female residents, always wipe front to back to prevent fecal bacteria from entering the urethra. Use a clean area of the cloth for each stroke. For male residents with a catheter, clean from the meatus outward. Change gloves and wash hands before and after.",
        example:
          "During incontinent care for a female resident, the aide uses a separate clean section of the washcloth for each front-to-back stroke to prevent UTI.",
        question: "In which direction should the CNA wipe during perineal care for a female resident, and why?",
        idealAnswer: "Front to back — this prevents fecal bacteria from being dragged toward the urethra and causing a urinary tract infection.",
        memoryTip: "Front to back — always. Keeps bacteria away from the urethra.",
        correctExplanation: "Correct. Front to back is the infection-prevention principle for perineal care.",
        incorrectExplanation: "Perineal care for females must always go front to back. Back to front pulls bacteria toward the urethra and increases UTI risk.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "front to back", keywords: ["front to back", "forward", "anterior to posterior"] },
          { label: "prevents UTI", keywords: ["uti", "infection", "urethra", "bacteria"] },
        ],
      },
      {
        id: "bnc-oral-hygiene",
        title: "Oral hygiene and denture care",
        concept:
          "Oral hygiene prevents infection, aspiration pneumonia, and gum disease. Brush teeth or perform mouth care at least twice daily and after meals. For unconscious or dysphagic residents, use a small amount of water and position the head to the side to prevent aspiration. Dentures should be cleaned over a basin with water and stored in labeled containers with water when not in use.",
        example:
          "A resident on a thickened-liquid diet receives oral care with a foam swab to keep the mouth moist without aspiration risk.",
        question: "What is the correct position for providing oral care to a resident who cannot swallow safely?",
        idealAnswer: "Turn the head to the side or use a lateral position to allow fluid to drain out rather than be swallowed or aspirated.",
        memoryTip: "Head to the side for oral care — fluid drains away from the airway.",
        correctExplanation: "Yes. Lateral head position prevents aspiration during oral care.",
        incorrectExplanation: "For residents who cannot swallow safely, turn the head to the side so fluids do not enter the airway. Upright positions risk aspiration.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "head to the side", keywords: ["side", "lateral", "turn head", "tilt"] },
        ],
      },
      {
        id: "bnc-skin-inspection",
        title: "Skin inspection and pressure injury prevention",
        concept:
          "Pressure injuries (formerly called bedsores) form over bony prominences where pressure cuts off blood flow. The first sign is non-blanchable redness (Stage 1). Key prevention: reposition every two hours, keep skin clean and dry, use protective padding on heels and bony areas, and report any redness or skin changes to the nurse immediately.",
        example:
          "During morning care, the CNA notices a red area on the resident's coccyx that does not fade when pressed. They report it to the nurse immediately — this is a Stage 1 pressure injury.",
        question: "What is the first sign of a pressure injury, and what should the CNA do?",
        idealAnswer: "The first sign is redness over a bony area that does not go away (non-blanchable). The CNA should report it to the nurse immediately.",
        memoryTip: "Redness that stays = report immediately. Don't wait for a wound.",
        correctExplanation: "Yes. Non-blanchable redness is Stage 1 — catching it early prevents worsening.",
        incorrectExplanation: "The first sign is persistent redness (non-blanchable) over a bony area. Report it to the nurse right away — early intervention prevents the injury from progressing.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "non-blanchable redness", keywords: ["redness", "red", "non-blanch", "does not go away", "stays red"] },
          { label: "report to nurse", keywords: ["report", "nurse", "immediately", "right away"] },
        ],
      },
    ],
    completionMessage: "Key points: front to back for perineal care, head to the side for oral care in dysphagic residents, redness = report immediately.",
    nextRecommendedLessonIds: ["bnc-elimination-catheter"],
  },

  {
    id: "bnc-elimination-catheter",
    slug: "bnc-elimination-catheter",
    title: "Elimination and Catheter Care",
    domainSlug: "basic-nursing-care",
    domainTitle: "Basic Nursing Care",
    summary: "Understand urinary catheter care, bowel elimination, and incontinent care as written exam topics.",
    learningGoal: "State catheter care rules, recognize normal and abnormal elimination findings, and describe dignified incontinent care.",
    estimatedMinutes: 22,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "bnc-catheter-care",
        title: "Urinary catheter care",
        concept:
          "Catheter care prevents catheter-associated urinary tract infections (CAUTIs). The drainage bag must always be kept below the level of the bladder to prevent backflow. The tubing must not be kinked. Clean the perineal area and catheter tubing daily, wiping outward from the meatus. Report cloudy, dark, or foul-smelling urine, or complaints of pain.",
        example:
          "A resident's catheter bag is placed on the side rail above hip level. The CNA repositions the bag to hang below the bladder — backflow from the bag to the bladder can cause a UTI.",
        question: "Why must the catheter drainage bag always be kept below the level of the bladder?",
        idealAnswer: "If the bag is above the bladder, urine can flow back into the bladder, carrying bacteria and causing a urinary tract infection.",
        memoryTip: "Catheter bag: always below the bladder. Backflow = infection.",
        correctExplanation: "Correct. Gravity keeps urine flowing away from the bladder. Elevating the bag reverses this.",
        incorrectExplanation: "The drainage bag must stay below bladder level. If it rises above, urine flows back and carries bacteria into the bladder — causing a CAUTI.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "backflow risk", keywords: ["backflow", "flow back", "reverse", "return"] },
          { label: "infection prevention", keywords: ["infection", "uti", "bacteria", "cauti"] },
        ],
      },
      {
        id: "bnc-bowel-elimination",
        title: "Bowel elimination and constipation",
        concept:
          "Normal bowel patterns vary — the CNA should know each resident's typical pattern and report changes. Signs of constipation include infrequent, hard, dry stools and straining. Diarrhea (loose, frequent stools) can cause dehydration and skin breakdown. Report both to the nurse. Fluid intake, fiber, and activity promote normal bowel function.",
        example:
          "A resident who normally has a bowel movement daily has not had one in three days and is complaining of abdominal discomfort. The CNA documents this and reports it to the nurse.",
        question: "What signs of bowel problems should a CNA report to the nurse?",
        idealAnswer: "Report constipation (no stool for several days, hard stools, straining) and diarrhea (frequent loose stools). Also report blood in the stool or any pain.",
        memoryTip: "Report changes from the resident's normal bowel pattern — either direction.",
        correctExplanation: "Yes. Both constipation and diarrhea are reportable changes in bowel function.",
        incorrectExplanation: "Report any significant change: constipation (hard stool, no BM for days) or diarrhea (frequent loose stools). Blood in the stool is always reportable immediately.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "constipation signs", keywords: ["constipation", "no stool", "hard", "straining", "infrequent"] },
          { label: "diarrhea or blood", keywords: ["diarrhea", "loose", "frequent", "blood"] },
        ],
      },
      {
        id: "bnc-incontinent-care",
        title: "Incontinent care and dignity",
        concept:
          "Incontinence is common and never the resident's fault. The CNA provides incontinent care promptly and privately, keeping the resident clean and dry to prevent skin breakdown. The aide uses a calm, non-judgmental approach. Always use standard precautions: gloves, front-to-back wiping, and hand hygiene before and after.",
        example:
          "A resident is upset about being incontinent. The CNA responds matter-of-factly, maintains privacy, and reassures the resident without showing disgust or impatience.",
        question: "Why is prompt incontinent care essential beyond comfort?",
        idealAnswer: "Moisture and waste on the skin causes rapid skin breakdown and pressure injury. Prompt care keeps the skin intact.",
        memoryTip: "Incontinent = prompt, private, non-judgmental. Moisture destroys skin.",
        correctExplanation: "Yes. Skin integrity fails quickly when exposed to urine or stool — prompt care is a clinical priority.",
        incorrectExplanation: "Prompt incontinent care prevents moisture-associated skin damage. Urine and stool break down skin fast and can lead to pressure injuries.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "skin breakdown prevention", keywords: ["skin", "breakdown", "moisture", "pressure", "integrity"] },
          { label: "prompt care", keywords: ["prompt", "quickly", "right away", "immediate"] },
        ],
      },
    ],
    completionMessage: "Key rules: catheter bag always below bladder, report bowel changes, incontinent care is prompt and non-judgmental.",
    nextRecommendedLessonIds: [],
  },

  // ─── Promotion of Function and Health of Residents ────────────────────────────

  {
    id: "fh-adl-support",
    slug: "fh-adl-support",
    title: "Supporting Activities of Daily Living",
    domainSlug: "function-and-health",
    domainTitle: "Promotion of Function and Health of Residents",
    summary: "Understand how CNAs support independence in ADLs using the least-restrictive approach.",
    learningGoal: "Explain the role of the CNA in ADL support and identify when assistance crosses into doing too much.",
    estimatedMinutes: 22,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "fh-adl-role",
        title: "The CNA's role in ADL support",
        concept:
          "ADLs (activities of daily living) include bathing, dressing, grooming, eating, ambulating, and toileting. The CNA's role is to assist — not take over — unless the resident truly cannot perform the task. Doing too much reduces function and violates the resident's right to independence.",
        example:
          "A resident with arthritis can button their own shirt with extra time. The CNA should wait patiently and encourage, not just do it for them.",
        question: "What is the CNA's guiding principle when assisting with ADLs?",
        idealAnswer: "Assist only to the level the resident needs — encourage and support independence rather than taking over tasks the resident can do.",
        memoryTip: "ADL principle: assist, don't take over. Preserve independence.",
        correctExplanation: "Correct. Supporting independence is both a care philosophy and a resident right.",
        incorrectExplanation: "The CNA assists — not completes tasks for — the resident. Doing everything for a capable resident reduces function and dignity.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "assist not take over", keywords: ["assist", "help", "not take over", "not do for"] },
          { label: "preserve independence", keywords: ["independence", "function", "self-care", "capable"] },
        ],
      },
      {
        id: "fh-adaptive-equipment",
        title: "Adaptive equipment",
        concept:
          "Adaptive equipment helps residents perform ADLs more independently. Examples: long-handled reachers for dressing, built-up utensil handles for residents with grip weakness, plate guards to aid self-feeding, non-slip mats in the bathroom, and raised toilet seats. The CNA should know what equipment is prescribed and ensure it is available.",
        example:
          "A resident with a weak grip uses a built-up fork handle. The aide ensures it is at the tray before every meal so the resident can eat independently.",
        question: "Why is adaptive equipment important for residents with physical limitations?",
        idealAnswer: "Adaptive equipment allows residents to participate in their own care and remain as independent as possible despite physical limitations.",
        memoryTip: "Adaptive equipment = tools for independence. Know what's prescribed, have it ready.",
        correctExplanation: "Yes. Adaptive tools extend function — which is the goal of function-promotion care.",
        incorrectExplanation: "Adaptive equipment extends what a resident can do independently. The CNA must know what equipment is ordered and ensure it is available at the right time.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "supports independence", keywords: ["independent", "independence", "self", "own care"] },
          { label: "prescribed and available", keywords: ["prescribed", "ordered", "available", "ready", "have it"] },
        ],
      },
      {
        id: "fh-restorative-approach",
        title: "Restorative approach to ADL care",
        concept:
          "A restorative approach focuses on maintaining or improving function rather than doing tasks for the resident. This means giving extra time, using verbal cueing, hand-over-hand guidance, and providing encouragement. Even residents with limited ability should be supported to do as much as they can.",
        example:
          "A resident with moderate dementia can still wash their own face with hand-over-hand guidance. The aide holds the resident's hand and guides the motion rather than washing for them.",
        question: "What is the difference between a restorative approach and standard task completion?",
        idealAnswer: "A restorative approach focuses on the resident's participation and maintaining ability — not just completing the task efficiently. It uses cueing, guidance, and encouragement.",
        memoryTip: "Restorative = resident does as much as possible with your support.",
        correctExplanation: "Correct. Speed is not the goal in restorative care — function maintenance is.",
        incorrectExplanation: "Restorative care prioritizes the resident's participation and function preservation over efficiency. Cueing and guidance are the tools — not doing it for them.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "resident participation", keywords: ["participate", "resident does", "involvement", "cueing"] },
          { label: "function maintenance", keywords: ["function", "ability", "maintain", "preserve"] },
        ],
      },
    ],
    completionMessage: "Core idea: assist, don't take over. Adaptive equipment extends independence. Restorative care = resident participation over efficiency.",
    nextRecommendedLessonIds: ["fh-nutrition-hydration", "fh-sleep-comfort"],
  },

  {
    id: "fh-nutrition-hydration",
    slug: "fh-nutrition-hydration",
    title: "Nutrition and Hydration",
    domainSlug: "function-and-health",
    domainTitle: "Promotion of Function and Health of Residents",
    summary: "Learn special diets, mealtime assistance, and how to identify and report dehydration.",
    learningGoal: "Identify common therapeutic diets and recognize signs of malnutrition and dehydration.",
    estimatedMinutes: 22,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "fh-diet-types",
        title: "Therapeutic diet types",
        concept:
          "Common therapeutic diets CNAs must know: regular (no restrictions), low-sodium (for heart/fluid conditions), diabetic (controlled carbohydrates), low-fat (for cardiac or GI conditions), high-fiber (for constipation), and mechanical soft or pureed (for residents with chewing or swallowing difficulty). The CNA ensures the correct tray reaches the correct resident.",
        example:
          "A resident with heart failure is on a low-sodium diet. The CNA makes sure no extra salt packets reach the tray and reports if the resident adds salt.",
        question: "A resident has difficulty chewing due to missing teeth. Which diet type is most appropriate?",
        idealAnswer: "A mechanical soft diet, which is chopped or minced to reduce chewing while maintaining some texture.",
        memoryTip: "Chewing difficulty = mechanical soft. Swallowing difficulty = pureed or thickened liquids.",
        correctExplanation: "Correct. Mechanical soft reduces chewing while preserving some texture.",
        incorrectExplanation: "Chewing difficulty calls for a mechanical soft diet (chopped/minced food). Swallowing difficulty (dysphagia) requires pureed or thickened liquids.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "mechanical soft", keywords: ["mechanical soft", "chopped", "minced", "soft"] },
        ],
      },
      {
        id: "fh-mealtime-assistance",
        title: "Mealtime assistance",
        concept:
          "CNAs assist with meals by: ensuring correct tray and diet, positioning resident upright (at least 45–90 degrees), providing adaptive utensils, offering one food at a time for residents with swallowing difficulty, and documenting percentage of meal eaten. Sit at eye level when feeding. Never rush — slow eating reduces aspiration risk.",
        example:
          "When assisting a dysphagic resident with pureed food, the aide sits at eye level, offers small bites, waits for the resident to swallow fully before the next bite, and allows adequate time.",
        question: "What positioning is required for a resident during mealtime, and why?",
        idealAnswer: "The resident should be upright — at least 45 to 90 degrees — to reduce the risk of aspiration.",
        memoryTip: "Mealtime: upright 45–90 degrees. Never feed a flat resident.",
        correctExplanation: "Yes. Upright positioning uses gravity to move food away from the airway.",
        incorrectExplanation: "Residents must be upright (45–90 degrees) during meals. Reclined positioning significantly increases aspiration risk.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "upright position", keywords: ["upright", "45", "90", "sitting up", "elevated"] },
          { label: "aspiration prevention", keywords: ["aspiration", "airway", "choking", "swallowing"] },
        ],
      },
      {
        id: "fh-dehydration",
        title: "Dehydration signs and prevention",
        concept:
          "Dehydration is common in the elderly because thirst perception decreases with age. Signs include: dry mouth, dark concentrated urine, decreased urine output, confusion, dizziness, and skin tenting (skin that stays pinched when gently pulled). The CNA encourages fluid intake, offers fluids with every care interaction, and reports signs of dehydration to the nurse.",
        example:
          "A resident's urine is very dark and they seem more confused than usual. The CNA offers water and reports to the nurse — these are signs of dehydration.",
        question: "Name two signs of dehydration the CNA should report.",
        idealAnswer: "Dark concentrated urine, confusion, decreased urine output, dry mouth, dizziness, or skin tenting are all reportable signs of dehydration.",
        memoryTip: "Dehydration: dark urine + confusion + dry mouth + dizziness.",
        correctExplanation: "Yes. Multiple systems signal dehydration — the CNA's job is to recognize and report them.",
        incorrectExplanation: "Dehydration signs include dark urine, confusion, dry mouth, dizziness, and decreased output. Report any combination to the nurse.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "dark urine or decreased output", keywords: ["dark urine", "concentrated", "decreased output", "less urine"] },
          { label: "mental or physical sign", keywords: ["confusion", "dry mouth", "dizziness", "skin tenting"] },
        ],
      },
    ],
    completionMessage: "Key points: confirm correct diet tray, upright 45–90° for meals, report dehydration signs (dark urine, confusion, dry mouth).",
    nextRecommendedLessonIds: ["fh-sleep-comfort"],
  },

  {
    id: "fh-sleep-comfort",
    slug: "fh-sleep-comfort",
    title: "Sleep, Rest, Pain, and Comfort",
    domainSlug: "function-and-health",
    domainTitle: "Promotion of Function and Health of Residents",
    summary: "Understand how the CNA supports rest and comfort while recognizing and reporting pain.",
    learningGoal: "Describe the CNA's role in pain observation, reporting, and promoting restful sleep.",
    estimatedMinutes: 20,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "fh-pain-observation",
        title: "Observing and reporting pain",
        concept:
          "CNAs do not assess or treat pain — they observe and report. Pain signs include: verbal complaints, facial grimacing, guarding a body part, restlessness, moaning, decreased activity, or behavioral changes. Pain is the fifth vital sign. Use the resident's own words and report what you see and hear — not a diagnosis.",
        example:
          "A resident winces when turning and says 'my hip hurts.' The CNA reports: 'The resident stated his hip hurts when turning and I noticed him wincing.' The nurse then assesses.",
        question: "What is the CNA's role when a resident reports pain?",
        idealAnswer: "Report to the nurse immediately using objective description — what the resident said and what the aide observed. The CNA does not treat or assess pain.",
        memoryTip: "Pain: observe + report. Never assess, treat, or ignore.",
        correctExplanation: "Correct. Report and let the nurse assess and treat.",
        incorrectExplanation: "The CNA observes pain signs, reports them to the nurse using objective language, and does not treat or interpret pain. The nurse assesses.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "report to nurse", keywords: ["report", "nurse", "tell", "notify"] },
          { label: "objective description", keywords: ["objective", "what resident said", "observe", "describe"] },
        ],
      },
      {
        id: "fh-sleep-needs",
        title: "Sleep and rest needs of elderly residents",
        concept:
          "Older adults need 7–8 hours of sleep but may sleep lighter and wake more frequently. The CNA promotes rest by reducing noise and light during sleeping hours, avoiding unnecessary interruptions, scheduling care during waking hours when possible, and reporting sleep disturbances such as prolonged insomnia or excessive daytime sleeping to the nurse.",
        example:
          "A resident is awake most of the night and sleeping all day. The CNA reports this change to the nurse — it may signal depression, pain, medication effects, or another medical issue.",
        question: "What sleep disturbance should a CNA report to the nurse?",
        idealAnswer: "Prolonged insomnia, unusual daytime sleeping, or a significant change from the resident's normal sleep pattern should be reported.",
        memoryTip: "Sleep change from normal = report. Insomnia or excessive sleep both matter.",
        correctExplanation: "Correct. Changes in sleep pattern can signal underlying medical or emotional issues.",
        incorrectExplanation: "Report significant sleep changes — either prolonged insomnia or excessive daytime sleepiness. Both can indicate underlying problems.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "change from normal pattern", keywords: ["change", "normal", "unusual", "different", "insomnia", "sleeping all day"] },
        ],
      },
      {
        id: "fh-holistic-comfort",
        title: "Promoting holistic comfort",
        concept:
          "Comfort includes physical, emotional, social, and spiritual dimensions. The CNA promotes comfort by: providing quiet and privacy, offering conversation and presence, respecting preferences, maintaining a comfortable room temperature, ensuring proper positioning, and facilitating access to family, spiritual care, or activities. Holistic comfort is especially important near end of life.",
        example:
          "A resident near end of life is cold, anxious, and has not seen family in days. The aide provides warm blankets, sits quietly, and contacts the nurse about arranging a family visit.",
        question: "Give two examples of how a CNA promotes holistic comfort beyond physical care.",
        idealAnswer: "Sitting with and listening to the resident, facilitating family visits, maintaining a comfortable room environment, or supporting access to spiritual care.",
        memoryTip: "Holistic comfort: physical + emotional + social + spiritual.",
        correctExplanation: "Yes. Comfort is multidimensional — especially near end of life.",
        incorrectExplanation: "Holistic comfort includes emotional presence (listening, sitting with), social connection (family visits), and spiritual support — not just physical tasks.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "emotional presence", keywords: ["listen", "sit with", "presence", "talk", "emotional"] },
          { label: "social or spiritual", keywords: ["family", "spiritual", "chaplain", "social", "visit"] },
        ],
      },
    ],
    completionMessage: "Key: pain = observe and report (not treat). Sleep changes = report. Holistic comfort = physical + emotional + social + spiritual.",
    nextRecommendedLessonIds: [],
  },

  // ─── Promotion of Safety ─────────────────────────────────────────────────────

  {
    id: "ps-infection-control",
    slug: "ps-infection-control",
    title: "Infection Control: Hand Hygiene, PPE, and Precautions",
    domainSlug: "promotion-of-safety",
    domainTitle: "Promotion of Safety",
    summary: "Apply infection control principles that appear most often on the CNA written exam.",
    learningGoal: "Distinguish standard from transmission-based precautions and state the correct PPE for each.",
    estimatedMinutes: 25,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "ps-hand-hygiene",
        title: "Hand hygiene: soap vs. alcohol rub",
        concept:
          "Hand hygiene is the #1 method to prevent infection. Alcohol-based hand rub is effective on most pathogens but NOT appropriate when hands are visibly soiled or when a resident has C. difficile or norovirus — these require soap and water. Scrub with soap for at least 20 seconds, covering all surfaces of hands and wrists.",
        example:
          "After caring for a resident with C. diff, the CNA uses soap and water — not hand sanitizer — because C. diff spores are resistant to alcohol.",
        question: "When is soap and water required instead of alcohol-based hand rub?",
        idealAnswer: "When hands are visibly soiled, and after caring for residents with C. difficile or norovirus — because alcohol does not kill spores.",
        memoryTip: "Visibly dirty or C. diff/norovirus = soap and water only.",
        correctExplanation: "Correct. Spore-forming organisms are resistant to alcohol — soap and water mechanically remove them.",
        incorrectExplanation: "Soap and water is required when hands are visibly soiled and for C. diff/norovirus — alcohol cannot kill spores.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "visibly soiled", keywords: ["soiled", "dirty", "visible", "contaminated"] },
          { label: "c diff or norovirus", keywords: ["c diff", "c. diff", "clostridium", "norovirus", "spore"] },
        ],
      },
      {
        id: "ps-ppe-types",
        title: "PPE selection for each precaution type",
        concept:
          "Standard precautions: gloves when touching body fluids. Contact precautions: gown + gloves before entering. Droplet precautions: surgical mask within 3–6 feet. Airborne precautions: N95 respirator + negative pressure room. Don PPE in order: gown, mask, gloves. Remove (doff) in reverse: gloves, mask/goggles, gown.",
        example:
          "A resident has tuberculosis. The aide dons an N95 respirator before entering — not a surgical mask, because TB particles stay airborne for long distances.",
        question: "What PPE is required for a resident on airborne precautions, and why not a surgical mask?",
        idealAnswer: "An N95 respirator — it filters very small airborne particles. A surgical mask does not seal tightly enough to filter airborne pathogens like TB.",
        memoryTip: "Airborne = N95. Droplet = surgical mask. Contact = gown + gloves.",
        correctExplanation: "Correct. N95 respirators are fit-tested and filter particles surgical masks cannot.",
        incorrectExplanation: "Airborne pathogens (TB, measles, varicella) require an N95 respirator. Surgical masks have gaps that allow small particles through.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "N95 respirator", keywords: ["n95", "respirator", "fitted", "filtered"] },
          { label: "surgical mask insufficient", keywords: ["surgical mask", "not enough", "gaps", "not seal"] },
        ],
      },
      {
        id: "ps-donning-doffing",
        title: "Correct order for putting on and removing PPE",
        concept:
          "Don PPE in this order: gown → mask/respirator → goggles/face shield → gloves. Remove (doff) in the opposite order: gloves first (most contaminated), then goggles, then gown, then mask last (because the mask protects your face through removal). Perform hand hygiene after removing PPE.",
        example:
          "After completing contact-precaution care, the aide removes gloves by peeling from the outside, then unties the gown touching only the inside, then removes the mask by the ties without touching the front.",
        question: "What is removed first when doffing PPE, and why?",
        idealAnswer: "Gloves are removed first because they are the most contaminated item. Removing them first prevents the contaminated outer surface from touching the face or clean surfaces during removal of other PPE.",
        memoryTip: "Doff: gloves first (most contaminated) → goggles → gown → mask last.",
        correctExplanation: "Correct. Gloves first prevents contamination of the face during the rest of removal.",
        incorrectExplanation: "Remove gloves first when doffing — they are the most contaminated item. Removing mask last keeps it protecting the face throughout the process.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "gloves first", keywords: ["gloves first", "gloves removed first", "gloves off first"] },
          { label: "most contaminated", keywords: ["most contaminated", "outer surface", "contaminated first"] },
        ],
      },
    ],
    completionMessage: "Key: soap and water for C. diff/visible soil; N95 for airborne; doff gloves first. Don order: gown → mask → gloves.",
    nextRecommendedLessonIds: ["ps-fall-prevention-body-mechanics", "ps-fire-safety-hazmat"],
  },

  {
    id: "ps-fall-prevention-body-mechanics",
    slug: "ps-fall-prevention-body-mechanics",
    title: "Fall Prevention and Safe Body Mechanics",
    domainSlug: "promotion-of-safety",
    domainTitle: "Promotion of Safety",
    summary: "Apply fall risk reduction strategies and correct body mechanics to protect residents and yourself.",
    learningGoal: "Identify fall risk factors and describe correct technique for gait belt use and safe lifting.",
    estimatedMinutes: 22,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "ps-fall-risk-factors",
        title: "Fall risk factors and prevention",
        concept:
          "Fall risk factors include: age, weak muscles, history of prior falls, poor vision, confusion, medications that cause dizziness, wet floors, poor lighting, inappropriate footwear, and use of assistive devices without training. Prevention strategies include: keeping call lights within reach, clearing clutter, non-skid footwear, bed in lowest position, and responding to call lights promptly.",
        example:
          "A resident on a blood pressure medication that causes dizziness gets up quickly without calling for help. The CNA ensures the call light is within reach, bed is low, and educates the resident to call before rising.",
        question: "Name two strategies a CNA uses to reduce fall risk.",
        idealAnswer: "Keeping the call light within reach, positioning the bed in the lowest position, ensuring non-skid footwear, responding promptly to call lights, and keeping the environment free of clutter.",
        memoryTip: "Fall prevention: call light in reach + bed low + non-skid shoes + no clutter.",
        correctExplanation: "Yes. Environmental and behavioral interventions together reduce fall risk.",
        incorrectExplanation: "Fall prevention includes call light within reach, bed in lowest position, non-skid footwear, prompt call light response, and clear pathways.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "call light accessible", keywords: ["call light", "within reach", "available"] },
          { label: "environment safety", keywords: ["bed low", "footwear", "clutter", "non-skid", "clear"] },
        ],
      },
      {
        id: "ps-gait-belt",
        title: "Gait belt use",
        concept:
          "A gait belt is applied snugly around the resident's waist over clothing, with room for two fingers underneath. The CNA grips the belt with an underhand grip during transfers. If a fall occurs and cannot be prevented, the CNA uses the belt to ease the resident to the floor, protecting the head — do not try to stop the fall by holding up the resident, as this injures both parties.",
        example:
          "A resident begins to fall during ambulation. The aide grips the gait belt, widens their stance, and guides the resident safely to the floor, cushioning the descent.",
        question: "How should a CNA position a gait belt on a resident?",
        idealAnswer: "Around the waist over clothing, snug enough to be secure but with room for two fingers underneath.",
        memoryTip: "Gait belt: waist, over clothing, two-finger rule.",
        correctExplanation: "Correct. The two-finger check confirms the belt is secure without being dangerously tight.",
        incorrectExplanation: "The gait belt goes around the waist over clothing. Two fingers should fit underneath — too loose is unsafe, too tight is harmful.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "waist over clothing", keywords: ["waist", "over clothing", "waistband"] },
          { label: "two finger space", keywords: ["two finger", "two-finger", "not too tight", "snug"] },
        ],
      },
      {
        id: "ps-body-mechanics",
        title: "Safe body mechanics",
        concept:
          "Body mechanics protect the CNA's back. Key principles: widen the base of support (feet shoulder-width apart), bend at the knees with a straight back, keep the load close to the body, avoid twisting — pivot the feet instead, and ask for help with heavy lifts. Back injuries from poor mechanics are among the most common CNA occupational injuries.",
        example:
          "When helping a resident sit up in bed, the CNA lowers the bed to working height, bends at the knees, keeps the resident close, and uses a draw sheet — avoiding bending at the waist.",
        question: "What are two key rules of safe body mechanics for a CNA?",
        idealAnswer: "Bend at the knees with a straight back, and keep the load close to your body. Also avoid twisting — pivot feet instead.",
        memoryTip: "Body mechanics: bend knees + straight back + load close + no twisting.",
        correctExplanation: "Correct. These mechanics protect the spine during every care task.",
        incorrectExplanation: "Safe body mechanics: bend at the knees (not the waist), keep load close, straight back, and pivot — never twist with weight in your arms.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "bend knees not waist", keywords: ["bend knees", "knees", "not waist", "straight back"] },
          { label: "no twisting", keywords: ["no twist", "pivot", "feet", "turn feet"] },
        ],
      },
    ],
    completionMessage: "Remember: call light in reach, bed low, non-skid shoes. Gait belt: waist, two-finger rule. Body mechanics: knees, not waist — no twisting.",
    nextRecommendedLessonIds: ["ps-fire-safety-hazmat"],
  },

  {
    id: "ps-fire-safety-hazmat",
    slug: "ps-fire-safety-hazmat",
    title: "Fire Safety, Oxygen, and Hazardous Materials",
    domainSlug: "promotion-of-safety",
    domainTitle: "Promotion of Safety",
    summary: "Apply RACE and PASS fire protocols and recognize oxygen and chemical safety rules.",
    learningGoal: "State the RACE and PASS protocols and identify safety rules for oxygen and hazardous materials.",
    estimatedMinutes: 20,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "ps-race-pass",
        title: "RACE and PASS fire safety",
        concept:
          "RACE is the fire response protocol: Rescue residents from immediate danger → Alarm (activate the fire alarm) → Contain (close doors to slow fire spread) → Extinguish or Evacuate. PASS is the extinguisher technique: Pull the pin → Aim at the base of the fire → Squeeze the handle → Sweep side to side. RACE is the priority — life safety before equipment.",
        example:
          "A CNA smells smoke in a resident's room. First: rescue the resident (RACE). Then pull the alarm. Then close the door. The extinguisher comes after life safety.",
        question: "What does each letter in RACE stand for?",
        idealAnswer: "Rescue, Alarm, Contain, Extinguish or Evacuate.",
        memoryTip: "RACE: Rescue → Alarm → Contain → Extinguish/Evacuate.",
        correctExplanation: "Correct. Rescue is always first — people before property.",
        incorrectExplanation: "RACE: Rescue residents first, then Alarm, then Contain (close doors), then Extinguish or Evacuate. Never fight the fire before ensuring human safety.",
        passThreshold: 4,
        acceptableConcepts: [
          { label: "R = Rescue", keywords: ["rescue"] },
          { label: "A = Alarm", keywords: ["alarm"] },
          { label: "C = Contain", keywords: ["contain", "close doors"] },
          { label: "E = Extinguish/Evacuate", keywords: ["extinguish", "evacuate"] },
        ],
      },
      {
        id: "ps-oxygen-safety",
        title: "Oxygen safety rules",
        concept:
          "Oxygen enriches the air and makes fires ignite more easily and burn hotter. When oxygen is in use: post 'No Smoking/No Open Flame' signs, eliminate all ignition sources, never use petroleum-based products (Vaseline, oil-based lip balm) near oxygen, avoid electric heating pads, and secure the tank to prevent falls. Report any oxygen flow rate changes to the nurse.",
        example:
          "A resident on supplemental oxygen wants to use petroleum jelly on their lips. The CNA provides a water-based moisturizer instead and explains that petroleum products are hazardous near oxygen.",
        question: "Why are petroleum-based products like Vaseline dangerous near oxygen?",
        idealAnswer: "Petroleum products are flammable and can ignite easily in an oxygen-enriched environment, causing or worsening a fire.",
        memoryTip: "Oxygen + petroleum = fire hazard. Use water-based products only.",
        correctExplanation: "Correct. Petroleum is flammable and reacts dangerously with oxygen.",
        incorrectExplanation: "Petroleum-based products are flammable. Near oxygen, they can ignite from a small spark. Always use water-based alternatives.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "petroleum is flammable", keywords: ["flammable", "ignite", "burn", "fire"] },
          { label: "oxygen environment risk", keywords: ["oxygen", "oxygen-rich", "enriched", "combustion"] },
        ],
      },
      {
        id: "ps-hazmat-sharps",
        title: "Sharps safety and hazardous materials",
        concept:
          "Used sharps (needles, lancets) must be placed in puncture-resistant sharps containers immediately after use — never recapped, bent, or placed in regular trash. Sharps containers are disposed of when three-quarters full per biohazard protocol. Safety data sheets (SDS) must be available for every hazardous chemical in the workplace under OSHA's Hazard Communication Standard.",
        example:
          "A CNA sees a needle left on the counter after a nurse's procedure. The CNA does not pick it up bare-handed — they notify the nurse to dispose of it in the sharps container.",
        question: "What must be done with a used needle immediately after use?",
        idealAnswer: "Place it immediately in a puncture-resistant sharps container — do not recap or dispose of it in regular trash.",
        memoryTip: "Sharps: straight to the container. No recapping. No regular trash.",
        correctExplanation: "Correct. Immediate sharps disposal prevents needlestick injuries.",
        incorrectExplanation: "Used sharps go directly into sharps containers. Recapping, bending, or trashing them in regular bags causes needlestick injuries.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "sharps container immediately", keywords: ["sharps container", "immediately", "right away", "puncture-resistant"] },
          { label: "no recapping or regular trash", keywords: ["no recap", "do not recap", "not regular trash", "biohazard"] },
        ],
      },
    ],
    completionMessage: "RACE: Rescue → Alarm → Contain → Extinguish. PASS: Pull, Aim, Squeeze, Sweep. Oxygen: no flames, no petroleum. Sharps: container immediately.",
    nextRecommendedLessonIds: [],
  },

  // ─── Legal and Ethical Issues ─────────────────────────────────────────────────

  {
    id: "le-resident-rights-obra",
    slug: "le-resident-rights-obra",
    title: "Resident Rights Under OBRA",
    domainSlug: "legal-ethical",
    domainTitle: "Legal and Ethical Issues",
    summary: "Understand the resident rights guaranteed by OBRA and how CNAs uphold them daily.",
    learningGoal: "State key OBRA resident rights and identify CNA actions that protect or violate those rights.",
    estimatedMinutes: 22,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "le-core-rights",
        title: "Core OBRA resident rights",
        concept:
          "OBRA guaranteed residents of certified nursing facilities the following rights: to be free from abuse and neglect, to privacy and dignity, to make decisions about their own care, to refuse treatment, to know their diagnosis and care plan, to voice grievances, to manage their own finances, and to be free from unnecessary physical or chemical restraints.",
        example:
          "A CNA closes the curtain during personal care without being asked — this protects the resident's right to privacy and dignity.",
        question: "Name two rights guaranteed to nursing home residents under OBRA.",
        idealAnswer: "The right to be free from abuse and neglect, and the right to privacy and dignity. Also: the right to refuse treatment, make care decisions, and voice grievances.",
        memoryTip: "OBRA rights: free from abuse, privacy, dignity, refuse treatment, voice concerns.",
        correctExplanation: "Correct. These rights form the legal foundation of resident-centered care.",
        incorrectExplanation: "OBRA rights include: freedom from abuse/neglect, privacy, dignity, informed consent, right to refuse, and the ability to voice grievances.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "free from abuse and neglect", keywords: ["abuse", "neglect", "free from"] },
          { label: "privacy dignity or decisions", keywords: ["privacy", "dignity", "refuse", "decision", "grievance"] },
        ],
      },
      {
        id: "le-right-to-refuse",
        title: "Right to refuse and informed consent",
        concept:
          "A competent resident has the legal right to refuse any treatment or care, including bathing, medication, or procedures. The CNA must respect the refusal, document it, and notify the nurse. Informed consent means the resident receives enough information about risks, benefits, and alternatives to make a meaningful decision. CNAs do not obtain informed consent — nurses and physicians do.",
        example:
          "A resident refuses their morning bath. The CNA documents the refusal and tells the nurse — they do not force the care.",
        question: "A resident refuses care. What should the CNA do?",
        idealAnswer: "Respect the refusal, document it accurately, and notify the nurse so care can be rescheduled or an alternate plan made.",
        memoryTip: "Refusal: respect it, document it, notify the nurse.",
        correctExplanation: "Correct. Forcing care on a refusing resident is battery.",
        incorrectExplanation: "A competent resident's refusal must be honored. The CNA documents and reports — never forces care.",
        passThreshold: 3,
        acceptableConcepts: [
          { label: "respect the refusal", keywords: ["respect", "honor", "accept", "do not force"] },
          { label: "document", keywords: ["document", "chart", "record", "write"] },
          { label: "notify the nurse", keywords: ["nurse", "notify", "tell", "report"] },
        ],
      },
      {
        id: "le-hipaa-privacy",
        title: "Privacy, confidentiality, and HIPAA",
        concept:
          "HIPAA protects residents' personal health information from being shared without consent. CNAs must: discuss resident information only with authorized team members and only in private areas, never post resident photos or information online, not speak about residents in hallways, elevators, or public spaces, and treat all resident information as confidential.",
        example:
          "A CNA tells their spouse about a resident's diagnosis over dinner. This is a HIPAA violation — even without using the resident's name.",
        question: "A coworker mentions a resident's diagnosis in the elevator. What is the problem?",
        idealAnswer: "This is a HIPAA violation. Resident information must only be discussed with authorized team members in private care settings — not in public areas.",
        memoryTip: "HIPAA: resident information stays in the care team and private spaces only.",
        correctExplanation: "Correct. Public spaces are never appropriate for resident information discussions.",
        incorrectExplanation: "HIPAA requires confidentiality. Elevators, hallways, and non-private spaces are HIPAA violations even when no names are used.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "HIPAA violation", keywords: ["hipaa", "violation", "private", "confidential"] },
          { label: "public space is inappropriate", keywords: ["public", "elevator", "hallway", "private area", "private space"] },
        ],
      },
    ],
    completionMessage: "Core rights: free from abuse, privacy, dignity, refusal, informed consent. Refusal: respect + document + notify. HIPAA: private spaces only.",
    nextRecommendedLessonIds: ["le-abuse-neglect-reporting", "le-legal-concepts"],
  },

  {
    id: "le-abuse-neglect-reporting",
    slug: "le-abuse-neglect-reporting",
    title: "Abuse, Neglect, and Mandatory Reporting",
    domainSlug: "legal-ethical",
    domainTitle: "Legal and Ethical Issues",
    summary: "Identify all types of resident abuse and neglect and apply mandatory reporting obligations.",
    learningGoal: "Define the types of abuse and neglect and state when and how a CNA must report suspicions.",
    estimatedMinutes: 25,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "le-types-of-abuse",
        title: "Types of abuse and neglect",
        concept:
          "Types of abuse: physical (hitting, restraining without order), verbal/emotional (threats, humiliation, ignoring as punishment), sexual (any unwanted sexual contact), financial (stealing, manipulating finances), neglect (failing to provide necessary care — food, hygiene, safety, medications). Abandonment (leaving a resident who needs care) is also a form of neglect.",
        example:
          "A CNA threatens to withhold a resident's favorite TV show if they do not cooperate with care. This is emotional abuse — using a privilege as a threat.",
        question: "What is the difference between physical abuse and neglect?",
        idealAnswer: "Physical abuse is intentional harmful touching. Neglect is the failure to provide necessary care — it does not have to be intentional.",
        memoryTip: "Abuse = intentional harm. Neglect = failure to provide care (may be unintentional).",
        correctExplanation: "Correct. Neglect does not require intent — it is defined by the omission of necessary care.",
        incorrectExplanation: "Physical abuse is an intentional harmful act. Neglect is failing to provide necessary care — it is defined by what was omitted, not by intent.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "physical abuse is intentional", keywords: ["intentional", "hitting", "harmful", "touching"] },
          { label: "neglect is an omission", keywords: ["neglect", "omission", "fail", "not providing", "failure"] },
        ],
      },
      {
        id: "le-mandatory-reporting",
        title: "Mandatory reporting obligations",
        concept:
          "CNAs are mandated reporters — they must report any suspicion of abuse, neglect, or exploitation immediately to the charge nurse and, as required by state law, to the state agency (adult protective services or the state survey agency). Proof is not required — suspicion alone is enough. Failure to report is a legal violation. Retaliation against a reporter is prohibited.",
        example:
          "A CNA notices a resident has bruising in an unusual location and is fearful around one staff member. Even without seeing anything happen, the CNA must report this suspicion to the charge nurse immediately.",
        question: "Does a CNA need proof of abuse before reporting a suspicion?",
        idealAnswer: "No. Suspicion alone is sufficient to trigger the mandatory reporting obligation. The CNA reports immediately — the investigation is for designated investigators, not the aide.",
        memoryTip: "Suspicion alone = report. No proof needed. Failure to report is illegal.",
        correctExplanation: "Correct. Waiting for proof delays protection and violates the reporting obligation.",
        incorrectExplanation: "Mandatory reporters must report on suspicion alone. Investigating is not the CNA's role — reporting is.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "suspicion alone is enough", keywords: ["suspicion", "suspect", "no proof", "not need proof"] },
          { label: "report immediately", keywords: ["immediately", "right away", "report now", "notify"] },
        ],
      },
      {
        id: "le-protecting-resident",
        title: "Protecting the resident and yourself",
        concept:
          "If the CNA witnesses abuse, they must intervene to stop it if safe to do so (e.g., speaking up) and then report. If the abuser is a coworker, do not confront them alone. Never join in abusive behavior, even if coerced. The CNA is not responsible for investigating — only for reporting. Retaliation against reporters is illegal, and reporters are protected by law.",
        example:
          "A coworker is rough with a resident during repositioning and says 'this one doesn't notice.' The CNA interrupts and reports to the charge nurse immediately — not after the shift.",
        question: "If a CNA witnesses a coworker abusing a resident, what are the correct immediate steps?",
        idealAnswer: "Intervene to stop the abuse if it is safe to do so, then report it to the charge nurse immediately. Do not confront the coworker alone or wait until the end of the shift.",
        memoryTip: "Witness: stop if safe, report immediately to the nurse. Don't confront alone.",
        correctExplanation: "Correct. Stopping and reporting immediately is the CNA's obligation.",
        incorrectExplanation: "Witnessed abuse: intervene if safe, then immediately report to the nurse. Don't confront the coworker alone, don't wait, and don't ignore it.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "intervene if safe", keywords: ["intervene", "stop", "speak up", "safe to do so"] },
          { label: "report immediately to nurse", keywords: ["report", "nurse", "immediately", "charge nurse"] },
        ],
      },
    ],
    completionMessage: "Types of abuse: physical, verbal, sexual, financial, neglect. Report on suspicion — no proof required. Witness: stop if safe, report immediately.",
    nextRecommendedLessonIds: ["le-legal-concepts"],
  },

  {
    id: "le-legal-concepts",
    slug: "le-legal-concepts",
    title: "Legal Concepts: Negligence, Restraints, and Advance Directives",
    domainSlug: "legal-ethical",
    domainTitle: "Legal and Ethical Issues",
    summary: "Understand the legal terms most tested on the CNA written exam and apply them to scenarios.",
    learningGoal: "Define negligence, assault, battery, and false imprisonment, and describe advance directive types.",
    estimatedMinutes: 22,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "le-negligence-assault-battery",
        title: "Negligence, assault, and battery",
        concept:
          "Negligence: failure to provide care a reasonable person would provide — e.g., leaving a call light out of reach. Assault: intentional threat that causes fear of harm — e.g., threatening to restrain a resident. Battery: intentional harmful or offensive touching without consent — e.g., forcing a procedure the resident refused. Malpractice is professional negligence by licensed staff.",
        example:
          "A CNA says 'If you don't cooperate, I'll tie your hands down.' This is assault — the threat alone constitutes the legal violation even if no restraint is applied.",
        question: "What is the legal difference between assault and battery?",
        idealAnswer: "Assault is the threat of harm that causes fear. Battery is the actual harmful or offensive touching without consent.",
        memoryTip: "Assault = threat. Battery = touch without consent.",
        correctExplanation: "Correct. Assault is the fear — battery is the act.",
        incorrectExplanation: "Assault is a threat (fear of touching). Battery is the actual unauthorized touching. Both are illegal in resident care.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "assault is threat", keywords: ["assault", "threat", "fear", "cause fear"] },
          { label: "battery is touching", keywords: ["battery", "touch", "touching", "without consent"] },
        ],
      },
      {
        id: "le-restraints",
        title: "Restraints and false imprisonment",
        concept:
          "Physical restraints are devices that limit the resident's movement and require a physician's order and resident/surrogate consent. The CNA must check restrained residents every 30 minutes, release them every two hours for repositioning, exercise, and toileting, and document each check. False imprisonment is holding a resident against their will without legal authority — including restraining without an order.",
        example:
          "A CNA raises all four side rails on a confused resident 'to be safe' without an order. This is an unauthorized restraint — a form of false imprisonment.",
        question: "What must be in place before a CNA applies a physical restraint?",
        idealAnswer: "A physician's order and the resident's or surrogate's informed consent are both required before applying any restraint.",
        memoryTip: "Restraints need: physician order + consent. Check every 30 min, release every 2 hrs.",
        correctExplanation: "Correct. No order = no restraint. Unauthorized restraint = false imprisonment.",
        incorrectExplanation: "Restraints require a physician's order AND consent. Without both, applying any restraint is false imprisonment.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "physician order", keywords: ["physician", "doctor", "order", "ordered"] },
          { label: "consent required", keywords: ["consent", "permission", "agree", "surrogate"] },
        ],
      },
      {
        id: "le-advance-directives",
        title: "Advance directives and DNR orders",
        concept:
          "Advance directives are legal documents expressing a resident's health care wishes. A living will states preferences for life-sustaining treatments. A durable power of attorney for health care designates a decision-maker. A DNR (Do Not Resuscitate) order means no CPR if the heart or breathing stops. The CNA must know each resident's code status and follow it — never start CPR on a DNR resident.",
        example:
          "A resident with a DNR stops breathing. The CNA stays with the resident, provides comfort, and calls for the nurse — they do not start CPR.",
        question: "What does a DNR order mean, and what should the CNA do if the resident stops breathing?",
        idealAnswer: "A DNR means the resident has chosen not to receive CPR. If they stop breathing, the CNA stays with the resident, provides comfort, and immediately notifies the nurse — no CPR is started.",
        memoryTip: "DNR = no CPR. Stay, comfort, call the nurse.",
        correctExplanation: "Correct. Respecting a DNR is a legal and ethical obligation.",
        incorrectExplanation: "DNR = no CPR or resuscitation. The CNA stays with the resident and notifies the nurse. Starting CPR on a DNR resident violates the resident's advance directive.",
        passThreshold: 3,
        acceptableConcepts: [
          { label: "no CPR", keywords: ["no cpr", "do not resuscitate", "no resuscitation"] },
          { label: "stay and comfort", keywords: ["stay", "comfort", "remain", "with resident"] },
          { label: "notify nurse", keywords: ["notify", "nurse", "call", "report"] },
        ],
      },
    ],
    completionMessage: "Negligence = omission. Assault = threat. Battery = touching without consent. Restraints = order + consent. DNR = no CPR, stay, notify nurse.",
    nextRecommendedLessonIds: [],
  },

  // ─── Emotional and Mental Health Needs ───────────────────────────────────────

  {
    id: "em-emotional-world",
    slug: "em-emotional-world",
    title: "Understanding the Resident's Emotional World",
    domainSlug: "emotional-mental-health",
    domainTitle: "Emotional and Mental Health Needs",
    summary: "Recognize emotional needs, depression, anxiety, and therapeutic communication in the care setting.",
    learningGoal: "Apply Maslow's hierarchy and identify signs of depression and anxiety to support appropriate reporting.",
    estimatedMinutes: 22,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "em-maslow",
        title: "Maslow's hierarchy of needs",
        concept:
          "Maslow's hierarchy lists human needs from most basic to highest: (1) Physiological — food, water, sleep, warmth; (2) Safety — security, stability; (3) Love/Belonging — relationships, social connection; (4) Esteem — respect, accomplishment; (5) Self-actualization — reaching full potential. Lower levels must be met before higher levels can be addressed. CNAs primarily work in the first two levels.",
        example:
          "A resident cannot focus on socializing because they are in pain and hungry. The CNA first ensures physical needs (food, pain report) are addressed before engaging socially.",
        question: "According to Maslow, which level of need must be met before a resident can focus on social belonging?",
        idealAnswer: "Physiological needs (food, water, warmth, sleep) and safety must be met before belonging and social needs can be meaningfully addressed.",
        memoryTip: "Maslow: physiological → safety → belonging → esteem → self-actualization.",
        correctExplanation: "Correct. The physical foundation must be in place before emotional or social needs can be fully addressed.",
        incorrectExplanation: "Maslow's hierarchy: physiological first, then safety — these must be met before social needs matter. CNA care starts at the bottom.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "physiological first", keywords: ["physiological", "food", "water", "sleep", "warmth", "basic"] },
          { label: "then safety", keywords: ["safety", "security", "stable"] },
        ],
      },
      {
        id: "em-depression-anxiety",
        title: "Signs of depression and anxiety",
        concept:
          "Depression signs in elderly residents: withdrawal from activities, persistent sadness, changes in appetite or sleep, tearfulness, statements of hopelessness, or loss of interest. Anxiety signs: restlessness, excessive worry, rapid breathing, trembling, or irritability. Both must be reported to the nurse. Statements about death, hopelessness, or suicidal thoughts require immediate reporting.",
        example:
          "A resident who used to love bingo now refuses to go and has not eaten well in four days. The CNA reports these observations to the nurse — they may indicate depression.",
        question: "Name two signs of depression the CNA should report.",
        idealAnswer: "Withdrawal from activities, persistent sadness, changes in appetite or sleep, hopelessness, or tearfulness. Any statement about death or hopelessness is an immediate report.",
        memoryTip: "Depression: withdrawal + sadness + appetite/sleep changes. Hopelessness = report NOW.",
        correctExplanation: "Yes. CNAs are positioned to notice behavioral changes before others.",
        incorrectExplanation: "Depression signs: withdrawal, persistent sadness, appetite or sleep changes. Statements of hopelessness or suicidal thoughts are immediate-report items.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "withdrawal or sadness", keywords: ["withdrawal", "sad", "crying", "tearful", "refuse activities"] },
          { label: "appetite sleep or hopelessness", keywords: ["appetite", "sleep", "hopeless", "death", "not eating"] },
        ],
      },
      {
        id: "em-therapeutic-communication",
        title: "Therapeutic communication",
        concept:
          "Therapeutic communication helps residents feel heard and supported. Techniques include: active listening (eye contact, nodding), open-ended questions ('How are you feeling today?'), reflecting ('It sounds like you are worried'), silence (allowing the resident to speak), and empathy (acknowledging feelings without judgment). Non-therapeutic responses include: false reassurance, changing the subject, arguing, and dismissing feelings.",
        example:
          "A resident says 'I feel like a burden to everyone.' A therapeutic response: 'It sounds like you are feeling that way — can you tell me more?' Not: 'Oh, don't say that!'",
        question: "What makes a response 'therapeutic' when a resident expresses a difficult emotion?",
        idealAnswer: "A therapeutic response acknowledges the feeling without dismissing or fixing it — using active listening, open-ended questions, or empathy.",
        memoryTip: "Therapeutic: acknowledge feelings. Non-therapeutic: dismiss, fix, or change the subject.",
        correctExplanation: "Correct. Acknowledgment of feelings without judgment is the core of therapeutic communication.",
        incorrectExplanation: "Therapeutic communication acknowledges feelings rather than dismissing, arguing, or giving false reassurance. The goal is to let the resident feel heard.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "acknowledge feelings", keywords: ["acknowledge", "feelings", "heard", "empathy", "validate"] },
          { label: "active listening techniques", keywords: ["active listening", "open-ended", "reflect", "eye contact", "silence"] },
        ],
      },
    ],
    completionMessage: "Maslow: physical first. Depression: withdrawal + sadness + appetite/sleep changes. Therapeutic: acknowledge feelings — don't dismiss or fix.",
    nextRecommendedLessonIds: ["em-grief-loss-end-of-life", "em-mental-health-conditions"],
  },

  {
    id: "em-grief-loss-end-of-life",
    slug: "em-grief-loss-end-of-life",
    title: "Grief, Loss, and End-of-Life Care",
    domainSlug: "emotional-mental-health",
    domainTitle: "Emotional and Mental Health Needs",
    summary: "Apply Kübler-Ross grief stages and support dying residents with dignity and presence.",
    learningGoal: "Name the five Kübler-Ross grief stages and describe the CNA's role in end-of-life support.",
    estimatedMinutes: 22,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "em-kubler-ross",
        title: "Kübler-Ross five stages of grief",
        concept:
          "The five stages of grief (Kübler-Ross): (1) Denial — disbelief, 'This can't be happening'; (2) Anger — frustration, blame; (3) Bargaining — 'I'll do anything if...'; (4) Depression — sadness, withdrawal; (5) Acceptance — coming to terms, finding peace. Stages are not linear — residents may move between them. All stages are normal.",
        example:
          "A resident with a new terminal diagnosis snaps at every staff member. The CNA recognizes this as the anger stage of grief and responds with patience rather than defensiveness.",
        question: "A resident says 'If I just do everything the doctor says, maybe I can get better.' Which grief stage is this?",
        idealAnswer: "Bargaining — the resident is making a deal or conditional promise in exchange for a different outcome.",
        memoryTip: "'If I just...' = bargaining. 'This isn't real' = denial. Calm, peaceful = acceptance.",
        correctExplanation: "Correct. Bargaining is characterized by conditional deals or promises aimed at changing the outcome.",
        incorrectExplanation: "Bargaining is marked by 'if-then' thinking — making promises or deals to change the prognosis. 'If I do everything right, maybe I'll get better' is classic bargaining.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "bargaining stage", keywords: ["bargaining", "bargain", "deal", "if", "maybe"] },
        ],
      },
      {
        id: "em-end-of-life-support",
        title: "Supporting the dying resident",
        concept:
          "CNAs support dying residents by: staying present and listening, providing comfort care (positioning, oral hygiene, clean linen), responding to pain reports immediately, facilitating family visits, respecting spiritual and cultural wishes, and maintaining dignity. Hearing is the last sense to fade — speak kindly near unresponsive residents. Report changes in breathing, color, or consciousness immediately.",
        example:
          "A resident near death has not spoken in two days. The CNA still explains each care step aloud, provides gentle touch, and changes their position — because the resident may still hear and feel.",
        question: "Why should a CNA continue to speak gently and explain care to an unresponsive dying resident?",
        idealAnswer: "Hearing is the last sense to fade. An unresponsive resident may still hear and be comforted by a familiar, calm voice — it preserves dignity and connection.",
        memoryTip: "Hearing is the last to go. Keep speaking kindly to the unresponsive.",
        correctExplanation: "Correct. Communication and presence are care — even without a response.",
        incorrectExplanation: "Hearing fades last. Unresponsive residents may still hear and be comforted. Speaking kindly and explaining care maintains dignity.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "hearing lasts longest", keywords: ["hearing", "last sense", "still hear", "sense"] },
          { label: "dignity and comfort", keywords: ["dignity", "comfort", "calm", "presence"] },
        ],
      },
      {
        id: "em-spiritual-care",
        title: "Spiritual and cultural care at end of life",
        concept:
          "Spiritual and cultural needs are individualized. The CNA supports spiritual needs by: respecting each resident's beliefs without sharing their own, facilitating access to clergy or chaplains, honoring religious practices (prayer, rituals), respecting dietary or cultural practices, and notifying the nurse if spiritual distress is observed. The CNA never imposes personal beliefs.",
        example:
          "A resident who follows a specific faith tradition requests a chaplain before a procedure. The CNA notifies the nurse and facilitates the request — they do not share their own religious beliefs.",
        question: "How should a CNA respond when a dying resident expresses fear about the afterlife?",
        idealAnswer: "Listen without judgment, acknowledge the fear, and offer to connect the resident with a chaplain or spiritual care provider. Do not share personal beliefs.",
        memoryTip: "Spiritual distress: listen + validate + offer chaplain. Don't share your beliefs.",
        correctExplanation: "Yes. Facilitating access to spiritual resources is the CNA's role — not providing spiritual counseling.",
        incorrectExplanation: "The CNA listens empathetically, validates the fear, and offers to arrange chaplain or spiritual care. Imposing personal beliefs violates the resident's autonomy.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "listen and validate", keywords: ["listen", "acknowledge", "validate", "empathy"] },
          { label: "offer chaplain or spiritual care", keywords: ["chaplain", "spiritual", "clergy", "minister", "offer"] },
        ],
      },
    ],
    completionMessage: "Grief stages: Denial → Anger → Bargaining → Depression → Acceptance. End of life: hearing lasts longest. Spiritual: listen + offer chaplain, don't impose beliefs.",
    nextRecommendedLessonIds: ["em-mental-health-conditions"],
  },

  {
    id: "em-mental-health-conditions",
    slug: "em-mental-health-conditions",
    title: "Mental Health Conditions and Care Approaches",
    domainSlug: "emotional-mental-health",
    domainTitle: "Emotional and Mental Health Needs",
    summary: "Distinguish delirium from dementia and respond appropriately to behavioral symptoms.",
    learningGoal: "Compare delirium and dementia, and apply correct responses to hallucinations and behavioral changes.",
    estimatedMinutes: 22,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "em-delirium-vs-dementia",
        title: "Delirium vs. dementia",
        concept:
          "Delirium: sudden onset, fluctuating confusion, usually reversible (caused by infection, medication, dehydration, pain). Dementia: gradual onset, progressive, irreversible (caused by brain disease). A resident with dementia can also develop delirium — sudden worsening past their baseline is always reportable. The CNA does not diagnose but observes and reports changes.",
        example:
          "A resident with mild dementia suddenly becomes extremely confused, agitated, and does not recognize their aide. This is a sudden change — the CNA reports it as possible delirium, not just 'their dementia acting up.'",
        question: "What is the key difference in onset between delirium and dementia?",
        idealAnswer: "Delirium has a sudden onset and is often reversible. Dementia develops gradually and is irreversible.",
        memoryTip: "Delirium: sudden + reversible. Dementia: gradual + permanent.",
        correctExplanation: "Correct. Onset is the key distinguishing feature on the exam.",
        incorrectExplanation: "Delirium is sudden and reversible (treatable cause). Dementia is gradual and permanent. Sudden worsening in a dementia patient = possible delirium — report immediately.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "delirium is sudden and reversible", keywords: ["sudden", "acute", "reversible", "delirium"] },
          { label: "dementia is gradual and irreversible", keywords: ["gradual", "progressive", "irreversible", "dementia"] },
        ],
      },
      {
        id: "em-hallucinations-response",
        title: "Responding to hallucinations and delusions",
        concept:
          "When a resident experiences hallucinations (perceiving things not there) or delusions (false fixed beliefs), the CNA should: not agree with or reinforce the content, not argue or try to prove it is false, acknowledge the resident's feelings and distress, redirect gently, remain calm, and report to the nurse. Neither agreeing nor arguing is therapeutic.",
        example:
          "A resident insists there are spiders on the wall. The CNA does not say 'You're right' or 'That's silly.' Instead: 'That sounds frightening. Let me stay with you,' and then reports to the nurse.",
        question: "How should a CNA respond to a resident who is experiencing hallucinations?",
        idealAnswer: "Acknowledge the resident's distress without agreeing or arguing. Redirect gently, stay calm, and report to the nurse.",
        memoryTip: "Hallucinations: don't agree, don't argue. Acknowledge distress, redirect, report.",
        correctExplanation: "Correct. Calmness and acknowledgment are therapeutic; arguing or agreeing both escalate distress.",
        incorrectExplanation: "Do not agree with the hallucination (reinforces it) or argue about it (increases agitation). Acknowledge feelings, redirect, report to nurse.",
        passThreshold: 3,
        acceptableConcepts: [
          { label: "don't agree", keywords: ["don't agree", "not agree", "do not confirm", "not reinforce"] },
          { label: "don't argue", keywords: ["don't argue", "not argue", "do not argue", "no confrontation"] },
          { label: "acknowledge and redirect", keywords: ["acknowledge", "redirect", "distress", "calm", "gentle"] },
        ],
      },
      {
        id: "em-self-care-aide",
        title: "Compassion fatigue and aide self-care",
        concept:
          "Working with residents who have mental health challenges or are dying can cause compassion fatigue — emotional exhaustion from sustained caring. Signs: irritability, reduced empathy, dreading work, detachment. The CNA should use available supports: employee assistance programs, debriefs with supervisors, peer support, and appropriate boundaries. Seeking support is professional, not weak.",
        example:
          "After several residents on the unit have passed away in a week, an aide notices they feel numb and disconnected from residents. They speak to the charge nurse about accessing the employee assistance program.",
        question: "What is compassion fatigue, and what should a CNA do when they experience it?",
        idealAnswer: "Compassion fatigue is emotional exhaustion from sustained caregiving. The CNA should seek support through supervisors, peer support, or employee assistance programs — not suppress or ignore it.",
        memoryTip: "Compassion fatigue is real — seek support, don't suppress it.",
        correctExplanation: "Yes. Seeking support is both appropriate and professional.",
        incorrectExplanation: "Compassion fatigue is emotional exhaustion from caregiving. Aides should use available support resources — ignoring it leads to worse outcomes for both the aide and residents.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "emotional exhaustion from caregiving", keywords: ["exhaustion", "burnout", "caregiving", "emotional", "compassion fatigue"] },
          { label: "seek support", keywords: ["support", "eap", "supervisor", "peer", "resources"] },
        ],
      },
    ],
    completionMessage: "Delirium: sudden + reversible. Dementia: gradual + permanent. Hallucinations: don't agree, don't argue, acknowledge + redirect. Compassion fatigue: seek support.",
    nextRecommendedLessonIds: [],
  },

  // ─── Caring for Cognitively Impaired Residents ───────────────────────────────

  {
    id: "ci-alzheimers-basics",
    slug: "ci-alzheimers-basics",
    title: "Understanding Alzheimer's Disease",
    domainSlug: "cognitive-impairment",
    domainTitle: "Caring for Cognitively Impaired Residents",
    summary: "Understand Alzheimer's stages, communication techniques, and safe environment principles.",
    learningGoal: "Describe the three stages of Alzheimer's and apply appropriate communication and safety strategies.",
    estimatedMinutes: 25,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "ci-stages",
        title: "Stages of Alzheimer's disease",
        concept:
          "Alzheimer's progresses in three stages. Early stage: mild memory loss, difficulty with complex tasks, may still be independent in most ADLs. Middle stage: significant confusion, wandering, personality changes, needs help with most ADLs. Late stage: complete dependence for all ADLs, may lose ability to speak, loss of mobility, high risk of aspiration and infections.",
        example:
          "A resident in the late stage of Alzheimer's is nonverbal, cannot walk, and requires total assistance with eating and hygiene — the CNA provides full care while maintaining dignity.",
        question: "In which stage of Alzheimer's disease does a resident typically require total care for all ADLs?",
        idealAnswer: "The late stage — when the resident can no longer perform any ADLs independently, may be nonverbal, and is largely immobile.",
        memoryTip: "Late stage Alzheimer's = total care, nonverbal, immobile.",
        correctExplanation: "Correct. Late-stage Alzheimer's requires full care with maximum safety precautions.",
        incorrectExplanation: "Late-stage Alzheimer's is characterized by complete ADL dependence, loss of speech, and immobility. Total care is required.",
        passThreshold: 1,
        acceptableConcepts: [
          { label: "late stage", keywords: ["late", "late stage", "final", "third stage"] },
        ],
      },
      {
        id: "ci-communication-strategies",
        title: "Communication strategies for Alzheimer's",
        concept:
          "Effective communication with Alzheimer's residents: speak slowly in short, simple sentences; approach from the front; make eye contact at the resident's level; use the resident's name; give one instruction at a time; allow extra time to respond; use a calm, reassuring tone; and use nonverbal cues (gentle touch, facial expression). Avoid complex questions, rapid speech, and correcting the resident.",
        example:
          "Instead of asking 'Are you ready for your bath, shampoo, and then breakfast?' the CNA says 'Let's wash your face first' — one step at a time.",
        question: "Why are short, simple sentences more effective than complex ones when communicating with Alzheimer's residents?",
        idealAnswer: "Alzheimer's impairs the ability to process multiple pieces of information at once. Short, simple sentences reduce cognitive load and confusion.",
        memoryTip: "Alzheimer's communication: one step, short sentence, calm tone.",
        correctExplanation: "Correct. Cognitive overload leads to confusion and agitation.",
        incorrectExplanation: "Alzheimer's impairs information processing. Short, single-step sentences are less overwhelming and reduce the agitation caused by cognitive overload.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "impaired processing", keywords: ["impaired", "processing", "cognitive", "confusion", "too much"] },
          { label: "reduces confusion and agitation", keywords: ["reduce", "confusion", "agitation", "overwhelm", "simple"] },
        ],
      },
      {
        id: "ci-safety-environment",
        title: "Safety and environmental modifications",
        concept:
          "Safe environments for Alzheimer's residents: camouflage exit doors, use of secured units, remove fall hazards, label common areas with pictures, keep routines consistent, use night lights, store dangerous items out of reach, install door alarms, and ensure adequate supervision. Consistent routines reduce anxiety by making the environment predictable.",
        example:
          "A care unit paints exit doors the same color as surrounding walls and places a bookshelf in front of them — wandering residents are less likely to recognize them as exits.",
        question: "How does camouflaging exit doors reduce wandering risk in Alzheimer's residents?",
        idealAnswer: "Alzheimer's residents often wander toward visual exit cues — doors that look different from walls. Camouflage removes this trigger by making exits visually blend in.",
        memoryTip: "Exit camouflage: remove the visual cue that triggers door-seeking.",
        correctExplanation: "Correct. Wandering is triggered by visual cues — removing the cue reduces the behavior.",
        incorrectExplanation: "Alzheimer's residents respond to visual cues. Camouflaging exits removes the stimulus that triggers door-seeking behavior in wanderers.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "removes visual exit cue", keywords: ["visual cue", "cue", "trigger", "door cue", "no longer visible"] },
          { label: "reduces wandering behavior", keywords: ["wandering", "reduces", "less likely", "door-seeking"] },
        ],
      },
    ],
    completionMessage: "Alzheimer's stages: early (mild) → middle (confusion + wandering) → late (total care). Communication: short, simple, one step. Safety: consistent routine + camouflaged exits.",
    nextRecommendedLessonIds: ["ci-behavioral-symptoms", "ci-personalized-care"],
  },

  {
    id: "ci-behavioral-symptoms",
    slug: "ci-behavioral-symptoms",
    title: "Managing Behavioral Symptoms",
    domainSlug: "cognitive-impairment",
    domainTitle: "Caring for Cognitively Impaired Residents",
    summary: "Respond effectively to wandering, sundowning, and agitation using redirection and validation.",
    learningGoal: "Apply redirection, validation therapy, and de-escalation techniques to common dementia behaviors.",
    estimatedMinutes: 22,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "ci-wandering-redirection",
        title: "Wandering and redirection",
        concept:
          "Wandering is purposeful from the resident's perspective — they are trying to go somewhere meaningful. Do not block or restrain; instead, redirect using distraction (a snack, a familiar activity, or conversation) and gently guide away from exits. Never argue about whether the resident can leave. Report persistent wandering to the nurse so safety measures can be reviewed.",
        example:
          "A resident heads toward the front door saying she needs to pick up her children from school. The CNA says 'Let me show you something in the dining room — your friend Mary is there,' and guides her away from the exit.",
        question: "What is the most appropriate response when a resident with dementia tries to leave the building?",
        idealAnswer: "Redirect and distract — do not block or restrain. Guide the resident away using conversation, a familiar activity, or a snack. Never argue about whether they can leave.",
        memoryTip: "Wandering: redirect + distract. Don't block, don't argue.",
        correctExplanation: "Correct. Redirection preserves dignity and avoids the confrontation that escalates agitation.",
        incorrectExplanation: "Restraint and argument both increase agitation. Gentle redirection and distraction safely move the resident away from the exit.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "redirect and distract", keywords: ["redirect", "distract", "guide away", "distraction"] },
          { label: "no blocking or arguing", keywords: ["no block", "don't argue", "not restrain", "no restraint"] },
        ],
      },
      {
        id: "ci-sundowning",
        title: "Sundowning and agitation",
        concept:
          "Sundowning is increased confusion, agitation, or behavioral changes occurring in late afternoon and evening in residents with dementia. Triggers include: fatigue, hunger, low light, and disrupted routine. Management strategies: maintain consistent routines, increase afternoon activity, provide a calm environment with adequate light, reduce noise and stimulation, offer a snack, and use a calm reassuring tone.",
        example:
          "At 4 PM, a resident begins pacing and insisting she must go home to cook dinner. The CNA recognizes sundowning behavior, offers a light snack, turns on lights, and engages the resident in folding washcloths — a familiar activity.",
        question: "At what time of day does sundowning typically occur, and what is one effective management strategy?",
        idealAnswer: "Late afternoon and evening. Effective strategies include maintaining consistent routines, increasing lighting, offering a snack, reducing noise, and engaging in calming activities.",
        memoryTip: "Sundowning: late afternoon → calm routine, lights on, snack, familiar activity.",
        correctExplanation: "Yes. Multiple strategies address the triggers simultaneously.",
        incorrectExplanation: "Sundowning occurs in late afternoon/evening. Consistent routines, adequate lighting, reduced stimulation, snacks, and calming activities reduce the episode.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "late afternoon or evening", keywords: ["late afternoon", "evening", "afternoon", "4pm", "pm"] },
          { label: "management strategy", keywords: ["routine", "lights", "lighting", "snack", "activity", "calm", "reduce noise"] },
        ],
      },
      {
        id: "ci-validation-therapy",
        title: "Validation therapy",
        concept:
          "Validation therapy enters the resident's emotional reality rather than correcting it. Instead of saying 'Your husband died 10 years ago,' a validating response acknowledges the emotion behind the request. This reduces distress. Validation is most appropriate for moderate-to-severe dementia where reality orientation causes repeated grief. Reality orientation is more appropriate for early-stage or mild confusion.",
        example:
          "A resident asks for her deceased mother. A validating response: 'You're thinking of your mother — she must have been very important to you. Tell me about her.' This honors the emotion without confirming or denying the belief.",
        question: "When is validation therapy preferred over reality orientation for a resident with dementia?",
        idealAnswer: "When the resident has moderate-to-severe dementia and reality orientation causes repeated distress or grief — validation honors the feeling instead of correcting the belief.",
        memoryTip: "Validation = enter their reality. Reality orientation = mild confusion only.",
        correctExplanation: "Correct. In severe dementia, correcting the reality causes repeated grief — validation is more humane.",
        incorrectExplanation: "Validation therapy is preferred for moderate-to-severe dementia where reality orientation causes harm. For mild confusion, reality orientation (gentle reminders) may still help.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "moderate to severe dementia", keywords: ["moderate", "severe", "advanced", "moderate-to-severe"] },
          { label: "reality orientation causes distress", keywords: ["distress", "grief", "harm", "repeated grief", "cause sadness"] },
        ],
      },
    ],
    completionMessage: "Wandering: redirect + distract, no blocking. Sundowning: late afternoon, lights + routine + snack. Validation: enter their reality for moderate-severe dementia.",
    nextRecommendedLessonIds: ["ci-personalized-care"],
  },

  {
    id: "ci-personalized-care",
    slug: "ci-personalized-care",
    title: "Personalized Care for the Cognitively Impaired Resident",
    domainSlug: "cognitive-impairment",
    domainTitle: "Caring for Cognitively Impaired Residents",
    summary: "Apply individualized, dignity-preserving strategies for ADLs, activities, and late-stage care.",
    learningGoal: "Use person-centered approaches to support cognitively impaired residents through ADLs and meaningful activities.",
    estimatedMinutes: 22,
    defaultMode: "learn",
    supportedModes: ["learn", "quiz", "rapid_review", "weak_area_review"],
    segments: [
      {
        id: "ci-adl-step-by-step",
        title: "ADL assistance: one step at a time",
        concept:
          "Residents with dementia are overwhelmed by multiple instructions. For ADL assistance, break each task into single, simple steps and give them one at a time. Wait for the resident to complete each step before giving the next instruction. Use hand-over-hand guidance when needed. This approach maintains the resident's participation and dignity even in later stages.",
        example:
          "Instead of 'Go brush your teeth, wash your face, and get dressed,' the aide says 'Here is your toothbrush' and waits for the resident to brush before guiding the next step.",
        question: "Why are single-step instructions more effective for ADL care with residents who have dementia?",
        idealAnswer: "Dementia impairs the ability to process multiple steps at once. Single steps prevent cognitive overload, reduce frustration, and allow the resident to participate.",
        memoryTip: "One step at a time. Wait, then next step. Don't rush.",
        correctExplanation: "Correct. Single-step guidance maintains participation and reduces agitation.",
        incorrectExplanation: "Dementia impairs processing of multiple steps. One step at a time reduces confusion, maintains participation, and prevents the frustration that leads to behavioral symptoms.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "prevents cognitive overload", keywords: ["overload", "too much", "overwhelm", "multiple steps"] },
          { label: "maintains participation and dignity", keywords: ["participate", "involvement", "dignity", "independence"] },
        ],
      },
      {
        id: "ci-meaningful-activities",
        title: "Activities and meaningful engagement",
        concept:
          "Activities for cognitively impaired residents should match their remaining abilities, preferences, and past interests. Familiar, repetitive activities work well: folding laundry, simple puzzles, music from their era, sorting objects, or looking at family photos. Activities provide purpose, reduce boredom and agitation, and support remaining cognitive function.",
        example:
          "A former seamstress with moderate dementia enjoys sorting and folding fabric scraps. The activity is familiar and purposeful — it uses her retained skills and provides satisfaction.",
        question: "What type of activities are most appropriate for residents with moderate dementia, and why?",
        idealAnswer: "Familiar, repetitive activities aligned with the resident's past interests and current abilities — they provide purpose and use retained skills without overwhelming.",
        memoryTip: "Activities for dementia: familiar + repetitive + matches past interests.",
        correctExplanation: "Yes. Familiar activities tap into preserved long-term memory and skills.",
        incorrectExplanation: "Activities for dementia residents should be familiar, repetitive, and based on past interests and remaining abilities — not complex or new tasks that exceed current cognitive capacity.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "familiar and repetitive", keywords: ["familiar", "repetitive", "simple", "known"] },
          { label: "matches abilities and interests", keywords: ["interests", "past", "abilities", "retained", "skills"] },
        ],
      },
      {
        id: "ci-late-stage-care",
        title: "Late-stage dementia care",
        concept:
          "Late-stage dementia care focuses on comfort, dignity, and safety. The resident may be nonverbal and immobile. Key care: total ADL assistance, frequent repositioning (every 2 hours) to prevent pressure injuries, thickened liquids or pureed foods for dysphagia, oral hygiene to prevent infection, and maintaining skin integrity. Hearing remains — always speak kindly and explain each care step.",
        example:
          "A late-stage resident cannot respond but the CNA says 'Good morning, I'm here to wash your face — this will be warm' before starting care. Presence and verbal communication are maintained even without a response.",
        question: "Name two priority nursing care needs for a resident in late-stage dementia.",
        idealAnswer: "Repositioning every two hours to prevent pressure injuries and providing appropriate food texture (pureed/thickened liquids) for dysphagia are two critical late-stage needs.",
        memoryTip: "Late-stage dementia: reposition every 2 hrs, appropriate diet texture, speak kindly.",
        correctExplanation: "Yes. Skin integrity and safe nutrition are the highest physical care priorities in late-stage dementia.",
        incorrectExplanation: "Late-stage dementia requires repositioning every 2 hours (pressure injury prevention), appropriate diet texture (dysphagia management), and consistent oral hygiene.",
        passThreshold: 2,
        acceptableConcepts: [
          { label: "repositioning every two hours", keywords: ["reposition", "2 hours", "two hours", "pressure"] },
          { label: "diet texture or oral hygiene", keywords: ["pureed", "thickened", "dysphagia", "oral hygiene", "diet"] },
        ],
      },
    ],
    completionMessage: "ADL: one step at a time. Activities: familiar, repetitive, past interests. Late-stage: reposition every 2 hrs, pureed diet, speak kindly — hearing lasts.",
    nextRecommendedLessonIds: [],
  },
];
