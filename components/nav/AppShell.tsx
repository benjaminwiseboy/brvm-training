"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useProgress, deriveStatus } from "@/lib/store";
import { money } from "@/lib/format";
import styles from "./AppShell.module.css";

/**
 * Coquille de page — deux variantes (Task 11) :
 * - `"module"` (défaut, inchangé depuis la Task 10) : `<header class="top">`
 *   + bouton retour, pour les écrans de module.
 * - `"dash"` : sidebar fixe desktop / barre d'onglets flottante mobile,
 *   port de POC-Module-1/dashboard.html + dashboard.js (buildSidebarNav,
 *   buildTabbar) + styles.css (.sidebar, .tabbar, .top__right .wallet…).
 *
 * `"use client"` : la variante "dash" lit `useProgress()` (portefeuille,
 * statut) et attache `onClick={reset}` sur le bouton « Réinitialiser » du
 * bloc profil. Next.js autorise un Client Component à recevoir des enfants
 * Server-rendered via `children` (cf. node_modules/next/dist/docs/.../
 * 05-server-and-client-components.md) : `app/module/[code]/page.tsx` (Server
 * Component) continue de fonctionner tel quel en lui passant `<ModulePlayer/>`.
 *
 * Bascule sidebar ↔ onglets : gap #2 du brief — pas de cascade globale
 * `body.dash-page` (les CSS Modules ne se partagent pas entre fichiers) ;
 * à la place, la sidebar/le tabbar ne sont **rendus dans le JSX** que pour
 * `variant === "dash"` (les pages de module ne les reçoivent jamais), et un
 * `@media (min-width: 901px)` dans AppShell.module.css décide laquelle,
 * parmi les variantes déjà rendues, est visible (voir ce fichier).
 */
type NavItem = { ic: string; label: string; href: string; active?: boolean };

// Port de navItems() dans POC-Module-1/dashboard.js. Seules "Accueil" (/) et
// "Coffre-fort" (/coffre, Task 13) ont une route réelle dans ce plan v0 —
// "Parcours"/"Progrès"/"Profil" restent des ancres "#" comme dans le POC
// (mockup statique, jamais câblées à une vraie page).
const NAV_ITEMS: NavItem[] = [
  { ic: "🏠", label: "Accueil", href: "/", active: true },
  { ic: "🗺️", label: "Parcours", href: "#" },
  { ic: "📊", label: "Progrès", href: "#" },
  { ic: "🗝️", label: "Coffre-fort", href: "/coffre" },
  { ic: "👤", label: "Profil", href: "#" },
];

export function AppShell({ children, variant = "module" }: { children: ReactNode; variant?: "dash" | "module" }) {
  if (variant === "dash") return <DashShell>{children}</DashShell>;

  return (
    <div className={styles.shell}>
      <header className={styles.top}>
        <div className={styles.bar}>
          <Link
            className={styles.backbtn}
            href="/"
            aria-label="Retour au tableau de bord"
            title="Tableau de bord"
          >
            ←
          </Link>
          <div className={styles.brand}>
            <span className={styles.brandMark}>B</span>
            <span className={styles.brandName}>BRVM Learning</span>
          </div>
        </div>
      </header>
      <main className={styles.stage}>{children}</main>
    </div>
  );
}

function DashShell({ children }: { children: ReactNode }) {
  const { state, reset } = useProgress();
  const doneCount = Object.keys(state.completed).length;
  const status = deriveStatus(doneCount);

  return (
    <div className={styles.dashShell}>
      <aside className={styles.sidebar} aria-label="Navigation principale">
        <div className={styles.sidebarBrand}>
          <span className={styles.brandMark}>B</span>
          <div>
            <div className={styles.brandName}>BRVM Learning</div>
            <div className={styles.brandSub}>Tableau de bord</div>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {NAV_ITEMS.map((it) => (
            <Link
              key={it.label}
              href={it.href}
              className={`${styles.navitem} ${it.active ? styles.navitemActive : ""}`}
            >
              <span className={styles.navitemIc}>{it.ic}</span>
              <span>{it.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFoot}>
          <div className={styles.sbwallet}>
            <div className={styles.sbwalletLabel}>Portefeuille</div>
            <div className={styles.sbwalletAmt}>
              {money(state.capital)}
              <span className={styles.cur}>FCFA</span>
            </div>
            <div className={styles.sbwalletStatus}>
              <span>{status.emoji}</span> <span>{status.label}</span>
            </div>
          </div>

          <div className={styles.sbuser}>
            <div className={styles.avatar} aria-hidden="true">
              👤
            </div>
            <div className={styles.sbuserMeta}>
              <div className={styles.sbuserName}>Mon profil</div>
              {/* Pas de nom d'apprenant réel en v0 (pas de compte) — cf. Hero/
                  ResumeCard : on évite d'inventer une identité factice. */}
              <button type="button" className={styles.resetBtn} onClick={reset}>
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </aside>

      <header className={styles.dashTop}>
        <div className={styles.dashTopBar}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>B</span>
            <div>
              <div className={styles.brandName}>BRVM Learning</div>
              <div className={styles.brandSub}>Tableau de bord</div>
            </div>
          </div>
          <div className={styles.topWallet}>
            <div className={styles.topWalletMeta}>
              <div className={styles.topWalletLabel}>Portefeuille</div>
              <div className={styles.topWalletAmount}>
                {money(state.capital)}
                <span className={styles.cur}>FCFA</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.dashMain}>{children}</main>

      <nav className={styles.tabbar} aria-label="Navigation principale (mobile)">
        {NAV_ITEMS.map((it) => (
          <Link key={it.label} href={it.href} className={`${styles.tab} ${it.active ? styles.tabActive : ""}`}>
            <span className={styles.tabIc}>{it.ic}</span>
            <span>{it.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
