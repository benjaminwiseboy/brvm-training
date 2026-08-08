import type { Metadata, Viewport } from "next";
import { Poppins, Nunito } from "next/font/google";
import { ProgressProvider } from "@/lib/store";
import { resolveInitialProgress } from "@/lib/progress";
import { createClient } from "@/lib/supabase/server";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-poppins" });
const nunito  = Nunito({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "BRVM Learning",
  description: "De zéro à investisseur autonome à la BRVM.",
  appleWebApp: {
    capable: true,
    title: "BRVM Learning",
    statusBarStyle: "black-translucent",
  },
};

// `viewportFit: "cover"` (Fix, critique UX — tabbar bord d'écran) : sans lui,
// `env(safe-area-inset-*)` résout toujours à 0 sur iOS/notch — la tabbar
// fixée au bord bas (AppShell.module.css) ne pourrait pas éviter le home
// indicator.
// `themeColor` = --blue-2 : colore la barre de statut/nav du navigateur et
// l'écran de démarrage PWA (Android) avec le marine de la marque.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0E2F44",
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
  let initialPaymentStatus = null;
  if (user) {
    const [{ data: progressRow }, { data: paymentRow }] = await Promise.all([
      supabase.from("user_progress").select("state").eq("user_id", user.id).maybeSingle(),
      supabase.from("payments").select("status").eq("user_id", user.id).maybeSingle(),
    ]);
    initialProgress = progressRow?.state ? resolveInitialProgress(progressRow.state) : null;
    // Pas de ligne `payments` = jamais marqué payant → traité comme "unpaid"
    // pour l'essai gratuit (cf. lib/progress.ts::isFreeTrialModule), cohérent
    // avec le défaut de la colonne côté DB.
    initialPaymentStatus = paymentRow?.status ?? "unpaid";
  }

  return (
    <html lang="fr" className={`${poppins.variable} ${nunito.variable}`}>
      <body>
        <ProgressProvider
          userId={user?.id ?? null}
          userEmail={user?.email ?? null}
          initialProgress={initialProgress}
          initialPaymentStatus={initialPaymentStatus}
        >
          {children}
          <InstallPrompt />
        </ProgressProvider>
      </body>
    </html>
  );
}
