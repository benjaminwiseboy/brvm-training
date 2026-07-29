import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 27 — Simulations finales : le grand oral de
   l'investisseur. Validation transversale de Phase 5, juste avant
   le Boss (M28).
   Barème NON standard (§4 : « Simulations finales (validation) |
   Phase 5 | +40 000 | −10 000 ») : le plus haut de la Phase 5,
   tier « capstone », confirmé par le propre texte du .txt
   (« + 40 000 FCFA » / « − 10 000 FCFA par erreur »).
   Défi à 4 questions, CHACUNE avec son propre jeu de boutons (les
   libellés diffèrent d'une question à l'autre — 3 investisseurs +
   1 question de synthèse) : les options du niveau `challenge`
   reprennent celles de Q1 en repli neutre (requis par le type
   QuizChallenge), comme M24/M12. `feedback.explanations.length` = 4
   = `challenge.questions.length` (1 par investisseur + la leçon
   finale, qui EST la 4ᵉ question du .txt elle-même — pas une entrée
   de clôture synthétique ajoutée en trop : c'est le .txt qui
   structure sa Q4 comme la leçon).
   Le paragraphe de clôture (« Vous maîtrisez toute la chaîne… ») est
   replié dans le `.note` de cette 4ᵉ explication, comme M04/M24.
   ============================================================= */
export const m27: Module = {
  code: "M27",
  index: 27,
  totalModules: 28,
  title: "Simulations finales : le grand oral de l'investisseur",
  phase: "Phase 5 · Suivi & maîtrise",
  status: { emoji: "🎓", label: "L'Analyste Confirmé" },
  reward: 40000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 27",
    headline: "Le grand oral de l'investisseur.",
    lead:
      "Vous avez tout appris : les profils (M05), les stratégies (M06/M07), l'analyse (Phase 3), les produits. Dernière épreuve avant le Boss : **relier le bon placement au bon investisseur.** Il n'existe pas de « bon placement » dans l'absolu — seulement le bon placement pour un profil et un objectif.",
    card: {
      label: "Le grand oral",
      title: "3 investisseurs, 4 placements",
      hint: "Chaque profil a son bon placement :",
      rules: [
        "**Mariam, 62 ans** — veut un revenu régulier et aucune grosse secousse.",
        "**Yao, 28 ans** — vise la croissance maximale, accepte la volatilité.",
        "**Dr Koné, 45 ans** — débordé, veut déléguer entièrement.",
      ],
    },
    objectives: [
      "Relier le bon placement (action, obligation, OPCVM) au profil et à l'objectif de chaque investisseur.",
      "Justifier pourquoi un même placement peut être excellent pour l'un et inadapté pour l'autre.",
      "Mobiliser toute la chaîne Profil → Stratégie → Analyse → Bon produit face à un cas concret.",
    ],
    cta: "Passer le grand oral",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Le bon placement pour la bonne personne",
      blocks: [
        { kind: "text", value: "Vous avez tout appris : les profils (M05), les stratégies (M06/M07), l'analyse (Phase 3), les produits." },
        { kind: "text", value: "Dernière épreuve : **relier le bon placement au bon investisseur.**" },
        { kind: "callout", tone: "info", value: "Rappel : il n'existe pas de « bon placement » dans l'absolu — seulement le bon placement pour un profil et un objectif." },
      ],
    },
    {
      title: "Les 3 investisseurs 👥",
      blocks: [
        {
          kind: "list",
          items: [
            "**Mariam, 62 ans** — bientôt à la retraite : veut un **revenu régulier** et **aucune grosse secousse**.",
            "**Yao, 28 ans** — horizon très long : vise la **croissance maximale**, accepte la volatilité.",
            "**Dr Koné, 45 ans** — médecin débordé : veut **déléguer entièrement**.",
          ],
        },
      ],
    },
    {
      title: "Les 4 placements 🧺",
      blocks: [
        {
          kind: "list",
          items: [
            "**A — Action « Banque Mature »** : PER 9, rendement 6,5 %, gros dividende, croissance modérée.",
            "**B — Action « Tech-Croissance »** : PER 22, aucun dividende, forte expansion.",
            "**C — OPCVM Diversifié** : panier géré par des pros.",
            "**D — Obligation d'État 6,5 %** : coupon fixe, capital garanti à l'échéance.",
          ],
        },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Conseillez trois investisseurs",
    instruction: "Chaque bonne réponse rapporte gros. (1 erreur = − 10 000 FCFA.)",
    penaltyPerError: 10000,
    perfectReward: 40000,
    // Recopie des options de Q1 en repli neutre (requis par le type) :
    // chaque question a sa propre liste de boutons.
    options: [
      { value: "b", label: "B — Tech-Croissance" },
      { value: "d", label: "D — Obligation d'État" },
      { value: "peu_importe", label: "Peu importe." },
    ],
    questions: [
      {
        prompt: "**Q1 — Pour Mariam** (revenu + sécurité, pas de secousses) :",
        answer: "d",
        options: [
          { value: "b", label: "B — Tech-Croissance" },
          { value: "d", label: "D — Obligation d'État" },
          { value: "peu_importe", label: "Peu importe." },
        ],
      },
      {
        prompt: "**Q2 — Pour Yao** (jeune, croissance max, accepte la volatilité) :",
        answer: "b",
        options: [
          { value: "d", label: "D — Obligation" },
          { value: "b", label: "B — Tech-Croissance" },
          { value: "monetaire", label: "Un monétaire sans risque." },
        ],
      },
      {
        prompt: "**Q3 — Pour Dr Koné** (débordé, veut déléguer) :",
        answer: "c",
        options: [
          { value: "seul", label: "Analyser et acheter lui-même 10 actions" },
          { value: "c", label: "C — OPCVM Diversifié" },
          { value: "rien", label: "Ne rien faire." },
        ],
      },
      {
        prompt: "**Q4 — La leçon :** pourquoi le placement B est parfait pour Yao mais mauvais pour Mariam ?",
        answer: "profil",
        options: [
          { value: "absolu", label: "Parce que B est un mauvais placement dans l'absolu." },
          { value: "profil", label: "Parce qu'un placement se juge selon le profil et l'objectif : volatil et sans revenu, B ne convient pas à une retraitée prudente, mais colle au jeune Yao." },
        ],
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Grand oral réussi haut la main ! + 40 000 FCFA sur votre portefeuille !",
      body: "Vous adaptez le placement à la personne, comme un vrai conseiller. Il ne reste qu'à prouver votre sang-froid…",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Un mauvais conseil (− 10 000 FCFA par erreur).",
      body: "La clé : toujours partir du besoin de la personne.",
    },
    explanations: [
      {
        verdict: "D — Obligation d'État",
        title: "Mariam → D",
        body: "Revenu régulier + zéro secousse → l'obligation (coupon fixe, capital garanti). (L'action bancaire A serait un second choix, mais plus volatile.)",
      },
      {
        verdict: "B — Tech-Croissance",
        title: "Yao → B",
        body: "Jeune, horizon long, cherche la performance → une action de croissance. Une obligation le « brimerait ».",
      },
      {
        verdict: "C — OPCVM Diversifié",
        title: "Dr Koné → C",
        body: "Aucun temps → l'OPCVM géré par des pros, sans rien analyser.",
      },
      {
        verdict: "Le profil et l'objectif",
        title: "La leçon",
        body: "B n'est ni bon ni mauvais dans l'absolu. Parfait pour Yao, inadapté pour Mariam. On part toujours du profil et de l'objectif.",
        note: "Vous maîtrisez toute la chaîne : **Profil → Stratégie → Analyse → Bon produit.**",
      },
    ],
  },

  next: {
    label: "Je suis prêt pour l'épreuve finale : le Boss !",
    target: "Module 28",
  },
};
