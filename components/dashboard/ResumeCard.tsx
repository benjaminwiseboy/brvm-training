import Link from "next/link";
import { getModule } from "@/content/registry";
import styles from "./ResumeCard.module.css";

/**
 * Héro du tableau de bord — port de buildHero() dans POC-Module-1/dashboard.js
 * (salutation + carte « Reprendre »).
 *
 * Décisions (gaps non couverts par le brief) :
 * - Défaut de `resume` : `{ code: "M01", slide: 0 }` (per le brief) —
 *   l'apprenant qui n'a jamais commencé retombe sur le tout premier module.
 * - `resume.slide` est l'index 0-indexé de `SlideDeck` (posé par
 *   `setResumeSlide`, Task 10) : affiché ici en 1-indexé (`slide + 1`), sinon
 *   "slide 0/7" se lirait mal pour un apprenant.
 * - `U.name` (POC) n'a pas d'équivalent réel en v0 (pas de compte) : la
 *   salutation est générique, sans identité inventée — cf. Hero.tsx (Task 6)
 *   qui prend déjà la même décision pour l'écran d'accueil de module.
 * - Si `getModule(code)` renvoie `undefined` (code pas encore converti,
 *   Tâches 14-18) : titre = code brut, sous-ligne réduite au numéro de
 *   slide seul — jamais de crash, jamais de ligne cachée (même repli que
 *   ModuleMap, cf. task-11-report.md).
 */
export function ResumeCard({
  resume,
  pct,
}: {
  resume?: { code: string; slide: number };
  pct: number;
}) {
  const r = resume ?? { code: "M01", slide: 0 };
  const mod = getModule(r.code);
  const title = mod?.title ?? r.code;
  const slideDisplay = r.slide + 1;
  const subline = mod ? `${mod.phase} — slide ${slideDisplay}/${mod.slides.length}` : `slide ${slideDisplay}`;

  return (
    <div className={styles.hero}>
      <p className={styles.greet}>Bonjour 👋</p>
      <h1 className={styles.name}>Ravi de vous revoir !</h1>
      <p className={styles.sub}>
        Vous êtes à <b>{pct} %</b> du parcours. On continue ?
      </p>

      <Link href={`/module/${r.code.toLowerCase()}`} className={styles.resume}>
        <span className={styles.play}>▶</span>
        <div className={styles.meta}>
          <div className={styles.k}>Reprendre où vous en étiez</div>
          <div className={styles.t}>
            {r.code} · {title}
          </div>
          <div className={styles.subline}>{subline}</div>
        </div>
        <span className={styles.arw}>→</span>
      </Link>
    </div>
  );
}
