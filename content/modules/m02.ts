import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 02 — Sécurité financière (les 3 règles d'or).
   Même moteur (app.js) que M01 : quiz « Feu vert / Feu rouge »,
   4 cas à trancher (options partagées, comme M01).
   ============================================================= */
export const m02: Module = {
  code: "M02",
  index: 2,
  totalModules: 28,
  title: "Sécurité financière : les 3 règles d'or",
  phase: "Phase 1 · Fondations",
  status: { emoji: "🥉", label: "L'Épargnant Livret A" },
  reward: 20000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 02",
    headline: "Bouclez votre ceinture.",
    lead:
      "Avant d'investir le moindre franc, trois règles toutes simples séparent celui qui **dort tranquille** de celui qui **panique** à la première secousse.",
    card: {
      label: "Vos 3 règles d'or",
      title: "La sécurité avant la performance",
      hint: "Trois filtres à vérifier avant chaque investissement :",
      rules: [
        "**Le fonds d'urgence** — 3 à 6 mois de dépenses de côté, avant tout.",
        "**L'argent qu'on peut oublier** — jamais les projets à moins de 3-5 ans.",
        "**Jamais d'argent emprunté** — ni celui de l'essentiel.",
      ],
    },
    cta: "Découvrir les 3 règles d'or",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Attendez avant de foncer",
      blocks: [
        { kind: "lead", value: "Le module précédent vous a rassuré, et vous avez peut-être envie d'ouvrir un compte tout de suite. **Une minute.**" },
        { kind: "text", value: "Investir, c'est comme conduire : on ne démarre jamais sans **boucler sa ceinture**. Ces 3 règles sont votre ceinture. Elles séparent celui qui **dort tranquille** de celui qui **panique** à la première secousse." },
      ],
    },
    {
      title: "Règle n°1 : le fonds d'urgence (votre matelas) 🛡️",
      blocks: [
        { kind: "text", value: "Avant d'investir **le moindre franc**, constituez-vous un **matelas de sécurité** : **3 à 6 mois de dépenses** mis de côté dans un endroit sûr et accessible (un compte épargne, pas la bourse)." },
        { kind: "text", value: "Pourquoi ? En cas d'imprévu (perte d'emploi, santé…), vous ne serez pas forcé de vendre vos actions à perte." },
        { kind: "callout", tone: "info", value: "Exemple : vous dépensez 200 000 FCFA/mois ? Visez 600 000 à 1 200 000 FCFA de côté d'abord." },
      ],
    },
    {
      title: "Règle n°2 : de l'argent que vous pouvez oublier ⏳",
      blocks: [
        { kind: "text", value: "L'argent dont vous aurez besoin **dans moins de 3-5 ans** n'a pas sa place en actions (le marché monte et descend)." },
        {
          kind: "list",
          items: [
            "Projet proche (mariage, voiture dans 2 ans) → gardez-le en sécurité.",
            "Argent que vous pouvez **oublier** 5, 10, 20 ans → **ça, c'est votre argent d'investissement.**",
          ],
        },
      ],
    },
    {
      title: "Règle n°3 : jamais d'argent emprunté 🚫",
      blocks: [
        { kind: "text", value: "N'investissez **jamais** de l'argent emprunté : si le marché baisse, vous perdez **ET** vous devez rembourser la dette + les intérêts. Double peine." },
        { kind: "text", value: "Et jamais l'argent de l'essentiel : **loyer, scolarité, nourriture, santé.** La bourse, c'est pour votre **surplus**." },
      ],
    },
    {
      title: "Alors, combien investir ?",
      blocks: [
        { kind: "text", value: "Ce qu'il vous reste **après** avoir : (1) payé l'essentiel, (2) constitué votre fonds d'urgence, (3) mis de côté vos projets proches." },
        { kind: "text", value: "Ce surplus, investissez-le **régulièrement** (la magie de la régularité, on la verra au M10)." },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Feu vert ou feu rouge ?",
    instruction: "Pour chaque personne, dites si elle peut investir sereinement **maintenant** (🟢 Feu vert) ou si elle doit **d'abord se protéger** (🔴 Feu rouge). (1 erreur = − 5 000 FCFA.)",
    penaltyPerError: 5000,
    perfectReward: 20000,
    options: [
      { value: "vert", label: "🟢 Feu vert" },
      { value: "rouge", label: "🔴 Feu rouge" },
    ],
    questions: [
      { prompt: "**Awa** — Elle a 500 000 FCFA, **aucun fonds d'urgence**, et des revenus irréguliers. Elle veut tout placer en actions.", answer: "rouge" },
      { prompt: "**Ibrahim** — Il veut investir 1 000 000 FCFA… mais il en a besoin **dans 18 mois** pour son mariage.", answer: "rouge" },
      { prompt: "**Moussa** — Il est sûr qu'une action va monter : il veut prendre un **crédit à 15 %** pour l'acheter.", answer: "rouge" },
      { prompt: "**Fatou** — Emploi stable, **6 mois de dépenses** de côté, elle investit chaque mois un surplus qu'elle ne touchera pas avant **10 ans**.", answer: "vert" },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Fondations solides ! + 20 000 FCFA sur votre portefeuille !",
      body: "Vous avez le réflexe des investisseurs qui durent. Pas de maison sur du sable.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Une fondation fragile (− 5 000 FCFA par erreur).",
      body: "Ce sont les règles les plus importantes de la formation. Reprenons chaque cas.",
    },
    explanations: [
      {
        verdict: "🔴 Feu rouge",
        title: "Awa (Règle 1)",
        body: "Investir sans fonds d'urgence, c'est jouer à la roulette. Au premier imprévu, elle devra vendre — peut-être à perte. D'abord le matelas de sécurité, **ensuite** la bourse.",
      },
      {
        verdict: "🔴 Feu rouge",
        title: "Ibrahim (Règle 2)",
        body: "18 mois, c'est trop court. Si le marché baisse juste avant le mariage, il perd. Cet argent doit rester en sécurité.",
      },
      {
        verdict: "🔴 Feu rouge",
        title: "Moussa (Règle 3)",
        body: "La pire erreur. Personne ne garantit qu'une action monte. Si elle baisse, il perd **et** rembourse 15 % d'intérêts. **Jamais d'argent emprunté.**",
      },
      {
        verdict: "🟢 Feu vert",
        title: "Fatou",
        body: "Elle fait tout bien : fonds d'urgence, horizon long, surplus régulier. Elle dort tranquille quoi qu'il arrive. **C'est l'investisseuse que vous allez devenir.**",
        note: "**À retenir :** la BRVM récompense la patience et l'argent qu'on peut **oublier** — jamais l'argent qu'on attend avec **angoisse**.",
      },
    ],
  },

  next: {
    label: "Mes fondations sont solides ! Maintenant, comment gagne-t-on de l'argent ?",
    target: "Module 03",
  },
};
