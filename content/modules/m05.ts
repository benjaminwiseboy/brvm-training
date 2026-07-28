import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 05 — Profil de risque.
   Défi = type DIAGNOSTIC (nouveau, ajouté au moteur en 01ecd60) :
   4 questions à 3 options chacune (0/4/8 pts), score max 32,
   mappé à l'une des 4 bandes de profil (Bilan.tsx, branche
   `diagnostic`, qui ignore totalement `feedback`). Conforme au
   barème harmonisé — Phase 2 : « pas de score chiffré » pour ce
   module : ni `reward` au niveau module, ni `perfectReward`/
   `penaltyPerError` au niveau du challenge (DiagnosticChallenge
   n'a d'ailleurs pas ces champs).
   ============================================================= */
export const m05: Module = {
  code: "M05",
  index: 5,
  totalModules: 28,
  title: "Votre profil d'investisseur",
  phase: "Phase 2 · La Boussole",
  status: { emoji: "🥈", label: "L'Investisseur Curieux" },

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 05",
    headline: "Quel type d'investisseur êtes-vous ?",
    lead:
      "Avant de choisir quoi acheter, il faut savoir qui vous êtes : votre horizon, votre capacité et votre tolérance au risque décident du bon plan — **pour vous**, pas pour votre voisin.",
    card: {
      label: "Votre boussole personnelle",
      title: "3 piliers, 1 profil",
      hint: "Le bon investissement dépend de vous, à travers :",
      rules: [
        "**L'horizon** — dans combien de temps aurez-vous besoin de cet argent ?",
        "**La capacité** — combien pouvez-vous investir sans vous mettre en danger ?",
        "**La tolérance au risque** — comment réagissez-vous si votre portefeuille baisse ?",
      ],
    },
    cta: "Faire le test de profilage",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "La mauvaise question",
      blocks: [
        { kind: "lead", value: "Beaucoup de débutants demandent : « Quelle est la meilleure action à acheter ? »" },
        {
          kind: "text",
          value:
            "C'est comme entrer dans un magasin de bricolage et demander le meilleur outil… sans dire si vous voulez construire une table ou réparer une fuite.",
        },
      ],
    },
    {
      title: "Votre Plan d'Investissement Personnel",
      blocks: [
        { kind: "text", value: "Le bon investissement dépend de **vous**, à travers 3 piliers :" },
        {
          kind: "list",
          items: [
            "**L'horizon** — dans combien de temps aurez-vous besoin de cet argent ?",
            "**La capacité** — combien pouvez-vous investir sans vous mettre en danger ?",
            "**La tolérance au risque** — comment réagissez-vous si votre portefeuille baisse ?",
          ],
        },
      ],
    },
    {
      title: "À vous : le test",
      blocks: [
        {
          kind: "text",
          value:
            "Répondez avec **sincérité** au test ci-dessous (le même genre de test que font les conseillers financiers avant de guider un épargnant).",
        },
        { kind: "lead", value: "Il n'y a pas de mauvaise réponse — juste VOTRE réponse. 👇" },
      ],
    },
  ],

  // ---- Section 2 : le défi (diagnostic points-based, pas de quiz) ----
  challenge: {
    type: "diagnostic",
    kicker: "Le Défi",
    title: "Le test de profilage",
    instruction:
      "Répondez avec sincérité : chaque réponse rapporte des points (entre parenthèses), additionnés pour un score sur 32 points.",
    questions: [
      {
        prompt: "Votre objectif principal en investissant ?",
        options: [
          { label: "Préserver mon capital et toucher un revenu, sans risque.", points: 0 },
          { label: "Un rendement correct, avec un risque modéré, pour battre l'inflation.", points: 4 },
          { label: "La croissance maximale à long terme, quitte à subir des secousses.", points: 8 },
        ],
      },
      {
        prompt: "Dans combien de temps retirerez-vous une part importante de cet argent ?",
        options: [
          { label: "Moins de 3 ans.", points: 0 },
          { label: "Entre 4 et 10 ans.", points: 4 },
          { label: "Dans plus de 10 ans.", points: 8 },
        ],
      },
      {
        prompt: "Une crise fait baisser votre portefeuille de 25 % (1 000 000 → 750 000). Que faites-vous ?",
        options: [
          { label: "Je vends tout pour limiter la casse.", points: 0 },
          { label: "Je m'inquiète, mais je conserve en attendant que ça remonte.", points: 4 },
          { label: "J'en profite pour acheter plus : les actions sont en promo !", points: 8 },
        ],
      },
      {
        prompt: "Combien de temps êtes-vous prêt à attendre que vos placements récupèrent ?",
        options: [
          { label: "Moins de 6 mois.", points: 0 },
          { label: "Entre 6 mois et 2 ans.", points: 4 },
          { label: "Plus de 2 ans.", points: 8 },
        ],
      },
    ],
    // Les 4 bandes portent aussi, en fin de `body` (voir note ci-dessous),
    // l'aside « ℹ️ L'astuce » du .txt source (ligne 75) : ce texte s'applique
    // universellement, quel que soit le profil obtenu, et le type
    // DiagnosticChallenge n'a pas de champ dédié à du contenu « toutes
    // bandes confondues ». Décision éditoriale (cf. task-15-brief.md) : le
    // dupliquer dans chacune des 4 bandes plutôt que de le perdre.
    bands: [
      {
        min: 0,
        max: 8,
        emoji: "🛡️",
        label: "PRUDENT",
        body:
          "La sécurité avant tout. Cible : **80 %** obligations/OPCVM obligataires + **20 %** actions très stables (banques, télécoms). **L'astuce :** cette « structure » (le % actions vs obligations) reste la même quel que soit le montant. Que vous investissiez 15 000 ou 500 000 FCFA par mois, les pourcentages ne changent pas.",
      },
      {
        min: 9,
        max: 16,
        emoji: "⚖️",
        label: "ÉQUILIBRÉ",
        body:
          "Le juste milieu. Cible : **50 %** obligations + **50 %** actions réparties sur plusieurs secteurs (ou OPCVM mixtes). **L'astuce :** cette « structure » (le % actions vs obligations) reste la même quel que soit le montant. Que vous investissiez 15 000 ou 500 000 FCFA par mois, les pourcentages ne changent pas.",
      },
      {
        min: 17,
        max: 24,
        emoji: "📈",
        label: "CROISSANCE",
        body:
          "Vous avez le temps (5 ans +) et visez la performance. Cible : **30 %** obligations + **70 %** actions. **L'astuce :** cette « structure » (le % actions vs obligations) reste la même quel que soit le montant. Que vous investissiez 15 000 ou 500 000 FCFA par mois, les pourcentages ne changent pas.",
      },
      {
        min: 25,
        max: 32,
        emoji: "🚀",
        label: "AUDACIEUX",
        body:
          "Très long terme, les krachs sont des opportunités. Cible : **10-20 %** de sécurité + **80-100 %** actions. **L'astuce :** cette « structure » (le % actions vs obligations) reste la même quel que soit le montant. Que vous investissiez 15 000 ou 500 000 FCFA par mois, les pourcentages ne changent pas.",
      },
    ],
  },

  // ---- Section 3 : le feedback — vide à dessein, la branche `diagnostic`
  // de Bilan.tsx affiche `challenge.bands`, jamais `module.feedback`. ----
  feedback: {},

  next: {
    label: "J'ai mon profil ! Passons à ma stratégie.",
    target: "Module 06",
  },
};
