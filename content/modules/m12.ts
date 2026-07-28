import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 12 — Le BOC avancé (1/3) : indices,
   compartiments & secteurs.
   Défi = quiz à 3 questions ; les données du haut du BOC (indices,
   PER sectoriels) sont rendues en vrai tableau (champ `table`,
   cf. revue post-lancement) plutôt que repliées en prose dans
   `challenge.instruction`. Q1/Q2/Q3 ont chacune 3 boutons
   déjà réels dans le .txt (pas de conversion numérique nécessaire) ;
   options par question quand même utilisées, car les 3 paires
   diffèrent d'une question à l'autre (précédent M03/M06/M07).
   Le .txt ne donne pas de 2ᵉ ligne de corps pour le feedback
   « imperfect » (seulement le titre) : un court « Reprenons. » est
   ajouté, dans le ton terse déjà utilisé ailleurs (M06/M07), le
   champ `body` étant requis par le type.
   Barème Phase 3 standard (§4) : +20 000 / −5 000.
   ============================================================= */
export const m12: Module = {
  code: "M12",
  index: 12,
  totalModules: 28,
  title: "Le BOC avancé (1/3) : indices, compartiments & secteurs",
  phase: "Phase 3 · L'Analyse",
  status: { emoji: "🥇", label: "L'Analyste Stratège" },
  reward: 20000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 12",
    headline: "La météo du marché, en un coup d'œil.",
    lead:
      "Avant de choisir une action, un investisseur avisé regarde d'abord le haut du BOC : les **indices**. Ce sont les « notes moyennes » qui résument, en un seul chiffre, comment se porte le marché — ou une famille d'entreprises.",
    card: {
      label: "Le bulletin météo du marché",
      title: "Indices, compartiments, secteurs",
      hint: "3 repères pour situer une action dans son contexte :",
      rules: [
        "**Les indices** — Composite, BRVM 30, Prestige : la « note moyenne » d'un groupe d'entreprises.",
        "**Les compartiments** — Prestige, Principal, Croissance : le classement par taille et solidité.",
        "**Les secteurs** — 7 familles de métiers, chacune avec sa propre norme (PER, rendement…).",
      ],
    },
    objectives: [
      "Comprendre ce que mesure un indice boursier, et lire les niveaux du Composite, du BRVM 30 et du Prestige.",
      "Distinguer les 3 compartiments (Prestige, Principal, Croissance) et les 7 secteurs de la cote.",
      "Se servir de l'indice comme d'un thermomètre du marché et comme d'un bulletin de notes pour votre propre portefeuille.",
    ],
    cta: "Regarder la météo du marché",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "D'abord, regarder la météo",
      blocks: [
        { kind: "text", value: "Avant de choisir une action précise, un investisseur avisé jette un œil au **haut du BOC**. C'est comme un marin : avant de sortir en mer, il regarde d'abord si la mer est calme ou agitée." },
        { kind: "text", value: "Ce « bulletin météo » du marché, ce sont les **indices**. Commençons par comprendre ce que c'est, tout simplement." },
      ],
    },
    {
      title: "Un indice, c'est quoi ? La note moyenne de la classe 🎓",
      blocks: [
        { kind: "text", value: "Imaginez une classe de 47 élèves. Plutôt que de regarder la note de chaque élève une par une, le maître calcule **la moyenne de la classe** : un seul chiffre qui résume comment tout le monde s'en sort." },
        { kind: "text", value: "Un **indice boursier**, c'est exactement ça. Au lieu de suivre les 47 entreprises de la BRVM une par une, on calcule leur **« note moyenne »**. Si cette moyenne monte, c'est que, dans l'ensemble, les entreprises se portent bien." },
        { kind: "text", value: "Le **BRVM Composite**, c'est la note moyenne de **toutes** les entreprises cotées." },
      ],
    },
    {
      title: "Pourquoi l'indice affiche « 478 » ? Le point de départ",
      blocks: [
        { kind: "text", value: "Le jour où l'on crée un indice, on décide de mettre le compteur à **100** — comme le **kilomètre zéro** au départ d'une route." },
        { kind: "text", value: "Aujourd'hui, le Composite affiche **478**. La traduction est toute simple : ce qui valait **100** au départ vaut aujourd'hui **478**. Donc le marché a été **multiplié par presque 5** depuis le début." },
        { kind: "text", value: "Autre image : au départ, un panier contenant un petit morceau de chaque entreprise coûtait **100 FCFA**. Aujourd'hui, le même panier coûte **478 FCFA**." },
        { kind: "callout", tone: "highlight", value: "👉 Mais au quotidien, le chiffre exact compte peu. Ce qu'on regarde, c'est **de combien il a bougé** : **+38,40 % sur l'année**, ça veut dire que « la classe » a gagné 38 % en moyenne cette année." },
      ],
    },
    {
      title: "Trois « moyennes » plutôt qu'une",
      blocks: [
        { kind: "text", value: "La BRVM calcule trois notes moyennes, pour trois groupes différents :" },
        {
          kind: "list",
          items: [
            "**BRVM Composite (478)** — la moyenne de **TOUTE la classe** (toutes les entreprises).",
            "**BRVM 30 (228)** — la moyenne des **30 élèves les plus actifs** (les 30 actions les plus échangées). Un baromètre plus stable, centré sur les grandes entreprises.",
            "**BRVM Prestige (175)** — la moyenne de **l'élite** : les entreprises du compartiment le plus exigeant.",
          ],
        },
        {
          kind: "boctable",
          caption: "Exemple réel de ce qu'on retrouve en haut du BOC",
          columns: ["Indice", "Niveau"],
          rows: [
            ["BRVM Composite", "478"],
            ["BRVM 30", "228"],
            ["BRVM Prestige", "175"],
          ],
        },
      ],
    },
    {
      title: "Compartiments & secteurs : deux façons de ranger",
      blocks: [
        { kind: "text", value: "On range aussi les entreprises comme dans un championnat de foot et un annuaire des métiers :" },
        { kind: "text", value: "Par **compartiment** (comme les divisions d'un championnat) :" },
        {
          kind: "list",
          items: [
            "**Prestige** — la première division : les 12 plus grands « clubs », les plus solides et les plus suivis. Pour débuter, plutôt rassurant.",
            "**Principal** — les 35 « clubs » suivants.",
            "**Croissance** — les jeunes « clubs » qui montent.",
          ],
        },
        { kind: "text", value: "Par **secteur** (comme les familles de métiers), 7 en tout :" },
        {
          kind: "countries",
          items: ["Télécoms", "Services Financiers", "Consommation Discrétionnaire", "Consommation de Base", "Industriels", "Énergie", "Services Publics"],
        },
        { kind: "text", value: "Chaque famille a sa propre note moyenne → vous voyez tout de suite **quel métier a le vent en poupe**." },
      ],
    },
    {
      title: "À quoi ça sert ? Le thermomètre et le bulletin de notes",
      blocks: [
        {
          kind: "list",
          items: [
            "**Le thermomètre** : le marché est-il de bonne humeur aujourd'hui ? S'il baisse en général, pas étonnant que VOS actions baissent aussi — elles suivent souvent le mouvement du groupe.",
            "**Le bulletin de notes (le juge de vos résultats)** : avez-vous fait mieux ou moins bien que « la classe » ? Exemple : vous avez gagné **+25 %** cette année — bravo ! Mais si la moyenne de la classe (le Composite) a fait **+38 %**, vous êtes **en dessous de la moyenne**. Vous auriez gagné plus en achetant simplement « toute la classe » (un fonds qui copie l'indice).",
          ],
        },
      ],
    },
    {
      title: "Le secret des dividendes : l'arbre ET les fruits 🍎",
      blocks: [
        { kind: "text", value: "Le BOC affiche deux versions de l'indice :" },
        {
          kind: "list",
          items: [
            "Le **Composite** (+38,40 %) — il ne compte que la hausse des **prix** : l'arbre qui grandit.",
            "Le **Composite Total Return** (+42,69 %) — il compte **en plus** les **dividendes** : les fruits que vous avez récoltés en chemin.",
          ],
        },
        { kind: "text", value: "L'écart (~4 points) montre qu'à la BRVM, les fruits (dividendes) comptent presque autant que la croissance de l'arbre. Ne les oubliez jamais." },
        {
          kind: "boctable",
          caption: "Ce que dit l'encart ci-dessous, visualisé",
          columns: ["Indicateur", "Valeur"],
          rows: [
            ["BRVM Composite (prix seuls)", "+38,40 %/an"],
            ["BRVM Composite Total Return (prix + dividendes)", "+42,69 %/an"],
            ["PER moyen du marché", "≈ 14"],
            ["Rendement moyen du marché", "≈ 6 %"],
          ],
          highlightCols: [1],
        },
        { kind: "callout", tone: "info", value: "(Tout en bas du BOC, deux repères utiles : le PER moyen ≈ 14 — un indicateur « cher / pas cher » détaillé au **module 20**, avec Graham — et le rendement moyen ~6 %. Le reste, ce sont des outils de pros : ignorez-les pour l'instant.) 👇" },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Lire le tableau de bord",
    instruction: "Observez ce tableau de bord inspiré du BOC et répondez. (1 erreur = − 5 000 FCFA.)",
    table: {
      caption: "Tableau de bord du marché (inspiré du BOC)",
      columns: ["Indicateur", "Valeur"],
      rows: [
        ["BRVM Composite", "+38,40 %/an"],
        ["BRVM Composite Total Return", "+42,69 %/an"],
        ["PER — Consommation de Base", "10,31"],
        ["PER — Services Financiers", "15,61"],
        ["PER — Consommation Discrétionnaire", "38,58"],
      ],
    },
    penaltyPerError: 5000,
    perfectReward: 20000,
    // Recopie des options de Q1 en repli neutre (requis par le type) :
    // chaque question a sa propre paire/triplet de boutons, verbatim
    // depuis le .txt source.
    options: [
      { value: "battu", label: "J'ai battu le marché." },
      { value: "sous", label: "J'ai bien gagné, mais moins que la moyenne de la classe (sous-performance)." },
      { value: "perdu", label: "J'ai perdu de l'argent." },
    ],
    questions: [
      {
        prompt: "Le Composite (la note moyenne de la classe) a fait **+38,40 %** sur l'année. Votre portefeuille : **+25 %**. Conclusion ?",
        answer: "sous",
        options: [
          { value: "battu", label: "J'ai battu le marché." },
          { value: "sous", label: "J'ai bien gagné, mais moins que la moyenne de la classe (sous-performance)." },
          { value: "perdu", label: "J'ai perdu de l'argent." },
        ],
      },
      {
        prompt: "Pourquoi le « Total Return » (+42,69 %) dépasse-t-il le Composite (+38,40 %) ?",
        answer: "dividendes",
        options: [
          { value: "erreur", label: "Une erreur de la BRVM." },
          { value: "dividendes", label: "Il compte aussi les dividendes (les fruits), pas seulement la hausse des prix (l'arbre)." },
          { value: "grandes", label: "Il ne compte que les grandes entreprises." },
        ],
      },
      {
        prompt: "D'après les PER, quel secteur est le plus **cher** ?",
        answer: "conso_discretionnaire",
        options: [
          { value: "conso_base", label: "Conso de Base (10,31)" },
          { value: "services_financiers", label: "Services Financiers (15,61)" },
          { value: "conso_discretionnaire", label: "Conso Discrétionnaire (38,58)" },
        ],
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Vue d'ensemble maîtrisée ! + 20 000 FCFA sur votre portefeuille !",
      body: "Vous lisez le marché entier d'un coup d'œil, et vous savez vous comparer à la moyenne de la classe.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Le tableau de bord mérite un second regard (− 5 000 FCFA par erreur).",
      body: "Reprenons.",
    },
    explanations: [
      {
        verdict: "Sous-performance",
        title: "Le benchmark, votre bulletin de notes.",
        body: "+25 %, c'est bien… mais la classe a fait +38,40 %. Vous êtes donc **sous la moyenne** : suivre toute la classe aurait rapporté plus. On se compare TOUJOURS à l'indice.",
      },
      {
        verdict: "Les dividendes (les fruits)",
        title: "L'arbre ET les fruits.",
        body: "L'écart entre +42,69 % et +38,40 %, ce sont les dividendes (les fruits récoltés). À la BRVM, ils font une grosse part de l'enrichissement.",
      },
      {
        verdict: "Conso Discrétionnaire",
        title: "Chaque famille de métier a sa norme.",
        body: "La Conso Discrétionnaire (PER 38,58) est bien plus chère que les Services Financiers (15,61). On compare toujours une action à **sa famille (son secteur) et à la moyenne du marché (≈ 14)**.",
      },
    ],
  },

  next: {
    label: "Je connais le marché. Zoomons sur UNE ligne d'action.",
    target: "Module 13",
  },
};
