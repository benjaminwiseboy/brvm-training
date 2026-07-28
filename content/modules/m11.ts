import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 11 — Lire le BOC : l'essentiel.
   Première étape de la Phase 3 « L'Analyse ». Défi = quiz à 3
   questions ; le .txt source décrit une interaction « clic sur la
   bonne case du tableau, sinon un QCM » — on prend le repli QCM
   explicitement prévu par la source, avec pour distracteurs les
   AUTRES valeurs de la même colonne du tableau du BOC (mêmes
   3 lignes SNTS/BOAC/CIE pour les 3 questions) → chaque question a
   sa propre paire d'options (mécanisme M03/M06/M07). Le tableau du
   BOC (Section 2 du .txt) est rendu en vrai tableau HTML (kind
   "boctable" côté slide, champ `table` côté défi) — cf. revue
   post-lancement : plus de valeurs repliées en prose.
   Barème Phase 3 standard (§4) : +20 000 / −5 000.
   ============================================================= */
export const m11: Module = {
  code: "M11",
  index: 11,
  totalModules: 28,
  title: "Lire le BOC : l'essentiel",
  phase: "Phase 3 · L'Analyse",
  status: { emoji: "🥇", label: "L'Analyste Stratège" },
  reward: 20000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 11",
    headline: "Le grand tableau d'affichage de la bourse.",
    lead:
      "Le BOC (Bulletin Officiel de la Cote) ressemble à un tableau vertigineux de chiffres. Bonne nouvelle : pour investir sereinement, **3 colonnes suffisent** — le prix, l'affluence, le loyer.",
    card: {
      label: "Vos 3 réflexes de lecture",
      title: "Prix, affluence, loyer",
      hint: "Ignorez les dizaines d'autres colonnes, concentrez-vous sur :",
      rules: [
        "**Le prix (cours de clôture)** — ce que vous paierez si vous achetez demain.",
        "**L'affluence (volume)** — combien de titres s'échangent, pour savoir si vous pourrez revendre.",
        "**Le loyer (dividende)** — combien l'action vous versera, et à quelle date.",
      ],
    },
    objectives: [
      "Reconnaître la structure d'un extrait du BOC, sans paniquer devant le nombre de colonnes.",
      "Repérer les 3 colonnes essentielles pour débuter : le prix, le volume, le dividende.",
      "Lire une ligne réelle du bulletin et en tirer une décision concrète.",
    ],
    cta: "Ouvrir le grand tableau d'affichage",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Le BOC, le grand tableau d'affichage",
      blocks: [
        {
          kind: "text",
          value:
            "Le **BOC** (Bulletin Officiel de la Cote) est le document officiel que la BRVM publie chaque soir de bourse. Voyez-le comme le **grand tableau d'affichage** de la bourse : tout ce qui s'est passé dans la journée y est écrit — les prix, les quantités échangées, les dividendes à venir. C'est là qu'on va chercher l'info avant d'acheter.",
        },
      ],
    },
    {
      title: "Voici à quoi ressemble un extrait du BOC",
      blocks: [
        { kind: "text", value: "Avant d'aller plus loin, regardons un vrai extrait (données fictives, structure réelle) — trois lignes, avec les colonnes qu'on va apprendre à lire ensemble :" },
        {
          kind: "boctable",
          caption: "Extrait du BOC · séance du jour (données fictives, structure réelle)",
          columns: ["Valeur", "Cours clôture", "Volume", "Dividende net", "Date paiement"],
          rows: [
            ["SNTS — SONATEL SÉNÉGAL", "18 500", "45 200", "1 500", "15/05/2026"],
            ["BOAC — BOA CÔTE D'IVOIRE", "6 200", "12 000", "620", "22/04/2026"],
            ["CIE — CIE CÔTE D'IVOIRE", "1 950", "3 500", "250", "10/06/2026"],
          ],
        },
        { kind: "text", value: "Impressionnant ? Gardez cet extrait en tête : dans les slides suivantes, on décortique une colonne à la fois." },
      ],
    },
    {
      title: "Un tableau qui fait peur ? Pas grave",
      blocks: [
        { kind: "text", value: "À première vue, le BOC ressemble à un immense tableau de chiffres, avec des dizaines de colonnes — de quoi donner le vertige." },
        { kind: "text", value: "Rassurez-vous : c'est comme un journal. Personne ne lit toutes les pages ! Pour investir tranquillement, **3 colonnes suffisent**. On les regarde une par une." },
      ],
    },
    {
      title: "Colonne 1 : le prix (le cours de clôture) 💵",
      blocks: [
        { kind: "text", value: "**En clair :** c'est le prix affiché sur « l'étiquette » de l'action à la fermeture — le dernier prix auquel elle s'est vendue dans la journée." },
        { kind: "text", value: "**Pourquoi ça compte :** c'est ce que vous paierez, ou presque, si vous achetez demain." },
        { kind: "text", value: "**Exemple :** BOA Côte d'Ivoire a fini la journée à **6 200 FCFA**. Vous voulez 10 actions ? Prévoyez environ **62 000 FCFA** (avant les frais)." },
      ],
    },
    {
      title: "Colonne 2 : le volume (y a-t-il foule ?) 🔄",
      blocks: [
        { kind: "text", value: "**En clair :** le volume, c'est le nombre d'actions qui ont changé de main dans la journée. Une image simple : c'est **l'affluence du marché**." },
        { kind: "text", value: "**Pourquoi ça compte :** dans un marché **animé** (beaucoup de monde), vous trouvez toujours quelqu'un pour vous vendre une action ou vous racheter la vôtre. Dans un marché **désert**, vous risquez de rester planté : personne pour reprendre vos titres le jour où vous voudrez sortir." },
        { kind: "text", value: "**Exemple :** Sonatel a échangé **45 200 titres** aujourd'hui — la foule des grands jours, vous entrez et sortez quand vous voulez. Une action qui n'échange que 5 titres par jour, elle, est à éviter pour débuter." },
      ],
    },
    {
      title: "Colonne 3 : le dividende (le « loyer » de l'action) 🎁",
      blocks: [
        { kind: "text", value: "**En clair :** le dividende, c'est la part des bénéfices que l'entreprise vous verse en cash. Une image : c'est comme un **loyer** — vous possédez l'action, et elle vous « paie un loyer » chaque année." },
        { kind: "text", value: "**Pourquoi ça compte :** le BOC vous dit **à l'avance** combien vous toucherez, et à quelle date." },
        { kind: "text", value: "**Exemple :** CIE versera **250 FCFA par action** le 10/06/2026. Avec 100 actions, ça fait **25 000 FCFA** de cash — net d'impôt." },
        { kind: "text", value: "(Rappel du M03 : il faut détenir l'action avant sa « date de détachement » pour y avoir droit.)" },
      ],
    },
    {
      title: "À vous de jouer",
      blocks: [
        { kind: "lead", value: "Vous avez les 3 réflexes : **le prix, l'affluence (volume), le loyer (dividende)**." },
        { kind: "text", value: "Place à la chasse au trésor. 👇" },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "La chasse au trésor",
    instruction: "Observez cet extrait du BOC et retrouvez les infos demandées. (1 erreur = − 5 000 FCFA.)",
    table: {
      caption: "Extrait du BOC · séance du jour (données fictives, structure réelle)",
      columns: ["Valeur", "Cours clôture", "Volume", "Dividende net", "Date paiement"],
      rows: [
        ["SNTS — SONATEL SÉNÉGAL", "18 500", "45 200", "1 500", "15/05/2026"],
        ["BOAC — BOA CÔTE D'IVOIRE", "6 200", "12 000", "620", "22/04/2026"],
        ["CIE — CIE CÔTE D'IVOIRE", "1 950", "3 500", "250", "10/06/2026"],
      ],
    },
    penaltyPerError: 5000,
    perfectReward: 20000,
    // Recopie des options de la Mission 1 en repli neutre (requis par le
    // type) : chaque question ci-dessous fournit ses propres distracteurs,
    // tirés des autres valeurs de la même colonne du tableau du BOC.
    options: [
      { value: "18500", label: "18 500" },
      { value: "6200", label: "6 200" },
      { value: "1950", label: "1 950" },
    ],
    questions: [
      {
        prompt: "**Mission 1 — Le prix :** vous voulez acheter BOA Côte d'Ivoire. À quel prix l'action a-t-elle terminé la journée ?",
        answer: "6200",
        options: [
          { value: "18500", label: "18 500" },
          { value: "6200", label: "6 200" },
          { value: "1950", label: "1 950" },
        ],
      },
      {
        prompt: "**Mission 2 — L'affluence :** combien de titres Sonatel ont été échangés dans la journée ?",
        answer: "45200",
        options: [
          { value: "45200", label: "45 200" },
          { value: "12000", label: "12 000" },
          { value: "3500", label: "3 500" },
        ],
      },
      {
        prompt: "**Mission 3 — Le loyer :** quelle entreprise versera exactement 250 FCFA par action ?",
        answer: "CIE",
        options: [
          { value: "SNTS", label: "SNTS — Sonatel Sénégal" },
          { value: "BOAC", label: "BOAC — BOA Côte d'Ivoire" },
          { value: "CIE", label: "CIE — CIE Côte d'Ivoire" },
        ],
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Coup de maître ! + 20 000 FCFA sur votre portefeuille !",
      body: "Vous venez de dompter le document le plus impressionnant de la bourse.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Lecture trop rapide (− 5 000 FCFA par erreur).",
      body: "Un mauvais clic, c'est lire la mauvaise ligne du tableau d'affichage. Reprenons.",
    },
    explanations: [
      {
        verdict: "6 200",
        title: "Le prix",
        body: "BOA a fini à **6 200**, c'est ce que vous paierez à l'achat.",
      },
      {
        verdict: "45 200",
        title: "L'affluence (volume)",
        body: "Sonatel a échangé **45 200** titres : la foule, donc facile à revendre.",
      },
      {
        verdict: "CIE",
        title: "Le loyer (dividende)",
        body: "**CIE** verse 250 FCFA/action : le meilleur repère pour la stratégie de rente.",
        note: "Rassurez-vous : les dizaines d'autres colonnes (limites de fluctuation, PER, capitalisation…) servent surtout aux analystes. On les découvre justement dans les 3 modules suivants, en douceur.",
      },
    ],
  },

  next: {
    label: "Je lis l'essentiel ! Passons à la lecture avancée du BOC.",
    target: "Module 12",
  },
};
