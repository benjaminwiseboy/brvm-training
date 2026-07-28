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
    cta: "Lire la performance comme un analyste",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Gagne-t-elle vraiment de l'argent ?",
      blocks: [
        { kind: "text", value: "Vous avez le portrait. Passons à sa **performance financière** : elle se lit dans un document, le **compte de résultat** (publié chaque année dans le rapport annuel, sur brvm.org)." },
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
      ],
    },
    {
      title: "Le piège du résultat net ⚠️",
      blocks: [
        { kind: "text", value: "Un restaurant peut afficher un **beau résultat net** cette année… mais seulement parce qu'il a **vendu son camion** (un gain HAO, exceptionnel). L'an prochain, plus de camion à vendre — et on découvre que son cœur de métier gagnait à peine de l'argent." },
        { kind: "text", value: "👉 D'où LA question de l'analyste : le bénéfice vient-il vraiment du métier (le résultat d'exploitation), ou d'un coup de chance ponctuel ?" },
      ],
    },
    {
      title: "Cas des banques : le PNB",
      blocks: [
        { kind: "text", value: "Attention : une **banque** n'a pas de « chiffre d'affaires » classique. Son métier, c'est l'argent lui-même : elle encaisse des intérêts sur les crédits qu'elle accorde, mais en **reverse** sur les dépôts de ses clients." },
        { kind: "text", value: "On regarde donc le **Produit Net Bancaire (PNB)** : ce qu'elle **garde vraiment** (marge d'intérêt + commissions + gains de marché)." },
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
            "Des courbes en **dents de scie** = imprévisible, plus risqué. 👇",
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
    instruction:
      "Quatre entreprises, chacune avec 3 courbes sur 10 ans (chiffre d'affaires / résultat d'exploitation / résultat net, en milliards FCFA). **📈 Profil A** — CA : 40 → 90 · Exploitation : 6 → 15 · Net : 4 → 11 (tout monte régulièrement). **📈 Profil B** — CA : 40 → 100 · Exploitation : 8 → 5 · Net : 6 → 4 (le CA grimpe, le reste baisse). **📈 Profil C** — tout en dents de scie (aucune tendance). **📈 Profil D** — CA : 50 → 48 · Exploitation : 10 → 4 · Net : 6 → 12 (le net monte, le cœur de métier s'effondre). (1 erreur = − 10 000 FCFA.)",
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
