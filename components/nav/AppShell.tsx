import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./AppShell.module.css";

/**
 * Coquille de page pour les écrans de module — port du `<header class="top">`
 * de POC-Module-1/index.html, réduit au strict nécessaire pour la Task 10
 * (bouton retour vers le tableau de bord). La Task 11 y ajoutera la
 * sidebar/les onglets de navigation.
 *
 * Aucun état ni gestionnaire d'événement ici (`next/link` fonctionne tel
 * quel dans un Server Component) : pas de `"use client"` — les enfants
 * (ex. `ModulePlayer`, Client Component) restent composables normalement.
 */
export function AppShell({ children }: { children: ReactNode }) {
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
