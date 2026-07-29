import type { ChartData } from "@/lib/types";
import styles from "./TrendChart.module.css";

const COLOR_VAR: Record<string, string> = {
  blue: "var(--blue)",
  gold: "var(--or)",
  pos: "var(--pos)",
  clay: "var(--clay)",
  violet: "var(--violet)",
  teal: "var(--teal)",
};

function fmt(v: number) {
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

/** 3 valeurs repères (min, milieu, max) — pas d'algo "nice numbers", juste de quoi se situer sur l'axe. */
function ticksFor(min: number, max: number): number[] {
  if (max === min) return [min];
  return [min, (min + max) / 2, max];
}

/**
 * Graphique SVG barres + lignes, UN SEUL axe des ordonnées partagé —
 * même esprit que CompoundChart.tsx (pas de librairie externe, tout
 * est calculé en coordonnées SVG). Un double axe indépendant a été
 * essayé puis abandonné (revue post-lancement) : il pouvait afficher
 * une ligne "au-dessus" des barres alors que, financièrement, un
 * résultat net/d'exploitation ne peut jamais dépasser le chiffre
 * d'affaires — un seul axe garde cette cohérence, quitte à ce que les
 * lignes occupent une bande plus modeste que les barres. Composant
 * serveur : aucun state, réutilisable tel quel dans un Block (slide)
 * ou dans ChartTabs (Client Component qui gère l'onglet actif).
 */
export function TrendChart({ categories, series, unit }: ChartData) {
  const W = 360;
  const H = 240;
  const padL = 40;
  const padR = 10;
  const padT = 14;
  const padB = 42;
  const x0 = padL;
  const x1 = W - padR;
  const yb = H - padB;
  const yt = padT;

  const barSeries = series.filter((s) => s.kind === "bar");
  const lineSeries = series.filter((s) => s.kind === "line");

  const allValues = series.flatMap((s) => s.values);
  const rawMax = Math.max(...allValues, 0);
  const rawMin = Math.min(...allValues, 0);
  const span = rawMax - rawMin || 1;
  const maxV = rawMax + span * 0.12;
  const minV = rawMin - (rawMin < 0 ? span * 0.12 : 0);

  const n = categories.length;
  const slot = (x1 - x0) / n;
  const xCenter = (i: number) => x0 + slot * (i + 0.5);
  const Y = (v: number) => yb - ((v - minV) / (maxV - minV)) * (yb - yt);
  const yZero = Y(0);
  const barWidth = Math.min(28, slot * 0.5);

  const ticks = ticksFor(rawMin < 0 ? rawMin : 0, rawMax);
  const yTitle = unit ? `Montant (${unit})` : "Montant";

  return (
    <figure className={styles.wrap}>
      <div className={styles.legend}>
        {series.map((s) => (
          <span className={styles.legendItem} key={s.label}>
            <span
              className={s.kind === "bar" ? styles.swatchBar : styles.swatchLine}
              style={{ background: s.kind === "bar" ? COLOR_VAR[s.color] : undefined, borderColor: COLOR_VAR[s.color] }}
            />
            {s.label}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img" aria-label={`Graphique : ${series.map((s) => s.label).join(", ")}`}>
        {ticks.map((t, i) => (
          <line key={`g${i}`} x1={x0} x2={x1} y1={Y(t).toFixed(1)} y2={Y(t).toFixed(1)} className={styles.gridLine} />
        ))}
        {ticks.map((t, i) => (
          <text key={`l${i}`} x={x0 - 6} y={Y(t).toFixed(1)} dy={3} textAnchor="end" className={styles.axisYLeft}>
            {fmt(t)}
          </text>
        ))}
        {rawMin < 0 && <line x1={x0} x2={x1} y1={yZero.toFixed(1)} y2={yZero.toFixed(1)} className={styles.zeroLine} />}
        {barSeries.map((s) => (
          <g key={s.label}>
            {s.values.map((v, i) => {
              const cx = xCenter(i);
              const y = Y(v);
              const top = Math.min(y, yZero);
              const h = Math.abs(y - yZero);
              return (
                <rect
                  key={i}
                  x={(cx - barWidth / 2).toFixed(1)}
                  y={top.toFixed(1)}
                  width={barWidth.toFixed(1)}
                  height={Math.max(h, 1).toFixed(1)}
                  rx={3}
                  fill={COLOR_VAR[s.color]}
                  opacity={0.85}
                />
              );
            })}
          </g>
        ))}
        {lineSeries.map((s) => {
          const pts = s.values.map((v, i) => `${xCenter(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" L ");
          return (
            <g key={s.label}>
              <path d={`M ${pts}`} fill="none" stroke={COLOR_VAR[s.color]} strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
              {s.values.map((v, i) => (
                <circle key={i} cx={xCenter(i).toFixed(1)} cy={Y(v).toFixed(1)} r={3.2} fill={COLOR_VAR[s.color]} />
              ))}
            </g>
          );
        })}
        {categories.map((c, i) => (
          <text key={i} x={xCenter(i).toFixed(1)} y={yb + 16} textAnchor="middle" className={styles.axisX}>
            {c}
          </text>
        ))}
        <text x={(x0 + x1) / 2} y={H - 6} textAnchor="middle" className={styles.axisTitle}>
          Année
        </text>
        <text x={0} y={0} transform={`translate(${12} ${(yt + yb) / 2}) rotate(-90)`} textAnchor="middle" className={styles.axisTitle}>
          {yTitle}
        </text>
      </svg>
    </figure>
  );
}
