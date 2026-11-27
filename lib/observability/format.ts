/**
 * Briques PURES de l'alerting (aucun accès réseau, aucun `server-only`) :
 * testables en isolation et partagées par le serveur et la route qui reçoit
 * les erreurs navigateur. L'envoi réel vit dans `./alert.ts`.
 */

export type Severity = "critical" | "error" | "warning" | "info";

export type Alert = {
  severity: Severity;
  /** Une ligne, lisible sur la notification du téléphone. */
  title: string;
  /** Contexte clé → valeur, rendu en liste sous le titre. */
  details?: Record<string, unknown>;
  /** Clé de déduplication : deux alertes de même empreinte = une seule notif. */
  fingerprint?: string;
};

const ICON: Record<Severity, string> = {
  critical: "🔴",
  error: "🟠",
  warning: "🟡",
  info: "🔵",
};

/** Telegram `parse_mode: HTML` n'accepte que trois entités à échapper. */
export function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function truncate(value: string, max: number): string {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}

/**
 * Retire la query string d'un chemin : elle peut porter des jetons
 * (`/auth/confirm?code=…`, `?next=…`) qui n'ont rien à faire dans un
 * canal de discussion.
 */
export function stripQuery(path: string): string {
  const i = path.search(/[?#]/);
  return i === -1 ? path : path.slice(0, i);
}

/** Message Telegram (HTML) — 4096 caractères max côté API, on reste large. */
export function formatAlert(alert: Alert, env: string): string {
  const lines = [`${ICON[alert.severity]} <b>[${escapeHtml(env.toUpperCase())}] ${escapeHtml(truncate(alert.title, 200))}</b>`];
  for (const [key, raw] of Object.entries(alert.details ?? {})) {
    if (raw === undefined || raw === null || raw === "") continue;
    const value = typeof raw === "string" ? raw : JSON.stringify(raw);
    lines.push(`• <b>${escapeHtml(key)}</b> : <code>${escapeHtml(truncate(value, 600))}</code>`);
  }
  return truncate(lines.join("\n"), 3800);
}

/**
 * Anti-tempête : une même empreinte n'est notifiée qu'une fois par fenêtre,
 * et le nombre total de notifications par fenêtre est plafonné (une route
 * publique pourrait sinon servir à inonder le canal).
 *
 * État en mémoire, donc PAR INSTANCE serverless : c'est un garde-fou, pas
 * une garantie. Deux instances chaudes peuvent chacune notifier une fois.
 */
export class AlertGate {
  private seen = new Map<string, number>();
  private sentInWindow: number[] = [];

  constructor(
    private readonly windowMs = 10 * 60 * 1000,
    private readonly maxPerWindow = 20,
  ) {}

  /** `bypassCap` : une alerte critique ignore le plafond (pas le dédoublonnage). */
  allow(fingerprint: string, now = Date.now(), bypassCap = false): boolean {
    for (const [key, at] of this.seen) if (now - at >= this.windowMs) this.seen.delete(key);
    this.sentInWindow = this.sentInWindow.filter((at) => now - at < this.windowMs);

    if (this.seen.has(fingerprint)) return false;
    if (!bypassCap && this.sentInWindow.length >= this.maxPerWindow) return false;

    this.seen.set(fingerprint, now);
    this.sentInWindow.push(now);
    return true;
  }
}

/**
 * Erreurs de contrôle de flux de Next.js (`redirect()`, `notFound()`,
 * rendu dynamique forcé) : elles transitent par le mécanisme d'erreur mais
 * ne sont pas des pannes.
 */
export function isNextControlFlow(digest: string | undefined): boolean {
  if (!digest) return false;
  return (
    digest.startsWith("NEXT_REDIRECT") ||
    digest.startsWith("NEXT_HTTP_ERROR_FALLBACK") ||
    digest.startsWith("NEXT_NOT_FOUND") ||
    digest === "DYNAMIC_SERVER_USAGE" ||
    digest === "BAILOUT_TO_CLIENT_SIDE_RENDERING"
  );
}

/** Bruit navigateur connu, sans valeur de diagnostic. */
export function isClientNoise(message: string, source?: string): boolean {
  if (source && /^(chrome|moz|safari|safari-web)-extension:/.test(source)) return true;
  return (
    message === "Script error." ||
    message.startsWith("ResizeObserver loop") ||
    /Loading chunk [\w-]+ failed/.test(message) ||
    message.includes("NEXT_REDIRECT")
  );
}
