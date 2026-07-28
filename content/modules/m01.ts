import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 01 — donnée pure.
   Le moteur (app.js) sait afficher N'IMPORTE quel module à
   partir d'un objet de cette forme. Un module = un fichier de
   données. (Ici en global window.* pour fonctionner en file://.)
   ============================================================= */
export const m01: Module = {
  code: "M01",
  index: 1,
  totalModules: 28,
  title: "Démystifier la Bourse et la BRVM",
  phase: "Phase 1 · Fondations",
  status: { emoji: "🥉", label: "L'Épargnant Livret A" },
  startingCapital: 1000000,
  reward: 20000,

  // ---- Écran d'accueil : le « cadeau » du capital ----
  hero: {
    eyebrow: "Formation BRVM · Module 01",
    headline: "Oubliez Wall&nbsp;Street.",
    lead:
      "Bienvenue dans **BRVM Learning** ! Vous allez apprendre à investir à la Bourse Régionale des Valeurs Mobilières, module après module, sans jargon inutile. On commence par une idée simple : écrans rouges, traders qui hurlent au téléphone… oubliez ces images. La bourse, surtout la BRVM, est bien plus **calme, sûre et accessible** que vous ne le croyez.",
    objectives: [
      "Comprendre ce qu'est réellement la bourse, et à quoi elle sert.",
      "Découvrir ce qui rend la BRVM unique au monde (8 pays, 1 seul compte).",
      "Démonter 4 idées reçues qui empêchent beaucoup de gens d'investir.",
    ],
    cta: "Recevoir mon million et commencer",
  },

  // ---- Section 1 : le cours, découpé en slides ----
  slides: [
    {
      title: "Oubliez Wall Street",
      blocks: [
        { kind: "lead", value: "Écrans rouges, traders qui hurlent au téléphone… oubliez ces images." },
        { kind: "text", value: "La bourse, surtout la BRVM, est bien plus **calme, sûre et accessible** que vous ne le croyez." },
      ],
    },
    {
      title: "La bourse, c'est quoi ?",
      blocks: [
        { kind: "text", value: "Imaginez un grand **marché couvert**." },
        {
          kind: "duo",
          items: [
            { side: "D'un côté", value: "des entreprises et des États qui ont besoin d'argent (routes, 5G, usines…)." },
            { side: "De l'autre", value: "vous, avec vos économies." },
          ],
        },
        { kind: "text", value: "La bourse, c'est juste le **lieu de rencontre** — ultra-sécurisé — entre les deux." },
      ],
    },
    {
      title: "La BRVM, une exception mondiale",
      blocks: [
        { kind: "text", value: "La **BRVM** (Bourse Régionale des Valeurs Mobilières) est née en 1998, portée par les fondateurs de l'**UEMOA** (Union Économique et Monétaire Ouest-Africaine — 8 pays qui partagent une monnaie, le FCFA)." },
        { kind: "callout", tone: "highlight", value: "C'est **la seule bourse au monde partagée par 8 pays**." },
        {
          kind: "countries",
          items: ["Bénin", "Burkina Faso", "Côte d'Ivoire", "Guinée-Bissau", "Mali", "Niger", "Sénégal", "Togo"],
        },
      ],
    },
    {
      title: "Ce que ça change pour vous",
      blocks: [
        { kind: "text", value: "Depuis votre téléphone, sur **une seule plateforme**, vous pouvez :" },
        {
          kind: "list",
          items: [
            "acheter une part d'un télécom **sénégalais**,",
            "prêter à l'**État ivoirien**,",
            "investir dans l'**agriculture burkinabè**.",
          ],
        },
        { kind: "callout", tone: "info", value: "Un seul compte, 8 pays — et vous pouvez l'ouvrir **même depuis l'étranger** : la diaspora est la bienvenue." },
      ],
    },
    {
      title: "Avant d'aller plus loin…",
      blocks: [
        { kind: "lead", value: "Faisons d'abord le tri dans les idées reçues." },
        { kind: "text", value: "Prêt ? Place au défi. 👇" },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Mythe ou Réalité ?",
    instruction: "Pour chaque affirmation, tranchez : mythe ou réalité ?",
    penaltyPerError: 5000,
    perfectReward: 20000,
    options: [
      { value: "mythe", label: "Mythe" },
      { value: "realite", label: "Réalité" },
    ],
    questions: [
      { prompt: "« Il faut être riche pour investir à la BRVM. »", answer: "mythe" },
      { prompt: "« C'est trop risqué : je peux perdre 50 % de mon argent en une seule journée. »", answer: "mythe" },
      { prompt: "« Prêter aux États et entreprises de la région est dangereux : ils font souvent faillite. »", answer: "mythe" },
      { prompt: "« Pour investir au Sénégal ET au Togo, il me faut deux comptes différents. »", answer: "mythe" },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Gagné ! Vous avez déjà le bon état d'esprit.",
      body: "Excellent départ. Lisons les explications pour consolider tout ça.",
    },
    imperfect: {
      icon: "📉",
      title: "Le marché vous a corrigé — pas de panique.",
      body: "C'est le moment d'apprendre. La peur est le pire ennemi de l'investisseur.",
    },
    explanations: [
      {
        verdict: "Mythe",
        title: "« Il faut être riche »",
        body: "À la BRVM, certaines excellentes actions coûtent moins de **2 000 FCFA** l'unité, et on peut ouvrir un compte avec **10 000 FCFA** chez certains courtiers. Ce n'est pas la taille du départ qui compte : c'est la **régularité**.",
      },
      {
        verdict: "Mythe",
        title: "« Perdre la moitié en un jour »",
        body: "Un mécanisme de sécurité, le **coupe-circuit**, empêche une action de bouger de plus de **± 7,5 %** par jour. Aucun « krach éclair » ne peut donc vous ruiner du jour au lendemain.",
        note: "Mais ce plafond ne vaut que pour **une** séance : une action peut baisser plusieurs jours de suite. Oui, on peut perdre de l'argent en bourse — c'est le risque normal de tout placement. La bonne nouvelle : ce risque se **maîtrise** (règles de sécurité, diversification, analyse).",
      },
      {
        verdict: "Mythe",
        title: "« Les défauts sont fréquents »",
        body: "Sur le marché obligataire de la BRVM, les défauts qui font perdre son capital sont **rares**. Les États de l'UEMOA ont jusqu'ici honoré leurs dettes (parfois via des rééchelonnements).",
        note: "« Rare » ne veut pas dire « impossible » : on ne prête jamais les yeux fermés. On regarde **qui** emprunte, et on diversifie.",
      },
      {
        verdict: "Mythe",
        title: "« Il faut plusieurs comptes »",
        body: "Un **seul** compte, chez un seul courtier (une **SGI**, Société de Gestion et d'Intermédiation), vous ouvre les entreprises des **8 pays** de l'UEMOA. C'est l'outil parfait pour diversifier dans toute la région.",
      },
    ],
  },

  next: {
    label: "Je suis rassuré ! Posons les bases de sécurité.",
    target: "Module 02",
  },
};
