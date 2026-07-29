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
 * Graphique SVG barres + lignes — même esprit que CompoundChart.tsx
 * (pas de librairie externe, tout est calculé en coordonnées SVG).
 * Double axe indépendant : les barres (souvent un CA, à grande échelle)
 * se calent sur l'axe gauche, les lignes (souvent des résultats, à
 * échelle plus petite) sur l'axe droit — sans ça, une seule série aux
 * grandes valeurs écrase visuellement toutes les autres. Composant
 * serveur : aucun state, réutilisable tel quel dans un Block (slide)
 * ou dans ChartTabs (Client Component qui gère l'onglet actif).
 */
export function TrendChart({ categories, series, unit }: ChartData) {
  const W = 360;
  const H = 230;
  const padL = 32;
  const padR = 32;
  const padT = 14;
  const padB = 28;
  const x0 = padL;
  const x1 = W - padR;
  const yb = H - padB;
  const yt = padT;

  const barSeries = series.filter((s) => s.kind === "bar");
  const lineSeries = series.filter((s) => s.kind === "line");

  const barValues = barSeries.flatMap((s) => s.values);
  const lineValues = lineSeries.flatMap((s) => s.values);

  const barMax = Math.max(...barValues, 0) * 1.12 || 1;
  const barMin = 0;
  const lineRawMax = Math.max(...lineValues, 0);
  const lineRawMin = Math.min(...lineValues, 0);
  const lineSpan = lineRawMax - lineRawMin || 1;
  const lineMax = lineRawMax + lineSpan * 0.18;
  const lineMin = lineRawMin - (lineRawMin < 0 ? lineSpan * 0.18 : 0);

  const n = categories.length;
  const slot = (x1 - x0) / n;
  const xCenter = (i: number) => x0 + slot * (i + 0.5);
  const Ybar = (v: number) => yb - ((v - barMin) / (barMax - barMin)) * (yb - yt);
  const Yline = (v: number) => yb - ((v - lineMin) / (lineMax - lineMin)) * (yb - yt);
  const yZeroLine = Yline(0);
  const barWidth = Math.min(28, slot * 0.5);

  const barTicks = ticksFor(barMin, Math.max(...barValues, 0));
  const lineTicks = ticksFor(lineRawMin < 0 ? lineRawMin : 0, lineRawMax);

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
        {barTicks.map((t, i) => (
          <line key={`bg${i}`} x1={x0} x2={x1} y1={Ybar(t).toFixed(1)} y2={Ybar(t).toFixed(1)} className={styles.gridLine} />
        ))}
        {barTicks.map((t, i) => (
          <text key={`bl${i}`} x={x0 - 5} y={Ybar(t).toFixed(1)} dy={3} textAnchor="end" className={styles.axisYLeft}>
            {fmt(t)}
          </text>
        ))}
        {lineSeries.length > 0 &&
          lineTicks.map((t, i) => (
            <text key={`ll${i}`} x={x1 + 5} y={Yline(t).toFixed(1)} dy={3} textAnchor="start" className={styles.axisYRight}>
              {fmt(t)}
            </text>
          ))}
        {lineRawMin < 0 && (
          <line x1={x0} x2={x1} y1={yZeroLine.toFixed(1)} y2={yZeroLine.toFixed(1)} className={styles.zeroLine} />
        )}
        {barSeries.map((s) => (
          <g key={s.label}>
            {s.values.map((v, i) => {
              const cx = xCenter(i);
              const y = Ybar(v);
              return (
                <rect
                  key={i}
                  x={(cx - barWidth / 2).toFixed(1)}
                  y={y.toFixed(1)}
                  width={barWidth.toFixed(1)}
                  height={Math.max(yb - y, 1).toFixed(1)}
                  rx={3}
                  fill={COLOR_VAR[s.color]}
                  opacity={0.85}
                />
              );
            })}
          </g>
        ))}
        {lineSeries.map((s) => {
          const pts = s.values.map((v, i) => `${xCenter(i).toFixed(1)} ${Yline(v).toFixed(1)}`).join(" L ");
          return (
            <g key={s.label}>
              <path d={`M ${pts}`} fill="none" stroke={COLOR_VAR[s.color]} strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
              {s.values.map((v, i) => (
                <circle key={i} cx={xCenter(i).toFixed(1)} cy={Yline(v).toFixed(1)} r={3.2} fill={COLOR_VAR[s.color]} />
              ))}
            </g>
          );
        })}
        {categories.map((c, i) => (
          <text key={i} x={xCenter(i).toFixed(1)} y={H - 8} textAnchor="middle" className={styles.axisX}>
            {c}
          </text>
        ))}
      </svg>
      {unit && <figcaption className={styles.unit}>{unit}</figcaption>}
    </figure>
  );
}
