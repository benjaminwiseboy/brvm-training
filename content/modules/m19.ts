import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 19 — Graham (3/4) : les perspectives
   (top-down & bottom-up).
   Barème NON standard (§4 : « Graham 2 Perspectives | 3 | +25 000 |
   −5 000 »).
   RESTRUCTURATION DE L'EXPLICATION (wrinkle documentée dans le brief
   de cette tâche) : le Défi a 4 questions (les 3 mini-questions
   numérotées de la Partie A + la question de la Partie B), mais la
   source ne fournit que 2 paragraphes d'explication : un paragraphe
   « Top-Down » qui couvre les 3 événements de la Partie A (séparés
   par des flèches « → »), et un paragraphe « Bottom-Up » pour la
   Partie B. Le paragraphe Top-Down est éclaté en 3 explanations
   distinctes (une par événement numéroté, chacune reprenant
   verbatim sa propre clause) ; le paragraphe Bottom-Up devient la
   4ᵉ explanation.
   Revue post-lancement : Partie A illustrée en tableau, Partie B en
   `scenario` (plus de prose recopiée dans `instruction`) ; Partie C
   ajoutée — 2 questions de classification top-down/bottom-up (5ᵉ et
   6ᵉ questions), avec leurs 2 explanations. La nuance finale
   *(« personne ne prédit l'avenir à 100 %... »)* est repliée dans le
   `.note` de la 6ᵉ (dernière) explanation. `feedback.explanations.
   length` = 6 = questions.length.
   ============================================================= */
export const m19: Module = {
  code: "M19",
  index: 19,
  totalModules: 28,
  title: "Graham (3/4) : les perspectives (top-down & bottom-up)",
  phase: "Phase 3 · L'Analyse",
  status: { emoji: "🥇", label: "L'Analyste Stratège" },
  reward: 25000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 19",
    headline: "Deux paires de lunettes pour juger l'avenir.",
    lead:
      "Le compte de résultat, c'est le passé. En achetant une action, vous achetez son futur. Pour le juger, on chausse deux paires de lunettes complémentaires : la vue de l'**aigle** (top-down) et la vue de la **fourmi** (bottom-up).",
    card: {
      label: "Les deux lunettes de l'analyste",
      title: "Top-down (l'aigle) & bottom-up (la fourmi)",
      hint: "Deux angles complémentaires pour juger l'avenir :",
      rules: [
        "**Top-down 🦅** — de l'économie régionale au secteur, puis à l'entreprise : vents porteurs ou contraires ?",
        "**Bottom-up 🐜** — l'entreprise de près : possède-t-elle un « fossé » durable face à ses concurrents ?",
        "**La combinaison gagnante** — solide + secteur porteur + fossé protégé.",
      ],
    },
    objectives: [
      "Repérer les vents porteurs et contraires d'un secteur avec la vue de l'aigle (top-down).",
      "Identifier le « fossé » qui protège durablement une entreprise de ses concurrents, avec la vue de la fourmi (bottom-up).",
      "Combiner performance, secteur porteur et fossé pour juger si l'avenir d'une entreprise est bien orienté.",
    ],
    cta: "Chausser les deux paires de lunettes",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "On conduit en regardant la route",
      blocks: [
        { kind: "text", value: "Le compte de résultat, c'est le **passé** de l'entreprise. Or, en achetant une action, vous achetez son **futur**. Une entreprise magnifique hier peut être menacée demain." },
        { kind: "text", value: "Pour juger l'avenir, on chausse **deux paires de lunettes** complémentaires." },
      ],
    },
    {
      title: "Lunettes Top-Down : la vue de l'aigle 🦅",
      blocks: [
        { kind: "text", value: "Comme un aigle qui plane haut dans le ciel puis fond vers sa proie, on part du grand tableau et on descend, étape par étape :" },
        {
          kind: "list",
          items: [
            "**L'économie de l'UEMOA** — la croissance, l'inflation et les taux de la BCEAO (la Banque Centrale des États de l'Afrique de l'Ouest, la banque centrale de la région) donnent le climat général.",
            "**Les matières premières** (cacao, coton, or, pétrole) — elles font vivre une grande partie des entreprises de la région ; leur cours mondial pèse lourd.",
            "**Le secteur** — lequel profite (ou souffre) du contexte ? (7 secteurs BRVM : Télécoms, Services Financiers, Consommation Discrétionnaire, Consommation de Base, Industriels, Énergie, Services Publics.)",
            "**Enfin l'entreprise elle-même.**",
          ],
        },
        { kind: "text", value: "Objectif : repérer les **vents porteurs** (un secteur en plein essor) et les **vents contraires** (un secteur menacé)." },
      ],
    },
    {
      title: "Lunettes Bottom-Up : la vue de la fourmi 🐜",
      blocks: [
        { kind: "text", value: "À l'inverse, comme une fourmi au ras du sol, on regarde l'entreprise de tout près, sans se soucier du contexte. La question clé : **possède-t-elle un « fossé » ?**" },
        { kind: "text", value: "Un fossé, c'est un avantage **durable** qui la protège de ses concurrents, comme les douves d'un château. Par exemple :" },
        {
          kind: "list",
          items: [
            "une **position dominante** (une grosse part de marché),",
            "un **réseau difficile à copier** (les antennes d'un opérateur télécom, le maillage d'agences d'une banque),",
            "une **marque forte** à laquelle les clients sont fidèles, ou des **coûts plus bas** que tous ses rivaux.",
          ],
        },
      ],
    },
    {
      title: "Pourquoi le fossé est vital",
      blocks: [
        { kind: "text", value: "Une entreprise **sans fossé** se fait grignoter ses bénéfices dès qu'un concurrent agressif arrive et casse les prix." },
        { kind: "text", value: "Une entreprise **avec un fossé** peut protéger ses marges et ses dividendes dans la durée. C'est ce qui distingue une belle entreprise passagère d'une belle entreprise qui **dure**." },
      ],
    },
    {
      title: "La combinaison gagnante",
      blocks: [
        { kind: "text", value: "L'idéal réunit les trois : une entreprise **solide** (performance ✓) + dans un secteur **porteur** (top-down ✓) + protégée par un **fossé** (bottom-up ✓)." },
        { kind: "text", value: "À l'inverse, un beau bilan dans un secteur en déclin, ou sans avantage concurrentiel, reste un pari risqué." },
      ],
    },
    {
      title: "Où trouver les perspectives ? 📍",
      blocks: [
        { kind: "text", value: "Contrairement aux chiffres du passé (dans le rapport annuel), les perspectives se cherchent à plusieurs endroits :" },
        {
          kind: "list",
          items: [
            "le **rapport d'activité** de l'entreprise (souvent une section « Perspectives » ou « Stratégie »),",
            "les **médias financiers** : **Sika Finance**, Financial Afrik, la presse économique,",
            "pour le top-down : les publications de la **BCEAO** et les cours des matières premières,",
            "les communiqués et l'espace actualités de brvm.org.",
          ],
        },
        { kind: "callout", tone: "highlight", value: "📬 **Notre recommandation : la newsletter Cauri News.** Chaque édition décrypte l'actualité économique et boursière de l'UEMOA — exactement le type de signaux (vents porteurs, vents contraires, mouvements sectoriels) qui nourrissent votre lecture top-down. Un réflexe simple à prendre : quelques minutes de lecture pour garder une longueur d'avance. 👇" },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "La double vision de l'analyste",
    instruction:
      "3 parties, 6 affirmations au total :\n" +
      "**Partie A** (questions 1 à 3) — pour chaque événement du tableau ci-dessous, est-ce un vent porteur ou contraire ?\n" +
      "**Partie B** (question 4) — lequel des 2 opérateurs de l'encart ci-dessous a le « fossé » le plus solide ?\n" +
      "**Partie C** (questions 5 et 6) — en regardant ce que vous venez de faire en A et B, quelle paire de lunettes avez-vous utilisée ?\n" +
      "(1 erreur = − 5 000 FCFA.)",
    table: {
      caption: "Partie A · trois événements macro",
      columns: ["Événement", "Secteur touché"],
      rows: [
        ["Le cacao chute de 30 %", "Exportateurs de cacao"],
        ["Le mobile money explose dans l'UEMOA", "Banques & télécoms"],
        ["Le carburant s'envole durablement", "Transport routier"],
      ],
    },
    scenario: "Partie B — Deux opérateurs télécoms. **Télé-Réseau** : 65 % de part de marché, réseau d'antennes bâti sur 20 ans, marque connue. **NouvelOp** : 5 % de part, loue le réseau des autres, casse les prix.",
    penaltyPerError: 5000,
    perfectReward: 25000,
    // Recopie des options de la Partie A en repli neutre (requis par le
    // type) : Q4/Q5/Q6 ont chacune leur propre paire de boutons.
    options: [
      { value: "porteur", label: "Porteur" },
      { value: "contraire", label: "Contraire" },
    ],
    questions: [
      {
        prompt: "**Partie A · 1 sur 3.** Regardez le tableau ci-dessus. « Le cacao chute de 30 % » → pour un **exportateur de cacao**, c'est un vent :",
        answer: "contraire",
        options: [
          { value: "porteur", label: "Porteur" },
          { value: "contraire", label: "Contraire" },
        ],
      },
      {
        prompt: "**Partie A · 2 sur 3.** « Le mobile money explose dans l'UEMOA » → pour **banques & télécoms**, c'est un vent :",
        answer: "porteur",
        options: [
          { value: "porteur", label: "Porteur" },
          { value: "contraire", label: "Contraire" },
        ],
      },
      {
        prompt: "**Partie A · 3 sur 3.** « Le carburant s'envole durablement » → pour le **transport routier**, c'est un vent :",
        answer: "contraire",
        options: [
          { value: "porteur", label: "Porteur" },
          { value: "contraire", label: "Contraire" },
        ],
      },
      {
        prompt: "**Partie B.** Regardez l'encart « Scénario » ci-dessus. Entre Télé-Réseau et NouvelOp, lequel a le « fossé » le plus solide ?",
        answer: "tele_reseau",
        options: [
          { value: "tele_reseau", label: "Télé-Réseau" },
          { value: "nouvelop", label: "NouvelOp" },
        ],
      },
      {
        prompt: "**Partie C · 1 sur 2.** Dans la Partie A, pour juger le cacao, le mobile money et le carburant, vous êtes parti de l'économie régionale pour descendre vers le secteur. Quelle paire de lunettes est-ce ?",
        answer: "top_down",
        options: [
          { value: "top_down", label: "Top-down (l'aigle)" },
          { value: "bottom_up", label: "Bottom-up (la fourmi)" },
        ],
      },
      {
        prompt: "**Partie C · 2 sur 2.** Dans la Partie B, pour comparer Télé-Réseau et NouvelOp, vous avez regardé directement leur part de marché et leur réseau, sans vous soucier du contexte régional. Quelle paire de lunettes est-ce ?",
        answer: "bottom_up",
        options: [
          { value: "top_down", label: "Top-down (l'aigle)" },
          { value: "bottom_up", label: "Bottom-up (la fourmi)" },
        ],
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Vision panoramique ! + 25 000 FCFA sur votre portefeuille !",
      body: "Vous voyez la forêt (le contexte) ET l'arbre (l'entreprise).",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Angle mort dans votre analyse (− 5 000 FCFA par erreur).",
      body: "Reprenons les deux lunettes de l'analyste.",
    },
    explanations: [
      {
        verdict: "Contraire",
        title: "Cacao −30 % : un vent contraire",
        body: "Cacao −30 % → l'exportateur vend au même volume mais à prix cassé → **contraire**.",
      },
      {
        verdict: "Porteur",
        title: "Mobile money : un vent porteur structurel",
        body: "Mobile money → plus de clients et de commissions → **porteur** structurel.",
      },
      {
        verdict: "Contraire",
        title: "Carburant en hausse : un vent contraire pour le transport",
        body: "Carburant en hausse → coût du transport qui explose → **contraire**.",
      },
      {
        verdict: "Télé-Réseau",
        title: "Le fossé de Télé-Réseau",
        body: "**Télé-Réseau** a un vrai fossé (65 % de marché **et** un réseau que personne ne copie en un jour). NouvelOp n'a qu'une arme, casser les prix, ce qui détruit ses propres marges.",
      },
      {
        verdict: "Top-down",
        title: "La Partie A, c'était du top-down",
        body: "Économie régionale → secteur → entreprise : c'est la vue de **l'aigle**, qui part du contexte pour descendre vers le titre précis. C'est exactement ce que vous avez fait pour juger le cacao, le mobile money et le carburant.",
      },
      {
        verdict: "Bottom-up",
        title: "La Partie B, c'était du bottom-up",
        body: "Part de marché, réseau, avantage concurrentiel : c'est la vue de **la fourmi**, qui étudie l'entreprise de près, sans se soucier du contexte macro. C'est exactement ce que vous avez fait pour comparer Télé-Réseau et NouvelOp.",
        note: "Nuance : personne ne prédit l'avenir à 100 %. On met les probabilités de son côté.",
      },
    ],
  },

  next: {
    label: "Bonne entreprise, bel avenir… reste LA question : à quel prix ?",
    target: "Module 20",
  },
};
