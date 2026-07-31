"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Currency } from "@/lib/format";

/**
 * Défense en profondeur : la policy RLS "overrides: admin manage all" est la
 * vraie barrière, mais on revérifie quand même le rôle ici (recommandation
 * Next.js — ne jamais se reposer uniquement sur proxy.ts/le middleware pour
 * l'autorisation d'un Server Action).
 */
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié.");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Accès refusé.");

  return { supabase, email: user.email ?? null };
}

export type ModuleAccessMode = "auto" | "open" | "closed";

/**
 * "auto" supprime le(s) override(s) (retour à la règle de progression
 * normale) ; "open"/"closed" upsert un blocage forcé. Les 3 états
 * correspondent à auto/forcé-ouvert/forcé-fermé — aucune colonne dédiée
 * n'est nécessaire, l'absence de ligne EST l'état "auto". Partagé entre
 * `setModuleAccessMode` (1 module) et `setPhaseAccessMode` (bulk, tous les
 * modules d'une phase) : même opération, juste sur 1 ou N codes.
 */
async function applyAccessMode(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  userId: string,
  moduleCodes: string[],
  mode: ModuleAccessMode
) {
  if (mode === "auto") {
    const { error } = await supabase
      .from("module_access_overrides")
      .delete()
      .eq("user_id", userId)
      .in("module_code", moduleCodes);
    if (error) throw new Error(error.message);
  } else {
    const rows = moduleCodes.map((code) => ({ user_id: userId, module_code: code, blocked: mode === "closed" }));
    const { error } = await supabase.from("module_access_overrides").upsert(rows);
    if (error) throw new Error(error.message);
  }
}

export async function setModuleAccessMode(userId: string, moduleCode: string, mode: ModuleAccessMode) {
  const { supabase } = await requireAdmin();
  await applyAccessMode(supabase, userId, [moduleCode], mode);
  revalidatePath(`/admin/users/${userId}`);
}

/** Bloque/débloque/remet en auto tous les modules d'une phase en un coup. */
export async function setPhaseAccessMode(userId: string, moduleCodes: string[], mode: ModuleAccessMode) {
  const { supabase } = await requireAdmin();
  await applyAccessMode(supabase, userId, moduleCodes, mode);
  revalidatePath(`/admin/users/${userId}`);
}

export type PaymentStatus = "paid" | "unpaid";

/**
 * `paidAt` est fourni par l'appelant plutôt que recalculé ici : "Marquer
 * payé" doit bien poser la date du jour, mais un simple edit du
 * montant/moyen (bouton "Enregistrer" sans changement de statut) ne doit
 * pas réécrire la date de paiement d'origine.
 */
export async function savePayment(
  userId: string,
  status: PaymentStatus,
  amount: number | null,
  currency: Currency,
  method: string | null,
  paidAt: string | null
) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("payments").upsert({
    user_id: userId,
    status,
    amount,
    currency,
    method,
    paid_at: paidAt,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/users/${userId}`);
}

export async function addAdminNote(userId: string, body: string) {
  const { supabase, email } = await requireAdmin();
  const trimmed = body.trim();
  if (!trimmed) return;

  const { error } = await supabase
    .from("admin_notes")
    .insert({ user_id: userId, author_email: email, body: trimmed });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/users/${userId}`);
}
