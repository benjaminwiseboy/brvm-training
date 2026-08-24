"use client";

import React from "react";
import { splitMarkup } from "@/lib/format";
import { findMatches } from "@/lib/glossary";
import { GlossaryTerm } from "./GlossaryTerm";

/**
 * Texte d'une slide de cours : le même rendu que `renderMarkup` (le
 * **gras** du contenu), plus les termes du glossaire rendus cliquables.
 *
 * L'ordre des deux passes compte. On découpe d'abord le gras, puis on
 * cherche les termes DANS chaque morceau : l'inverse casserait les
 * astérisques dès qu'un terme du glossaire tombe à cheval sur une portion
 * en gras — et le contenu en met partout.
 *
 * Le plafond de liens est appliqué par `findMatches` morceau par morceau ;
 * on lui passe en plus un ensemble partagé (`alreadyLinked`) pour qu'un
 * terme déjà lié plus haut dans le même bloc ne le soit pas une seconde
 * fois. C'est volontairement discret : le but est d'aider celui qui bute
 * sur un mot, pas de baliser le cours.
 */
export function CourseText({ value }: { value: string }) {
  const linked = new Set<string>();

  return (
    <>
      {splitMarkup(value).map((segment, i) => {
        const parts = findMatches(segment.text, linked).map((piece, j) =>
          piece.kind === "term" ? (
            <GlossaryTerm key={j} label={piece.value} entry={piece.entry} />
          ) : (
            <React.Fragment key={j}>{piece.value}</React.Fragment>
          )
        );
        return segment.bold ? (
          <strong key={i}>{parts}</strong>
        ) : (
          <React.Fragment key={i}>{parts}</React.Fragment>
        );
      })}
    </>
  );
}
