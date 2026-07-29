"use client";

import { useCallback, useEffect, useState } from "react";
import type { QuizChallenge as QuizChallengeData } from "@/lib/types";
import { renderMarkup } from "@/lib/markup";
import { BocTable } from "./BocTable";
import { IdCard } from "./IdCard";
import { ChartTabs } from "./ChartTabs";
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
 * - `qi` (Fix P2, critique UX) — affirmation affichée pendant la réponse.
 *   Avant, les 4 questions s'affichaient d'un bloc, à rebours du pattern
 *   « une slide à la fois » déjà établi par SlideDeck une phase plus tôt
 *   (qui, lui, se démonte entièrement en passant au défi — impossible de
 *   revoir le cours pendant le quiz). Même langage d'interaction ici :
 *   stepper à points, ← → clavier, dernier item → bouton « Valider » au
 *   lieu de « Suivant ». Une fois validé, les 4 s'affichent ensemble pour
 *   la relecture — même logique que Bilan (tout visible au débrief).
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
  onResult: (r: { correct: number; total: number; capitalDelta: number; answers: (string | null)[] }) => void;
}) {
  const total = challenge.questions.length;
  const [answers, setAnswers] = useState<(string | null)[]>(() => challenge.questions.map(() => null));
  const [validated, setValidated] = useState(false);
  const [qi, setQi] = useState(0);

  const allAnswered = answers.every((a) => a !== null);
  const isLast = qi === total - 1;

  function selectOption(index: number, value: string) {
    if (validated) return; // verrouillé post-validation (cf. .locked .opt { pointer-events: none })
    setAnswers((prev) => {
      if (prev[index] === value) return prev;
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleValidate() {
    if (validated || !allAnswered) return;

    const correct = challenge.questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
      0,
    );
    const errors = total - correct;
    const capitalDelta =
      correct === total ? challenge.perfectReward : -(errors * challenge.penaltyPerError);

    setValidated(true); // pure : ne fait que verrouiller l'affichage
    onResult({ correct, total, capitalDelta, answers }); // effet de bord dans le handler, pas dans l'updater
  }

  // Avance à l'affirmation suivante, ou valide sur la dernière — même forme
  // que SlideDeck.go() : décidé dans le corps du handler (pas un updater),
  // pour n'appeler handleValidate() qu'une fois par clic.
  const goNext = useCallback(() => {
    if (answers[qi] === null) return; // garde : répondre avant d'avancer
    if (qi >= total - 1) {
      handleValidate();
      return;
    }
    setQi((i) => i + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleValidate ferme sur answers/validated, recréée à chaque render en même temps que goNext
  }, [answers, qi, total]);

  const goPrev = useCallback(() => {
    setQi((i) => Math.max(0, i - 1));
  }, []);

  // Navigation clavier ← → — même pattern que SlideDeck, désactivée une fois validé.
  useEffect(() => {
    if (validated) return;
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [validated, goNext, goPrev]);

  // Avant validation : une affirmation à la fois (qi). Après : les 4 d'un
  // bloc, pour la relecture.
  const visibleIndexes = validated ? challenge.questions.map((_, i) => i) : [qi];

  return (
    <div className={styles.wrap}>
      <div className={styles.sectionHead}>
        <div className={styles.kicker}>{challenge.kicker}</div>
        <h2 className={styles.title}>{renderMarkup(challenge.title)}</h2>
      </div>

      {(challenge.table || challenge.idcard || challenge.chartProfiles) && (
        <div className={styles.tableEmphasis}>
          {challenge.table && <BocTable {...challenge.table} />}
          {challenge.idcard && <IdCard {...challenge.idcard} />}
          {challenge.chartProfiles && <ChartTabs profiles={challenge.chartProfiles} />}
        </div>
      )}

      <p className={styles.instruction}>{renderMarkup(challenge.instruction)}</p>

      {challenge.scenario && (
        <div className={styles.scenario}>
          <p className={styles.scenarioLabel}>📖 Scénario</p>
          <p className={styles.scenarioText}>{renderMarkup(challenge.scenario)}</p>
        </div>
      )}

      {!validated && (
        <div className={styles.head}>
          <span className={styles.count}>
            {qi + 1} / {total}
          </span>
          <div className={styles.dots}>
            {challenge.questions.map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i === qi ? styles.on : ""} ${i !== qi && answers[i] !== null ? styles.seen : ""}`}
              />
            ))}
          </div>
        </div>
      )}

      {visibleIndexes.map((qidx) => {
        const q = challenge.questions[qidx];
        const answer = answers[qidx];
        const right = answer === q.answer;
        const opts = q.options ?? challenge.options;

        return (
          <div
            key={qidx}
            className={[
              styles.q,
              validated ? styles.locked : "",
              validated ? (right ? styles.qOk : styles.qKo) : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className={styles.qNo}>Affirmation {qidx + 1}</div>
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
                    onClick={() => selectOption(qidx, o.value)}
                    disabled={validated}
                  >
                    {/* Fix P1 (critique UX) : correct/faux ne se distinguaient que par la
                        couleur (même glyphe "✓" des deux côtés) — glyphe distinct ✓/✕ pour
                        les yeux, texte sr-only pour les lecteurs d'écran (WCAG 1.4.1). */}
                    <span className={styles.mk} aria-hidden="true">
                      {variant === "wrong" ? "✕" : "✓"}
                    </span>
                    {o.label}
                    {variant === "correct" && <span className="sr-only"> — réponse correcte</span>}
                    {variant === "wrong" && <span className="sr-only"> — votre réponse, incorrecte</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {!validated && (
        <div className={styles.nav}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnGhost}`}
            onClick={goPrev}
            disabled={qi === 0}
          >
            <span className={styles.arwBack}>→</span> Précédent
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnGold}`}
            disabled={answers[qi] === null}
            onClick={goNext}
          >
            {isLast ? "Valider mes réponses" : "Suivant"} <span className={styles.arw}>→</span>
          </button>
        </div>
      )}
    </div>
  );
}
