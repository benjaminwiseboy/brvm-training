import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 04 — Les produits (Action / Obligation / OPCVM).
   Défi = « match profil ↔ produit » : le .txt suggère un menu déroulant
   ou un glisser-déposer, mais la forme s'intègre parfaitement au quiz à
   options partagées existant (3 options au lieu de 2, cf. m01/m02).
   Dernier module de la Phase 1 : le paragraphe de transition « Fin de la
   Phase 1 » du .txt est replié dans le `note` de la dernière explication
   (Fatou), comme le "À retenir" de M02/M03 — pas un 4ᵉ entrée séparée,
   pour garder `explanations.length === questions.length` (cf. le rendu
   "Les {total} explications" dans Bilan.tsx, corrigé en review Task 14).
   ============================================================= */
export const m04: Module = {
  code: "M04",
  index: 4,
  totalModules: 28,
  title: "Les produits : ce qu'on achète à la BRVM",
  phase: "Phase 1 · Fondations",
  status: { emoji: "🥉", label: "L'Épargnant Livret A" },
  reward: 20000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 04",
    headline: "Trois rayons, un seul critère.",
    lead:
      "Action, obligation, OPCVM : trois familles de produits à la BRVM, qui se distinguent toutes par le même compromis entre le **risque** que vous prenez et le **gain** que vous pouvez espérer.",
    card: {
      label: "Les 3 produits de la BRVM",
      title: "Action, obligation, OPCVM",
      hint: "Trois familles, un seul arbitrage : risque contre gain.",
      rules: [
        "**L'action** — copropriétaire d'une entreprise, potentiel élevé, risque réel.",
        "**L'obligation** — prêteur d'un État ou d'une entreprise, revenu fixe et prévisible.",
        "**L'OPCVM** — un panier géré par des professionnels, risque mutualisé.",
      ],
    },
    objectives: [
      "Différencier action, obligation et OPCVM sur le couple risque/gain.",
      "Associer le bon produit à un objectif et un horizon donnés.",
    ],
    cta: "Découvrir les 3 produits",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Les 3 rayons du supermarché",
      blocks: [
        { kind: "lead", value: "Vous savez comment on gagne de l'argent. Reste à choisir **quoi** acheter." },
        { kind: "text", value: "La BRVM propose **3 grands types de produits**. Ils se distinguent tous par une seule chose : le compromis entre le **risque** que vous prenez et le **gain** que vous pouvez espérer." },
      ],
    },
    {
      title: "L'action : devenir copropriétaire",
      blocks: [
        { kind: "text", value: "Acheter une action, c'est acheter une **petite part d'une entreprise** (Sonatel, BOA…). Vous en devenez copropriétaire : vous touchez une part des bénéfices (le dividende) et vous profitez de la hausse de sa valeur (la plus-value)." },
        {
          kind: "list",
          items: [
            "**Un potentiel élevé** : c'est le seul produit qui peut, en même temps, vous verser de gros dividendes ET voir son prix grimper fortement.",
            "**Mais un vrai risque** : si l'entreprise fait une mauvaise année, le prix de l'action peut baisser, et le dividende être réduit ou supprimé. Vous êtes copropriétaire dans les bons **comme** dans les mauvais moments.",
          ],
        },
      ],
    },
    {
      title: "L'obligation : devenir prêteur",
      blocks: [
        { kind: "text", value: "Une obligation, c'est un **prêt** : vous prêtez votre argent à un État (Côte d'Ivoire, Sénégal…) ou à une grande entreprise. En échange, l'emprunteur s'engage à vous verser un **intérêt fixe** chaque année (souvent 5,5 à 7 %), puis à vous **rendre tout votre capital** à une date connue d'avance." },
        {
          kind: "list",
          items: [
            "**Un potentiel moyen mais prévisible** : dès le premier jour, vous savez exactement combien vous toucherez, et quand. Aucune surprise.",
            "**Un risque faible** : le seul danger serait que l'emprunteur ne rembourse pas — très rare pour les États de l'UEMOA. C'est l'investissement anti-stress par excellence.",
          ],
        },
      ],
    },
    {
      title: "L'OPCVM : le panier tout fait",
      blocks: [
        { kind: "text", value: "Pas le temps (ni l'envie) d'analyser des dizaines d'entreprises ? L'**OPCVM** (Organisme de Placement Collectif en Valeurs Mobilières), aussi appelé **FCP** (Fonds Commun de Placement), est un **panier géré par des professionnels**. Vous achetez une part du panier, et des experts choisissent les actions et obligations à votre place." },
        {
          kind: "list",
          items: [
            "**Un potentiel moyen à élevé**, selon le contenu du panier (plutôt actions, ou plutôt obligations).",
            "**Un risque mutualisé** : votre argent est réparti sur des dizaines de valeurs. Si l'une baisse, les autres amortissent le choc — vous ne mettez pas tous vos œufs dans le même panier.",
            "**En échange**, vous payez des **frais de gestion** annuels aux professionnels qui travaillent pour vous.",
          ],
        },
      ],
    },
    {
      title: "Alors, quel est le meilleur produit ?",
      blocks: [
        { kind: "callout", tone: "highlight", value: "**Aucun !** Il n'existe pas de meilleur produit dans l'absolu : tout dépend de **votre besoin** — votre horizon (quand aurez-vous besoin de l'argent ?) et votre tolérance au risque." },
        { kind: "text", value: "Voyons comment associer le bon produit à la bonne personne. 👇" },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Le match de l'investisseur",
    instruction: "Trois amis vous demandent conseil. Associez chaque profil au bon produit. (1 erreur = − 5 000 FCFA.)",
    penaltyPerError: 5000,
    perfectReward: 20000,
    options: [
      { value: "action", label: "Action" },
      { value: "obligation", label: "Obligation" },
      { value: "opcvm", label: "OPCVM" },
    ],
    questions: [
      { prompt: "**Amina (la prudente)** — Elle a économisé 5 M FCFA pour construire sa maison dans **4 ans**. Elle veut faire grossir cet argent sans risque, et savoir exactement ce qu'elle gagnera.", answer: "obligation" },
      { prompt: "**Seydou (le pressé)** — Chirurgien, 60 h/semaine. Il sait que la bourse rapporte, mais **aucun temps** pour analyser. Il veut déléguer.", answer: "opcvm" },
      { prompt: "**Fatou (l'ambitieuse)** — 30 ans, elle investit 50 000 FCFA/mois pour sa **lointaine retraite**. Elle accepte les baisses, elle vise le **rendement maximum** sur le long terme.", answer: "action" },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Match parfait ! + 20 000 FCFA sur votre portefeuille !",
      body: "Vous avez un instinct de conseiller : le « bon produit » dépend du besoin de la personne.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Un mauvais conseil coûte cher (− 5 000 FCFA par erreur).",
      body: "Analysons pourquoi chaque produit colle à un profil.",
    },
    explanations: [
      {
        verdict: "Obligation",
        title: "Amina",
        body: "Elle a besoin de son argent dans un délai court et précis (4 ans) et refuse le risque. L'obligation d'État lui garantit son capital à l'échéance + un intérêt connu d'avance.",
      },
      {
        verdict: "OPCVM",
        title: "Seydou",
        body: "Le profil idéal pour déléguer. Plutôt que d'analyser lui-même, il paie des professionnels via un FCP pour gérer à sa place.",
      },
      {
        verdict: "Action",
        title: "Fatou",
        body: "Elle a le temps (horizon long) et vise le rendement max. Elle peut encaisser la volatilité. Seules les actions solides offrent cette croissance de long terme.",
        note: "🏆 **Bravo, vous terminez la Phase 1 « Les Fondations » !** Vous connaissez le marché, les produits et la façon de gagner de l'argent. Vous ne regarderez plus jamais le journal télé de la même manière. Il est temps de définir VOTRE propre stratégie.",
      },
    ],
  },

  next: {
    label: "Débloquer mon statut « Investisseur Curieux » et passer à la Phase 2 !",
    target: "Module 05",
  },
};
