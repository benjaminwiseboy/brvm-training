import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 16 — Analyse fondamentale : les bases.
   Premiers réflexes d'analyse, avant la méthode Graham approfondie
   (M17+) — mention repliée dans hero.lead (seule synthèse créative
   admise).
   Module HORS barème (§4), comme M06/M07 : on reprend les chiffres
   propres du .txt — perfectReward 20000 ("+ 20 000 FCFA") mais
   penaltyPerError 10000 ("− 10 000 FCFA", PAS le 5 000 habituel :
   une seule question à forts enjeux, pas les 4 habituelles).
   Défi = quiz à UNE SEULE question (2 boutons, A/B) : le .txt n'a
   qu'une question dans sa Section 2. `challenge.questions` a donc
   1 seule entrée, et `feedback.explanations` AUSSI 1 seule entrée
   (les 2 raisons — rendement 9,5 % et PER 7 — justifient le même
   verdict : combinées dans un seul `body`, pas éclatées en 2
   explications). L'aside « A est-elle mauvaise ? Pas du tout !... »
   et la phrase « La leçon d'or... » sont repliées dans le `.note`
   de cette explication unique.
   Emphase *italique* à un seul astérisque du .txt (« pour *votre*
   stratégie ») : le type Block ne supporte que **gras** (voir
   lib/format.ts) — astérisques simples retirés, mot conservé tel
   quel (aucun mot perdu ni inventé).
   Revue post-lancement : 4 slides d'ouverture ajoutées avant
   « Regarder sous le capot » (définition, contexte historique —
   Graham/Security Analysis/1934 —, intérêt, concept) ; faits
   d'histoire financière publics, pas de chiffre BRVM inventé.
   ============================================================= */
export const m16: Module = {
  code: "M16",
  index: 16,
  totalModules: 28,
  title: "Analyse fondamentale : les bases",
  phase: "Phase 3 · L'Analyse",
  status: { emoji: "🥇", label: "L'Analyste Stratège" },
  reward: 20000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 16",
    headline: "Regardez sous le capot avant d'acheter.",
    lead:
      "Vous savez lire le prix d'une action, mais ce prix ne dit pas tout. Avant la méthode Graham approfondie (M17 et suivants), voici vos premiers réflexes d'analyste : 3 vérifications simples, comme un check-up avant d'acheter une **voiture d'occasion**.",
    card: {
      label: "Les 3 vérifs avant d'acheter",
      title: "Résultat net, rendement, PER",
      hint: "On oublie les rumeurs et on vérifie 3 choses simples :",
      rules: [
        "**Le résultat net** — l'entreprise gagne-t-elle vraiment de l'argent ?",
        "**Le rendement** — combien elle vous « paie de loyer » chaque année.",
        "**Le PER** — est-elle chère ou bon marché par rapport au marché ?",
      ],
    },
    objectives: [
      "Vérifier qu'une entreprise gagne vraiment de l'argent avant de vous fier au prix affiché.",
      "Calculer le rendement et le PER pour juger si une action est chère ou bon marché.",
      "Choisir l'entreprise adaptée à votre stratégie (rente ou croissance) plutôt que celle qui séduit le plus.",
    ],
    cta: "Regarder sous le capot",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Qu'est-ce que l'analyse fondamentale ?",
      blocks: [
        { kind: "lead", value: "Avant de sortir votre calculette, une question simple : qu'est-ce qu'on est en train de faire, au juste ?" },
        { kind: "text", value: "**L'analyse fondamentale**, c'est étudier une entreprise elle-même — ses comptes, son activité, sa santé financière — pour estimer ce qu'elle **vaut vraiment**, indépendamment de ce que dit son prix en bourse à un instant donné." },
        { kind: "text", value: "L'idée : le prix affiché et la valeur réelle d'une entreprise sont deux choses différentes. Parfois ils se rejoignent, parfois ils s'écartent — et c'est là que se cachent les bonnes affaires (ou les pièges)." },
      ],
    },
    {
      title: "Un peu d'histoire : née après un krach",
      blocks: [
        { kind: "text", value: "Cette méthode n'est pas nouvelle : elle naît dans les années 1930, aux États-Unis, après le **krach boursier de 1929** — un effondrement qui a ruiné des milliers d'investisseurs qui achetaient sur rumeur, sans jamais regarder les comptes des entreprises." },
        { kind: "text", value: "Un professeur de l'université Columbia, **Benjamin Graham**, décide de tout reprendre à zéro : avec David Dodd, il publie en 1934 « **Security Analysis** », le premier grand ouvrage à poser des règles rigoureuses pour évaluer une entreprise à partir de faits, pas de rumeurs." },
        { kind: "callout", tone: "highlight", value: "Son élève le plus célèbre ? **Warren Buffett** — l'un des investisseurs les plus riches au monde, qui applique encore aujourd'hui les principes de son professeur." },
      ],
    },
    {
      title: "Pourquoi ça vous intéresse",
      blocks: [
        { kind: "text", value: "Sans analyse fondamentale, vous investissez au bruit : les rumeurs, les modes, la peur ou l'euphorie du moment. Avec elle, vous gagnez 3 choses :" },
        {
          kind: "list",
          items: [
            "**Une méthode objective** — comparer deux entreprises sur des faits, pas des impressions.",
            "**Une protection** — éviter d'acheter une entreprise fragile juste parce que son action est à la mode.",
            "**Un repère** — savoir si un prix est justifié, trop élevé, ou une opportunité.",
          ],
        },
      ],
    },
    {
      title: "Le concept, en une phrase",
      blocks: [
        { kind: "lead", value: "Chaque entreprise a une valeur réelle — et son prix en bourse peut s'en écarter, dans un sens ou dans l'autre." },
        { kind: "text", value: "L'analyse fondamentale sert à repérer cet écart : une entreprise **solide** vendue **pas cher**, c'est une opportunité ; une entreprise **fragile** vendue **cher**, c'est un piège à éviter." },
        { kind: "text", value: "Passons à la pratique : voici vos premiers réflexes. 👇" },
      ],
    },
    {
      title: "Regarder sous le capot",
      blocks: [
        { kind: "text", value: "Vous savez lire le prix d'une action. Mais ce prix ne dit pas tout : une action à 2 000 FCFA peut être **hors de prix**, et une à 50 000 une **excellente affaire**." },
        { kind: "text", value: "C'est comme une **voiture d'occasion** : le prix affiché ne suffit pas, il faut **regarder sous le capot** avant d'acheter." },
        { kind: "text", value: "On vérifie 3 choses simples — et on oublie les rumeurs (« mon cousin m'a dit que ça va monter »)." },
      ],
    },
    {
      title: "Vérif n°1 : est-ce qu'elle gagne de l'argent ? (le résultat net)",
      blocks: [
        { kind: "text", value: "Achèteriez-vous une **boutique** qui perd de l'argent chaque année ? Sûrement pas." },
        { kind: "text", value: "Pour une entreprise, c'est pareil : on regarde le **résultat net** — le bénéfice une fois tout payé. Si elle enchaîne les pertes année après année, **on fuit**, même si l'action a l'air « pas chère »." },
      ],
    },
    {
      title: "Vérif n°2 : combien elle me « paie de loyer » ? (le rendement)",
      blocks: [
        { kind: "text", value: "Rappel du M14 : le **rendement**, c'est le « loyer » de l'action — ce qu'elle vous verse en dividendes chaque année, en pourcentage de son prix." },
        { kind: "text", value: "À la BRVM, un bon loyer se situe entre **7 et 10 %**." },
        { kind: "callout", tone: "warn", value: "⚠️ Méfiez-vous du loyer « trop beau » : un rendement de 15 % peut cacher un piège (l'entreprise distribue tout son argent et ne garde rien pour grandir)." },
      ],
    },
    {
      title: "Vérif n°3 : est-elle chère ? (le PER)",
      blocks: [
        { kind: "text", value: "Rappel du M14 : le **PER**, c'est le nombre d'années pour « rembourser » le prix, comme quand on achète une boutique." },
        {
          kind: "list",
          items: [
            "**PER 8** → environ 8 ans : attractif.",
            "**PER 25** → 25 ans : cher (le marché parie sur une forte croissance).",
          ],
        },
        { kind: "text", value: "À la BRVM, un PER classique tourne autour de **8-12** (moyenne du marché ≈ 14). À vous de juger ! 👇" },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Étude de cas comparative",
    instruction:
      "Vous appliquez une stratégie de **rente** (revenu sûr et immédiat). Observez ces deux entreprises. **Entreprise A — « Agro-Star »** : secteur agriculture (nouvelle entreprise) · résultat net fortement en hausse (+30 % l'an dernier) · PER 19 · Rendement 2 %. **Entreprise B — « Banque Panafricaine »** : secteur banque (installée depuis 30 ans) · résultat net stable (+2 % l'an dernier) · PER 7 · Rendement 9,5 %. (1 erreur = − 10 000 FCFA.)",
    penaltyPerError: 10000,
    perfectReward: 20000,
    options: [
      { value: "a", label: "L'Entreprise A (Agro-Star)" },
      { value: "b", label: "L'Entreprise B (Banque Panafricaine)" },
    ],
    questions: [
      {
        prompt: "**Question : pour votre stratégie de rente, laquelle achetez-vous en priorité ?**",
        answer: "b",
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "🎉",
      title: "Bravo, l'analyste ! + 20 000 FCFA sur votre portefeuille !",
      body: "Vous avez compris le piège : l'entreprise qui grandit le plus vite n'est pas la bonne cible pour votre stratégie.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Ce choix coûte cher (− 10 000 FCFA).",
      body: "Vous vous êtes laissé éblouir par la croissance de A, en oubliant votre objectif : la rente.",
    },
    explanations: [
      {
        verdict: "Entreprise B",
        title: "Pourquoi B, pour la rente",
        body: "**Rendement 9,5 %** : un gros « loyer », tout de suite. A (2 %) garde son argent pour se développer, elle vous paie très peu. **PER 7** : B est bon marché (7 ans pour se rembourser). A a un PER de 19 : le marché a déjà anticipé sa croissance, l'action est chère.",
        note: "**A est-elle mauvaise ?** Pas du tout ! C'est une **action de croissance**. Pour un profil audacieux visant des plus-values dans 10 ans, A serait un excellent choix. **La leçon d'or :** une « bonne action » dans l'absolu n'existe pas. Il n'y a que la bonne action **pour votre stratégie** (M06 / M07).",
      },
    ],
  },

  next: {
    label: "J'ai les premiers réflexes ! Allons plus loin avec la méthode Graham.",
    target: "Module 17",
  },
};
