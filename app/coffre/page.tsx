"use client";

import Link from "next/link";
import { AppShell } from "@/components/nav/AppShell";
import { useProgress } from "@/lib/store";
import { RESOURCES, gateLabel, isResourceUnlocked } from "@/content/vault";
import styles from "./page.module.css";

const TONE_CLASS: Record<string, string> = {
  green: styles.icGreen,
  gold: styles.icGold,
  teal: styles.icTeal,
  coral: styles.icCoral,
  blue: styles.icBlue,
  violet: styles.icViolet,
};

/**
 * `/coffre` — page complète du Coffre-fort, pendant en pleine page de la
 * section compacte `VaultCard` du tableau de bord. Les deux lisent le même
 * catalogue (`content/vault.ts`).
 *
 * Trois états de carte, et un seul est cliquable :
 * - **débloquée ET construite** (`href`) : carte-lien, badge « Ouvrir » ;
 * - **débloquée mais pas encore construite** : badge « Bientôt » — c'est le
 *   cas de tous les outils restants, aucun téléchargement n'est câblé ;
 * - **verrouillée** : la condition est affichée en clair (« Débloqué en
 *   Phase 3 », « Débloqué en fin de parcours »), désormais réellement
 *   évaluée sur la progression et non plus décorative.
 */
export default function CoffrePage() {
  const { state, hydrated } = useProgress();

  return (
    <AppShell variant="dash">
      <section className={styles.sec}>
        <div className={styles.head}>
          <h1 className={styles.h1}>Le Coffre-fort</h1>
          <span className={styles.hint}>Vos outils, au fil du parcours</span>
        </div>

        <div className={styles.grid}>
          {RESOURCES.map((r) => {
            // Avant hydratation, l'état de progression n'est pas fiable : on
            // affiche tout verrouillé plutôt que d'ouvrir une carte l'espace
            // d'un rendu (même précaution qu'app/page.tsx).
            const unlocked = hydrated && isResourceUnlocked(r, state.completed);
            const open = unlocked && r.href;
            const inner = (
              <>
                <span className={`${styles.ic} ${TONE_CLASS[r.tone]}`}>{r.icon}</span>
                <div className={styles.body}>
                  <span className={styles.name}>{r.name}</span>
                  <span className={styles.desc}>{r.desc}</span>
                  {!unlocked && (
                    <span className={styles.need}>🔒 Débloqué en {gateLabel(r.gate)}</span>
                  )}
                </div>
                <span className={open ? styles.openBadge : styles.soon}>
                  {open ? "Ouvrir →" : "Bientôt"}
                </span>
              </>
            );

            return open ? (
              <Link key={r.id} href={r.href!} className={`${styles.card} ${styles.cardOpen}`}>
                {inner}
              </Link>
            ) : (
              <div key={r.id} className={`${styles.card} ${unlocked ? "" : styles.cardLocked}`}>
                {inner}
              </div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
