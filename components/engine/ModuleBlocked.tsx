import Link from "next/link";
import type { Module } from "@/lib/types";
import styles from "./ModuleBlocked.module.css";

export function ModuleBlocked({ module }: { module: Module }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>🔒</div>
      <h1 className={styles.title}>Module verrouillé</h1>
      <p className={styles.text}>
        L&apos;accès à « {module.title} » a été restreint pour votre compte. Contactez l&apos;équipe si vous
        pensez qu&apos;il s&apos;agit d&apos;une erreur.
      </p>
      <Link className={styles.link} href="/">
        ← Retour au tableau de bord
      </Link>
    </div>
  );
}
