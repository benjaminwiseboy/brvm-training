"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/auth";
import styles from "./AuthCard.module.css";

export function ResetPasswordRequestForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, undefined);

  if (state?.message) {
    return <p className={styles.success}>{state.message}</p>;
  }

  return (
    <form action={formAction}>
      {state?.error && <p className={styles.error}>{state.error}</p>}
      <label className={styles.field}>
        <span className={styles.label}>Email</span>
        <input className={styles.input} type="email" name="email" required autoComplete="email" />
      </label>
      <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit" disabled={pending}>
        {pending ? "Envoi…" : "Envoyer le lien de réinitialisation"}
      </button>
      <p className={styles.footer}>
        <Link href="/login">Retour à la connexion</Link>
      </p>
    </form>
  );
}
