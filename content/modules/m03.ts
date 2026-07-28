import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 03 — Les gains (dividende / plus-value).
   Défi = quiz à 3 questions ; les 2 premières utilisent l'override
   `options` par question (les distracteurs numériques n'existent pas
   tels quels dans le .txt source — champ de saisie libre dans le POC —
   converti en QCM sur décision humaine explicite, cf. task-14-brief.md).
   Module « jackpot » du barème (+30 000 FCFA, vs +20 000 pour M02/M04).
   ============================================================= */
export const m03: Module = {
  code: "M03",
  index: 3,
  totalModules: 28,
  title: "Les gains : comment gagne-t-on de l'argent ?",
  phase: "Phase 1 · Fondations",
  status: { emoji: "🥉", label: "L'Épargnant Livret A" },
  reward: 30000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 03",
    headline: "Comment l'argent arrive vraiment.",
    lead:
      "Une ligne qui monte sur un écran, ce n'est pas encore de l'argent réel. Deux moteurs bien distincts transforment un investissement en gain — et il est essentiel de ne pas les confondre.",
    card: {
      label: "Les 2 moteurs du gain",
      title: "Dividende & plus-value",
      hint: "Deux façons de gagner, à ne pas confondre :",
      rules: [
        "**Le dividende** — un revenu en cash, versé une fois par an.",
        "**La plus-value** — la valeur de votre action qui grossit.",
        "**Attention** — la plus-value n'est réelle que le jour où vous vendez.",
      ],
    },
    objectives: [
      "Distinguer le dividende (cash régulier) de la plus-value (capital qui grossit).",
      "Repérer la date de détachement du dividende dans le BOC.",
      "Calculer un rendement de dividende à partir d'un cas concret.",
    ],
    cta: "Découvrir les 2 moteurs du gain",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Deux façons de gagner",
      blocks: [
        { kind: "lead", value: "Investir, c'est faire travailler votre argent. Mais comment une ligne sur un écran devient de l'argent réel sur votre compte ?" },
        { kind: "text", value: "Il y a **deux moteurs**. Il est essentiel de bien les distinguer." },
      ],
    },
    {
      title: "Moteur 1 : le dividende (le cash) 🍊",
      blocks: [
        { kind: "text", value: "Imaginez un champ d'orangers : chaque année, vous vendez la récolte et touchez un revenu." },
        { kind: "text", value: "En bourse, c'est pareil : une fois par an (souvent entre mai et juillet), les entreprises rentables reversent une partie de leurs bénéfices aux actionnaires. C'est le **dividende** — comme un **loyer** que l'entreprise vous verse : du cash, sans avoir à vendre votre action." },
        { kind: "callout", tone: "info", value: "La BRVM est réputée pour ses dividendes élevés : souvent 8 à 10 % par an (contre ~3 % sur un livret)." },
      ],
    },
    {
      title: "⏱️ Le détail qui compte : la date de détachement",
      blocks: [
        { kind: "text", value: "Pour toucher le dividende, il faut détenir l'action **avant une date précise** (la « date de détachement »)." },
        { kind: "text", value: "Vous l'achetez juste après ? C'est comme arriver au **verger après la récolte** : les fruits (le dividende) sont déjà partis — pas de dividende cette année-là. On apprendra à repérer cette date dans le **BOC** (le Bulletin Officiel de la Cote, le « journal » quotidien de la bourse)." },
      ],
    },
    {
      title: "Moteur 2 : la plus-value (la croissance) 📈",
      blocks: [
        { kind: "text", value: "Reprenons le champ : si les terrains prennent de la valeur, votre champ vaut plus cher qu'à l'achat." },
        { kind: "text", value: "En bourse, c'est la **plus-value** : action achetée 5 000 FCFA, revendue 8 000 → +3 000 de gain." },
        { kind: "callout", tone: "warn", value: "Ce gain n'est réel **que le jour où vous vendez**." },
      ],
    },
    {
      title: "À la pratique !",
      blocks: [
        { kind: "lead", value: "Dividende = cash régulier. Plus-value = le capital qui grossit." },
        { kind: "text", value: "Voyons si c'est bien clair. 👇" },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Calcul mental guidé",
    instruction: "Lisez le scénario ci-dessous, puis répondez aux 3 questions. (Bonne réponse = + 10 000 FCFA · erreur = − 5 000 FCFA.)",
    scenario:
      "**Le scénario de Koffi :** L'an dernier, Koffi a acheté **100 actions** de la banque SuperBank à **10 000 FCFA** l'action (soit 1 000 000 FCFA investis). Aujourd'hui, l'action vaut **12 000 FCFA**, et SuperBank vient de lui verser un dividende de **1 000 FCFA par action**.",
    penaltyPerError: 5000,
    perfectReward: 30000,
    // Chaque question ci-dessous fournit son propre `options` (distracteurs
    // différents par question) — ce set partagé n'est donc jamais utilisé
    // pour le rendu ; on y recopie les options de Q3 (déjà verbatim dans le
    // .txt source) en repli neutre, pour satisfaire le type QuizChallenge.
    options: [
      { value: "5", label: "5 %" },
      { value: "10", label: "10 %" },
      { value: "15", label: "15 %" },
    ],
    questions: [
      {
        prompt: "Combien Koffi vient-il de recevoir **en cash** grâce aux dividendes ?",
        answer: "100000",
        options: [
          { value: "10000", label: "10 000 FCFA" },
          { value: "100000", label: "100 000 FCFA" },
          { value: "1000000", label: "1 000 000 FCFA" },
        ],
      },
      {
        prompt: "S'il revend toutes ses actions aujourd'hui, quelle est sa **plus-value** ?",
        answer: "200000",
        options: [
          { value: "20000", label: "20 000 FCFA" },
          { value: "200000", label: "200 000 FCFA" },
          { value: "2000000", label: "2 000 000 FCFA" },
        ],
      },
      {
        prompt: "Le « rendement du dividende » = dividende ÷ prix d'achat. Quel rendement Koffi a-t-il obtenu ?",
        answer: "10",
        options: [
          { value: "5", label: "5 %" },
          { value: "10", label: "10 %" },
          { value: "15", label: "15 %" },
        ],
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Jackpot ! + 30 000 FCFA sur votre portefeuille !",
      body: "Sans-faute. Vous avez compris la mécanique de l'enrichissement. Fixons ça avec l'analyse ci-dessous.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Le marché vous a corrigé.",
      body: "Les maths financières intimident au début. Reprenons pas à pas — c'est plus simple qu'il n'y paraît.",
    },
    explanations: [
      {
        verdict: "100 000 FCFA",
        title: "Le dividende (le cash)",
        body: "100 actions × 1 000 FCFA = **100 000 FCFA**. De l'argent réel, à dépenser ou réinvestir dès aujourd'hui.",
      },
      {
        verdict: "200 000 FCFA",
        title: "La plus-value",
        body: "achetée 10 000, elle vaut 12 000 → +2 000 par action. Sur 100 actions : 100 × 2 000 = **200 000 FCFA** de bénéfice (s'il vend).",
      },
      {
        verdict: "10 %",
        title: "Le rendement",
        body: "(1 000 ÷ 10 000) × 100 = 10 %. C'est la métrique reine de l'investisseur BRVM.",
        note: "**À retenir :** sans rien faire d'autre qu'acheter il y a un an, Koffi a gagné **100 000 FCFA en cash** et son patrimoine s'est apprécié de **200 000 FCFA**. Voilà la puissance de l'investissement.",
      },
    ],
  },

  next: {
    label: "Génial ! Mais qu'est-ce qu'on achète, exactement ?",
    target: "Module 04",
  },
};
