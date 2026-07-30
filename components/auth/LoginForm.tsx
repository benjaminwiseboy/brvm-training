"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login } from "@/lib/actions/auth";
import styles from "./AuthCard.module.css";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  return (
    <form action={formAction}>
      <input type="hidden" name="next" value={next} />
      {state?.error && <p className={styles.error}>{state.error}</p>}
      <label className={styles.field}>
        <span className={styles.label}>Email</span>
        <input className={styles.input} type="email" name="email" required autoComplete="email" />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Mot de passe</span>
        <input
          className={styles.input}
          type="password"
          name="password"
          required
          autoComplete="current-password"
        />
      </label>
      <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
      <p className={styles.footer}>
        <Link href="/reset-password">Mot de passe oublié ?</Link>
      </p>
      <p className={styles.footer}>
        Pas encore de compte ? <Link href="/signup">S&apos;inscrire</Link>
      </p>
    </form>
  );
}
