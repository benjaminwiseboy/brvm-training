import type { Block } from "@/lib/types";
import { renderMarkup } from "@/lib/markup";
import { CourseText } from "./CourseText";
import { BocTable } from "./BocTable";
import { IdCard } from "./IdCard";
import { TrendChart } from "./TrendChart";
import styles from "./BlockRenderer.module.css";

/**
 * Rendu d'un bloc de slide — port de renderBlock() dans POC-Module-1/app.js.
 * Le switch couvre tous les kinds du type `Block` (lib/types.ts). Toute
 * valeur affichée passe par un renderer (jamais de
 * dangerouslySetInnerHTML de contenu brut).
 *
 * Deux renderers, et la distinction n'est pas cosmétique :
 * - `CourseText` pour la PROSE du cours (lead, text, list, callout, duo) —
 *   il rend le gras ET rend cliquables les termes du glossaire, pour que
 *   l'apprenant qui bute sur « coupon couru » n'ait pas à quitter sa slide ;
 * - `renderMarkup` pour tout le reste (formules, étiquettes de fiche,
 *   légendes) — souligner un mot au milieu d'une formule ou d'un libellé de
 *   colonne n'aiderait personne et abîmerait la lecture.
 */
export function BlockRenderer({ block }: { block: Block }) {
  switch (block.kind) {
    case "lead":
      return <p className={styles.lead}><CourseText value={block.value} /></p>;

    case "text":
      return <p className={styles.text}><CourseText value={block.value} /></p>;

    case "list":
      return (
        <ul className={styles.list}>
          {block.items.map((item, i) => (
            <li key={i}><CourseText value={item} /></li>
          ))}
        </ul>
      );

    case "duo":
      return (
        <div className={styles.duo}>
          {block.items.map((item, i) => (
            <div className={styles.duoItem} key={i}>
              <div className={styles.duoSide}>{item.side}</div>
              <div><CourseText value={item.value} /></div>
            </div>
          ))}
        </div>
      );

    case "callout": {
      const toneClass = { info: styles.info, highlight: styles.highlight, warn: styles.warn }[block.tone];
      return <div className={`${styles.callout} ${toneClass}`}><CourseText value={block.value} /></div>;
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
