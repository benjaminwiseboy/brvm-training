"use client";

import Link from "next/link";
import { useEffect } from "react";
import { reportClientError } from "@/lib/observability/client";

/**
 * Filet de sécurité de toutes les pages (sous le layout racine, donc avec
 * les styles globaux). L'erreur est remontée sur Telegram via
 * /api/monitoring/client-error ; la progression, elle, est déjà sauvegardée
 * (localStorage ou Supabase), d'où le message rassurant.
 */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    reportClientError(error, "boundary");
  }, [error]);

  return (
    <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "24px" }}>
      <div className="card" style={{ maxWidth: 440, padding: "32px", textAlign: "center" }}>
        <p className="eyebrow">Oups</p>
        <h1 style={{ fontFamily: "var(--f-display)", fontSize: "1.5rem", margin: "8px 0 12px" }}>
          Cette page a rencontré un problème
        </h1>
        <p style={{ margin: "0 0 24px" }}>
          Votre progression est sauvegardée. Réessayez ; si le problème persiste, nous avons déjà été prévenus.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button type="button" className="btn btn--gold" onClick={() => retry()}>
            Réessayer
          </button>
          <Link className="btn btn--outline" href="/">
            Accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
