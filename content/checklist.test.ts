import { describe, it, expect } from "vitest";
import {
  CHECKLIST,
  CHECKLIST_TOTAL_STEPS,
  INVESTOR_ROUTINE,
  allRoutineIds,
  allStepIds,
} from "./checklist";

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

describe("routine de l'investisseur", () => {
  it("couvre les quatre cadences, chacune avec au moins une action", () => {
    expect(INVESTOR_ROUTINE.map((b) => b.id)).toEqual(["hebdo", "mensuel", "trimestriel", "annuel"]);
    for (const block of INVESTOR_ROUTINE) {
      expect(block.items.length, block.cadence).toBeGreaterThan(0);
    }
  });

  it("n'a aucun identifiant en double", () => {
    const ids = allRoutineIds();
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ne mélange pas ses ids avec ceux des 7 journées", () => {
    // Les deux listes vivent dans la même page ; un id commun ferait cocher
    // une étape de la semaine en interagissant avec la routine.
    const shared = allRoutineIds().filter((id) => allStepIds().includes(id));
    expect(shared).toEqual([]);
  });

  it("explique chaque action, jamais un simple intitulé", () => {
    // La formation se lit sans narration : une puce-étiquette n'enseigne rien.
    for (const item of INVESTOR_ROUTINE.flatMap((b) => b.items)) {
      expect(item.body.length, item.title).toBeGreaterThan(120);
    }
  });

  it("donne des liens exploitables — externes en http(s), internes en /", () => {
    for (const item of INVESTOR_ROUTINE.flatMap((b) => b.items)) {
      if (!item.link) continue;
      if (item.link.external) expect(item.link.href).toMatch(/^https:\/\//);
      else expect(item.link.href).toMatch(/^\//);
    }
  });

  it("emmène bien l'apprenant vers le BOC et vers une source d'information", () => {
    const hrefs = INVESTOR_ROUTINE.flatMap((b) => b.items.map((i) => i.link?.href ?? ""));
    expect(hrefs.some((h) => h.includes("brvm.org"))).toBe(true);
    expect(hrefs.some((h) => h.includes("cauri-news"))).toBe(true);
  });
});
