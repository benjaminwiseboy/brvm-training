import { describe, it, expect } from "vitest";
import { validateModule, validateAll } from "./validate";
import type { Module } from "@/lib/types";

const base: Module = {
  code: "M01", index: 1, totalModules: 26, title: "T", phase: "Phase 1",
  status: { emoji: "🥉", label: "s" },
  hero: { eyebrow: "e", headline: "h", lead: "l", cta: "c" },
  slides: [{ title: "s", blocks: [{ kind: "text", value: "x" }] }],
  challenge: {
    type: "quiz", kicker: "k", title: "t", instruction: "i",
    penaltyPerError: 5000, perfectReward: 20000,
    options: [{ value: "mythe", label: "Mythe" }, { value: "realite", label: "Réalité" }],
    questions: [{ prompt: "p", answer: "mythe" }],
  },
  feedback: { perfect: { icon: "🎉", title: "t", body: "b" }, imperfect: { icon: "📉", title: "t", body: "b" }, explanations: [] },
  next: { label: "n", target: "Module 02" },
};

describe("validateModule", () => {
  it("accepte un module bien formé", () => {
    expect(validateModule(base)).toEqual([]);
  });
  it("rejette une réponse de quiz absente des options", () => {
    const bad = { ...base, challenge: { ...base.challenge, questions: [{ prompt: "p", answer: "xxx" }] } } as Module;
    expect(validateModule(bad)).toContain("M01: réponse \"xxx\" absente des options");
  });
  it("rejette un module sans slide", () => {
    const bad = { ...base, slides: [] } as Module;
    expect(validateModule(bad)).toContain("M01: aucune slide");
  });
});

describe("validateAll", () => {
  it("rejette les codes dupliqués", () => {
    expect(validateAll([base, base])).toContain("code dupliqué: M01");
  });
});
