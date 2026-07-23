import { fvAnnuity } from "@/lib/format";
import styles from "./CompoundChart.module.css";

/**
 * Graphique SVG du simulateur — port de chartSVG() dans POC-Module-1/app.js
 * (aire « investi » en bleu + bande dorée « intérêts composés »).
 *
 * Géométrie exacte du POC : viewBox 340×200, marges padR=10/padB=24/padT=14/
 * padL=8. `invAt(t)`/`welAt(t)` étaient recalculés inline dans le POC
 * (P*12*t et la somme géométrique) ; ici on appelle `fvAnnuity(monthly,
 * ratePct, t)` pour chaque année t=0..years — c'est la même formule
 * (Task 2), pas de dérivation dupliquée.
 *
 * Composant serveur (aucun state/handler) : comme BlockRenderer/ScoreRing,
 * pas de "use client" ici ; il est simplement importé par SimulatorChallenge
 * (Client Component), ce qui suffit à le rendre réactif à chaque changement
 * de props sans avoir besoin de sa propre frontière client.
 */
export function CompoundChart({
  monthly,
  ratePct,
  years,
}: {
  monthly: number;
  ratePct: number;
  years: number;
}) {
  const W = 340;
  const H = 200;
  const padR = 10;
  const padB = 24;
  const padT = 14;
  const padL = 8;
  const x0 = padL;
  const x1 = W - padR;
  const yb = H - padB;
  const yt = padT;

  const invAt = (t: number) => fvAnnuity(monthly, ratePct, t).invested;
  const welAt = (t: number) => fvAnnuity(monthly, ratePct, t).future;
  const maxV = Math.max(welAt(years), 1);
  const X = (t: number) => x0 + (t / years) * (x1 - x0);
  const Y = (v: number) => yb - (v / maxV) * (yb - yt);

  const inv: [number, number][] = [];
  const wel: [number, number][] = [];
  for (let t = 0; t <= years; t++) {
    inv.push([X(t), Y(invAt(t))]);
    wel.push([X(t), Y(welAt(t))]);
  }
  const poly = (pts: [number, number][]) => pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ");

  const invArea = `M ${X(0).toFixed(1)} ${yb} L ${poly(inv)} L ${X(years).toFixed(1)} ${yb} Z`;
  const gainsArea = `M ${poly(wel)} L ${poly(inv.slice().reverse())} Z`;
  const invLine = `M ${poly(inv)}`;
  const welLine = `M ${poly(wel)}`;

  const ticks = [0, Math.round(years / 2), years].filter((v, k, a) => a.indexOf(v) === k);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.chartsvg} role="img" aria-label="Courbe de richesse dans le temps">
      <path d={invArea} className={styles.arInvest} />
      <path d={gainsArea} className={styles.arGains} />
      <path d={invLine} className={styles.lnInvest} vectorEffect="non-scaling-stroke" />
      <path d={welLine} className={styles.lnWel} vectorEffect="non-scaling-stroke" />
      <circle
        cx={X(years).toFixed(1)}
        cy={Y(welAt(years)).toFixed(1)}
        r={4}
        className={styles.dot}
        vectorEffect="non-scaling-stroke"
      />
      {ticks.map((tk, k) => (
        <text
          key={k}
          x={X(tk).toFixed(1)}
          y={H - 7}
          textAnchor={k === 0 ? "start" : k === ticks.length - 1 ? "end" : "middle"}
          className={styles.ctX}
        >
          {tk} an{tk > 1 ? "s" : ""}
        </text>
      ))}
    </svg>
  );
}
