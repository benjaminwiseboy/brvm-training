import type { Module } from "@/lib/types";
import { m01 } from "./modules/m01";
import { m02 } from "./modules/m02";
import { m03 } from "./modules/m03";
import { m04 } from "./modules/m04";
import { m05 } from "./modules/m05";
import { m06 } from "./modules/m06";
import { m07 } from "./modules/m07";
import { m08 } from "./modules/m08";
import { m09 } from "./modules/m09";
import { m10 } from "./modules/m10";
import { m11 } from "./modules/m11";
import { m12 } from "./modules/m12";
import { m13 } from "./modules/m13";
import { m14 } from "./modules/m14";
import { m15 } from "./modules/m15";
import { m16 } from "./modules/m16";
import { m17 } from "./modules/m17";
import { m18 } from "./modules/m18";
import { m19 } from "./modules/m19";
import { m20 } from "./modules/m20";
import { m21 } from "./modules/m21";
import { m22 } from "./modules/m22";
import { m23 } from "./modules/m23";
import { m24 } from "./modules/m24";
import { m25 } from "./modules/m25";
import { m26 } from "./modules/m26";
import { m27 } from "./modules/m27";
import { m28 } from "./modules/m28";

export const MODULES: Record<string, Module> = {
  M01: m01, M02: m02, M03: m03, M04: m04, M05: m05, M06: m06, M07: m07, M08: m08, M09: m09,
  M10: m10, M11: m11, M12: m12, M13: m13, M14: m14, M15: m15, M16: m16, M17: m17, M18: m18, M19: m19,
  M20: m20, M21: m21, M22: m22, M23: m23, M24: m24, M25: m25, M26: m26, M27: m27, M28: m28,
};

export type PhaseDef = {
  name: string;
  badge: string;
  codes: string[];
  /** Récap bullet-points affiché sur l'écran PhaseComplete (Partie 1, Tâche 8) — un item par notion clé de la phase. */
  recap: string[];
  /** Accroche d'une ligne, montrée à un compte gratuit en fin de Phase 1 pour donner envie de débloquer la suite (cf. PhaseComplete). */
  teaser?: string;
  /** Fonctionnalité annoncée mais pas encore construite (ex. export PDF) — affichée en bouton désactivé sur PhaseComplete. */
  futureNote?: string;
};

export const PHASES: PhaseDef[] = [
  {
    name: "Phase 1 · Comprendre avant d'agir",
    badge: "🥉",
    codes: ["M01", "M02", "M03", "M04"],
    recap: [
      "Ce qu'est la bourse et pourquoi la BRVM est unique au monde (8 pays, 1 seul compte).",
      "Comment on gagne de l'argent : le dividende (cash régulier) et la plus-value (capital qui grossit).",
      "Les 3 règles d'or de sécurité à respecter avant d'investir le moindre franc.",
      "Les 3 produits de la BRVM — action, obligation, OPCVM — et pour quel profil chacun est fait.",
    ],
  },
  {
    name: "Phase 2 · Trouver sa boussole",
    badge: "🥈",
    codes: ["M05", "M06", "M07", "M08", "M09", "M10"],
    recap: [
      "Votre profil d'investisseur (prudent, équilibré, croissance ou audacieux).",
      "Vos 3 stratégies possibles — rente, croissance, trade — et pour qui chacune est faite.",
      "Le plan d'investissement qui réunit objectif, horizon, stratégie et capacité d'épargne.",
      "La régularité (DCA) et les intérêts composés — le vrai moteur de l'enrichissement.",
    ],
    futureNote: "📄 Téléchargement de votre plan en PDF — bientôt disponible",
    teaser:
      "Découvrez votre profil d'investisseur et repartez avec VOTRE plan personnalisé : objectif, horizon et stratégie.",
  },
  {
    name: "Phase 3 · Passage à l'action",
    badge: "🥇",
    codes: ["M11", "M12", "M13"],
    recap: [
      "Comment choisir sa SGI et ouvrir un compte-titres — même depuis la diaspora — en mesurant le vrai impact des frais.",
      "Lire une fiche OPCVM (Valeur Liquidative, catégorie, frais) pour déléguer intelligemment, en connaissance de cause.",
      "La différence entre ordre à cours limité et ordre au marché, et comment passer votre tout premier ordre sans piège de prix.",
    ],
    teaser:
      "Ouvrez votre compte chez une SGI et passez votre tout premier ordre en bourse, pas à pas.",
  },
  {
    name: "Phase 4 · Devenir analyste",
    badge: "🏆",
    codes: ["M14", "M15", "M16", "M17", "M18", "M19", "M20", "M21", "M22", "M23", "M24"],
    recap: [
      "Lire le BOC en profondeur — indices, secteurs, PER, rendement, capitalisation — sans paniquer devant les colonnes.",
      "Les obligations dans le détail : remboursement In Fine ou Amortissement, coupon couru, et comment décoder leur nom au BOC.",
      "La méthode en 4 temps pour juger une entreprise : le portrait (qui est-elle), la performance (gagne-t-elle vraiment), les perspectives (va-t-elle le rester) et le juste prix (le prix est-il raisonnable).",
      "Mener seul une analyse complète, du portrait au verdict d'achat, alignée sur votre stratégie plutôt que sur vos émotions.",
    ],
    teaser:
      "Le cœur de la formation : analyser le marché et juger vous-même si une entreprise vaut votre argent, en 4 étapes.",
  },
  {
    name: "Phase 5 · Rester maître du jeu",
    badge: "💎",
    codes: ["M25", "M26", "M27", "M28"],
    recap: [
      "La fiscalité en pratique : pourquoi vos dividendes et la plupart de vos plus-values ne vous coûtent rien de plus dans l'UEMOA.",
      "Les bonnes raisons de vendre (objectif atteint, thèse cassée) et pourquoi une simple baisse de prix n'en est jamais une.",
      "Mobiliser toute la chaîne Profil → Stratégie → Analyse → Bon produit face à des cas concrets, jusqu'au grand oral.",
      "Garder son sang-froid en cas de krach, et transformer une baisse de marché en opportunité grâce au DCA.",
    ],
    teaser:
      "Payer le moins d'impôts possible, savoir quand vendre, et garder la tête froide même en pleine crise.",
  },
];

/** Les phases verrouillées derrière le paiement (tout sauf l'essai gratuit) — teaser de fin de Phase 1. */
export function lockedPhases(): PhaseDef[] {
  return PHASES.slice(1);
}

export function orderedCodes(): string[] { return PHASES.flatMap((p) => p.codes); }
export function getModule(code: string): Module | undefined { return MODULES[code.toUpperCase()]; }
export function getNext(code: string): Module | undefined {
  const order = orderedCodes();
  const i = order.indexOf(code.toUpperCase());
  return i >= 0 && i < order.length - 1 ? MODULES[order[i + 1]] : undefined;
}
/** La phase se termine à `code` ? Renvoie sa définition (pour l'écran PhaseComplete), sinon `undefined`. */
export function phaseCompletionFor(code: string): PhaseDef | undefined {
  const upper = code.toUpperCase();
  return PHASES.find((p) => p.codes[p.codes.length - 1] === upper);
}
