import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 07 — L'investissement de croissance.
   Défi = quiz à 4 questions ; chaque question a SA PROPRE paire
   d'options (rente/croissance, dividende/hasard, oui/non-trop-
   court, oui/non-jamais-garanti) — même logique d'override
   `options` par question que M06/M03. Le champ `options` du
   challenge, requis par le type, recopie la paire de Q1 en repli
   neutre. Exemples historiques (SGBCI, PALMCI, Nestlé CI)
   transcrits tels quels depuis le .txt — aucun chiffre inventé
   ou arrondi différemment.
   Comme M06, ce module n'est PAS dans la table du barème
   harmonisé (§4) : récompense/pénalité viennent du .txt lui-même
   (Section 3 : + 20 000 / − 5 000).
   ============================================================= */
export const m07: Module = {
  code: "M07",
  index: 7,
  totalModules: 26,
  title: "L'investissement de croissance",
  phase: "Phase 2 · La Boussole",
  status: { emoji: "🥈", label: "L'Investisseur Curieux" },
  reward: 20000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 07",
    headline: "Faites grossir un capital, pas juste un revenu.",
    lead:
      "La croissance est le miroir de la rente : elle ne cherche pas un revenu régulier, mais à faire grossir un capital pour financer un grand projet — maison, études, business.",
    card: {
      label: "5 moteurs de la hausse",
      title: "Ce qui fait monter un cours",
      hint: "Un cours de bourse grimpe pour 5 raisons :",
      rules: [
        "**La performance** — l'entreprise gagne de plus en plus d'argent.",
        "**Les perspectives** — le marché parie sur l'avenir.",
        "**La politique de dividende** — un dividende généreux attire la foule.",
        "**La valorisation** — le prix rattrape sa juste valeur.",
        "**La psychologie du marché** — l'engouement collectif peut tout emballer.",
      ],
    },
    cta: "Découvrir les moteurs de la croissance",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Du capital pour financer vos projets",
      blocks: [
        { kind: "text", value: "La deuxième grande stratégie, c'est la **croissance**. Elle est le miroir exact de la rente :" },
        {
          kind: "duo",
          items: [
            { side: "La rente", value: "cherche des **revenus** réguliers pour couvrir des **dépenses** courantes." },
            {
              side: "La croissance",
              value: "cherche à faire grossir un **capital** pour financer un gros **projet** (une maison, un business…).",
            },
          ],
        },
        {
          kind: "text",
          value: "Ici, on ne vise pas le cash qui tombe chaque année, mais l'**augmentation de la valeur** de ce que l'on possède.",
        },
      ],
    },
    {
      title: "L'argent qui dort ne grossit pas",
      blocks: [
        {
          kind: "text",
          value:
            "Un billet rangé dans un tiroir vaudra toujours le même montant — et même un peu moins avec le temps, à cause de l'inflation.",
        },
        {
          kind: "text",
          value:
            "Placé sur un actif qui **prend de la valeur**, il fructifie. Pensez à un **terrain** : acheté aujourd'hui, il peut valoir bien plus dans quelques années.",
        },
        {
          kind: "text",
          value:
            "En bourse, c'est pareil : certaines actions montent avec le temps. La différence entre le prix d'achat et le prix de revente, c'est la **plus-value** (vue au M03). On achète ces actions dans le but de les revendre plus tard, plus cher.",
        },
      ],
    },
    {
      title: "Pourquoi un cours monte (1/2) : l'entreprise elle-même",
      blocks: [
        { kind: "text", value: "Un cours de bourse ne monte pas par hasard. Deux premières raisons tiennent à l'entreprise :" },
        {
          kind: "list",
          items: [
            "**La performance** — quand une entreprise gagne de plus en plus d'argent, elle vaut réellement plus cher, et les investisseurs se l'arrachent : son cours monte. Exemple historique : SGBCI, dont le bénéfice est passé de ~6 à ~36 milliards (2005-2016) ; dans le même temps, son cours a bondi de ~13 000 à ~160 000 FCFA.",
            "**Les perspectives** — le marché ne regarde pas que le présent, il **parie sur l'avenir**. Dès qu'une bonne nouvelle se profile, les acheteurs se positionnent avant même les chiffres officiels, et le cours grimpe par anticipation. Exemple : PALMCI, dont le cours a monté avant même l'annonce de bons résultats sur l'huile de palme.",
          ],
        },
      ],
    },
    {
      title: "Pourquoi un cours monte (2/2) : le prix et la foule",
      blocks: [
        {
          kind: "list",
          items: [
            "**La politique de dividende** — un dividende inattendu et élevé attire une foule d'acheteurs qui veulent en profiter ; cette demande soudaine fait grimper le cours. Exemple : Nestlé CI, en 2021, a versé ~360 F de dividende sur une action à ~720 F — un rendement de 50 % ! — et le cours a bondi de ~720 à ~3 600.",
            "**La valorisation** — si une action était injustement **bon marché** (ses ratios PER/PBR étaient bas), le marché finit souvent par corriger, et le prix remonte vers sa juste valeur.",
            "**La psychologie du marché** — l'engouement collectif (confiance, effet de mode) peut pousser un cours à la hausse, parfois même au-delà du raisonnable.",
          ],
        },
        { kind: "text", value: "(Exemples donnés à titre historique — le passé ne préjuge pas du futur.)" },
      ],
    },
    {
      title: "À quoi sert la croissance ? À financer un projet",
      blocks: [
        {
          kind: "text",
          value:
            "Contrairement à la rente (qui paie des dépenses courantes), la croissance sert à **réunir une grosse somme** pour un objectif précis :",
        },
        {
          kind: "list",
          items: [
            "les **études supérieures** d'un enfant,",
            "un projet **immobilier** — au lieu d'épargner pendant des années pour construire votre terrain, vous investissez pour y arriver plus vite,",
            "lancer un **business**, ou financer un grand **voyage**.",
          ],
        },
      ],
    },
    {
      title: "La puissance de la croissance (et sa limite)",
      blocks: [
        {
          kind: "text",
          value:
            "Un exemple parlant : épargner 100 000 FCFA/mois pendant 5 ans, cela fait environ **4,8 millions**. Bien placé en stratégie de croissance, ce même effort d'épargne peut fructifier **bien au-delà**.",
        },
        {
          kind: "callout",
          tone: "warn",
          value:
            "⚠️ Mais restons lucides : viser une forte croissance est un objectif **ambitieux et jamais garanti**, et il demande du **temps** — comptez un horizon de **5 à 10 ans**. Sur moins de 3 ans, c'est trop risqué. 👇",
        },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "L'œil du bâtisseur de capital",
    instruction: "Répondez aux 4 questions. (1 erreur = − 5 000 FCFA.)",
    penaltyPerError: 5000,
    perfectReward: 20000,
    options: [
      { value: "rente", label: "La rente (revenu régulier)" },
      { value: "croissance", label: "La croissance (faire grossir un capital pour un projet)" },
    ],
    questions: [
      {
        prompt: "Vous voulez constituer le **capital** pour construire votre maison dans **8 ans**. Quelle stratégie ?",
        answer: "croissance",
        options: [
          { value: "rente", label: "La rente (revenu régulier)" },
          { value: "croissance", label: "La croissance (faire grossir un capital pour un projet)" },
        ],
      },
      {
        prompt: "L'action Nestlé CI passe de ~720 à ~3 600 après un gros dividende. Quel **moteur** a joué ?",
        answer: "dividende",
        options: [
          { value: "dividende", label: "La politique de dividende, qui a attiré les acheteurs." },
          { value: "hasard", label: "Le hasard, sans raison." },
        ],
      },
      {
        prompt: "Vous aurez besoin du capital **dans 18 mois**. La croissance en bourse est-elle adaptée ?",
        answer: "non",
        options: [
          { value: "oui", label: "Oui, à tout horizon." },
          { value: "non", label: "Non : 18 mois c'est trop court, la croissance a besoin de temps." },
        ],
      },
      {
        prompt: "Un objectif de « +25 %/an » est-il garanti ?",
        answer: "non",
        options: [
          { value: "oui", label: "Oui, chaque année." },
          { value: "non", label: "Non : c'est ambitieux et jamais garanti." },
        ],
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Bâtisseur de capital ! + 20 000 FCFA sur votre portefeuille !",
      body: "Vous distinguez une stratégie de revenus d'une stratégie de capital, et vous savez ce qui fait monter un cours.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Le chantier a pris du retard (− 5 000 FCFA par erreur).",
      body: "Reprenons la logique de la croissance.",
    },
    explanations: [
      {
        verdict: "Croissance",
        title: "Q1 → la croissance",
        body:
          "Un **projet** (une maison) demande de réunir un **capital** → stratégie de croissance. Une dépense qui revient chaque mois demande un **revenu** → stratégie de rente. C'est votre objectif qui décide, pas l'action elle-même.",
      },
      {
        verdict: "Le dividende",
        title: "Q2 → le dividende",
        body:
          "Un dividende exceptionnel peut, à lui seul, faire s'envoler un cours en attirant une foule d'acheteurs. Retenez qu'un cours monte pour 5 raisons — performance, perspectives, dividende, valorisation, psychologie — et que le marché **anticipe** souvent l'avenir avant les chiffres.",
      },
      {
        verdict: "Non, trop court",
        title: "Q3 → non, trop court",
        body:
          "La croissance a besoin de temps pour se déployer. Pour un besoin à moins de 3 ans, on ne mise pas en bourse (rappel des règles de sécurité, M02).",
      },
      {
        verdict: "Non, jamais garanti",
        title: "Q4 → non, jamais garanti",
        body:
          "De belles performances existent à la BRVM, mais aucune n'est promise d'avance. Fixez-vous un objectif **ambitieux mais réaliste**, et laissez le temps et la régularité (le DCA, juste après) faire le travail.",
      },
    ],
  },

  next: {
    label: "J'ai choisi ma stratégie ! Voyons le super-pouvoir qui la décuple : la régularité.",
    target: "Module 08",
  },
};
