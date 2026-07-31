"use client";

import Link from "next/link";
import { PHASES, getModule, orderedCodes } from "@/content/registry";
import { deriveModuleState, isFreeTrialModule, useProgress } from "@/lib/store";
import styles from "./ModuleMap.module.css";

type ModState = "done" | "current" | "unlocked" | "locked";

const ICONS: Record<ModState, string> = { done: "✓", current: "▶", unlocked: "○", locked: "🔒" };
const STATE_CLASS: Record<ModState, string> = {
  done: styles.modDone,
  current: styles.modCurrent,
  unlocked: styles.modUnlocked,
  locked: styles.modLocked,
};

/**
 * Carte des 26 modules — port de buildMap()/moduleRow() dans
 * POC-Module-1/dashboard.js.
 *
 * Gap #5 (cf. task-11-brief.md) : `content/registry.ts`'s `MODULES` n'a que
 * M01/M08 pour l'instant (Tâches 14-18 ajoutent le reste). Pour un code sans
 * module converti, `getModule(code)` renvoie `undefined` : la ligne
 * s'affiche quand même, avec le code brut en guise de titre — jamais de
 * crash, jamais de ligne masquée. Seules les lignes `locked` restent
 * non cliquables ; `done`/`current`/`unlocked` pointent vers `/module/<code>`
 * même si cette route 404 aujourd'hui faute de contenu (même gap
 * auto-résolu que `getNext`, déjà accepté à la revue de la Task 10).
 */
export function ModuleMap({ completed }: { completed: Record<string, unknown> }) {
  const { paymentStatus } = useProgress();
  const order = orderedCodes();
  const hasFullAccess = paymentStatus === "paid";

  return (
    <section className={styles.sec}>
      <div className={styles.head}>
        <h2 className={styles.h2}>Votre parcours</h2>
        <span className={styles.hint}>✓ terminé · ▶ en cours · ○ débloqué · 🔒 verrouillé</span>
      </div>

      <div className={styles.map}>
        {PHASES.map((phase) => {
          const done = phase.codes.filter((c) => completed[c]).length;
          return (
            <div className={styles.phase} key={phase.name}>
              <div className={styles.phaseHead}>
                <span className={styles.badge}>{phase.badge}</span>
                <span className={styles.name}>{phase.name}</span>
                <span className={styles.count}>
                  {done}/{phase.codes.length}
                </span>
              </div>
              <div className={styles.mods}>
                {phase.codes.map((code) => (
                  <ModuleRow
                    key={code}
                    code={code}
                    state={deriveModuleState(code, completed, order)}
                    // Essai gratuit (Fix, règle produit) : au-delà de la Phase 1,
                    // "verrouillé pour raison de paiement" prime sur l'état de
                    // progression — pas juste "pas encore atteint".
                    paywalled={!hasFullAccess && !isFreeTrialModule(code)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ModuleRow({ code, state, paywalled }: { code: string; state: ModState; paywalled: boolean }) {
  const mod = getModule(code);
  const title = mod?.title ?? code;
  const displayState: ModState = paywalled ? "locked" : state;
  // Reste cliquable même verrouillé par paiement (contrairement à un simple
  // "pas encore atteint") : mène au vrai écran d'explication (ModuleBlocked,
  // app/module/[code]/page.tsx), pas une ligne morte.
  const clickable = paywalled || state !== "locked";
  const cls = `${styles.mod} ${STATE_CLASS[displayState]} ${clickable ? styles.link : ""}`;

  const content = (
    <>
      <span className={styles.ic}>{ICONS[displayState]}</span>
      <div className={styles.body}>
        <span className={styles.code}>{code}</span>
        <span className={styles.title}>{title}</span>
      </div>
      <span className={styles.right}>
        {paywalled ? (
          <span className={styles.paywallTag}>Plan payant</span>
        ) : (
          <>
            {displayState === "current" && <span className={styles.resumeTag}>Reprendre →</span>}
            {displayState === "done" && <span className={styles.revoirTag}>Revoir ↻</span>}
            {displayState === "unlocked" && "→"}
          </>
        )}
      </span>
    </>
  );

  if (clickable) {
    return (
      <Link href={`/module/${code.toLowerCase()}`} className={cls}>
        {content}
      </Link>
    );
  }
  return <div className={cls}>{content}</div>;
}
