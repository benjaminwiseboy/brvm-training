import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 26 — L'épreuve du feu : gérer son portefeuille
   en temps de crise. Boss psychologique final de la Phase 5 et de
   tout le parcours (26/26).
   Barème (§4 : « 11. Boss psychologique | Phase 5 | +100 000 (C) |
   A = game-over ») : perfectReward 100000, reward 100000 — confirmé
   par le propre texte du .txt (« + 100 000 FCFA »).

   DÉCISION STRUCTURELLE DOCUMENTÉE (pas d'invention de mécanique) :
   le .txt décrit 3 issues DISTINCTES selon le bouton choisi — A
   (La Fuite) = grosse perte / « portefeuille vidé » ; B (L'Autruche)
   = statu quo, « pas de perte, pas de gain » ; C (Le Loup) = bonus
   +100 000. Le moteur `QuizChallenge`/`Bilan` (components/engine)
   ne connaît que 2 issues (correct → perfectReward, faux → -(erreurs
   × penaltyPerError), un seul écran `imperfect` générique) : il ne
   peut pas distinguer mécaniquement A de B. Modifier ce moteur pour
   3 issues était hors périmètre de cette tâche (types.ts/validate.ts/
   composants non modifiables sans escalade). Le propre barème
   dédramatise déjà cette limite : « Pas de game-over : l'apprenant
   poursuit toujours (…) Seul game-over narratif : le choix "La
   Fuite" (…) qui est un choix pédagogique volontaire, pas une fin de
   partie réelle. » → le texte « vidé »/« GAME OVER » est donc à lire
   comme une couleur narrative, pas une instruction de remise à zéro
   réelle du capital. En conséquence : `penaltyPerError = 0`, valeur
   directement alignée sur l'issue B explicitement chiffrée par le
   .txt (« pas de perte, pas de gain » = 0), pas un nombre inventé.
   Le récit complet des 3 issues (A, B et C) ET la leçon de psychologie
   du krach sont intégralement préservés dans l'explication unique de
   la Section 3 : `feedback.explanations` est TOUJOURS affiché par
   Bilan.tsx, qu'on ait eu juste ou faux (contrairement à
   perfect/imperfect qui eux sont binaires) — donc aucun apprenant,
   quel que soit son choix, ne perd le contenu pédagogique complet.
   Seule la mise en scène (quel écran « à chaud » s'affiche en premier)
   est compressée en un message honnête et non binaire dans son ton.
   « Instruction technique : (…) A = grosse perte, B = statu quo, C =
   bonus massif » est une note de conception adressée au bâtisseur du
   module (elle spoilerait les réponses si affichée à l'apprenant) :
   elle n'apparaît donc nulle part dans `challenge`, seulement utilisée
   ci-dessus pour calibrer penaltyPerError.

   DISTINCTION STATUT vs CERTIFICAT (même convention que M19) : le
   .txt a deux lignes en tête — « Statut actuel : 🥇 L'Analyste
   Stratège » (déjà détenu PENDANT ce module → `status`) et
   « Certificat à débloquer : 💎 Le Loup de la BRVM » (célébration
   ponctuelle → UNIQUEMENT dans `feedback.perfect.icon` et dans le
   `.note` de l'explication, jamais dans `status`).
   Le paragraphe « [capitalFictif] FCFA » n'est pas reproduit
   littéralement (placeholder de template, pas du texte final) : le
   montant réel du portefeuille est déjà affiché en direct par
   Bilan.tsx (pastille "💰 Portefeuille"), donc redondant à figer en
   dur ici.
   `next.target` : pas de « Module 27 ». `getNext()` (registry.ts)
   retourne déjà `undefined` en fin de `orderedCodes()` et
   ModulePlayer gère ce cas par un repli vers `/` (Task 10) — donc
   `next.target` est ici une simple étiquette d'affichage, jamais une
   clé de routage. Choix : « Tableau de bord » (cohérent avec le
   brief : « next = retour dashboard / fin »), `next.label` reprend
   le texte réel du bouton final du .txt (« Accéder au Coffre-fort »).
   ============================================================= */
export const m26: Module = {
  code: "M26",
  index: 26,
  totalModules: 26,
  title: "L'épreuve du feu : gérer son portefeuille en temps de crise",
  phase: "Phase 5 · Suivi & maîtrise",
  status: { emoji: "🥇", label: "L'Analyste Stratège" },
  reward: 100000,

  // ---- Écran d'accueil : carte thématique (pas de « cadeau ») ----
  hero: {
    eyebrow: "Formation BRVM · Module 26",
    headline: "Le jour où tout bascule.",
    lead:
      "Vous avez votre plan, votre compte SGI, vos premiers ordres à cours limité. Votre portefeuille est fait d'entreprises solides qui versent de bons dividendes. Pendant un an, tout va bien… puis, un matin, c'est la panique : la BRVM ouvre en baisse de **10 %** !",
    card: {
      label: "Le krach",
      title: "La BRVM ouvre en baisse de 10 %",
      hint: "Les causes du jour :",
      rules: [
        "Les taux des banques centrales flambent.",
        "Un choc géopolitique frappe l'Afrique de l'Ouest.",
        "Les investisseurs étrangers retirent leurs capitaux d'un coup.",
      ],
    },
    cta: "Affronter le krach",
  },

  // ---- Section 1 : le cours en slides ----
  slides: [
    {
      title: "Le jour où tout bascule",
      blocks: [
        { kind: "text", value: "Vous avez votre plan, votre compte SGI, vos premiers ordres à cours limité. Votre portefeuille est fait d'entreprises solides qui versent de bons dividendes." },
        { kind: "text", value: "Pendant un an, tout va bien. Vous touchez vos premiers dividendes. Puis, un matin, c'est la panique." },
      ],
    },
    {
      title: "La panique",
      blocks: [
        {
          kind: "list",
          items: [
            "Les taux des banques centrales flambent.",
            "Un choc géopolitique frappe l'Afrique de l'Ouest.",
            "Les investisseurs étrangers retirent leurs capitaux d'un coup.",
          ],
        },
        { kind: "callout", tone: "warn", value: "**Résultat : la BRVM ouvre en baisse de 10 % !**" },
      ],
    },
    {
      title: "L'instant de vérité",
      blocks: [
        { kind: "text", value: "Vous vous connectez : Sonatel, BOA, CIE… tout est dans le rouge écarlate. Votre portefeuille affiche une perte de plusieurs centaines de milliers de FCFA." },
        { kind: "text", value: "C'est ici qu'on sépare les gagnants des perdants." },
      ],
    },
  ],

  // ---- Section 2 : le défi ----
  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Le Boss de fin",
    instruction: "**Votre beau-frère hurle qu'il faut tout vendre avant que ça tombe à zéro.**",
    penaltyPerError: 0,
    perfectReward: 100000,
    options: [
      { value: "fuite", label: "**La Fuite :** il a raison. Je lance un « ordre au marché » pour tout vendre, et j'arrête la bourse." },
      { value: "autruche", label: "**L'Autruche :** je ferme l'application, j'éteins la télé, et je ne regarde plus mon portefeuille pendant 6 mois." },
      { value: "loup", label: "**Le Loup de la BRVM :** je souris. Je prends ma capacité d'épargne mensuelle (DCA) et je passe des ordres à cours limité pour profiter de la baisse." },
    ],
    questions: [
      {
        prompt: "**Que faites-vous ce matin-là ?**",
        answer: "loup",
      },
    ],
  },

  // ---- Section 3 : le feedback ----
  feedback: {
    perfect: {
      icon: "💎",
      title: "COUP DE GÉNIE ! + 100 000 FCFA sur votre portefeuille !",
      body: "Vous avez le mental d'un grand investisseur. La bourse est le seul marché où les clients s'enfuient quand il y a des soldes.",
    },
    imperfect: {
      icon: "🤔",
      title: "Ce n'était pas le réflexe du Loup de la BRVM.",
      body: "Deux réactions sont possibles face à la panique : fuir, ou vous couper du marché. Aucune des deux n'est le coup de génie — découvrez pourquoi ci-dessous.",
    },
    explanations: [
      {
        verdict: "Le Loup de la BRVM",
        title: "La psychologie du krach",
        body: "**Si vous aviez choisi La Fuite :** 📉 GAME OVER, le marché vous aurait vaincu (portefeuille vidé). La pire décision : la baisse n'était que « virtuelle » ; en vendant, vous l'auriez transformée en perte définitive. Vous auriez vendu au plus bas… à un investisseur plus malin (le profil du Loup). **Si vous aviez choisi L'Autruche :** ⚖️ maintien de la position (pas de perte, pas de gain). Une réaction humaine et respectable : vous auriez évité de vendre par panique. Bien — mais vous auriez raté une opportunité. **La psychologie du krach :** les fondamentaux de Sonatel ou de BOA n'ont pas disparu en une nuit. Ces entreprises continuent de vendre des forfaits et d'encaisser des crédits, crise ou pas. La baisse n'est due qu'à la **peur** de ceux qui ont besoin de liquidités. **Pourquoi Le Loup est le meilleur choix :** si vous croyez aux entreprises que vous avez analysées (Graham), un krach est une aubaine. Une action BOA qui valait 6 000 FCFA ne vaut plus que 5 400 : en achetant avec votre DCA, vous augmentez votre futur rendement, car le dividende, lui, ne change pas. **Quand vend-on, alors ?** Jamais par peur. Seulement pour 2 raisons : (1) vous avez besoin de l'argent pour le projet prévu dans votre plan ; (2) l'entreprise a fondamentalement changé (d'où l'importance de suivre les résultats).",
        note: "🏆 **CERTIFICAT DÉBLOQUÉ : vous êtes officiellement Le Loup de la BRVM !** 💎 Vous avez survécu aux mythes, maîtrisé les calculs, dompté le BOC et vaincu la panique.",
      },
    ],
  },

  next: {
    label: "Accéder au Coffre-fort (ressources bonus)",
    target: "Tableau de bord",
  },
};
