import { createClient } from "@/lib/supabase/server";
import { getLastSignInMap } from "@/lib/supabase/admin";
import { deriveStatus, progressPct, resolveInitialProgress } from "@/lib/progress";
import { orderedCodes } from "@/content/registry";
import { CURRENCIES, type Currency } from "@/lib/format";
import { type AdminUserRow } from "@/components/admin/UserTable";
import { AdminUsersView } from "@/components/admin/AdminUsersView";
import styles from "./page.module.css";

type ProfileRow = {
  id: string;
  email: string;
  created_at: string;
  user_progress: { state: unknown } | { state: unknown }[] | null;
};

type PaymentRow = { user_id: string; status: "paid" | "unpaid"; amount: number | null; currency: Currency };

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const [{ data }, { data: paymentRows }, lastSignInMap] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, created_at, user_progress(state)")
      .order("created_at", { ascending: false }),
    supabase.from("payments").select("user_id, status, amount, currency"),
    getLastSignInMap(),
  ]);

  const paymentsById = new Map((paymentRows as PaymentRow[] | null ?? []).map((p) => [p.user_id, p]));
  const totalModules = orderedCodes().length;

  const rows: AdminUserRow[] = ((data as ProfileRow[] | null) ?? []).map((profile) => {
    const rawState = Array.isArray(profile.user_progress)
      ? profile.user_progress[0]?.state
      : profile.user_progress?.state;
    const progress = resolveInitialProgress(rawState);
    const doneCount = Object.keys(progress.completed).length;
    const payment = paymentsById.get(profile.id);
    return {
      id: profile.id,
      email: profile.email,
      createdAt: profile.created_at,
      badge: deriveStatus(doneCount),
      capital: progress.capital,
      streak: progress.streak,
      doneCount,
      progressPct: progressPct(doneCount, totalModules),
      paymentStatus: payment?.status ?? "unpaid",
      lastSignIn: lastSignInMap.get(profile.id) ?? null,
    };
  });

  const completionRate = rows.length
    ? Math.round((rows.filter((r) => r.doneCount >= totalModules).length / rows.length) * 100)
    : 0;
  // Devises distinctes : pas de taux de change ici, donc pas de total unique
  // qui mélangerait FCFA/EUR/USD — un sous-total par devise (AdminUsersView
  // n'affiche que celles avec au moins un paiement).
  const revenueByCurrency = CURRENCIES.reduce(
    (acc, currency) => {
      acc[currency] = (paymentRows as PaymentRow[] | null ?? [])
        .filter((p) => p.status === "paid" && p.currency === currency)
        .reduce((sum, p) => sum + (p.amount ?? 0), 0);
      return acc;
    },
    {} as Record<Currency, number>
  );

  return (
    <div>
      <div className={styles.head}>
        <h1 className={styles.h1}>Utilisateurs</h1>
        <p className={styles.sub}>{rows.length} compte(s) enregistré(s).</p>
      </div>
      <AdminUsersView
        rows={rows}
        totalUsers={rows.length}
        completionRate={completionRate}
        revenueByCurrency={revenueByCurrency}
      />
    </div>
  );
}
