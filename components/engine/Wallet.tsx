"use client";

import { useEffect, useRef, useState } from "react";
import { money } from "@/lib/format";
import styles from "./Wallet.module.css";

type Chip = { id: number; amount: number };

const ROLL_DURATION = 900; // ms — cf. rollCapital() dans POC-Module-1/app.js
const CORRECTION_FLASH = 600; // ms — durée de l'animation .wallet.is-correction (shake)
const CHIP_LIFETIME = 1800; // ms — durée avant retrait du DOM (cf. flashDelta())

/**
 * Portefeuille fictif animé — port de rollCapital()/flashDelta() dans
 * POC-Module-1/app.js.
 *
 * `amount` est la valeur courante affichée : au changement, le compteur
 * « roule » de l'ancienne à la nouvelle valeur via requestAnimationFrame.
 * `delta` (optionnel) déclenche, à chaque valeur non nulle reçue, un jeton
 * flottant +X/−X et — si négatif — un flash "correction" sur le portefeuille.
 */
export function Wallet({ amount, delta }: { amount: number; delta?: number }) {
  const [display, setDisplay] = useState(amount);
  const [chip, setChip] = useState<Chip | null>(null);
  const [isCorrection, setIsCorrection] = useState(false);

  const prevAmount = useRef(amount);
  const chipSeq = useRef(0);

  // Roule le compteur de l'ancienne à la nouvelle valeur (easeOutCubic, 900ms).
  // Premier rendu : `prevAmount` vaut déjà `amount` (état initial de useState
  // ci-dessus), donc from === to et l'effet sort sans animer.
  useEffect(() => {
    const from = prevAmount.current;
    const to = amount;
    prevAmount.current = to;
    if (from === to) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduceMotion ? 0 : ROLL_DURATION;

    let raf = 0;
    const start = performance.now();

    function tick(now: number) {
      const p = duration === 0 ? 1 : Math.max(0, Math.min((now - start) / duration, 1));
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [amount]);

  // Jeton +/− flottant + flash « correction » (delta < 0).
  useEffect(() => {
    if (!delta) return;

    chipSeq.current += 1;
    setChip({ id: chipSeq.current, amount: delta });

    const timers: ReturnType<typeof setTimeout>[] = [];
    if (delta < 0) {
      setIsCorrection(true);
      timers.push(setTimeout(() => setIsCorrection(false), CORRECTION_FLASH));
    }
    timers.push(setTimeout(() => setChip(null), CHIP_LIFETIME));

    return () => timers.forEach(clearTimeout);
  }, [delta]);

  return (
    <div className={`${styles.wallet} ${isCorrection ? styles.isCorrection : ""}`} aria-live="polite">
      <div className={styles.meta}>
        <div className={styles.label}>Portefeuille</div>
        <div className={styles.amount}>
          {money(display)}
          <span className={styles.cur}>FCFA</span>
        </div>
      </div>
      {chip && (
        <span
          key={chip.id}
          className={`${styles.deltaChip} ${chip.amount >= 0 ? styles.gain : styles.loss} ${styles.run}`}
        >
          {chip.amount >= 0 ? "+" : "−"}
          {money(Math.abs(chip.amount))}
        </span>
      )}
    </div>
  );
}
