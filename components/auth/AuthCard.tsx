import type { ReactNode } from "react";
import styles from "./AuthCard.module.css";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className={styles.page}>
      <div className={styles.blobGold} aria-hidden="true" />
      <div className={styles.blobNavy} aria-hidden="true" />
      <div className={styles.wrap}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>B</div>
          <div className={styles.brandName}>BRVM Learning</div>
        </div>
        <div className={styles.card}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {children}
        </div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
