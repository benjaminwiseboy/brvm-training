/**
 * Contenu de la check-list « 7 premiers jours » — la ressource du
 * Coffre-fort débloquée à la fin du parcours (`content/vault.ts`,
 * `checklist-7-jours`).
 *
 * Raison d'être : un bêta-testeur a terminé les 28 modules puis a demandé
 * « j'ai envie de me lancer, c'est quoi la prochaine étape ? ». Le parcours
 * enseigne tout ce qu'il faut savoir, mais ne disait nulle part quoi FAIRE
 * le lundi matin. Cette check-list est cette réponse-là.
 *
 * Règle de rédaction : chaque étape est vérifiable par l'apprenant seul, et
 * chaque chiffre vient d'un module existant — aucun ordre de grandeur
 * inventé ici. Sources : M02 (3 règles d'or : fonds d'urgence 3-6 mois,
 * horizon 3-5 ans, jamais d'argent emprunté), M09 (le plan), M10 (DCA),
 * M11 (SGI : 3 critères, documents, frais — intermédiation ~1 % avec le
 * piège du forfait, droits de garde ~0,27 %/an, bourse en ligne parfois
 * ~1 000 F/mois — et diaspora), M13 (ordre à cours limité vs au marché),
 * M14-M23 (les 4 P de l'analyse), M25 (fiscalité, IRVM).
 *
 * Démarche réelle d'ouverture (précisée par le porteur du projet) : on écrit
 * d'abord un e-mail à la SGI pour annoncer son intention et demander la
 * marche à suivre — certaines répondent par un formulaire en ligne, d'autres
 * envoient un dossier à remplir et à renvoyer. Même logique pour le
 * versement : mobile money chez les unes, virement bancaire chez les autres,
 * d'où l'étape « demander les moyens acceptés » avant d'envoyer un franc.
 *
 * GARDE-FOU commercial, repris de m11.ts : aucun nom réel de SGI n'est cité.
 * Le seul lien externe éditorial est le comparateur déjà utilisé dans le
 * cours (M11). L'offre d'accompagnement (`lib/contact.ts`) est, elle, le
 * service du porteur du projet — affichée comme payante partout où elle
 * apparaît.
 */

export type ChecklistStep = {
  /** Stable : sert de clé de persistance (cf. app/coffre/checklist). Ne jamais réutiliser un id retiré. */
  id: string;
  label: string;
  /** Précision affichée en petit sous l'étape — le « pourquoi » ou le piège à éviter. */
  hint?: string;
  /**
   * Étape pivot, mise en exergue visuellement : celle qui fait basculer la
   * semaine du côté de l'action. Il n'y en a qu'une poignée — au-delà, plus
   * rien ne ressort.
   */
  highlight?: boolean;
};

export type ChecklistDay = {
  id: string;
  /** Étiquette courte de la pastille (« J1 »). */
  tag: string;
  title: string;
  /** L'objectif de la journée, en une phrase. */
  goal: string;
  steps: ChecklistStep[];
};

export const CHECKLIST_TITLE = "Check-list « 7 premiers jours »";

export const CHECKLIST_LEAD =
  "Vous savez tout ce qu'il faut savoir. Il reste à le faire. Voici la semaine qui sépare la fin de la formation de votre première ligne en portefeuille — **une étape par jour, dans l'ordre**. Rien ici ne demande plus de 30 minutes.";

export const CHECKLIST: ChecklistDay[] = [
  {
    id: "j1",
    tag: "J1",
    title: "Choisir sa SGI",
    goal: "Sortir de la journée avec UNE société d'intermédiation retenue, pas trois.",
    steps: [
      {
        id: "j1-liste",
        label: "Établir une courte liste de **3 SGI** candidates",
        hint: "Toutes donnent accès à la même bourse — ce n'est pas le choix du siècle, c'est le choix de votre guichet.",
      },
      {
        id: "j1-plateforme",
        label: "Critère 1 — vérifier qu'elle a une **plateforme en ligne** où vous passez vos ordres vous-même",
        hint: "Si chaque ordre passe par un mail et un employé, vous raterez des occasions en attendant la réponse.",
      },
      {
        id: "j1-conseil",
        label: "Critère 2 — vérifier qu'elle publie de **vraies études d'entreprise**",
        hint: "Répéter l'actualité générale n'est pas du conseil. Demandez à voir une étude récente avant de signer.",
      },
      {
        id: "j1-minimum",
        label: "Critère 3 — vérifier le **montant minimum d'ouverture**",
        hint: "Ce n'est pas un frais (c'est votre argent), mais un minimum à 2 millions vous ferme la porte. Prenez-en un à votre budget.",
      },
      {
        id: "j1-frais",
        label: "Demander la **grille tarifaire complète** et y chercher les 3 frais du module 11",
        hint: "Intermédiation (~1 % par ordre), droits de garde (~0,27 %/an de votre portefeuille), accès à la plateforme (gratuit chez beaucoup, ~1 000 F/mois chez d'autres).",
      },
      {
        id: "j1-forfait",
        label: "Écarter tout **forfait minimum par ordre** si vous investissez de petites sommes",
        hint: "1 000 FCFA de forfait sur un ordre de 25 000 FCFA = 4 % de frais. Votre action doit monter de 4 % rien que pour les rembourser.",
      },
      {
        id: "j1-choix",
        label: "Trancher : **une** SGI retenue",
      },
      {
        id: "j1-adresse",
        label: "Trouver son **adresse e-mail** sur son site officiel",
        hint: "Page « Contact », « Ouvrir un compte » ou pied de page. Si le site propose un formulaire d'ouverture de compte en ligne, remplissez-le : c'est la même démarche, en plus rapide.",
      },
      {
        id: "j1-email",
        label: "**Envoyer l'e-mail** : annoncez votre intention d'ouvrir un compte-titres et demandez la démarche",
        hint: "C'est LE geste qui fait démarrer la semaine — tout le reste en découle. Un modèle prêt à copier est juste en dessous.",
        highlight: true,
      },
    ],
  },
  {
    id: "j2",
    tag: "J2",
    title: "Réunir son dossier",
    goal: "Avoir toutes les pièces scannées dans un même dossier, prêtes à envoyer.",
    steps: [
      { id: "j2-identite", label: "**Pièce d'identité en cours de validité** (CNI ou passeport)" },
      { id: "j2-domicile", label: "**Justificatif de domicile** récent" },
      { id: "j2-photos", label: "**Deux photos d'identité**" },
      {
        id: "j2-banque",
        label: "Coordonnées du **compte** qui servira aux virements (RIB ou compte mobile money)",
        hint: "C'est par là que partiront vos versements et que reviendront vos dividendes.",
      },
      {
        id: "j2-diaspora",
        label: "Diaspora : demander la **procédure non-résident**",
        hint: "Vous n'avez besoin ni de résider dans le pays, ni d'en être citoyen. Beaucoup de SGI ouvrent le compte entièrement à distance — la liste des justificatifs, elle, peut différer.",
      },
      {
        id: "j2-reponse",
        label: "Ouvrir la **réponse de la SGI** et relever la liste exacte qu'elle réclame",
        hint: "C'est elle qui fait foi : la liste ci-dessus est le socle habituel, chaque SGI y ajoute ses propres pièces.",
      },
      {
        id: "j2-formulaires",
        label: "Si l'ouverture est **manuelle** : télécharger les formulaires envoyés par la SGI et les remplir",
        hint: "Dans ce cas, la SGI vous adresse un dossier à compléter, signer et lui renvoyer — c'est la voie classique quand il n'y a pas de formulaire en ligne.",
      },
    ],
  },
  {
    id: "j3",
    tag: "J3",
    title: "Ouvrir le compte-titres",
    goal: "Le dossier est déposé. À partir d'ici, l'attente ne dépend plus de vous.",
    steps: [
      {
        id: "j3-voie",
        label: "Suivre la voie indiquée par la SGI : **formulaire en ligne** ou **dossier à renvoyer**",
        hint: "Les deux mènent au même compte. Le formulaire en ligne se boucle en une session ; le dossier manuel se signe puis se renvoie par e-mail ou en agence.",
      },
      {
        id: "j3-convention",
        label: "Lire la **convention de compte** — et sa grille tarifaire annexée",
        hint: "C'est le seul document qui engage vraiment. Les frais annoncés au téléphone doivent s'y retrouver à l'identique.",
      },
      {
        id: "j3-envoi",
        label: "Renvoyer le dossier complet signé et **demander le délai d'activation**",
        hint: "Demandez un accusé de réception : sans lui, vous ne saurez pas si votre dossier attend chez vous ou chez eux.",
      },
      {
        id: "j3-acces",
        label: "Noter en lieu sûr votre **numéro de compte-titres** et vos identifiants de plateforme",
      },
      {
        id: "j3-connexion",
        label: "Se connecter une première fois à la plateforme et **la visiter à vide**",
        hint: "Repérez calmement où l'on saisit un ordre, avant d'avoir de l'argent en jeu.",
      },
    ],
  },
  {
    id: "j4",
    tag: "J4",
    title: "Vérifier ses fondations",
    goal: "Confirmer que l'argent que vous allez investir est bien de l'argent investissable.",
    steps: [
      {
        id: "j4-urgence",
        label: "Règle n°1 — le **fonds d'urgence** est constitué : 3 à 6 mois de dépenses, ailleurs qu'en bourse",
        hint: "Sans lui, le premier imprévu vous forcera à vendre au pire moment.",
      },
      {
        id: "j4-horizon",
        label: "Règle n°2 — cet argent, vous pouvez l'**oublier 3 à 5 ans** minimum",
      },
      {
        id: "j4-emprunt",
        label: "Règle n°3 — **aucun argent emprunté**, et rien qui touche au loyer, à la scolarité, à la santé",
      },
      {
        id: "j4-plan",
        label: "Relire son **plan d'investissement** : objectif, horizon, stratégie, capacité d'épargne",
      },
      {
        id: "j4-montant",
        label: "Fixer le **montant mensuel** que vous verserez — celui que vous tiendrez 12 mois sans y penser",
        hint: "Mieux vaut un petit montant tenu chaque mois qu'un gros montant abandonné au troisième.",
      },
    ],
  },
  {
    id: "j5",
    tag: "J5",
    title: "Alimenter le compte",
    goal: "Le compte est activé et provisionné. Vous êtes officiellement sur le marché.",
    steps: [
      { id: "j5-activation", label: "Vérifier que le compte est **activé** (relancer la SGI si le délai est dépassé)" },
      {
        id: "j5-moyens",
        label: "**Demander à la SGI les moyens de versement qu'elle accepte**",
        hint: "Certaines acceptent le mobile money, d'autres uniquement le virement bancaire — et les délais de mise à disposition ne sont pas les mêmes. Posez la question AVANT d'envoyer le moindre franc, sinon vos fonds peuvent rester bloqués en route.",
        highlight: true,
      },
      {
        id: "j5-virement",
        label: "Effectuer le **premier versement** — celui du mois, pas toutes vos économies",
        hint: "La régularité fait le travail à votre place. Entrer d'un bloc, c'est parier sur un seul jour de marché.",
      },
      {
        id: "j5-reference",
        label: "Mettre **votre numéro de compte-titres en référence** du versement",
        hint: "C'est ce qui permet à la SGI de rattacher l'argent à VOTRE compte plutôt que de le laisser en attente.",
      },
      { id: "j5-reception", label: "Confirmer la **réception des fonds** sur le compte-titres" },
      {
        id: "j5-trace",
        label: "Archiver la preuve du virement",
        hint: "Premier réflexe de tenue de compte : tout ce qui entre et sort laisse une trace chez vous aussi.",
      },
    ],
  },
  {
    id: "j6",
    tag: "J6",
    title: "Choisir sa première ligne",
    goal: "Une entreprise, une thèse écrite, un prix maximum. Décidé à froid, la veille.",
    steps: [
      {
        id: "j6-analyse",
        label: "Passer **1 ou 2 entreprises** à la méthode des 4 P : Portrait, Performance, Perspectives, Prix",
        hint: "C'est tout le cœur du parcours. Ne sautez pas le P de Prix : une bonne entreprise achetée trop cher reste un mauvais investissement.",
      },
      {
        id: "j6-boc",
        label: "Vérifier au **BOC du jour** le dernier cours, le PER et le rendement",
      },
      {
        id: "j6-these",
        label: "Écrire **en une phrase** pourquoi vous achetez cette action",
        hint: "C'est le document le plus important de votre vie d'investisseur : c'est ce que vous relirez le jour où le cours baissera de 20 %.",
      },
      {
        id: "j6-prix",
        label: "Fixer **le prix maximum** que vous acceptez de payer, et le noter",
      },
      {
        id: "j6-diversif",
        label: "Vérifier que vous ne mettez pas tout sur une seule valeur ni un seul secteur",
      },
    ],
  },
  {
    id: "j7",
    tag: "J7",
    title: "Passer son premier ordre",
    goal: "Votre première ligne. Et le rendez-vous du mois prochain déjà posé.",
    steps: [
      {
        id: "j7-limite",
        label: "Passer un ordre **à cours limité** — jamais au marché",
        hint: "La BRVM est parfois peu liquide : un ordre au marché « mange » le carnet de la ligne la moins chère à la plus chère et peut vous faire payer bien plus que le cours affiché.",
        highlight: true,
      },
      { id: "j7-prix", label: "Saisir la limite au **prix décidé hier**, pas au prix qui vous tente aujourd'hui" },
      {
        id: "j7-execution",
        label: "Vérifier l'exécution — et ne pas s'inquiéter d'une **exécution partielle**",
        hint: "C'est normal sur un marché peu liquide : le reste de l'ordre attend sagement à votre prix.",
      },
      {
        id: "j7-suivi",
        label: "Noter la ligne : **date, quantité, prix payé, frais**",
        hint: "Sans les frais, votre prix de revient réel est faux — et vous croirez être gagnant avant de l'être.",
      },
      {
        id: "j7-rdv",
        label: "Poser dans votre agenda le **rendez-vous du mois prochain** pour le versement suivant",
        hint: "C'est l'étape que tout le monde saute, et c'est celle qui fait toute la différence sur 10 ans.",
      },
    ],
  },
];

/** Ce qui vient après — pas des cases à cocher, des réflexes à garder. */
export const CHECKLIST_AFTER: { icon: string; title: string; body: string }[] = [
  {
    icon: "📵",
    title: "Ne regardez pas les cours tous les jours",
    body: "Vous avez investi pour 5 ans et plus. Consulter son portefeuille chaque matin n'améliore aucun rendement — ça n'entraîne que la panique.",
  },
  {
    icon: "📄",
    title: "Relisez votre thèse avant toute vente",
    body: "Une baisse de prix n'est pas une raison de vendre. Le sont : votre objectif est atteint, ou l'entreprise a fondamentalement changé.",
  },
  {
    icon: "📅",
    title: "Suivez les résultats et les dates de détachement",
    body: "Les résultats annuels mettent votre analyse à jour. La date de détachement décide qui touche le dividende — être actionnaire la veille suffit.",
  },
  {
    icon: "💧",
    title: "Continuez à verser, surtout quand ça baisse",
    body: "Votre versement mensuel achète mécaniquement plus d'actions quand les prix sont bas. C'est le seul marché où les soldes font fuir les clients.",
  },
];

export const CHECKLIST_DISCLAIMER =
  "Cette check-list est un support pédagogique. BRVM Learning ne fournit aucun conseil en investissement personnalisé et ne recommande aucune société d'intermédiation en particulier.";

/**
 * Modèle d'e-mail à envoyer à la SGI (étape `j1-email`).
 *
 * Il est fourni prêt à copier parce que c'est précisément là que l'on
 * renonce : on sait qu'il faut écrire, on ne sait pas quoi écrire, et la
 * semaine s'arrête là. Le texte dit les deux seules choses utiles —
 * l'intention (ouvrir un compte-titres) et la question (quelle démarche) —
 * et les crochets signalent ce qui reste à personnaliser.
 */
export const EMAIL_TEMPLATE = {
  intro:
    "L'adresse se trouve sur le site de la SGI (page « Contact » ou « Ouvrir un compte »). Si elle propose un formulaire d'ouverture en ligne, remplissez-le plutôt : c'est la même démarche, en plus direct.",
  subject: "Demande d'ouverture d'un compte-titres",
  body: `Bonjour,

Je souhaite ouvrir un compte-titres auprès de votre société afin d'investir à la BRVM.

Pourriez-vous m'indiquer :
- la démarche à suivre pour l'ouverture (formulaire en ligne ou dossier à remplir) ;
- la liste des pièces justificatives à fournir ;
- le montant minimum à l'ouverture ;
- votre grille tarifaire (commission d'intermédiation, droits de garde, accès à la plateforme en ligne) ;
- les moyens de versement que vous acceptez (virement bancaire, mobile money) ;
- le délai d'activation du compte.

[Si vous résidez à l'étranger : Je réside actuellement à [pays] ; merci de m'indiquer la procédure applicable aux non-résidents.]

Dans l'attente de votre retour, je vous prie d'agréer mes salutations distinguées.

[Prénom NOM]
[Téléphone] — [E-mail]`,
  outro:
    "La réponse de la SGI décide de la suite : formulaire en ligne à remplir, ou dossier qu'elle vous envoie à compléter et à lui renvoyer.",
};

/**
 * Le comparateur du Coffre-fort — outil interne (`/coffre/sgi`), nourri des
 * données du projet frère `brvm-tracker`. Il remplace le lien externe qui
 * occupait cette place : l'apprenant compare les frais ET les chiffre sur
 * son propre horizon, sans quitter la check-list.
 */
export const CHECKLIST_COMPARATOR = {
  label: "Comparer les 37 SGI et simuler leurs frais",
  sublabel: "Coffre-fort · frais réels, dépôt minimum, plateforme en ligne",
  href: "/coffre/sgi",
};

export function allStepIds(): string[] {
  return CHECKLIST.flatMap((d) => d.steps.map((s) => s.id));
}

export const CHECKLIST_TOTAL_STEPS = allStepIds().length;
