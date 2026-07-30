import { notFound } from "next/navigation";
import { getModule } from "@/content/registry";
import { ModulePlayer } from "@/components/engine/ModulePlayer";
import { ModuleBlocked } from "@/components/engine/ModuleBlocked";
import { AppShell } from "@/components/nav/AppShell";
import { createClient } from "@/lib/supabase/server";

// Plus de `generateStaticParams()` : la page fait désormais une lecture DB
// par utilisateur (override de blocage), donc devient dynamique par requête
// — cohérent avec le reste de l'app depuis l'ajout des comptes (proxy.ts
// exige déjà une session pour atteindre cette route).
export default async function ModulePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  // Nommé `mod`, pas `module` : eslint-plugin-next (no-assign-module-variable)
  // interdit de réassigner l'identifiant `module` dans ce scope.
  const mod = getModule(code);
  if (!mod) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let blocked = false;
  if (user) {
    const { data } = await supabase
      .from("module_access_overrides")
      .select("blocked")
      .eq("user_id", user.id)
      .eq("module_code", mod.code)
      .maybeSingle();
    blocked = data?.blocked === true;
  }

  return (
    <AppShell moduleInfo={{ code: mod.code, title: mod.title, phase: mod.phase }}>
      {blocked ? <ModuleBlocked module={mod} /> : <ModulePlayer module={mod} />}
    </AppShell>
  );
}
