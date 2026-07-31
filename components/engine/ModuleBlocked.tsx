import Link from "next/link";
import type { Module } from "@/lib/types";
import styles from "./ModuleBlocked.module.css";

const COPY = {
  admin: {
    title: "Module verrouillé",
    text: (title: string) => (
      <>
        L&apos;accès à « {title} » a été restreint pour votre compte. Contactez l&apos;équipe si vous pensez qu&apos;il
        s&apos;agit d&apos;une erreur.
      </>
    ),
  },
  payment: {
    title: "Essai gratuit terminé",
    text: () => (
      <>L&apos;essai gratuit de la plateforme est terminé. Passez à un plan payant pour continuer votre parcours.</>
    ),
  },
};

export function ModuleBlocked({ module, reason = "admin" }: { module: Module; reason?: "admin" | "payment" }) {
  const copy = COPY[reason];
  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>🔒</div>
      <h1 className={styles.title}>{copy.title}</h1>
      <p className={styles.text}>{copy.text(module.title)}</p>
      <Link className={styles.link} href="/">
        ← Retour au tableau de bord
      </Link>
    </div>
  );
}
