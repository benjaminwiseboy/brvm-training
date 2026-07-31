"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createCoalescingQueue } from "@/lib/debounce";
import {
  STORAGE_KEY,
  type ProgressState,
  type PaymentStatus,
  initialState,
  isValidProgressState,
  applyCompletion,
} from "@/lib/progress";

// Réexporté pour ne rien casser côté composants clients existants (Dashboard,
// ModuleMap, AppShell, ...) — tout appelant SERVEUR doit importer directement
// depuis "@/lib/progress" (voir le commentaire d'en-tête de ce fichier).
export * from "@/lib/progress";

/**
 * `JSON.stringify` avec les clés triées à chaque niveau — pour comparer
 * l'état local à celui renvoyé par `merge_user_progress` (RPC) sans faux
 * positif dû au seul ORDRE des clés (`jsonb_build_object` côté SQL n'a pas
 * le même ordre que l'objet JS). Sans ça, une simple différence d'ordre
 * déclencherait une réécriture inutile à chaque fois.
 */
function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_key, val) => {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      return Object.keys(val)
        .sort()
        .reduce((acc: Record<string, unknown>, k) => {
          acc[k] = (val as Record<string, unknown>)[k];
          return acc;
        }, {});
    }
    return val;
  });
}

const Ctx = createContext<{
  state: ProgressState;
  userEmail: string | null;
  /** `null` = pas de compte, ou compte sans ligne `payments` — traité comme
   * non-payant pour l'essai gratuit (cf. lib/progress.ts::isFreeTrialModule). */
  paymentStatus: PaymentStatus | null;
  completeModule: (code: string, correct: number, total: number, capitalDelta: number) => void;
  setResumeSlide: (code: string, slide: number, phase?: "cours" | "defi") => void;
  setOnboarded: () => void;
  reset: () => void;
  /**
   * `true` une fois l'état initial disponible — pour un invité, après le
   * one-time read localStorage (ci-dessous) ; pour un compte, toujours `true`
   * dès le montage puisque `initialProgress` est déjà résolu côté serveur
   * (`app/layout.tsx`, avant le premier rendu), donc pas de flash.
   */
  hydrated: boolean;
} | null>(null);

export function ProgressProvider({
  children,
  userId = null,
  userEmail = null,
  initialProgress = null,
  initialPaymentStatus = null,
}: {
  children: React.ReactNode;
  userId?: string | null;
  userEmail?: string | null;
  initialProgress?: ProgressState | null;
  initialPaymentStatus?: PaymentStatus | null;
}) {
  const [state, setState] = useState<ProgressState>(() => initialProgress ?? initialState());
  const [hydrated, setHydrated] = useState(userId !== null); // compte : déjà résolu côté serveur
  const queueRef = useRef<ReturnType<typeof createCoalescingQueue<ProgressState>> | null>(null);

  useEffect(() => {
    if (userId !== null) return; // compte : pas de localStorage, cf. effet d'écriture ci-dessous
    // One-time localStorage → state hydration on mount (client only, post-SSR).
    // Fix 4 (revue finale) : on ne relit dans le state QUE si la valeur parsée a
    // la bonne forme (`isValidProgressState`). Une charge corrompue (mauvaise
    // forme mais JSON valide) est ignorée et l'entrée localStorage réécrite avec
    // un état frais, pour ne pas re-planter au prochain montage.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isValidProgressState(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: reading persisted state is the effect's whole purpose, not a derived-state anti-pattern.
          setState(parsed);
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState()));
        }
      }
    } catch {}
    setHydrated(true);
  }, [userId]);

  useEffect(() => {
    if (userId !== null || !hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated, userId]);

  // Compte connecté : écritures vers Supabase, debounced + single-flight
  // (cf. lib/debounce.ts) — évite le chatter réseau sur chaque changement de
  // slide. Passe par le RPC `merge_user_progress` (fusion atomique côté
  // serveur, jamais de régression) plutôt qu'un upsert brut — Fix, risque de
  // perte de progression : un appareil resté ouvert avec un état périmé
  // (ex. téléphone en arrière-plan pendant qu'on avance sur un laptop)
  // écrasait silencieusement une progression plus récente à la moindre
  // interaction locale. L'état local est ensuite réconcilié avec le résultat
  // fusionné, pour refléter tout de suite ce qu'un autre appareil a ajouté
  // entre-temps (sinon visible seulement au prochain chargement de page).
  useEffect(() => {
    if (userId === null) return;
    const supabase = createClient();
    queueRef.current = createCoalescingQueue<ProgressState>(async (value) => {
      const { data, error } = await supabase.rpc("merge_user_progress", { p_state: value });
      if (!error && isValidProgressState(data) && stableStringify(data) !== stableStringify(value)) {
        setState(data);
      }
    }, 500);
    function flushOnHide() {
      if (document.visibilityState === "hidden") queueRef.current?.flushNow();
    }
    document.addEventListener("visibilitychange", flushOnHide);
    return () => document.removeEventListener("visibilitychange", flushOnHide);
  }, [userId]);

  useEffect(() => {
    if (userId === null || !hydrated) return;
    queueRef.current?.schedule(state);
  }, [state, hydrated, userId]);

  const value = {
    state,
    userEmail,
    paymentStatus: initialPaymentStatus,
    completeModule: (code: string, correct: number, total: number, delta: number) =>
      setState((s) => applyCompletion(s, code, correct, total, delta)),
    setResumeSlide: (code: string, slide: number, phase: "cours" | "defi" = "cours") =>
      setState((s) => ({ ...s, resume: { code, slide, phase } })),
    setOnboarded: () => setState((s) => ({ ...s, onboarded: true })),
    reset: () => setState(initialState()),
    hydrated,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProgress() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useProgress hors ProgressProvider");
  return c;
}
