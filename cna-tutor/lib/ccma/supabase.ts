import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// CCMA uses the same Supabase project as CNA — these helpers are aliases
// that make call sites read as CCMA-specific without a separate client.
export type CcmaSupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function createCcmaClient(): Promise<CcmaSupabaseClient> {
  return createClient();
}

export function createCcmaAdminClient() {
  return createAdminClient();
}

