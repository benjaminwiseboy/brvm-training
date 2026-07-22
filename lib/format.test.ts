import { describe, it, expect } from "vitest";
import { money, splitMarkup, fvAnnuity } from "./format";

describe("money", () => {
  it("groupe les milliers avec un espace insécable U+00A0 (comme le POC)", () => {
    expect(money(1000000)).toBe("1 000 000");
    expect(money(1060000)).toBe("1 060 000");
    expect(money(5000)).toBe("5 000");
    expect(money(0)).toBe("0");
  });
  it("conserve le signe négatif", () => {
    expect(money(-5000)).toBe("-5 000");
  });
});

describe("splitMarkup", () => {
  it("isole les segments en gras (l'espace du texte source reste normal)", () => {
    expect(splitMarkup("Oubliez **Wall Street**.")).toEqual([
      { bold: false, text: "Oubliez " },
      { bold: true, text: "Wall Street" },
      { bold: false, text: "." },
    ]);
  });
  it("convertit &nbsp; en espace insécable U+00A0", () => {
    expect(splitMarkup("Wall&nbsp;Street")).toEqual([
      { bold: false, text: "Wall Street" },
    ]);
  });
});

describe("fvAnnuity", () => {
  it("sans rendement, la valeur future = le total investi", () => {
    const r = fvAnnuity(25000, 0, 10);
    expect(r.invested).toBe(3_000_000);
    expect(Math.round(r.future)).toBe(3_000_000);
  });
  it("avec rendement, la valeur future dépasse l'investi", () => {
    const r = fvAnnuity(25000, 8, 15);
    expect(r.invested).toBe(4_500_000);
    expect(r.future).toBeGreaterThan(r.invested);
  });
});
