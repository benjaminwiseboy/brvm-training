import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deriveStatus, resolveInitialProgress } from "@/lib/store";
import { getModule, PHASES } from "@/content/registry";
import { money } from "@/lib/format";
import { ModuleAccessGrid } from "@/components/admin/ModuleAccessGrid";
import styles from "./page.module.css";

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase.from("profiles").select("id, email, created_at").eq("id", id).single();
  if (!profile) notFound();

  const [{ data: progressRow }, { data: overrides }] = await Promise.all([
    supabase.from("user_progress").select("state").eq("user_id", id).maybeSingle(),
    supabase.from("module_access_overrides").select("module_code, blocked").eq("user_id", id),
  ]);

  const progress = resolveInitialProgress(progressRow?.state);
  const completedEntries = Object.entries(progress.completed).sort(
    ([, a], [, b]) => new Date(b.at).getTime() - new Date(a.at).getTime()
  );
  const doneCount = completedEntries.length;
  const badge = deriveStatus(doneCount);
  const initialBlocked = (overrides ?? []).filter((o) => o.blocked).map((o) => o.module_code);

  const phaseGroups = PHASES.map((phase) => ({
    name: phase.name,
    modules: phase.codes.map((code) => ({ code, title: getModule(code)?.title ?? code })),
  }));

  return (
    <div>
      <Link className={styles.back} href="/admin">
        ← Tous les utilisateurs
      </Link>
      <div className={styles.head}>
        <h1 className={styles.h1}>{profile.email}</h1>
        <p className={styles.sub}>Inscrit le {new Date(profile.created_at).toLocaleDateString("fr-FR")}</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Statut</div>
          <div className={styles.statValue}>
            {badge.emoji} {badge.label}
          </div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Portefeuille</div>
          <div className={styles.statValue}>{money(progress.capital)} FCFA</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Série</div>
          <div className={styles.statValue}>{progress.streak}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Modules terminés</div>
          <div className={styles.statValue}>{doneCount}</div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Modules terminés</h2>
        {completedEntries.length === 0 ? (
          <p className={styles.empty}>Aucun module terminé pour l&apos;instant.</p>
        ) : (
          <table className={styles.completedTable}>
            <thead>
              <tr>
                <th>Module</th>
                <th>Score</th>
                <th>Terminé le</th>
              </tr>
            </thead>
            <tbody>
              {completedEntries.map(([code, entry]) => (
                <tr key={code}>
                  <td>
                    {code} — {getModule(code)?.title ?? code}
                  </td>
                  <td>{Math.round(entry.score * 100)}%</td>
                  <td>{new Date(entry.at).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Accès aux modules</h2>
        <ModuleAccessGrid userId={id} phases={phaseGroups} initialBlocked={initialBlocked} />
      </div>
    </div>
  );
}
