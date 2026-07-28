import type { Metadata, Viewport } from "next";
import { Poppins, Nunito } from "next/font/google";
import { ProgressProvider } from "@/lib/store";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${poppins.variable} ${nunito.variable}`}>
      <body>
        <ProgressProvider>{children}</ProgressProvider>
      </body>
    </html>
  );
}
