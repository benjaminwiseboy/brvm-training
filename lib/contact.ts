/**
 * Contact direct du porteur du projet — source unique du numéro WhatsApp,
 * jusqu'ici recopié dans chaque écran qui propose d'écrire (PhaseComplete,
 * ParcoursComplete). Un numéro dupliqué finit toujours par ne changer qu'à
 * moitié le jour où il change.
 *
 * Format `wa.me` : chiffres seuls, sans « + » ni espaces.
 */
export const WHATSAPP_NUMBER = "33754232300";

/** Lien wa.me avec message pré-rempli — l'apprenant n'a plus qu'à envoyer. */
export function whatsappHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Offre d'accompagnement PAYANTE, proposée là où l'apprenant risque de
 * caler dans le monde réel : l'ouverture du compte-titres (module « Ouvrir
 * son compte SGI ») et la check-list « 7 premiers jours ».
 *
 * Elle est annoncée comme payante partout où elle apparaît : une formation
 * qui glisse un service commercial sans le dire perd la confiance qu'elle
 * vient de construire.
 */
export const ACCOMPAGNEMENT = {
  title: "Besoin d'être accompagné pour ouvrir votre compte ?",
  body:
    "Si vous préférez ne pas le faire seul, je peux vous accompagner pas à pas : choix de la SGI selon votre budget, rédaction de votre e-mail, relecture de votre dossier et de votre premier ordre.",
  note: "Service d'accompagnement personnalisé, payant, indépendant de la formation.",
  cta: "Demander un accompagnement",
  sublabel: "Service personnalisé payant · réponse sur WhatsApp",
  message:
    "Bonjour ! Je suis la formation BRVM Learning et je souhaite être accompagné(e) pour ouvrir mon compte-titres chez une SGI. Pouvez-vous m'indiquer les modalités de votre accompagnement ?",
} as const;

/** Lien WhatsApp de l'offre d'accompagnement, prêt à poser sur un bouton. */
export const ACCOMPAGNEMENT_HREF = whatsappHref(ACCOMPAGNEMENT.message);

/**
 * Déblocage du parcours complet — affiché sur l'écran d'un module verrouillé
 * (`components/engine/ModuleBlocked.tsx`).
 *
 * Pourquoi ce bloc existe : dire « vous n'avez pas accès » sans dire comment
 * l'obtenir, c'est un mur. La fin de la Phase 1 (`PhaseComplete`) proposait
 * déjà d'écrire sur WhatsApp ; ce même chemin manquait à la porte fermée, qui
 * est pourtant l'endroit où l'envie est la plus forte — on vient de cliquer.
 *
 * Il n'y a PAS de paiement en ligne : le parcours se débloque à la main, après
 * échange direct. Les étapes le disent telles quelles, sans promettre de prix
 * ni de délai que ce fichier ne peut pas tenir.
 */
export const DEBLOCAGE = {
  title: "Comment débloquer l'accès ?",
  intro:
    "Le paiement ne se fait pas en ligne : on en parle d'abord, directement. Voici les trois étapes, elles prennent quelques minutes.",
  steps: [
    {
      icon: "💬",
      title: "Écrivez-moi sur WhatsApp",
      body: "Le message est déjà prêt : vous n'avez qu'à l'envoyer. Je vous réponds avec le tarif et les moyens de paiement acceptés (mobile money, virement).",
    },
    {
      icon: "✅",
      title: "Vous réglez, une seule fois",
      body: "Un paiement unique ouvre l'intégralité du parcours — pas d'abonnement, rien à renouveler chaque mois.",
    },
    {
      icon: "🔓",
      title: "J'ouvre votre compte",
      body: "J'active l'accès sur le compte avec lequel vous êtes connecté. Vous reprenez exactement là où vous vous êtes arrêté, votre progression et votre portefeuille intacts.",
    },
  ],
  cta: "Débloquer sur WhatsApp",
  /** Message pré-rempli — le titre du module dit à quoi la personne se heurte. */
  message: (moduleTitle: string) =>
    `Bonjour ! Je suis la formation BRVM Learning et je viens de tomber sur le module « ${moduleTitle} », qui est verrouillé. Comment débloquer l'accès au parcours complet ?`,
} as const;

/** Lien WhatsApp de déblocage pour un module donné. */
export function deblocageHref(moduleTitle: string): string {
  return whatsappHref(DEBLOCAGE.message(moduleTitle));
}

/**
 * Blocage posé à la main par l'admin (et non le paywall) : ce n'est pas une
 * offre, c'est une anomalie à signaler. Même canal, message différent.
 */
export const BLOCAGE_ADMIN = {
  cta: "Signaler sur WhatsApp",
  message: (moduleTitle: string) =>
    `Bonjour ! Le module « ${moduleTitle} » est indiqué comme restreint sur mon compte BRVM Learning. Pouvez-vous vérifier ?`,
} as const;

export function blocageAdminHref(moduleTitle: string): string {
  return whatsappHref(BLOCAGE_ADMIN.message(moduleTitle));
}
