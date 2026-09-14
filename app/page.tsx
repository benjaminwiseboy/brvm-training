import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/supabase/user";
import { HomeDashboard } from "@/components/home/HomeDashboard";
import { Landing } from "@/components/landing/Landing";

/**
 * `/` sert deux publics :
 * - visiteur non connecté → la landing publique (proxy.ts laisse passer "/") ;
 * - apprenant connecté → son tableau de bord, comme avant.
 *
 * Garder la même URL évite de toucher aux liens « Accueil » de la sidebar, au
 * bouton « Quitter le module » et aux `redirect("/")` des actions serveur.
 */
export const metadata: Metadata = {
  title: "BRVM Learning — De zéro à investisseur autonome à la BRVM",
  description:
    "La méthode interactive, pas à pas et 100 % pratique pour investir sur la Bourse Régionale des Valeurs Mobilières. 28 modules, 5 minutes par jour, sans jargon financier.",
};

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) return <Landing />;

  return <HomeDashboard />;
}
