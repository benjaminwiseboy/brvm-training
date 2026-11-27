import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * Sonde de disponibilité, interrogée par UptimeRobot (docs/OBSERVABILITY.md)
 * et par le smoke test post-déploiement (.github/workflows/smoke.yml).
 *
 * 200 + `"status":"ok"` = l'app répond ET la base répond. 503 sinon.
 * Publique (liste blanche de proxy.ts) : ne renvoie donc aucun détail
 * d'erreur, seulement des booléens et des latences.
 */
export async function GET() {
  const started = Date.now();
  let dbOk = false;
  try {
    const { error } = await createAdminClient().from("profiles").select("id").limit(1);
    dbOk = !error;
  } catch {
    dbOk = false;
  }
  const dbLatencyMs = Date.now() - started;

  return NextResponse.json(
    {
      status: dbOk ? "ok" : "degraded",
      env: process.env.VERCEL_ENV ?? "local",
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
      checks: { database: { ok: dbOk, latencyMs: dbLatencyMs } },
    },
    { status: dbOk ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
