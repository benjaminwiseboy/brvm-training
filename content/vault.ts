import { PHASES, orderedCodes } from "@/content/registry";

/**
 * Catalogue du Coffre-fort — source unique consommée par `VaultCard`
 * (aperçu du tableau de bord), `/coffre` (page complète) et
 * `ParcoursComplete` (annonce de déblocage en fin de parcours).
 *
 * Vient de `components/dashboard/VaultCard.tsx`, où la liste vivait
 * jusqu'ici en dur avec un booléen `unlocked` FIGÉ : la mention
 * « 🔒 Débloqué en Phase X » était purement décorative — rien ne la
 * calculait, et une ressource marquée `unlocked: true` restait de toute
 * façon un `Bientôt` non cliquable. Le déblocage est désormais RÉEL,
 * dérivé de la progression (cf. `isResourceUnlocked`).
 *
 * Déblocage DÉRIVÉ, pas stocké : on ne se sert pas de
 * `ProgressState.unlockedResources` (champ présent mais jamais écrit).
 * Une règle recalculée à chaque rendu ne peut pas diverger de la
 * progression réelle — et surtout elle survit à la synchro multi-appareils
 * sans effort, là où un champ stocké dépendrait du RPC `merge_user_progress`
 * (`supabase/migrations/20260731165330_*.sql`), qui reconstruit l'état avec
 * `jsonb_build_object` et laisse donc tomber toute clé qu'il ne connaît pas.
 */

export type VaultTone = "green" | "gold" | "teal" | "coral" | "blue" | "violet";

/**
 * Icône de la carte — une CLÉ, pas un glyphe : le dessin vit dans le jeu
 * partagé avec la landing (`components/ui/Icons.tsx`), résolu par
 * `components/ui/VaultIcon.tsx`. Ce fichier reste du contenu pur, sans JSX.
 */
export type VaultIconKey =
  | "check"
  | "target"
  | "scale"
  | "trend"
  | "book"
  | "calendar"
  | "wallet";

/**
 * Condition de déblocage :
 * - `always` : disponible dès le premier jour ;
 * - `phase` : tous les modules de la phase N terminés (1-indexé, comme
 *   l'affichage « Phase 3 » — `PHASES[0]` = Phase 1) ;
 * - `parcours` : les 28 modules terminés.
 */
export type VaultGate =
  | { kind: "always" }
  | { kind: "phase"; index: number }
  | { kind: "parcours" };

export type VaultResource = {
  id: string;
  icon: VaultIconKey;
  name: string;
  desc: string;
  tone: VaultTone;
  gate: VaultGate;
  /**
   * Route de l'outil quand il existe VRAIMENT — la carte devient alors un
   * lien cliquable, depuis le tableau de bord comme depuis l'onglet
   * Coffre-fort, dès que sa condition de déblocage est remplie. Sans
   * `href`, la carte reste un « Bientôt » : c'est le cas de tous les outils
   * encore à construire, et c'est volontaire — afficher « Disponible » sur
   * un outil inexistant serait la même promesse creuse que celle qui a
   * envoyé un bêta-testeur poser sa question sur WhatsApp.
   */
  href?: string;
};

export const RESOURCES: VaultResource[] = [
  // Ordre volontaire : les ressources RÉELLEMENT construites d'abord.
  // L'aperçu du tableau de bord ne montre que les 4 premières — les outils
  // qui existent doivent y être cliquables depuis l'accueil, pas relégués
  // derrière des cartes « Bientôt » dans l'onglet Coffre-fort.
  {
    id: "checklist-7-jours",
    icon: "check",
    name: "Check-list « 7 premiers jours »",
    desc: "Le plan jour par jour pour ouvrir votre compte, passer votre premier ordre — puis la routine à tenir ensuite.",
    tone: "gold",
    gate: { kind: "parcours" },
    href: "/coffre/checklist",
  },
  {
    id: "plan-investissement",
    icon: "target",
    name: "Plan d'Investissement Personnel",
    // Verrou ramené de la Phase 4 à la Phase 2 : c'est le module 09 qui fait
    // construire le plan, et il est en Phase 2. L'ancienne valeur promettait
    // la ressource deux phases APRÈS que l'apprenant l'ait remplie.
    desc: "Vos 5 piliers — objectif, horizon, stratégie, profil, capacité. À relire et à modifier.",
    tone: "coral",
    gate: { kind: "phase", index: 2 },
    href: "/coffre/plan",
  },
  {
    id: "comparateur-sgi",
    icon: "scale",
    name: "Comparateur de SGI",
    desc: "Les 37 courtiers agréés, leurs frais réels, et ce qu'ils coûtent sur 10 ans.",
    tone: "teal",
    // Débloqué à l'entrée en Phase 3 « Passage à l'action » (donc dès la
    // Phase 2 terminée) : c'est le module 11 qui envoie choisir sa SGI, et
    // l'outil doit être là PENDANT ce module, pas après.
    gate: { kind: "phase", index: 2 },
    href: "/coffre/sgi",
  },
  {
    id: "glossaire",
    icon: "book",
    name: "Glossaire interactif",
    desc: "61 termes expliqués simplement — et cliquables au fil des cours.",
    tone: "blue",
    // Aucune condition, et ce n'est pas un oubli : un dictionnaire sert à
    // traverser les modules qu'on n'a PAS encore finis. Le verrouiller
    // derrière une phase le retirerait exactement à ceux qui en ont besoin.
    gate: { kind: "always" },
    href: "/coffre/glossaire",
  },
];

export function getResource(id: string): VaultResource | undefined {
  return RESOURCES.find((r) => r.id === id);
}

/** Libellé court de la condition, pour le « 🔒 Débloqué en … » des cartes. */
export function gateLabel(gate: VaultGate): string {
  if (gate.kind === "parcours") return "fin du parcours";
  if (gate.kind === "phase") return `Phase ${gate.index}`;
  return "";
}

/**
 * Les 28 modules du parcours sont-ils tous terminés ?
 *
 * C'est la règle de déblocage de la check-list : « seulement quand on
 * finit la dernière phase » (règle produit posée par le porteur du projet).
 * Le parcours étant linéaire — chaque module se déverrouille à la fin du
 * précédent, cf. `deriveModuleState` — terminer la dernière phase et
 * terminer les 28 modules sont une seule et même chose ; on teste donc
 * l'ordre complet, qui est aussi ce qu'atteste le certificat.
 */
export function isParcoursComplete(completed: Record<string, unknown>): boolean {
  const order = orderedCodes();
  return order.length > 0 && order.every((code) => completed[code] !== undefined);
}

export function isResourceUnlocked(
  resource: VaultResource,
  completed: Record<string, unknown>
): boolean {
  const { gate } = resource;
  if (gate.kind === "always") return true;
  if (gate.kind === "parcours") return isParcoursComplete(completed);
  const phase = PHASES[gate.index - 1];
  // Une phase inconnue (index hors bornes après un remaniement du parcours)
  // laisse la ressource verrouillée plutôt que de la libérer par accident.
  if (!phase) return false;
  return phase.codes.every((code) => completed[code] !== undefined);
}
