"use client";

import { useCallback, useEffect, useState } from "react";
import type { Slide } from "@/lib/types";
import { BlockRenderer } from "./BlockRenderer";
import styles from "./SlideDeck.module.css";

/**
 * Navigation du cours (slides) — port de paintSlide()/go()/buildSlides()
 * dans POC-Module-1/app.js.
 *
 * - État `i` (index courant) + `seen` (slides déjà visitées, pour le
 *   stepper).
 * - Navigation ← → : boutons Précédent/Suivant ET clavier (ArrowLeft/
 *   ArrowRight).
 * - Au dernier slide, avancer déclenche `onDone()` au lieu de changer
 *   d'index (ce composant ne connaît pas le type de « défi » suivant —
 *   Quiz/Simulateur/Bilan sont hors scope ici — donc le bouton reste
 *   « Suivant » sur toutes les slides ; seul son effet change).
 * - `onSlide?.(i)` est notifié à chaque changement d'index (reprise).
 */
export function SlideDeck({
  slides,
  onSlide,
  onDone,
}: {
  slides: Slide[];
  onSlide?: (i: number) => void;
  onDone: () => void;
}) {
  const [i, setI] = useState(0);
  const [seen, setSeen] = useState<boolean[]>(() => slides.map((_, idx) => idx === 0));

  // `onDone()` est décidé DANS le handler (pas dans un updater setState) : les
  // updaters doivent rester purs (React Strict Mode les exécute 2× en dev, ce
  // qui déclencherait onDone deux fois par clic sur la dernière slide).
  const go = useCallback(
    (dir: number) => {
      const n = i + dir;
      if (n < 0) return; // borne basse : Précédent no-op (bouton déjà disabled à i===0)
      if (n >= slides.length) {
        onDone(); // dernière slide + avancer → exactement un appel par clic
        return;
      }
      setSeen((prev) => {
        if (prev[n]) return prev;
        const next = [...prev];
        next[n] = true;
        return next;
      });
      setI(n);
    },
    [i, slides.length, onDone],
  );

  // Notifie le parent à chaque changement d'index (reprise du cours).
  useEffect(() => {
    onSlide?.(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ne se déclenche que sur i, par spec (task-6-brief.md)
  }, [i]);

  // Navigation clavier ← → — port du addEventListener("keydown", …) de buildSlides().
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [go]);

  const slide = slides[i];
  const isLast = i === slides.length - 1;

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <span className={styles.count}>
          {i + 1} / {slides.length}
        </span>
        <div className={styles.dots}>
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`${styles.dot} ${idx === i ? styles.on : ""} ${idx !== i && seen[idx] ? styles.seen : ""}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.phone}>
          Slide {i + 1} / {slides.length}
        </div>
        <h2 className={styles.title}>{slide.title}</h2>
        <div className={styles.body} key={i}>
          {slide.blocks.map((block, bi) => (
            <BlockRenderer key={bi} block={block} />
          ))}
        </div>
      </div>

      <div className={styles.nav}>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnGhost}`}
          onClick={() => go(-1)}
          disabled={i === 0}
        >
          <span className={styles.arwBack}>→</span> Précédent
        </button>
        <button type="button" className={`${styles.btn} ${isLast ? styles.btnGold : styles.btnPrimary}`} onClick={() => go(1)}>
          Suivant <span className={styles.arw}>→</span>
        </button>
      </div>
    </div>
  );
}
