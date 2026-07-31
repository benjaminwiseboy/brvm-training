import Link from "next/link";
import styles from "./VaultCard.module.css";

/**
 * Ressources du Coffre-fort — statique pour v0 (pas de backend). Les 4
 * premières sont un port verbatim du champ `resources` de
 * POC-Module-1/data/user-state.js (règle de fidélité du contenu : ne pas
 * paraphraser) ; Glossaire interactif et Simulateur DCA ajoutés pour
 * s'aligner sur la maquette design_handoff_brvm_learning (6 ressources),
 * `desc` avec le même ton que les autres — le glossaire correspond à du
 * contenu réel déjà présent dans le projet (`BRVM Learning/Glossaire.txt`).
 */
export const RESOURCES = [
  {
    icon: "📊",
    name: "Tracker de portefeuille",
    desc: "Suivez vos positions et calculez vos gains au fil du parcours.",
    tone: "green",
    unlocked: true,
  },
  {
    icon: "✅",
    name: "Check-list « 7 premiers jours »",
    desc: "Les étapes clés pour bien démarrer après votre inscription.",
    tone: "gold",
    unlocked: true,
  },
  {
    icon: "📖",
    name: "Glossaire interactif",
    desc: "Près de 60 termes financiers expliqués simplement.",
    tone: "blue",
    unlocked: true,
  },
  {
    icon: "📅",
    name: "Calendrier des dividendes",
    desc: "Les dates de détachement à ne pas manquer.",
    tone: "teal",
    unlocked: false,
    need: "Phase 3",
  },
  {
    icon: "📈",
    name: "Simulateur DCA",
    desc: "Modèle pour simuler vos versements réguliers.",
    tone: "violet",
    unlocked: false,
    need: "Phase 2",
  },
  {
    icon: "📝",
    name: "Plan d'Investissement Personnel",
    desc: "Le modèle pour formaliser votre stratégie.",
    tone: "coral",
    unlocked: false,
    need: "Phase 4",
  },
] as const;

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
 * ressources (comme la maquette), lien « Voir tout → » dans l'en-tête
 * (Fix, alignement maquette : auparavant en bas de carte, style
 * `.open` — la maquette place ce lien à côté du titre de section, même
 * position que `PhasePreview`).
 */
export function VaultCard() {
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
        {preview.map((r) => (
          <div key={r.name} className={`${styles.res} ${r.unlocked ? "" : styles.locked}`}>
            <span className={`${styles.ic} ${TONE_CLASS[r.tone]}`}>{r.icon}</span>
            <div className={styles.body}>
              <span className={styles.name}>{r.name}</span>
              <span className={styles.meta}>
                {/* "Bientôt disponible" (pas "Disponible") : cohérent avec le
                    badge "Bientôt" de /coffre — aucun téléchargement réel
                    n'est câblé, "Disponible" serait trompeur. */}
                {r.unlocked ? "Bientôt disponible" : `🔒 Débloqué en ${"need" in r ? r.need : ""}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
