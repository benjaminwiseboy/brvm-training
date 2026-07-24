import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 12 — Le BOC avancé (3/3) : les colonnes de
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
export const m12: Module = {
  code: "M12",
  index: 12,
  totalModules: 26,
  title: "Le BOC avancé (3/3) : les colonnes de l'analyste",
  phase: "Phase 3 · L'Analyse",
  status: { emoji: "🥇", label: "L'Analyste Stratège" },
  reward: 20000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 12",
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
    cta: "Lire le BOC comme un analyste",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Le BOC vous mâche le travail",
      blocks: [
        { kind: "text", value: "Vous savez lire les prix et les mouvements. Encore mieux : le BOC calcule pour vous certains **indicateurs d'analyste**. Voyons les 3 colonnes qui vous aident vraiment à décider — avec, à chaque fois, une image simple du quotidien." },
      ],
    },
    {
      title: "Le PER : « en combien d'années je récupère ma mise ? »",
      blocks: [
        { kind: "text", value: "**L'image :** imaginez que vous achetez une **boutique**. Elle vous coûte 8 millions et rapporte 1 million de bénéfice par an. En combien d'années votre boutique se rembourse-t-elle ? **8 ans.** Ce chiffre « 8 », c'est le PER." },
        { kind: "text", value: "Pour une action : **PER = Cours ÷ bénéfice par action**. Plus il est **bas**, plus vite vous « récupérez votre mise » — donc moins l'action est chère." },
        { kind: "text", value: "**Exemple réel :** Sonatel a un PER de **7,74** (≈ 8 ans) et Ecobank **3,56** : bon marché ! (La moyenne du marché est ≈ 14.) Une action à PER 30 mettrait 30 ans à se rembourser : beaucoup plus chère." },
      ],
    },
    {
      title: "Le rendement net : le « loyer » de votre action 🏠",
      blocks: [
        { kind: "text", value: "**L'image :** vous achetez un appartement 10 millions, et il vous rapporte 600 000 FCFA de loyer par an. Votre rendement = 600 000 ÷ 10 000 000 = **6 %**." },
        { kind: "text", value: "Pour une action, c'est exactement pareil : **Rendement = dividende ÷ prix**. C'est le « loyer » que l'action vous verse chaque année, en pourcentage de son prix." },
        { kind: "text", value: "**Exemple réel :** Sonatel rapporte **5,44 %** (pour 100 000 FCFA investis, ~5 440 FCFA de dividendes par an) ; BOA CI **6,13 %**. À la BRVM, un bon « loyer » se situe souvent entre **6 et 10 %** — bien mieux qu'un livret d'épargne." },
      ],
    },
    {
      title: "Le dividende & la date de détachement ⚠️",
      blocks: [
        { kind: "text", value: "Le BOC affiche le **dernier dividende versé** et sa date (ex. Sonatel : 1 740 F le 26 mai 2026)." },
        { kind: "callout", tone: "warn", value: "**Le piège à connaître :** vous ne touchez le dividende **que si vous détenez l'action AVANT sa date de détachement**. L'acheter le lendemain, c'est comme arriver au verger **après** la récolte : les fruits sont déjà partis." },
        { kind: "text", value: "La page « Opérations en cours » du BOC annonce les prochains versements (ex. SOLIBRA : 2 127 F le 30/07/2026)." },
        { kind: "callout", tone: "info", value: "💡 Le montant affiché est **net** : l'impôt (IRVM, ~12 %) est déjà prélevé — le cash arrive propre sur votre compte." },
      ],
    },
    {
      title: "La capitalisation : géant ou petite boutique ?",
      blocks: [
        { kind: "text", value: "**En clair :** **capitalisation = prix de l'action × nombre d'actions**. C'est la valeur de toute l'entreprise en bourse — autrement dit, sa **taille**." },
        { kind: "text", value: "**L'image :** c'est la différence entre une **grande chaîne de supermarchés** (grosse capitalisation : solide, facile à acheter et à revendre) et une **petite boutique de quartier** (petite capitalisation : plus fragile, parfois difficile à revendre)." },
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
    instruction:
      "Colonnes d'analyse de Sonatel (données réelles) — PER : 7,74 · Rendement net : 5,44 % · Dernier dividende : 1 740 FCFA (payé le 26 mai 2026). (1 erreur = − 5 000 FCFA.)",
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
    target: "Module 13",
  },
};
