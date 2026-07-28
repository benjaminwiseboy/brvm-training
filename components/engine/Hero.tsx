"use client";

import type { Module } from "@/lib/types";
import { renderMarkup } from "@/lib/markup";
import { money } from "@/lib/format";
import styles from "./Hero.module.css";

// ①②③④ — port de rulesList() dans POC-Module-1/app.js (au-delà de 4 règles : puce générique).
const RULE_MARKERS = ["①", "②", "③", "④"];

function RulesList({ items }: { items: string[] }) {
  return (
    <ul className={styles.rules}>
      {items.map((rule, i) => (
        <li key={i}>
          <span className={styles.rk}>{RULE_MARKERS[i] ?? "•"}</span>
          <span>{renderMarkup(rule)}</span>
        </li>
      ))}
    </ul>
  );
}

function ObjectivesList({ items }: { items: string[] }) {
  return (
    <div className={styles.objectives}>
      <p className={styles.objectivesLabel}>🎯 À la fin de ce module, vous saurez :</p>
      <ul className={styles.objectivesList}>
        {items.map((o, i) => (
          <li key={i}>{renderMarkup(o)}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Écran d'accueil du module — port de buildHero() dans POC-Module-1/app.js.
 *
 * Deux variantes, selon le contenu du module (lib/types.ts `Module["hero"]`) :
 * - « cadeau » (`hero.rules` présent, pas de `hero.card`) : capital de départ
 *   affiché en gros + règles du jeu (M01).
 * - carte thématique (`hero.card` présent) : titre + règles propres au
 *   module, sans capital « cadeau » (M08).
 *
 * Composant client : le CTA a besoin d'un onClick (`onStart`).
 */
export function Hero({ module, onStart }: { module: Module; onStart: () => void }) {
  const h = module.hero;

  return (
    <div className={styles.hero}>
      <p className={styles.eyebrow}>{h.eyebrow}</p>
      <h1 className={styles.title}>{renderMarkup(h.headline)}</h1>
      <p className={styles.lead}>{renderMarkup(h.lead)}</p>

      <div className={styles.card}>
        {h.card ? (
          <>
            <p className={styles.label}>{h.card.label}</p>
            <h2 className={styles.cardTitle}>{h.card.title}</h2>
            {h.card.hint && <p className={styles.hint}>{renderMarkup(h.card.hint)}</p>}
            <RulesList items={h.card.rules} />
          </>
        ) : (
          <>
            <p className={styles.label}>Votre capital d&rsquo;entraînement</p>
            <div className={styles.amount}>
              {money(module.startingCapital ?? 0)}
              <span className={styles.cur}>FCFA</span>
            </div>
            <p className={styles.hint}>Fictif — pour apprendre sans risquer un seul franc réel.</p>
            <RulesList items={h.rules ?? []} />
          </>
        )}
      </div>

      {h.objectives && h.objectives.length > 0 && <ObjectivesList items={h.objectives} />}

      <button type="button" className={styles.cta} onClick={onStart}>
        {h.cta} <span className={styles.arw}>→</span>
      </button>
    </div>
  );
}
