"use client";

import { useState } from "react";
import type { ChartData } from "@/lib/types";
import { TrendChart } from "./TrendChart";
import styles from "./ChartTabs.module.css";

/**
 * Graphique interactif à onglets (M18+) : l'apprenant bascule d'un
 * profil à l'autre avant de répondre, plutôt que de lire 4 profils
 * recopiés en prose dans l'instruction. Les libellés d'onglets restent
 * neutres (ex. "Profil A") : ne jamais y glisser d'indice sur la
 * bonne réponse.
 */
export function ChartTabs({ profiles }: { profiles: { key: string; label: string; data: ChartData }[] }) {
  const [active, setActive] = useState(profiles[0]?.key);
  const current = profiles.find((p) => p.key === active) ?? profiles[0];

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs}>
        {profiles.map((p) => (
          <button
            key={p.key}
            type="button"
            className={`${styles.tab} ${p.key === active ? styles.tabOn : ""}`}
            onClick={() => setActive(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>
      {current && <TrendChart {...current.data} />}
    </div>
  );
}
