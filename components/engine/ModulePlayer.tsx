"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Module } from "@/lib/types";
import { useProgress } from "@/lib/store";
import { getNext } from "@/content/registry";
import { Hero } from "./Hero";
import { SlideDeck } from "./SlideDeck";
import { QuizChallenge } from "./QuizChallenge";
import { SimulatorChallenge } from "./SimulatorChallenge";
import { DiagnosticChallenge } from "./DiagnosticChallenge";
import { Bilan } from "./Bilan";

type Phase = "intro" | "cours" | "defi" | "bilan";

type Result = { correct: number; total: number; capitalDelta: number };

const EMPTY_RESULT: Result = { correct: 0, total: 0, capitalDelta: 0 };

/**
 * Machine à états qui joue un module de bout en bout — intro (Hero) → cours
 * (SlideDeck) → défi (QuizChallenge, SimulatorChallenge ou DiagnosticChallenge,
 * selon `module.challenge.type`) → bilan (Bilan) — et écrit la progression
 * (`useProgress().completeModule`) une seule fois, à l'entrée en bilan.
 *
 * Décisions (gaps non couverts par le brief, cf. task-10-report.md) :
 * - Chemin simulateur (`SimulatorChallenge.onDone`, pas de score) : on appelle
 *   quand même `completeModule` avec `correct=1, total=1` (leçon terminée à
 *   100%, jamais un score "0%") et `capitalDelta = module.reward ?? 0` (bonus
 *   de complétion s'il est défini par le contenu — 0 pour M08 qui n'en a pas).
 * - Chemin diagnostic (`DiagnosticChallenge.onResult`, Task 15a, M05) : même
 *   traitement que le simulateur pour `completeModule` (`correct=1, total=1`,
 *   `capitalDelta = module.reward ?? 0` — 0 pour M05, cf. barème harmonisé
 *   "pas de score chiffré" en Phase 2) ; les points du test sont stockés à
 *   part (`diagnosticPoints`) et transmis à `<Bilan diagnostic={...}>` avec
 *   les bandes du challenge, pour que Bilan résolve le profil correspondant.
 * - `completeModule` est appelé directement dans le corps du handler de clic
 *   (jamais dans un `useEffect` déclenché par `phase === "bilan"`), pour
 *   éviter le double-appel en Strict Mode déjà corrigé dans SlideDeck/
 *   QuizChallenge/SimulatorChallenge (Tasks 6-8).
 * - `Bilan.walletTotal` reçoit `state.capital` tel quel : ce state a déjà été
 *   mis à jour par `completeModule` au moment où la phase "bilan" est rendue
 *   (même batch synchrone), donc pas de recalcul ni de double comptage.
 *
 * Fix 3 (revue finale) — reprise au slide exact : `ModulePlayer` attend
 * l'hydratation du store (`hydrated`) AVANT de monter la machine à états. La
 * route `/module/[code]` monte ce composant sans attendre la lecture
 * localStorage ; or l'initialiseur `useState` du montage doit lire le VRAI
 * `state.resume` (pas la valeur neutre de `initialState()` du tout premier
 * rendu pré-hydratation). On isole donc la machine dans `ModulePlayerInner`,
 * monté seulement une fois `hydrated === true` — même précédent que
 * `app/page.tsx` qui rend `null` tant que l'hydratation n'est pas finie.
 */
export function ModulePlayer({ module }: { module: Module }) {
  const { hydrated } = useProgress();
  // Tant que le store n'est pas hydraté depuis localStorage, on ne peut pas
  // décider intro-vs-reprise : ne rien rendre (bref, cohérent avec app/page.tsx).
  if (!hydrated) return null;
  return <ModulePlayerInner module={module} />;
}

function ModulePlayerInner({ module }: { module: Module }) {
  const router = useRouter();
  const { state, completeModule, setResumeSlide } = useProgress();
  // Reprise (Fix 3) : si le pointeur `resume` du store désigne CE module à un
  // slide > 0, on saute l'intro (Hero) et on monte directement en phase
  // "cours", `SlideDeck` initialisé au bon slide. Sinon flux intro→cours
  // classique au slide 0. `ResumeCard` et `ModuleMap` pointent tous deux vers
  // la même route `/module/<code>` sans param distinctif : les deux chemins
  // d'entrée lisent donc le MÊME `state.resume` et se comportent de façon
  // identique — c'est le sens de `resume` dans ce codebase (posé à chaque
  // changement de slide, pas seulement via la carte de reprise).
  const resume = state.resume;
  const resumesHere = !!resume && resume.code === module.code && resume.slide > 0;
  const [phase, setPhase] = useState<Phase>(resumesHere ? "cours" : "intro");
  const [initialSlide] = useState(resumesHere ? resume!.slide : 0);
  const [result, setResult] = useState<Result>(EMPTY_RESULT);
  const [diagnosticPoints, setDiagnosticPoints] = useState<number | null>(null);

  function handleChallengeResult(r: Result) {
    setResult(r);
    completeModule(module.code, r.correct, r.total, r.capitalDelta);
    setPhase("bilan");
  }

  function handleSimulatorDone() {
    handleChallengeResult({ correct: 1, total: 1, capitalDelta: module.reward ?? 0 });
  }

  function handleDiagnosticResult({ points }: { points: number }) {
    setDiagnosticPoints(points);
    completeModule(module.code, 1, 1, module.reward ?? 0);
    setPhase("bilan");
  }

  function handleNext() {
    const nextMod = getNext(module.code);
    router.push(nextMod ? `/module/${nextMod.code.toLowerCase()}` : "/");
  }

  return (
    <>
      {phase === "intro" && <Hero module={module} onStart={() => setPhase("cours")} />}

      {phase === "cours" && (
        <SlideDeck
          slides={module.slides}
          initialIndex={initialSlide}
          onSlide={(i) => setResumeSlide(module.code, i)}
          onDone={() => setPhase("defi")}
        />
      )}

      {phase === "defi" && module.challenge.type === "quiz" && (
        <QuizChallenge challenge={module.challenge} onResult={handleChallengeResult} />
      )}

      {phase === "defi" && module.challenge.type === "simulator" && (
        <SimulatorChallenge challenge={module.challenge} onDone={handleSimulatorDone} />
      )}

      {phase === "defi" && module.challenge.type === "diagnostic" && (
        <DiagnosticChallenge challenge={module.challenge} onResult={handleDiagnosticResult} />
      )}

      {phase === "bilan" && (
        <Bilan
          result={result}
          feedback={module.feedback}
          onNext={handleNext}
          walletTotal={state.capital}
          diagnostic={
            module.challenge.type === "diagnostic" && diagnosticPoints !== null
              ? { points: diagnosticPoints, bands: module.challenge.bands }
              : undefined
          }
        />
      )}
    </>
  );
}
