import "server-only";
import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { sendAlert } from "@/lib/observability/alert";
import { log } from "@/lib/observability/log";

/**
 * Vercel Cron envoie `Authorization: Bearer <CRON_SECRET>`.
 *
 * Échoue FERMÉ : sans `CRON_SECRET` (nouvel environnement mal configuré),
 * l'ancienne comparaison `=== \`Bearer ${process.env.CRON_SECRET}\``
 * acceptait littéralement l'en-tête « Bearer undefined » — n'importe qui
 * pouvait alors déclencher l'envoi des notifications.
 */
export function isAuthorizedCron(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const received = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return received.length === expected.length && timingSafeEqual(received, expected);
}

/**
 * Bilan d'exécution d'un cron : journalisé à chaque passage, alerte si des
 * envois ont échoué. Les exceptions non rattrapées, elles, remontent déjà
 * par `onRequestError` (instrumentation.ts).
 */
export async function reportCronRun(name: string, result: Record<string, number>, startedAt: number): Promise<void> {
  const durationMs = Date.now() - startedAt;
  log("info", "cron.run", { cron: name, durationMs, ...result });
  if ((result.failed ?? 0) > 0) {
    await sendAlert({
      severity: "warning",
      title: `Cron ${name} : ${result.failed} échec(s)`,
      details: { ...result, durationMs },
      fingerprint: `cron:${name}:failed`,
    });
  }
}
