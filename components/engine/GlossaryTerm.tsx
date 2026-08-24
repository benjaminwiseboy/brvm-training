"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { GlossaryEntry } from "@/content/glossaire";
import { renderRichText } from "@/lib/markup";
import styles from "./GlossaryTerm.module.css";

/**
 * Un terme du glossaire, repéré dans le texte d'un cours et rendu cliquable.
 *
 * La définition s'ouvre dans une feuille FIXE (collée en bas sur mobile,
 * centrée sur desktop) plutôt que dans une infobulle positionnée près du
 * mot. Deux raisons : une infobulle n'a pas de survol sur un téléphone — et
 * c'est là que se lit la formation ; et elle déborderait de l'écran dès que
 * le terme tombe en fin de ligne. La feuille, elle, s'affiche toujours au
 * même endroit et se referme d'un geste.
 *
 * Le mot reste dans le flux du texte : c'est un `<button>` en `display:
 * inline`, souligné en pointillé — lisible sans être un lien de plus qui
 * disperse l'attention.
 */
export function GlossaryTerm({ label, entry }: { label: string; entry: GlossaryEntry }) {
  const [open, setOpen] = useState(false);

  // Échap ferme la feuille — même geste que n'importe quelle boîte de dialogue.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={styles.term}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label={`${label} — voir la définition`}
      >
        {label}
      </button>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} role="presentation">
          <div
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-label={`Définition : ${entry.term}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.head}>
              <div>
                <p className={styles.eyebrow}>Glossaire</p>
                <h2 className={styles.title}>{entry.term}</h2>
              </div>
              <button
                type="button"
                className={styles.close}
                onClick={() => setOpen(false)}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <p className={styles.def}>{renderRichText(entry.definition)}</p>

            {entry.extra && entry.extra.length > 0 && (
              <ul className={styles.extra}>
                {entry.extra.map((line, i) => (
                  <li key={i}>{renderRichText(line)}</li>
                ))}
              </ul>
            )}

            <Link href="/coffre/glossaire" className={styles.all}>
              Voir tout le glossaire →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
