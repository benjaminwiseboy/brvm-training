"use client";

import { useEffect } from "react";
import { reportClientError } from "@/lib/observability/client";

/**
 * Remplace le layout racine quand c'est LUI qui plante : pas de styles
 * globaux ni de polices ici (convention Next.js), d'où le style en ligne
 * aux couleurs de la charte (marine #023362, or #e89e11, fond #f3f6fb).
 */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    reportClientError(error, "boundary");
  }, [error]);

  return (
    <html lang="fr">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#f3f6fb", fontFamily: "system-ui, sans-serif", color: "#023362" }}>
        <title>BRVM Learning — erreur</title>
        <div style={{ maxWidth: 420, padding: 32, textAlign: "center" }}>
          <h1 style={{ fontSize: "1.4rem" }}>BRVM Learning est momentanément indisponible</h1>
          <p>Votre progression est sauvegardée. Nous avons été prévenus et regardons le problème.</p>
          <button
            type="button"
            onClick={() => retry()}
            style={{ marginTop: 16, padding: "12px 28px", borderRadius: 999, border: 0, background: "#e89e11", color: "#023362", fontWeight: 700, cursor: "pointer" }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
