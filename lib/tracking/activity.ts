import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type SessionRow = Database["public"]["Tables"]["ccma_tutor_sessions"]["Row"];

const ACTIVE_CAP_SECONDS = 5 * 60;

function getDeltaSeconds(previousIso: string, nextIso: string) {
  const previous = new Date(previousIso).getTime();
  const next = new Date(nextIso).getTime();

  return Math.max(0, Math.round((next - previous) / 1000));
}

export async function recordStudyInteraction(args: {
  supabase: SupabaseClient<Database>;
  session: SessionRow;
  eventType: string;
  metadata?: Database["public"]["Tables"]["ccma_activity_events"]["Insert"]["metadata_json"];
  markLessonCompleted?: boolean;
}) {
  const now = new Date().toISOString();
  const deltaSeconds = getDeltaSeconds(args.session.last_activity_at, now);
  const activeSeconds = Math.min(deltaSeconds, ACTIVE_CAP_SECONDS);
  const idleSeconds = Math.max(0, deltaSeconds - activeSeconds);
  const statDate = now.slice(0, 10);

  const updatedTotalSeconds = args.session.total_seconds + deltaSeconds;
  const updatedActiveSeconds = args.session.active_seconds + activeSeconds;
  const updatedIdleSeconds = args.session.idle_seconds + idleSeconds;

  await args.supabase
    .from("ccma_tutor_sessions")
    .update({
      total_seconds: updatedTotalSeconds,
      active_seconds: updatedActiveSeconds,
      idle_seconds: updatedIdleSeconds,
      last_activity_at: now,
    })
    .eq("id", args.session.id);

  const { data: existingDailyStat } = await args.supabase
    .from("ccma_daily_user_stats")
    .select("*")
    .eq("user_id", args.session.user_id)
    .eq("date", statDate)
    .maybeSingle();

  if (existingDailyStat) {
    await args.supabase
      .from("ccma_daily_user_stats")
      .update({
        total_seconds: existingDailyStat.total_seconds + deltaSeconds,
        active_seconds: existingDailyStat.active_seconds + activeSeconds,
        idle_seconds: existingDailyStat.idle_seconds + idleSeconds,
        lessons_completed:
          existingDailyStat.lessons_completed + (args.markLessonCompleted ? 1 : 0),
        last_activity_at: now,
      })
      .eq("user_id", args.session.user_id)
      .eq("date", statDate);
  } else {
    await args.supabase.from("ccma_daily_user_stats").insert({
      user_id: args.session.user_id,
      date: statDate,
      total_seconds: deltaSeconds,
      active_seconds: activeSeconds,
      idle_seconds: idleSeconds,
      lessons_completed: args.markLessonCompleted ? 1 : 0,
      last_activity_at: now,
    });
  }

  await args.supabase
    .from("ccma_profiles")
    .update({ last_activity_at: now })
    .eq("id", args.session.user_id);

  await args.supabase.from("ccma_activity_events").insert({
    user_id: args.session.user_id,
    session_id: args.session.id,
    event_type: args.eventType,
    metadata_json: args.metadata ?? {},
    occurred_at: now,
  });

  return {
    now,
    totalSeconds: updatedTotalSeconds,
    activeSeconds: updatedActiveSeconds,
    idleSeconds: updatedIdleSeconds,
  };
}
