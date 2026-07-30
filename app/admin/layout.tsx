import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";

// Vraie frontière de sécurité pour /admin/* : proxy.ts (optimiste, cookie
// uniquement) ne vérifie que "connecté", pas "admin" — ce check-ci a besoin
// de la DB, donc il vit ici plutôt que dans le proxy.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  return <AdminShell email={user.email ?? ""}>{children}</AdminShell>;
}
