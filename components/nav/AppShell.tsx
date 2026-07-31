"use client";

import { type ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProgress, deriveStatus } from "@/lib/store";
import { money } from "@/lib/format";
import { NavGuardProvider, GuardedLink, useNavGuardActive, useModulePhaseIndex } from "@/lib/navGuard";
import { logout } from "@/lib/actions/auth";
import styles from "./AppShell.module.css";

/**
 * Coquille de page — deux variantes :
 * - `"module"` (défaut) : écrans de module — `<header class="top">` (code +
 *   titre du module courant, tronqués si besoin, + portefeuille) au-dessus
 *   du stepper de progression et du contenu. Pas de bouton retour : il
 *   faisait doublon avec "Accueil" dans la sidebar, désormais persistante
 *   (cf. `Sidebar` ci-dessous) sur les deux formats d'écran.
 * - `"dash"` : tableau de bord — `<header class="dashTop">` (marque +
 *   portefeuille complet), visible seulement en mobile (la sidebar affiche
 *   déjà le portefeuille en desktop).
 *
 * Les deux variantes partagent la MÊME navigation persistante — `Sidebar`
 * (desktop ≥901px, fixe à gauche) et `Tabbar` (mobile, fixée au bord bas) —
 * portée depuis POC-Module-1/dashboard.html+js.
 *
 * `NavGuardProvider` (Fix P1, critique UX) : la nav persistante reste
 * cliquable même pendant un défi de module, où quitter perd les réponses en
 * cours. Les items réels de `Sidebar`/`Tabbar` passent par `GuardedLink`,
 * qui demande confirmation quand `ModulePlayer` a activé la garde
 * (`useConfirmBeforeLeaving`, cf. lib/navGuard.tsx). Les ancres "#" (pas
 * encore câblées à une vraie page) restent de simples `Link` : rien à
 * perdre à les cliquer.
 */
type NavItem = { ic: string; label: string; href: string };

// Port de navItems() dans POC-Module-1/dashboard.js. Les 4 items pointent
// maintenant tous vers une route réelle — "Progrès" (jamais câblé, ancre
// "#" depuis le POC) a été retiré plutôt que laissé mort.
const NAV_ITEMS: NavItem[] = [
  { ic: "🏠", label: "Accueil", href: "/" },
  { ic: "🗺️", label: "Parcours", href: "/parcours" },
  { ic: "🗝️", label: "Coffre-fort", href: "/coffre" },
  { ic: "👤", label: "Profil", href: "/profil" },
];

// Mêmes 4 libellés que POC-Module-1/app.js (`var STEPS = [...]`) — l'index
// vient de ModulePlayer via `useModulePhaseIndex()` (lib/navGuard.tsx).
const PHASE_LABELS = ["Intro", "Cours", "Défi", "Bilan"];

type ModuleInfo = { code: string; title: string; phase: string };

export function AppShell({
  children,
  variant = "module",
  moduleInfo,
}: {
  children: ReactNode;
  variant?: "dash" | "module";
  /** Calculé côté page.tsx (Server Component, qui a déjà `mod.code`/
   * `mod.title`/`mod.phase`) pour ne pas dupliquer `getModule()` ici —
   * affiché dans le header de la variante "module" (cf. ModuleShell). */
  moduleInfo?: ModuleInfo;
}) {
  return (
    <NavGuardProvider>
      {variant === "dash" ? (
        <DashShell>{children}</DashShell>
      ) : (
        <ModuleShell moduleInfo={moduleInfo}>{children}</ModuleShell>
      )}
    </NavGuardProvider>
  );
}

/**
 * Masque le header (`.top`/`.dashTop`) au scroll vers le bas, le réaffiche
 * au scroll vers le haut (Fix, demande explicite — "rend la lecture
 * touffue" en restant fixé en permanence). Toujours visible tant qu'on n'a
 * pas dépassé `REVEAL_THRESHOLD` : évite qu'un minuscule scroll near-top
 * (rebond iOS, etc.) fasse disparaître le header juste après l'arrivée sur
 * la page. Le seuil de direction (`DIRECTION_THRESHOLD`) filtre le bruit
 * des micro-scrolls qui ne traduisent pas une intention de lire vers le
 * haut ou le bas. Actif sur toutes les tailles d'écran (Fix, demande
 * explicite) — `.headerHidden` (AppShell.module.css) n'est plus restreint
 * au mobile.
 */
const REVEAL_THRESHOLD = 40;
const DIRECTION_THRESHOLD = 4;

function useAutoHideHeader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        if (y < REVEAL_THRESHOLD) {
          setHidden(false);
        } else if (delta > DIRECTION_THRESHOLD) {
          setHidden(true);
        } else if (delta < -DIRECTION_THRESHOLD) {
          setHidden(false);
        }
        lastY = y;
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}

function ModuleShell({ children, moduleInfo }: { children: ReactNode; moduleInfo?: ModuleInfo }) {
  return (
    <div className={styles.shell}>
      <Sidebar variant="module" />

      {/* Fix, alignement maquette : plus un bandeau sticky pleine largeur, mais
          une ligne compacte alignée sur la même colonne que la carte du
          module (`.stage`, cf. plus bas) — pas de fond, elle défile avec le
          contenu comme dans la maquette. */}
      <header className={styles.top}>
        <div className={styles.bar}>
          {/* En-tête épurée (Fix, alignement maquette) : croix + numéro/titre du
              module + stepper — plus de portefeuille (déjà dans la sidebar) ni
              de nom de phase (redondant avec le stepper juste en dessous). */}
          {/* Croix de sortie — passe par GuardedLink, pas un <Link> nu : respecte
              automatiquement la garde "Quitter le défi ?" posée par ModulePlayer
              pendant la phase "défi" (même protection que les liens de la
              sidebar), sans logique dédiée. */}
          <GuardedLink href="/" className={styles.closeBtn} aria-label="Quitter le module">
            ✕
          </GuardedLink>
          {moduleInfo && (
            <div className={styles.moduleInfo}>
              <span className={styles.moduleCode}>{moduleInfo.code}</span> · {moduleInfo.title}
            </div>
          )}
        </div>

        <ModuleStepper />
      </header>

      <main className={styles.stage}>{children}</main>

      <Tabbar />
    </div>
  );
}

function DashShell({ children }: { children: ReactNode }) {
  const { state } = useProgress();
  const headerHidden = useAutoHideHeader();

  return (
    <div className={styles.dashShell}>
      <Sidebar variant="dash" />

      <header className={`${styles.dashTop} ${headerHidden ? styles.headerHidden : ""}`}>
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

      <Tabbar />
    </div>
  );
}

/**
 * Progression du module (Fix P1, critique UX) — barres segmentées dans le
 * header, design repris tel quel de POC-Module-1 (`.stepper`/`.stepper__seg`
 * dans `<header class="top">`, `setStep()` dans app.js) plutôt qu'une
 * réinvention. `aria-hidden` comme dans le POC : décoratif, l'info de phase
 * n'est pas au cœur de la tâche de l'utilisateur à cet instant.
 */
function ModuleStepper() {
  const currentIdx = useModulePhaseIndex();
  if (currentIdx === null) return null; // avant que ModulePlayer n'ait reporté sa phase

  return (
    <div className={styles.stepper} aria-hidden="true">
      {PHASE_LABELS.map((label, i) => (
        <div
          key={label}
          className={[
            styles.stepperSeg,
            i === currentIdx ? styles.stepperSegActive : "",
            i < currentIdx ? styles.stepperSegDone : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className={styles.stepperTrack}>
            <div className={styles.stepperFill} />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Navigation persistante desktop (≥901px, cf. le `@media` d'AppShell.module.css) —
 * partagée par les deux variantes, jamais un tiroir/overlay temporaire.
 *
 * `variant` ne change QUE le bloc portefeuille du pied de sidebar : sur une
 * page de module, le header affiche déjà le montant animé (élément
 * signature de `Wallet`, cf. Wallet.tsx) — le répéter ici serait redondant.
 * La sidebar y montre alors le statut/rang seul ; le montant complet
 * (+ FCFA) reste réservé au tableau de bord, qui n'a pas de portefeuille
 * animé dans son propre header.
 */
function Sidebar({ variant }: { variant: "dash" | "module" }) {
  const pathname = usePathname();
  const { state, userEmail } = useProgress();
  const doneCount = Object.keys(state.completed).length;
  const status = deriveStatus(doneCount);
  // Fix P2 (critique UX) : estompée pendant un défi de module (même signal
  // que la garde de sortie) au lieu de concurrencer visuellement la tâche en
  // cours — jamais masquée, juste retirée du premier plan.
  const dimmed = useNavGuardActive();

  return (
    <aside
      className={`${styles.sidebar} ${dimmed ? styles.chromeDim : ""}`}
      aria-label="Navigation principale"
    >
      <div className={styles.sidebarBrand}>
        <span className={styles.brandMark}>B</span>
        <div>
          <div className={styles.brandName}>BRVM Learning</div>
          <div className={styles.brandSub}>Navigation</div>
        </div>
      </div>

      <nav className={styles.sidebarNav}>
        {NAV_ITEMS.map((it) => {
          const ItemLink = it.href === "#" ? Link : GuardedLink;
          return (
            <ItemLink
              key={it.label}
              href={it.href}
              className={`${styles.navitem} ${pathname === it.href ? styles.navitemActive : ""}`}
            >
              <span className={styles.navitemIc}>{it.ic}</span>
              <span>{it.label}</span>
            </ItemLink>
          );
        })}
      </nav>

      <div className={styles.sidebarFoot}>
        {variant === "dash" ? (
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
        ) : (
          <div className={styles.sbwallet}>
            <div className={styles.sbwalletLabel}>Statut</div>
            <div className={styles.sbwalletStatusBig}>
              <span>{status.emoji}</span> <span>{status.label}</span>
            </div>
          </div>
        )}

        <div className={styles.sbuser}>
          <div className={styles.avatar} aria-hidden="true">
            👤
          </div>
          <div className={styles.sbuserMeta}>
            <div className={styles.sbuserName}>{userEmail ?? "Mon profil"}</div>
            {/* "Réinitialiser" vivait ici (Fix P0, critique UX initiale) — déplacé
                dans /profil (Fix, demande explicite : trop à portée d'un clic
                accidentel dans la sidebar, toujours visible). */}
            {userEmail && (
              <div className={styles.sbuserActions}>
                <form action={logout}>
                  <button type="submit" className={styles.logoutBtn}>
                    Se déconnecter
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

/** Barre d'onglets flottante mobile (<901px) — équivalent de `Sidebar` en dessous du seuil desktop. */
function Tabbar() {
  const pathname = usePathname();
  const dimmed = useNavGuardActive();

  return (
    <nav
      className={`${styles.tabbar} ${dimmed ? styles.chromeDim : ""}`}
      aria-label="Navigation principale (mobile)"
    >
      {NAV_ITEMS.map((it) => {
        const ItemLink = it.href === "#" ? Link : GuardedLink;
        return (
          <ItemLink
            key={it.label}
            href={it.href}
            className={`${styles.tab} ${pathname === it.href ? styles.tabActive : ""}`}
          >
            <span className={styles.tabIc}>{it.ic}</span>
            <span>{it.label}</span>
          </ItemLink>
        );
      })}
    </nav>
  );
}
