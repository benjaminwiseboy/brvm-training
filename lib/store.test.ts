import { describe, it, expect } from "vitest";
import {
  deriveStatus,
  deriveModuleState,
  progressPct,
  applyCompletion,
  initialState,
  isValidProgressState,
} from "./store";

const order = ["M01","M02","M03"];

describe("deriveModuleState", () => {
  it("terminé / en cours / débloqué / verrouillé", () => {
    const done = { M01: { score: 1, at: "x" } };
    expect(deriveModuleState("M01", done, order)).toBe("done");
    expect(deriveModuleState("M02", done, order)).toBe("current");
    expect(deriveModuleState("M03", done, order)).toBe("locked");
    expect(deriveModuleState("M01", {}, order)).toBe("current");
    expect(deriveModuleState("M02", {}, order)).toBe("unlocked");
  });
});

describe("progressPct", () => {
  it("arrondit le pourcentage", () => {
    expect(progressPct(7, 26)).toBe(27);
    expect(progressPct(0, 26)).toBe(0);
  });
});

describe("applyCompletion", () => {
  it("ajoute le module, applique le delta de capital, pose la reprise sur le suivant", () => {
    const s = applyCompletion(initialState(), "M01", 4, 4, 20000);
    expect(s.completed.M01.score).toBe(1);
    expect(s.capital).toBe(1_020_000);
    expect(s.resume).toEqual({ code: "M02", slide: 0 });
  });
  it("ne repasse pas le capital sous zéro", () => {
    const s = applyCompletion({ ...initialState(), capital: 3000 }, "M01", 0, 4, -20000);
    expect(s.capital).toBe(0);
  });

  // Fix 1 (revue finale) : idempotence sur relecture d'un module déjà terminé.
  it("crédite capital + série la PREMIÈRE fois qu'on termine M01", () => {
    const s = applyCompletion(initialState(), "M01", 4, 4, 20000);
    expect(s.capital).toBe(1_020_000);
    expect(s.streak).toBe(1);
    expect(s.completed.M01.score).toBe(1);
  });

  it("ne recrédite NI capital NI série en rejouant un M01 déjà terminé", () => {
    const first = applyCompletion(initialState(), "M01", 4, 4, 20000);
    const second = applyCompletion(first, "M01", 4, 4, 20000);
    // capital et streak figés à leur valeur d'après-première-complétion
    expect(second.capital).toBe(1_020_000);
    expect(second.streak).toBe(1);
  });

  it("conserve le MEILLEUR score en rejouant (améliore, ne dégrade pas)", () => {
    const first = applyCompletion(initialState(), "M01", 2, 4, 20000); // 0.5
    const better = applyCompletion(first, "M01", 4, 4, 20000); // 1.0
    expect(better.completed.M01.score).toBe(1);
    const worse = applyCompletion(better, "M01", 1, 4, 20000); // 0.25
    expect(worse.completed.M01.score).toBe(1); // reste au meilleur
    expect(worse.capital).toBe(1_020_000); // toujours pas recrédité
  });
});

// Fix 2 (revue finale) : le statut grimpe de façon monotone à travers les 5
// paliers (🥉→🥈→🥇→🎓→💎) et se fige sur 💎 après la fin du parcours.
describe("deriveStatus — échelle 5 paliers", () => {
  it("grimpe 🥉→🥈→🥇→🎓→💎 selon le nombre de modules terminés", () => {
    expect(deriveStatus(0).emoji).toBe("🥉");
    expect(deriveStatus(4).emoji).toBe("🥈");
    expect(deriveStatus(8).emoji).toBe("🥇");
    expect(deriveStatus(18).emoji).toBe("🎓");
    expect(deriveStatus(25).emoji).toBe("💎");
    expect(deriveStatus(28).emoji).toBe("💎"); // clamp post-complétion : persiste
  });
});

// Fix 4 (revue finale) : garde de forme de la charge localStorage.
describe("isValidProgressState", () => {
  it("accepte un état bien formé", () => {
    expect(isValidProgressState(initialState())).toBe(true);
  });
  it("rejette null / valeurs primitives", () => {
    expect(isValidProgressState(null)).toBe(false);
    expect(isValidProgressState("null")).toBe(false);
    expect(isValidProgressState(42)).toBe(false);
  });
  it("rejette un objet partiel (champs requis manquants ou de mauvais type)", () => {
    expect(isValidProgressState({})).toBe(false);
    expect(isValidProgressState({ capital: 1000 })).toBe(false); // pas de completed
    expect(isValidProgressState({ ...initialState(), completed: [] })).toBe(false); // tableau ≠ objet
    expect(isValidProgressState({ ...initialState(), capital: "1000" })).toBe(false); // capital string
  });
});
