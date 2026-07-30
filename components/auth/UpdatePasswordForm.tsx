"use client";

import { useActionState } from "react";
import { updatePassword } from "@/lib/actions/auth";
import styles from "./AuthCard.module.css";

export function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, undefined);

  return (
    <form action={formAction}>
      {state?.error && <p className={styles.error}>{state.error}</p>}
      <label className={styles.field}>
        <span className={styles.label}>Nouveau mot de passe (8 caractères minimum)</span>
        <input
          className={styles.input}
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </label>
      <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit" disabled={pending}>
        {pending ? "Mise à jour…" : "Mettre à jour le mot de passe"}
      </button>
    </form>
  );
}
