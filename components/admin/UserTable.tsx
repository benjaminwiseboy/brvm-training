import Link from "next/link";
import { money } from "@/lib/format";
import styles from "./UserTable.module.css";

export type AdminUserRow = {
  id: string;
  email: string;
  createdAt: string;
  badge: { emoji: string; label: string };
  capital: number;
  streak: number;
  doneCount: number;
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
            <th>Email</th>
            <th>Inscrit le</th>
            <th>Statut</th>
            <th>Portefeuille</th>
            <th>Série</th>
            <th>Modules terminés</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <Link className={styles.rowLink} href={`/admin/users/${row.id}`}>
                  <span className={styles.email}>{row.email}</span>
                </Link>
              </td>
              <td>{new Date(row.createdAt).toLocaleDateString("fr-FR")}</td>
              <td>
                <span className={styles.badge}>{row.badge.emoji}</span>
                {row.badge.label}
              </td>
              <td>{money(row.capital)} FCFA</td>
              <td>{row.streak}</td>
              <td>{row.doneCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
