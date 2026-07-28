import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 10 — DCA & intérêts composés.
   Même moteur (app.js) que M01, mais section « Défi » de type
   SIMULATEUR (pas de quiz, pas de score) → montre la souplesse
   du moteur piloté par les données.
   ============================================================= */
export const m10: Module = {
  code: "M10",
  index: 10,
  totalModules: 28,
  title: "DCA & intérêts composés",
  phase: "Phase 2 · La Boussole",
  status: { emoji: "🥈", label: "L'Investisseur Curieux" },
  startingCapital: 1060000, // portefeuille repris des modules précédents

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 10",
    headline: "La magie de la régularité.",
    lead:
      "Pas besoin de talent, de chance, ni de deviner l'avenir. Deux mécanismes tout simples suffisent — et c'est le **temps** qui fait le plus gros du travail.",
    card: {
      label: "Votre arme secrète",
      title: "Régularité = enrichissement",
      hint: "Deux mécanismes, zéro talent requis :",
      rules: [
        "**Le DCA** — investir un montant fixe, chaque mois.",
        "**Les intérêts composés** — réinvestir ses gains.",
        "**Le temps** — le vrai moteur, on va le voir en direct.",
      ],
    },
    objectives: [
      "Comprendre le DCA (investir un montant fixe, à intervalle régulier).",
      "Comprendre les intérêts composés et pourquoi le temps est le vrai moteur.",
      "Simuler l'écart entre l'argent investi et la richesse totale.",
    ],
    cta: "Découvrir ces mécanismes",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Le super-pouvoir qui ne demande aucun talent",
      blocks: [
        { kind: "text", value: "Vous connaissez votre profil (M05) et votre stratégie — rente (M06) ou croissance (M07)." },
        { kind: "text", value: "Reste l'arme la plus puissante : la **régularité**. Elle ne demande **ni don, ni chance, ni de deviner l'avenir**, et repose sur deux mécanismes : le **DCA** et les **intérêts composés**." },
        { kind: "callout", tone: "info", value: "Rappel : gardez d'abord une poche de sécurité en obligations, selon votre profil." },
      ],
    },
    {
      title: "Le DCA, c'est quoi ?",
      blocks: [
        { kind: "lead", value: "DCA = **Dollar Cost Averaging** — « investir un montant fixe, à intervalle régulier »." },
        { kind: "text", value: "Le principe est tout simple : vous investissez **le même montant, chaque mois** (par exemple 25 000 FCFA le 5), **quoi qu'il arrive** sur le marché. Pas besoin de choisir le « bon moment » : vous investissez, un point c'est tout." },
      ],
    },
    {
      title: "Pourquoi ça marche : le lissage",
      blocks: [
        { kind: "text", value: "Comme le montant est fixe, la **quantité d'actions achetées s'ajuste toute seule** :" },
        {
          kind: "duo",
          items: [
            { side: "Marché en baisse", value: "vos 25 000 F achètent **plus** d'actions (elles sont en promo)." },
            { side: "Marché en hausse", value: "ils en achètent **moins** (elles sont plus chères)." },
          ],
        },
        { kind: "text", value: "Résultat : vous achetez **plus quand c'est bon marché, moins quand c'est cher**. Votre prix moyen est **lissé** — fini le piège n°1 : tout investir d'un coup juste avant une baisse." },
      ],
    },
    {
      title: "Votre Cours Moyen Pondéré (CMP)",
      blocks: [
        { kind: "text", value: "Ce lissage se mesure : le **CMP (Cours Moyen Pondéré)** est votre **prix d'achat moyen**, une fois toutes vos acquisitions additionnées." },
        { kind: "callout", tone: "highlight", value: "**CMP = total investi ÷ nombre d'actions détenues.**" },
        { kind: "text", value: "Exemple : 10 actions à 5 000 (50 000 F), puis 10 actions à 4 000 (40 000 F) → 20 actions pour 90 000 F, donc **CMP = 4 500 FCFA**." },
        { kind: "text", value: "C'est votre **point d'équilibre** : au-dessus de 4 500 vous êtes en gain, en dessous en perte. Acheter régulièrement — et davantage quand ça baisse — garde le CMP bas." },
      ],
    },
    {
      title: "Fini le stress du « bon moment »",
      blocks: [
        { kind: "text", value: "Deviner le sommet ou le creux du marché, personne n'y arrive durablement — même les professionnels." },
        { kind: "lead", value: "Le DCA vous en libère : vous investissez à **date fixe**, et le temps fait le reste." },
      ],
    },
    {
      title: "Les intérêts composés : la boule de neige ❄️",
      blocks: [
        { kind: "text", value: "Deuxième mécanisme : au lieu de dépenser vos dividendes, vous les **réinvestissez**. Ils achètent de nouvelles actions, qui verseront à leur tour des dividendes… qui achèteront encore des actions." },
        { kind: "callout", tone: "highlight", value: "100 000 F à 8 % → 8 000 F la 1ʳᵉ année. Réinvestis : l'an d'après, 8 % sur **108 000**, puis sur **116 640**… La boule de neige grossit **de plus en plus vite**." },
      ],
    },
    {
      title: "Voyez-le vous-même",
      blocks: [
        { kind: "lead", value: "Montant régulier (DCA) + réinvestissement (intérêts composés) = le vrai moteur de l'enrichissement en bourse." },
        { kind: "text", value: "Jouez avec le simulateur ci-dessous pour le ressentir. 👇" },
      ],
    },
  ],

  // ---- Section 2 : le simulateur (interactif, sans score) ----
  challenge: {
    type: "simulator",
    kicker: "Le Simulateur",
    title: "Le simulateur d'enrichissement",
    instruction: "Réglez vos paramètres et regardez l'écart se creuser entre l'argent investi et la richesse totale. Poussez surtout la DURÉE au maximum. 👇",
    sliders: [
      { key: "monthly", label: "Montant investi par mois", min: 10000, max: 200000, step: 5000, value: 25000, kind: "money" },
      { key: "rate", label: "Rendement annuel espéré", min: 2, max: 15, step: 0.5, value: 8, kind: "pct" },
      { key: "years", label: "Durée", min: 1, max: 30, step: 1, value: 15, kind: "years" },
    ],
    note: "⚠️ Le rendement n'est jamais garanti — c'est une hypothèse pour illustrer le mécanisme.",
  },

  // ---- Section 3 : la leçon (s'affiche après le simulateur) ----
  feedback: {
    headline: {
      icon: "💡",
      title: "Ce qui fait exploser la courbe, c'est le TEMPS.",
      body: "Investir **25 000 FCFA/mois pendant 20 ans** rapporte souvent bien plus que **100 000 FCFA/mois pendant 5 ans**. Le montant aide ; le temps, lui, décuple.",
    },
    golden: "**La leçon d'or :** le meilleur moment pour commencer, c'était il y a 10 ans. Le deuxième, c'est **aujourd'hui**. Peu importe le montant — commencez tôt, régulièrement, et réinvestissez.",
  },

  next: {
    label: "Débloquer « Analyste Stratège » et apprendre à lire le BOC !",
    target: "Module 11",
  },
};
