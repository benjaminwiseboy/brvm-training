import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 22 — Passer votre premier ordre. Phase 4
   « Passage à l'action ».
   Barème standard Phase 4 (Bareme harmonise.txt §4 : « Phase 4 —
   Action | +20 000 | −5 000 ») : perfectReward 20000 /
   penaltyPerError 5000 / reward 20000 — confirmé par le propre
   texte du .txt (« + 20 000 FCFA » / « − 5 000 FCFA »).
   Défi = quiz à UNE SEULE question (3 boutons) : `challenge.questions`
   a donc 1 seule entrée, et `feedback.explanations` AUSSI 1 seule
   entrée (la mécanique du carnet d'ordres et son résultat chiffré
   sont un seul raisonnement, combiné dans un seul `body`, comme
   M14/M20). La « règle d'or à la BRVM » de conclusion est repliée
   dans le `.note` de cette explication unique.
   Métaphore du grand marché d'Adjamé/Dantokpa (négociation, carnet
   d'ordres) préservée verbatim, comme demandé par le brief.
   ============================================================= */
export const m22: Module = {
  code: "M22",
  index: 22,
  totalModules: 26,
  title: "Passer votre premier ordre",
  phase: "Phase 4 · Passage à l'action",
  status: { emoji: "🎓", label: "L'Analyste Confirmé" },
  reward: 20000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 22",
    headline: "La bourse, c'est le grand marché : on négocie.",
    lead:
      "Comme au grand marché d'Adjamé ou de Dantokpa, la bourse n'a pas de prix fixe : pour acheter, il faut qu'un autre investisseur accepte de vendre. Le **carnet d'ordres** met face à face acheteurs et vendeurs, et deux types d'ordres vous permettent d'y participer.",
    card: {
      label: "Les 2 types d'ordres",
      title: "Cours limité vs marché",
      hint: "Le réflexe qui protège votre budget, et celui qui va vite :",
      rules: [
        "**L'ordre à cours limité 🛡️** — vous fixez un prix maximum, vous maîtrisez votre budget.",
        "**L'ordre au marché 🚀** — aucun prix fixé, exécution immédiate, mais risque de payer plus cher.",
      ],
    },
    cta: "Passer mon premier ordre",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Comment parler au marché",
      blocks: [
        { kind: "text", value: "La bourse n'est pas un supermarché à prix fixes. C'est comme le grand marché d'Adjamé ou de Dantokpa : **on négocie**. Pour acheter, il faut qu'un autre investisseur accepte de vendre." },
      ],
    },
    {
      title: "Le carnet d'ordres",
      blocks: [
        { kind: "text", value: "C'est le tableau qui met face à face les **acheteurs** et les **vendeurs**. Pour y participer, vous avez principalement **2 types d'ordres**." },
      ],
    },
    {
      title: "L'ordre à cours limité 🛡️ (le stratège)",
      blocks: [
        { kind: "text", value: "Vous fixez un **prix maximum** : « j'achète, mais pas au-dessus de 5 000 FCFA ». C'est le réflexe du bon acheteur au marché : vous avez une somme en tête, et vous ne payez pas un franc de plus." },
        {
          kind: "list",
          items: [
            "Avantage : aucune mauvaise surprise, vous maîtrisez votre budget (et vos ratios).",
            "Risque : si personne ne vend à ce prix, votre ordre n'est pas exécuté.",
          ],
        },
      ],
    },
    {
      title: "L'ordre au marché 🚀 (le pressé)",
      blocks: [
        { kind: "text", value: "Vous ne fixez **aucun prix** : « achetez tout de suite, peu importe le coût ». C'est foncer tête baissée : très rapide, mais on peut le payer cher." },
        {
          kind: "list",
          items: [
            "Avantage : vous obtenez vos actions immédiatement.",
            "Risque : vous pouvez payer **beaucoup plus cher** que prévu, surtout si l'action est peu liquide. Voyons pourquoi. 👇",
          ],
        },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Le carnet d'ordres",
    instruction:
      "Action fictive « Afri-Transport ». Clôture d'hier (BOC) : 4 000 FCFA. Vous voulez 15 actions ce matin. Le carnet d'ordres (les vendeurs) : Vendeur n°1, 5 actions à 4 050 FCFA. Vendeur n°2, 10 actions à 4 300 FCFA. Votre action : pressé, vous passez un ordre « au marché » pour 15 actions d'un coup. (1 erreur = − 5 000 FCFA.)",
    penaltyPerError: 5000,
    perfectReward: 20000,
    options: [
      { value: "force_hier", label: "Il force les vendeurs à me vendre à 4 000 (le prix d'hier)." },
      { value: "cascade", label: "Il prend les 5 premières à 4 050, puis les 10 suivantes à 4 300 → mon budget moyen explose." },
      { value: "annule", label: "Il annule mon ordre, car aucun vendeur n'a 15 actions d'un coup." },
    ],
    questions: [
      {
        prompt: "**Question : que fait le système, et quel en est le résultat ?**",
        answer: "cascade",
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Excellente vision du marché ! + 20 000 FCFA sur votre portefeuille !",
      body: "Vous avez évité le piège classique des marchés peu liquides.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Le marché vous a fait payer le prix fort (− 5 000 FCFA).",
      body: "Reprenons la mécanique de l'ordre « au marché ».",
    },
    explanations: [
      {
        verdict: "Il prend les 5 premières à 4 050, puis les 10 suivantes à 4 300",
        title: "La mécanique de l'ordre « au marché »",
        body: "Le système « mange » les lignes du carnet, de la moins chère à la plus chère, jusqu'à votre quantité. 1. Il prend les 5 actions à 4 050. 2. Il lui en faut 10 de plus → il prend celles à 4 300. 3. Il accepte, car vous n'avez mis aucune limite. **Résultat :** vous pensiez payer ~4 000, vous vous retrouvez avec des actions à 4 300.",
        note: "**La règle d'or à la BRVM :** le marché est parfois peu liquide. **Utilisez TOUJOURS l'ordre à cours limité.** Avec une limite à 4 100, vous auriez eu les 5 premières, et votre ordre aurait sagement attendu le reste à bon prix. Vous restez maître de votre argent.",
      },
    ],
  },

  next: {
    label: "Je protège mes ordres ! Au fait, que réclame l'État sur mes gains ?",
    target: "Module 23",
  },
};
