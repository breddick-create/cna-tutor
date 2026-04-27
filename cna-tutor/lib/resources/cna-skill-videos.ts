export type CnaSkillVideoEntry = {
  skillSlug: string;
  searchQuery: string;
};

// Maps each Prometric CNA skill to a YouTube search query that reliably surfaces
// official demonstration videos. Using search rather than hardcoded video IDs so
// the app doesn't break if a specific video is removed.
const cnaSkillVideoEntries: CnaSkillVideoEntry[] = [
  { skillSlug: "handwashing", searchQuery: "CNA skill handwashing prometric demonstration" },
  { skillSlug: "ambulation-with-gait-belt", searchQuery: "CNA skill ambulate resident gait belt prometric" },
  { skillSlug: "bedpan", searchQuery: "CNA skill assist bedpan prometric demonstration" },
  { skillSlug: "change-occupied-bed", searchQuery: "CNA skill change occupied bed linen prometric" },
  { skillSlug: "side-lying-position", searchQuery: "CNA skill side lying position prometric demonstration" },
  { skillSlug: "dress-weak-arm", searchQuery: "CNA skill dress resident weak arm prometric" },
  { skillSlug: "measure-urine-output", searchQuery: "CNA skill empty urinary drainage bag measure output prometric" },
  { skillSlug: "feeding", searchQuery: "CNA skill feed resident chair prometric demonstration" },
  { skillSlug: "radial-pulse", searchQuery: "CNA skill measure radial pulse prometric demonstration" },
  { skillSlug: "respirations", searchQuery: "CNA skill measure record respirations prometric" },
  { skillSlug: "female-catheter-care", searchQuery: "CNA skill catheter care female resident prometric" },
  { skillSlug: "foot-care", searchQuery: "CNA skill foot care resident prometric demonstration" },
  { skillSlug: "mouth-care-dentures", searchQuery: "CNA skill mouth care dentures prometric demonstration" },
  { skillSlug: "mouth-care-teeth", searchQuery: "CNA skill mouth care natural teeth prometric" },
  { skillSlug: "female-perineal-care", searchQuery: "CNA skill perineal care female resident prometric" },
  { skillSlug: "hand-and-nail-care", searchQuery: "CNA skill hand nail care prometric demonstration" },
  { skillSlug: "partial-bed-bath-and-back-rub", searchQuery: "CNA skill partial bed bath back rub prometric" },
  { skillSlug: "prom-elbow-and-wrist", searchQuery: "CNA skill passive ROM elbow wrist prometric" },
  { skillSlug: "prom-shoulder", searchQuery: "CNA skill passive ROM shoulder prometric demonstration" },
  { skillSlug: "prom-hip-knee-ankle", searchQuery: "CNA skill passive ROM hip knee ankle prometric" },
  { skillSlug: "pivot-transfer-bed-to-wheelchair", searchQuery: "CNA skill pivot transfer bed wheelchair gait belt prometric" },
];

export const SKILLS_PLAYLIST_URL =
  "https://www.youtube.com/playlist?list=PL5b9jlhS-wHhoW85Q8gXXeoTD2Zhq-b_A";

export const SKILLS_PLAYLIST_EMBED_URL =
  "https://www.youtube.com/embed/videoseries?list=PL5b9jlhS-wHhoW85Q8gXXeoTD2Zhq-b_A";

export function getCnaSkillSearchUrl(skillSlug: string): string {
  const entry = cnaSkillVideoEntries.find((e) => e.skillSlug === skillSlug);
  const query = entry?.searchQuery ?? `CNA skill ${skillSlug.replace(/-/g, " ")} prometric demonstration`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
