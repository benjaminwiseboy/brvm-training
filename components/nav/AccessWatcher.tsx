"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/** Deux rafraîchissements ne peuvent pas s'enchaîner plus vite que ça. */
const MIN_INTERVAL_MS = 30_000;

/**
 * Re-lit l'accès (paiement + overrides admin) quand l'apprenant revient sur
 * l'app, et seulement pour un compte qui n'a PAS encore payé (cf. app/layout).
 *
 * Pourquoi : il n'y a pas de paiement en ligne. On paie par mobile money ou
 * virement, on écrit sur WhatsApp, et c'est l'admin qui bascule le compte
 * (`payments.status` ou un accès forcé ouvert). Or `paymentStatus` n'est lu
 * qu'au rendu serveur du layout racine : quelqu'un qui garde l'app ouverte —
 * le cas normal en PWA sur téléphone — continuait de voir « Plan payant » sur
 * un parcours déjà débloqué, jusqu'à un rechargement complet. Personne ne
 * devine qu'il faut recharger.
 *
 * `router.refresh()` re-rend les Server Components (donc le layout, donc les
 * props d'accès) sans démonter l'arbre client : la progression en cours dans
 * `ProgressProvider` est conservée. Déclenché au retour au premier plan
 * (`visibilitychange`), jamais en boucle : c'est le moment exact où l'on
 * revient de la conversation WhatsApp.
 */
export function AccessWatcher() {
  const router = useRouter();
  const lastRef = useRef(0);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState !== "visible") return;
      const now = Date.now();
      if (now - lastRef.current < MIN_INTERVAL_MS) return;
      lastRef.current = now;
      router.refresh();
    }
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [router]);

  return null;
}
