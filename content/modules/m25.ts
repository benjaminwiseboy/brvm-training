import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 25 — Garder ce qu'on gagne (la fiscalité).
   Ouverture de la Phase 5 « Suivi & maîtrise ».
   Barème standard Phase 5 (Bareme harmonise.txt §4 : « 10.
   Fiscalité | Phase 5 | +15 000 | −5 000 ») : perfectReward 15000 /
   penaltyPerError 5000 / reward 15000 — confirmé par le propre
   texte du .txt (« + 15 000 FCFA » / « − 5 000 FCFA par erreur »).
   Slide 2 (taux IRVM par pays) rendue en `list` plutôt qu'en
   `countries` : le bloc `countries` (BlockRenderer) affiche ses
   items en texte brut SANS passer par renderMarkup — le gras des
   taux (« ~12 % », etc.) y serait donc perdu. `list` préserve le
   gras et convient mieux à une énumération pays→taux qu'à une
   simple liste de noms de pays (usage réservé à `countries`, ex.
   M01).
   Défi = vrai/faux à 2 affirmations : `challenge.questions` a donc
   2 entrées, et `feedback.explanations` AUSSI 2 entrées (règle
   stricte de correspondance). Le rappel de prudence final (« La
   fiscalité évolue ») est replié dans le `.note` de la 2ᵉ (dernière)
   explication, comme M04/M21 — PAS une 3ᵉ entrée synthétique.
   Italiques simples (*…*) du .txt non supportées par renderMarkup
   (lib/format.ts ne segmente que le `**gras**`) : converties en
   texte normal ou en gras selon l'emphase voulue, jamais laissées
   telles quelles.
   ============================================================= */
export const m25: Module = {
  code: "M25",
  index: 25,
  totalModules: 28,
  title: "Garder ce qu'on gagne (la fiscalité)",
  phase: "Phase 5 · Suivi & maîtrise",
  status: { emoji: "🎓", label: "L'Analyste Confirmé" },
  reward: 15000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 25",
    headline: "Garder ce qu'on gagne : la fiscalité.",
    lead:
      "Vos actions ont versé des dividendes et pris de la valeur — combien en garderez-vous vraiment ? Bonne nouvelle : l'UEMOA a mis en place, pour les particuliers, une fiscalité **très avantageuse**, avec une plus-value boursière le plus souvent **totalement exonérée d'impôt**.",
    card: {
      label: "La fiscalité en un coup d'œil",
      title: "IRVM, plus-value, IRC",
      hint: "3 impôts à connaître, du plus fréquent au plus rare :",
      rules: [
        "**L'IRVM (dividendes)** — prélevé à la source, déjà payé quand l'argent arrive : ~12 % en Côte d'Ivoire, 12,5 % au Burkina, 7 % au Niger, 4 % au Bénin.",
        "**La plus-value** — pour les particuliers, généralement totalement exonérée dans la zone UEMOA.",
        "**L'IRC (obligations)** — souvent pris en charge par l'État pour les nationaux/résidents.",
      ],
    },
    cta: "Découvrir ma fiscalité",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "L'État et votre portefeuille",
      blocks: [
        { kind: "text", value: "Vos actions ont versé des dividendes et pris de la valeur. La grande question : **combien dois-je aux impôts ?**" },
        { kind: "text", value: "Bonne nouvelle : l'UEMOA a mis en place une fiscalité **très avantageuse** pour les particuliers." },
      ],
    },
    {
      title: "L'impôt sur les dividendes (IRVM)",
      blocks: [
        { kind: "text", value: "L'IRVM est prélevé **à la source** — comme votre salaire, qui arrive déjà net d'impôt sur votre compte. Quand vous voyez le « dividende net » au BOC, l'impôt est donc déjà payé. Aucune démarche à faire." },
        { kind: "text", value: "Son taux **varie selon le pays**. Vérifiez celui de votre pays :" },
        {
          kind: "list",
          items: [
            "**Côte d'Ivoire** : ~12 %",
            "**Burkina Faso** : 12,5 %",
            "**Niger** : 7 %",
            "**Bénin** : 4 %",
          ],
        },
      ],
    },
    {
      title: "L'impôt sur les plus-values : la super nouvelle 🎉",
      blocks: [
        { kind: "callout", tone: "highlight", value: "Dans la zone UEMOA, la plus-value boursière des **particuliers** (personnes physiques, non professionnels) est, dans la grande majorité des cas, **totalement exonérée d'impôt** !" },
        { kind: "text", value: "(En France, ce serait ~30 %.)" },
      ],
    },
    {
      title: "L'impôt sur les obligations (IRC)",
      blocks: [
        { kind: "text", value: "Les intérêts d'obligations peuvent être soumis à l'IRC (~4 %). Mais quand vous prêtez à un État de l'UEMOA en tant que **national/résident**, l'intérêt est souvent servi **net d'impôt** (l'État prend l'IRC à sa charge)." },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Vrai ou faux fiscal",
    instruction: "Vrai ou faux ? (1 erreur = − 5 000 FCFA.)",
    penaltyPerError: 5000,
    perfectReward: 15000,
    options: [
      { value: "vrai", label: "Vrai" },
      { value: "faux", label: "Faux" },
    ],
    questions: [
      {
        prompt: "**Affirmation 1 :** « Koffi a reçu 50 000 FCFA de dividendes nets de Sonatel. S'il utilise cet argent, il devra aller aux impôts le déclarer et payer une taxe en plus. »",
        answer: "faux",
      },
      {
        prompt: "**Affirmation 2 :** « Amina a acheté des actions BOA pour 1 M. Cinq ans plus tard, elles valent 3 M. En vendant, l'État lui prélèvera 20 à 30 % sur sa plus-value de 2 M. »",
        answer: "faux",
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Impôts maîtrisés ! + 15 000 FCFA sur votre portefeuille !",
      body: "Vous avez compris le paradis fiscal qu'est l'investissement boursier pour les particuliers de la région.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Pénalité administrative (− 5 000 FCFA par erreur).",
      body: "Reprenons ce que dit vraiment la loi fiscale.",
    },
    explanations: [
      {
        verdict: "Faux",
        title: "Les dividendes sont gérés « à la source »",
        body: "L'État a déjà prélevé sa part avant que l'argent n'arrive. Les 50 000 FCFA de Koffi sont 100 % à lui — aucune démarche.",
      },
      {
        verdict: "Faux",
        title: "La plus-value des particuliers n'est (souvent) pas taxée",
        body: "Contrairement à l'immobilier, la plus-value boursière des personnes physiques est exonérée dans la plupart des pays de l'UEMOA. Un avantage massif pour faire grossir son capital.",
        note: "⚠️ **La fiscalité évolue :** vérifiez toujours la loi de finances de votre pays, ou demandez à votre SGI.",
      },
    ],
  },

  next: {
    label: "Je garde mes gains ! Mais quand faut-il vendre ?",
    target: "Module 26",
  },
};
