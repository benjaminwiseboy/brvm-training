import type { Metadata, Viewport } from "next";
import { Poppins, Nunito } from "next/font/google";
import { ProgressProvider, resolveInitialProgress } from "@/lib/store";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-poppins" });
const nunito  = Nunito({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "BRVM Learning",
  description: "De zéro à investisseur autonome à la BRVM.",
};

// `viewportFit: "cover"` (Fix, critique UX — tabbar bord d'écran) : sans lui,
// `env(safe-area-inset-*)` résout toujours à 0 sur iOS/notch — la tabbar
// fixée au bord bas (AppShell.module.css) ne pourrait pas éviter le home
// indicator.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Server Component async (lit la session) : rend toute l'app dynamique par
// requête — attendu pour une app authentifiée, cf. plan comptes/admin. Évite
// le flash "état invité" pour un compte connecté : la progression arrive
// avec le premier HTML plutôt qu'après un aller-retour client.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialProgress = null;
  if (user) {
    const { data } = await supabase.from("user_progress").select("state").eq("user_id", user.id).maybeSingle();
    initialProgress = data?.state ? resolveInitialProgress(data.state) : null;
  }

  return (
    <html lang="fr" className={`${poppins.variable} ${nunito.variable}`}>
      <body>
        <ProgressProvider userId={user?.id ?? null} userEmail={user?.email ?? null} initialProgress={initialProgress}>
          {children}
        </ProgressProvider>
      </body>
    </html>
  );
}
