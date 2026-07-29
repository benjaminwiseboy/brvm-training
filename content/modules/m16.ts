import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 16 — Le BOC avancé (2/3) : lire une ligne
   d'action.
   Défi = quiz à 3 questions, boutons déjà réels dans le .txt
   (2 ou 3 options selon la question — Q3 n'a que 2 boutons dans
   la source, conservé tel quel). Ligne réelle d'Ecobank (ETIT,
   17/07/2026), rendue en vrai tableau (champ `table`, cf. revue
   post-lancement) plutôt que repliée en prose.
   Le .txt ne donne pas de 2ᵉ ligne de corps pour le feedback
   « imperfect » (seulement le titre) : un court « Reprenons. » est
   ajouté (même repli que M15), le champ `body` étant requis par
   le type.
   Barème Phase 3 standard (§4) : +20 000 / −5 000.
   ============================================================= */
export const m16: Module = {
  code: "M16",
  index: 16,
  totalModules: 28,
  title: "Le BOC avancé (2/3) : lire une ligne d'action",
  phase: "Phase 4 · L'Analyse",
  status: { emoji: "🥇", label: "L'Analyste Stratège" },
  reward: 20000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 16",
    headline: "Une ligne d'action, plusieurs heures de la journée.",
    lead:
      "Cours précédent, ouverture, clôture, cours de référence… chaque colonne de prix raconte un moment précis de la journée. Et une variation du jour ne dit jamais tout sur le climat de l'année.",
    card: {
      label: "Lire une ligne comme un pro",
      title: "Les prix, le disjoncteur, la météo",
      hint: "3 pièges à éviter sur la ligne d'une action :",
      rules: [
        "**Les colonnes de prix** — précédent, ouverture, clôture : chacune raconte un moment de la journée.",
        "**Le disjoncteur des ± 7,5 %** — la limite de sécurité calculée sur le cours de référence.",
        "**La météo vs le climat** — ne jamais confondre la variation du jour et celle de l'année.",
      ],
    },
    objectives: [
      "Distinguer les colonnes de prix d'une ligne d'action : cours précédent, ouverture, clôture, cours de référence.",
      "Comprendre le rôle du « disjoncteur » des ± 7,5 % et le prix sur lequel il se calcule.",
      "Ne plus confondre la variation du jour et la tendance de l'année avant de juger une action.",
    ],
    cta: "Décoder une vraie ligne d'action",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Zoomons sur une seule action",
      blocks: [
        { kind: "text", value: "Vous savez lire la météo générale du marché (module 15). Descendons maintenant sur **une seule action**. Sa ligne dans le BOC a plusieurs colonnes de prix — pas de panique, chacune raconte simplement **un moment de la journée**. Voici un exemple réel, qu'on décortique colonne par colonne dans les slides suivantes :" },
        {
          kind: "boctable",
          caption: "Ligne réelle d'Ecobank (ETIT) · BOC du 17/07/2026",
          columns: ["Cours précédent", "Ouverture", "Clôture", "Cours de référence", "Var. jour", "Var. année", "Volume", "Valeur"],
          rows: [["73", "68", "68", "68", "−6,85 %", "+195,65 %", "1 662 045", "113 073 294 FCFA"]],
        },
      ],
    },
    {
      title: "Les prix, comme les heures d'une journée",
      blocks: [
        { kind: "text", value: "Imaginez une journée au marché :" },
        {
          kind: "list",
          items: [
            "**Cours précédent** — le prix d'**hier** soir. C'est le point de comparaison : a-t-on monté ou baissé depuis ?",
            "**Ouverture** — le prix à **l'ouverture des portes** ce matin. Il donne l'ambiance de début de journée.",
            "**Clôture** — le prix à **la fermeture**, le soir. C'est LE prix qui vous intéresse : votre ordre de demain se fera à peu près à ce niveau.",
          ],
        },
      ],
    },
    {
      title: "Le cours de référence & le « disjoncteur » des ± 7,5 %",
      blocks: [
        { kind: "text", value: "**En clair :** le cours de référence est le prix « de base » que la BRVM fixe pour le lendemain (souvent égal à la clôture)." },
        { kind: "text", value: "**À quoi il sert :** à poser une **limite de sécurité**. En une seule journée, une action ne peut ni monter ni baisser de plus de **± 7,5 %** par rapport à ce prix de base." },
        { kind: "text", value: "**L'image :** c'est un **disjoncteur électrique**. Quand le courant s'affole, le disjoncteur saute pour éviter l'incendie. Ici, si une action s'emballe, la règle des 7,5 % « coupe le courant » pour la journée, le temps que tout le monde se calme. Impossible, donc, qu'une simple rumeur fasse chuter votre action de 40 % en un jour." },
        { kind: "callout", tone: "highlight", value: "**Une spécificité de la BRVM, et une vraie sécurité pour vous :** contrairement à d'autres marchés (actions américaines sans limite, cryptomonnaies…) où un titre peut perdre 50 %, 90 % voire tomber à zéro en une seule séance, **ce disjoncteur rend ça impossible ici**. Vous ne pouvez jamais perdre tout votre argent d'un coup sur une action à la BRVM : au pire, − 7,5 % par jour, jamais plus." },
      ],
    },
    {
      title: "Le piège n°1 : la météo du jour vs le climat de l'année ⚠️",
      blocks: [
        { kind: "text", value: "Le BOC donne DEUX variations : celle **du jour** et celle **de l'année**. Ne les confondez jamais — c'est la différence entre **la météo d'aujourd'hui** et **le climat de l'année**." },
        { kind: "text", value: "Exemple réel — Ecobank (ETIT), le 17/07/2026 :" },
        {
          kind: "boctable",
          caption: "Ecobank (ETIT) · deux lectures de la même action",
          columns: ["Période", "Variation"],
          rows: [
            ["Aujourd'hui (la météo)", "−6,85 %"],
            ["Sur l'année (le climat)", "+195,65 % 🚀"],
          ],
        },
        { kind: "text", value: "Une journée de pluie… mais l'action a presque **triplé** sur l'année !" },
        { kind: "callout", tone: "warn", value: "Le débutant voit la pluie du jour et prend peur. L'investisseur avisé sait qu'une journée de pluie ne change rien à un climat magnifique. **On juge une action sur son climat, pas sur la météo d'un jour.**" },
      ],
    },
    {
      title: "Le volume : y a-t-il foule ? (rappel)",
      blocks: [
        { kind: "text", value: "Comme au **module 14**, le **volume** = le nombre de titres échangés dans la journée = **l'affluence** du marché. Plus il y a de monde, plus c'est facile d'acheter ou de revendre sans faire bouger le prix." },
        { kind: "text", value: "**Exemple :** ce jour-là, ETIT a échangé une cohue de titres, contre beaucoup moins pour Sonatel. La colonne Valeur mesure la même affluence, mais en argent :" },
        {
          kind: "boctable",
          caption: "BOC du 17/07/2026 · affluence de deux actions",
          columns: ["Titre", "Volume (titres)", "Valeur échangée"],
          rows: [
            ["ETIT — Ecobank Trans. Incorp. TG", "1 662 045", "113 073 294 FCFA"],
            ["SNTS — Sonatel SN", "1 944", "62 480 935 FCFA"],
          ],
        },
      ],
    },
    {
      title: "À vous de lire une vraie ligne 👇",
      blocks: [
        { kind: "lead", value: "À vous de lire une vraie ligne. 👇" },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Décoder les mouvements",
    instruction: "Voici une vraie ligne d'action, telle qu'elle apparaît dans le BOC. Observez-la et répondez. (1 erreur = − 5 000 FCFA.)",
    table: {
      caption: "Ligne réelle d'Ecobank (ETIT) · BOC du 17/07/2026",
      columns: ["Cours précédent", "Ouverture", "Clôture", "Cours de référence", "Var. jour", "Var. année", "Volume", "Valeur"],
      rows: [["73", "68", "68", "68", "−6,85 %", "+195,65 %", "1 662 045", "113 073 294 FCFA"]],
      highlightCols: [4, 5],
    },
    penaltyPerError: 5000,
    perfectReward: 20000,
    // Recopie des options de Q1 en repli neutre (requis par le type) :
    // chaque question a sa propre paire/triplet de boutons, verbatim
    // depuis le .txt source (Q3 n'a que 2 boutons dans la source).
    options: [
      { value: "raison", label: "Il a raison, l'action s'effondre." },
      { value: "meteo", label: "Ce n'est que la météo du jour ; sur l'année (le climat), l'action fait +195,65 %. Pas de panique." },
      { value: "impossible", label: "Impossible à dire." },
    ],
    questions: [
      {
        prompt: "Votre beau-frère voit « −6,85 % », panique et veut tout vendre. La bonne lecture ?",
        answer: "meteo",
        options: [
          { value: "raison", label: "Il a raison, l'action s'effondre." },
          { value: "meteo", label: "Ce n'est que la météo du jour ; sur l'année (le climat), l'action fait +195,65 %. Pas de panique." },
          { value: "impossible", label: "Impossible à dire." },
        ],
      },
      {
        prompt: "Quel prix sert de base au « disjoncteur » des ± 7,5 % de la prochaine séance ?",
        answer: "reference",
        options: [
          { value: "ouverture", label: "L'ouverture" },
          { value: "reference", label: "Le cours de référence" },
          { value: "precedent", label: "Le cours précédent" },
        ],
      },
      {
        prompt: "Avec 1 662 045 titres échangés, que peut-on dire d'ETIT ce jour-là ?",
        answer: "liquide",
        options: [
          { value: "peu", label: "Peu échangée, difficile à revendre." },
          { value: "liquide", label: "Très liquide (grosse affluence) : facile à acheter ou revendre." },
        ],
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Lecture chirurgicale ! + 20 000 FCFA sur votre portefeuille !",
      body: "Ni les colonnes de prix, ni le rouge d'une seule journée ne vous piègent plus.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Un prix vous a échappé (− 5 000 FCFA par erreur).",
      body: "Reprenons.",
    },
    explanations: [
      {
        verdict: "La météo du jour vs le climat",
        title: "La météo vs le climat.",
        body: "Une baisse de −6,85 % en un jour, c'est une averse : ça ne dit **rien** sur la solidité de l'entreprise. Sur l'année, ETIT a fait **+195,65 %**. On regarde toujours le **climat** (la tendance longue), pas la pluie d'un jour.",
      },
      {
        verdict: "Le cours de référence",
        title: "Le disjoncteur.",
        body: "La limite des ± 7,5 % se calcule à partir du **cours de référence** : c'est le garde-fou anti-panique de la BRVM.",
      },
      {
        verdict: "Très liquide",
        title: "L'affluence.",
        body: "Beaucoup de titres échangés = marché animé = on entre et on sort facilement. Un volume minuscule est un signal de prudence.",
      },
    ],
  },

  next: {
    label: "Je sais lire les mouvements. Passons aux colonnes de l'analyste.",
    target: "Module 17",
  },
};
