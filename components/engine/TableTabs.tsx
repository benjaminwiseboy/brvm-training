"use client";

import { useState } from "react";
import type { BocTableData } from "@/lib/types";
import { BocTable } from "./BocTable";
import { TabBar } from "./Tabs";
import styles from "./Tabs.module.css";

/**
 * Tableau interactif à onglets (M19+) : l'apprenant bascule d'un
 * scénario à l'autre avant de répondre, plutôt que d'empiler deux
 * tableaux à la suite — même mécanisme que ChartTabs (M18), appliqué
 * à des BocTable plutôt qu'à des TrendChart.
 */
export function TableTabs({ scenarios }: { scenarios: { key: string; label: string; table: BocTableData }[] }) {
  const [active, setActive] = useState(scenarios[0]?.key);
  const current = scenarios.find((s) => s.key === active) ?? scenarios[0];

  return (
    <div className={styles.wrap}>
      <TabBar tabs={scenarios} active={active} onChange={setActive} />
      {current && <BocTable {...current.table} />}
    </div>
  );
}
