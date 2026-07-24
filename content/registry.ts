import type { Module } from "@/lib/types";
import { m01 } from "./modules/m01";
import { m02 } from "./modules/m02";
import { m03 } from "./modules/m03";
import { m04 } from "./modules/m04";
import { m05 } from "./modules/m05";
import { m06 } from "./modules/m06";
import { m07 } from "./modules/m07";
import { m08 } from "./modules/m08";
import { m09 } from "./modules/m09";
import { m10 } from "./modules/m10";
import { m11 } from "./modules/m11";
import { m12 } from "./modules/m12";
import { m13 } from "./modules/m13";
import { m14 } from "./modules/m14";
import { m15 } from "./modules/m15";
import { m16 } from "./modules/m16";
import { m17 } from "./modules/m17";
import { m18 } from "./modules/m18";
import { m19 } from "./modules/m19";
import { m20 } from "./modules/m20";
import { m21 } from "./modules/m21";
import { m22 } from "./modules/m22";
import { m23 } from "./modules/m23";
import { m24 } from "./modules/m24";
import { m25 } from "./modules/m25";
import { m26 } from "./modules/m26";

export const MODULES: Record<string, Module> = {
  M01: m01, M02: m02, M03: m03, M04: m04, M05: m05, M06: m06, M07: m07, M08: m08,
  M09: m09, M10: m10, M11: m11, M12: m12, M13: m13, M14: m14,
  M15: m15, M16: m16, M17: m17, M18: m18, M19: m19,
  M20: m20, M21: m21, M22: m22, M23: m23, M24: m24, M25: m25, M26: m26
};

export const PHASES = [
  { name: "Phase 1 · Les Fondations", badge: "🥉", codes: ["M01","M02","M03","M04"] },
  { name: "Phase 2 · La Boussole",    badge: "🥈", codes: ["M05","M06","M07","M08"] },
  { name: "Phase 3 · L'Analyse",      badge: "🥇", codes: ["M09","M10","M11","M12","M13","M14","M15","M16","M17","M18","M19"] },
  { name: "Phase 4 · Passage à l'action", badge: "🥇", codes: ["M20","M21","M22"] },
  { name: "Phase 5 · Suivi & maîtrise",   badge: "💎", codes: ["M23","M24","M25","M26"] },
];

export function orderedCodes(): string[] { return PHASES.flatMap((p) => p.codes); }
export function getModule(code: string): Module | undefined { return MODULES[code.toUpperCase()]; }
export function getNext(code: string): Module | undefined {
  const order = orderedCodes();
  const i = order.indexOf(code.toUpperCase());
  return i >= 0 && i < order.length - 1 ? MODULES[order[i + 1]] : undefined;
}
