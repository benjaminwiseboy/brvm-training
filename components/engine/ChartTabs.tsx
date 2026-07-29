"use client";

import { useState } from "react";
import type { ChartData } from "@/lib/types";
import { TrendChart } from "./TrendChart";
import { TabBar } from "./Tabs";
import styles from "./Tabs.module.css";

/**
 * Graphique interactif à onglets (M18+) : l'apprenant bascule d'un
 * profil à l'autre avant de répondre, plutôt que de lire 4 profils
 * recopiés en prose dans l'instruction.
 */
export function ChartTabs({ profiles }: { profiles: { key: string; label: string; data: ChartData }[] }) {
  const [active, setActive] = useState(profiles[0]?.key);
  const current = profiles.find((p) => p.key === active) ?? profiles[0];

  return (
    <div className={styles.wrap}>
      <TabBar tabs={profiles} active={active} onChange={setActive} />
      {current && <TrendChart {...current.data} />}
    </div>
  );
}
