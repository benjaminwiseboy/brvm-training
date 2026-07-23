"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProgress } from "@/lib/store";
import { money } from "@/lib/format";
import { renderMarkup } from "@/lib/markup";
import styles from "./Onboarding.module.css";

type Tone = "blue" | "gold" | "green" | "coral";
type Visual = "wallet-static" | "wallet-reveal" | "ladder" | "format" | "features";

type Step = {
  icon: string;
  tone: Tone;
  title: string;
  text?: string;
  visual?: Visual;
  cta?: string;
};

// Port verbatim des 6 étapes (`steps`) de POC-Module-1/onboarding.js.
const STEPS: Step[] = [
  {
    icon: "👋",
    tone: "blue",
    title: "Bienvenue dans BRVM Learning !",
    text: "30 secondes pour comprendre comment se passe la formation. C'est un jeu — et vous allez adorer y jouer.",
  },
  {
    icon: "💰",
    tone: "gold",
    title: "On vous confie 1 000 000 FCFA… virtuels.",
    text: "Vous vous entraînez avec un capital fictif : **aucun risque, aucun franc réel engagé.**",
    visual: "wallet-static",
  },
  {
    icon: "🏆",
    tone: "gold",
    title: "Votre mission : le plus gros portefeuille possible.",
    text: "À chaque bonne réponse, il grossit. Et vous grimpez les grades :",
    visual: "ladder",
  },
  {
    icon: "🧭",
    tone: "blue",
    title: "Chaque module, en 3 temps.",
    text: "Toujours le même rythme, simple à suivre :",
    visual: "format",
  },
  {
    icon: "🎁",
    tone: "green",
    title: "Des bonus, et zéro pression.",
    visual: "features",
  },
  {
    icon: "🚀",
    tone: "coral",
    title: "Prêt ? Voici votre million.",
    text: "Votre capital de départ vous attend. Bonne formation, et bienvenue à la BRVM !",
    visual: "wallet-reveal",
    cta: "Recevoir mon million et commencer",
  },
];

// Port verbatim de visLadder() dans POC-Module-1/onboarding.js.
const LADDER = [
  { em: "🥉", name: "Épargnant Livret A", sub: "Le point de départ", last: false },
  { em: "🥈", name: "Investisseur Curieux", sub: "Phase 2", last: false },
  { em: "🥇", name: "Analyste Stratège", sub: "Phase 3", last: false },
  { em: "🎓", name: "Analyste Confirmé", sub: "Défi de synthèse", last: false },
  { em: "💎", name: "Loup de la BRVM", sub: "La consécration", last: true },
];

// Port verbatim de visFormat() dans POC-Module-1/onboarding.js.
const FORMAT_STEPS = [
  { n: 1, em: "📖", t: "Le Contexte", d: "le cours, en petites slides faciles à lire.", bg: "var(--blue)" },
  { n: 2, em: "🎯", t: "Le Défi", d: "un quiz, un simulateur ou un cas pratique.", bg: "var(--or-deep)" },
  { n: 3, em: "💡", t: "Le Feedback", d: "on corrige et on comprend pourquoi.", bg: "var(--pos)" },
];

// Port verbatim de visFeatures() dans POC-Module-1/onboarding.js.
const FEATURES = [
  {
    ic: "🗝️",
    tone: "gold" as const,
    t: "Le Coffre-fort",
    d: "Des outils (tracker, check-lists, modèles…) se débloquent au fil du parcours.",
  },
  {
    ic: "🏠",
    tone: "green" as const,
    t: "Votre tableau de bord",
    d: "Mettez en pause, reprenez exactement là où vous vous étiez arrêté.",
  },
];

const ROLL_DURATION = 1400; // ms — cf. rollTo(roll, 1000000, 1400) dans show() (onboarding.js)

/**
 * Visuel « portefeuille » — port de visWallet(reveal) dans onboarding.js.
 *
 * `reveal=false` (étape 2) : montant déjà réglé (1 000 000, statique) + les
 * deux lignes d'explication (bonne réponse / erreur).
 * `reveal=true` (étape 6, seule occurrence) : part de 0 et anime jusqu'à
 * 1 000 000 sur 1400ms (easeOutCubic, cf. Wallet.tsx), sans lignes
 * d'explication (POC : `if (!reveal) { … }`). L'effet ne dépend que du
 * montage : à chaque fois que cette étape redevient active, le composant est
 * remonté (clé `idx` sur le conteneur `.step` dans Onboarding ci-dessous),
 * donc l'animation se rejoue — comme `show(i)` reconstruit `#onbStage` à
 * chaque appel dans le POC.
 */
function OnbWallet({ reveal }: { reveal: boolean }) {
  const [display, setDisplay] = useState(reveal ? 0 : 1_000_000);

  useEffect(() => {
    if (!reveal) return;

    // Comme Wallet.tsx : mouvement réduit → duration 0 (le tick ci-dessous
    // pose alors p=1 dès la première frame, un seul setDisplay(1000000) via
    // rAF, jamais d'appel synchrone à setState dans le corps de l'effet).
    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduceMotion ? 0 : ROLL_DURATION;

    let raf = 0;
    const start = performance.now();
    function tick(now: number) {
      const p = duration === 0 ? 1 : Math.max(0, Math.min((now - start) / duration, 1));
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(1_000_000 * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ne s'anime qu'au montage (une fois par entrée sur l'étape), pas à chaque render
  }, []);

  return (
    <div className={styles.wallet}>
      <div className={styles.walletLabel}>Votre capital d&rsquo;entraînement</div>
      <div className={styles.walletAmt}>
        {money(display)}
        <span className={styles.cur}>FCFA</span>
      </div>
      {!reveal && (
        <div className={styles.walletRows}>
          <div className={styles.row}>
            <span className={`${styles.chip} ${styles.chipUp}`}>▲</span>
            <span>
              Bonne réponse → votre portefeuille <b>monte</b>
            </span>
          </div>
          <div className={styles.row}>
            <span className={`${styles.chip} ${styles.chipDown}`}>▼</span>
            <span>Erreur → une petite « correction de marché »</span>
          </div>
        </div>
      )}
    </div>
  );
}

function OnbLadder() {
  return (
    <div className={styles.ladder}>
      {LADDER.map((r) => (
        <div key={r.name} className={`${styles.rung} ${r.last ? styles.rungLast : ""}`}>
          <span className={styles.rungEm}>{r.em}</span>
          <div>
            <div className={styles.rungName}>{r.name}</div>
            <div className={styles.rungSub}>{r.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OnbFormat() {
  return (
    <div className={styles.fmt}>
      {FORMAT_STEPS.map((c) => (
        <div key={c.n} className={styles.fmtCard}>
          <span className={styles.fmtCardN} style={{ background: c.bg }}>
            {c.n}
          </span>
          <span className={styles.fmtCardEm}>{c.em}</span>
          <div>
            <div className={styles.fmtCardT}>{c.t}</div>
            <div className={styles.fmtCardD}>{c.d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OnbFeatures() {
  return (
    <div className={styles.feat}>
      {FEATURES.map((f) => (
        <div key={f.t} className={styles.featRow}>
          <span className={`${styles.featIc} ${f.tone === "gold" ? styles.featIcGold : styles.featIcGreen}`}>
            {f.ic}
          </span>
          <div>
            <div className={styles.featT}>{f.t}</div>
            <div className={styles.featD}>{f.d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function renderVisual(visual: Visual | undefined) {
  switch (visual) {
    case "wallet-static":
      return <OnbWallet reveal={false} />;
    case "wallet-reveal":
      return <OnbWallet reveal={true} />;
    case "ladder":
      return <OnbLadder />;
    case "format":
      return <OnbFormat />;
    case "features":
      return <OnbFeatures />;
    default:
      return null;
  }
}

function iconClass(tone: Tone): string {
  switch (tone) {
    case "blue":
      return styles.iconBlue;
    case "gold":
      return styles.iconGold;
    case "green":
      return styles.iconGreen;
    case "coral":
      return styles.iconCoral;
  }
}

/**
 * Carrousel d'onboarding (6 étapes) — port du contrôleur show()/next()/prev()
 * de POC-Module-1/onboarding.js.
 *
 * « Passer » (gap non couvert par le brief, cf. task-12-report.md) : dans le
 * POC, le lien Passer navigue directement vers index.html (le POC n'a aucun
 * état "onboarded" persistant, c'est un mockup multi-pages statique). Ici, où
 * `state.onboarded` gouverne la redirection `/` → `/onboarding` (Task 11),
 * "Passer" doit appeler `setOnboarded()` avant de naviguer vers le module 1 —
 * exactement comme le CTA de la dernière étape — sinon l'apprenant qui saute
 * les slides retomberait indéfiniment sur `/onboarding` à son prochain
 * passage par `/`. C'est bien "passer les slides explicatives", pas "sauter
 * la porte d'entrée elle-même".
 *
 * `finish()` (setOnboarded + router.push) est appelé depuis le corps des
 * handlers de clic/clavier, jamais depuis un updater `setIdx` : leçon Strict
 * Mode des Tasks 6/7/10 (SlideDeck.tsx, QuizChallenge.tsx) — un updater
 * doublé en dev ne doit jamais déclencher deux fois un effet de bord réel.
 */
export function Onboarding() {
  const router = useRouter();
  const { setOnboarded } = useProgress();
  const [idx, setIdx] = useState(0);

  const finish = useCallback(() => {
    setOnboarded();
    router.push("/module/m01");
  }, [setOnboarded, router]);

  const go = useCallback(
    (dir: number) => {
      const n = idx + dir;
      if (n < 0) return; // Précédent no-op sous idx 0 (bouton déjà disabled)
      if (n >= STEPS.length) {
        finish(); // dernière étape + avancer → CTA "Recevoir mon million…"
        return;
      }
      setIdx(n);
    },
    [idx, finish],
  );

  // Navigation clavier ←/→ — port de l'addEventListener("keydown", …) de boot().
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [go]);

  const step = STEPS[idx];
  const last = idx === STEPS.length - 1;

  return (
    <div className={styles.onb}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>B</span>
          <span className={styles.brandName}>BRVM Learning</span>
        </div>
        <button type="button" className={styles.skip} onClick={finish}>
          Passer →
        </button>
      </div>

      <div className={styles.progress} aria-hidden="true">
        {STEPS.map((_, k) => (
          <div
            key={k}
            className={`${styles.seg} ${k < idx ? styles.segDone : ""} ${k === idx ? styles.segActive : ""}`}
          />
        ))}
      </div>

      <div className={styles.stage}>
        <div className={styles.step} key={idx}>
          <div className={`${styles.icon} ${iconClass(step.tone)}`}>{step.icon}</div>
          <h1 className={styles.title}>{step.title}</h1>
          {step.text && <p className={styles.text}>{renderMarkup(step.text)}</p>}
          {renderVisual(step.visual)}
        </div>
      </div>

      <div className={styles.nav}>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnGhost}`}
          onClick={() => go(-1)}
          disabled={idx === 0}
        >
          <span className={styles.arwBack}>→</span> Précédent
        </button>
        <button type="button" className={`${styles.btn} ${last ? styles.btnGold : styles.btnPrimary}`} onClick={() => go(1)}>
          {step.cta ?? "Suivant"} <span className={styles.arw}>→</span>
        </button>
      </div>
    </div>
  );
}
