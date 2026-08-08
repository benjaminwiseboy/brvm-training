"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./AuthCard.module.css";

/**
 * "Continuer avec Google" — partagé login/signup (OAuth ne distingue pas les
 * deux : Supabase crée le compte au premier passage, reconnecte ensuite).
 * Redirige vers /auth/confirm, qui échange déjà le `?code=` PKCE renvoyé par
 * Supabase contre une session (route existante, utilisée jusqu'ici pour la
 * confirmation d'email/le reset de mot de passe — même mécanique ici, pas de
 * nouvelle route nécessaire).
 */
export function GoogleAuthButton({ next = "/" }: { next?: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}` },
    });
    // Si ça part vers Google, la page navigue déjà — `pending` ne redescend
    // que si l'appel échoue avant même la redirection (config manquante...).
    if (error) {
      setError(error.message);
      setPending(false);
    }
  }

  return (
    <>
      <div className={styles.divider}>
        <span>ou</span>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="button" className={styles.btnGoogle} onClick={handleClick} disabled={pending}>
        <GoogleIcon />
        {pending ? "Redirection…" : "Continuer avec Google"}
      </button>
    </>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}
