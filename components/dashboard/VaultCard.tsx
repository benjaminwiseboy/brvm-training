"use client";

import Link from "next/link";
import { useProgress } from "@/lib/store";
import { RESOURCES, gateLabel, isResourceUnlocked } from "@/content/vault";
import styles from "./VaultCard.module.css";

const TONE_CLASS: Record<string, string> = {
  green: styles.icGreen,
  gold: styles.icGold,
  teal: styles.icTeal,
  coral: styles.icCoral,
  blue: styles.icBlue,
  violet: styles.icViolet,
};

/**
 * Section « Le Coffre-fort » du tableau de bord — aperçu des 4 premières
 * ressources (comme la maquette), lien « Voir tout → » dans l'en-tête.
 *
 * Le catalogue vit désormais dans `content/vault.ts` (partagé avec `/coffre`
 * et l'écran de fin de parcours), et l'état de chaque carte est CALCULÉ à
 * partir de la progression au lieu d'être un booléen figé : une ressource
 * réellement disponible devient cliquable, les autres restent honnêtes.
 */
export function VaultCard() {
  const { state } = useProgress();
  const preview = RESOURCES.slice(0, 4);

  return (
    <section className={styles.sec}>
      <div className={styles.head}>
        <h2 className={styles.h2}>Le Coffre-fort</h2>
        <Link href="/coffre" className={styles.link}>
          Voir tout <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className={styles.grid}>
        {preview.map((r) => {
          const unlocked = isResourceUnlocked(r, state.completed);
          const open = unlocked && r.href;
          const meta = !unlocked
            ? `🔒 Débloqué en ${gateLabel(r.gate)}`
            : open
              ? "Ouvrir →"
              : // "Bientôt disponible" (pas "Disponible") : cohérent avec le badge
                // "Bientôt" de /coffre — sans `href`, aucun outil réel n'est câblé.
                "Bientôt disponible";
          const inner = (
            <>
              <span className={`${styles.ic} ${TONE_CLASS[r.tone]}`}>{r.icon}</span>
              <div className={styles.body}>
                <span className={styles.name}>{r.name}</span>
                <span className={`${styles.meta} ${open ? styles.metaOpen : ""}`}>{meta}</span>
              </div>
            </>
          );

          return open ? (
            <Link key={r.id} href={r.href!} className={`${styles.res} ${styles.resOpen}`}>
              {inner}
            </Link>
          ) : (
            <div key={r.id} className={`${styles.res} ${unlocked ? "" : styles.locked}`}>
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
