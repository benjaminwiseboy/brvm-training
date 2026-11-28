import type { Instrumentation } from "next";

/**
 * Toute erreur serveur non rattrapée (Server Component, Route Handler,
 * Server Action, proxy) passe par ici → journal structuré + alerte Telegram.
 * Cf. docs/OBSERVABILITY.md.
 *
 * Import dynamique : le module d'alerting n'est chargé qu'à la première
 * erreur, pas au démarrage de chaque instance.
 */
export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  const { reportServerError } = await import("./lib/observability/server-error");
  await reportServerError(err, request, context);
};
