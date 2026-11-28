import { reportClientError } from "@/lib/observability/client";

// Exécuté avant que l'app ne devienne interactive (convention Next.js).
// Capte ce qu'aucune error boundary ne voit : erreurs dans les handlers
// d'évènements, timers, promesses rejetées sans catch.
try {
  window.addEventListener("error", (event) => {
    reportClientError(event.error ?? event.message, "error", event.filename);
  });
  window.addEventListener("unhandledrejection", (event) => {
    reportClientError(event.reason, "unhandledrejection");
  });
} catch {
  // Jamais bloquant.
}
