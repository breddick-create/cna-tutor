import OpenAI from "openai";

export const DEFAULT_TUTOR_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new OpenAI({ apiKey });
}
