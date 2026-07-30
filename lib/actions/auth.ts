"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidProgressState } from "@/lib/store";
import { sanitizeNextPath } from "@/lib/safeRedirect";

export type AuthActionState = { error?: string; message?: string } | undefined;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * `localProgress` (champ caché du formulaire, cf. SignupForm) contient
 * le JSON brut de localStorage["brvm-learning:v1"] lu côté client avant
 * soumission — un Server Action ne peut pas lire localStorage lui-même.
 * Revalidé ici avant toute écriture : on ne fait jamais confiance à une
 * valeur envoyée par le client sans la revérifier côté serveur.
 */
export async function signup(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const localProgressRaw = String(formData.get("localProgress") ?? "");

  if (!isValidEmail(email)) return { error: "Adresse email invalide." };
  if (password.length < 8) return { error: "Le mot de passe doit contenir au moins 8 caractères." };

  const supabase = await createClient();
  // Pas de `emailRedirectTo` : le template d'email (Étape 0.5, Supabase
  // dashboard) pointe déjà en dur vers /auth/confirm via {{ .SiteURL }}.
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return { error: error.message };
  if (!data.user) return { error: "Inscription impossible, réessayez." };

  // Migration de la progression locale (requirement 4) : pas de session à ce
  // stade (email non confirmé), donc on écrit via le client service-role.
  if (localProgressRaw) {
    try {
      const parsed = JSON.parse(localProgressRaw);
      if (isValidProgressState(parsed)) {
        const admin = createAdminClient();
        await admin.from("user_progress").upsert({ user_id: data.user.id, state: parsed });
      }
    } catch {
      // JSON malformé : on ignore silencieusement, l'utilisateur repart avec
      // une progression neuve plutôt que de faire échouer l'inscription.
    }
  }

  return { message: "Vérifiez votre boîte mail pour confirmer votre compte." };
}

export async function login(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/");

  if (!isValidEmail(email) || !password) return { error: "Email ou mot de passe invalide." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email ou mot de passe incorrect." };

  redirect(sanitizeNextPath(next));
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!isValidEmail(email)) return { error: "Adresse email invalide." };

  const supabase = await createClient();
  // On ne révèle jamais si l'email existe ou non (évite l'énumération de comptes) :
  // même message de succès dans les deux cas.
  await supabase.auth.resetPasswordForEmail(email);
  return { message: "Si ce compte existe, un email de réinitialisation vient d'être envoyé." };
}

export async function updatePassword(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "Le mot de passe doit contenir au moins 8 caractères." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  redirect("/");
}
