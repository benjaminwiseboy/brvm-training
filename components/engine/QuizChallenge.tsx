"use client";

import { useState } from "react";
import type { QuizChallenge as QuizChallengeData } from "@/lib/types";
import { renderMarkup } from "@/lib/markup";
import styles from "./QuizChallenge.module.css";

/**
 * Écran « Défi » (quiz Mythe/Réalité, Feu vert/rouge…) — port de
 * buildChallenge()/validateChallenge() dans POC-Module-1/app.js.
 *
 * État local :
 * - `answers` — une réponse par question (`null` tant que non répondue).
 * - `validated` — verrouille les options (plus de clic possible) et
 *   déclenche l'affichage correct/incorrect/muted par option, une fois
 *   pour toutes (la validation n'est pas réversible, comme dans le POC).
 *
 * `onResult` est appelé depuis le corps du handler de clic (`handleValidate`),
 * jamais depuis un updater `setState` : React Strict Mode double-invoque les
 * updaters en dev, ce qui déclencherait `onResult` deux fois par clic
 * (cf. la leçon corrigée dans SlideDeck à la Task 6).
 */
export function QuizChallenge({
  challenge,
  onResult,
}: {
  challenge: QuizChallengeData;
  onResult: (r: { correct: number; total: number; capitalDelta: number }) => void;
}) {
  const total = challenge.questions.length;
  const [answers, setAnswers] = useState<(string | null)[]>(() => challenge.questions.map(() => null));
  const [validated, setValidated] = useState(false);

  const allAnswered = answers.every((a) => a !== null);

  function selectOption(qi: number, value: string) {
    if (validated) return; // verrouillé post-validation (cf. .locked .opt { pointer-events: none })
    setAnswers((prev) => {
      if (prev[qi] === value) return prev;
      const next = [...prev];
      next[qi] = value;
      return next;
    });
  }

  function handleValidate() {
    if (validated || !allAnswered) return;

    const correct = challenge.questions.reduce(
      (acc, q, qi) => acc + (answers[qi] === q.answer ? 1 : 0),
      0,
    );
    const errors = total - correct;
    const capitalDelta =
      correct === total ? challenge.perfectReward : -(errors * challenge.penaltyPerError);

    setValidated(true); // pure : ne fait que verrouiller l'affichage
    onResult({ correct, total, capitalDelta }); // effet de bord dans le handler, pas dans l'updater
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.sectionHead}>
        <div className={styles.kicker}>Section 2 · {challenge.kicker}</div>
        <h2 className={styles.title}>{renderMarkup(challenge.title)}</h2>
        <p className={styles.instruction}>{renderMarkup(challenge.instruction)}</p>
      </div>

      {challenge.questions.map((q, qi) => {
        const answer = answers[qi];
        const right = answer === q.answer;
        const opts = q.options ?? challenge.options;

        return (
          <div
            key={qi}
            className={[
              styles.q,
              validated ? styles.locked : "",
              validated ? (right ? styles.qOk : styles.qKo) : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className={styles.qNo}>Affirmation {qi + 1}</div>
            <p className={styles.qPrompt}>{renderMarkup(q.prompt)}</p>
            <div className={styles.qOpts}>
              {opts.map((o) => {
                const selected = answer === o.value;
                // Port exact de validateChallenge() : une fois verrouillé,
                // la bonne réponse passe en "correct", la réponse choisie
                // (si fausse) en "wrong", le reste en "muted".
                let variant = "";
                if (validated) {
                  if (o.value === q.answer) variant = "correct";
                  else if (o.value === answer) variant = "wrong";
                  else variant = "muted";
                }
                return (
                  <button
                    key={o.value}
                    type="button"
                    className={[
                      styles.opt,
                      selected ? styles.selected : "",
                      variant ? styles[variant] : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => selectOption(qi, o.value)}
                    disabled={validated}
                  >
                    <span className={styles.mk}>✓</span>
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
        {allAnswered ? "Valider mes réponses" : `Répondez aux ${total} affirmations`}
      </button>
    </div>
  );
}
