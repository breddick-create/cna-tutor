"use server";

import { redirect } from "next/navigation";

import { createRdaClient } from "@/lib/rda/supabase";

export async function signOutAction() {
  const supabase = await createRdaClient();
  await supabase.auth.signOut();
  redirect("/sign-in?product=rda");
}
