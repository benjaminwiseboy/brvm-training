import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 21 — Les OPCVM en pratique (déléguer
   intelligemment). Phase 4 « Passage à l'action ».
   Barème standard Phase 4 (Bareme harmonise.txt §4 : « Phase 4 —
   Action | +20 000 | −5 000 ») : perfectReward 20000 /
   penaltyPerError 5000 / reward 20000 — confirmé par le propre
   texte du .txt (« + 20 000 FCFA » / « − 5 000 FCFA »).
   Défi à 4 questions : contrairement à M16/M17 (restructuration
   nécessaire), ici le mapping est 1:1 — le .txt liste ses 4
   réponses attendues dans le même ordre (Q1 VL, Q2 catégorie/profil,
   Q3 frais, Q4 performance passée) ET son explication détaillée a
   exactement 4 puces dans le même ordre. Aucune fusion ni
   éclatement nécessaire : `feedback.explanations.length` = 4 =
   `challenge.questions.length`.
   Chaque question a son propre jeu de boutons (options par
   question) car les libellés diffèrent d'une question à l'autre ;
   les options du niveau `challenge` reprennent celles de Q1 en
   repli neutre (requis par le type QuizChallenge), comme M16/M19.
   ============================================================= */
export const m21: Module = {
  code: "M21",
  index: 21,
  totalModules: 26,
  title: "Les OPCVM en pratique (déléguer intelligemment)",
  phase: "Phase 4 · Passage à l'action",
  status: { emoji: "🥇", label: "L'Analyste Stratège" },
  reward: 20000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 21",
    headline: "Le pilote automatique de la bourse.",
    lead:
      "Souvenez-vous de Seydou, le chirurgien pressé (M04). Sa solution, c'est l'**OPCVM** : un panier de titres géré par des professionnels. Vous achetez une **part** du panier, et la diversification comme le suivi sont faits pour vous — moyennant des frais, et un vrai abandon de contrôle.",
    card: {
      label: "Ce qu'il faut savoir avant de déléguer",
      title: "VL, catégories, frais",
      hint: "Trois choses à maîtriser pour choisir un fonds :",
      rules: [
        "**La Valeur Liquidative (VL)** — le prix d'une part, votre thermomètre de performance.",
        "**La catégorie** — Actions, Obligations, Diversifié, Monétaire : le niveau de risque du panier.",
        "**Les frais** — entrée/sortie visibles, frais de gestion déjà inclus dans la VL.",
      ],
    },
    cta: "Découvrir les OPCVM",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Le pilote automatique de la bourse",
      blocks: [
        { kind: "text", value: "Souvenez-vous de Seydou, le chirurgien pressé (M04). Sa solution, c'est l'**OPCVM** : un panier de titres géré par des professionnels (une SGO, Société de Gestion d'OPCVM). Vous achetez une **part** du panier, et la diversification comme le suivi sont faits pour vous." },
      ],
    },
    {
      title: "Les 3 façons d'investir en bourse",
      blocks: [
        {
          kind: "list",
          items: [
            "**Gestion libre** — vous choisissez vous-même vos actions (tout ce qu'on a appris jusqu'ici).",
            "**Gestion sous mandat** — vous avez un portefeuille à votre nom, mais c'est la SGI qui le gère pour vous, selon un mandat.",
            "**Gestion collective (l'OPCVM)** — pas de portefeuille à votre nom : vous achetez des **parts** d'un panier commun à des milliers d'épargnants. C'est notre sujet ici.",
          ],
        },
      ],
    },
    {
      title: "La Valeur Liquidative (VL)",
      blocks: [
        { kind: "text", value: "C'est LE chiffre à connaître : la **Valeur Liquidative**, c'est le **prix d'une part** du fonds. Vous achetez et vendez à ce prix." },
        { kind: "text", value: "Elle est recalculée régulièrement : quand le panier prend de la valeur, la VL monte ; quand il baisse, elle baisse. C'est votre thermomètre de performance." },
      ],
    },
    {
      title: "Les catégories : que contient le panier ?",
      blocks: [
        { kind: "text", value: "Le BOC classe chaque fonds par catégorie, ce qui indique son niveau de risque. À vous de choisir selon votre profil (M05) :" },
        {
          kind: "list",
          items: [
            "**A (Actions)** — investit surtout en actions : **potentiel élevé, mais volatil**. Pour les profils audacieux.",
            "**OMLT / OCT (Obligations)** — investit en obligations (moyen/long ou court terme) : **plus sûr et régulier**. Pour les prudents.",
            "**D (Diversifié)** — un mélange d'actions et d'obligations : **équilibré**.",
            "**M (Monétaire)** — placements très courts, quasi-cash : **très sûr, faible rendement** (pour « garer » de l'argent en attendant).",
            "**C (Contractuel)** — rendement encadré par une formule définie à l'avance.",
          ],
        },
      ],
    },
    {
      title: "Les frais (simples)",
      blocks: [
        { kind: "text", value: "Vous payez des **frais d'entrée** (à la souscription) et de **sortie** (au rachat) — par ex. 1 % à l'entrée. Entre les deux, rien de visible : les **frais de gestion** des professionnels sont prélevés **à l'intérieur du fonds** (déjà reflétés dans la VL). C'est plus lisible que la gestion directe (transactions + droits de garde)." },
      ],
    },
    {
      title: "⚠️ La contrepartie : vous déléguez le contrôle",
      blocks: [
        { kind: "text", value: "Vous ne décidez pas des choix du fonds. Un gérant peut se tromper : un fonds **peut sous-performer, voire mal tourner** (ça s'est déjà vu à la BRVM, avec des fonds en difficulté pour rembourser leurs porteurs)." },
        { kind: "text", value: "L'OPCVM n'est donc **pas** sans risque — regardez le sérieux et l'historique du gérant, et diversifiez. 👇" },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Choisir le bon fonds",
    instruction:
      "Extrait de la page OPCVM du BOC. **FCP Croissance Actions** | Catégorie A | VL 15 300 FCFA | +205 % depuis 2016. **FCP Sérénité Obligations** | Catégorie OMLT | VL 13 200 FCFA | +38 % depuis 2018. **FCP Diversifié Équilibre** | Catégorie D | VL 24 000 FCFA | +140 % depuis 2017. **FCP Trésorerie** | Catégorie M (monétaire) | VL 10 700 FCFA | +7 %. (1 erreur = − 5 000 FCFA.)",
    penaltyPerError: 5000,
    perfectReward: 20000,
    // Recopie des options de Q1 en repli neutre (requis par le type) :
    // chaque question a sa propre liste de boutons.
    options: [
      { value: "prix_part", label: "Le prix d'une part du fonds." },
      { value: "benefice", label: "Le bénéfice annuel." },
      { value: "frais", label: "Les frais." },
    ],
    questions: [
      {
        prompt: "**Q1 :** Que représente la « Valeur Liquidative » de 15 300 FCFA ?",
        answer: "prix_part",
        options: [
          { value: "prix_part", label: "Le prix d'une part du fonds." },
          { value: "benefice", label: "Le bénéfice annuel." },
          { value: "frais", label: "Les frais." },
        ],
      },
      {
        prompt: "**Q2 :** Awa est **prudente** (éviter les grosses secousses). Quel fonds ?",
        answer: "serenite",
        options: [
          { value: "croissance", label: "FCP Croissance Actions" },
          { value: "serenite", label: "FCP Sérénité Obligations" },
          { value: "peu_importe", label: "N'importe lequel." },
        ],
      },
      {
        prompt: "**Q3 :** Le principal coût quand on délègue à un OPCVM ?",
        answer: "gestion",
        options: [
          { value: "gratuit", label: "Aucun, c'est gratuit." },
          { value: "gestion", label: "Des frais de gestion." },
          { value: "impot", label: "Un impôt de 50 %." },
        ],
      },
      {
        prompt: "**Q4 :** Le FCP Actions affiche **+205 % depuis 2016**. Conclusion ?",
        answer: "pas_garantie",
        options: [
          { value: "garanti", label: "Garanti de refaire +205 %." },
          { value: "pas_garantie", label: "Belle performance passée, mais pas une garantie pour l'avenir." },
        ],
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Conseiller en fonds confirmé ! + 20 000 FCFA sur votre portefeuille !",
      body: "Vous savez lire un OPCVM et le relier à un profil.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Un fonds mal choisi (− 5 000 FCFA par erreur).",
      body: "Reprenons la lecture des 4 fonds.",
    },
    explanations: [
      {
        verdict: "Le prix d'une part",
        title: "La VL",
        body: "**La VL** = le prix d'une part (elle monte quand le panier prend de la valeur).",
      },
      {
        verdict: "Sérénité Obligations",
        title: "La catégorie doit coller au profil",
        body: "Awa prudente → **Sérénité Obligations**. Le FCP Actions (+205 %) est tentant, mais il monte ET descend fort. On ne choisit jamais un fonds sur sa seule performance, mais sur l'adéquation au profil (M05).",
      },
      {
        verdict: "Des frais de gestion",
        title: "Le coût de la délégation",
        body: "**Les frais** rémunèrent les pros qui gèrent à votre place : le compromis de la délégation.",
      },
      {
        verdict: "Passé ≠ futur",
        title: "La performance passée n'est pas une promesse",
        body: "Regardez-la sur la durée comme un indice de sérieux, jamais comme une garantie.",
      },
    ],
  },

  next: {
    label: "Je sais déléguer ! Mais si j'achète moi-même, comment passer un ordre ?",
    target: "Module 22",
  },
};
