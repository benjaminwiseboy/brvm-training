"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/nav/AppShell";
import { renderRichText } from "@/lib/markup";
import { GLOSSARY, GLOSSARY_FOOTER, type GlossaryEntry } from "@/content/glossaire";
import { glossaryLetters, searchGlossary } from "@/lib/glossary";
import styles from "./page.module.css";

/**
 * `/coffre/glossaire` — le dictionnaire de poche de la formation.
 *
 * Aucune condition de déblocage, et c'est un choix : un glossaire sert
 * précisément à traverser les modules qu'on n'a PAS encore terminés. Le
 * verrouiller derrière une phase le retirerait à ceux qui en ont besoin.
 *
 * C'est aussi la deuxième porte d'entrée seulement : la première, celle qui
 * compte vraiment, ce sont les termes rendus cliquables au fil des cours
 * (`components/engine/CourseText`). On vient rarement chercher une
 * définition ; on bute dessus en lisant.
 */
export default function GlossairePage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchGlossary(query), [query]);
  const letters = useMemo(() => glossaryLetters(results), [results]);
  const byLetter = useMemo(() => {
    const map = new Map<string, GlossaryEntry[]>();
    for (const entry of results) {
      const list = map.get(entry.letter) ?? [];
      list.push(entry);
      map.set(entry.letter, list);
    }
    return map;
  }, [results]);

  const searching = query.trim().length > 0;

  return (
    <AppShell variant="dash">
      <Link href="/coffre" className={styles.back}>
        ← Le Coffre-fort
      </Link>

      <header className={styles.head}>
        <p className={styles.eyebrow}>Coffre-fort</p>
        <h1 className={styles.h1}>Glossaire de l&rsquo;investisseur</h1>
        <p className={styles.lead}>
          {GLOSSARY.length} termes techniques, expliqués en langage simple. Ils sont aussi
          cliquables directement dans les cours, quand vous butez dessus.
        </p>
      </header>

      <div className={styles.searchRow}>
        <span className={styles.searchIc} aria-hidden="true">
          🔎
        </span>
        <input
          type="search"
          className={styles.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Chercher un terme (PER, coupon couru, SGI…)"
          aria-label="Chercher un terme dans le glossaire"
        />
        {searching && (
          <button type="button" className={styles.clear} onClick={() => setQuery("")}>
            Effacer
          </button>
        )}
      </div>

      {/* Index A-Z : masqué pendant une recherche, où il n'aurait plus de sens. */}
      {!searching && (
        <nav className={styles.index} aria-label="Aller à une lettre">
          {letters.map((letter) => (
            <a key={letter} href={`#lettre-${letter}`} className={styles.indexLink}>
              {letter}
            </a>
          ))}
        </nav>
      )}

      {results.length === 0 ? (
        <p className={styles.none}>
          Aucun terme ne correspond à « {query.trim()} ». Essayez un mot plus court, ou son sigle.
        </p>
      ) : (
        <>
          {searching && (
            <p className={styles.count}>
              {results.length} terme{results.length > 1 ? "s" : ""} trouvé
              {results.length > 1 ? "s" : ""}
            </p>
          )}

          {letters.map((letter) => (
            <section key={letter} className={styles.section} id={`lettre-${letter}`}>
              <h2 className={styles.letter}>{letter}</h2>
              <dl className={styles.entries}>
                {(byLetter.get(letter) ?? []).map((entry) => (
                  <div key={entry.term} className={styles.entry}>
                    <dt className={styles.term}>{entry.term}</dt>
                    <dd className={styles.def}>
                      {renderRichText(entry.definition)}
                      {entry.extra && entry.extra.length > 0 && (
                        <ul className={styles.extra}>
                          {entry.extra.map((line, i) => (
                            <li key={i}>{renderRichText(line)}</li>
                          ))}
                        </ul>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </>
      )}

      {!searching && <p className={styles.footer}>{renderRichText(GLOSSARY_FOOTER)}</p>}
    </AppShell>
  );
}
