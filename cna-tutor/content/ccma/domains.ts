export type CCMADomain = {
  slug: string;
  title: string;
  description: string;
  weightPercent: number;
};

export const ccmaDomains: CCMADomain[] = [
  {
    slug: "clinical-patient-care",
    title: "Clinical Patient Care",
    description:
      "Vital signs, intake, specimen collection, procedures, medications, and infection control.",
    weightPercent: 24,
  },
  {
    slug: "patient-care-coordination-and-education",
    title: "Patient Care Coordination and Education",
    description:
      "Patient teaching, referrals, chronic disease support, preventive care reminders, and follow-up.",
    weightPercent: 8,
  },
  {
    slug: "administrative-assisting",
    title: "Administrative Assisting",
    description:
      "Scheduling, records, EHR basics, billing support, HIPAA compliance, and office communication.",
    weightPercent: 20,
  },
  {
    slug: "laboratory-procedures",
    title: "Laboratory Procedures",
    description:
      "CLIA-waived tests, quality control, chain of custody, and lab safety workflows.",
    weightPercent: 14,
  },
  {
    slug: "diagnostic-testing",
    title: "Diagnostic Testing",
    description:
      "ECG, spirometry, screenings, artifact recognition, and imaging preparation.",
    weightPercent: 14,
  },
  {
    slug: "pharmacology",
    title: "Pharmacology",
    description:
      "Drug classifications, controlled substances, sig codes, and medication safety basics.",
    weightPercent: 10,
  },
  {
    slug: "medical-terminology-and-anatomy",
    title: "Medical Terminology and Anatomy",
    description:
      "Prefixes, suffixes, body systems, common abbreviations, and anatomy within CMA scope.",
    weightPercent: 10,
  },
];
