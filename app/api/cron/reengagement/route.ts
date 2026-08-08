import webpush from "web-push";
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type Tier = { days: number; title: string; body: string };

// Paliers progressifs — cf. reengagement_notifications (1 envoi par
// couple user/palier, jamais de doublon, cf. migration
// 20260808120000_add_push_notifications.sql).
const TIERS: Tier[] = [
  { days: 3, title: "Ta formation t'attend", body: "Reprends ton parcours BRVM Learning là où tu l'as laissé." },
  { days: 7, title: "Un module t'attend", body: "Ça fait une semaine — reprends ta formation BRVM Learning, ça ne prend que quelques minutes." },
  { days: 14, title: "Ton parcours est toujours là", body: "Reprends BRVM Learning quand tu veux, ta progression t'attend." },
];

type DueRow = { user_id: string; endpoint: string; p256dh: string; auth_key: string; last_activity_at: string };

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

  for (const tier of TIERS) {
    const { data, error } = await admin.rpc("get_users_due_for_reengagement", { p_tier_days: tier.days });
    if (error) {
      failed += 1;
      continue;
    }

    for (const row of (data ?? []) as DueRow[]) {
      try {
        await webpush.sendNotification(
          { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth_key } },
          JSON.stringify({ title: tier.title, body: tier.body, url: "/" })
        );
        // upsert (pas insert) : un palier déjà envoyé pour un épisode
        // d'inactivité précédent redevient dû après un retour d'activité
        // (cf. migration 20260808133000) — on met alors à jour la même
        // ligne plutôt que d'en créer une seconde (contrainte PK user+tier).
        await admin
          .from("reengagement_notifications")
          .upsert(
            { user_id: row.user_id, tier_days: tier.days, last_activity_at: row.last_activity_at, sent_at: new Date().toISOString() },
            { onConflict: "user_id,tier_days" }
          );
        sent += 1;
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          // Abonnement expiré/révoqué côté navigateur : plus la peine de
          // réessayer, on nettoie pour ne pas le retenter à chaque palier.
          await admin.from("push_subscriptions").delete().eq("endpoint", row.endpoint);
          expired += 1;
        } else {
          // Échec transitoire (réseau, 5xx...) : pas de log "notifié", le
          // prochain run du cron retentera cet utilisateur pour ce palier.
          failed += 1;
        }
      }
    }
  }

  return NextResponse.json({ sent, expired, failed });
}
