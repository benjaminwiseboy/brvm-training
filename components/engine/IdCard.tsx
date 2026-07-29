import type { IdCardData } from "@/lib/types";
import { renderMarkup } from "@/lib/markup";
import styles from "./IdCard.module.css";

/**
 * Carte d'identité d'une entreprise — toutes les informations visibles
 * d'un coup d'œil, sans tableau (M17+) : un en-tête (icône + nom), puis
 * une grille de champs label/valeur. Composant serveur, aucune
 * interactivité.
 */
export function IdCard({ icon, title, fields }: IdCardData) {
  return (
    <div className={styles.card}>
      <div className={styles.head}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <h3 className={styles.title}>{renderMarkup(title)}</h3>
      </div>
      <div className={styles.body}>
        {fields.map((f, i) => (
          <div className={styles.field} key={i}>
            <div className={styles.label}>{f.label}</div>
            <div className={styles.value}>{renderMarkup(f.value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
