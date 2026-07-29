import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 15 — Les obligations en profondeur.
   Approfondit l'obligation vue simplement au M04 (« Les produits »)
   — mention repliée dans hero.lead (seule synthèse créative admise).
   Barème NON standard (§4 : « Obligations en profondeur | 3 |
   +25 000 | −5 000 ») : perfectReward 25000 / penaltyPerError 5000,
   PAS le 20000/5000 par défaut de la Phase 3.
   Formules/noms entre backticks du .txt (`ÉTAT DU SÉNÉGAL 6,50 %
   2025-2032`) convertis en **gras**, même convention que m08/m12.
   Emphases *italique* à un seul astérisque (ex. « *C'est le plus
   courant pour les États.* », « *Bon à savoir : ... ACD.* ») : le
   type Block ne supporte que **gras** (voir lib/format.ts,
   splitMarkup ne reconnaît que `**...**`) — astérisques simples
   retirés, texte conservé tel quel (aucun mot perdu ni inventé).
   Défi = quiz à 4 questions ; chaque question a sa propre paire de
   boutons (mécanisme M03/M11/M14), le tableau de l'obligation du
   BOC (Section 2 du .txt) replié verbatim dans challenge.instruction.
   RESTRUCTURATION DE L'EXPLICATION (voir rapport de tâche) : la
   source ne fournit PAS 4 paragraphes séparés mais un bloc combiné
   « Le grand choix : In Fine vs Amortissement » (couvrant Q2 ET Q3),
   un paragraphe « Le coupon couru » (Q4), et AUCUN paragraphe dédié
   à Q1 (sa lecture n'est explicitée qu'à la Slide 6, « carte
   d'identité »). Les 4 explanations ci-dessous répartissent chaque
   phrase sourcée vers la question qu'elle éclaire réellement,
   parfois en dupliquant une phrase-pivot (« Aucun n'est meilleur »),
   sans jamais inventer un fait absent du .txt. L'aside finale
   « Bon à savoir : ACD » est repliée dans le `.note` de la 4ᵉ
   (dernière) explanation, jamais en 5ᵉ entrée synthétique.
   ============================================================= */
export const m15: Module = {
  code: "M15",
  index: 15,
  totalModules: 28,
  title: "Les obligations en profondeur",
  phase: "Phase 3 · L'Analyse",
  status: { emoji: "🥇", label: "L'Analyste Stratège" },
  reward: 25000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 15",
    headline: "Vous devenez le banquier.",
    lead:
      "Vous approfondissez ici l'obligation déjà vue simplement au M04. Jusqu'ici, vous achetiez des petits morceaux d'entreprises (des actions) ; avec une obligation, vous changez de rôle : vous devenez **celui qui prête**, contre un intérêt régulier (le coupon) et la promesse de récupérer **tout** votre capital à une date connue d'avance.",
    card: {
      label: "Le vocabulaire du prêteur",
      title: "Nominal, coupon, coupon couru, remboursement",
      hint: "4 notions pour lire une obligation comme un banquier :",
      rules: [
        "**Le nominal** — la somme prêtée (souvent 10 000 FCFA), rendue intégralement à la fin.",
        "**Le coupon** — l'intérêt régulier qu'on vous verse pour vous remercier de prêter.",
        "**Le coupon couru** — la part d'intérêts à rembourser si vous achetez en cours d'année.",
        "**Le mode de remboursement** — In Fine (tout à la fin) ou Amortissement (progressif).",
      ],
    },
    objectives: [
      "Distinguer le remboursement In Fine de l'Amortissement, et savoir lequel rapporte le plus d'intérêts au total.",
      "Comprendre pourquoi le coupon couru se rembourse au vendeur quand on achète une obligation en cours d'année.",
      "Décoder le nom d'une obligation au BOC (émetteur, taux, échéance) comme une carte d'identité.",
    ],
    cta: "Devenir le banquier",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Vous devenez le banquier",
      blocks: [
        { kind: "text", value: "Jusqu'ici, vous achetiez des petits morceaux d'entreprises (des actions). Avec une **obligation**, vous changez de rôle : vous devenez **celui qui prête**." },
        { kind: "text", value: "C'est simple : vous prêtez votre argent (le plus souvent à un État, comme celui du Sénégal), il vous verse un intérêt régulier, puis vous rend **tout** votre argent à une date connue d'avance. C'est le placement le plus tranquille de la bourse — vous êtes le prêteur, pas le joueur." },
      ],
    },
    {
      title: "Le nominal & le coupon (la somme prêtée & les intérêts)",
      blocks: [
        {
          kind: "list",
          items: [
            "**La valeur nominale**, c'est le montant d'**un « billet » de prêt** : souvent **10 000 FCFA**. C'est aussi la somme exacte qu'on vous rendra à la fin.",
            "**Le coupon**, c'est l'**intérêt** qu'on vous verse pour vous remercier de prêter. Il a un taux (ex. 6,50 %) et une fréquence de versement :",
          ],
        },
        {
          kind: "list",
          items: [
            "**A** — Annuelle : une fois par an.",
            "**S** — Semestrielle : deux fois par an.",
            "**T** — Trimestrielle : quatre fois par an.",
          ],
        },
        { kind: "formula", label: "Coupon annuel", value: "Valeur nominale × Taux" },
        { kind: "text", value: "**Exemple :** 6,50 % de 10 000, ça fait **650 FCFA** d'intérêt par an, dans votre poche." },
      ],
    },
    {
      title: "Le coupon couru (arriver en cours de route) 🥭",
      blocks: [
        { kind: "text", value: "Imaginez un **manguier** qui donne ses fruits une fois par an. Si vous le rachetez **6 mois avant la récolte**, les fruits ont déjà à moitié poussé grâce à l'ancien propriétaire — normal de lui rembourser sa part." },
        { kind: "text", value: "C'est exactement le **coupon couru** : en achetant une obligation en cours d'année, vous remboursez au vendeur les intérêts déjà « poussés » depuis le dernier versement. Rassurez-vous : vous récupérerez **tout** le coupon à la prochaine récolte." },
        { kind: "formula", label: "Coupon couru (approximatif)", value: "Coupon annuel × (Jours écoulés ÷ 365)" },
      ],
    },
    {
      title: "Les modes de remboursement : comment on vous rend l'argent 🔑",
      blocks: [
        { kind: "text", value: "La colonne « Type Amort » du BOC dit **comment** on vous rend votre capital. Imaginez que vous prêtez 10 000 FCFA à un ami :" },
        {
          kind: "list",
          items: [
            "**IF (In Fine)** — il vous verse les intérêts chaque année, et vous rend **tout d'un coup, à la fin**.",
            "**AC (Amortissement Constant)** — il vous rembourse **par petites tranches égales**, chaque année (comme on rembourse un crédit).",
            "**ACD (Constant Différé)** — pareil que AC, mais il commence par **ne payer que les intérêts** pendant quelques années, puis rembourse par tranches. C'est le plus courant pour les États.",
            "**AD (Dégressif)** — il rembourse **beaucoup au début**, puis de moins en moins (rare).",
          ],
        },
        { kind: "text", value: "Voici à quoi ressemble une obligation dans le BOC, avec tout ce que vous savez déjà lire :" },
        {
          kind: "boctable",
          caption: "Extrait du BOC · obligation d'État",
          columns: ["Titre", "Val. nominale", "Coupon net", "Coupon couru (exemple)", "Périodicité", "Type Amort", "Échéance"],
          rows: [["ÉTAT DU SÉNÉGAL 6,50 % 2025-2032", "10 000 FCFA", "650 FCFA", "325 FCFA", "A", "ACD", "2032"]],
        },
      ],
    },
    {
      title: "Pourquoi ce choix change tout",
      blocks: [
        {
          kind: "list",
          items: [
            "**In Fine :** votre argent « travaille » en entier jusqu'au bout → vous gagnez **plus d'intérêts en tout**, mais il reste **bloqué** jusqu'à la fin.",
            "**Amortissement (AC / ACD) :** votre argent vous **revient petit à petit** → plus disponible et moins risqué, mais comme la somme prêtée diminue, vous gagnez **moins d'intérêts** au total.",
          ],
        },
        { kind: "text", value: "Aucun n'est meilleur : voulez-vous **le maximum d'intérêts** (In Fine) ou **récupérer votre argent progressivement** (Amortissement) ?" },
      ],
    },
    {
      title: "Décoder le nom d'une obligation",
      blocks: [
        { kind: "text", value: "**ÉTAT DU SÉNÉGAL 6,50 % 2025-2032** se lit comme une carte d'identité :" },
        {
          kind: "boctable",
          caption: "Carte d'identité d'une obligation",
          columns: ["Qui emprunte", "Taux d'intérêt", "Année de départ", "Année de fin"],
          rows: [["État du Sénégal", "6,50 %", "2025", "2032"]],
        },
        { kind: "text", value: "Quelques sigles d'emprunteurs :" },
        {
          kind: "list",
          items: [
            "**TPCI** — Trésor de Côte d'Ivoire.",
            "**TPBF** — Trésor du Burkina Faso.",
            "**TPBJ** — Trésor du Bénin.",
            "**TPTG** — Trésor du Togo.",
            "**TPNE** — Trésor du Niger.",
            "**EOM / EOS** — État du Mali / État du Sénégal.",
          ],
        },
        { kind: "text", value: "👇" },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Décoder une obligation",
    instruction: "Voici une obligation d'État telle qu'au BOC. Observez-la et répondez. (1 erreur = − 5 000 FCFA.)",
    table: {
      caption: "ÉTAT DU SÉNÉGAL 6,50 % 2025-2032",
      columns: ["Émetteur", "Taux", "Année de départ", "Année de fin", "Nominal", "Coupon net", "Périodicité", "Type Amort"],
      rows: [["État du Sénégal", "6,50 %", "2025", "2032", "10 000 FCFA", "650 FCFA", "Annuelle (A)", "ACD"]],
      highlightCols: [1, 3, 7],
    },
    penaltyPerError: 5000,
    perfectReward: 25000,
    // Recopie des options de Q1 en repli neutre (requis par le type) :
    // chaque question a sa propre paire de boutons.
    options: [
      { value: "taux_echeance", label: "Le taux d'intérêt annuel, et l'année où l'on vous rend votre capital (échéance)." },
      { value: "prix_creation", label: "Le prix de l'obligation, et l'année de création." },
    ],
    questions: [
      {
        prompt: "**Q1 :** Que signifient « 6,50 % » et « 2032 » ?",
        answer: "taux_echeance",
        options: [
          { value: "taux_echeance", label: "Le taux d'intérêt annuel, et l'année où l'on vous rend votre capital (échéance)." },
          { value: "prix_creation", label: "Le prix de l'obligation, et l'année de création." },
        ],
      },
      {
        prompt: "**Q2 :** Un investisseur veut **récupérer une partie de son argent chaque année**. Quel mode ?",
        answer: "amortissement",
        options: [
          { value: "in_fine", label: "In Fine (IF)" },
          { value: "amortissement", label: "Amortissement Constant (AC ou ACD)" },
        ],
      },
      {
        prompt: "**Q3 :** À montant et taux identiques, quel mode rapporte le **plus d'intérêts au total** ?",
        answer: "in_fine",
        options: [
          { value: "in_fine", label: "In Fine (IF)" },
          { value: "amortissement", label: "Amortissement Constant (AC)" },
        ],
      },
      {
        prompt: "**Q4 :** Vous achetez l'obligation **6 mois** après le dernier coupon. Que se passe-t-il ?",
        answer: "coupon_couru",
        options: [
          { value: "rien", label: "Rien de plus, le prix affiché suffit." },
          { value: "coupon_couru", label: "Vous remboursez au vendeur le « coupon couru » (sa part de fruits déjà poussés), récupéré au coupon suivant." },
        ],
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Vous parlez la langue des obligations ! + 25 000 FCFA sur votre portefeuille !",
      body: "Nominal, coupon, coupon couru, mode de remboursement : le vocabulaire des obligations n'a plus de secret pour vous.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Une colonne obligataire vous a échappé (− 5 000 FCFA par erreur).",
      body: "Reprenons les mécanismes clés avant de continuer.",
    },
    explanations: [
      {
        verdict: "Taux annuel + échéance",
        title: "Décoder la carte d'identité de l'obligation",
        body: "**ÉTAT DU SÉNÉGAL 6,50 % 2025-2032** se lit comme une carte d'identité : qui emprunte (l'État du Sénégal) · **le taux d'intérêt** (6,50 %) · **l'année de départ et de fin** (2025 → 2032).",
      },
      {
        verdict: "Amortissement Constant",
        title: "L'Amortissement vous rend votre argent petit à petit",
        body: "**Amortissement Constant :** on vous rend 2 500 de capital chaque année ; l'intérêt baisse avec la somme qui reste due (600, 450, 300, 150). Total des intérêts : **1 500 FCFA**, mais vous récupérez votre argent au fil du temps — plus disponible et moins risqué.",
      },
      {
        verdict: "In Fine",
        title: "L'In Fine rapporte plus d'intérêts au total",
        body: "**In Fine :** 600 FCFA d'intérêt chaque année, et vos 10 000 reviennent **en une fois à la fin**. Total des intérêts : 4 × 600 = **2 400 FCFA**. In Fine rapporte plus d'intérêts, car l'argent travaille en entier jusqu'au bout ; aucun des deux modes n'est « meilleur » — ça dépend de votre besoin.",
      },
      {
        verdict: "Coupon couru",
        title: "Le coupon couru, une question de justice",
        body: "**Le coupon couru** est simplement une question de justice : chacun (ancien et nouveau propriétaire) touche sa part de fruits.",
        note: "Bon à savoir : la plupart des obligations d'État de la BRVM sont en **ACD**.",
      },
    ],
  },

  next: {
    label: "Je maîtrise les obligations ! Passons à l'analyse d'une action.",
    target: "Module 16",
  },
};
