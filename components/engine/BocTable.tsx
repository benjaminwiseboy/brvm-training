import type { BocTableData } from "@/lib/types";
import styles from "./BocTable.module.css";

/**
 * Extrait de BOC rendu en vrai tableau HTML (données fictives ou réelles
 * selon le module, structure fidèle à un bulletin réel) — remplace le repli
 * "valeurs recopiées verbatim dans un paragraphe" des premiers modules
 * Phase 3. Composant serveur : aucune interactivité, juste un <table>
 * scrollable horizontalement (le BOC réel a beaucoup de colonnes).
 */
export function BocTable({ caption, columns, rows, highlightCols }: BocTableData) {
  return (
    <figure className={styles.wrap}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={highlightCols?.includes(i) ? styles.hl : ""}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className={highlightCols?.includes(ci) ? styles.hl : ""}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
