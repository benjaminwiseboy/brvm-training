import "server-only";
import type { Instrumentation } from "next";
import { sendAlert } from "./alert";
import { isNextControlFlow, stripQuery, truncate } from "./format";

type Params = Parameters<Instrumentation.onRequestError>;

/**
 * On ne transmet NI les en-têtes (cookies de session), NI la query string
 * (codes PKCE, `next=`) : seulement de quoi retrouver l'erreur dans les logs
 * Vercel — route, méthode, digest.
 */
export async function reportServerError(err: Params[0], request: Params[1], context: Params[2]): Promise<void> {
  const digest =
    typeof err === "object" && err !== null && "digest" in err ? String((err as { digest: unknown }).digest) : undefined;
  if (isNextControlFlow(digest)) return;

  const message = err instanceof Error ? err.message : String(err);
  const route = context.routePath || stripQuery(request.path);

  await sendAlert({
    severity: "error",
    title: `Erreur serveur sur ${route}`,
    details: {
      message: truncate(message, 400),
      type: context.routeType,
      method: request.method,
      path: stripQuery(request.path),
      digest,
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
    },
    fingerprint: `server:${route}:${digest ?? message.slice(0, 120)}`,
  });
}
