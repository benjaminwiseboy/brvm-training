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
