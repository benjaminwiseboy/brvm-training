import type { CSSProperties } from "react";

/** Décale une révélation au scroll. */
export const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
