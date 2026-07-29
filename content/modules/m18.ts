import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 18 — Graham (2/4) : la performance (lire le
   compte de résultat).
   Barème NON standard (§4 : « Graham 1b Performance | 3 | +30 000 |
   −10 000 ») : perfectReward 30000 / penaltyPerError 10000 — PAS le
   20000/5000 par défaut de la Phase 3.
   RESTRUCTURATION DE L'EXPLICATION (wrinkle documentée dans le
   brief de cette tâche) : le Défi n'a que 2 questions, mais la
   source décrit 4 profils A/B/C/D dans son explication. Répartition :
   - Explanation 1 (Q1, « quel profil est le plus performant ? ») =
     les 4 puces A/B/C/D combinées en un seul corps — juger A exige
     de le contraster avec B/C/D.
   - Explanation 2 (Q2, « que révèle le Profil D ? ») = focus sur la
     seule puce D (chevauchement volontaire avec l'explanation 1, pas
     une duplication problématique — Q2 porte spécifiquement sur D).
   Le paragraphe de clôture « Deux leçons d'or » + la parenthèse
   « (Pour une banque, on suit le PNB.) » sont repliés dans le `.note`
   de l'explanation 2 (la dernière), jamais en 3ᵉ entrée synthétique.
   `feedback.explanations.length` = 2 = `challenge.questions.length`.
   Parenthèse italique *(Hors Activités Ordinaires)* et la question
   d'analyste en italique (Slide 4) : astérisques simples retirés,
   texte conservé (splitMarkup, lib/format.ts, ne reconnaît que
   **gras**).
   Revue post-lancement : lien brvm.org + PDF réel (états financiers
   Sonatel 2025) sur la Slide 1 ; illustrations (boctable/duo) sur
   chaque slide restante, avec un même exemple chiffré fictif filé
   sur les Slides 2-4 (100M CA → 20M exploitation → 26M net, puis le
   piège du camion vendu une seule fois).
   ============================================================= */
export const m18: Module = {
  code: "M18",
  index: 18,
  totalModules: 28,
  title: "Graham (2/4) : la performance (lire le compte de résultat)",
  phase: "Phase 3 · L'Analyse",
  status: { emoji: "🥇", label: "L'Analyste Stratège" },
  reward: 30000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 18",
    headline: "Le bénéfice ne dit pas tout : d'où vient-il ?",
    lead:
      "Le compte de résultat se lit comme une **cascade**, du chiffre d'affaires jusqu'au résultat net. Mais un bénéfice final flatteur peut cacher un piège : d'où vient-il vraiment ?",
    card: {
      label: "La cascade du compte de résultat",
      title: "CA → Exploitation → Net",
      hint: "Trois lignes à suivre, du haut vers le bas :",
      rules: [
        "**Le chiffre d'affaires** — tout l'argent encaissé (le PNB pour une banque).",
        "**Le résultat d'exploitation** — ce qui reste une fois le métier payé : la vraie performance.",
        "**Le résultat net** — la ligne finale, parfois gonflée par de l'exceptionnel.",
      ],
    },
    objectives: [
      "Lire le compte de résultat comme une cascade, du chiffre d'affaires (ou du PNB) jusqu'au résultat net.",
      "Distinguer la vraie performance du métier (résultat d'exploitation) d'un bénéfice gonflé par de l'exceptionnel.",
      "Suivre la tendance sur 10 ans plutôt qu'un chiffre isolé pour juger si une entreprise est rassurante.",
    ],
    cta: "Lire la performance comme un analyste",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Gagne-t-elle vraiment de l'argent ?",
      blocks: [
        { kind: "text", value: "Vous avez le portrait. Passons à sa **performance financière** : elle se lit dans un document, le **compte de résultat** (publié chaque année dans le rapport annuel, sur brvm.org)." },
        {
          kind: "link",
          label: "Ouvrir les rapports des sociétés cotées",
          sublabel: "brvm.org · rapports annuels et états financiers",
          href: "https://www.brvm.org/fr/rapports-societes-cotees",
        },
        {
          kind: "download",
          label: "Télécharger un vrai compte de résultat (PDF)",
          sublabel: "États financiers 2025 · Sonatel — exemple réel",
          href: "/docs/sonatel-etats-financiers-2025.pdf",
        },
      ],
    },
    {
      title: "Le compte de résultat, c'est une cascade 🍽️",
      blocks: [
        { kind: "text", value: "Imaginez un restaurant. L'argent « descend » de haut en bas, étage par étage :" },
        {
          kind: "list",
          items: [
            "**Le chiffre d'affaires** = tout l'argent encaissé en vendant ses plats.",
            "**Le résultat d'exploitation** = ce qui reste une fois payés les cuisiniers, les ingrédients, le loyer. ⭐ **C'est la vraie performance du métier.**",
          ],
        },
        {
          kind: "boctable",
          caption: "Exemple (chiffres fictifs)",
          columns: ["Ligne", "Montant"],
          rows: [
            ["Chiffre d'affaires", "100 000 000 FCFA"],
            ["− Coûts du métier (cuisiniers, ingrédients, loyer)", "− 80 000 000 FCFA"],
            ["= Résultat d'exploitation", "20 000 000 FCFA"],
          ],
          highlightCols: [1],
        },
        { kind: "text", value: "On continue la cascade au slide suivant." },
      ],
    },
    {
      title: "La cascade (suite), jusqu'au résultat net",
      blocks: [
        {
          kind: "list",
          items: [
            "**Le résultat financier** = les gains liés aux placements du restaurant (ex. les intérêts de son épargne). C'est **annexe** à son métier.",
            "**Le résultat HAO** (Hors Activités Ordinaires) = un gain **exceptionnel**, qui ne se reproduira pas (ex. la vente de son vieux camion).",
            "**Le résultat net** = tout additionné, la toute dernière ligne : le bénéfice final.",
          ],
        },
        {
          kind: "boctable",
          caption: "Suite de l'exemple (chiffres fictifs)",
          columns: ["Ligne", "Montant"],
          rows: [
            ["Résultat d'exploitation", "20 000 000 FCFA"],
            ["+ Résultat financier (intérêts de l'épargne)", "+ 1 000 000 FCFA"],
            ["+ Résultat HAO (vente du vieux camion)", "+ 5 000 000 FCFA"],
            ["= Résultat net", "26 000 000 FCFA"],
          ],
          highlightCols: [1],
        },
      ],
    },
    {
      title: "Le piège du résultat net ⚠️",
      blocks: [
        { kind: "text", value: "Un restaurant peut afficher un **beau résultat net** cette année… mais seulement parce qu'il a **vendu son camion** (un gain HAO, exceptionnel). L'an prochain, plus de camion à vendre — et on découvre que son cœur de métier gagnait à peine de l'argent." },
        {
          kind: "boctable",
          caption: "Le piège, illustré (suite de l'exemple)",
          columns: ["Année", "Résultat d'exploitation", "Résultat HAO", "Résultat net"],
          rows: [
            ["Cette année", "20 000 000 FCFA", "+ 5 000 000 FCFA (vente du camion)", "26 000 000 FCFA"],
            ["L'an prochain", "20 000 000 FCFA", "0 FCFA (plus de camion)", "20 000 000 FCFA"],
          ],
          highlightCols: [3],
        },
        { kind: "text", value: "👉 D'où LA question de l'analyste : le bénéfice vient-il vraiment du métier (le résultat d'exploitation), ou d'un coup de chance ponctuel ?" },
      ],
    },
    {
      title: "Cas des banques : le PNB",
      blocks: [
        { kind: "text", value: "Attention : une **banque** n'a pas de « chiffre d'affaires » classique. Son métier, c'est l'argent lui-même : elle encaisse des intérêts sur les crédits qu'elle accorde, mais en **reverse** sur les dépôts de ses clients." },
        { kind: "text", value: "On regarde donc le **Produit Net Bancaire (PNB)** : ce qu'elle **garde vraiment** (marge d'intérêt + commissions + gains de marché)." },
        {
          kind: "duo",
          items: [
            { side: "Entreprise classique", value: "Chiffre d'affaires → Résultat d'exploitation → Résultat net" },
            { side: "Banque", value: "**PNB** (marge d'intérêt + commissions + gains de marché) → Résultat d'exploitation → Résultat net" },
          ],
        },
        { kind: "text", value: "👉 Pour une banque, remplacez mentalement « chiffre d'affaires » par « PNB »." },
      ],
    },
    {
      title: "La bonne méthode : la tendance sur 10 ans",
      blocks: [
        { kind: "text", value: "Un chiffre isolé ne veut rien dire. Le réflexe d'analyste : tracer sur **10 ans** trois courbes — le chiffre d'affaires (ou le PNB), le résultat d'exploitation et le résultat net." },
        {
          kind: "list",
          items: [
            "Des courbes qui **montent régulièrement** = une entreprise performante et rassurante.",
            "Des courbes en **dents de scie** = imprévisible, plus risqué.",
            "Des courbes qui **déclinent franchement** = signal d'alerte direct. 👇",
          ],
        },
        {
          kind: "chart",
          caption: "Profil rassurant (chiffres fictifs, en milliards FCFA)",
          categories: ["2016", "2018", "2020", "2022", "2025"],
          series: [
            { label: "Chiffre d'affaires", kind: "bar", color: "blue", values: [40, 50, 65, 78, 90] },
            { label: "Résultat d'exploitation", kind: "line", color: "pos", values: [6, 9, 12, 14, 16] },
            { label: "Résultat net", kind: "line", color: "gold", values: [4, 6, 9, 11, 13] },
          ],
        },
        {
          kind: "chart",
          caption: "Profil en déclin (chiffres fictifs, en milliards FCFA)",
          categories: ["2016", "2018", "2020", "2022", "2025"],
          series: [
            { label: "Chiffre d'affaires", kind: "bar", color: "blue", values: [90, 85, 75, 60, 50] },
            { label: "Résultat d'exploitation", kind: "line", color: "pos", values: [16, 13, 9, 5, 2] },
            { label: "Résultat net", kind: "line", color: "clay", values: [13, 10, 6, 2, -1] },
          ],
        },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Interpréter les courbes sur 10 ans",
    instruction: "Quatre entreprises, chacune avec 3 courbes sur 10 ans (chiffre d'affaires, résultat d'exploitation, résultat net). Basculez d'un profil à l'autre et répondez. (1 erreur = − 10 000 FCFA.)",
    chartProfiles: [
      {
        key: "a",
        label: "Profil A",
        data: {
          categories: ["2016", "2018", "2020", "2022", "2025"],
          unit: "milliards FCFA",
          series: [
            { label: "Chiffre d'affaires", kind: "bar", color: "blue", values: [40, 52, 65, 78, 90] },
            { label: "Résultat d'exploitation", kind: "line", color: "pos", values: [6, 8, 10, 13, 15] },
            { label: "Résultat net", kind: "line", color: "gold", values: [4, 6, 7, 9, 11] },
          ],
        },
      },
      {
        key: "b",
        label: "Profil B",
        data: {
          categories: ["2016", "2018", "2020", "2022", "2025"],
          unit: "milliards FCFA",
          series: [
            { label: "Chiffre d'affaires", kind: "bar", color: "blue", values: [40, 55, 70, 85, 100] },
            { label: "Résultat d'exploitation", kind: "line", color: "pos", values: [8, 7, 7, 6, 5] },
            { label: "Résultat net", kind: "line", color: "gold", values: [6, 5, 5, 4, 4] },
          ],
        },
      },
      {
        key: "c",
        label: "Profil C",
        data: {
          categories: ["2016", "2018", "2020", "2022", "2025"],
          unit: "milliards FCFA",
          series: [
            { label: "Chiffre d'affaires", kind: "bar", color: "blue", values: [40, 70, 35, 90, 55] },
            { label: "Résultat d'exploitation", kind: "line", color: "pos", values: [7, 3, 8, 2, 6] },
            { label: "Résultat net", kind: "line", color: "gold", values: [5, 1, 6, 0, 4] },
          ],
        },
      },
      {
        key: "d",
        label: "Profil D",
        data: {
          categories: ["2016", "2018", "2020", "2022", "2025"],
          unit: "milliards FCFA",
          series: [
            { label: "Chiffre d'affaires", kind: "bar", color: "blue", values: [50, 49, 49, 48, 48] },
            { label: "Résultat d'exploitation", kind: "line", color: "pos", values: [10, 8, 7, 5, 4] },
            { label: "Résultat net", kind: "line", color: "gold", values: [6, 7, 8, 10, 12] },
          ],
        },
      },
    ],
    penaltyPerError: 10000,
    perfectReward: 30000,
    // Recopie des options de Q1 en repli neutre (requis par le type) :
    // chaque question a sa propre liste de boutons.
    options: [
      { value: "a", label: "A" },
      { value: "b", label: "B" },
      { value: "c", label: "C" },
      { value: "d", label: "D" },
    ],
    questions: [
      {
        prompt: "**Q1 :** Quel profil est le plus **performant et rassurant** pour le long terme ?",
        answer: "a",
        options: [
          { value: "a", label: "A" },
          { value: "b", label: "B" },
          { value: "c", label: "C" },
          { value: "d", label: "D" },
        ],
      },
      {
        prompt: "**Q2 :** Dans le Profil D, le net monte alors que l'exploitation s'effondre. Que révèle-t-il ?",
        answer: "alerte",
        options: [
          { value: "performante", label: "L'entreprise est très performante." },
          { value: "alerte", label: "Le net est porté par de l'exceptionnel (HAO) ou du financier, pas par le cœur de métier. Signal d'alerte." },
          { value: "erreur", label: "Une erreur comptable, à ignorer." },
        ],
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Lecture d'expert ! + 30 000 FCFA sur votre portefeuille !",
      body: "Vous ne regardez plus seulement la ligne du bas : vous savez d'où vient vraiment le bénéfice.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Une courbe vous a trompé (− 10 000 FCFA par erreur).",
      body: "Reprenons la lecture des 4 profils.",
    },
    explanations: [
      {
        verdict: "Profil A",
        title: "Les 4 profils, comparés",
        body: "**Profil A — la championne ✅** : les 3 courbes montent ensemble. Performante et prévisible. **Profil B — la fausse croissance ⚠️** : elle vend plus (40 → 100) mais gagne moins (exploitation 8 → 5) — autrement dit, elle gagne de moins en moins sur chaque vente. **Profil C — montagnes russes ⚠️** : imprévisible, difficile à évaluer. **Profil D — le mirage 🚨** : le net grimpe (6 → 12) mais le cœur de métier s'effondre (10 → 4). Le net n'est gonflé que par de l'exceptionnel. Danger.",
      },
      {
        verdict: "Porté par l'exceptionnel (HAO/financier) — signal d'alerte",
        title: "Le mirage du Profil D",
        body: "**Profil D — le mirage 🚨** : le net grimpe (6 → 12) mais le cœur de métier s'effondre (10 → 4). Le net n'est gonflé que par de l'exceptionnel. Danger.",
        note: "**Deux leçons d'or :** le **résultat d'exploitation** est le vrai juge de la performance (c'est lui qui dit si le métier gagne de l'argent) ; et la **tendance sur 10 ans** compte plus que le chiffre d'une seule année. (Pour une banque, on suit le PNB.)",
      },
    ],
  },

  next: {
    label: "Performante… mais son avenir est-il assuré ?",
    target: "Module 19",
  },
};
