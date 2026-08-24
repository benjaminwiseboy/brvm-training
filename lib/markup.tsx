import React from "react";
import { splitMarkup } from "./format";

export function renderMarkup(input: string): React.ReactNode {
  return splitMarkup(input).map((seg, i) =>
    seg.bold ? <strong key={i}>{seg.text}</strong> : <React.Fragment key={i}>{seg.text}</React.Fragment>,
  );
}

/**
 * Comme `renderMarkup`, plus les formules en `code` — les définitions du
 * glossaire en contiennent (`Cours ÷ BNPA`), et les afficher avec leurs
 * accents graves serait plus laid que de ne rien baliser du tout.
 */
export function renderRichText(input: string): React.ReactNode {
  return input
    .replace(/&nbsp;/g, " ")
    .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    .filter((seg) => seg.length > 0)
    .map((seg, i) => {
      if (seg.startsWith("**") && seg.endsWith("**")) return <strong key={i}>{seg.slice(2, -2)}</strong>;
      if (seg.startsWith("`") && seg.endsWith("`") && seg.length > 1)
        return <code key={i}>{seg.slice(1, -1)}</code>;
      return <React.Fragment key={i}>{seg}</React.Fragment>;
    });
}
