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
import { Bilan } from "./Bilan";
import { Wallet } from "./Wallet";

type Phase = "intro" | "cours" | "defi" | "bilan";

type Result = { correct: number; total: number; capitalDelta: number };

const EMPTY_RESULT: Result = { correct: 0, total: 0, capitalDelta: 0 };

/**
 * Machine à états qui joue un module de bout en bout — intro (Hero) → cours
 * (SlideDeck) → défi (QuizChallenge ou SimulatorChallenge, selon
 * `module.challenge.type`) → bilan (Bilan) — et écrit la progression
 * (`useProgress().completeModule`) une seule fois, à l'entrée en bilan.
 *
 * Décisions (gaps non couverts par le brief, cf. task-10-report.md) :
 * - Chemin simulateur (`SimulatorChallenge.onDone`, pas de score) : on appelle
 *   quand même `completeModule` avec `correct=1, total=1` (leçon terminée à
 *   100%, jamais un score "0%") et `capitalDelta = module.reward ?? 0` (bonus
 *   de complétion s'il est défini par le contenu — 0 pour M08 qui n'en a pas).
 * - `completeModule` est appelé directement dans le corps du handler de clic
 *   (jamais dans un `useEffect` déclenché par `phase === "bilan"`), pour
 *   éviter le double-appel en Strict Mode déjà corrigé dans SlideDeck/
 *   QuizChallenge/SimulatorChallenge (Tasks 6-8).
 * - `Bilan.walletTotal` reçoit `state.capital` tel quel : ce state a déjà été
 *   mis à jour par `completeModule` au moment où la phase "bilan" est rendue
 *   (même batch synchrone), donc pas de recalcul ni de double comptage.
 */
export function ModulePlayer({ module }: { module: Module }) {
  const router = useRouter();
  const { state, completeModule, setResumeSlide } = useProgress();
  const [phase, setPhase] = useState<Phase>("intro");
  const [result, setResult] = useState<Result>(EMPTY_RESULT);

  function handleChallengeResult(r: Result) {
    setResult(r);
    completeModule(module.code, r.correct, r.total, r.capitalDelta);
    setPhase("bilan");
  }

  function handleSimulatorDone() {
    handleChallengeResult({ correct: 1, total: 1, capitalDelta: module.reward ?? 0 });
  }

  function handleNext() {
    const nextMod = getNext(module.code);
    router.push(nextMod ? `/module/${nextMod.code.toLowerCase()}` : "/");
  }

  return (
    <>
      <Wallet amount={state.capital} delta={result.capitalDelta} />

      {phase === "intro" && <Hero module={module} onStart={() => setPhase("cours")} />}

      {phase === "cours" && (
        <SlideDeck
          slides={module.slides}
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

      {phase === "bilan" && (
        <Bilan result={result} feedback={module.feedback} onNext={handleNext} walletTotal={state.capital} />
      )}
    </>
  );
}
