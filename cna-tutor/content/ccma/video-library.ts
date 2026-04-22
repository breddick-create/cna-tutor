export type SupplementaryVideo = {
  youtubeId: string;
  title: string;
  channelName: string;
};

const VIDEO_LIBRARY: Record<string, SupplementaryVideo[]> = {
  "clinical-patient-care": [
    {
      youtubeId: "BFvMO6wUS2k",
      title: "CCMA — Certified Clinical Medical Assistant | All You Need To Know",
      channelName: "CCMA Training",
    },
    {
      youtubeId: "pB6U9pbrzq8",
      title: "NHA Certified Clinical Medical Assistant (CCMA) Study Guide Overview",
      channelName: "NHA Study Guide",
    },
  ],
  "patient-care-coordination-and-education": [
    {
      youtubeId: "TqVrR69Swr0",
      title: "Rights of Medication Administration in Nursing (5, 6, 7, 9, 10, 12) NCLEX",
      channelName: "RegisteredNurseRN",
    },
    {
      youtubeId: "i0A2CiPhUWY",
      title: "The 6 Rights of Medication Administration | Patient Education",
      channelName: "Healthcare Training",
    },
  ],
  "administrative-assisting": [
    {
      youtubeId: "lKXm2mr7zuk",
      title: "What is Medical Billing and Coding?",
      channelName: "Ultimate Medical Academy",
    },
    {
      youtubeId: "Y3bTUJ1bEWI",
      title: "What are CPT Codes and HCPCS Codes? | Medical Assistant",
      channelName: "Medical Assistant Training",
    },
  ],
  "laboratory-procedures": [
    {
      youtubeId: "WC2gvEDTAs0",
      title: "What are CLIA Waived Tests in US Healthcare?",
      channelName: "Healthcare Compliance",
    },
    {
      youtubeId: "bo0mDGNX6lY",
      title: "Specimen Processing in the Clinical Laboratory",
      channelName: "Lab Training",
    },
  ],
  "diagnostic-testing": [
    {
      youtubeId: "yKWQ_oLSXI8",
      title: "Lab Results, Values, and Interpretation (CBC, BMP, CMP, LFT)",
      channelName: "Medical Education",
    },
    {
      youtubeId: "yR4sHPh282I",
      title: "CCMA Lab Values and Vital Sign Ranges | Medical Assistant",
      channelName: "Medical Assistant Training",
    },
  ],
  "pharmacology": [
    {
      youtubeId: "CTG7sNdsRQE",
      title: "CCMA Prep — Pharmacology Review",
      channelName: "CCMA Study",
    },
    {
      youtubeId: "9jXaeS9paOA",
      title: "Pharmacology and Medication Administration | CCMA Training",
      channelName: "CCMA Training",
    },
  ],
  "medical-terminology-and-anatomy": [
    {
      youtubeId: "vFXV5Bs3nSk",
      title: "CCMA/RMA/CMA AAMA Prep — Medical Terminology Review",
      channelName: "Medical Assistant Prep",
    },
    {
      youtubeId: "-FniO7b0qxA",
      title: "Medical Terminology Review Part 15 | CCMA Certification Prep",
      channelName: "Medical Assistant Prep",
    },
  ],
};

export function getSupplementaryVideos(domainSlug: string): SupplementaryVideo[] {
  return VIDEO_LIBRARY[domainSlug] ?? [];
}
