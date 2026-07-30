import type { ReactNode } from "react";
import Link from "next/link";
import { logout } from "@/lib/actions/auth";
import styles from "./AdminShell.module.css";

export function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <Link href="/admin" className={styles.brand}>
          <span className={styles.brandTitle}>BRVM Learning</span>
          <span className={styles.brandTag}>Administration</span>
        </Link>
        <div className={styles.right}>
          <span className={styles.email}>{email}</span>
          <form action={logout}>
            <button className={styles.logoutBtn} type="submit">
              Se déconnecter
            </button>
          </form>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
