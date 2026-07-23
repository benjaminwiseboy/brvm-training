"use client";

import { AppShell } from "@/components/nav/AppShell";
import { RESOURCES } from "@/components/dashboard/VaultCard";
import styles from "./page.module.css";

const TONE_CLASS: Record<string, string> = {
  green: styles.icGreen,
  gold: styles.icGold,
  teal: styles.icTeal,
  coral: styles.icCoral,
};

/**
 * `/coffre` — page complète du Coffre-fort (Task 13), pendant en pleine
 * page de la section compacte `VaultCard` du tableau de bord (Task 11).
 * Réutilise `RESOURCES` exportée de `VaultCard.tsx` (source unique des
 * données — pas de duplication) : mêmes 4 outils, mêmes icônes/tons.
 *
 * Choix d'affichage (documenté dans task-13-report.md) : contrairement à
 * `VaultCard` qui distingue « ⬇ Disponible » (unlocked) de
 * « 🔒 Débloqué en Phase X » (locked), chaque carte affiche ici, sans
 * exception, un badge « Bientôt » non cliquable — aucun outil n'a de
 * fonctionnalité réelle de téléchargement/interaction en v0 (pas de
 * backend, pas de stockage de fichiers), donc « Bientôt » est l'état
 * honnête pour les quatre. Le statut narratif « Débloqué en Phase X »
 * reste affiché en sous-texte pour les outils encore verrouillés dans le
 * parcours, à titre d'information secondaire.
 *
 * Pas d'appel à `useProgress()` ici : la grille est entièrement statique
 * (comme `RESOURCES` et `VaultCard` elle-même, qui ne le consomme pas non
 * plus) — `AppShell variant="dash"` lit déjà `useProgress()` pour son
 * propre portefeuille/statut de sidebar, et fournit le lien retour
 * dashboard (item « Accueil ») demandé par le Step 2 du brief.
 */
export default function CoffrePage() {
  return (
    <AppShell variant="dash">
      <section className={styles.sec}>
        <div className={styles.head}>
          <h1 className={styles.h1}>Le Coffre-fort</h1>
          <span className={styles.hint}>Vos outils, au fil du parcours</span>
        </div>

        <div className={styles.grid}>
          {RESOURCES.map((r) => (
            <div key={r.name} className={styles.card}>
              <span className={`${styles.ic} ${TONE_CLASS[r.tone]}`}>{r.icon}</span>
              <div className={styles.body}>
                <span className={styles.name}>{r.name}</span>
                {!r.unlocked && "need" in r && (
                  <span className={styles.need}>🔒 Débloqué en {r.need}</span>
                )}
              </div>
              <span className={styles.soon}>Bientôt</span>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
