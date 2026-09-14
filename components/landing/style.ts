import type { CSSProperties } from "react";

/** Décale une révélation au scroll. */
export const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Indice d'un palier du parcours (décalage horizontal de la carte). */
export const step = (index: number) => ({ "--i": index }) as CSSProperties;
