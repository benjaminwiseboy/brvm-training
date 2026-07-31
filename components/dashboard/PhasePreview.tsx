"use client";

import Link from "next/link";
import { PHASES } from "@/content/registry";
import { useProgress } from "@/lib/store";
import styles from "./PhasePreview.module.css";

/**
 * Aperçu compact du parcours sur le tableau de bord — une ligne par phase
 * (emoji + nom + barre de progression + compteur), lien "Voir tout →" vers
 * `/parcours` pour la liste complète module par module (cf. ModuleMap, qui
 * vivait ici avant d'être déplacé sur sa propre route — cf. task d'align.
 * maquette : le dashboard ne montre qu'un aperçu, jamais les 28 modules).
 */
export function PhasePreview({ completed }: { completed: Record<string, unknown> }) {
  const { paymentStatus } = useProgress();
  const hasFullAccess = paymentStatus === "paid";

  return (
    <section className={styles.sec}>
      <div className={styles.head}>
        <h2 className={styles.h2}>La carte du parcours</h2>
        <Link href="/parcours" className={styles.link}>
          Voir tout <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className={styles.list}>
        {PHASES.map((phase, i) => {
          const done = phase.codes.filter((c) => completed[c]).length;
          const pct = Math.round((done / phase.codes.length) * 100);
          // Essai gratuit (Fix, règle produit) : au-delà de la Phase 1 (i===0),
          // un compte non payant voit "Plan payant" au lieu du compteur — même
          // règle que ModuleMap, appliquée ici à l'échelle de la phase entière.
          const paywalled = i > 0 && !hasFullAccess;
          return (
            <Link href="/parcours" key={phase.name} className={styles.row}>
              <span className={styles.emoji}>{phase.badge}</span>
              <div className={styles.body}>
                <span className={styles.name}>{phase.name}</span>
                <div className={styles.track}>
                  <div className={styles.fill} style={{ width: `${pct}%` }} />
                </div>
              </div>
              {paywalled ? (
                <span className={styles.paywallTag}>🔒 Plan payant</span>
              ) : (
                <span className={styles.count}>
                  {done}/{phase.codes.length}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
