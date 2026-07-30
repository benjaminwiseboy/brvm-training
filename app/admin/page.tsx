import { createClient } from "@/lib/supabase/server";
import { deriveStatus, resolveInitialProgress } from "@/lib/progress";
import { UserTable, type AdminUserRow } from "@/components/admin/UserTable";
import styles from "./page.module.css";

type ProfileRow = {
  id: string;
  email: string;
  created_at: string;
  user_progress: { state: unknown } | { state: unknown }[] | null;
};

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, email, created_at, user_progress(state)")
    .order("created_at", { ascending: false });

  const rows: AdminUserRow[] = ((data as ProfileRow[] | null) ?? []).map((profile) => {
    const rawState = Array.isArray(profile.user_progress)
      ? profile.user_progress[0]?.state
      : profile.user_progress?.state;
    const progress = resolveInitialProgress(rawState);
    const doneCount = Object.keys(progress.completed).length;
    return {
      id: profile.id,
      email: profile.email,
      createdAt: profile.created_at,
      badge: deriveStatus(doneCount),
      capital: progress.capital,
      streak: progress.streak,
      doneCount,
    };
  });

  return (
    <div>
      <div className={styles.head}>
        <h1 className={styles.h1}>Utilisateurs</h1>
        <p className={styles.sub}>{rows.length} compte(s) enregistré(s).</p>
      </div>
      <UserTable rows={rows} />
    </div>
  );
}
