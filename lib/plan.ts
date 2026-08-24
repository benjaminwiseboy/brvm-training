/**
 * Plan d'investissement personnel — le seul document que la formation
 * produise et qui appartienne vraiment à l'apprenant.
 *
 * Il existait déjà… le temps d'un écran. Le défi « planner » du module 09
 * faisait choisir les 5 piliers, `Bilan` en affichait le récap, puis les
 * réponses mouraient avec le `useState` de `ModulePlayer` — alors même que
 * le Coffre-fort annonçait un « Plan d'Investissement Personnel » et que la
 * fin de Phase 2 promettait un export PDF. Ce fichier donne au plan une
 * existence durable : consultable, MODIFIABLE, et multiple (on peut mener
 * de front un plan « rente » et un plan « études des enfants »).
 *
 * Les piliers ne sont pas redéfinis ici : ils sont LUS dans le contenu du
 * module 09 (`PLAN_PILLARS`), pour que l'éditeur propose exactement le
 * vocabulaire du cours et qu'une reformulation du module n'ait jamais à
 * être recopiée à la main.
 */
import { getModule } from "@/content/registry";

/** Un pilier du plan, tel que le module 09 le pose. */
export type PlanPillar = {
  key: string;
  icon: string;
  label: string;
  prompt: string;
  /** Réponses proposées par le cours — l'apprenant peut aussi écrire la sienne. */
  options: string[];
};

export type InvestmentPlan = {
  id: string;
  /** Nom donné par l'apprenant (« Ma retraite », « Études des enfants »). */
  name: string;
  /** Réponse par pilier, indexée par `PlanPillar.key`. Texte libre : une
   *  option du cours le plus souvent, mais rien n'interdit la sienne. */
  pillars: Record<string, string>;
  /** Notes libres — la place pour ce qui ne rentre dans aucun pilier. */
  notes?: string;
  createdAt: string;
  updatedAt: string;
  /**
   * Code du module qui a engendré ce plan (« M09 »), quand il vient du
   * parcours plutôt que d'une création manuelle. Sert à retrouver LE plan du
   * module quand on rejoue le défi, au lieu d'en empiler une copie de plus.
   */
  fromModule?: string;
  /**
   * Pierre tombale. Supprimer ne retire PAS la ligne : ça la marque, avec un
   * `updatedAt` frais. Sans cette trace, la suppression ne survivrait pas à
   * la synchro — l'appareil qui supprime envoie une liste où le plan a
   * disparu, le serveur en a encore une copie, et la fusion le ressuscite.
   * Un plan marqué est invisible partout (`activePlans`).
   */
  deletedAt?: string;
};

/**
 * Les 5 piliers, dérivés du défi « planner » du module 09 (source unique).
 * Repli sur une liste vide si le module venait à changer de type : mieux
 * vaut un éditeur sans suggestion qu'un plantage au chargement du Coffre-fort.
 */
export const PLAN_PILLARS: PlanPillar[] = (() => {
  const challenge = getModule("M09")?.challenge;
  if (!challenge || challenge.type !== "planner") return [];
  return challenge.questions.map((q, i) => ({
    // Clé stable et indépendante du libellé : renommer « Votre objectif » ne
    // doit pas orpheliner les plans déjà enregistrés.
    key: `p${i + 1}`,
    icon: q.icon,
    label: q.pillarLabel,
    prompt: q.prompt,
    options: q.options.map((o) => o.label),
  }));
})();

function newId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  return `plan-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyPlan(name = "Mon plan d'investissement"): InvestmentPlan {
  const now = new Date().toISOString();
  return { id: newId(), name, pillars: {}, createdAt: now, updatedAt: now };
}

/**
 * Construit un plan à partir des réponses du défi du module 09 (indices des
 * options choisies) — c'est le chemin par lequel naît le premier plan de
 * l'apprenant, sans qu'il ait rien à ressaisir.
 */
export function planFromAnswers(answers: number[], name?: string): InvestmentPlan {
  const plan = emptyPlan(name ?? "Mon plan d'investissement");
  PLAN_PILLARS.forEach((pillar, i) => {
    const choice = pillar.options[answers[i]];
    if (choice !== undefined) plan.pillars[pillar.key] = choice;
  });
  return plan;
}

/** Un plan est-il exploitable ? (au moins un pilier renseigné) */
export function isPlanFilled(plan: InvestmentPlan): boolean {
  return PLAN_PILLARS.some((p) => (plan.pillars[p.key] ?? "").trim().length > 0);
}

/** Nombre de piliers renseignés — sert la jauge de complétude de la fiche. */
export function filledCount(plan: InvestmentPlan): number {
  return PLAN_PILLARS.filter((p) => (plan.pillars[p.key] ?? "").trim().length > 0).length;
}

/** Ajoute ou remplace un plan, en horodatant la modification. */
export function upsertPlan(plans: InvestmentPlan[], plan: InvestmentPlan): InvestmentPlan[] {
  const stamped = { ...plan, updatedAt: new Date().toISOString() };
  const i = plans.findIndex((p) => p.id === plan.id);
  if (i < 0) return [...plans, stamped];
  const next = [...plans];
  next[i] = stamped;
  return next;
}

/** Supprime un plan — par marquage, pour que la suppression se propage. */
export function removePlan(plans: InvestmentPlan[], id: string): InvestmentPlan[] {
  const now = new Date().toISOString();
  return plans.map((p) => (p.id === id ? { ...p, deletedAt: now, updatedAt: now } : p));
}

/** Les plans visibles par l'apprenant : ni supprimés, ni mal formés. */
export function activePlans(plans: InvestmentPlan[]): InvestmentPlan[] {
  return plans.filter((p) => isInvestmentPlan(p) && !p.deletedAt);
}

/** Garde de forme : une entrée mal formée est écartée plutôt que de casser la page. */
export function isInvestmentPlan(x: unknown): x is InvestmentPlan {
  if (typeof x !== "object" || x === null) return false;
  const p = x as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.name === "string" &&
    typeof p.pillars === "object" &&
    p.pillars !== null &&
    !Array.isArray(p.pillars)
  );
}

/**
 * Fusion de deux listes de plans, par identifiant, en gardant la version la
 * plus récemment modifiée. Utilisée côté client pour réconcilier l'état
 * local avec celui renvoyé par la synchro — même règle que la fonction SQL
 * `merge_user_progress`, pour que les deux côtés soient d'accord.
 */
export function mergePlans(a: InvestmentPlan[], b: InvestmentPlan[]): InvestmentPlan[] {
  const byId = new Map<string, InvestmentPlan>();
  for (const plan of [...a, ...b]) {
    const seen = byId.get(plan.id);
    if (!seen || wins(plan, seen)) byId.set(plan.id, plan);
  }
  return [...byId.values()];
}

/**
 * Qui gagne entre deux versions d'un même plan : la plus récente ; et à
 * horodatage égal, la suppression.
 *
 * Le cas d'égalité n'est pas théorique — créer puis supprimer dans la même
 * milliseconde suffit. Départager en faveur de la pierre tombale choisit la
 * moins mauvaise erreur : perdre une modification écrite dans la même
 * milliseconde qu'une suppression est sans conséquence, ressusciter un plan
 * que l'apprenant vient de supprimer est visible et déroutant.
 */
function wins(candidate: InvestmentPlan, current: InvestmentPlan): boolean {
  if (candidate.updatedAt !== current.updatedAt) return candidate.updatedAt > current.updatedAt;
  return !!candidate.deletedAt && !current.deletedAt;
}

/** Version texte du plan — pour le presse-papiers et le partage WhatsApp. */
export function planToText(plan: InvestmentPlan): string {
  const lines = [`${plan.name}`, ""];
  for (const pillar of PLAN_PILLARS) {
    const value = plan.pillars[pillar.key];
    if (value) lines.push(`${pillar.icon} ${pillar.label} : ${value}`);
  }
  if (plan.notes?.trim()) lines.push("", `Notes : ${plan.notes.trim()}`);
  return lines.join("\n");
}
