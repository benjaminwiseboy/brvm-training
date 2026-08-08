"use client";

import { useActionState, useRef } from "react";
import Link from "next/link";
import { signup } from "@/lib/actions/auth";
import { STORAGE_KEY } from "@/lib/store";
import { GoogleAuthButton } from "./GoogleAuthButton";
import styles from "./AuthCard.module.css";

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, undefined);
  const localProgressRef = useRef<HTMLInputElement>(null);

  // Lu au moment de la soumission (pas au montage) : capture la progression
  // locale la plus à jour possible avant de l'envoyer au Server Action, qui
  // ne peut pas accéder à localStorage lui-même. Effacé juste après, pour
  // qu'une seconde inscription sur ce même navigateur ne rattache pas la
  // progression du premier compte à un second.
  function handleSubmit() {
    try {
      localProgressRef.current!.value = localStorage.getItem(STORAGE_KEY) ?? "";
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      localProgressRef.current!.value = "";
    }
  }

  if (state?.message) {
    return <p className={styles.success}>{state.message}</p>;
  }

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      <input ref={localProgressRef} type="hidden" name="localProgress" />
      {state?.error && <p className={styles.error}>{state.error}</p>}
      <label className={styles.field}>
        <span className={styles.label}>Email</span>
        <input className={styles.input} type="email" name="email" required autoComplete="email" />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Mot de passe (8 caractères minimum)</span>
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
        {pending ? "Création…" : "Créer mon compte"}
      </button>
      <GoogleAuthButton />
      <p className={styles.footer}>
        Déjà un compte ? <Link href="/login">Se connecter</Link>
      </p>
    </form>
  );
}
