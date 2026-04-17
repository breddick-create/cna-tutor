function required(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  get appUrl() {
    return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  },
  get supportEmail() {
    return process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() ?? "";
  },
  get adminSignUpCode() {
    return process.env.ADMIN_SIGN_UP_CODE?.trim() ?? "";
  },
  get supabaseUrl() {
    return required("NEXT_PUBLIC_SUPABASE_URL");
  },
  get supabasePublishableKey() {
    return required("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  },
  get supabaseServiceRoleKey() {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
  get openAiApiKey() {
    return required("OPENAI_API_KEY");
  },
};
