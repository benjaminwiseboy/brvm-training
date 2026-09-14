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

/**
 * LA ROUTINE DE L'INVESTISSEUR — ce qui vient après le jour 7.
 *
 * La check-list amenait l'apprenant jusqu'à son premier ordre, puis le laissait
 * là. Or c'est précisément après que tout se joue : un investisseur qui n'a pas
 * de rythme finit soit par regarder les cours dix fois par jour, soit par ne
 * plus jamais y revenir. Les deux se terminent mal.
 *
 * Structure par CADENCE, pas par thème : la seule question qui compte ici est
 * « qu'est-ce que je fais, et quand ». Chaque item porte une durée réaliste,
 * pour qu'on puisse réellement le caler dans une semaine.
 *
 * Règle de rédaction du projet (formation lue sans narration) : chaque `body`
 * explique le POURQUOI et le COMMENT — jamais une étiquette seule.
 *
 * Cohérence volontaire avec `CHECKLIST_AFTER` juste en dessous : la routine dit
 * « une fois par semaine », le réflexe dit « pas tous les jours ». Les deux
 * disent la même chose, et se renvoient explicitement l'un à l'autre.
 */
export type RoutineItem = {
  id: string;
  icon: string;
  title: string;
  body: string;
  /** Lien pour passer à l'acte tout de suite. `external` = quitte l'app. */
  link?: { label: string; href: string; external?: boolean };
};

export type RoutineBlock = {
  id: string;
  /** « Chaque semaine », « Chaque mois »… */
  cadence: string;
  /** Le budget-temps honnête de ce bloc. */
  budget: string;
  /** Ce que le bloc sert à obtenir, en une phrase. */
  goal: string;
  items: RoutineItem[];
};

export const ROUTINE_TITLE = "La routine de l'investisseur";

export const ROUTINE_LEAD =
  "Investir n'est pas un événement, c'est une habitude. Voici le rythme d'un investisseur BRVM débutant : **moins de deux heures par mois**, réparties en rendez-vous courts. Tout ce qui n'est pas dans cette liste peut attendre.";

export const INVESTOR_ROUTINE: RoutineBlock[] = [
  {
    id: "hebdo",
    cadence: "Chaque semaine",
    budget: "≈ 15 minutes",
    goal: "Rester familier du marché, sans le subir.",
    items: [
      {
        id: "r-boc",
        icon: "📊",
        title: "Ouvrir le BOC et parcourir vos lignes",
        body: "Le BOC (Bulletin Officiel de la Cote) est le relevé officiel publié par la BRVM à chaque séance : cours de clôture, variation du jour, volume échangé, PER, rendement. Fixez-vous UN rendez-vous hebdomadaire — le samedi matin, par exemple — et relisez calmement les colonnes de vos entreprises. Le but n'est pas de réagir : c'est de garder l'œil entraîné, pour qu'un chiffre anormal vous saute aux yeux le jour où il apparaît. Une fois par semaine suffit largement, et surtout : pas tous les matins (voir les réflexes plus bas).",
        link: {
          label: "Les cours de la séance sur brvm.org",
          href: "https://www.brvm.org/fr/cours-actions/0",
          external: true,
        },
      },
      {
        id: "r-veille",
        icon: "📰",
        title: "Vous informer en 5 minutes avec une newsletter",
        body: "Suivre l'actualité de la BRVM à la source demanderait des heures : communiqués, presse économique, décisions de la BCEAO. Une newsletter quotidienne fait ce tri à votre place et vous livre l'essentiel déjà expliqué. Cauri News résume chaque séance de la BRVM et l'actualité économique africaine dans un langage fait pour les débutants — c'est exactement le niveau dont vous avez besoin après cette formation. Lisez-la quand elle arrive, ou groupez trois éditions le week-end.",
        link: {
          label: "S'abonner à Cauri News",
          href: "https://cauri-news.ghost.io/#/portal/signup",
          external: true,
        },
      },
      {
        id: "r-nouvelles",
        icon: "🔔",
        title: "Vérifier s'il s'est passé quelque chose chez VOS entreprises",
        body: "Vous ne suivez pas les 40 sociétés cotées : vous suivez les deux ou trois que vous détenez. Un communiqué de résultats, un changement de dirigeant, une annonce de dividende, une opération sur le capital — voilà les seules nouvelles qui doivent retenir votre attention. L'espace « actualités » de brvm.org et la page de chaque société suffisent.",
        link: {
          label: "Les sociétés cotées et leurs actualités",
          href: "https://www.brvm.org/fr/emetteurs/societes-cotees",
          external: true,
        },
      },
    ],
  },
  {
    id: "mensuel",
    cadence: "Chaque mois",
    budget: "≈ 30 minutes",
    goal: "Faire grossir le portefeuille, et savoir ce qu'il contient vraiment.",
    items: [
      {
        id: "r-versement",
        icon: "💧",
        title: "Verser votre montant mensuel, quoi qu'il arrive",
        body: "C'est LE rendez-vous qui construit le patrimoine — celui du DCA (l'investissement régulier, module 10). Toujours le même montant, toujours à la même date, sans regarder si le marché monte ou descend. Quand les prix sont bas, votre versement achète mécaniquement plus d'actions ; quand ils sont hauts, il en achète moins. Vous n'avez donc jamais à deviner le bon moment : la régularité le fait pour vous. Mettez une alarme récurrente le jour de votre salaire.",
      },
      {
        id: "r-journal",
        icon: "🧾",
        title: "Mettre à jour votre journal de portefeuille",
        body: "Une ligne par opération : date, valeur, quantité, prix payé, frais. Sans les frais, votre prix de revient est faux — vous vous croirez gagnant avant de l'être. Ce journal est aussi ce qui vous permettra, dans cinq ans, de calculer votre vraie performance (plus-value + dividendes encaissés), au lieu de vous fier à une impression.",
      },
      {
        id: "r-dividendes",
        icon: "📅",
        title: "Suivre les dividendes annoncés et leur date de détachement",
        body: "La date de détachement décide qui touche le dividende : il suffit d'être actionnaire la veille. Notez ces dates pour vos lignes, vérifiez que le versement arrive bien sur votre compte-titres, et décidez à l'avance de ce que vous en faites — le réinvestir est ce qui déclenche les intérêts composés, le retirer transforme votre portefeuille en revenu.",
      },
    ],
  },
  {
    id: "trimestriel",
    cadence: "Chaque trimestre",
    budget: "≈ 1 heure",
    goal: "Vérifier que le portefeuille ressemble toujours à votre plan.",
    items: [
      {
        id: "r-these",
        icon: "📖",
        title: "Relire la thèse de chaque ligne",
        body: "Vous aviez écrit, en une phrase, pourquoi vous achetiez chaque action. Reprenez ces phrases : sont-elles toujours vraies ? Si oui, il n'y a rien à faire, même si le cours a baissé. Si la raison a disparu — l'entreprise a changé de métier, perdu son marché, cessé d'être rentable — alors c'est un vrai motif de vente, le seul avec « mon objectif est atteint ».",
      },
      {
        id: "r-equilibre",
        icon: "⚖️",
        title: "Vérifier votre équilibre entre valeurs et secteurs",
        body: "Avec le temps, la ligne qui monte le plus finit par peser lourd dans le portefeuille — et votre risque se concentre sans que vous l'ayez décidé. Regardez la part de chaque valeur, puis de chaque secteur (banques, télécoms, agro-industrie…). Aucune ligne ne devrait peser au point qu'une mauvaise nouvelle sur elle seule décide de votre année. Le rééquilibrage se fait en douceur : orientez vos prochains versements mensuels vers ce qui est sous-représenté, plutôt que de vendre.",
      },
      {
        id: "r-plan",
        icon: "📄",
        title: "Relire votre plan d'investissement",
        body: "Objectif, horizon, stratégie, capacité d'épargne : votre plan a été écrit à un moment de votre vie, et votre vie bouge. Une naissance, un déménagement, un changement de revenus valent une mise à jour. C'est le document qui vous évitera de changer de stratégie sur un coup de tête.",
        link: { label: "Ouvrir mon plan dans le Coffre-fort", href: "/coffre/plan" },
      },
    ],
  },
  {
    id: "annuel",
    cadence: "Chaque année",
    budget: "≈ 2 heures",
    goal: "Refaire le travail d'analyste, une fois par an, sur pièces neuves.",
    items: [
      {
        id: "r-rapports",
        icon: "🔍",
        title: "Repasser vos entreprises à la méthode des 4 P",
        body: "À la publication des rapports annuels, reprenez chaque ligne comme si vous l'achetiez aujourd'hui : Portrait (que fait-elle exactement), Performance (gagne-t-elle toujours de l'argent, et davantage), Perspectives (son marché va-t-il dans le bon sens), Prix (le cours actuel reste-t-il raisonnable au regard du PER et du rendement). C'est le cœur de la formation, et c'est en le refaisant chaque année qu'il devient un réflexe.",
        link: {
          label: "Rapports annuels et états financiers",
          href: "https://www.brvm.org/fr/rapports-societes-cotees",
          external: true,
        },
      },
      {
        id: "r-fisc",
        icon: "🧮",
        title: "Faire le point fiscal — en général, il n'y a rien à faire",
        body: "L'IRVM sur les dividendes est prélevée à la source : le montant qui arrive sur votre compte est déjà net d'impôt (~12 % en Côte d'Ivoire, 12,5 % au Burkina, 7 % au Niger, 4 % au Bénin). Vérifiez simplement, sur vos avis d'opéré, que le net reçu correspond. C'est aussi le moment de calculer votre performance de l'année à partir de votre journal : plus-value latente + dividendes encaissés − frais.",
      },
      {
        id: "r-montant",
        icon: "📈",
        title: "Réviser à la hausse votre versement mensuel",
        body: "Si vos revenus ont augmenté, votre versement devrait suivre — c'est le levier le plus puissant dont vous disposez, bien plus que le choix de la « bonne » action. Augmenter de quelques milliers de francs par mois change davantage le résultat sur dix ans qu'une année de bourse exceptionnelle.",
      },
    ],
  },
];

export function allRoutineIds(): string[] {
  return INVESTOR_ROUTINE.flatMap((b) => b.items.map((i) => i.id));
}

/**
 * Les réflexes — pas des cases à cocher, pas non plus des rendez-vous
 * d'agenda : l'état d'esprit qui tient la routine ci-dessus debout.
 *
 * Volontairement disjoint d'`INVESTOR_ROUTINE` : ce qui a une fréquence (verser,
 * relire sa thèse, suivre les détachements) vit dans la routine ; ici on ne
 * garde que ce qui n'a pas de date — des attitudes.
 */
export const CHECKLIST_AFTER: { icon: string; title: string; body: string }[] = [
  {
    icon: "📵",
    title: "Le marché n'est pas un tableau de bord à surveiller",
    body: "Un rendez-vous par semaine, c'est le bon rythme. Regarder son portefeuille chaque matin n'améliore aucun rendement : ça ne fait qu'entraîner la panique — et la panique, elle, coûte cher.",
  },
  {
    icon: "🛡️",
    title: "Une baisse de prix n'est pas une raison de vendre",
    body: "Tant que l'entreprise gagne toujours de l'argent, un cours qui recule ne vous a rien pris — vous n'avez perdu que si vous vendez. Les deux seules bonnes raisons de sortir : votre objectif est atteint, ou votre thèse est cassée.",
  },
  {
    icon: "🐢",
    title: "Le temps travaille pour vous, pas la vitesse",
    body: "Ce sont les dividendes réinvestis pendant dix ans qui font la différence, pas le coup réussi de ce trimestre. Chaque fois que vous hésitez, demandez-vous où sera cette entreprise dans cinq ans — pas vendredi.",
  },
  {
    icon: "🚫",
    title: "Méfiez-vous des tuyaux et des rendements promis",
    body: "Personne ne connaît le cours de demain. Une information « sûre » qui circule dans un groupe WhatsApp est soit déjà dans le prix, soit fausse. Vous avez désormais une méthode pour juger par vous-même : elle vaut mieux que n'importe quel conseil gratuit.",
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
