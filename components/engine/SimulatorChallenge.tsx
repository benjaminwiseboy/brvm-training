"use client";

import { useState } from "react";
import type { SimulatorChallenge as SimulatorChallengeData } from "@/lib/types";
import { renderMarkup } from "@/lib/markup";
import { money, fvAnnuity } from "@/lib/format";
import { CompoundChart } from "./CompoundChart";
import styles from "./SimulatorChallenge.module.css";

/**
 * Écran « Défi » alternatif : le simulateur DCA/intérêts composés (M08) —
 * port de buildSimulator()/fmtSlider()/simFig() dans POC-Module-1/app.js.
 *
 * Contrairement à QuizChallenge, il n'y a pas de score : `onDone` signale
 * juste la fin de l'écran (transition vers la Leçon, Bilan.tsx). Comme
 * QuizChallenge (Task 7) et SlideDeck (Task 6), `onDone` est appelé depuis le
 * corps du handler de clic du bouton final, jamais depuis un updater
 * `setState` (React Strict Mode double-invoque les updaters en dev).
 *
 * "use client" : 3 <input type="range"> pilotés par state + onChange.
 */
export function SimulatorChallenge({
  challenge,
  onDone,
}: {
  challenge: SimulatorChallengeData;
  onDone: () => void;
}) {
  const [vals, setVals] = useState<Record<string, number>>(() =>
    Object.fromEntries(challenge.sliders.map((s) => [s.key, s.value])),
  );

  const monthly = vals.monthly;
  const rate = vals.rate;
  const years = vals.years;

  const { invested, future } = fvAnnuity(monthly, rate, years);
  const gains = future - invested;

  return (
    <div className={styles.wrap}>
      <div className={styles.sectionHead}>
        <div className={styles.kicker}>{challenge.kicker}</div>
        <h2 className={styles.title}>{renderMarkup(challenge.title)}</h2>
        <p className={styles.instruction}>{renderMarkup(challenge.instruction)}</p>
      </div>

      <div className={styles.sim}>
        <div className={styles.simControls}>
          {challenge.sliders.map((s) => (
            <div className={styles.simRow} key={s.key}>
              <div className={styles.simTop}>
                <label className={styles.simLabel} htmlFor={`slider-${s.key}`}>
                  {s.label}
                </label>
                <span className={styles.simVal}>{fmtSlider(s.kind, vals[s.key])}</span>
              </div>
              <input
                id={`slider-${s.key}`}
                type="range"
                className={styles.simRange}
                min={s.min}
                max={s.max}
                step={s.step}
                value={vals[s.key]}
                aria-label={s.label}
                onChange={(e) => {
                  const next = parseFloat(e.target.value);
                  setVals((prev) => ({ ...prev, [s.key]: next }));
                }}
              />
            </div>
          ))}
        </div>

        <div className={styles.simOut}>
          <SimFig variant="invest" val={`${money(invested)} F`} label="Total investi" />
          <SimFig variant="final" val={`${money(future)} F`} label="Valeur finale" />
          <SimFig variant="gains" val={`${money(gains)} F`} label="Dont intérêts composés" />
        </div>

        <div className={styles.chartLegend}>
          <span className={`${styles.lg} ${styles.lgInvest}`}>
            <i></i>Argent investi
          </span>
          <span className={`${styles.lg} ${styles.lgGains}`}>
            <i></i>Intérêts composés
          </span>
        </div>
        <div className={styles.chart}>
          <CompoundChart monthly={monthly} ratePct={rate} years={years} />
        </div>

        {challenge.note && <p className={styles.simNote}>{renderMarkup(challenge.note)}</p>}
      </div>

      <button type="button" className={`${styles.btn} ${styles.btnGold}`} onClick={onDone}>
        Voir ce que ça nous apprend <span className={styles.arw}>→</span>
      </button>
    </div>
  );
}

// Port de fmtSlider() : formatage de la valeur affichée à côté du curseur,
// selon le `kind` déclaré dans lib/types.ts (SimulatorChallenge["sliders"]).
function fmtSlider(kind: "money" | "pct" | "years", v: number): string {
  if (kind === "money") return `${money(v)} FCFA`;
  if (kind === "pct") return `${v % 1 === 0 ? v : v.toFixed(1)} %`;
  if (kind === "years") return `${v}${v > 1 ? " ans" : " an"}`;
  return String(v);
}

// Port de simFig() : une des 3 pastilles de résultat (Total investi / Valeur
// finale / Dont intérêts composés).
function SimFig({ variant, val, label }: { variant: "invest" | "final" | "gains"; val: string; label: string }) {
  const variantClass = { invest: styles.simfigInvest, final: styles.simfigFinal, gains: styles.simfigGains }[variant];
  return (
    <div className={`${styles.simfig} ${variantClass}`}>
      <div className={styles.simfigVal}>{val}</div>
      <div className={styles.simfigLabel}>{label}</div>
    </div>
  );
}
