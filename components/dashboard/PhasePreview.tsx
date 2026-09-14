"use client";

import Link from "next/link";
import { MODULES, PHASES } from "@/content/registry";
import { isPhasePaywalled, useProgress } from "@/lib/store";
import { durationLabel, totalMinutes } from "@/lib/duration";
import styles from "./PhasePreview.module.css";

/**
 * Aperçu compact du parcours sur le tableau de bord — une ligne par phase
 * (emoji + nom + barre de progression + compteur), lien "Voir tout →" vers
 * `/parcours` pour la liste complète module par module (cf. ModuleMap, qui
 * vivait ici avant d'être déplacé sur sa propre route — cf. task d'align.
 * maquette : le dashboard ne montre qu'un aperçu, jamais les 28 modules).
 */
export function PhasePreview({ completed }: { completed: Record<string, unknown> }) {
  const { paymentStatus, moduleOverrides } = useProgress();

  return (
    <section className={styles.sec}>
      <div className={styles.head}>
        <h2 className={styles.h2}>La carte du parcours</h2>
        <Link href="/parcours" className={styles.link}>
          Voir tout <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className={styles.list}>
        {PHASES.map((phase) => {
          const done = phase.codes.filter((c) => completed[c]).length;
          const pct = Math.round((done / phase.codes.length) * 100);
          // Essai gratuit (Fix, règle produit) : un compte non payant voit
          // "Plan payant" au lieu du compteur — même règle que ModuleMap,
          // appliquée ici à l'échelle de la phase entière. La phase n'est dite
          // payante que si TOUS ses modules le sont : un accès accordé à la
          // main par l'admin (ou un paiement) doit faire disparaître la mention.
          const paywalled = isPhasePaywalled(phase.codes, paymentStatus, moduleOverrides);
          const minutes = totalMinutes(phase.codes.map((c) => MODULES[c]).filter(Boolean));
          return (
            <Link href="/parcours" key={phase.name} className={styles.row}>
              <span className={styles.emoji}>{phase.badge}</span>
              <div className={styles.body}>
                <span className={styles.name}>{phase.name}</span>
                <span className={styles.time}>⏱ {durationLabel(minutes)}</span>
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
