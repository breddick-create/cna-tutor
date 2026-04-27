export type CnaClinicalSkillTimingBand = "short" | "moderate" | "long" | "extended";

export type CnaClinicalSkill = {
  slug: string;
  title: string;
  timingBand: CnaClinicalSkillTimingBand;
  focus: string;
  walkthroughChecklist: string[];
};

function buildChecklist(focus: string) {
  return [
    "Knock, greet the resident by name, introduce yourself, and explain the skill before you begin.",
    "Gather supplies, provide privacy, and use standard precautions with safe body mechanics.",
    focus,
    "Keep indirect care behaviors visible the whole time: communication, dignity, safety, and comfort checks.",
    "Before finishing, restore safety, place needed items within reach, lower the bed if appropriate, and wash hands.",
  ];
}

export const cnaClinicalSkills: CnaClinicalSkill[] = [
  {
    slug: "handwashing",
    title: "Handwashing",
    timingBand: "short",
    focus: "Perform the official handwashing sequence carefully and avoid recontaminating clean hands.",
    walkthroughChecklist: buildChecklist("Perform the official handwashing sequence carefully and avoid recontaminating clean hands."),
  },
  {
    slug: "ambulation-with-gait-belt",
    title: "Ambulate Resident Using a Transfer/Gait Belt",
    timingBand: "short",
    focus: "Secure the gait belt, pause after standing, ask about dizziness, and walk at the resident's pace with safety support.",
    walkthroughChecklist: buildChecklist("Secure the gait belt, pause after standing, ask about dizziness, and walk at the resident's pace with safety support."),
  },
  {
    slug: "bedpan",
    title: "Assist Resident Needing to Use a Bedpan",
    timingBand: "short",
    focus: "Protect privacy and dignity, position safely, and leave the resident with the call light when appropriate.",
    walkthroughChecklist: buildChecklist("Protect privacy and dignity, position safely, and leave the resident with the call light when appropriate."),
  },
  {
    slug: "change-occupied-bed",
    title: "Change Bed Linen While the Resident Remains in Bed",
    timingBand: "extended",
    focus: "Roll and reposition safely, keep the resident covered, and avoid dragging or unsafe body mechanics.",
    walkthroughChecklist: buildChecklist("Roll and reposition safely, keep the resident covered, and avoid dragging or unsafe body mechanics."),
  },
  {
    slug: "side-lying-position",
    title: "Change Resident's Position to a Supported Side-Lying Position",
    timingBand: "moderate",
    focus: "Use alignment and support devices correctly so the resident is comfortable and pressure is reduced.",
    walkthroughChecklist: buildChecklist("Use alignment and support devices correctly so the resident is comfortable and pressure is reduced."),
  },
  {
    slug: "dress-weak-arm",
    title: "Dress a Resident Who Has a Weak Arm",
    timingBand: "short",
    focus: "Dress the weak side first, undress the strong side first, and protect the weak arm throughout.",
    walkthroughChecklist: buildChecklist("Dress the weak side first, undress the strong side first, and protect the weak arm throughout."),
  },
  {
    slug: "measure-urine-output",
    title: "Empty Urinary Drainage Bag and Measure/Record Urine Output",
    timingBand: "moderate",
    focus: "Keep the drainage bag below the bladder, avoid contamination, measure accurately, and report or record correctly.",
    walkthroughChecklist: buildChecklist("Keep the drainage bag below the bladder, avoid contamination, measure accurately, and report or record correctly."),
  },
  {
    slug: "feeding",
    title: "Feed a Resident Who Is Sitting in a Chair",
    timingBand: "moderate",
    focus: "Confirm safe upright positioning, offer small bites, observe swallowing, and keep the meal respectful and calm.",
    walkthroughChecklist: buildChecklist("Confirm safe upright positioning, offer small bites, observe swallowing, and keep the meal respectful and calm."),
  },
  {
    slug: "radial-pulse",
    title: "Measure and Record Radial Pulse",
    timingBand: "short",
    focus: "Locate the radial pulse correctly, count accurately, and report or record the measurement exactly.",
    walkthroughChecklist: buildChecklist("Locate the radial pulse correctly, count accurately, and report or record the measurement exactly."),
  },
  {
    slug: "respirations",
    title: "Measure and Record Respirations",
    timingBand: "short",
    focus: "Count respirations discreetly, watch breathing quality, and record the final rate accurately.",
    walkthroughChecklist: buildChecklist("Count respirations discreetly, watch breathing quality, and record the final rate accurately."),
  },
  {
    slug: "female-catheter-care",
    title: "Provide Catheter Care to a Female Resident with an Indwelling Catheter",
    timingBand: "long",
    focus: "Clean from clean to dirty, protect the catheter tubing, and maintain privacy and infection control.",
    walkthroughChecklist: buildChecklist("Clean from clean to dirty, protect the catheter tubing, and maintain privacy and infection control."),
  },
  {
    slug: "foot-care",
    title: "Provide Foot Care to a Resident Sitting in a Chair",
    timingBand: "moderate",
    focus: "Use safe water temperature, clean and dry carefully, especially between toes, and observe for skin problems.",
    walkthroughChecklist: buildChecklist("Use safe water temperature, clean and dry carefully, especially between toes, and observe for skin problems."),
  },
  {
    slug: "mouth-care-dentures",
    title: "Provide Mouth Care for a Resident with Dentures",
    timingBand: "short",
    focus: "Handle dentures carefully, clean them correctly, and protect dignity and comfort during oral care.",
    walkthroughChecklist: buildChecklist("Handle dentures carefully, clean them correctly, and protect dignity and comfort during oral care."),
  },
  {
    slug: "mouth-care-teeth",
    title: "Provide Mouth Care for a Resident with Teeth",
    timingBand: "moderate",
    focus: "Brush effectively, protect aspiration safety with positioning, and keep the resident comfortable and informed.",
    walkthroughChecklist: buildChecklist("Brush effectively, protect aspiration safety with positioning, and keep the resident comfortable and informed."),
  },
  {
    slug: "female-perineal-care",
    title: "Provide Perineal Care to a Female Resident Incontinent of Urine",
    timingBand: "long",
    focus: "Clean front to back, change surfaces as needed, protect privacy, and avoid contamination.",
    walkthroughChecklist: buildChecklist("Clean front to back, change surfaces as needed, protect privacy, and avoid contamination."),
  },
  {
    slug: "hand-and-nail-care",
    title: "Provide Resident Hand and Nail Care",
    timingBand: "short",
    focus: "Use safe water temperature, clean gently, and dry thoroughly while watching skin condition.",
    walkthroughChecklist: buildChecklist("Use safe water temperature, clean gently, and dry thoroughly while watching skin condition."),
  },
  {
    slug: "partial-bed-bath-and-back-rub",
    title: "Provide a Partial Bed Bath and Back Rub",
    timingBand: "long",
    focus: "Expose only the area being washed, maintain comfort and privacy, and complete care in a calm sequence.",
    walkthroughChecklist: buildChecklist("Expose only the area being washed, maintain comfort and privacy, and complete care in a calm sequence."),
  },
  {
    slug: "prom-elbow-and-wrist",
    title: "Provide Passive ROM to One Elbow and Wrist",
    timingBand: "moderate",
    focus: "Support the joint, move slowly through the correct range, and stop if the resident has pain.",
    walkthroughChecklist: buildChecklist("Support the joint, move slowly through the correct range, and stop if the resident has pain."),
  },
  {
    slug: "prom-shoulder",
    title: "Provide Passive ROM to One Shoulder",
    timingBand: "moderate",
    focus: "Support the arm carefully, move slowly, and respect pain or resistance as a stop signal.",
    walkthroughChecklist: buildChecklist("Support the arm carefully, move slowly, and respect pain or resistance as a stop signal."),
  },
  {
    slug: "prom-hip-knee-ankle",
    title: "Provide Passive ROM to One Hip, Knee, and Ankle",
    timingBand: "moderate",
    focus: "Support the leg carefully, move joint by joint with control, and stop when pain appears.",
    walkthroughChecklist: buildChecklist("Support the leg carefully, move joint by joint with control, and stop when pain appears."),
  },
  {
    slug: "pivot-transfer-bed-to-wheelchair",
    title: "Transfer the Resident from Bed to Wheelchair Using a Pivot Technique and Gait Belt",
    timingBand: "short",
    focus: "Lock equipment, use the gait belt correctly, pause for dizziness, and pivot with safe body mechanics.",
    walkthroughChecklist: buildChecklist("Lock equipment, use the gait belt correctly, pause for dizziness, and pivot with safe body mechanics."),
  },
];

export function getCnaClinicalSkill(skillSlug: string) {
  return cnaClinicalSkills.find((skill) => skill.slug === skillSlug) ?? null;
}
