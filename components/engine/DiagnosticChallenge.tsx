"use client";

import { useState } from "react";
import type { DiagnosticChallenge as DiagnosticChallengeData } from "@/lib/types";
import { renderMarkup } from "@/lib/markup";
import styles from "./DiagnosticChallenge.module.css";

/**
 * Écran « Défi » pour le test de profilage points-based (M05 — Profil de
 * risque) — structurellement calqué sur QuizChallenge.tsx, mais sans notion
 * de bonne/mauvaise réponse : chaque option d'une question rapporte un
 * nombre de points (0/4/8), le total (max 32) est ensuite mappé à une bande
 * de profil (Prudent/Équilibré/Croissance/Audacieux) par Bilan.tsx.
 *
 * Contrairement à QuizChallenge, il n'y a donc pas de coloration
 * correct/wrong/muted après validation (pas de "bonne" réponse à révéler) :
 * une fois validé, les boutons sont simplement verrouillés (disabled, même
 * approche `.locked` que QuizChallenge), l'option choisie restant visible
 * via son style `.selected` pour rappeler à l'apprenant ce qu'il a répondu.
 *
 * État local :
 * - `answers` — l'option choisie par question (`null` tant que non répondue).
 * - `validated` — verrouille les boutons, une fois pour toutes.
 *
 * `onResult` est appelé depuis le corps du handler de clic (`handleValidate`),
 * jamais depuis un updater `setState` : React Strict Mode double-invoque les
 * updaters en dev (cf. la règle déjà établie dans QuizChallenge/
 * SimulatorChallenge, Tasks 6-8).
 */
export function DiagnosticChallenge({
  challenge,
  onResult,
}: {
  challenge: DiagnosticChallengeData;
  onResult: (r: { points: number }) => void;
}) {
  const total = challenge.questions.length;
  const [answers, setAnswers] = useState<(number | null)[]>(() => challenge.questions.map(() => null));
  const [validated, setValidated] = useState(false);

  const allAnswered = answers.every((a) => a !== null);

  function selectOption(qi: number, oi: number) {
    if (validated) return; // verrouillé post-validation
    setAnswers((prev) => {
      if (prev[qi] === oi) return prev;
      const next = [...prev];
      next[qi] = oi;
      return next;
    });
  }

  function handleValidate() {
    if (validated || !allAnswered) return;

    const points = challenge.questions.reduce((acc, q, qi) => {
      const oi = answers[qi];
      return acc + (oi !== null ? q.options[oi].points : 0);
    }, 0);

    setValidated(true); // pure : ne fait que verrouiller l'affichage
    onResult({ points }); // effet de bord dans le handler, pas dans l'updater
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.sectionHead}>
        <div className={styles.kicker}>{challenge.kicker}</div>
        <h2 className={styles.title}>{renderMarkup(challenge.title)}</h2>
        <p className={styles.instruction}>{renderMarkup(challenge.instruction)}</p>
      </div>

      {challenge.questions.map((q, qi) => {
        const answer = answers[qi];

        return (
          <div key={qi} className={[styles.q, validated ? styles.locked : ""].filter(Boolean).join(" ")}>
            <div className={styles.qNo}>Question {qi + 1}</div>
            <p className={styles.qPrompt}>{renderMarkup(q.prompt)}</p>
            <div className={styles.qOpts}>
              {q.options.map((o, oi) => {
                const selected = answer === oi;
                return (
                  <button
                    key={oi}
                    type="button"
                    className={[styles.opt, selected ? styles.selected : validated ? styles.muted : ""]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => selectOption(qi, oi)}
                    disabled={validated}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <button
        type="button"
        className={`${styles.btn} ${styles.btnGold}`}
        disabled={!allAnswered || validated}
        onClick={handleValidate}
      >
        {allAnswered ? "Valider mes réponses" : `Répondez aux ${total} questions`}
      </button>
    </div>
  );
}
