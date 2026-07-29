import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 23 — Graham (4/4) : payer le juste prix
   (PER, PBR & la règle de Graham).
   Barème NON standard (§4 : « Graham 3 Prix | 3 | +40 000 | −10 000 »).
   REFRAMING DE Q1 (wrinkle documentée dans le brief de cette tâche) :
   la source présente Q1 comme des « [Cases à cocher] » (multi-select
   sur X/Y/Z), mais `QuizChallenge.questions[].answer` est une chaîne
   unique comparée à UNE option — le moteur ne supporte aucune
   sélection multiple simultanée (et en ajouter une est hors scope
   de cette tâche de contenu). Même famille d'adaptation que la
   conversion numérique de M03 et M17 (reformuler en QCM à choix
   unique avec des options plausibles) : Q1 devient un choix unique
   sur l'ÉNONCÉ COMBINÉ (« lesquelles passent le filtre ? » → 4
   options : "X et Y" / "X, Y et Z" / "Seulement Z" / "Aucune des
   trois"), réponse correcte = "X et Y" (X = 9×1,3 = 11,7 ✓, Y =
   5×0,7 = 3,5 ✓, Z = 24×2,8 = 67,2 ✗). Q2 reste un quiz normal à
   choix unique (mécanisme `options` par question, comme M17/M18).
   Formule entre backticks du .txt (`PER × PBR < 22,5`) convertie en
   **gras**, même convention que m08/m15/m16.
   Explications (2, un par question) : Explanation 1 (Q1) = la ligne
   « Le calcul » (X/Y/Z) ; Explanation 2 (Q2) = les 3 puces
   qualitatives (X la pépite / Y le piège / Z la qualité surpayée).
   « La leçon d'or des 3 piliers » ET le paragraphe de transition
   « Fin du bloc Analyse fondamentale » (avec sa question « Prêt pour
   l'examen de passage ? ») sont tous deux repliés dans le `.note` de
   l'explanation 2 (la dernière) — décision documentée ici, plutôt
   qu'une 3ᵉ entrée synthétique (garde `explanations.length` = 2 =
   `questions.length`). C'est une version plus modeste de la
   transition de fin de phase déjà vue en M04/M24.
   ============================================================= */
export const m23: Module = {
  code: "M23",
  index: 23,
  totalModules: 28,
  title: "Graham (4/4) : payer le juste prix (PER, PBR & la règle de Graham)",
  phase: "Phase 4 · L'Analyse",
  status: { emoji: "🎓", label: "L'Analyste Confirmé" },
  reward: 40000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 23",
    headline: "Le prix, le dernier pilier — et le plus décisif.",
    lead:
      "Même la meilleure entreprise, achetée trop cher, peut être un mauvais placement. Avec le PER, le PBR et la règle de Graham (**PER × PBR < 22,5**), vous apprenez à payer le juste prix — et à repérer le piège de la valeur.",
    card: {
      label: "Payer le juste prix",
      title: "PER, PBR & la règle de Graham",
      hint: "3 outils pour juger un prix, jamais seuls :",
      rules: [
        "**Le PER** — le nombre d'années de bénéfices pour se rembourser.",
        "**Le PBR** — combien de fois le patrimoine de l'entreprise vous payez.",
        "**PER × PBR < 22,5** — un plafond à ne jamais dépasser, pas un feu vert.",
      ],
    },
    objectives: [
      "Calculer et interpréter le PER et le PBR pour juger si un prix est raisonnable.",
      "Appliquer la règle de Graham (PER × PBR < 22,5) comme un plafond à ne jamais dépasser, pas un feu vert d'achat.",
      "Reconnaître le piège de la valeur : une action pas chère parce que l'entreprise elle-même se dégrade.",
    ],
    cta: "Apprendre à payer le juste prix",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "La meilleure entreprise peut être un mauvais achat",
      blocks: [
        { kind: "text", value: "Vous avez une entreprise solide (✓), avec de l'avenir (✓). Reste le pilier décisif : **le prix**." },
        { kind: "text", value: "Imaginez le **meilleur téléphone du monde**… vendu 500 000 FCFA alors qu'il en vaut 200 000. Même excellent, c'est une mauvaise affaire. En bourse, c'est pareil :" },
        {
          kind: "duo",
          items: [
            { side: "Prix payé", value: "500 000 FCFA" },
            { side: "Valeur réelle", value: "200 000 FCFA — l'écart, c'est ce que vous payez en trop." },
          ],
        },
        { kind: "callout", tone: "highlight", value: "« Le prix, c'est ce que vous payez. La valeur, c'est ce que vous recevez. »" },
        { kind: "text", value: "D'où l'idée de Graham : la **marge de sécurité**. Comme un pont qu'on construit pour supporter 30 tonnes alors que les camions n'en pèsent que 10 — on se garde une marge, au cas où. On achète en dessous de la vraie valeur, pour avoir un coussin." },
      ],
    },
    {
      title: "Le PER : « en combien d'années je me rembourse ? »",
      blocks: [
        { kind: "text", value: "Le **PER** (Price Earning Ratio) reprend l'image de la boutique (M17) : c'est le nombre d'années de bénéfices pour récupérer votre mise." },
        { kind: "formula", label: "PER", value: "Cours ÷ Bénéfice par action" },
        {
          kind: "boctable",
          caption: "Deux PER, deux lectures",
          columns: ["PER", "Lecture"],
          rows: [
            ["8", "8 ans pour se rembourser : vous payez peu, bon marché."],
            ["25", "25 ans : très cher. Le marché parie sur une croissance énorme ; s'il se trompe, la chute fait mal."],
          ],
          highlightCols: [0],
        },
      ],
    },
    {
      title: "Quel PER est bon ? (repères BRVM)",
      blocks: [
        { kind: "text", value: "Le bon réflexe : se comparer à **la moyenne de la classe** — le PER moyen du marché, ≈ **14** (le BOC le publie)." },
        {
          kind: "boctable",
          caption: "Repères PER (BRVM)",
          columns: ["PER", "Repère"],
          rows: [
            ["< 8", "Franchement bon marché (gare au piège de la valeur)"],
            ["8 à 12", "Attractif"],
            ["12 à 15", "Dans la moyenne"],
            ["> 20", "Cher"],
          ],
        },
      ],
    },
    {
      title: "Le PBR : « combien de fois le patrimoine ? » 🏠",
      blocks: [
        { kind: "text", value: "Autre lunette, le **PBR** (Price to Book Ratio). Le patrimoine (« actif net »), c'est tout ce que possède l'entreprise **moins ses dettes** — ce qui resterait si on vendait tout." },
        { kind: "formula", label: "PBR", value: "Cours ÷ Patrimoine par action" },
        { kind: "text", value: "**L'image :** achèteriez-vous une maison **3 fois le prix de ses murs** ? Le PBR, c'est ce multiple :" },
        {
          kind: "boctable",
          caption: "Repères PBR",
          columns: ["PBR", "Repère"],
          rows: [
            ["< 1", "Vous payez moins que le patrimoine — affaire potentielle (vérifiez pourquoi)"],
            ["1 à 1,5", "Bon"],
            ["1,5 à 3", "Ça devient cher"],
            ["> 3", "Cher"],
          ],
        },
      ],
    },
    {
      title: "La règle de Graham (et le piège) ⚠️",
      blocks: [
        { kind: "text", value: "Un placement prudent respecte :" },
        { kind: "formula", label: "Règle de Graham", value: "PER × PBR < 22,5" },
        { kind: "callout", tone: "warn", value: "⚠️ Mais attention (calibrage BRVM) : cette règle vient des USA des années 70. Ici, beaucoup d'actions passent facilement le filtre → **22,5 n'est PAS un feu vert d'achat**, juste un « ne payez jamais au-dessus »." },
        { kind: "text", value: "Le vrai danger local, c'est le **piège de la valeur** : une maison pas chère… **parce qu'elle est fissurée** ; une action pas chère… **parce que l'entreprise se dégrade**. **Pas cher ≠ bonne affaire.**" },
      ],
    },
    {
      title: "La synthèse des 3 piliers",
      blocks: [
        { kind: "text", value: "Un prix bas ne vaut **que** s'il s'ajoute à la performance (M21) et aux perspectives (M22) :" },
        {
          kind: "boctable",
          caption: "La même équation, deux résultats opposés",
          columns: ["Prix", "Entreprise", "Résultat"],
          rows: [
            ["Pas cher", "Solide + bel avenir", "💎 Pépite"],
            ["Pas cher", "Fondamentaux qui se dégradent", "🪤 Piège de la valeur"],
          ],
          highlightCols: [2],
        },
        { kind: "text", value: "👇" },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Le calculateur et le piège",
    instruction: "Observez ces 3 entreprises et répondez. (1 erreur = − 10 000 FCFA.)",
    table: {
      caption: "Trois entreprises à évaluer",
      columns: ["Entreprise", "PER", "PBR", "Fondamentaux"],
      rows: [
        ["X — Banque de l'Union", "9", "1,3", "Bénéfices en hausse, dividende régulier, secteur porteur"],
        ["Y — Vieux-Comptoir", "5", "0,7", "Bénéfices en baisse 3 ans, dividende coupé, parts perdues"],
        ["Z — Croissance-Tech", "24", "2,8", "Forte croissance, aucun dividende"],
      ],
      highlightCols: [1, 2],
    },
    penaltyPerError: 10000,
    perfectReward: 40000,
    // Recopie des options de Q1 en repli neutre (requis par le type) :
    // Q2 a sa propre liste de boutons.
    options: [
      { value: "xy", label: "X et Y" },
      { value: "xyz", label: "X, Y et Z" },
      { value: "z", label: "Seulement Z" },
      { value: "none", label: "Aucune des trois" },
    ],
    questions: [
      {
        prompt: "Calculez **PER × PBR** pour les 3 entreprises. Lesquelles respectent la règle de Graham (**< 22,5**) ?",
        answer: "xy",
        options: [
          { value: "xy", label: "X et Y" },
          { value: "xyz", label: "X, Y et Z" },
          { value: "z", label: "Seulement Z" },
          { value: "none", label: "Aucune des trois" },
        ],
      },
      {
        prompt: "**Q2 :** Vous cherchez un placement **solide de long terme**. Laquelle achetez-vous ?",
        answer: "x",
        options: [
          { value: "x", label: "X" },
          { value: "y", label: "Y (la moins chère !)" },
          { value: "z", label: "Z" },
        ],
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Maître analyste ! + 40 000 FCFA sur votre portefeuille !",
      body: "Vous avez évité les deux pièges opposés : la fausse bonne affaire et la qualité surpayée.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Un pilier vous a échappé (− 10 000 FCFA par erreur).",
      body: "Reprenons le calcul et les fondamentaux.",
    },
    explanations: [
      {
        verdict: "X et Y",
        title: "Le calcul PER × PBR",
        body: "**Le calcul :** X = 9 × 1,3 = **11,7** ✓ · Y = 5 × 0,7 = **3,5** ✓ · Z = 24 × 2,8 = **67,2** ✗.",
      },
      {
        verdict: "Entreprise X",
        title: "X, Y et Z : la pépite, le piège, la qualité surpayée",
        body: "**X = la pépite.** Passe le prix (11,7) **ET** solide **ET** secteur porteur. Les 3 feux au vert. **Y = le piège de la valeur.** La moins chère (3,5)… mais la maison est fissurée (bénéfices en chute, dividende coupé). Le prix bas ne compense JAMAIS une entreprise qui décline. **Z = la qualité surpayée.** À 67,2, vous payez 24 ans de bénéfices d'avance : aucune marge de sécurité.",
        note: "**La leçon d'or des 3 piliers :** on achète quand **Performance 🟢 + Perspectives 🟢 + Prix 🟢** sont alignés. Un seul feu rouge → on passe son chemin. 🏆 **Vous savez analyser une entreprise comme un professionnel.** Performance, perspectives, prix : plus de secret. Prêt pour l'examen de passage ?",
      },
    ],
  },

  next: {
    label: "Je relève le défi final de l'analyste !",
    target: "Module 24",
  },
};
