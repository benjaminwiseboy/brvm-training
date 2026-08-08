import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BRVM Learning",
    short_name: "BRVM Learning",
    description: "De zéro à investisseur autonome à la BRVM.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F4F1",
    theme_color: "#0E2F44",
    lang: "fr",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
