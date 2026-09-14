"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { money, moneyCompact } from "@/lib/format";
import styles from "./FeesChart.module.css";

/**
 * Courbe des frais cumulés par SGI — le graphe du comparateur.
 *
 * Recharts, comme dans le projet frère `brvm-tracker` d'où viennent les
 * données et le moteur de calcul : c'est la seule page de ce projet qui
 * demande un vrai graphe interactif (survol point par point, légende
 * cliquable, axe temporel dense). Le SVG maison `TrendChart`, taillé pour
 * les 3 ou 4 valeurs d'une slide de cours, y montrait ses limites — il
 * répartit ses catégories à intervalles égaux, ce qui déformait l'axe du
 * temps, et son axe écrit les nombres bruts.
 *
 * La charte, elle, reste celle d'ici : fond clair, encre marine, grille
 * discrète — pas le thème sombre du tracker.
 */

/** Palette alignée sur les tokens de globals.css (valeurs littérales : les
 *  attributs SVG de Recharts et ses pastilles de légende ne partagent pas le
 *  même contexte CSS). */
export const FEE_SERIES_COLORS = [
  "#0A4680", // --navy-600
  "#E89E11", // --gold-500
  "#0E9C74", // --pos
  "#C9553A", // --clay
  "#4F5BB5", // --violet
  "#167E94", // --teal
];

export type FeesSeries = {
  name: string;
  /** Frais cumulés en FCFA, indexés par année (1 → years). */
  points: { year: number; fees: number }[];
};

export function FeesChart({ series, years, ticks }: { series: FeesSeries[]; years: number; ticks: number[] }) {
  // Recharts veut une ligne par abscisse : on pivote les séries en un tableau
  // d'objets { year, "SGI A": …, "SGI B": … }.
  const data = Array.from({ length: years }, (_, i) => {
    const year = i + 1;
    const row: Record<string, number> = { year };
    for (const s of series) row[s.name] = s.points.find((p) => p.year === year)?.fees ?? 0;
    return row;
  });

  return (
    <div className={styles.wrap}>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
          <CartesianGrid stroke="rgba(2,51,98,.11)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="year"
            type="number"
            domain={[1, years]}
            ticks={ticks}
            tick={{ fill: "#6B819A", fontSize: 11 }}
            stroke="rgba(2,51,98,.2)"
            tickFormatter={(y: number) => `${y} an${y > 1 ? "s" : ""}`}
          />
          <YAxis
            width={58}
            tick={{ fill: "#6B819A", fontSize: 11 }}
            stroke="rgba(2,51,98,.2)"
            tickFormatter={(v: number) => moneyCompact(v)}
          />
          <Tooltip
            contentStyle={{
              background: "#FFFFFF",
              border: "1px solid rgba(2,51,98,.2)",
              borderRadius: 18,
              color: "#08192B",
              fontSize: 13,
              boxShadow: "0 12px 32px -12px rgba(2,51,98,.28)",
            }}
            labelStyle={{ fontWeight: 700, color: "#023362", marginBottom: 4 }}
            labelFormatter={(y) => `Au bout de ${y} an${Number(y) > 1 ? "s" : ""}`}
            formatter={(v, name) => [`${money(Number(v))} FCFA`, name as string]}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          {series.map((s, i) => (
            <Line
              key={s.name}
              type="monotone"
              dataKey={s.name}
              stroke={FEE_SERIES_COLORS[i % FEE_SERIES_COLORS.length]}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
