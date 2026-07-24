import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 19 — Défi de synthèse : analyser une
   entreprise de A à Z. Capstone de fin de Phase 3 (le bloc Graham
   au complet, appliqué à un cas fictif « Banque du Fleuve »).
   Barème NON standard (§4 : « Défi de synthèse (capstone) | 3 |
   +50 000 | −10 000 ») : le plus haut de toute la Phase 3.
   ÉCHELLE DE STATUT 5 PALIERS (décision produit explicite, revue
   finale — NE PAS « corriger » en revenant à 🥇) : le champ `status`
   représente une échelle qui GRIMPE le long de l'ordre des modules
   (🥉 M01 → 🥈 M05 → 🥇 M09 → 🎓 M19-M25 → 💎 M26), lue par
   `deriveStatus(doneCount)` qui prend le `status` du module courant
   (index = nombre de modules terminés, clampé au dernier). Pour éviter
   toute régression 🎓→🥇 (flicker pire que le trou d'origine), M19 à
   M25 portent TOUS 🎓 « L'Analyste Confirmé » et M26 porte 💎 « Le
   Loup de la BRVM ». Ce champ `status` PERSISTANT est distinct du
   badge de complétion PONCTUEL `feedback.perfect.icon`/`.title` (qui
   célèbre une seule fois la réussite de CE module) : les deux
   réutilisent volontairement le même emoji+libellé 🎓 « L'Analyste
   Confirmé », ce n'est pas un doublon à dédupliquer. Le .txt d'origine
   avait deux lignes en tête — « Statut actuel : 🥇 » et « Badge à
   débloquer : 🎓 » — mais le statut affiché suit désormais l'échelle
   ci-dessus, pas la ligne littérale du .txt.
   6 questions, 3 options chacune (Q5 lettrées A/B/C dans le .txt) ;
   6 explications verbatim, une par « Pilier ». Le paragraphe de
   clôture « Transition — Fin de la Phase 3 » est replié dans le
   `.note` de la 6ᵉ (dernière) explication, comme M04 pour la fin de
   Phase 1 — PAS une 7ᵉ entrée synthétique.
   `feedback.explanations.length` = 6 = `challenge.questions.length`.
   Formule entre backticks du .txt (`PER × PBR`) convertie en **gras**.
   ============================================================= */
export const m19: Module = {
  code: "M19",
  index: 19,
  totalModules: 26,
  title: "Défi de synthèse : analyser une entreprise de A à Z",
  phase: "Phase 3 · L'Analyse",
  status: { emoji: "🎓", label: "L'Analyste Confirmé" },
  reward: 50000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 19",
    headline: "L'examen de passage : votre dossier complet.",
    lead:
      "Portrait, performance, perspectives, prix, BOC : vous maîtrisez chaque pilier séparément. Place au vrai test — assembler les 5 en un seul verdict, sur une entreprise fictive construite pour ressembler à une vraie valeur BRVM.",
    card: {
      label: "Le dossier complet",
      title: "Portrait → Performance → Perspectives → Prix → Verdict",
      hint: "Passez chaque pilier au crible, comme un vrai analyste :",
      rules: [
        "**BANQUE DU FLEUVE (BDF)** — 33 ans, banque de détail, 4 pays.",
        "**Performance** — PNB, exploitation et net en hausse régulière depuis 10 ans.",
        "**Prix** — PER 11, PBR 1,2 : sous la règle de Graham et sous la moyenne du marché.",
      ],
    },
    cta: "Ouvrir le dossier BDF",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "L'examen de passage",
      blocks: [
        { kind: "text", value: "Vous savez dresser un portrait, lire une performance, sonder les perspectives, juger un prix, décrypter le BOC. On assemble tout." },
        { kind: "text", value: "**Objectif : décideriez-vous d'acheter cette action pour du long terme ?** Passez chaque pilier au crible." },
        { kind: "text", value: "(Entreprise fictive, construite pour ressembler à une vraie valeur BRVM.)" },
      ],
    },
    {
      title: "📁 Bloc 1 : le Portrait",
      blocks: [
        { kind: "text", value: "**BANQUE DU FLEUVE (BDF)** · Création : 1992 (33 ans) · Banque de détail." },
        { kind: "text", value: "Actionnaires : Atlantic Financial Group **58 %**, État **12 %**, flottant 30 %." },
        { kind: "text", value: "Zone : Sénégal, Côte d'Ivoire, Mali, Bénin (4 pays). Compartiment Principal · Secteur Services Financiers." },
      ],
    },
    {
      title: "📁 Bloc 2 : la Performance (10 ans, Md FCFA)",
      blocks: [
        {
          kind: "list",
          items: [
            "**PNB** : 45 → 95 (hausse régulière)",
            "**Résultat d'exploitation** : 12 → 26 (hausse régulière)",
            "**Résultat net** : 8 → 18 (positif chaque année)",
            "**Dividende** : versé **chaque année** depuis 10 ans.",
          ],
        },
      ],
    },
    {
      title: "📁 Bloc 3 : les Perspectives",
      blocks: [
        {
          kind: "list",
          items: [
            "Top-down : bancarisation + mobile money en plein essor dans l'UEMOA.",
            "Bottom-up : **220 agences**, **3 millions de clients**, une **licence mobile money** difficile à copier.",
          ],
        },
      ],
    },
    {
      title: "📁 Bloc 4 : le Prix (relevé au BOC)",
      blocks: [
        { kind: "text", value: "Cours : **6 500 FCFA** · **PER : 11** · **PBR : 1,2** · **Rendement net : 6,2 %**." },
        { kind: "text", value: "(Rappel : PER moyen du marché ≈ 14.) À vous de trancher ! 👇" },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Le dossier, pilier par pilier",
    instruction:
      "Répondez aux 6 questions dans l'ordre. Chaque erreur coûte 10 000 FCFA. La Q5 (le verdict) est la plus importante ; la Q6 relie l'analyse à votre stratégie.",
    penaltyPerError: 10000,
    perfectReward: 50000,
    // Recopie des options de Q1 en repli neutre (requis par le type) :
    // chaque question a sa propre liste de boutons.
    options: [
      { value: "ca", label: "Le chiffre d'affaires" },
      { value: "pnb", label: "Le Produit Net Bancaire (PNB)" },
      { value: "credits", label: "Le total des crédits" },
    ],
    questions: [
      {
        prompt: "**Q1 — Portrait.** BDF étant une **banque**, quel indicateur suivre comme « ligne du haut » (équivalent du chiffre d'affaires) ?",
        answer: "pnb",
        options: [
          { value: "ca", label: "Le chiffre d'affaires" },
          { value: "pnb", label: "Le Produit Net Bancaire (PNB)" },
          { value: "credits", label: "Le total des crédits" },
        ],
      },
      {
        prompt: "**Q2 — Performance.** Diagnostic des 3 courbes sur 10 ans ?",
        answer: "solide",
        options: [
          { value: "solide", label: "Solide : PNB, exploitation et net montent ensemble." },
          { value: "suspect", label: "Suspect : le net est gonflé par de l'exceptionnel." },
          { value: "fragile", label: "Fragile : en dents de scie." },
        ],
      },
      {
        prompt: "**Q3 — Perspectives.** BDF a-t-elle un avenir bien orienté ?",
        answer: "oui",
        options: [
          { value: "oui", label: "Oui : vent porteur (bancarisation) + un fossé solide (réseau, clients, licence)." },
          { value: "non_declin", label: "Non : secteur en déclin." },
          { value: "non_aucun", label: "Non : aucun avantage." },
        ],
      },
      {
        prompt: "**Q4 — Prix.** Calculez **PER × PBR** et jugez (< 22,5 et vs marché ≈ 14).",
        answer: "raisonnable",
        options: [
          { value: "raisonnable", label: "13,2 → sous 22,5 ET sous la moyenne : prix raisonnable, avec marge de sécurité." },
          { value: "trop_cher", label: "13,2 → trop cher." },
          { value: "impossible", label: "Impossible à juger." },
        ],
      },
      {
        prompt: "**Q5 — LE VERDICT.** Ce matin l'action a baissé de **−2 %** et l'indice Services Financiers est dans le rouge. Un collègue dit d'attendre. Votre décision, pour du **long terme** ?",
        answer: "c",
        options: [
          { value: "a", label: "J'attends que ça baisse encore." },
          { value: "b", label: "Je passe mon chemin." },
          { value: "c", label: "J'achète : les 3 piliers sont au vert, la baisse du jour n'est que du bruit." },
        ],
      },
      {
        prompt: "**Q6 — Pour quel investisseur ?** BDF verse 6,2 % de dividende et croît modérément. Elle correspond le mieux à… ?",
        answer: "rente",
        options: [
          { value: "rente", label: "Une stratégie de RENTE (revenu régulier)." },
          { value: "croissance", label: "Une stratégie de CROISSANCE pure (doublement rapide, sans besoin de cash)." },
          { value: "peu_importe", label: "Peu importe : une bonne action convient à tout le monde." },
        ],
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎓",
      title: "BADGE DÉBLOQUÉ : L'Analyste Confirmé ! + 50 000 FCFA sur votre portefeuille !",
      body: "Vous avez mené une analyse complète, seul, du portrait au verdict. Vous décidez avec méthode, pas avec vos émotions.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! L'analyse mérite une révision (− 10 000 FCFA par erreur).",
      body: "Reprenons pilier par pilier.",
    },
    explanations: [
      {
        verdict: "PNB",
        title: "Pilier 1 — PNB",
        body: "Pour une banque, on suit le **Produit Net Bancaire**, pas le chiffre d'affaires.",
      },
      {
        verdict: "Solide",
        title: "Pilier 2 — Performance 🟢",
        body: "Les 3 courbes montent ensemble, dividende chaque année : pas de piège HAO.",
      },
      {
        verdict: "Oui",
        title: "Pilier 3 — Perspectives 🟢",
        body: "Vent porteur (bancarisation, mobile money) + un vrai fossé (agences, clients, licence).",
      },
      {
        verdict: "13,2 raisonnable",
        title: "Pilier 4 — Prix 🟢",
        body: "11 × 1,2 = 13,2, sous 22,5 **et** sous la moyenne (≈ 14). Rendement 6,2 % en prime.",
      },
      {
        verdict: "Bouton C",
        title: "Pilier 5 — Le verdict",
        body: "3 feux verts → **on achète (C)**. Le −2 % du jour n'est que du **bruit** ; il ne change rien à une entreprise qu'on garde 10 ans.",
      },
      {
        verdict: "Rente",
        title: "Pilier 6 — Rente",
        body: "Dividende 6,2 % + entreprise mature à croissance modérée = profil **rente**. « Une bonne action n'existe pas dans l'absolu — seulement la bonne action pour VOTRE stratégie » (M14).",
        note: "**La méthode maîtrisée :** Portrait → Performance → Perspectives → Prix → Verdict → Adéquation à votre stratégie. 🏆 **Félicitations, Analyste Confirmé !** La théorie est terminée. Rangez vos lunettes d'analyste, sortez votre pièce d'identité : il est temps d'ouvrir votre VRAI compte.",
      },
    ],
  },

  next: {
    label: "Passer à la Phase 4 : ouvrir mon compte et acheter pour de vrai !",
    target: "Module 20",
  },
};
