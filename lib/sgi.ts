/**
 * Moteur de simulation des frais de courtage — porté du projet frère
 * `brvm-tracker` (`lib/sgi.ts`).
 *
 * L'intérêt du calcul n'est pas de comparer des pourcentages : n'importe
 * quelle grille tarifaire le permet. Il est de rendre VISIBLE ce qu'un écart
 * de 0,2 % finit par coûter sur dix ans d'achats réguliers — la seule forme
 * sous laquelle un frais devient une décision, et exactement la leçon du
 * module 11 (« 1 000 F de forfait sur 25 000 F, c'est 4 % »).
 */
import { SGIS, type Sgi } from "@/content/sgi";

/**
 * Commission de marché due sur CHAQUE transaction, identique chez toutes les
 * SGI : BRVM 0,2 % + dépositaire DC/BR 0,1 %. Incompressible — c'est le
 * plancher au-dessus duquel se place le courtage de chacun.
 * (Hors petite commission CREPMF et taxes, négligées.)
 */
export const MARKET_FEE_PCT = 0.3;

/** La SGI publie-t-elle assez pour être simulée ? Sinon on ne l'invente pas. */
export const hasFees = (s: Sgi): boolean => s.courtagePct != null && s.custodyPctAnnual != null;

/** Les SGI simulables, dans l'ordre du catalogue. */
export const simulatableSgis = (): Sgi[] => SGIS.filter(hasFees);

export type SimParams = {
  /** Investissement de départ (FCFA). */
  initial: number;
  /** Apport mensuel (FCFA) — le DCA du module 10. */
  monthly: number;
  /** Rendement annuel espéré du portefeuille (%). */
  annualReturnPct: number;
  /** Horizon, en années. */
  years: number;
};

export type SimPoint = {
  year: number;
  /** Total des frais prélevés depuis le début. */
  cumFees: number;
  /** Valeur nette du portefeuille, frais déduits. */
  portfolio: number;
  /** Total versé de sa poche, hors frais. */
  contributed: number;
};

/**
 * Simulation mois par mois d'une stratégie d'accumulation : on achète
 * régulièrement, on ne revend pas. Trois frais sont pris en compte —
 * courtage + commission de marché à chaque achat, droits de garde annuels
 * sur la valeur détenue, et tenue de compte annuelle.
 *
 * Deux hypothèses assumées, à dire à l'apprenant plutôt qu'à cacher : une
 * tenue de compte « non communiquée » est comptée pour 0 (on ne facture pas
 * un chiffre qu'on ignore), et la revente finale n'est pas incluse (elle
 * dépend d'une date de sortie que personne ne connaît).
 */
export function simulate(sgi: Sgi, p: SimParams): SimPoint[] {
  const rMonth = Math.pow(1 + p.annualReturnPct / 100, 1 / 12) - 1;
  const buyFee = ((sgi.courtagePct ?? 0) + MARKET_FEE_PCT) / 100;
  const custody = (sgi.custodyPctAnnual ?? 0) / 100;
  const tenue = sgi.tenueAnnual ?? 0;

  let portfolio = 0;
  let cumFees = 0;
  let contributed = 0;
  const out: SimPoint[] = [];

  const buy = (amount: number) => {
    if (amount <= 0) return;
    const fee = amount * buyFee;
    cumFees += fee;
    portfolio += amount - fee;
    contributed += amount;
  };

  buy(p.initial);
  for (let m = 1; m <= p.years * 12; m++) {
    portfolio *= 1 + rMonth;
    buy(p.monthly);
    if (m % 12 === 0) {
      const fee = portfolio * custody + tenue;
      cumFees += fee;
      portfolio -= fee;
      out.push({ year: m / 12, cumFees, portfolio, contributed });
    }
  }
  return out;
}

/** Le point d'une année donnée (repli sur le dernier point connu). */
export const atYear = (points: SimPoint[], year: number): SimPoint | undefined =>
  points.find((pt) => pt.year === year) ?? points[points.length - 1];

/** Total versé de sa poche sur l'horizon — le dénominateur du « % des versements ». */
export const totalContributed = (p: SimParams): number => p.initial + p.monthly * 12 * p.years;

/** Années repères du tableau récapitulatif, toujours terminées par l'horizon choisi. */
export function milestones(years: number): number[] {
  const marks = [1, 3, 5, 10, 15, 20].filter((y) => y <= years);
  if (!marks.includes(years)) marks.push(years);
  return marks;
}

/** Coût total d'une transaction : le courtage de la SGI + la part incompressible. */
export const totalTransactionPct = (s: Sgi): number | null =>
  s.courtagePct == null ? null : s.courtagePct + MARKET_FEE_PCT;
