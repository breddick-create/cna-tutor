import type { SupabaseClient } from "@supabase/supabase-js";

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayUtc(): string {
  return new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
}

export type StreakResult = {
  currentStreak: number;
  longestStreak: number;
  isNewDay: boolean;
};

export async function updateStudyStreak(
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
): Promise<StreakResult> {
  const today = todayUtc();
  const yesterday = yesterdayUtc();

  const { data: existing } = await supabase
    .from("study_streaks")
    .select("current_streak,longest_streak,last_study_date")
    .eq("user_id", userId)
    .maybeSingle();

  if (!existing) {
    await supabase.from("study_streaks").insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_study_date: today,
    });
    return { currentStreak: 1, longestStreak: 1, isNewDay: true };
  }

  if (existing.last_study_date === today) {
    return {
      currentStreak: existing.current_streak,
      longestStreak: existing.longest_streak,
      isNewDay: false,
    };
  }

  const newStreak = existing.last_study_date === yesterday ? existing.current_streak + 1 : 1;
  const longestStreak = Math.max(newStreak, existing.longest_streak);

  await supabase
    .from("study_streaks")
    .update({ current_streak: newStreak, longest_streak: longestStreak, last_study_date: today })
    .eq("user_id", userId);

  return { currentStreak: newStreak, longestStreak, isNewDay: true };
}
