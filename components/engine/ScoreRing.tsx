import styles from "./ScoreRing.module.css";

// Port de buildFeedback() dans POC-Module-1/app.js : r=59, circonférence =
// 2πr, dashoffset = circ * (1 - pct/100). viewBox 132x132, cx/cy = 66.
const R = 59;
const CX = 66;
const CY = 66;
const CIRC = 2 * Math.PI * R;

export function ScoreRing({ pct, label = "réussite" }: { pct: number; label?: string }) {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  const offset = CIRC * (1 - clamped / 100);

  // État final rendu inline (correct même sans animation JS/CSS) : voir
  // ScoreRing.module.css (.fg / @keyframes ringdraw) pour l'animation
  // d'entrée qui part de --ringcirc jusqu'à cette valeur inline.
  const fgStyle = {
    "--ringcirc": `${CIRC.toFixed(1)}px`,
    strokeDashoffset: `${offset.toFixed(1)}px`,
  } as React.CSSProperties;

  return (
    <div className={styles.wrap}>
      <svg className={styles.svg} viewBox="0 0 132 132" aria-hidden="true">
        <circle className={styles.bg} cx={CX} cy={CY} r={R} />
        <circle
          className={styles.fg}
          cx={CX}
          cy={CY}
          r={R}
          strokeDasharray={CIRC.toFixed(1)}
          style={fgStyle}
        />
      </svg>
      <div className={styles.label}>
        <span className={styles.pct}>{clamped}%</span>
        <span className={styles.cap}>{label}</span>
      </div>
    </div>
  );
}
