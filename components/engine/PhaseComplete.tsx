"use client";

import styles from "./PhaseComplete.module.css";

/**
 * Écran dédié affiché après le Bilan du DERNIER module d'une phase (M04 =
 * fin Phase 1, M10 = fin Phase 2 après renumérotation) — remplace l'ancien
 * procédé qui glissait la félicitation dans le `.note` d'une explication de
 * quiz (M04) ou dans `feedback.plan` (M10/ex-M08) : un vrai écran à part
 * entière, avec badge et récap en puces (demande explicite de la revue).
 */
export function PhaseComplete({
  badge,
  name,
  recap,
  futureNote,
  onNext,
}: {
  badge: string;
  name: string;
  recap: string[];
  /** Fonctionnalité annoncée mais pas encore construite (ex. export PDF, M10) — rendue en bouton désactivé, pas un lien mort. */
  futureNote?: string;
  onNext: () => void;
}) {
  return (
    <div className={styles.wrap}>
      <p className={styles.eyebrow}>Fin de phase</p>

      <div className={styles.card}>
        <div className={styles.badge} aria-hidden="true">
          {badge}
        </div>
        <h2 className={styles.title}>Bravo, vous terminez {name} !</h2>
        <p className={styles.sub}>Voici ce que vous savez faire maintenant :</p>
        <ul className={styles.recap}>
          {recap.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>

        {futureNote && (
          <button type="button" className={styles.futureBtn} disabled>
            {futureNote}
          </button>
        )}
      </div>

      <button type="button" className={styles.btn} onClick={onNext}>
        Continuer <span className={styles.arw}>→</span>
      </button>
    </div>
  );
}
