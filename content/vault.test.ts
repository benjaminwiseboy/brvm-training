import { describe, it, expect } from "vitest";
import { orderedCodes, PHASES } from "./registry";
import {
  RESOURCES,
  getResource,
  gateLabel,
  isParcoursComplete,
  isResourceUnlocked,
} from "./vault";

/** Enregistrement `completed` factice — seule la présence de la clé compte. */
const doneFor = (codes: string[]) =>
  Object.fromEntries(codes.map((c) => [c, { score: 1, at: "2026-01-01T00:00:00.000Z" }]));

const NOTHING = doneFor([]);
const EVERYTHING = doneFor(orderedCodes());

describe("catalogue", () => {
  it("n'a pas d'identifiant en double", () => {
    const ids = RESOURCES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ne référence que des phases existantes", () => {
    for (const r of RESOURCES) {
      if (r.gate.kind === "phase") {
        expect(PHASES[r.gate.index - 1]).toBeDefined();
      }
    }
  });

  it("retrouve une ressource par son identifiant", () => {
    expect(getResource("checklist-7-jours")?.href).toBe("/coffre/checklist");
    expect(getResource("inconnue")).toBeUndefined();
  });
});

describe("isParcoursComplete", () => {
  it("est faux tant qu'un seul module manque", () => {
    const order = orderedCodes();
    expect(isParcoursComplete(doneFor(order.slice(0, -1)))).toBe(false);
  });
  it("est vrai quand les 28 modules sont terminés", () => {
    expect(isParcoursComplete(EVERYTHING)).toBe(true);
  });
});

describe("isResourceUnlocked", () => {
  it("laisse passer les ressources sans condition dès le départ", () => {
    const glossaire = getResource("glossaire")!;
    expect(isResourceUnlocked(glossaire, NOTHING)).toBe(true);
  });

  it("garde la check-list verrouillée jusqu'au tout dernier module", () => {
    const checklist = getResource("checklist-7-jours")!;
    const order = orderedCodes();
    expect(isResourceUnlocked(checklist, NOTHING)).toBe(false);
    expect(isResourceUnlocked(checklist, doneFor(order.slice(0, -1)))).toBe(false);
    expect(isResourceUnlocked(checklist, EVERYTHING)).toBe(true);
  });

  it("débloque une ressource de phase quand tous les modules de CETTE phase sont faits", () => {
    const comparateur = getResource("comparateur-sgi")!; // Phase 2
    const phase2 = PHASES[1].codes;
    expect(isResourceUnlocked(comparateur, doneFor(phase2.slice(0, -1)))).toBe(false);
    expect(isResourceUnlocked(comparateur, doneFor(phase2))).toBe(true);
  });
});

describe("gateLabel", () => {
  it("nomme la condition telle qu'elle s'affiche sur la carte", () => {
    expect(gateLabel({ kind: "phase", index: 3 })).toBe("Phase 3");
    expect(gateLabel({ kind: "parcours" })).toBe("fin du parcours");
    expect(gateLabel({ kind: "always" })).toBe("");
  });
});
