export type RdaDomainId =
  | "infection_control_safety"
  | "chairside_assisting"
  | "dental_radiography"
  | "dental_anatomy_terminology"
  | "instruments_materials"
  | "texas_law_ethics_scope";

export type RdaDomain = {
  id: RdaDomainId;
  name: string;
  description: string;
  weight: number;
};

export const RDA_DOMAINS: RdaDomain[] = [
  {
    id: "infection_control_safety",
    name: "Infection Control & Safety",
    description:
      "Standard precautions, PPE, sterilization, disinfection, sharps safety, exposure response, and patient/staff protection.",
    weight: 0.2,
  },
  {
    id: "chairside_assisting",
    name: "Chairside Assisting",
    description:
      "Four-handed dentistry, transfer zones, moisture control, evacuation, setup, patient positioning, and procedure flow.",
    weight: 0.24,
  },
  {
    id: "dental_radiography",
    name: "Dental Radiography",
    description:
      "Radiographic safety, image basics, positioning logic, retakes, errors, and patient protection.",
    weight: 0.18,
  },
  {
    id: "dental_anatomy_terminology",
    name: "Dental Anatomy & Terminology",
    description:
      "Tooth numbering, surfaces, dentitions, eruption basics, charting terms, and oral anatomy foundations.",
    weight: 0.14,
  },
  {
    id: "instruments_materials",
    name: "Instruments & Materials",
    description:
      "Instrument identification, tray setup, restorative materials, mixing basics, impression support, and handling.",
    weight: 0.14,
  },
  {
    id: "texas_law_ethics_scope",
    name: "Texas Law, Ethics & Scope",
    description:
      "Delegated duties, public safety orientation, patient confidentiality, documentation basics, and Texas-specific role boundaries.",
    weight: 0.1,
  },
];

export type RDADomainSlug = RdaDomainId;

export type RDADomain = RdaDomain & {
  slug: RdaDomainId;
  title: string;
  weightPercent: number;
  readinessFocus: string;
};

const readinessFocusByDomain: Record<RdaDomainId, string> = {
  infection_control_safety:
    "Protect patients, staff, and yourself by choosing the safest infection-control action first.",
  chairside_assisting:
    "Anticipate the operator, maintain the field, and keep patient safety and workflow moving together.",
  dental_radiography:
    "Use ALARA, correct placement errors, and know when to stop and ask for dentist guidance.",
  dental_anatomy_terminology:
    "Translate clinical directions into accurate tooth, surface, and charting language.",
  instruments_materials:
    "Select, pass, and prepare instruments and materials based on procedure needs and manufacturer instructions.",
  texas_law_ethics_scope:
    "Recognize what a Texas RDA may do, what requires dentist or hygienist scope, and when public safety comes first.",
};

export const rdaDomains: RDADomain[] = RDA_DOMAINS.map((domain) => ({
  ...domain,
  slug: domain.id,
  title: domain.name,
  weightPercent: Math.round(domain.weight * 100),
  readinessFocus: readinessFocusByDomain[domain.id],
}));

export const rdaDomainBySlug = Object.fromEntries(
  rdaDomains.map((domain) => [domain.slug, domain]),
) as Record<RDADomainSlug, RDADomain>;

export const rdaDomainById = rdaDomainBySlug;

export function getRdaDomain(id: string) {
  return rdaDomains.find((domain) => domain.id === id) ?? null;
}

export function isRdaDomainId(value: unknown): value is RdaDomainId {
  return typeof value === "string" && value in rdaDomainById;
}
