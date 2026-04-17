"use client";

import { createContext, useContext, useMemo } from "react";

import {
  type LocalizedText,
  type SupportedLanguage,
  pickLocalizedText,
} from "@/lib/ccma/i18n/languages";

type LanguageContextValue = {
  language: SupportedLanguage;
  t: (text: LocalizedText) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  language,
}: {
  children: React.ReactNode;
  language: SupportedLanguage;
}) {
  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      t: (text) => pickLocalizedText(language, text),
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider.");
  }

  return context;
}

