import { describe, it, expect } from "vitest";
import { SGIS, countryName, richbourseUrl, sgiCountries, type Sgi } from "@/content/sgi";
import {
  MARKET_FEE_PCT,
  atYear,
  hasFees,
  milestones,
  simulate,
  simulatableSgis,
  totalContributed,
  totalTransactionPct,
} from "./sgi";

const sgi = (over: Partial<Sgi> = {}): Sgi => ({
  name: "Test SGI",
  country: "ci",
  minDeposit: 0,
  courtagePct: 1,
  custodyPctAnnual: 0.5,
  tenueAnnual: 10_000,
  online: "oui",
  ...over,
});

describe("catalogue", () => {
  it("porte les 40 SGI de la liste BRVM", () => {
    expect(SGIS).toHaveLength(40);
  });
  it("n'a pas de doublon de nom", () => {
    const names = SGIS.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
  });
  it("nomme tous les pays référencés", () => {
    for (const s of SGIS) expect(countryName(s.country)).not.toBe(s.country.toUpperCase());
  });
  it("regroupe les pays par nombre de SGI décroissant", () => {
    const countries = sgiCountries();
    expect(countries[0].code).toBe("ci");
    expect(countries.reduce((n, c) => n + c.count, 0)).toBe(SGIS.length);
  });
  it("donne un lien de grille tarifaire quand le slug existe", () => {
    expect(richbourseUrl("MATHA Securities")).toContain("matha-capital");
    expect(richbourseUrl("SGI Inexistante")).toBeUndefined();
  });
});

describe("hasFees", () => {
  it("écarte les SGI dont les frais ne sont pas publiés", () => {
    expect(hasFees(sgi())).toBe(true);
    expect(hasFees(sgi({ courtagePct: null }))).toBe(false);
    expect(hasFees(sgi({ custodyPctAnnual: null }))).toBe(false);
  });
  it("laisse au moins de quoi comparer", () => {
    expect(simulatableSgis().length).toBeGreaterThan(10);
  });
});

describe("totalTransactionPct", () => {
  it("ajoute la commission de marché incompressible", () => {
    expect(totalTransactionPct(sgi({ courtagePct: 0.8 }))).toBeCloseTo(0.8 + MARKET_FEE_PCT, 10);
    expect(totalTransactionPct(sgi({ courtagePct: null }))).toBeNull();
  });
});

describe("simulate", () => {
  const params = { initial: 100_000, monthly: 25_000, annualReturnPct: 5, years: 10 };

  it("rend un point par année", () => {
    const pts = simulate(sgi(), params);
    expect(pts).toHaveLength(10);
    expect(pts[0].year).toBe(1);
    expect(pts[9].year).toBe(10);
  });

  it("compte exactement ce qui a été versé", () => {
    const pts = simulate(sgi(), params);
    expect(pts[9].contributed).toBe(totalContributed(params));
  });

  it("fait croître les frais cumulés, jamais décroître", () => {
    const pts = simulate(sgi(), params);
    for (let i = 1; i < pts.length; i++) {
      expect(pts[i].cumFees).toBeGreaterThan(pts[i - 1].cumFees);
    }
  });

  it("facture plus cher une SGI plus chère, toutes choses égales", () => {
    const chere = simulate(sgi({ courtagePct: 1 }), params);
    const douce = simulate(sgi({ courtagePct: 0.65 }), params);
    expect(atYear(chere, 10)!.cumFees).toBeGreaterThan(atYear(douce, 10)!.cumFees);
    // Et le portefeuille net suit, en sens inverse.
    expect(atYear(douce, 10)!.portfolio).toBeGreaterThan(atYear(chere, 10)!.portfolio);
  });

  it("prélève les droits de garde sur la valeur détenue, donc plus quand ça monte", () => {
    const calme = simulate(sgi(), { ...params, annualReturnPct: 0 });
    const forte = simulate(sgi(), { ...params, annualReturnPct: 10 });
    expect(atYear(forte, 10)!.cumFees).toBeGreaterThan(atYear(calme, 10)!.cumFees);
  });

  it("ne facture rien d'autre que la commission de marché sans courtage ni garde", () => {
    const gratuite = sgi({ courtagePct: 0, custodyPctAnnual: 0, tenueAnnual: 0 });
    const pts = simulate(gratuite, { initial: 100_000, monthly: 0, annualReturnPct: 0, years: 1 });
    expect(atYear(pts, 1)!.cumFees).toBeCloseTo(100_000 * (MARKET_FEE_PCT / 100), 6);
  });

  it("compte une tenue de compte non communiquée pour zéro, pas pour un chiffre inventé", () => {
    const inconnue = simulate(sgi({ tenueAnnual: null }), params);
    const gratuite = simulate(sgi({ tenueAnnual: 0 }), params);
    expect(atYear(inconnue, 10)!.cumFees).toBeCloseTo(atYear(gratuite, 10)!.cumFees, 6);
  });
});

describe("milestones", () => {
  it("s'arrête à l'horizon choisi et l'inclut toujours", () => {
    expect(milestones(10)).toEqual([1, 3, 5, 10]);
    expect(milestones(7)).toEqual([1, 3, 5, 7]);
    expect(milestones(1)).toEqual([1]);
    expect(milestones(20)).toEqual([1, 3, 5, 10, 15, 20]);
  });
});
