import { PHASES, orderedCodes } from "@/content/registry";
import { money } from "@/lib/format";
import { ScoreRing } from "@/components/engine/ScoreRing";
import styles from "./ProgressCard.module.css";

/**
 * Nom court de la phase qui suit celle du module "current" (cf.
 * `deriveStatus`, lib/store.tsx, qui utilise déjà `order[doneCount]` comme
 * position du module courant). Reproduit dynamiquement la phrase du POC
 * ("Encore un effort pour débloquer la Phase 3", un fait figé de son mock
 * 7/26 modules, M08 courant en Phase 2) plutôt que de la paraphraser ou de
 * la coder en dur — se généralise correctement à tout état de progression.
 */
function nextPhaseShortName(doneCount: number): string | undefined {
  const order = orderedCodes();
  if (order.length === 0) return undefined;
  const idx = Math.min(Math.max(doneCount, 0), order.length - 1);
  const code = order[idx];
  const phaseIdx = PHASES.findIndex((p) => p.codes.includes(code));
  const next = PHASES[phaseIdx + 1];
  return next ? next.name.split(" · ")[0] : undefined;
}

/**
 * Carte de progression — port de buildProgress() dans
 * POC-Module-1/dashboard.js (anneau + 4 pastilles).
 *
 * Le brief (Step 3) demande 4 pastilles dans cet ordre : statut
 * (`deriveStatus`), capital, série, `doneCount/total` — une pastille de plus
 * que le POC (qui n'affichait le statut que dans la sidebar/le header, pas
 * dans cette carte) ; « capital (Wallet/money) » est lu comme « formater
 * avec `money()`, le même helper que le composant `Wallet` » — le composant
 * `Wallet` lui-même (pilule animée) n'est pas réutilisé tel quel ici, son
 * habillage ne correspondant pas au gabarit rond-icône + valeur/label des
 * autres pastilles.
 */
export function ProgressCard({
  doneCount,
  total,
  capital,
  streak,
  status,
}: {
  doneCount: number;
  total: number;
  capital: number;
  streak: number;
  status: { emoji: string; label: string };
}) {
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const nextPhase = nextPhaseShortName(doneCount);

  return (
    <div className={styles.scorecard}>
      <div className={styles.ring}>
        <ScoreRing pct={pct} label="complété" />
      </div>
      <div className={styles.main}>
        <div className={styles.icon}>📈</div>
        <h2 className={styles.title}>Beau parcours !</h2>
        <p className={styles.body}>
          Vous avez terminé{" "}
          <b>
            {doneCount} modules sur {total}
          </b>
          . {nextPhase ? `Encore un effort pour débloquer la ${nextPhase}.` : "Vous touchez au but !"}
        </p>
        <div className={styles.stats}>
          <Stat cls={styles.stBlue} icon={status.emoji} val={status.label} label="Statut" />
          <Stat cls={styles.stGold} icon="💰" val={money(capital)} label="Portefeuille" />
          <Stat cls={styles.stTeal} icon="🔥" val={`${streak} j`} label="Série" />
          <Stat cls={styles.stGreen} icon="🎓" val={`${doneCount} / ${total}`} label="Modules" />
        </div>
      </div>
    </div>
  );
}

function Stat({ cls, icon, val, label }: { cls: string; icon: string; val: string; label: string }) {
  return (
    <div className={`${styles.stat} ${cls}`}>
      <span className={styles.statIc}>{icon}</span>
      <div className={styles.statMeta}>
        <span className={styles.statVal}>{val}</span>
        <span className={styles.statLabel}>{label}</span>
      </div>
    </div>
  );
}
