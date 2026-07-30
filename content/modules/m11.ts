import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 11 — Ouvrir son compte SGI (et comprendre
   les frais). Première étape de la Phase 3 « Passage à l'action ».
   Revue post-lancement : ce bloc (ex-Phase 4, M22-M24) est désormais
   placé juste après la Phase 2 (Boussole) plutôt qu'après la Phase
   3/4 « L'Analyse » — quick win voulu par le user pour que
   l'apprenant ouvre un vrai compte tôt dans le parcours, sur la base
   de son plan (M09), sans attendre la fin du bloc analytique. Toute
   référence à une théorie d'analyse déjà acquise (BOC, Graham) a été
   retirée de ce fichier en conséquence.
   Barème standard Phase 4 (Bareme harmonise.txt §4 : « Phase 4 —
   Action | +20 000 | −5 000 ») : perfectReward 20000 /
   penaltyPerError 5000 / reward 20000 — confirmé par le propre
   texte du .txt (« + 20 000 FCFA » / « − 5 000 FCFA »).
   Défi = quiz à UNE SEULE question (2 boutons, Courtier A/B) :
   `challenge.questions` a donc 1 seule entrée, et
   `feedback.explanations` AUSSI 1 seule entrée (les deux calculs —
   1 % vs forfait — justifient le même verdict, combinés dans un
   seul `body`, comme M19). La « Règle d'or » de conclusion est
   repliée dans le `.note` de cette explication unique.
   GARDE-FOU commercial (signalé par le brief de cette tâche) :
   aucun nom réel de SGI n'est utilisé nulle part dans ce fichier —
   les placeholders génériques du .txt (« Courtier A », « Courtier
   B ») sont conservés tels quels, y compris dans les labels de
   boutons du défi.
   ============================================================= */
export const m11: Module = {
  code: "M11",
  index: 11,
  totalModules: 28,
  title: "Ouvrir son compte SGI (et comprendre les frais)",
  phase: "Phase 3 · Passage à l'action",
  status: { emoji: "🥇", label: "L'Analyste Stratège" },
  reward: 20000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 11",
    headline: "Le sésame pour investir : votre compte SGI.",
    lead:
      "Vous avez votre plan d'investissement (M09). Pour enfin pouvoir l'exécuter, il vous faut un compte chez une **SGI** (Société de Gestion et d'Intermédiation) — votre courtier. C'est presque aussi simple qu'un compte bancaire, souvent faisable en ligne, et ouvert à la diaspora.",
    card: {
      label: "Avant d'ouvrir un compte",
      title: "3 critères pour choisir sa SGI, et les frais à surveiller",
      hint: "Toutes les SGI donnent accès à la même bourse. Ce qui change :",
      rules: [
        "**La plateforme en ligne** — pouvoir passer vos ordres vous-même, depuis votre téléphone.",
        "**Le conseil** — de vraies études d'entreprise, pas juste l'actualité générale déjà vue partout.",
        "**Les frais** — intermédiation, droits de garde, bourse en ligne : le forfait peut coûter cher sur les petits montants.",
      ],
    },
    objectives: [
      "Savoir ce qu'est une SGI et les documents nécessaires pour ouvrir un compte-titres, même depuis la diaspora.",
      "Choisir sa SGI selon 3 critères concrets : la plateforme en ligne, la qualité du conseil, le montant minimum.",
      "Calculer l'impact réel des frais (pourcentage vs forfait) sur de petits montants investis régulièrement.",
    ],
    cta: "Ouvrir mon compte-titres",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "C'est quoi une SGI, au juste ? ✈️",
      blocks: [
        { kind: "lead", value: "Imaginez la bourse comme un aéroport." },
        { kind: "text", value: "Vous ne pouvez pas traverser la piste et monter dans l'avion tout seul : il faut passer par un **guichet agréé**. À la bourse, c'est pareil — seules certaines structures ont le droit d'exécuter des ordres : les **SGI** (Sociétés de Gestion et d'Intermédiation)." },
        { kind: "text", value: "Concrètement, une SGI c'est votre **guichet d'embarquement** : vous lui donnez vos instructions (« j'achète 10 actions Sonatel »), et c'est elle qui les transmet à la bourse, en votre nom. Sans SGI, impossible d'investir directement." },
        {
          kind: "duo",
          items: [
            { side: "Vous", value: "vous décidez, vous donnez l'ordre." },
            { side: "La SGI", value: "elle exécute, elle transmet à la bourse." },
          ],
        },
      ],
    },
    {
      title: "Comment ouvrir son compte, concrètement",
      blocks: [
        { kind: "text", value: "Passer de la théorie à l'action, en 4 étapes :" },
        {
          kind: "list",
          items: [
            "**Comparez les SGI** — toutes ne se valent pas (frais, plateforme, conseil). Un comparateur vous fait gagner du temps.",
            "**Réunissez vos documents** — pièce d'identité, justificatif de domicile, photos (détail à la slide suivante).",
            "**Remplissez le dossier d'ouverture** — souvent en ligne, parfois en agence ou par correspondance depuis la diaspora.",
            "**Déposez vos premiers fonds** — et votre compte est prêt : vous pouvez passer votre premier ordre.",
          ],
        },
        {
          kind: "link",
          label: "Comparer les SGI (frais, plateforme, conseil...)",
          sublabel: "richbourse.com · comparatif des SGI",
          href: "https://www.richbourse.com/dossier/sgi-comparatif",
        },
        { kind: "text", value: "À la fin de ce module, vous aurez tout en main pour passer à l'action. 👇" },
      ],
    },
    {
      title: "Est-ce compliqué ? Non.",
      blocks: [
        { kind: "text", value: "C'est presque aussi simple qu'ouvrir un compte bancaire, et souvent faisable en ligne. Il faut généralement réunir :" },
        {
          kind: "list",
          items: [
            "une pièce d'identité valide,",
            "un justificatif de domicile,",
            "deux photos d'identité.",
          ],
        },
      ],
    },
    {
      title: "Vous vivez à l'étranger ? La diaspora aussi ! 🌍",
      blocks: [
        { kind: "text", value: "Idée reçue à casser : **vous n'avez PAS besoin d'être sur le territoire du pays, ni d'en être citoyen**, pour ouvrir votre compte-titres." },
        { kind: "text", value: "Depuis la diaspora, vous pouvez parfaitement ouvrir un compte dans une SGI de Côte d'Ivoire (ou d'un autre pays de l'UEMOA), souvent **entièrement à distance, en ligne**. La bourse régionale est ouverte à tous." },
        { kind: "callout", tone: "info", value: "Vérifiez simplement la liste des justificatifs : certaines SGI ont des modalités adaptées aux non-résidents." },
      ],
    },
    {
      title: "Choisir la bonne SGI : 3 critères",
      blocks: [
        { kind: "text", value: "Toutes les SGI donnent accès à la même bourse. Ce qui les distingue vraiment :" },
        {
          kind: "list",
          items: [
            "**La plateforme en ligne** — pouvoir passer vos ordres vous-même, depuis votre téléphone. Fuyez celles qui obligent à se déplacer ou à tout faire par mail : vous perdriez des occasions en attendant qu'un employé traite votre demande.",
            "**Le conseil** — publie-t-elle de vraies **études d'entreprise** qui aident à décider ? Beaucoup se contentent de répéter l'actualité générale : ça, ce n'est pas du conseil. (Vous apprendrez à repérer une vraie étude sérieuse un peu plus loin dans la formation.)",
            "**Le montant minimum d'ouverture** — ce n'est pas un frais (c'est votre argent, que vous investirez), mais un minimum trop élevé (ex. 2 millions) vous bloque l'entrée. Choisissez-en un adapté à votre budget.",
          ],
        },
      ],
    },
    {
      title: "Les frais (1/2) : l'intermédiation",
      blocks: [
        { kind: "text", value: "C'est la commission que prend la SGI **à chaque fois** qu'elle achète ou vend pour vous — un peu comme les frais du mobile money." },
        {
          kind: "list",
          items: [
            "Le plus souvent : un **pourcentage** (~1 % du montant).",
          ],
        },
        { kind: "callout", tone: "warn", value: "⚠️ Certaines ajoutent un **forfait minimum** (ex. 1 000 FCFA par ordre). C'est un piège pour les petits montants : sur un ordre de 25 000 FCFA, 1 000 F de frais = **4 %** ! (on le calcule dans le défi)." },
      ],
    },
    {
      title: "Les frais (2/2) : garde & bourse en ligne",
      blocks: [
        {
          kind: "list",
          items: [
            "**Les droits de garde** : un petit frais **annuel** que la SGI prélève pour **conserver vos titres** en sécurité (~0,27 %/an de la valeur de votre portefeuille). Plus votre portefeuille grossit, plus ils augmentent.",
            "**Les frais de bourse en ligne** : l'accès à la plateforme. **Gratuit** chez beaucoup de SGI, mais **payant** chez d'autres (~1 000 FCFA/mois) — à vérifier avant de choisir.",
          ],
        },
      ],
    },
    {
      title: "Le piège le plus courant : le forfait",
      blocks: [
        { kind: "text", value: "Si vous investissez de petites sommes chaque mois, un mauvais choix de frais peut détruire votre rendement avant même de commencer. Faisons le calcul. 👇" },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Le calcul des frais",
    instruction:
      "Vous investissez 25 000 FCFA/mois (DCA). Deux SGI. **Courtier A — au pourcentage :** 1 % par transaction. **Courtier B — au forfait :** 1 000 FCFA fixes minimum par transaction. Observez le graphique : à quel montant les deux frais s'égalisent ? (1 erreur = − 5 000 FCFA.)",
    chart: {
      xLabel: "Montant investi (FCFA)",
      yLabel: "Frais payés (FCFA)",
      categories: ["10 000", "25 000", "50 000", "100 000", "200 000"],
      series: [
        { label: "Courtier A (1 %)", kind: "line", color: "pos", values: [100, 250, 500, 1000, 2000] },
        { label: "Courtier B (1 000 FCFA fixe)", kind: "line", color: "clay", values: [1000, 1000, 1000, 1000, 1000] },
      ],
    },
    penaltyPerError: 5000,
    perfectReward: 20000,
    options: [
      { value: "a", label: "Courtier A (1 %)" },
      { value: "b", label: "Courtier B (1 000 FCFA fixes)" },
    ],
    questions: [
      {
        prompt: "**Question : pour 25 000 FCFA/mois, quelle SGI vous coûte le moins cher ?**",
        answer: "a",
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Calcul parfait ! + 20 000 FCFA sur votre portefeuille !",
      body: "Vous venez de sauver votre capital de l'appétit de certains courtiers.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Les frais fixes ont englouti votre capital (− 5 000 FCFA).",
      body: "Reprenons le calcul.",
    },
    explanations: [
      {
        verdict: "Courtier A",
        title: "Le calcul, pourcentage vs forfait",
        body: "**Courtier A (1 %)** : 1 % de 25 000 = **250 FCFA**. **Courtier B (forfait)** : **1 000 FCFA**, soit `1000 ÷ 25000 = **4 %** de frais immédiats !` Avec le Courtier B, votre action devrait monter de 4 % **rien que pour rembourser les frais**.",
        note: "**Règle d'or :** pour de **petites sommes** régulières, fuyez les forfaits, privilégiez le pourcentage. Le forfait n'avantage que les très gros montants ponctuels.",
      },
    ],
  },

  next: {
    label: "Mon compte est prêt. Et si je préfère déléguer ?",
    target: "Module 12",
  },
};
