/**
 * Point de bascule freemium : aujourd'hui vide (compte obligatoire
 * partout), mais c'est le SEUL fichier à modifier plus tard pour
 * rendre certains modules accessibles sans compte (ex: ajouter "M01").
 */
export const PUBLIC_MODULE_CODES: Set<string> = new Set([]);

export function isModulePublic(code: string): boolean {
  return PUBLIC_MODULE_CODES.has(code.toUpperCase());
}
