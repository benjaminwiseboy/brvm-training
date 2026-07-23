"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { orderedCodes, getModule, PHASES } from "@/content/registry";

const KEY = "brvm-learning:v1";

export type ProgressState = {
  onboarded: boolean; capital: number; streak: number;
  completed: Record<string, { score: number; at: string }>;
  resume?: { code: string; slide: number };
  unlockedResources: string[];
};

export const initialState = (): ProgressState => ({
  onboarded: false, capital: 1_000_000, streak: 0, completed: {}, unlockedResources: [],
});

/**
 * Statut/badge du parcours pour un nombre de modules terminés donné.
 *
 * Décision (gap non couvert par le brief, cf. rapport de tâche) : le statut
 * "porté" par l'apprenant à un instant T est celui du module sur lequel il se
 * trouve (position `doneCount` dans `orderedCodes()`, clampée au dernier
 * index) — ce champ existe déjà par module (`Module.status`, ex. M01 🥉,
 * M08 🥈). Tant que tous les modules ne sont pas convertis (Tâches 14-18),
 * `getModule(code)` peut renvoyer `undefined` : on retombe alors sur le
 * badge de la phase englobante (`PHASES[i].badge`) et son nom comme libellé
 * générique, plutôt que de planter ou renvoyer `undefined`.
 */
export function deriveStatus(doneCount: number): { emoji: string; label: string } {
  const order = orderedCodes();
  if (order.length === 0) return { emoji: "🥉", label: "Apprenti investisseur" };
  const idx = Math.min(Math.max(doneCount, 0), order.length - 1);
  const code = order[idx];
  const mod = getModule(code);
  if (mod) return mod.status;
  const phase = PHASES.find((p) => p.codes.includes(code));
  return { emoji: phase?.badge ?? "🥉", label: phase?.name ?? "Apprenti investisseur" };
}

/**
 * État d'affichage d'un module dans le tableau de bord.
 * - "done" : le module est dans `completed`, quelle que soit sa position.
 * - "current" : le premier code de `order` qui n'est pas encore complété.
 * - "unlocked" : uniquement le code juste après "current" — et uniquement
 *   tant qu'aucun module n'a encore été terminé (aperçu d'accroche pour un
 *   tout nouvel apprenant). Dès qu'un module est complété, la progression
 *   redevient strictement séquentielle : seul "current" est ouvert.
 * - "locked" : tout le reste.
 */
export function deriveModuleState(
  code: string,
  completed: Record<string, unknown>,
  order: string[]
): "done" | "current" | "unlocked" | "locked" {
  if (completed[code]) return "done";
  const currentIdx = order.findIndex((c) => !completed[c]);
  const idx = order.indexOf(code);
  if (idx === currentIdx) return "current";
  const doneCount = Object.keys(completed).length;
  if (doneCount === 0 && idx === currentIdx + 1) return "unlocked";
  return "locked";
}

export function progressPct(doneCount: number, total: number): number {
  if (!total) return 0;
  return Math.round((doneCount / total) * 100);
}

export function applyCompletion(
  state: ProgressState,
  code: string,
  correct: number,
  total: number,
  capitalDelta: number
): ProgressState {
  const order = orderedCodes();
  const idx = order.indexOf(code);
  const nextCode = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : undefined;
  return {
    ...state,
    completed: {
      ...state.completed,
      [code]: { score: total > 0 ? correct / total : 0, at: new Date().toISOString() },
    },
    capital: Math.max(0, state.capital + capitalDelta),
    streak: state.streak + 1,
    resume: nextCode ? { code: nextCode, slide: 0 } : state.resume,
  };
}

const Ctx = createContext<{
  state: ProgressState;
  completeModule: (code: string, correct: number, total: number, capitalDelta: number) => void;
  setResumeSlide: (code: string, slide: number) => void;
  setOnboarded: () => void;
  reset: () => void;
} | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // One-time localStorage → state hydration on mount (client only, post-SSR).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: reading persisted state is the effect's whole purpose, not a derived-state anti-pattern.
    try { const raw = localStorage.getItem(KEY); if (raw) setState(JSON.parse(raw)); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(KEY, JSON.stringify(state)); }, [state, hydrated]);
  const value = {
    state,
    completeModule: (code: string, correct: number, total: number, delta: number) =>
      setState((s) => applyCompletion(s, code, correct, total, delta)),
    setResumeSlide: (code: string, slide: number) => setState((s) => ({ ...s, resume: { code, slide } })),
    setOnboarded: () => setState((s) => ({ ...s, onboarded: true })),
    reset: () => setState(initialState()),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProgress() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useProgress hors ProgressProvider");
  return c;
}
