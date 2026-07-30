/**
 * Neutralise les redirections ouvertes sur `next` (login, confirmation
 * email) : `next.startsWith("/")` seul laisse passer `//evil.com` (URL
 * protocole-relative, absolue pour le navigateur) et `/\evil.com`
 * (certains navigateurs normalisent `\` en `/`). On n'autorise qu'un
 * chemin interne à un seul slash de tête.
 */
export function sanitizeNextPath(next: string | null | undefined): string {
  if (!next) return "/";
  if (!next.startsWith("/")) return "/";
  if (next.startsWith("//") || next.startsWith("/\\")) return "/";
  return next;
}
