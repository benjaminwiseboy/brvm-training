import type { Block } from "@/lib/types";
import { renderMarkup } from "@/lib/markup";
import { BocTable } from "./BocTable";
import { IdCard } from "./IdCard";
import { TrendChart } from "./TrendChart";
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

    case "boctable":
      return <BocTable caption={block.caption} columns={block.columns} rows={block.rows} highlightCols={block.highlightCols} />;

    case "download":
      return (
        <a className={styles.download} href={block.href} download target="_blank" rel="noopener noreferrer">
          <span className={styles.downloadIcon} aria-hidden="true">📄</span>
          <span className={styles.downloadMeta}>
            <span className={styles.downloadLabel}>{block.label}</span>
            {block.sublabel && <span className={styles.downloadSublabel}>{block.sublabel}</span>}
          </span>
          <span className={styles.downloadArrow} aria-hidden="true">↓</span>
        </a>
      );

    case "link":
      return (
        <a className={styles.download} href={block.href} target="_blank" rel="noopener noreferrer">
          <span className={styles.downloadIcon} aria-hidden="true">🔗</span>
          <span className={styles.downloadMeta}>
            <span className={styles.downloadLabel}>{block.label}</span>
            {block.sublabel && <span className={styles.downloadSublabel}>{block.sublabel}</span>}
          </span>
          <span className={styles.downloadArrow} aria-hidden="true">↗</span>
        </a>
      );

    case "formula":
      return (
        <div className={styles.formula}>
          {block.label && <div className={styles.formulaLabel}>{block.label}</div>}
          <div className={styles.formulaValue}>{renderMarkup(block.value)}</div>
        </div>
      );

    case "idcard":
      return <IdCard icon={block.icon} title={block.title} fields={block.fields} />;

    case "chart":
      return (
        <figure>
          <TrendChart categories={block.categories} series={block.series} unit={block.unit} />
          {block.caption && <figcaption className={styles.chartCaption}>{block.caption}</figcaption>}
        </figure>
      );
  }
}
