/**
 * Remontée des erreurs navigateur vers /api/monitoring/client-error.
 * Utilisé par instrumentation-client.ts (erreurs globales) et par les
 * error boundaries (app/error.tsx, app/global-error.tsx).
 *
 * `sendBeacon` survit à une fermeture d'onglet ; repli sur fetch keepalive.
 * Au plus 5 remontées par chargement de page, sans doublon.
 */
const ENDPOINT = "/api/monitoring/client-error";
const MAX_REPORTS_PER_PAGE = 5;
const reported = new Set<string>();

export type ClientErrorKind = "error" | "unhandledrejection" | "boundary";

export function reportClientError(error: unknown, kind: ClientErrorKind, source?: string): void {
  try {
    if (typeof window === "undefined") return;
    const message = error instanceof Error ? error.message : String(error ?? "Erreur inconnue");
    const key = `${kind}:${message}`;
    if (reported.has(key) || reported.size >= MAX_REPORTS_PER_PAGE) return;
    reported.add(key);

    const payload = JSON.stringify({
      kind,
      message,
      stack: error instanceof Error ? error.stack?.slice(0, 2000) : undefined,
      source,
      path: window.location.pathname,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: "application/json" }));
    } else {
      void fetch(ENDPOINT, { method: "POST", body: payload, keepalive: true, headers: { "Content-Type": "application/json" } });
    }
  } catch {
    // L'instrumentation ne doit jamais casser l'app.
  }
}
