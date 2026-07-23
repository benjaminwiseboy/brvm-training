import type { Module } from "@/lib/types";
import { m01 } from "./modules/m01";
import { m08 } from "./modules/m08";
// … imports m02..m26 ajoutés au fil des tâches de conversion

export const MODULES: Record<string, Module> = { M01: m01, M08: m08 /*, …*/ };

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
