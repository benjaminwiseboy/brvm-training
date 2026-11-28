/**
 * Journal structuré : une ligne JSON par évènement, que les logs Vercel
 * (onglet Logs du projet) permettent de filtrer par `event`.
 *
 * Règle : jamais de cookie, d'en-tête d'autorisation, de mot de passe ni de
 * contenu de progression dans `data` — seulement des identifiants et des
 * compteurs.
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

export function log(level: LogLevel, event: string, data: Record<string, unknown> = {}): void {
  const line = JSON.stringify({
    level,
    event,
    env: process.env.VERCEL_ENV ?? "local",
    sha: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
    ts: new Date().toISOString(),
    ...data,
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}
