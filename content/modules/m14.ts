import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 14 — Le BOC avancé (3/3) : les colonnes de
   l'analyste.
   Défi = quiz à 3 questions. Q1 (3 boutons) et Q2 (2 boutons)
   reprennent verbatim les boutons déjà réels du .txt. Q3 était un
   [Champ de saisie] libre (« ____ % ») dans la source : converti
   en QCM avec des distracteurs d'ordre de grandeur plausibles
   (0,6 % / 6 % / 60 %), même logique que la conversion numérique
   de M03 (Task 14) — décision explicite du brief de cette tâche.
   Formules entre backticks du .txt (`PER = …`, `Rendement = …`,
   `capitalisation = …`) converties en **gras** dans le texte des
   slides, comme dans m08.ts (`CMP = …`).
   Barème Phase 3 standard (§4) : +20 000 / −5 000.
   ============================================================= */
export const m14: Module = {
  code: "M14",
  index: 14,
  totalModules: 28,
  title: "Le BOC avancé (3/3) : les colonnes de l'analyste",
  phase: "Phase 3 · L'Analyse",
  status: { emoji: "🥇", label: "L'Analyste Stratège" },
  reward: 20000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 14",
    headline: "Le BOC calcule déjà l'analyse pour vous.",
    lead:
      "PER, rendement net, dividende, capitalisation : ces colonnes ont l'air techniques, mais chacune se lit avec une image du quotidien — une boutique, un loyer, un verger, un supermarché.",
    card: {
      label: "Les 3 colonnes de l'analyste",
      title: "PER, rendement, capitalisation",
      hint: "3 indicateurs déjà calculés pour vous, à lire simplement :",
      rules: [
        "**Le PER** — en combien d'années votre « boutique » se rembourse.",
        "**Le rendement net** — le « loyer » que l'action vous verse chaque année.",
        "**La capitalisation** — la taille de l'entreprise : géant ou petite boutique ?",
      ],
    },
    objectives: [
      "Calculer et interpréter le PER : plus il est bas, plus vite vous récupérez votre mise.",
      "Lire le rendement net comme le « loyer » annuel d'une action, et repérer la date de détachement du dividende.",
      "Comprendre ce que mesure la capitalisation boursière et pourquoi elle indique la taille d'une entreprise.",
    ],
    cta: "Lire le BOC comme un analyste",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Le BOC vous mâche le travail",
      blocks: [
        { kind: "text", value: "Vous savez lire les prix et les mouvements. Encore mieux : le BOC calcule pour vous certains **indicateurs d'analyste**. Voyons les 3 colonnes qui vous aident vraiment à décider — avec, à chaque fois, une image simple du quotidien. Voici un exemple réel, qu'on décortique colonne par colonne :" },
        {
          kind: "boctable",
          caption: "Colonnes d'analyse de Sonatel (données réelles)",
          columns: ["PER", "Rendement net", "Dernier dividende", "Date de paiement"],
          rows: [["7,74", "5,44 %", "1 740 FCFA", "26/05/2026"]],
        },
      ],
    },
    {
      title: "Le PER : « en combien d'années je récupère ma mise ? »",
      blocks: [
        { kind: "text", value: "**L'image :** imaginez que vous achetez une **boutique**. Elle vous coûte 8 millions et rapporte 1 million de bénéfice par an. En combien d'années votre boutique se rembourse-t-elle ? **8 ans.** Ce chiffre « 8 », c'est le PER." },
        { kind: "text", value: "Pour une action, la formule est la même idée :" },
        { kind: "formula", label: "PER", value: "Cours ÷ Bénéfice par action" },
        { kind: "text", value: "Plus il est **bas**, plus vite vous « récupérez votre mise » — donc moins l'action est chère." },
        { kind: "text", value: "**Exemple réel :**" },
        {
          kind: "boctable",
          caption: "PER · plus c'est bas, moins c'est cher",
          columns: ["Action", "PER", "Lecture"],
          rows: [
            ["Sonatel", "7,74", "≈ 8 ans pour se rembourser"],
            ["Ecobank", "3,56", "Bon marché"],
            ["Moyenne du marché", "≈ 14", "Repère"],
          ],
          highlightCols: [1],
        },
        { kind: "text", value: "Une action à PER 30 mettrait 30 ans à se rembourser : beaucoup plus chère." },
      ],
    },
    {
      title: "Le rendement net : le « loyer » de votre action 🏠",
      blocks: [
        { kind: "text", value: "**L'image :** vous achetez un appartement 10 millions, et il vous rapporte 600 000 FCFA de loyer par an. Votre rendement = 600 000 ÷ 10 000 000 = **6 %**." },
        { kind: "text", value: "Pour une action, c'est exactement pareil :" },
        { kind: "formula", label: "Rendement net", value: "Dividende ÷ Cours" },
        { kind: "text", value: "C'est le « loyer » que l'action vous verse chaque année, en pourcentage de son prix." },
        { kind: "text", value: "**Exemple réel :**" },
        {
          kind: "boctable",
          caption: "Rendement net · le « loyer » annuel de l'action",
          columns: ["Action", "Rendement net"],
          rows: [
            ["Sonatel", "5,44 %"],
            ["BOA Côte d'Ivoire", "6,13 %"],
          ],
          highlightCols: [1],
        },
        { kind: "text", value: "À la BRVM, un bon « loyer » se situe souvent entre **6 et 10 %** — bien mieux qu'un livret d'épargne." },
      ],
    },
    {
      title: "Le dividende & la date de détachement ⚠️",
      blocks: [
        { kind: "text", value: "Le BOC affiche le **dernier dividende versé** et sa date, et une page « Opérations en cours » annonce les prochains versements :" },
        {
          kind: "boctable",
          caption: "Extrait du BOC · dividendes",
          columns: ["Émetteur", "Dividende net", "Date", "Statut"],
          rows: [
            ["Sonatel", "1 740 FCFA", "26/05/2026", "Déjà versé"],
            ["Solibra", "2 127 FCFA", "30/07/2026", "À venir"],
            ["CIE Côte d'Ivoire", "234 FCFA", "28/07/2026", "À venir"],
          ],
        },
        { kind: "callout", tone: "warn", value: "**Le piège à connaître :** vous ne touchez le dividende **que si vous détenez l'action AVANT sa date de détachement**. L'acheter le lendemain, c'est comme arriver au verger **après** la récolte : les fruits sont déjà partis." },
        { kind: "callout", tone: "info", value: "💡 Le montant affiché est **net** : l'impôt (IRVM, ~12 %) est déjà prélevé — le cash arrive propre sur votre compte." },
      ],
    },
    {
      title: "La capitalisation : géant ou petite boutique ?",
      blocks: [
        { kind: "text", value: "**En clair :** c'est la valeur de toute l'entreprise en bourse — autrement dit, sa **taille**." },
        { kind: "formula", label: "Capitalisation boursière", value: "Cours de l'action × Nombre d'actions" },
        { kind: "text", value: "**L'image :** c'est la différence entre une **grande chaîne de supermarchés** (grosse capitalisation : solide, facile à acheter et à revendre) et une **petite boutique de quartier** (petite capitalisation : plus fragile, parfois difficile à revendre)." },
        { kind: "text", value: "**Exemple (chiffres fictifs) :**" },
        {
          kind: "boctable",
          caption: "Capitalisation · un exemple",
          columns: ["Élément", "Valeur"],
          rows: [
            ["Cours de l'action", "10 000 FCFA"],
            ["Nombre d'actions en circulation", "1 000 000"],
            ["Capitalisation boursière", "10 000 000 000 FCFA"],
          ],
          highlightCols: [1],
        },
        { kind: "text", value: "**À noter :** le BOC affiche surtout la capitalisation **de tout le marché** (18 434 milliards de FCFA au 17/07/2026) ; pour une société précise, vous la calculez vous-même." },
      ],
    },
    {
      title: "À vous de lire l'analyste 👇",
      blocks: [
        { kind: "lead", value: "À vous de lire l'analyste. 👇" },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Lire comme un analyste",
    instruction: "Voici les colonnes d'analyse d'une vraie ligne du BOC. Observez-les et répondez. (1 erreur = − 5 000 FCFA.)",
    table: {
      caption: "Colonnes d'analyse de Sonatel (données réelles)",
      columns: ["PER", "Rendement net", "Dernier dividende", "Date de paiement"],
      rows: [["7,74", "5,44 %", "1 740 FCFA", "26/05/2026"]],
    },
    penaltyPerError: 5000,
    perfectReward: 20000,
    // Recopie des options de Q1 en repli neutre (requis par le type) :
    // chaque question a sa propre paire/triplet de boutons.
    options: [
      { value: "chere", label: "Chère." },
      { value: "bon_marche", label: "Bon marché : on récupère sa mise deux fois plus vite que la moyenne." },
      { value: "impossible", label: "Impossible à dire." },
    ],
    questions: [
      {
        prompt: "Le PER moyen du marché est ≈ 14 (≈ 14 ans pour récupérer sa mise). Avec un PER de **7,74**, Sonatel est plutôt… ?",
        answer: "bon_marche",
        options: [
          { value: "chere", label: "Chère." },
          { value: "bon_marche", label: "Bon marché : on récupère sa mise deux fois plus vite que la moyenne." },
          { value: "impossible", label: "Impossible à dire." },
        ],
      },
      {
        prompt: "Une action détache son dividende demain. Vous l'achetez **après-demain**. Touchez-vous ce dividende ?",
        answer: "non",
        options: [
          { value: "oui", label: "Oui, dès que je possède l'action." },
          { value: "non", label: "Non : je suis arrivé après la récolte (il fallait la détenir avant le détachement)." },
        ],
      },
      {
        prompt: "Une action cote **10 000 FCFA** et verse **600 FCFA** net. Quel est son « loyer » (rendement net) ?",
        answer: "6",
        options: [
          { value: "0.6", label: "0,6 %" },
          { value: "6", label: "6 %" },
          { value: "60", label: "60 %" },
        ],
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Vous lisez le BOC comme un pro ! + 20 000 FCFA sur votre portefeuille !",
      body: "Prix, « loyer », dividende, détachement : plus aucune colonne ne vous résiste.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Une colonne vous a échappé (− 5 000 FCFA par erreur).",
      body: "Reprenons.",
    },
    explanations: [
      {
        verdict: "Bon marché",
        title: "Le PER, c'est le nombre d'années pour se rembourser.",
        body: "7,74 face à ≈ 14, c'est **deux fois plus rapide** que la moyenne : Sonatel est bon marché (à condition que les fondamentaux suivent — on le verra avec Graham).",
      },
      {
        verdict: "Non (arrivé après la récolte)",
        title: "La récolte du dividende.",
        body: "Le dividende revient à celui qui détient l'action **la veille** du détachement. Acheter juste après = arriver après la récolte, pas de fruits cette année.",
      },
      {
        verdict: "6 % (600 ÷ 10 000 × 100)",
        title: "Le « loyer » est un simple pourcentage.",
        body: "**600 ÷ 10 000 × 100 = 6 %.** C'est ce que l'action vous rapporte chaque année, comme un loyer.",
      },
    ],
  },

  next: {
    label: "Je maîtrise tout le BOC ! Approfondissons un produit clé : les obligations.",
    target: "Module 15",
  },
};
