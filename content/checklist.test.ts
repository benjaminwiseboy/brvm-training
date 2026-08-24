import { describe, it, expect } from "vitest";
import { CHECKLIST, CHECKLIST_TOTAL_STEPS, allStepIds } from "./checklist";

describe("check-list « 7 premiers jours »", () => {
  it("couvre bien sept journées", () => {
    expect(CHECKLIST).toHaveLength(7);
  });

  it("n'a aucun identifiant d'étape en double", () => {
    // Les ids servent de clés de persistance : un doublon ferait cocher deux
    // étapes à la fois, et un renommage silencieux perdrait la progression.
    const ids = allStepIds();
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("n'a aucun identifiant de journée en double", () => {
    const ids = CHECKLIST.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("donne au moins une étape à chaque journée", () => {
    for (const day of CHECKLIST) {
      expect(day.steps.length).toBeGreaterThan(0);
    }
  });

  it("expose un total cohérent avec le contenu", () => {
    expect(CHECKLIST_TOTAL_STEPS).toBe(CHECKLIST.reduce((n, d) => n + d.steps.length, 0));
  });
});
