import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 08 — La stratégie de trade (nouveau module,
   revue de juillet 2026). 3ᵉ stratégie, à côté de la rente (M06) et
   de la croissance (M07) : opportunités de marché à court terme,
   très risqué, jamais garanti, demande d'être très informé — mais
   un potentiel de rentabilité élevé. Framing volontairement prudent
   (cf. garde-fous d'honnêteté du risque déjà appliqués partout
   ailleurs dans la formation) : aucun chiffre de performance n'est
   avancé comme un exemple à suivre.
   ============================================================= */
export const m08: Module = {
  code: "M08",
  index: 8,
  totalModules: 28,
  title: "La stratégie de trade",
  phase: "Phase 2 · La Boussole",
  status: { emoji: "🥈", label: "L'Investisseur Curieux" },
  reward: 20000,

  hero: {
    eyebrow: "Formation BRVM · Module 08",
    headline: "La 3ᵉ voie : réservée aux initiés.",
    lead:
      "Rente et croissance se jouent sur des années. Il existe une 3ᵉ stratégie, bien plus rapide et bien plus risquée : le trade. Avant de vous laisser tenter, voyons honnêtement ce qu'elle exige — et ce qu'elle peut coûter.",
    card: {
      label: "Une 3ᵉ stratégie, à part",
      title: "Le trading à court terme",
      hint: "4 choses à savoir avant d'y songer :",
      rules: [
        "**Le principe** — acheter et revendre vite, sur de courtes opportunités de marché.",
        "**Très risqué** — les pertes peuvent être aussi rapides que les gains.",
        "**Rien n'est garanti** — aucune martingale, aucune formule magique.",
        "**Exige d'être très informé** — suivi quasi quotidien du marché, pas compatible avec « investir et oublier ».",
      ],
    },
    objectives: [
      "Comprendre en quoi le trade diffère de la rente et de la croissance.",
      "Identifier pourquoi cette stratégie est réservée à des investisseurs avertis.",
      "Savoir reconnaître une situation où le trade est (ou n'est pas) adapté.",
    ],
    cta: "Découvrir la 3ᵉ stratégie",
  },

  slides: [
    {
      title: "Rente, croissance… et le trade ?",
      blocks: [
        { kind: "text", value: "Vous connaissez deux stratégies : la **rente** (des revenus réguliers, M06) et la **croissance** (faire grossir un capital sur plusieurs années, M07). Il en existe une 3ᵉ, à l'esprit très différent : le **trade**." },
        {
          kind: "duo",
          items: [
            { side: "Rente & croissance", value: "on **achète et on garde**, parfois pendant des années, en laissant le temps travailler." },
            { side: "Le trade", value: "on **achète et on revend vite** (jours, semaines, parfois quelques mois), en cherchant à profiter d'un mouvement de prix précis." },
          ],
        },
      ],
    },
    {
      title: "Le trade, concrètement",
      blocks: [
        { kind: "text", value: "Un trader ne cherche pas à devenir copropriétaire d'une entreprise sur le long terme : il cherche des **opportunités de marché** — une action qu'il juge sous-évaluée à court terme, une actualité qui devrait faire bouger un cours, un mouvement technique qu'il pense pouvoir anticiper." },
        { kind: "text", value: "Il achète, puis revend dès que l'opportunité s'est réalisée (ou qu'elle a échoué, pour limiter la perte)." },
      ],
    },
    {
      title: "Pourquoi c'est risqué",
      blocks: [
        { kind: "text", value: "Le rentier et le bâtisseur de capital ont le temps pour eux : une baisse passagère ne les inquiète pas. Le trader, lui, n'a **pas ce filet** : son pari doit se réaliser dans une fenêtre courte." },
        {
          kind: "list",
          items: [
            "**Personne ne devine le marché à coup sûr** — pas même les professionnels, en permanence.",
            "**Le coupe-circuit (± 7,5 %/séance, vu au module 1) ne protège que d'une chute brutale en une journée** — rien n'empêche un enchaînement de séances défavorables.",
            "**La discipline émotionnelle est aussi importante que l'analyse** — paniquer ou s'entêter coûte souvent plus cher que l'erreur de départ.",
          ],
        },
      ],
    },
    {
      title: "Le potentiel (et son revers)",
      blocks: [
        { kind: "callout", tone: "warn", value: "⚠️ Le trade peut offrir un **potentiel de rentabilité élevé** sur une opportunité bien identifiée — mais le même mécanisme qui fait gagner vite peut faire **perdre vite**. Contrairement à la rente ou à la croissance, il n'y a pas de « temps » pour rattraper une erreur de timing." },
        { kind: "text", value: "C'est un jeu à somme où l'information et la préparation font la différence : sans un vrai travail de suivi du marché, le trade se transforme vite en pari." },
      ],
    },
    {
      title: "Qui devrait s'y risquer ?",
      blocks: [
        { kind: "lead", value: "Le trade n'est pas une stratégie de débutant." },
        {
          kind: "list",
          items: [
            "Seulement une fois les **fondations maîtrisées** (Phases 1 et 2 de cette formation).",
            "Seulement avec de l'**argent que vous pouvez perdre entièrement**, jamais votre fonds d'urgence ni votre épargne de rente/croissance (rappel des 3 règles d'or, module 2).",
            "Seulement si vous êtes prêt(e) à **suivre le marché régulièrement** — pas un investissement « et on oublie ».",
          ],
        },
        { kind: "text", value: "Voyons si les bons réflexes sont déjà là. 👇" },
      ],
    },
  ],

  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Trade ou pas trade ?",
    instruction: "Pour chaque situation, dites si le trade est une réponse adaptée. (1 erreur = − 5 000 FCFA.)",
    penaltyPerError: 5000,
    perfectReward: 20000,
    options: [
      { value: "oui", label: "Adapté" },
      { value: "non", label: "Pas adapté" },
    ],
    questions: [
      { prompt: "**Kader** débute tout juste en bourse. Il a lu 2 articles et veut « essayer » le trade avec son fonds d'urgence.", answer: "non" },
      { prompt: "**Aïcha** investit depuis 3 ans (rente + croissance), a un fonds d'urgence solide, et veut consacrer une petite somme — qu'elle peut perdre sans conséquence — à suivre une opportunité de marché qu'elle a étudiée en détail.", answer: "oui" },
      { prompt: "**Boubacar** pense qu'il peut deviner, à coup sûr, la direction du marché la semaine prochaine.", answer: "non" },
      { prompt: "**Nadège** est prête à consulter le marché quasi quotidiennement pendant plusieurs semaines pour suivre une position de trade.", answer: "oui" },
    ],
  },

  feedback: {
    perfect: {
      icon: "🎉",
      title: "Bons réflexes ! + 20 000 FCFA sur votre portefeuille !",
      body: "Vous savez déjà reconnaître quand le trade est une option raisonnable — et quand c'est un pari déguisé.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Le trade ne pardonne pas l'approximation (− 5 000 FCFA par erreur).",
      body: "Reprenons chaque situation.",
    },
    explanations: [
      {
        verdict: "Pas adapté",
        title: "Kader",
        body: "Débuter par le trade, avec le fonds d'urgence en plus, cumule les 2 pires erreurs : aucune expérience, et de l'argent qu'on n'a pas le droit de perdre (règle d'or n°1, module 2).",
      },
      {
        verdict: "Adapté",
        title: "Aïcha",
        body: "Elle coche les cases : fondations déjà solides, argent dédié qu'elle peut perdre sans conséquence, opportunité étudiée. Le trade reste risqué pour elle aussi — mais dans un cadre responsable.",
      },
      {
        verdict: "Pas adapté",
        title: "Boubacar",
        body: "Personne ne devine le marché « à coup sûr » — pas même les professionnels. Croire l'inverse est le meilleur moyen de perdre gros.",
      },
      {
        verdict: "Adapté",
        title: "Nadège",
        body: "Le trade demande un suivi quasi quotidien : sans ce temps disponible, mieux vaut s'en tenir à la rente ou à la croissance, qui ne l'exigent pas.",
      },
    ],
  },

  next: {
    label: "3 stratégies en poche ! Reste à les assembler dans un vrai plan.",
    target: "Module 09",
  },
};
