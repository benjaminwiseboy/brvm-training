import { describe, it, expect } from "vitest";
import {
  PLAN_PILLARS,
  activePlans,
  emptyPlan,
  filledCount,
  isInvestmentPlan,
  isPlanFilled,
  mergePlans,
  planFromAnswers,
  planToText,
  removePlan,
  upsertPlan,
  type InvestmentPlan,
} from "./plan";

describe("PLAN_PILLARS", () => {
  it("reprend les 5 piliers du module 09", () => {
    expect(PLAN_PILLARS).toHaveLength(5);
    expect(PLAN_PILLARS.map((p) => p.label)).toContain("Votre objectif");
    for (const p of PLAN_PILLARS) expect(p.options.length).toBeGreaterThan(0);
  });
  it("utilise des clés stables, indépendantes des libellés", () => {
    expect(PLAN_PILLARS.map((p) => p.key)).toEqual(["p1", "p2", "p3", "p4", "p5"]);
  });
});

describe("planFromAnswers", () => {
  it("reporte les options choisies au défi du module 09", () => {
    const plan = planFromAnswers([0, 1, 2, 0, 1]);
    expect(plan.pillars.p1).toBe(PLAN_PILLARS[0].options[0]);
    expect(plan.pillars.p3).toBe(PLAN_PILLARS[2].options[2]);
    expect(filledCount(plan)).toBe(5);
    expect(isPlanFilled(plan)).toBe(true);
  });
  it("ignore un indice hors bornes plutôt que d'écrire undefined", () => {
    const plan = planFromAnswers([0, 99, 0, 0, 0]);
    expect(plan.pillars.p2).toBeUndefined();
    expect(filledCount(plan)).toBe(4);
  });
});

describe("emptyPlan", () => {
  it("crée un plan vide, non exploitable tant qu'il n'est pas rempli", () => {
    const plan = emptyPlan("Ma retraite");
    expect(plan.name).toBe("Ma retraite");
    expect(isPlanFilled(plan)).toBe(false);
    expect(plan.id).toBeTruthy();
  });
  it("donne un identifiant distinct à chaque plan", () => {
    expect(emptyPlan().id).not.toBe(emptyPlan().id);
  });
});

describe("upsertPlan / removePlan", () => {
  it("ajoute un plan absent et remplace un plan existant", () => {
    const a = emptyPlan("A");
    let plans = upsertPlan([], a);
    expect(plans).toHaveLength(1);
    plans = upsertPlan(plans, { ...a, name: "A modifié" });
    expect(plans).toHaveLength(1);
    expect(plans[0].name).toBe("A modifié");
  });
  it("horodate la modification", () => {
    const a: InvestmentPlan = { ...emptyPlan("A"), updatedAt: "2020-01-01T00:00:00.000Z" };
    const [saved] = upsertPlan([], a);
    expect(saved.updatedAt > a.updatedAt).toBe(true);
  });
  it("supprime par marquage, pour que la suppression survive à la synchro", () => {
    const a = emptyPlan("A");
    const b = emptyPlan("B");
    const after = removePlan([a, b], a.id);
    // La ligne reste (pierre tombale), mais elle disparaît de l'affichage.
    expect(after).toHaveLength(2);
    expect(after.find((p) => p.id === a.id)?.deletedAt).toBeTruthy();
    expect(activePlans(after).map((p) => p.name)).toEqual(["B"]);
  });

  it("laisse la suppression gagner sur une version antérieure du même plan", () => {
    const a = emptyPlan("A");
    const [supprime] = removePlan([a], a.id);
    expect(activePlans(mergePlans([a], [supprime]))).toHaveLength(0);
  });
});

describe("mergePlans", () => {
  it("garde la version la plus récente d'un même plan", () => {
    const base = emptyPlan("Plan");
    const ancien = { ...base, name: "ancien", updatedAt: "2026-01-01T00:00:00.000Z" };
    const recent = { ...base, name: "récent", updatedAt: "2026-06-01T00:00:00.000Z" };
    expect(mergePlans([ancien], [recent])[0].name).toBe("récent");
    expect(mergePlans([recent], [ancien])[0].name).toBe("récent");
  });
  it("réunit des plans distincts sans en perdre", () => {
    expect(mergePlans([emptyPlan("A")], [emptyPlan("B")])).toHaveLength(2);
  });
});

describe("isInvestmentPlan", () => {
  it("écarte les valeurs mal formées", () => {
    expect(isInvestmentPlan(emptyPlan())).toBe(true);
    expect(isInvestmentPlan(null)).toBe(false);
    expect(isInvestmentPlan({ id: "x" })).toBe(false);
    expect(isInvestmentPlan({ id: "x", name: "y", pillars: [] })).toBe(false);
  });
});

describe("planToText", () => {
  it("rend un plan lisible, sans les piliers vides", () => {
    const plan = planFromAnswers([0, 0, 0, 0, 0], "Ma retraite");
    plan.pillars.p3 = "";
    const text = planToText(plan);
    expect(text.startsWith("Ma retraite")).toBe(true);
    expect(text).toContain("Votre objectif :");
    expect(text).not.toContain("Votre stratégie :");
  });
});
