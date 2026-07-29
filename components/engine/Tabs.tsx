"use client";

import styles from "./Tabs.module.css";

/**
 * Barre d'onglets générique — utilisée par ChartTabs (M18) et
 * TableTabs (M19+) pour laisser l'apprenant basculer entre plusieurs
 * exemples avant de répondre au défi, plutôt que de tout empiler en
 * même temps. Les libellés d'onglets doivent rester neutres : ne
 * jamais y glisser d'indice sur la bonne réponse.
 */
export function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: string; label: string }[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className={styles.tabs}>
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          className={`${styles.tab} ${t.key === active ? styles.tabOn : ""}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
