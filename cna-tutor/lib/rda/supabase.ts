import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// RDA is a separate product surface, but it intentionally shares the same
// Supabase project as CNA and CCMA. These aliases keep RDA call sites explicit.
export type RdaSupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function createRdaClient(): Promise<RdaSupabaseClient> {
  return createClient();
}

export function createRdaAdminClient() {
  return createAdminClient();
}
