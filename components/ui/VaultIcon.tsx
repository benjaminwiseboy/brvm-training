import type { VaultIconKey } from "@/content/vault";
import { BookOpen, Calendar, Check, Scale, Target, TrendUp, Wallet } from "@/components/ui/Icons";

/**
 * Résout la clé d'icône d'une ressource du Coffre-fort en dessin.
 *
 * Le catalogue (`content/vault.ts`) reste du contenu pur — pas de JSX, donc
 * pas de composant importé là-bas ; c'est ici que la clé devient une icône
 * du jeu partagé avec la landing.
 */
const ICONS: Record<VaultIconKey, (p: { className?: string }) => React.ReactNode> = {
  check: Check,
  target: Target,
  scale: Scale,
  trend: TrendUp,
  book: BookOpen,
  calendar: Calendar,
  wallet: Wallet,
};

export function VaultIcon({ name }: { name: VaultIconKey }) {
  const Ic = ICONS[name];
  return <Ic />;
}
