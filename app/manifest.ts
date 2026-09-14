import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BRVM Learning",
    short_name: "BRVM Learning",
    description: "De zéro à investisseur autonome à la BRVM.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f6fb",   // --paper
    theme_color: "#023362",        // --navy-700, couleur de marque
    lang: "fr",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
