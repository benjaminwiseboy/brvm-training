import webpush from "web-push";
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type DueRow = { user_id: string; endpoint: string; p256dh: string; auth_key: string; streak_days: number };

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? "mailto:contact@brvmlearning.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const admin = createAdminClient();
  let sent = 0;
  let expired = 0;
  let failed = 0;

  const { data, error } = await admin.rpc("get_users_due_for_streak_reminder");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  for (const row of (data ?? []) as DueRow[]) {
    const days = row.streak_days;
    const title = `🔥 Série de ${days} jour${days > 1 ? "s" : ""}`;
    const body = "Ne la casse pas — reprends BRVM Learning aujourd'hui.";

    try {
      await webpush.sendNotification(
        { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth_key } },
        JSON.stringify({ title, body, url: "/" })
      );
      await admin.from("streak_reminders_sent").upsert({ user_id: row.user_id, reminder_date: new Date().toISOString().slice(0, 10) });
      sent += 1;
    } catch (err) {
      const statusCode = (err as { statusCode?: number }).statusCode;
      if (statusCode === 404 || statusCode === 410) {
        await admin.from("push_subscriptions").delete().eq("endpoint", row.endpoint);
        expired += 1;
      } else {
        failed += 1;
      }
    }
  }

  return NextResponse.json({ sent, expired, failed });
}
