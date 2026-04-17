export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish / Espanol" },
] as const;

export type SupportedLanguage = (typeof LANGUAGE_OPTIONS)[number]["value"];

export type LocalizedText = {
  en: string;
  es: string;
};

export function resolvePreferredLanguage(raw: unknown): SupportedLanguage {
  if (typeof raw === "string") {
    const normalized = raw.trim().toLowerCase();

    if (
      normalized === "es" ||
      normalized === "spanish" ||
      normalized === "espanol" ||
      normalized === "español" ||
      normalized === "spanish / espanol" ||
      normalized === "spanish / español"
    ) {
      return "es";
    }
  }

  return "en";
}

export function getLanguageLabel(language: SupportedLanguage) {
  return LANGUAGE_OPTIONS.find((option) => option.value === language)?.label ?? "English";
}

export function pickLocalizedText(language: SupportedLanguage, text: LocalizedText) {
  return language === "es" ? text.es : text.en;
}

export function getLanguageLocale(language: SupportedLanguage) {
  return language === "es" ? "es-US" : "en-US";
}
