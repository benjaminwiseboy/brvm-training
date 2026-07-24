import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 24 — Quand vendre ses titres (l'art de la
   sortie). Phase 5 « Suivi & maîtrise ».
   Barème standard Phase 5 (Bareme harmonise.txt §4 : « Quand
   vendre | Phase 5 | +25 000 | −5 000 ») : perfectReward 25000 /
   penaltyPerError 5000 / reward 25000 — confirmé par le propre
   texte du .txt (« + 25 000 FCFA » / « − 5 000 FCFA par erreur »).
   Défi « Vendre ou garder ? » à 5 cas : `challenge.questions` a
   donc 5 entrées, et `feedback.explanations` AUSSI 5 entrées.
   Seul le numéro de chaque cas est en gras dans le .txk (« **1.** »,
   pas la phrase entière) : gras reproduit à l'identique sur les
   prompts, sans ajout ni perte (règle de non-altération du gras).
   La « leçon » de clôture (les 2 questions à se poser avant de
   vendre) est repliée dans le `.note` de la 5ᵉ (dernière)
   explication, comme M04/M19/M23 — PAS une 6ᵉ entrée synthétique.
   Italiques simples du .txt (*l'entreprise a-t-elle changé ?*, etc.)
   non supportées par renderMarkup : converties en texte normal.
   ============================================================= */
export const m24: Module = {
  code: "M24",
  index: 24,
  totalModules: 26,
  title: "Quand vendre ses titres (l'art de la sortie)",
  phase: "Phase 5 · Suivi & maîtrise",
  status: { emoji: "🎓", label: "L'Analyste Confirmé" },
  reward: 25000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 24",
    headline: "Acheter est facile, vendre est un art.",
    lead:
      "Tout le monde sait acheter. Savoir **quand vendre** — et surtout **ne pas** vendre — sépare l'investisseur discipliné de celui qui s'agite pour rien. **On ne vend pas parce que le PRIX a bougé. On vend parce que quelque chose a changé dans l'ENTREPRISE ou dans VOTRE plan.**",
    card: {
      label: "Avant de cliquer « vendre »",
      title: "3 bonnes raisons, et les pièges à éviter",
      hint: "On ne vend jamais sur un coup de tête :",
      rules: [
        "**Votre objectif est atteint** — le plan a marché, vous encaissez.",
        "**La thèse s'est cassée** — les fondamentaux se sont dégradés durablement.",
        "**Le rééquilibrage** — une action pèse trop lourd dans votre allocation.",
      ],
    },
    cta: "Apprendre à sortir",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Acheter est facile, vendre est un art",
      blocks: [
        { kind: "text", value: "Tout le monde sait acheter. Savoir **quand vendre** — et surtout **ne pas** vendre — sépare l'investisseur discipliné de celui qui s'agite pour rien." },
        { kind: "callout", tone: "highlight", value: "On ne vend pas parce que le PRIX a bougé. On vend parce que quelque chose a changé dans l'ENTREPRISE ou dans VOTRE plan." },
        { kind: "text", value: "Vous ne vendriez pas votre maison juste parce que celle du voisin s'est bradée un jour, n'est-ce pas ? Une action, c'est pareil." },
      ],
    },
    {
      title: "✅ Les 3 bonnes raisons de vendre",
      blocks: [
        {
          kind: "list",
          items: [
            "**Votre objectif est atteint** (ou vous avez besoin de l'argent) — le plan a marché, vous encaissez.",
            "**La thèse s'est cassée** — les fondamentaux se sont dégradés durablement (bénéfices en chute, dividende coupé, avantage perdu).",
            "**Le rééquilibrage** — une action pèse trop lourd, vous en vendez une partie pour revenir à votre allocation cible.",
          ],
        },
      ],
    },
    {
      title: "❌ Les mauvaises raisons (les pièges)",
      blocks: [
        {
          kind: "list",
          items: [
            "**La peur / la panique** (un krach) — vendre transforme une baisse temporaire en perte définitive.",
            "**L'ennui, l'impatience** — « ça ne bouge pas assez vite » n'est pas une raison.",
            "**« Prendre ses petits bénéfices » trop tôt** — couper une excellente entreprise pour +10 %.",
            "**Une rumeur** — « mon cousin a dit… » → non.",
          ],
        },
      ],
    },
    {
      title: "Un mot sur l'impôt",
      blocks: [
        { kind: "text", value: "À la BRVM, la plus-value des particuliers est généralement **exonérée** : vendre ne coûte pas d'impôt. Mais vendre souvent coûte des **frais** et vous prive des intérêts composés et des dividendes futurs. **Le temps reste votre allié.**" },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Vendre ou garder ?",
    instruction: "Pour chaque situation, VENDRE ou GARDER ? (1 erreur = − 5 000 FCFA.)",
    penaltyPerError: 5000,
    perfectReward: 25000,
    options: [
      { value: "vendre", label: "Vendre" },
      { value: "garder", label: "Garder" },
    ],
    questions: [
      {
        prompt: "**1.** Le marché chute de 15 % par panique. Vos entreprises restent solides.",
        answer: "garder",
      },
      {
        prompt: "**2.** Votre projet (la retraite) prévu dans votre plan commence dans 2 mois.",
        answer: "vendre",
      },
      {
        prompt: "**3.** Une de vos entreprises voit ses bénéfices s'effondrer 3 ans de suite, coupe son dividende, perd son marché.",
        answer: "vendre",
      },
      {
        prompt: "**4.** Une bonne action a pris +12 % en 3 mois ; vous vous ennuyez et voulez « prendre vos bénéfices ».",
        answer: "garder",
      },
      {
        prompt: "**5.** Un ami jure qu'une de vos actions va s'effondrer, sans preuve, alors que ses résultats sont excellents.",
        answer: "garder",
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Sang-froid d'acier ! + 25 000 FCFA sur votre portefeuille !",
      body: "Vous ne vendez que pour de bonnes raisons, jamais sous le coup de l'émotion.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Une main trop nerveuse sur le bouton « vendre » (− 5 000 FCFA par erreur).",
      body: "Reprenons chaque situation.",
    },
    explanations: [
      {
        verdict: "Garder",
        title: "Le prix a bougé, pas l'entreprise",
        body: "Une panique est temporaire. On ne vend jamais par peur.",
      },
      {
        verdict: "Vendre",
        title: "Objectif atteint",
        body: "C'est le plan prévu. Vous encaissez pour votre projet.",
      },
      {
        verdict: "Vendre",
        title: "La thèse s'est cassée",
        body: "Ce n'est plus l'entreprise que vous aviez analysée.",
      },
      {
        verdict: "Garder",
        title: "L'ennui n'est pas une stratégie",
        body: "Couper une excellente entreprise pour +12 %, c'est rater les +100 % futurs.",
      },
      {
        verdict: "Garder",
        title: "Une rumeur ne vaut rien",
        body: "Une rumeur ne vaut rien face à de bons résultats. On décide sur des faits.",
        note: "**La leçon :** avant de vendre, deux questions — l'entreprise a-t-elle changé ? et mon plan a-t-il changé ? Si non aux deux, on **garde**.",
      },
    ],
  },

  next: {
    label: "Je sais quand sortir ! Dernière validation avant l'épreuve finale.",
    target: "Module 25",
  },
};
