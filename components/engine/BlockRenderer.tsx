import type { Block } from "@/lib/types";
import { renderMarkup } from "@/lib/markup";
import styles from "./BlockRenderer.module.css";

/**
 * Rendu d'un bloc de slide — port de renderBlock() dans POC-Module-1/app.js.
 * Composant serveur (aucune interactivité) : le switch couvre les 6 kinds
 * du type `Block` (lib/types.ts). Toute valeur affichée passe par
 * `renderMarkup` (jamais de dangerouslySetInnerHTML de contenu brut).
 */
export function BlockRenderer({ block }: { block: Block }) {
  switch (block.kind) {
    case "lead":
      return <p className={styles.lead}>{renderMarkup(block.value)}</p>;

    case "text":
      return <p className={styles.text}>{renderMarkup(block.value)}</p>;

    case "list":
      return (
        <ul className={styles.list}>
          {block.items.map((item, i) => (
            <li key={i}>{renderMarkup(item)}</li>
          ))}
        </ul>
      );

    case "duo":
      return (
        <div className={styles.duo}>
          {block.items.map((item, i) => (
            <div className={styles.duoItem} key={i}>
              <div className={styles.duoSide}>{item.side}</div>
              <div>{renderMarkup(item.value)}</div>
            </div>
          ))}
        </div>
      );

    case "callout": {
      const toneClass = { info: styles.info, highlight: styles.highlight, warn: styles.warn }[block.tone];
      return <div className={`${styles.callout} ${toneClass}`}>{renderMarkup(block.value)}</div>;
    }

    case "countries":
      return (
        <div className={styles.countries}>
          {block.items.map((country, i) => (
            <span key={i}>{country}</span>
          ))}
        </div>
      );
  }
}
