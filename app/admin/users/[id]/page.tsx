import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLastSignIn } from "@/lib/supabase/admin";
import { deriveStatus, deriveModuleState, resolveInitialProgress } from "@/lib/progress";
import { getModule, orderedCodes, PHASES } from "@/content/registry";
import { money, relativeDate } from "@/lib/format";
import { ModuleAccessGrid } from "@/components/admin/ModuleAccessGrid";
import { PaymentCard } from "@/components/admin/PaymentCard";
import { NotesCard, type AdminNote } from "@/components/admin/NotesCard";
import type { ModuleAccessMode, PaymentStatus } from "@/lib/actions/admin";
import styles from "./page.module.css";

const AUTO_LABEL: Record<ReturnType<typeof deriveModuleState>, string> = {
  done: "Terminé",
  current: "Débloqué",
  unlocked: "Débloqué",
  locked: "Verrouillé",
};

type ActivityEntry = { text: string; at: string };

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase.from("profiles").select("id, email, created_at").eq("id", id).single();
  if (!profile) notFound();

  const [{ data: progressRow }, { data: overrides }, { data: paymentRow }, { data: noteRows }, lastSignIn] =
    await Promise.all([
      supabase.from("user_progress").select("state").eq("user_id", id).maybeSingle(),
      supabase.from("module_access_overrides").select("module_code, blocked").eq("user_id", id),
      supabase.from("payments").select("status, amount, method, paid_at").eq("user_id", id).maybeSingle(),
      supabase
        .from("admin_notes")
        .select("id, body, author_email, created_at")
        .eq("user_id", id)
        .order("created_at", { ascending: false }),
      getLastSignIn(id),
    ]);

  const progress = resolveInitialProgress(progressRow?.state);
  const completedEntries = Object.entries(progress.completed).sort(
    ([, a], [, b]) => new Date(b.at).getTime() - new Date(a.at).getTime()
  );
  const doneCount = completedEntries.length;
  const badge = deriveStatus(doneCount);
  const initial = profile.email.charAt(0).toUpperCase();

  const order = orderedCodes();
  const initialModes: Record<string, ModuleAccessMode> = {};
  for (const o of overrides ?? []) {
    initialModes[o.module_code] = o.blocked ? "closed" : "open";
  }

  const phaseGroups = PHASES.map((phase) => ({
    name: phase.name,
    badge: phase.badge,
    modules: phase.codes.map((code) => ({
      code,
      title: getModule(code)?.title ?? code,
      autoLabel: AUTO_LABEL[deriveModuleState(code, progress.completed, order)],
    })),
  }));

  const notes: AdminNote[] = (noteRows ?? []).map((n) => ({
    id: n.id,
    body: n.body,
    authorEmail: n.author_email,
    createdAt: n.created_at,
  }));

  const activity: ActivityEntry[] = [
    { text: "Compte créé", at: profile.created_at },
    ...(lastSignIn ? [{ text: "Connexion", at: lastSignIn }] : []),
    ...completedEntries.map(([code, entry]) => ({
      text: `Module ${code} terminé — score ${Math.round(entry.score * 100)}%`,
      at: entry.at,
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 6);

  return (
    <div>
      <Link className={styles.back} href="/admin">
        ← Tous les utilisateurs
      </Link>
      <div className={styles.head}>
        <div className={styles.avatar}>{initial}</div>
        <div>
          <h1 className={styles.h1}>{profile.email}</h1>
          <p className={styles.sub}>
            {badge.emoji} {badge.label} · {money(progress.capital)} FCFA · inscrit le{" "}
            {new Date(profile.created_at).toLocaleDateString("fr-FR")}
          </p>
        </div>
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

      <div className={styles.grid}>
        <div className={styles.mainCol}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Progression & accès modules</h2>
            <p className={styles.sectionHint}>
              Override : <code>auto</code> respecte la progression normale, <code>ouvert</code>/<code>fermé</code> la
              forcent.
            </p>
            <ModuleAccessGrid userId={id} phases={phaseGroups} initialModes={initialModes} />
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Activité</h2>
            {activity.length === 0 ? (
              <p className={styles.empty}>Aucune activité pour l&apos;instant.</p>
            ) : (
              <div className={styles.activityList}>
                {activity.map((entry, i) => (
                  <div key={i} className={styles.activityRow}>
                    <span>{entry.text}</span>
                    <span className={styles.activityTime}>{relativeDate(entry.at)}</span>
                  </div>
                ))}
              </div>
            )}
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
        </div>

        <div className={styles.sideCol}>
          <PaymentCard
            userId={id}
            initialStatus={(paymentRow?.status as PaymentStatus) ?? "unpaid"}
            initialAmount={paymentRow?.amount ?? null}
            initialMethod={paymentRow?.method ?? null}
            initialPaidAt={paymentRow?.paid_at ?? null}
          />
          <NotesCard userId={id} initialNotes={notes} />
        </div>
      </div>
    </div>
  );
}
