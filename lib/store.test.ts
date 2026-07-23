import { describe, it, expect } from "vitest";
import { deriveStatus, deriveModuleState, progressPct, applyCompletion, initialState } from "./store";

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
});
