import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 20 — Graham (1/4) : le portrait de l'entreprise.
   Premier des 4 modules du bloc Graham (M20-M23) + capstone M24 —
   « le cœur » de la formation. Titre du .txt sans le préfixe « M20 — »
   (déjà porté par `code`), même convention que m15/m16/m17.
   Barème NON standard (§4 : « Graham 1a Portrait | 3 | +20 000 |
   −5 000 ») : ici ça coïncide avec le standard Phase 3, mais reste
   documenté car les 4 modules suivants (M21-M24) ont chacun un
   barème différent — voir leurs commentaires respectifs.
   Emphases *italique* à un seul astérisque du .txt (ex. « *n'achetez
   pas une action, achetez une entreprise.* », les parenthèses
   « (sa performance) » etc., et l'astuce de la Slide 4) : le type
   Block ne supporte que **gras** (splitMarkup, lib/format.ts) —
   astérisques simples retirés, texte conservé tel quel.
   Défi = quiz à 3 questions ; chaque question a sa propre paire/
   triplet de boutons (mécanisme M03/M14/M17/M18).
   L'explication du .txt liste 3 puces dans un ordre différent de
   l'ordre des questions (40 ans+actionnariat, puis 3 pays, puis
   activité compréhensible) : réordonnées ici pour suivre Q1→Q2→Q3
   (3 pays / 40 ans+actionnariat / activité compréhensible), aucune
   phrase perdue ni inventée. Le paragraphe de clôture « Le portrait
   ne remplace pas... » est replié dans le `.note` de la 3ᵉ (dernière)
   explication, même convention que M04/M18/M19 (jamais une 4ᵉ entrée
   synthétique — cf. `feedback.explanations.length === questions.length`).
   ============================================================= */
export const m20: Module = {
  code: "M20",
  index: 20,
  totalModules: 28,
  title: "Graham (1/4) : le portrait de l'entreprise",
  phase: "Phase 4 · L'Analyse",
  status: { emoji: "🥇", label: "L'Analyste Stratège" },
  reward: 20000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 20",
    headline: "Avant les chiffres, qui est cette entreprise ?",
    lead:
      "Vous allez apprendre à analyser comme **Benjamin Graham**, le mentor de Warren Buffett. Sa règle d'or : n'achetez pas une action, achetez une **entreprise** — et tout commence, avant même les comptes, par son **portrait**.",
    card: {
      label: "La carte d'identité de l'analyste",
      title: "Nom, activité, actionnaires, zone, capital",
      hint: "5 éléments à noter avant d'ouvrir les comptes :",
      rules: [
        "**Le nom, la date de création et l'activité** — que vend-elle, en une phrase ?",
        "**Les actionnaires principaux** — qui tient le volant ?",
        "**La zone géographique et le capital** — diversification et taille.",
      ],
    },
    objectives: [
      "Dresser le portrait d'une entreprise avant d'ouvrir ses comptes : activité, actionnaires, ancienneté, zone, capital.",
      "Repérer les signaux de solidité, comme la longévité et un actionnariat de référence rassurant.",
      "Éviter d'investir dans une entreprise dont vous ne pouvez pas résumer le métier en une phrase.",
    ],
    cta: "Dresser le portrait d'une entreprise",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "La méthode Graham",
      blocks: [
        { kind: "lead", value: "Nous allons analyser comme **Benjamin Graham**, le « père de l'investissement dans la valeur » et le mentor de Warren Buffett. Sa règle d'or : n'achetez pas une action, achetez une entreprise." },
        { kind: "text", value: "Avant d'acheter, il pose 3 questions, dans l'ordre :" },
        {
          kind: "list",
          items: [
            "**Est-ce une bonne entreprise ?** (sa performance)",
            "**Va-t-elle le rester ?** (ses perspectives)",
            "**Le prix est-il raisonnable ?** (sa valorisation)",
          ],
        },
        { kind: "text", value: "Mais tout commence par une question plus simple : **qui est cette entreprise ?**" },
      ],
    },
    {
      title: "La carte d'identité avant l'entretien",
      blocks: [
        { kind: "text", value: "On n'embauche personne — et on ne lui confie pas son argent — sans savoir qui il est. Avant les chiffres, dressez le **portrait** de l'entreprise. Les 3 premiers éléments à noter :" },
        {
          kind: "list",
          items: [
            "**Le nom et la date de création** — une entreprise qui existe depuis 40 ans a déjà traversé des crises et prouvé sa solidité ; une toute jeune a moins de recul.",
            "**L'activité** — que vend-elle, concrètement ? Si vous ne pouvez pas résumer son métier en une phrase, méfiance : on ne juge bien que ce qu'on comprend.",
            "**Les actionnaires principaux** — qui tient le volant de l'entreprise ? Un grand groupe solide ou l'État aux commandes rassurent : ce sont eux qui veillent à sa bonne gestion.",
          ],
        },
      ],
    },
    {
      title: "La carte d'identité (suite)",
      blocks: [
        {
          kind: "list",
          items: [
            "**La zone géographique** — opère-t-elle dans un seul pays (tous ses œufs dans le même panier) ou dans plusieurs (activité plus diversifiée) ? Si un pays va mal, les autres peuvent compenser.",
            "**Le capital** — la taille de l'entreprise et le nombre d'actions en circulation. Cela vous dit si vous avez affaire à un géant ou à une petite valeur.",
          ],
        },
      ],
    },
    {
      title: "Où trouver le portrait ?",
      blocks: [
        { kind: "text", value: "Sur la **fiche société de brvm.org**, chaque entreprise cotée a sa page d'identité. L'ouvrir, c'est votre tout premier réflexe d'analyste." },
        {
          kind: "link",
          label: "Ouvrir les fiches sociétés cotées",
          sublabel: "brvm.org · liste des entreprises cotées",
          href: "https://www.brvm.org/fr/emetteurs/societes-cotees",
        },
        { kind: "text", value: "(Astuce : c'est aussi ce qu'un bon outil de suivi devrait vous afficher d'un coup d'œil.)" },
      ],
    },
    {
      title: "Entraînons-nous",
      blocks: [
        { kind: "lead", value: "Entraînons-nous. 👇" },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Lire la carte d'identité",
    instruction: "Voici la fiche d'une entreprise cotée. Observez-la et répondez. (1 erreur = − 5 000 FCFA.)",
    idcard: {
      icon: "🏢",
      title: "AgriBénin SA",
      fields: [
        { label: "Création", value: "1985 (40 ans)" },
        { label: "Activité", value: "Production et exportation d'huile de palme et de coton" },
        { label: "Actionnaires", value: "Groupe Agro-Ouest (55 %), État du Bénin (20 %), public (25 %)" },
        { label: "Zone", value: "Bénin, Togo, Burkina Faso" },
        { label: "Capital", value: "10 milliards FCFA, 2 millions d'actions" },
      ],
    },
    penaltyPerError: 5000,
    perfectReward: 20000,
    // Recopie des options de Q1 en repli neutre (requis par le type) :
    // chaque question a sa propre paire/triplet de boutons.
    options: [
      { value: "1", label: "1" },
      { value: "3", label: "3" },
      { value: "8", label: "8" },
    ],
    questions: [
      {
        prompt: "**Q1 :** Dans combien de pays l'entreprise est-elle présente ?",
        answer: "3",
        options: [
          { value: "1", label: "1" },
          { value: "3", label: "3" },
          { value: "8", label: "8" },
        ],
      },
      {
        prompt: "**Q2 :** Quel élément rassure le plus sur sa **solidité** ?",
        answer: "quarante_ans",
        options: [
          { value: "capital", label: "Son capital divisé en 2 millions d'actions." },
          { value: "quarante_ans", label: "Ses 40 ans d'existence + un grand groupe et l'État comme actionnaires de référence." },
          { value: "export", label: "Le fait qu'elle exporte de l'huile de palme." },
        ],
      },
      {
        prompt: "**Q3 :** Un ami vous conseille une action « qui va exploser », mais il ne sait pas expliquer ce que fait l'entreprise. Le bon réflexe ?",
        answer: "investis_pas",
        options: [
          { value: "achete_quand_meme", label: "J'achète quand même, tant que ça monte." },
          { value: "investis_pas", label: "Je n'investis pas : on n'investit que dans une entreprise dont on comprend le métier." },
        ],
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Portrait maîtrisé ! + 20 000 FCFA sur votre portefeuille !",
      body: "Vous cadrez une entreprise avant même d'ouvrir ses comptes. Le réflexe des pros.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Le portrait mérite un second regard (− 5 000 FCFA par erreur).",
      body: "Reprenons les points clés du portrait.",
    },
    explanations: [
      {
        verdict: "3 pays",
        title: "Présence dans 3 pays",
        body: "**Présence dans 3 pays** = activité un peu diversifiée : si un pays connaît une mauvaise année, les autres compensent.",
      },
      {
        verdict: "40 ans + actionnariat solide",
        title: "Longévité et actionnariat de référence",
        body: "**Longévité (40 ans) + actionnariat de référence solide** = une entreprise installée, au pilotage cadré. Le plus fort signal de stabilité.",
      },
      {
        verdict: "Je n'investis pas",
        title: "Comprendre le métier avant d'investir",
        body: "**Activité compréhensible** : si vous ne comprenez pas comment l'entreprise gagne sa vie, vous ne pourrez jamais juger si elle va bien. **On n'investit jamais à l'aveugle.**",
        note: "Le portrait ne remplace pas l'analyse des chiffres, mais il donne une **vue d'ensemble** et fait déjà remonter des signaux (bons ou mauvais).",
      },
    ],
  },

  next: {
    label: "Je sais QUI est l'entreprise. Gagne-t-elle vraiment de l'argent ?",
    target: "Module 21",
  },
};
