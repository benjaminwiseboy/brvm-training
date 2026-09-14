/**
 * Le monogramme est partagé avec l'application depuis l'unification des
 * chartes : il vit dans `components/ui/BrandMark.tsx`. Ce fichier ne garde
 * que l'export par défaut attendu par les sections de la landing.
 */
import { BrandMark } from "@/components/ui/BrandMark";

export default function LandingBrandMark({ className = "" }: { className?: string }) {
  return <BrandMark size={36} className={className} />;
}
