import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["ccma_profiles"]["Row"];

export type Viewer = {
  user: User;
  profile: Profile;
};

export const getViewer = cache(async (): Promise<Viewer | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("ccma_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return null;
  }

  return { user, profile };
});

export async function requireViewer() {
  const viewer = await getViewer();

  if (!viewer) {
    redirect("/sign-in");
  }

  return viewer;
}

export async function requireAdmin() {
  const viewer = await requireViewer();

  if (viewer.profile.role !== "admin") {
    redirect("/dashboard");
  }

  return viewer;
}
