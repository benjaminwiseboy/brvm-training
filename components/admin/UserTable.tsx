import Link from "next/link";
import { relativeDate } from "@/lib/format";
import styles from "./UserTable.module.css";

export type AdminUserRow = {
  id: string;
  email: string;
  createdAt: string;
  badge: { emoji: string; label: string };
  capital: number;
  streak: number;
  doneCount: number;
  progressPct: number;
  paymentStatus: "paid" | "unpaid";
  lastSignIn: string | null;
};

export function UserTable({ rows }: { rows: AdminUserRow[] }) {
  if (rows.length === 0) {
    return (
      <div className={styles.tableWrap}>
        <p className={styles.empty}>Aucun utilisateur pour l&apos;instant.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Inscrit</th>
            <th>Paiement</th>
            <th>Progression</th>
            <th>Statut</th>
            <th>Dernière connexion</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <Link className={styles.rowLink} href={`/admin/users/${row.id}`}>
                  <span className={styles.email}>{row.email}</span>
                  <span className={styles.registered}>Inscrit le {new Date(row.createdAt).toLocaleDateString("fr-FR")}</span>
                </Link>
              </td>
              <td>
                <span className={`${styles.payBadge} ${row.paymentStatus === "paid" ? styles.payBadgePaid : styles.payBadgeUnpaid}`}>
                  {row.paymentStatus === "paid" ? "Payé" : "Impayé"}
                </span>
              </td>
              <td className={styles.progressCell}>{row.progressPct}%</td>
              <td>
                <span className={styles.badge}>
                  {row.badge.emoji} {row.badge.label}
                </span>
              </td>
              <td className={styles.muted}>{relativeDate(row.lastSignIn)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
