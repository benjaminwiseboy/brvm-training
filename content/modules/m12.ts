import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 12 — Les OPCVM en pratique (déléguer
   intelligemment). Phase 3 « Passage à l'action ».
   Barème standard Phase 4 (Bareme harmonise.txt §4 : « Phase 4 —
   Action | +20 000 | −5 000 ») : perfectReward 20000 /
   penaltyPerError 5000 / reward 20000 — confirmé par le propre
   texte du .txt (« + 20 000 FCFA » / « − 5 000 FCFA »).
   Défi à 4 questions : contrairement à M21/M22 (restructuration
   nécessaire), ici le mapping est 1:1 — le .txt liste ses 4
   réponses attendues dans le même ordre (Q1 VL, Q2 catégorie/profil,
   Q3 frais, Q4 performance passée) ET son explication détaillée a
   exactement 4 puces dans le même ordre. Aucune fusion ni
   éclatement nécessaire : `feedback.explanations.length` = 4 =
   `challenge.questions.length`.
   Chaque question a son propre jeu de boutons (options par
   question) car les libellés diffèrent d'une question à l'autre ;
   les options du niveau `challenge` reprennent celles de Q1 en
   repli neutre (requis par le type QuizChallenge), comme M21/M24.
   ============================================================= */
export const m12: Module = {
  code: "M12",
  index: 12,
  totalModules: 28,
  title: "Les OPCVM en pratique (déléguer intelligemment)",
  phase: "Phase 3 · Passage à l'action",
  status: { emoji: "🥇", label: "L'Analyste Stratège" },
  reward: 20000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 12",
    headline: "Le pilote automatique de la bourse.",
    lead:
      "Pas le temps ou l'envie de choisir vos actions une par une ? L'**OPCVM** fait le travail à votre place : un panier de titres géré par des professionnels, dans lequel vous achetez simplement une **part**. Diversification et suivi inclus — moyennant des frais, et un vrai abandon de contrôle.",
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
    objectives: [
      "Lire une fiche OPCVM (Valeur Liquidative, catégorie, frais) et savoir ce qu'elle indique vraiment.",
      "Choisir la catégorie de fonds (Actions, Obligations, Diversifié, Monétaire) adaptée à votre profil de risque.",
      "Comprendre ce que vous déléguez, et ce que vous perdez en contrôle, en investissant via un OPCVM.",
    ],
    cta: "Découvrir les OPCVM",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Imaginez un grand mariage…",
      blocks: [
        { kind: "lead", value: "Pour un mariage ou un baptême, plusieurs familles cotisent dans une caisse commune. Personne ne cuisine dans son coin : un traiteur pro achète les bons ingrédients et prépare un menu équilibré pour tout le monde." },
        { kind: "text", value: "C'est exactement le principe de l'**OPCVM** (Organisme de Placement Collectif en Valeurs Mobilières). Au lieu de choisir vous-même chaque action ou obligation, vous versez votre argent dans une caisse commune, avec d'autres épargnants." },
        {
          kind: "duo",
          items: [
            { side: "Vous", value: "vous versez votre argent — votre contribution à la caisse commune." },
            { side: "Le gérant (la SGO)", value: "un professionnel qui achète et surveille un panier de titres pour tout le monde, contre rémunération." },
          ],
        },
        { kind: "text", value: "En échange, vous recevez des **parts** : votre ticket, qui prouve votre bout du festin, proportionnellement à ce que vous avez versé." },
      ],
    },
    {
      title: "Les 3 façons d'investir en bourse",
      blocks: [
        {
          kind: "list",
          items: [
            "**Gestion libre** — vous choisissez vous-même chaque action (ce qu'on apprendra à faire un peu plus loin dans la formation).",
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
        { kind: "text", value: "Chaque fonds est classé par catégorie, ce qui indique son niveau de risque. À vous de choisir selon votre profil (Module 5) :" },
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
        { kind: "text", value: "Trois frais à connaître, plus simples que la gestion directe (transactions + droits de garde) :" },
        {
          kind: "list",
          items: [
            "**Les frais d'entrée** — à la souscription, souvent autour de 1 %.",
            "**Les frais de sortie** — au rachat de vos parts.",
            "**Les frais de gestion** — prélevés en continu, à l'intérieur du fonds : rien à payer à part, déjà reflétés dans la VL.",
          ],
        },
      ],
    },
    {
      title: "Quel ordre de grandeur, sur un an ?",
      blocks: [
        { kind: "lead", value: "Une question légitime avant de déléguer votre argent : à quoi peut-on s'attendre, grosso modo, en un an ?" },
        {
          kind: "list",
          items: [
            "**Monétaire (M)** — très stable, proche d'un bon compte épargne : souvent **2 % à 4 % par an**.",
            "**Obligations (OMLT/OCT)** — plus régulier : souvent **4 % à 8 % par an**.",
            "**Diversifié (D)** — un compromis entre les deux précédents, avec plus de variations.",
            "**Actions (A)** — le plus volatil : certaines années **+15 %, +30 %** ou plus, d'autres années en baisse.",
          ],
        },
        { kind: "callout", tone: "warn", value: "⚠️ Ce sont des **ordres de grandeur typiques**, pas une promesse — et pas les chiffres d'un fonds précis. Chaque fonds publie sa propre performance passée sur sa fiche : à vérifier avant de choisir." },
      ],
    },
    {
      title: "⚠️ La contrepartie : vous déléguez le contrôle",
      blocks: [
        { kind: "text", value: "Vous ne décidez pas des choix du fonds. Un gérant peut se tromper : un fonds **peut sous-performer, voire mal tourner** (ça s'est déjà vu à la BRVM, avec des fonds en difficulté pour rembourser leurs porteurs)." },
        { kind: "text", value: "L'OPCVM n'est donc **pas** sans risque — regardez le sérieux et l'historique du gérant, et diversifiez." },
      ],
    },
    {
      title: "Ouvrir un compte, trouver les bons fonds",
      blocks: [
        { kind: "text", value: "Concrètement, comment souscrire à un OPCVM ?" },
        {
          kind: "list",
          items: [
            "**Repérez les fonds disponibles** — la BRVM publie la liste des fonds et leurs valeurs liquidatives.",
            "**Comparez** catégorie, frais et VL sur la durée avant de choisir.",
            "**Contactez** la SGO qui gère le fonds choisi, ou tout simplement votre SGI (celle où vous avez ouvert votre compte titres) — elle commercialise souvent plusieurs OPCVM.",
            "**Remplissez un bulletin de souscription**, avec vos pièces d'identité, et versez le montant.",
            "**Recevez vos parts** : elles apparaissent dans votre portefeuille, et leur valeur suit la VL du fonds.",
          ],
        },
        { kind: "link", label: "Voir les valeurs liquidatives des fonds OPCVM", sublabel: "brvm.org · liste des fonds et de leurs gestionnaires", href: "https://www.brvm.org/fr/valeurs-liquidative" },
        { kind: "text", value: "Prêt à mettre tout ça en pratique ? 👇" },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Choisir le bon fonds",
    instruction: "Voici 4 fonds accessibles à l'achat. Observez-les et répondez. (1 erreur = − 5 000 FCFA.)",
    table: {
      caption: "4 fonds disponibles (données fictives)",
      columns: ["Fonds", "Catégorie", "VL", "Performance"],
      rows: [
        ["FCP Croissance Actions", "A (Actions)", "15 300 FCFA", "+205 % depuis 2016"],
        ["FCP Sérénité Obligations", "OMLT", "13 200 FCFA", "+38 % depuis 2018"],
        ["FCP Diversifié Équilibre", "D (Diversifié)", "24 000 FCFA", "+140 % depuis 2017"],
        ["FCP Trésorerie", "M (Monétaire)", "10 700 FCFA", "+7 %"],
      ],
    },
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
        body: "Awa prudente → **Sérénité Obligations**. Le FCP Actions (+205 %) est tentant, mais il monte ET descend fort. On ne choisit jamais un fonds sur sa seule performance, mais sur l'adéquation au profil (Module 5).",
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
    target: "Module 13",
  },
};
