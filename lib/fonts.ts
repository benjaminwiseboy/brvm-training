import { JetBrains_Mono, Nunito, Poppins } from "next/font/google";

/**
 * Polices de la marque — une seule déclaration pour tout le produit
 * (application ET landing publique), posée sur `<html>` par app/layout.tsx.
 *
 * Retour à Poppins/Nunito (demande explicite, 07/09/2026) : la landing avait
 * amené Space Grotesk/Manrope, qu'on avait ensuite étendus à l'app. Les deux
 * moitiés repartent donc sur la typographie d'origine de l'application.
 *
 * - `display` (Poppins) : titres, chiffres de marque, libellés de nav.
 * - `body` (Nunito) : tout le texte courant.
 * - `mono` (JetBrains Mono) : étiquettes capitales, codes de module, données.
 *
 * `next/font` ne dédoublonne pas entre deux points d'appel : ce module
 * partagé est le seul moyen de ne télécharger chaque police qu'une fois.
 */

/** Poppins n'existe qu'en statique : les poids doivent être listés.
 *  400→800 couvre tout ce que le projet utilise (`strong` monte à 800). */
export const display = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

/** Nunito est une variable font (200→1000) : pas de `weight` à lister, et le
 *  450 du texte courant est rendu tel quel plutôt qu'arrondi au palier. */
export const body = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/** À poser sur `<html>` : rend `--font-display`/`--font-body`/`--font-mono` disponibles partout. */
export const fontVariables = `${display.variable} ${body.variable} ${mono.variable}`;
