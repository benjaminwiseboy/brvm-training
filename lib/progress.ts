/**
 * Logique pure de progression — délibérément SANS "use client", pour rester
 * appelable depuis des Server Components/Actions (app/layout.tsx, app/admin/**,
 * lib/actions/auth.ts). `lib/store.tsx` (client, Provider React) réexporte
 * tout ce fichier pour ne rien casser côté composants clients existants —
 * mais tout appelant SERVEUR doit importer directement d'ici : un module
 * "use client" transforme même ses fonctions pures en références client
 * opaques, non invocables côté serveur (erreur runtime, pas détectée par tsc).
 */
import { orderedCodes, getModule, PHASES } from "@/content/registry";

export const STORAGE_KEY = "brvm-learning:v1";

export type ProgressState = {
  onboarded: boolean; capital: number; streak: number;
  completed: Record<string, { score: number; at: string }>;
  // `phase` (Fix P1, critique UX) : sans elle, quitter en plein défi puis
  // revenir rejouait tout le cours depuis la dernière slide vue au lieu de
  // reprendre directement au défi — `slide` seul ne distinguait pas les deux.
  resume?: { code: string; slide: number; phase?: "cours" | "defi" };
  unlockedResources: string[];
};

export const initialState = (): ProgressState => ({
  onboarded: false, capital: 1_000_000, streak: 0, completed: {}, unlockedResources: [],
});

/**
 * Garde de forme pour la valeur relue depuis `localStorage` (Fix 4, revue
 * finale). `JSON.parse` peut réussir sur une valeur syntaxiquement valide mais
 * de mauvaise forme (`"null"` → `null`, objet partiel sans `completed`…) : la
 * relire telle quelle dans le state ferait planter tout le rendu en aval
 * (`Object.keys(state.completed)` dans Dashboard/AppShell) de façon permanente,
 * la valeur corrompue restant persistée. On valide donc les champs requis
 * minimaux avant hydratation ; sinon on retombe sur `initialState()`.
 * Vérif volontairement légère (typeof/forme, pas de schéma runtime ni Zod) :
 * suffisant pour le périmètre v0.
 */
export function isValidProgressState(x: unknown): x is ProgressState {
  if (typeof x !== "object" || x === null) return false;
  const s = x as Record<string, unknown>;
  return (
    typeof s.completed === "object" &&
    s.completed !== null &&
    !Array.isArray(s.completed) &&
    typeof s.capital === "number" &&
    typeof s.onboarded === "boolean" &&
    typeof s.streak === "number" &&
    Array.isArray(s.unlockedResources)
  );
}

/**
 * Retombe sur `initialState()` si `raw` n'a pas la forme attendue — utilisé
 * à la fois pour l'hydratation localStorage (invité) et la lecture
 * `user_progress.state` côté serveur (compte), même garde dans les deux cas.
 */
export function resolveInitialProgress(raw: unknown): ProgressState {
  return isValidProgressState(raw) ? raw : initialState();
}

/**
 * Statut/badge du parcours pour un nombre de modules terminés donné.
 *
 * Le statut "porté" par l'apprenant à un instant T est celui du module sur
 * lequel il se trouve (position `doneCount` dans `orderedCodes()`, clampée au
 * dernier index) — ce champ existe par module (`Module.status`).
 *
 * ÉCHELLE 5 PALIERS (décision produit explicite, revue finale) : les champs
 * `status` des modules forment une échelle MONOTONE CROISSANTE le long de
 * l'ordre — 🥉 (M01-M04) → 🥈 (M05-M08) → 🥇 (M09-M18) → 🎓 (M19-M25) → 💎
 * (M26). Comme `idx` ne fait que croître (ou reste clampé) avec `doneCount`,
 * l'affichage grimpe à travers les 5 paliers sans jamais régresser, puis se
 * fige sur 💎 une fois le parcours terminé (`doneCount >= 25`). Ce statut
 * persistant est distinct du badge de complétion ponctuel
 * (`feedback.perfect`), cf. commentaires d'en-tête de m19.ts / m26.ts.
 *
 * Repli : si `getModule(code)` renvoie `undefined`, on retombe sur le badge de
 * la phase englobante (`PHASES[i].badge`) plutôt que de planter.
 */
export function deriveStatus(doneCount: number): { emoji: string; label: string } {
  const order = orderedCodes();
  if (order.length === 0) return { emoji: "🥉", label: "Apprenti investisseur" };
  const idx = Math.min(Math.max(doneCount, 0), order.length - 1);
  const code = order[idx];
  const mod = getModule(code);
  if (mod) return mod.status;
  const phase = PHASES.find((p) => p.codes.includes(code));
  return { emoji: phase?.badge ?? "🥉", label: phase?.name ?? "Apprenti investisseur" };
}

/**
 * État d'affichage d'un module dans le tableau de bord.
 * - "done" : le module est dans `completed`, quelle que soit sa position.
 * - "current" : le premier code de `order` qui n'est pas encore complété.
 * - "unlocked" : le code juste après "current" — aperçu d'accroche du
 *   module suivant, cohérent avec `POC-Module-1/data/user-state.js` où M09
 *   reste "unlocked" alors que 7 modules sont déjà "done" et M08 "current".
 *   Exception : si ce code est le tout dernier de `order` (le module
 *   "boss" final), il n'est jamais prévisualisé à l'avance — il ne devient
 *   accessible qu'en tant que "current", une fois réellement atteint.
 * - "locked" : tout le reste.
 */
export function deriveModuleState(
  code: string,
  completed: Record<string, unknown>,
  order: string[]
): "done" | "current" | "unlocked" | "locked" {
  if (completed[code]) return "done";
  const currentIdx = order.findIndex((c) => !completed[c]);
  const idx = order.indexOf(code);
  if (idx === currentIdx) return "current";
  if (idx === currentIdx + 1 && currentIdx + 1 !== order.length - 1) return "unlocked";
  return "locked";
}

export type PaymentStatus = "paid" | "unpaid";

/**
 * Essai gratuit (Fix, règle produit explicite) : seule la Phase 1
 * (`PHASES[0]`, M01-M04) reste accessible à un compte non payant. Le reste
 * du parcours exige `payments.status === "paid"` — appliqué côté serveur
 * dans `app/module/[code]/page.tsx` (la vraie barrière), et reflété
 * visuellement dans `ModuleMap`/`PhasePreview` pour ne pas surprendre au clic.
 */
export function isFreeTrialModule(code: string): boolean {
  return PHASES[0]?.codes.includes(code.toUpperCase()) ?? false;
}

export function progressPct(doneCount: number, total: number): number {
  if (!total) return 0;
  return Math.round((doneCount / total) * 100);
}

export function applyCompletion(
  state: ProgressState,
  code: string,
  correct: number,
  total: number,
  capitalDelta: number
): ProgressState {
  const order = orderedCodes();
  const idx = order.indexOf(code);
  const nextCode = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : undefined;
  const newScore = total > 0 ? correct / total : 0;
  const prev = state.completed[code];
  // Idempotence (Fix 1, revue finale) : un module déjà dans `completed` est
  // rejouable via « Revoir ↻ » (ModuleMap). Rejouer ne doit PAS recréditer le
  // capital ni ré-incrémenter la série (`streak`), sinon le total du
  // portefeuille — signal de feedback central du jeu — deviendrait dénué de
  // sens après n'importe quelle relecture. Décision (laissée au choix par le
  // brief) : on conserve le MEILLEUR score entre l'ancien et le nouveau
  // (`Math.max`) — rejouer peut améliorer, jamais dégrader, l'acquis affiché.
  // Le pointeur `resume` avance normalement dans les deux cas.
  const alreadyDone = prev !== undefined;
  const score = alreadyDone ? Math.max(prev.score, newScore) : newScore;
  return {
    ...state,
    completed: {
      ...state.completed,
      [code]: { score, at: alreadyDone ? prev.at : new Date().toISOString() },
    },
    capital: alreadyDone ? state.capital : Math.max(0, state.capital + capitalDelta),
    streak: alreadyDone ? state.streak : state.streak + 1,
    resume: nextCode ? { code: nextCode, slide: 0 } : state.resume,
  };
}
