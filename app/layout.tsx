import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { ProgressProvider } from "@/lib/store";
import { resolveInitialProgress, type ModuleOverrides } from "@/lib/progress";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/user";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { NotificationPrompt } from "@/components/pwa/NotificationPrompt";
import { AccessWatcher } from "@/components/nav/AccessWatcher";
import "./globals.css";

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
// `themeColor` = --navy-700 (#023362, couleur de marque) : colore la barre de statut/nav du navigateur et
// l'écran de démarrage PWA (Android) avec le marine de la marque.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#023362",
};

// Server Component async (lit la session) : rend toute l'app dynamique par
// requête — attendu pour une app authentifiée, cf. plan comptes/admin. Évite
// le flash "état invité" pour un compte connecté : la progression arrive
// avec le premier HTML plutôt qu'après un aller-retour client.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  // Mémoïsé pour la requête : `app/page.tsx` lit la même session pour choisir
  // entre la landing publique et le tableau de bord.
  const user = await getCurrentUser();

  let initialProgress = null;
  let initialPaymentStatus = null;
  const initialModuleOverrides: ModuleOverrides = {};
  if (user) {
    const [{ data: progressRow }, { data: paymentRow }, { data: overrideRows }] = await Promise.all([
      supabase.from("user_progress").select("state").eq("user_id", user.id).maybeSingle(),
      supabase.from("payments").select("status").eq("user_id", user.id).maybeSingle(),
      // Décisions d'accès prises à la main par l'admin. Elles étaient jusqu'ici
      // lues uniquement par `app/module/[code]/page.tsx` : le tableau de bord
      // les ignorait, et continuait donc d'afficher « Plan payant » sur des
      // modules réellement ouverts (cf. lib/progress.ts::isPaywalled).
      supabase.from("module_access_overrides").select("module_code, blocked").eq("user_id", user.id),
    ]);
    initialProgress = progressRow?.state ? resolveInitialProgress(progressRow.state) : null;
    // Pas de ligne `payments` = jamais marqué payant → traité comme "unpaid"
    // pour l'essai gratuit (cf. lib/progress.ts::isFreeTrialModule), cohérent
    // avec le défaut de la colonne côté DB.
    initialPaymentStatus = paymentRow?.status ?? "unpaid";
    for (const row of overrideRows ?? []) {
      initialModuleOverrides[row.module_code] = row.blocked === true;
    }
  }

  return (
    <html lang="fr" className={fontVariables}>
      <body>
        <ProgressProvider
          userId={user?.id ?? null}
          userEmail={user?.email ?? null}
          initialProgress={initialProgress}
          initialPaymentStatus={initialPaymentStatus}
          initialModuleOverrides={initialModuleOverrides}
        >
          {children}
          <InstallPrompt />
          <NotificationPrompt />
          {/* Le déblocage se fait à la main (WhatsApp → admin), pendant que
              l'apprenant a l'app ouverte. Sans ça, il faudrait un rechargement
              complet pour que « Plan payant » disparaisse. */}
          {user && initialPaymentStatus !== "paid" && <AccessWatcher />}
        </ProgressProvider>
      </body>
    </html>
  );
}
