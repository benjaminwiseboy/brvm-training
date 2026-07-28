"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import type { AnchorHTMLAttributes } from "react";

/**
 * Canal de communication ModulePlayer → AppShell — deux signaux distincts
 * portés par le même Provider (un seul wrap dans AppShell, pas deux) :
 *
 * - Garde de navigation : permet à une page (ex. ModulePlayer en phase
 *   "défi") de demander une confirmation avant que l'utilisateur ne quitte
 *   via un des liens persistants d'AppShell (retour, sidebar, tabbar), qui
 *   restent cliquables même pendant une tâche à fort enjeu. Ne couvre PAS la
 *   fermeture d'onglet / rechargement (`beforeunload`) — seulement la
 *   navigation interne via `GuardedLink`, seul chemin de sortie réellement
 *   exposé par AppShell.
 * - Index de phase : pour le stepper de progression affiché dans le header
 *   d'AppShell (`ModuleShell`, cf. AppShell.tsx) — porté depuis POC-Module-1
 *   (`.stepper` dans `<header class="top">`, `setStep()` dans app.js).
 */
type Guard = { active: boolean; message: string };
const NONE_GUARD: Guard = { active: false, message: "" };

type NavCtx = {
  guard: Guard;
  setGuard: (g: Guard) => void;
  phaseIndex: number | null;
  setPhaseIndex: (i: number | null) => void;
};

const Ctx = createContext<NavCtx | null>(null);

export function NavGuardProvider({ children }: { children: ReactNode }) {
  const [guard, setGuard] = useState<Guard>(NONE_GUARD);
  const [phaseIndex, setPhaseIndex] = useState<number | null>(null);
  return <Ctx.Provider value={{ guard, setGuard, phaseIndex, setPhaseIndex }}>{children}</Ctx.Provider>;
}

function useNavGuardCtx() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useNavGuard hors NavGuardProvider");
  return c;
}

/** À appeler depuis une page : tant que `active` est vrai, tout `GuardedLink` demande confirmation avant de naviguer. */
export function useConfirmBeforeLeaving(active: boolean, message: string) {
  const { setGuard } = useNavGuardCtx();
  useEffect(() => {
    setGuard(active ? { active: true, message } : NONE_GUARD);
    return () => setGuard(NONE_GUARD);
  }, [active, message, setGuard]);
}

/**
 * Lecture seule de la garde courante (Fix P2, critique UX) — réutilisée par
 * `Sidebar`/`Tabbar` pour s'estomper visuellement pendant une tâche à fort
 * enjeu (même signal que `useConfirmBeforeLeaving`, pas un second état à
 * maintenir en synchro).
 */
export function useNavGuardActive() {
  return useNavGuardCtx().guard.active;
}

/** À appeler depuis ModulePlayer à chaque changement de phase — porte l'index (0-3) jusqu'au stepper du header d'AppShell. */
export function useReportModulePhase(index: number) {
  const { setPhaseIndex } = useNavGuardCtx();
  useEffect(() => {
    setPhaseIndex(index);
    return () => setPhaseIndex(null);
  }, [index, setPhaseIndex]);
}

/** Lu par `ModuleShell` (AppShell.tsx) pour son stepper de header — `null` hors d'un module (ou avant que ModulePlayer n'ait reporté sa phase). */
export function useModulePhaseIndex() {
  return useNavGuardCtx().phaseIndex;
}

/** `Link` qui respecte la garde courante — utilisé par AppShell pour ses liens de nav réels (jamais nécessaire sur les ancres "#" qui ne quittent rien). */
export function GuardedLink({
  href,
  onClick,
  ...rest
}: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { guard } = useNavGuardCtx();
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (!guard.active) return;
        e.preventDefault();
        if (window.confirm(guard.message)) router.push(href.toString());
      }}
      {...rest}
    />
  );
}
