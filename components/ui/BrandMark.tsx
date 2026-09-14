/**
 * Monogramme BRVM Learning — carré marine arrondi, liseré or, lettre or.
 *
 * Une seule définition pour tout le produit : la landing, la coquille de
 * l'app, les écrans d'authentification, l'onboarding, l'invite d'installation
 * et l'espace admin en avaient chacun une copie (rond dégradé ici, carré
 * là), qui divergeaient à chaque retouche. Le style vit dans la classe
 * globale `.brandmark` (app/globals.css) ; `size` ne pilote qu'une variable
 * CSS, tout le reste suit.
 */
export function BrandMark({
  size = 38,
  className = "",
}: {
  /** Côté du carré, en pixels. Le rayon et la taille de lettre suivent. */
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`brandmark ${className}`.trim()}
      style={{ "--brandmark-size": `${size}px` } as React.CSSProperties}
      aria-hidden="true"
    >
      B
    </span>
  );
}
