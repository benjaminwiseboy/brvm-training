import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 09 — Plan d'investissement.
   Inspiré du script audio EDB fourni par le user (BRVM Learning/EDB
   Plan d'investissement.txt) : métaphore de la construction sans
   plan, 2 objectifs (revenu/capital), rôle protecteur de l'horizon,
   repère de budget (25-30k FCFA/objectif). Reformulé intégralement
   (pas de copie), et l'exemple d'horizon est fictif (cf. plan —
   l'anecdote réelle du script vient d'une transcription audio avec
   des chiffres de marché non vérifiables).
   ============================================================= */
export const m09: Module = {
  code: "M09",
  index: 9,
  totalModules: 28,
  title: "Votre plan d'investissement",
  phase: "Phase 2 · La Boussole",
  status: { emoji: "🥈", label: "L'Investisseur Curieux" },

  hero: {
    eyebrow: "Formation BRVM · Module 09",
    headline: "Votre boussole personnelle.",
    lead:
      "Investir sans plan, c'est comme construire une maison sans architecte : un peu de ciment ici, une brique là — et au final, rien de solide. Le plan d'investissement réunit 5 éléments déjà vus dans cette formation, pour choisir chaque opportunité en connaissance de cause.",
    card: {
      label: "5 éléments à réunir",
      title: "Votre plan d'investissement",
      hint: "Un vrai plan répond à 5 questions :",
      rules: [
        "**L'objectif** — pourquoi investissez-vous : un revenu, ou un capital ?",
        "**L'horizon** — pour quand aurez-vous besoin de cet argent ?",
        "**La stratégie** — rente, croissance ou trade (modules 6 à 8) ?",
        "**Le profil** — quelle est votre tolérance au risque (module 5) ?",
        "**La capacité d'épargne** — combien pouvez-vous investir, régulièrement ?",
      ],
    },
    objectives: [
      "Comprendre pourquoi un plan d'investissement écrit change tout.",
      "Identifier les 5 éléments qui composent un plan complet.",
      "Savoir pourquoi l'horizon de placement protège des paniques de marché.",
    ],
    cta: "Construire mon plan",
  },

  slides: [
    {
      title: "Investir sans plan, c'est construire sans architecte",
      blocks: [
        { kind: "lead", value: "Imaginez quelqu'un qui construit une maison sans plan : un peu de ciment aujourd'hui, une brique demain, ici puis là. Au final, il n'aura rien de solide." },
        { kind: "text", value: "Investir en bourse au hasard — un peu de ceci, un peu de cela, selon les conseils du moment — mène exactement au même résultat : un portefeuille sans cohérence, difficile à évaluer, qui ne sert aucun objectif précis." },
        { kind: "text", value: "Le **plan d'investissement** est votre architecte : il réunit 5 éléments qui, ensemble, vous permettent de choisir chaque opportunité en connaissance de cause." },
      ],
    },
    {
      title: "1er élément : votre objectif",
      blocks: [
        { kind: "text", value: "Pourquoi investissez-vous ? On peut résumer à 2 grandes familles d'objectifs :" },
        {
          kind: "duo",
          items: [
            { side: "Un revenu", value: "vous cherchez du cash régulier → c'est la stratégie de **rente** (module 6)." },
            { side: "Un capital", value: "vous cherchez à faire grossir une somme pour un projet → c'est la stratégie de **croissance** (module 7)." },
          ],
        },
        { kind: "callout", tone: "info", value: "Vous pouvez poursuivre les deux objectifs à la fois — ce n'est pas incompatible. Mais idéalement, séparez-les en **2 portefeuilles distincts**, pour mesurer clairement si chacun atteint son but." },
      ],
    },
    {
      title: "2ᵉ élément : votre horizon",
      blocks: [
        { kind: "text", value: "Votre **horizon de placement**, c'est la durée pendant laquelle votre capital reste engagé avant que vous n'en ayez besoin. Il compte double : il détermine ce que vous pouvez raisonnablement acheter, ET il vous donne — ou non — la marge pour patienter en cas de coup dur." },
        { kind: "callout", tone: "highlight", value: "**Exemple :** Aïcha a ouvert un portefeuille d'actions bancaires pour financer les études de sa fille, dans 8 ans. Un choc sur le secteur bancaire fait chuter son action de 25 % en quelques mois. Comme elle n'aura besoin de cet argent que dans 8 ans, elle n'est pas obligée de vendre dans la panique : elle patiente. Quelques mois plus tard, l'action a retrouvé son niveau — et continue de progresser." },
        { kind: "text", value: "Avec un horizon **court** (si Aïcha avait eu besoin de cet argent dans 18 mois), la même baisse l'aurait forcée à vendre à perte, faute de temps pour attendre le rebond." },
      ],
    },
    {
      title: "3ᵉ et 4ᵉ éléments : votre stratégie et votre profil",
      blocks: [
        { kind: "text", value: "Ces deux éléments, vous les connaissez déjà :" },
        {
          kind: "list",
          items: [
            "**Votre stratégie** — rente, croissance ou trade (modules 6, 7 et 8) : le COMMENT vous poursuivez votre objectif.",
            "**Votre profil de risque** — mesuré au module 5 : ce qu'il détermine, c'est votre capacité à ENCAISSER les fluctuations sans paniquer.",
          ],
        },
        { kind: "text", value: "Votre stratégie doit servir votre objectif ; votre profil doit dicter le dosage risque/sécurité de votre portefeuille." },
      ],
    },
    {
      title: "5ᵉ élément : votre capacité d'épargne",
      blocks: [
        { kind: "text", value: "Votre **budget** détermine combien de lignes (d'entreprises différentes) vous pouvez raisonnablement détenir en direct — donc combien vous pouvez diversifier." },
        { kind: "callout", tone: "warn", value: "Avec 15 000 ou 20 000 FCFA, difficile de diversifier correctement en actions en direct : 1 ou 2 lignes ne protègent de rien. Repère pratique : comptez **au moins 25 000 à 30 000 FCFA** par objectif poursuivi en direct." },
        { kind: "text", value: "En dessous de ce seuil, ou pour déléguer la diversification, l'**OPCVM** (module 4) reste la solution la plus adaptée : un seul versement, déjà réparti sur des dizaines de titres." },
      ],
    },
    {
      title: "Votre plan, en une phrase",
      blocks: [
        { kind: "lead", value: "Un plan d'investissement complet répond à 5 questions : pourquoi (objectif), pour quand (horizon), comment (stratégie), avec quel dosage de risque (profil), et avec combien (capacité d'épargne)." },
        { kind: "text", value: "À vous de construire le vôtre. 👇" },
      ],
    },
  ],

  challenge: {
    type: "planner",
    kicker: "Le Défi",
    title: "Construisez votre plan",
    instruction:
      "Répondez pour chacun des 5 piliers — il n'y a pas de bonne ou de mauvaise réponse, juste VOTRE plan. À la fin, vous obtiendrez le récap de votre plan d'investissement personnel.",
    questions: [
      {
        icon: "🎯",
        pillarLabel: "Votre objectif",
        prompt: "Pourquoi investissez-vous avant tout ?",
        options: [
          { label: "Toucher un revenu régulier" },
          { label: "Faire grossir un capital pour un projet précis" },
          { label: "Saisir des opportunités de marché à court terme" },
        ],
      },
      {
        icon: "⏳",
        pillarLabel: "Votre horizon",
        prompt: "Dans combien de temps aurez-vous besoin de cet argent ?",
        options: [
          { label: "Moins de 3 ans" },
          { label: "Entre 3 et 8 ans" },
          { label: "Plus de 8 ans" },
        ],
      },
      {
        icon: "🧭",
        pillarLabel: "Votre stratégie",
        prompt: "Quelle stratégie vous correspond le mieux ?",
        options: [
          { label: "La rente (module 6)" },
          { label: "La croissance (module 7)" },
          { label: "Le trade (module 8)" },
          { label: "Un mélange de plusieurs stratégies" },
        ],
      },
      {
        icon: "⚖️",
        pillarLabel: "Votre profil",
        prompt: "Comment réagiriez-vous si votre portefeuille baissait de 25 % ?",
        options: [
          { label: "Je préfère éviter ce genre de baisse : je reste prudent(e)" },
          { label: "Je m'inquiète un peu, mais je patiente" },
          { label: "Je garde mon calme, voire j'en profite" },
        ],
      },
      {
        icon: "💰",
        pillarLabel: "Votre capacité d'épargne",
        prompt: "Combien pouvez-vous investir chaque mois, régulièrement ?",
        options: [
          { label: "Moins de 25 000 FCFA" },
          { label: "Entre 25 000 et 100 000 FCFA" },
          { label: "Plus de 100 000 FCFA" },
        ],
      },
    ],
  },

  // Feedback vide à dessein, comme M05 (diagnostic) : la branche `plan` de
  // Bilan.tsx construit le récap directement à partir des réponses choisies,
  // sans jamais lire `feedback`.
  feedback: {},

  next: {
    label: "Mon plan est posé ! Reste la régularité pour le faire vivre.",
    target: "Module 10",
  },
};
