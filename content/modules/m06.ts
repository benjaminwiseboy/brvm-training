import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 06 — L'investissement de rente.
   Défi = quiz à 4 questions ; chaque question a SA PROPRE paire
   d'options (chasseur/fermier, rente/trading, Entreprise A/B,
   deux phrasings custom) — aucun jeu d'options partagé ne fait
   sens sur les 4, donc override `options` par question (précédent
   M03, Task 14). Le champ `options` du challenge est requis par le
   type même si chaque question le recouvre : on y recopie la paire
   de Q1 en repli neutre (même logique que M03 avec sa Q3).
   Ce module n'est PAS listé dans la table du barème harmonisé
   (§4) — les valeurs de récompense/pénalité viennent du .txt
   source lui-même (Section 3 : + 20 000 / − 5 000).
   ============================================================= */
export const m06: Module = {
  code: "M06",
  index: 6,
  totalModules: 28,
  title: "L'investissement de rente",
  phase: "Phase 2 · La Boussole",
  status: { emoji: "🥈", label: "L'Investisseur Curieux" },
  reward: 20000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 06",
    headline: "Devenez fermier, pas chasseur.",
    lead:
      "Vous connaissez votre profil d'investisseur (M05) — reste à le mettre en musique : c'est le rôle d'une stratégie. La rente vous procure des revenus réguliers, presque sans effort : vous possédez des actions comme un fermier possède des arbres, et vous récoltez les dividendes chaque année — sans jamais vendre le capital.",
    card: {
      label: "La stratégie de rente",
      title: "Repérer une bonne valeur de rente",
      hint: "4 critères à vérifier avant d'acheter :",
      rules: [
        "**Des bénéfices réguliers** — rentable chaque année, sans exception.",
        "**Des bénéfices qui montent** — pour que le dividende suive la vie chère.",
        "**Un dividende généreux** — taux de distribution entre 50 et 70 %.",
        "**Un rendement élevé** — viser entre 6 et 10 % à la BRVM.",
      ],
    },
    objectives: [
      "Comprendre la logique de la rente : des revenus réguliers, sans vendre le capital.",
      "Identifier les 4 critères d'une bonne valeur de rente.",
      "Voir comment la rente peut compléter un salaire ou une retraite.",
    ],
    cta: "Devenir un œil de rentier",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Fermier ou chasseur ? 🌳",
      blocks: [
        {
          kind: "text",
          value:
            "La première grande stratégie s'appelle la **rente**. Son but : vous procurer des **revenus réguliers** qui tombent presque tout seuls, pour couvrir les dépenses de votre vie.",
        },
        { kind: "text", value: "Une image pour la retenir." },
        {
          kind: "duo",
          items: [
            {
              side: "Le rentier",
              value:
                "est un **fermier** : il possède des arbres (ses actions) et, chaque année, il récolte les fruits (ses dividendes) sans avoir à les fabriquer — l'argent vient jusqu'à lui.",
            },
            {
              side: "Le trader",
              value: "est un **chasseur** : pour manger, il doit repartir chasser à chaque fois.",
            },
          ],
        },
        {
          kind: "text",
          value:
            "Le rentier, lui, laisse ses arbres travailler à sa place. C'est une stratégie de **patience**, pas d'agitation.",
        },
      ],
    },
    {
      title: "Problème n°1 que la rente résout : financer les études des enfants",
      blocks: [
        {
          kind: "text",
          value:
            "Vous constituez peu à peu un portefeuille d'actions qui versent de bons dividendes. Chaque année, ces dividendes arrivent sur votre compte et paient la scolarité.",
        },
        {
          kind: "callout",
          tone: "highlight",
          value:
            "Le point clé : **vous ne vendez jamais vos actions**. Votre capital (les arbres) reste en place et continue même de grandir — vous ne dépensez que les fruits.",
        },
      ],
    },
    {
      title: "Problème n°2 : compléter sa retraite",
      blocks: [
        {
          kind: "text",
          value:
            "Prenons un exemple : en Côte d'Ivoire, la pension versée par la CNPS (la Caisse Nationale de Prévoyance Sociale) représente en moyenne environ **un tiers** de vos meilleures années de salaire. Concrètement : si vous gagniez 600 000 FCFA par mois, votre retraite tournera autour de **200 000 FCFA** — soit 400 000 FCFA de train de vie en moins **chaque mois**.",
        },
        {
          kind: "text",
          value:
            "Ce n'est pas propre à la Côte d'Ivoire : même en France, la pension moyenne ne remplace pas non plus l'intégralité du dernier salaire — les estimations du Conseil d'orientation des retraites évoquent un taux de remplacement de l'ordre de **50 à 75 %** selon les revenus et les carrières, avec une baisse plus marquée pour les hauts salaires.",
        },
        {
          kind: "text",
          value:
            "La parade est la même partout : en investissant pendant votre vie active, vous vous bâtissez une **seconde source de revenus**. Le jour venu, les dividendes viennent combler ce manque.",
        },
      ],
    },
    {
      title: "Problème n°3 : arrondir ses fins de mois",
      blocks: [
        { kind: "text", value: "Même en travaillant, la rente ajoute un revenu **par-dessus** votre salaire." },
        {
          kind: "callout",
          tone: "info",
          value:
            "**Exemple :** avec 6 000 000 FCFA investis dans des actions de rente à 8 % de rendement, vous touchez 480 000 FCFA de dividendes par an. Réparti sur 12 mois, cela fait **40 000 FCFA en plus chaque mois** — de quoi couvrir une facture, la cantine, ou simplement souffler avant la fin du mois.",
        },
        {
          kind: "callout",
          tone: "warn",
          value:
            "⚠️ Une particularité de la BRVM à connaître : ici, les dividendes sont versés **une seule fois par an** (entre mai et juillet), en une somme unique — pas chaque mois comme un salaire. Il faut donc savoir **répartir vous-même** cette somme sur les 12 mois de l'année, comme dans l'exemple ci-dessus.",
        },
      ],
    },
    {
      title: "Une bonne valeur de rente : d'abord, des bénéfices solides",
      blocks: [
        {
          kind: "text",
          value: "Une entreprise ne peut verser un dividende que si elle **gagne de l'argent**. D'où les deux premiers critères à vérifier :",
        },
        {
          kind: "list",
          items: [
            "**Des bénéfices réguliers** — elle est rentable **chaque année**, sans année dans le rouge. C'est ce qui garantit que votre dividende tombera, à coup sûr, année après année.",
            "**Des bénéfices qui montent** — s'ils augmentent avec le temps, le dividende peut grossir lui aussi. Votre revenu suit alors la hausse du coût de la vie, au lieu de stagner.",
          ],
        },
      ],
    },
    {
      title: "Une bonne valeur de rente : ensuite, un dividende attractif",
      blocks: [
        {
          kind: "list",
          items: [
            "**Un dividende généreux** — regardez le taux de distribution : la part du bénéfice réellement reversée aux actionnaires. En dessous de 50 %, l'entreprise est plutôt radine ; entre 50 et 70 %, elle est généreuse. ⚠️ À **100 %**, méfiance : elle distribue tout et ne garde rien pour investir dans son avenir — ses dividendes futurs risquent de plafonner.",
            "**Un rendement de départ élevé** — le rendement = dividende ÷ prix de l'action. Il vous dit ce que l'action rapporte **chaque année**, par rapport à ce que vous la payez. À la BRVM, viser **entre 6 et 10 %** est un bon repère (contre ~3 % sur un livret d'épargne).",
          ],
        },
        { kind: "lead", value: "Enfilez votre casquette de fermier : à vous de repérer les bonnes valeurs de rente. 👇" },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "L'œil du rentier",
    instruction: "Répondez aux 4 questions. (1 erreur = − 5 000 FCFA.)",
    penaltyPerError: 5000,
    perfectReward: 20000,
    options: [
      { value: "chasseur", label: "Un chasseur, qui doit agir sans cesse." },
      { value: "fermier", label: "Un fermier, qui possède des actifs et encaisse la récolte." },
    ],
    questions: [
      {
        prompt: "À quel personnage ressemble le plus un rentier ?",
        answer: "fermier",
        options: [
          { value: "chasseur", label: "Un chasseur, qui doit agir sans cesse." },
          { value: "fermier", label: "Un fermier, qui possède des actifs et encaisse la récolte." },
        ],
      },
      {
        prompt:
          "Awa réalise que sa retraite ne sera qu'un tiers de son salaire. Elle veut un complément régulier. Quelle stratégie ?",
        answer: "rente",
        options: [
          { value: "rente", label: "La rente" },
          { value: "trading", label: "Le trading à court terme" },
        ],
      },
      {
        prompt:
          "Quelle est la meilleure **valeur de rente** ?\n🅰️ Bénéfices réguliers et croissants, distribue **60 %**, rendement **9 %**.\n🅱️ Bénéfices en dents de scie, distribue **15 %**, rendement **2 %**.",
        answer: "A",
        options: [
          { value: "A", label: "Entreprise A" },
          { value: "B", label: "Entreprise B" },
        ],
      },
      {
        prompt: "Une entreprise verse **100 %** de son bénéfice en dividende. Bon signe pour une rente de long terme ?",
        answer: "risque",
        options: [
          { value: "oui", label: "Oui, plus elle distribue, mieux c'est." },
          { value: "risque", label: "Généreux à court terme, mais risqué : il ne lui reste rien pour grandir." },
        ],
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Âme de fermier ! + 20 000 FCFA sur votre portefeuille !",
      body: "Vous savez repérer une vraie valeur de rente et à quoi elle sert dans votre vie.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! La récolte a été maigre (− 5 000 FCFA par erreur).",
      body: "Reprenons les critères de la rente.",
    },
    explanations: [
      {
        verdict: "Fermier",
        title: "Le rentier = le fermier",
        body:
          "Il ne court pas après le marché : il possède des actifs qui le paient chaque année. C'est une stratégie de patience, pas de mouvement permanent.",
      },
      {
        verdict: "La rente",
        title: "Les 3 usages de la rente",
        body:
          "**Les 3 usages** (études, retraite, complément de revenu) montrent que la rente règle des dépenses concrètes de votre vie. Le chiffre de la retraite (~1/3 du salaire) est le meilleur argument pour s'y mettre **tôt**.",
      },
      {
        verdict: "Entreprise A",
        title: "Q3 → Entreprise A",
        body:
          "Elle coche les 4 critères : bénéfices solides et croissants, distribution généreuse (60 %), rendement élevé (9 %). La B est l'inverse : irrégulière (dents de scie), radine (15 %) et à faible rendement (2 %) — une fausse valeur de rente.",
      },
      {
        verdict: "Généreux mais risqué",
        title: "Q4 → « généreux mais risqué »",
        body:
          "Distribuer **100 %**, c'est ne rien garder pour investir. Sans réinvestissement, les bénéfices — et donc les dividendes futurs — finissent par stagner ou baisser. La bonne rente distribue généreusement **tout en gardant** de quoi grandir.",
      },
    ],
  },

  next: {
    label: "La rente, c'est pour les revenus. Et si je veux faire grossir un capital ?",
    target: "Module 07",
  },
};
