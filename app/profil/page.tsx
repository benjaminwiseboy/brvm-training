import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/nav/AppShell";
import { ProfilView } from "@/components/dashboard/ProfilView";

/**
 * `/profil` — Server Component pour la seule chose que le client ne peut
 * pas savoir de lui-même : le rôle admin (même requête que
 * app/admin/layout.tsx). Le lien "Voir l'espace admin" de la maquette
 * n'est affiché qu'aux vrais admins, jamais à tout apprenant — la maquette
 * est une démo, cette page ne l'est pas.
 */
export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    isAdmin = profile?.role === "admin";
  }

  return (
    <AppShell variant="dash">
      <ProfilView isAdmin={isAdmin} />
    </AppShell>
  );
}
