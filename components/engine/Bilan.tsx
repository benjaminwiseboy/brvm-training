"use client";

import type { Feedback } from "@/lib/types";
import { renderMarkup } from "@/lib/markup";
import { money } from "@/lib/format";
import { ScoreRing } from "./ScoreRing";
import styles from "./Bilan.module.css";

/**
 * Écran « Bilan / Feedback » — port de buildFeedback() dans
 * POC-Module-1/app.js (chemin quiz uniquement ; le chemin « leçon » du
 * simulateur — buildLesson(), déclenché par feedback.golden — est laissé en
 * TODO pour la Task 8, qui branchera aussi le ModulePlayer).
 *
 * "use client" : le bouton « Continuer » attache `onClick={onNext}`
 * directement sur un élément hôte, ce qui requiert une frontière Client
 * Component (cf. node_modules/next/dist/docs/.../05-server-and-client-
 * components.md et le précédent Hero.tsx, Task 6). Le reste du composant
 * n'a ni state ni effet — c'est un rendu purement dérivé des props.
 */
export function Bilan({
  result,
  feedback,
  onNext,
}: {
  result: { correct: number; total: number; capitalDelta: number };
  feedback: Feedback;
  onNext: () => void;
}) {
  // Chemin « leçon » (simulateur, feedback.headline/golden/plan) : pas de
  // score à afficher ici. Hors scope Task 7 — TODO Task 8 (buildLesson()).
  if (!feedback.perfect || !feedback.imperfect) {
    return (
      <div className={styles.wrap}>
        <p className={styles.eyebrow}>Section 3 · La Leçon</p>
        {/* TODO(Task 8) : rendre feedback.headline + feedback.golden + feedback.plan,
            cf. buildLesson() dans POC-Module-1/app.js. */}
        <button type="button" className={`${styles.btn} ${styles.btnGold}`} onClick={onNext}>
          Continuer <span className={styles.arw}>→</span>
        </button>
      </div>
    );
  }

  const { correct, total, capitalDelta } = result;
  const perfect = correct === total;
  const pct = total > 0 ? (correct / total) * 100 : 0;
  const data = perfect ? feedback.perfect : feedback.imperfect;

  return (
    <div className={styles.wrap}>
      <p className={styles.eyebrow}>Section 3 · Le Bilan</p>

      <div className={`${styles.scorecard} ${perfect ? styles.isWin : styles.isSoft}`}>
        <div className={styles.ring}>
          <ScoreRing pct={pct} />
        </div>
        <div className={styles.main}>
          <div className={styles.icon}>{data.icon}</div>
          <h2 className={styles.title}>{renderMarkup(data.title)}</h2>
          <p className={styles.body}>{renderMarkup(data.body)}</p>

          <div className={styles.stats}>
            <Stat cls={styles.stGreen} icon="🎯" val={`${correct} / ${total}`} label="Score" />
            {/* NB : la POC affiche ici le capital TOTAL du portefeuille (money(state.capital)),
                une donnée que ce composant ne reçoit pas (l'interface exacte du brief ne passe
                que `result.capitalDelta`, pas le capital courant). On affiche donc la variation
                signée de cette manche — le total réel est porté par <Wallet/> ailleurs sur la
                page (ModulePlayer, Task 8). Voir task-7-report.md. */}
            <Stat
              cls={styles.stGold}
              icon="💰"
              val={`${capitalDelta >= 0 ? "+" : "−"}${money(Math.abs(capitalDelta))}`}
              label="Portefeuille"
            />
            {perfect ? (
              <Stat cls={styles.stTeal} icon="⭐" val={`+${money(capitalDelta)}`} label="Bonus" />
            ) : (
              <Stat
                cls={styles.stClay}
                icon="📉"
                val={`−${money(Math.abs(capitalDelta))}`}
                label="Correction"
              />
            )}
          </div>
        </div>
      </div>

      {feedback.explanations && feedback.explanations.length > 0 && (
        <div className={styles.exps}>
          <h3>Pourquoi ? Les {total} explications</h3>
          {feedback.explanations.map((e, i) => (
            <div className={styles.exp} key={i}>
              <span className={styles.expBadge}>{e.verdict}</span>
              <div className={styles.expBody}>
                <p className={styles.expTitle}>{renderMarkup(e.title)}</p>
                <p className={styles.expText}>{renderMarkup(e.body)}</p>
                {e.note && <div className={styles.expNote}>{renderMarkup(e.note)}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      <button type="button" className={`${styles.btn} ${styles.btnGold}`} onClick={onNext}>
        Continuer <span className={styles.arw}>→</span>
      </button>
    </div>
  );
}

function Stat({ cls, icon, val, label }: { cls: string; icon: string; val: string; label: string }) {
  return (
    <div className={`${styles.stat} ${cls}`}>
      <span className={styles.statIc}>{icon}</span>
      <div className={styles.statMeta}>
        <span className={styles.statVal}>{val}</span>
        <span className={styles.statLabel}>{label}</span>
      </div>
    </div>
  );
}
