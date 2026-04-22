export type SupplementaryVideo = {
  youtubeId: string;
  title: string;
  channelName: string;
};

const VIDEO_LIBRARY: Record<string, SupplementaryVideo[]> = {
  "infection-control-and-safety": [
    {
      youtubeId: "vLq6B3Qjy98",
      title: "Standard & Isolation Precautions Nursing | Infection Control",
      channelName: "RegisteredNurseRN",
    },
    {
      youtubeId: "a-NE9aXONbE",
      title: "Donning & Doffing PPE and Isolation Precautions",
      channelName: "Level Up RN",
    },
  ],
  "patient-rights-and-ethics": [
    {
      youtubeId: "CD7mSYHB9WI",
      title: "HIPAA for Certified Nursing Assistants",
      channelName: "CNA Training",
    },
    {
      youtubeId: "LVlG-CkI5zs",
      title: "Legal & Ethical Nursing Essentials: HIPAA, Torts & NCLEX",
      channelName: "RegisteredNurseRN",
    },
  ],
  "vital-signs-basics": [
    {
      youtubeId: "E2y4Wruu9-c",
      title: "Vital Signs: Temperature, Pulse, Respirations & Blood Pressure",
      channelName: "Level Up RN",
    },
    {
      youtubeId: "gUWJ-6nL5-8",
      title: "Vital Signs Nursing: Respiratory Rate, Pulse, Blood Pressure, Temperature",
      channelName: "RegisteredNurseRN",
    },
  ],
  "communication-skills": [
    {
      youtubeId: "t_59thyrje8",
      title: "Therapeutic Communication in Nursing | Nurse-Client Relationship",
      channelName: "Level Up RN",
    },
    {
      youtubeId: "svMEO66BlJY",
      title: "Therapeutic Communication Techniques | Mental Health NCLEX",
      channelName: "RegisteredNurseRN",
    },
  ],
  "documentation": [
    {
      youtubeId: "CS4Q5EMHVEY",
      title: "HIPAA 101: Protecting Patient Privacy in Nursing Documentation",
      channelName: "Healthcare Compliance Training",
    },
    {
      youtubeId: "7LRrFMHOWws",
      title: "HIPAA Patient Privacy Issues in Nursing | Documentation Tips",
      channelName: "RegisteredNurseRN",
    },
  ],
  "emergency-procedures": [
    {
      youtubeId: "hahvUXwTXE4",
      title: "Caregiver Training: Agitation and Anxiety — Emergency Response",
      channelName: "UCLA Alzheimer's and Dementia Care",
    },
    {
      youtubeId: "QzkcSyae_nU",
      title: "Managing Behavior Changes and Emergency Situations in Patient Care",
      channelName: "Alzheimer's Association",
    },
  ],
};

export function getSupplementaryVideos(domainSlug: string): SupplementaryVideo[] {
  return VIDEO_LIBRARY[domainSlug] ?? [];
}
