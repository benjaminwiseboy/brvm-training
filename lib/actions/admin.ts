"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

  return supabase;
}

export async function toggleModuleAccess(userId: string, moduleCode: string, blocked: boolean) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("module_access_overrides")
    .upsert({ user_id: userId, module_code: moduleCode, blocked });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/users/${userId}`);
}
