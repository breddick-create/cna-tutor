export type BadgeCategory = "mastery" | "milestone" | "performance";
export type BadgeProduct = "cna" | "ccma" | null;

export type BadgeDefinition = {
  slug: string;
  title: string;
  description: string;
  unlockConditionText: string;
  category: BadgeCategory;
  iconSlug: string;
  product: BadgeProduct;
  domainSlug?: string;
};

// CNA mastery badges
const CNA_MASTERY: BadgeDefinition[] = [
  { slug: "cna_mastery_basic_nursing",     title: "Basic Nursing Skills Pro",    description: "Reached 80%+ mastery in Basic Nursing Skills",           unlockConditionText: "Reach 80% mastery in Basic Nursing Skills",           category: "mastery", iconSlug: "shield-medical",   product: "cna",  domainSlug: "basic-nursing-skills" },
  { slug: "cna_mastery_infection_control", title: "Infection Control Pro",       description: "Reached 80%+ mastery in Infection Control and Safety",   unlockConditionText: "Reach 80% mastery in Infection Control & Safety",     category: "mastery", iconSlug: "shield-biohazard", product: "cna",  domainSlug: "infection-control-and-safety" },
  { slug: "cna_mastery_patient_rights",    title: "Patient Rights Expert",       description: "Reached 80%+ mastery in Patient Rights and Ethics",      unlockConditionText: "Reach 80% mastery in Patient Rights & Ethics",        category: "mastery", iconSlug: "shield-scale",     product: "cna",  domainSlug: "patient-rights-and-ethics" },
  { slug: "cna_mastery_communication",     title: "Communication Specialist",    description: "Reached 80%+ mastery in Communication Skills",           unlockConditionText: "Reach 80% mastery in Communication Skills",           category: "mastery", iconSlug: "shield-chat",      product: "cna",  domainSlug: "communication-skills" },
  { slug: "cna_mastery_mental_health",     title: "Mental Health Advocate",      description: "Reached 80%+ mastery in Mental Health and Social Needs", unlockConditionText: "Reach 80% mastery in Mental Health & Social Needs",   category: "mastery", iconSlug: "shield-heart",     product: "cna",  domainSlug: "mental-health-and-social-needs" },
  { slug: "cna_mastery_personal_care",     title: "Personal Care Specialist",    description: "Reached 80%+ mastery in Personal Care and ADLs",         unlockConditionText: "Reach 80% mastery in Personal Care & ADLs",          category: "mastery", iconSlug: "shield-care",      product: "cna",  domainSlug: "personal-care-adls" },
  { slug: "cna_mastery_vital_signs",       title: "Vital Signs Master",          description: "Reached 80%+ mastery in Vital Signs Basics",             unlockConditionText: "Reach 80% mastery in Vital Signs Basics",            category: "mastery", iconSlug: "shield-pulse",     product: "cna",  domainSlug: "vital-signs-basics" },
  { slug: "cna_mastery_emergency",         title: "Emergency Response Expert",   description: "Reached 80%+ mastery in Emergency Procedures",           unlockConditionText: "Reach 80% mastery in Emergency Procedures",          category: "mastery", iconSlug: "shield-alert",     product: "cna",  domainSlug: "emergency-procedures" },
  { slug: "cna_mastery_documentation",     title: "Documentation Expert",        description: "Reached 80%+ mastery in Documentation",                  unlockConditionText: "Reach 80% mastery in Documentation",                 category: "mastery", iconSlug: "shield-document",  product: "cna",  domainSlug: "documentation" },
  { slug: "cna_mastery_restorative",       title: "Restorative Care Champion",   description: "Reached 80%+ mastery in Restorative Care",               unlockConditionText: "Reach 80% mastery in Restorative Care",              category: "mastery", iconSlug: "shield-restore",   product: "cna",  domainSlug: "restorative-care" },
];

// CCMA mastery badges
const CCMA_MASTERY: BadgeDefinition[] = [
  { slug: "ccma_mastery_clinical",      title: "Clinical Care Pro",           description: "Reached 80%+ mastery in Clinical Patient Care",           unlockConditionText: "Reach 80% mastery in Clinical Patient Care",           category: "mastery", iconSlug: "shield-medical",   product: "ccma", domainSlug: "clinical-patient-care" },
  { slug: "ccma_mastery_coordination",  title: "Care Coordinator",            description: "Reached 80%+ mastery in Patient Care Coordination",       unlockConditionText: "Reach 80% mastery in Patient Care Coordination",       category: "mastery", iconSlug: "shield-care",      product: "ccma", domainSlug: "patient-care-coordination-and-education" },
  { slug: "ccma_mastery_admin",         title: "Administrative Expert",       description: "Reached 80%+ mastery in Administrative Assisting",        unlockConditionText: "Reach 80% mastery in Administrative Assisting",        category: "mastery", iconSlug: "shield-document",  product: "ccma", domainSlug: "administrative-assisting" },
  { slug: "ccma_mastery_lab",           title: "Lab Procedures Pro",          description: "Reached 80%+ mastery in Laboratory Procedures",           unlockConditionText: "Reach 80% mastery in Laboratory Procedures",           category: "mastery", iconSlug: "shield-lab",       product: "ccma", domainSlug: "laboratory-procedures" },
  { slug: "ccma_mastery_diagnostic",    title: "Diagnostics Specialist",      description: "Reached 80%+ mastery in Diagnostic Testing",              unlockConditionText: "Reach 80% mastery in Diagnostic Testing",              category: "mastery", iconSlug: "shield-pulse",     product: "ccma", domainSlug: "diagnostic-testing" },
  { slug: "ccma_mastery_pharmacology",  title: "Pharmacology Expert",         description: "Reached 80%+ mastery in Pharmacology",                    unlockConditionText: "Reach 80% mastery in Pharmacology",                    category: "mastery", iconSlug: "shield-biohazard", product: "ccma", domainSlug: "pharmacology" },
  { slug: "ccma_mastery_terminology",   title: "Medical Terminology Master",  description: "Reached 80%+ mastery in Medical Terminology and Anatomy", unlockConditionText: "Reach 80% mastery in Medical Terminology & Anatomy", category: "mastery", iconSlug: "shield-document",  product: "ccma", domainSlug: "medical-terminology-and-anatomy" },
];

// Milestone badges (both products)
const MILESTONES: BadgeDefinition[] = [
  { slug: "first_step",         title: "First Step",           description: "Completed the pre-test and started your study journey",              unlockConditionText: "Complete the pre-test",                                      category: "milestone", iconSlug: "star-first",   product: null },
  { slug: "on_a_roll",          title: "On a Roll",            description: "Studied 3 days in a row",                                            unlockConditionText: "Study 3 days in a row",                                      category: "milestone", iconSlug: "flame-small",  product: null },
  { slug: "unstoppable",        title: "Unstoppable",          description: "Studied 7 days in a row",                                            unlockConditionText: "Study 7 days in a row",                                      category: "milestone", iconSlug: "flame-large",  product: null },
  { slug: "comeback_kid",       title: "Comeback Kid",         description: "Returned after 5+ days away and completed a full session",           unlockConditionText: "Come back after 5+ days away and complete a session",        category: "milestone", iconSlug: "arrow-return", product: null },
  { slug: "halfway_there",      title: "Halfway There",        description: "Overall readiness score reached 50%",                                unlockConditionText: "Reach 50% readiness",                                        category: "milestone", iconSlug: "star-half",    product: null },
  { slug: "exam_ready_badge",   title: "Exam Ready",           description: "Overall readiness score reached 85%",                                unlockConditionText: "Reach 85% readiness",                                        category: "milestone", iconSlug: "trophy",       product: null },
  { slug: "mock_exam_champion", title: "Mock Exam Champion",   description: "Scored 80%+ on a full mock exam",                                    unlockConditionText: "Score 80%+ on a full mock exam",                             category: "milestone", iconSlug: "trophy-gold",  product: null },
  { slug: "perfect_session",    title: "Perfect Session",      description: "Answered every question correctly in a single lesson session",       unlockConditionText: "Master every topic in a single session",                     category: "milestone", iconSlug: "check-circle", product: null },
  { slug: "speed_learner",      title: "Speed Learner",        description: "Completed a full lesson in under 10 minutes with 90%+ accuracy",     unlockConditionText: "Finish a lesson under 10 min with 90%+ accuracy",            category: "milestone", iconSlug: "lightning",    product: null },
];

// Performance badges (both products)
const PERFORMANCE: BadgeDefinition[] = [
  { slug: "sharp_mind",  title: "Sharp Mind",  description: "10 consecutive correct answers in a single session",                   unlockConditionText: "Answer 10 questions correctly in a row",           category: "performance", iconSlug: "lightning-bolt", product: null },
  { slug: "bounce_back", title: "Bounce Back", description: "Got a question wrong, then answered the next 5 correctly",            unlockConditionText: "Wrong answer, then 5 correct in the same session", category: "performance", iconSlug: "arrow-up",       product: null },
  { slug: "deep_diver",  title: "Deep Diver",  description: "Completed every lesson in a single domain",                           unlockConditionText: "Complete every lesson in any single domain",       category: "performance", iconSlug: "compass",        product: null },
  { slug: "full_send",   title: "Full Send",   description: "Completed all lessons across all domains",                            unlockConditionText: "Complete every lesson across all domains",         category: "performance", iconSlug: "globe",          product: null },
];

export const ALL_BADGES: BadgeDefinition[] = [
  ...CNA_MASTERY,
  ...CCMA_MASTERY,
  ...MILESTONES,
  ...PERFORMANCE,
];

export function getBadgesForProduct(product: "cna" | "ccma"): BadgeDefinition[] {
  return ALL_BADGES.filter((b) => b.product === null || b.product === product);
}

export function getBadgeBySlug(slug: string): BadgeDefinition | undefined {
  return ALL_BADGES.find((b) => b.slug === slug);
}
