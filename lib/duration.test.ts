import { describe, it, expect } from "vitest";
import { MODULES, PHASES } from "@/content/registry";
import { moduleMinutes, totalMinutes, formatMinutes, durationLabel } from "./duration";

const all = Object.values(MODULES);

describe("moduleMinutes", () => {
  it("donne une durée plausible à CHAQUE module du parcours", () => {
    // Garde-fou de contenu, pas de calcul : si un module tombe hors de cette
    // fourchette, c'est le module qu'il faut regarder (slide oubliée, ou
    // module devenu trop long pour une séance), pas la formule.
    for (const m of all) {
      const min = moduleMinutes(m);
      expect(min, `${m.code} (${m.title})`).toBeGreaterThanOrEqual(4);
      expect(min, `${m.code} (${m.title})`).toBeLessThanOrEqual(45);
    }
  });

  it("est stable d'un appel à l'autre (fonction pure)", () => {
    const m = all[0];
    expect(moduleMinutes(m)).toBe(moduleMinutes(m));
  });

  it("croît avec le contenu ajouté", () => {
    const m = all[0];
    const longer = { ...m, slides: [...m.slides, ...m.slides] };
    expect(moduleMinutes(longer)).toBeGreaterThan(moduleMinutes(m));
  });
});

describe("totalMinutes", () => {
  it("somme les modules d'une phase", () => {
    const phase = PHASES[0];
    const mods = phase.codes.map((c) => MODULES[c]);
    expect(totalMinutes(mods)).toBe(mods.reduce((n, m) => n + moduleMinutes(m), 0));
  });
});

describe("formatMinutes", () => {
  it("reste en minutes sous l'heure", () => {
    expect(formatMinutes(12)).toBe("12 min");
    expect(formatMinutes(59)).toBe("59 min");
  });
  it("bascule en heures au-delà", () => {
    expect(formatMinutes(60)).toBe("1 h");
    expect(formatMinutes(105)).toBe("1 h 45");
    expect(formatMinutes(65)).toBe("1 h 05");
  });
  it("préfixe l'estimation d'un ~", () => {
    expect(durationLabel(12)).toBe("~12 min");
  });
});
