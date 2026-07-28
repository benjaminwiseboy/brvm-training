"use client";

import { useState } from "react";
import type { PlanBuilderChallenge as PlanBuilderChallengeData } from "@/lib/types";
import { renderMarkup } from "@/lib/markup";
import styles from "./PlanBuilderChallenge.module.css";

/**
 * Écran « Défi » du questionnaire de plan d'investissement (M09) —
 * structurellement calqué sur DiagnosticChallenge.tsx, mais sans notion de
 * points/bande : chaque question correspond à un pilier du plan (objectif,
 * horizon, stratégie, profil, capacité d'épargne), et il n'y a ni bonne ni
 * mauvaise réponse — juste LA réponse de l'apprenant, qui sert ensuite de
 * matière au récap personnalisé (Bilan.tsx, branche `plan`).
 *
 * `onResult` est appelé depuis le corps du handler de clic (`handleValidate`),
 * jamais depuis un updater `setState` — même règle que QuizChallenge/
 * DiagnosticChallenge (React Strict Mode double-invoque les updaters en dev).
 */
export function PlanBuilderChallenge({
  challenge,
  onResult,
}: {
  challenge: PlanBuilderChallengeData;
  onResult: (r: { answers: number[] }) => void;
}) {
  const total = challenge.questions.length;
  const [answers, setAnswers] = useState<(number | null)[]>(() => challenge.questions.map(() => null));
  const [validated, setValidated] = useState(false);

  const allAnswered = answers.every((a) => a !== null);

  function selectOption(qi: number, oi: number) {
    if (validated) return;
    setAnswers((prev) => {
      if (prev[qi] === oi) return prev;
      const next = [...prev];
      next[qi] = oi;
      return next;
    });
  }

  function handleValidate() {
    if (validated || !allAnswered) return;
    setValidated(true);
    onResult({ answers: answers as number[] });
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
            <div className={styles.qNo}>
              {q.icon} {q.pillarLabel}
            </div>
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
        {allAnswered ? "Voir mon plan" : `Répondez aux ${total} questions`}
      </button>
    </div>
  );
}
