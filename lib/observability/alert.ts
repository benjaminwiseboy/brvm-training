import "server-only";
import { AlertGate, formatAlert, type Alert } from "./format";
import { log } from "./log";

export type { Alert, Severity } from "./format";

/**
 * Deux budgets distincts : les alertes déclenchées par un appel PUBLIC
 * (/api/monitoring/client-error) ne doivent jamais pouvoir épuiser celles
 * du serveur, sinon il suffirait d'inonder la route publique pour rendre
 * une vraie panne invisible. Les alertes critiques passent toujours.
 */
const gates = {
  server: new AlertGate(10 * 60 * 1000, 20),
  client: new AlertGate(10 * 60 * 1000, 5),
};

export type AlertSource = keyof typeof gates;

/** `production` / `preview` / `development` sur Vercel, `local` ailleurs. */
export function currentEnv(): string {
  return process.env.VERCEL_ENV ?? "local";
}

/**
 * Envoie une alerte sur Telegram. Ne lève JAMAIS : une panne de l'alerting
 * ne doit pas transformer une erreur gérée en erreur 500.
 *
 * Sans `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` (dev local, CI), l'alerte
 * est seulement journalisée — c'est le comportement voulu, pas une panne.
 */
export async function sendAlert(alert: Alert, source: AlertSource = "server"): Promise<void> {
  const env = currentEnv();
  log(alert.severity === "info" ? "info" : "error", "alert", { title: alert.title, ...alert.details });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const fingerprint = alert.fingerprint ?? `${alert.severity}:${alert.title}`;
  if (!gates[source].allow(fingerprint, Date.now(), alert.severity === "critical")) return;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formatAlert(alert, env),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      // Une alerte qui traîne bloquerait la réponse (onRequestError est attendu).
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) log("warn", "alert.telegram_failed", { status: res.status });
  } catch (err) {
    log("warn", "alert.telegram_failed", { error: err instanceof Error ? err.message : String(err) });
  }
}
