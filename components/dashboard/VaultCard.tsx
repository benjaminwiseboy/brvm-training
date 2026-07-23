import Link from "next/link";
import styles from "./VaultCard.module.css";

/**
 * Ressources du Coffre-fort — statique pour v0 (pas de backend), port
 * verbatim du champ `resources` de POC-Module-1/data/user-state.js
 * (règle de fidélité du contenu : ne pas paraphraser).
 */
const RESOURCES = [
  { icon: "📊", name: "Tracker de portefeuille", tone: "green", unlocked: true },
  { icon: "✅", name: "Check-list « 7 premiers jours »", tone: "gold", unlocked: true },
  { icon: "📅", name: "Calendrier des dividendes", tone: "teal", unlocked: false, need: "Phase 3" },
  { icon: "📝", name: "Plan d'Investissement Personnel", tone: "coral", unlocked: false, need: "Phase 4" },
] as const;

const TONE_CLASS: Record<string, string> = {
  green: styles.icGreen,
  gold: styles.icGold,
  teal: styles.icTeal,
  coral: styles.icCoral,
};

/**
 * Section « Le Coffre-fort » — port de buildResources() dans
 * POC-Module-1/dashboard.js. Le lien « Ouvrir le Coffre-fort » (Step 5 du
 * brief) n'a pas d'équivalent dans le mockup statique du POC (pas de
 * navigation réelle) : ajouté ici vers `/coffre` (Task 13 — 404 tant que
 * cette route n'existe pas, gap auto-résolu comme les liens de ModuleMap).
 */
export function VaultCard() {
  return (
    <section className={styles.sec}>
      <div className={styles.head}>
        <h2 className={styles.h2}>Le Coffre-fort</h2>
        <span className={styles.hint}>Débloqué au fil du parcours</span>
      </div>

      <div className={styles.grid}>
        {RESOURCES.map((r) => (
          <div key={r.name} className={`${styles.res} ${r.unlocked ? "" : styles.locked}`}>
            <span className={`${styles.ic} ${TONE_CLASS[r.tone]}`}>{r.icon}</span>
            <div className={styles.body}>
              <span className={styles.name}>{r.name}</span>
              <span className={styles.meta}>
                {r.unlocked ? "⬇ Disponible" : `🔒 Débloqué en ${"need" in r ? r.need : ""}`}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Link href="/coffre" className={styles.open}>
        Ouvrir le Coffre-fort <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
