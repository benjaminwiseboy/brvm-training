"use client";

import { useMemo, useState } from "react";
import { money } from "@/lib/format";
import { UserTable, type AdminUserRow } from "./UserTable";
import styles from "./AdminUsersView.module.css";

type Filter = "all" | "paid" | "unpaid";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "paid", label: "Payé" },
  { key: "unpaid", label: "Impayé" },
];

export function AdminUsersView({
  rows,
  totalUsers,
  completionRate,
  revenue,
}: {
  rows: AdminUserRow[];
  totalUsers: number;
  completionRate: number;
  revenue: number;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (filter === "paid" && row.paymentStatus !== "paid") return false;
      if (filter === "unpaid" && row.paymentStatus !== "unpaid") return false;
      if (search && !row.email.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [rows, search, filter]);

  return (
    <div>
      <div className={styles.statCards}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Inscrits</div>
          <div className={styles.statValue}>{totalUsers}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Taux de complétion</div>
          <div className={styles.statValue}>{completionRate}%</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Revenus</div>
          <div className={styles.statValue}>
            {money(revenue)} <span className={styles.statUnit}>FCFA</span>
          </div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Rechercher un inscrit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />
        <div className={styles.pills}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`${styles.pill} ${filter === f.key ? styles.pillActive : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <UserTable rows={filteredRows} />
    </div>
  );
}
