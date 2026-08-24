"use client";

import Link from "next/link";
import { useProgress } from "@/lib/store";
import { money } from "@/lib/format";
import { PHASES, orderedCodes } from "@/content/registry";
import { whatsappHref } from "@/lib/contact";
import { WhatsAppIcon } from "./WhatsAppIcon";
import styles from "./ParcoursComplete.module.css";

// Numéro centralisé dans lib/contact.ts.
const CONTACT_HREF = whatsappHref(
  "Bonjour ! Je viens de terminer les 28 modules de BRVM Learning et je veux passer à l'action. Pouvez-vous m'accompagner pour mes premiers pas ?"
);

// Confettis : même procédé déterministe que PhaseComplete (dispersion dérivée
// de l'index, pas de Math.random — rendu pur, identique serveur/client), mais
// deux fois plus fournis : c'est la fin du parcours, pas d'une phase.
const CONFETTI = Array.from({ length: 32 }, (_, i) => {
  const frac = (n: number) => (i * n) % 1;
  return {
    key: i,
    style: {
      "--x": `${Math.round((frac(0.6180339887) - 0.5) * 260)}px`,
      "--rot": `${Math.round((frac(0.7548776662) - 0.5) * 620)}deg`,
      "--hue": Math.round(frac(0.3819660113) * 360),
      "--delay": `${Math.round(frac(0.2360679775) * 700)}ms`,
      left: `${(5 + frac(0.5698402909) * 90).toFixed(2)}%`,
    } as React.CSSProperties,
  };
});

/**
 * Écran de FIN DE PARCOURS — affiché à la place de `PhaseComplete` après le
 * bilan du tout dernier module (cf. ModulePlayer : `getNext(code) ===
 * undefined`).
 *
 * Pourquoi un écran à part plutôt que le récap de Phase 5 : le premier
 * bêta-testeur a terminé les 28 modules, s'est retrouvé renvoyé sur un
 * tableau de bord entièrement coché, et a dû demander sur WhatsApp « c'est
 * quoi la prochaine étape pour me lancer ? ». Le parcours réussissait à
 * donner envie d'investir, puis laissait cette envie sans porte de sortie —
 * au moment précis où elle est la plus forte.
 *
 * Cet écran ferme les trois trous d'un coup :
 * 1. il RÉCAPITULE les 5 phases (le testeur a explicitement aimé le récap
 *    final : « intéressant à la fin, car c'était un récap de tout le
 *    parcours ») ;
 * 2. il DÉBLOQUE et met en avant la check-list « 7 premiers jours », qui
 *    répond littéralement à sa question ;
 * 3. il donne une SORTIE : le certificat à partager, et un contact direct.
 */
export function ParcoursComplete({ onNext }: { onNext: () => void }) {
  const { state } = useProgress();
  const total = orderedCodes().length;

  return (
    <div className={styles.wrap}>
      <p className={styles.eyebrow}>Fin du parcours</p>

      <div className={styles.card}>
        <div className={styles.confetti} aria-hidden="true">
          {CONFETTI.map((c) => (
            <span key={c.key} className={styles.piece} style={c.style} />
          ))}
        </div>

        <div className={styles.badgeWrap}>
          <span className={styles.ring} aria-hidden="true" />
          <span className={styles.ring2} aria-hidden="true" />
          <div className={styles.badge} aria-hidden="true">
            💎
          </div>
        </div>

        <h2 className={styles.title}>Parcours terminé. Vous êtes prêt.</h2>
        <p className={styles.sub}>
          Les {total} modules, les {PHASES.length} phases, le grand oral et le krach. Vous êtes
          officiellement <strong>Le Loup de la BRVM</strong>.
        </p>

        <div className={styles.stats}>
          <Stat value={`${total} / ${total}`} label="Modules" />
          <Stat value={money(state.capital)} label="Portefeuille (FCFA)" />
          <Stat value={`${state.streak}`} label="Série" />
        </div>

        <ul className={styles.phases}>
          {PHASES.map((p, i) => (
            <li key={p.name} style={{ "--d": i } as React.CSSProperties}>
              <span className={styles.phaseBadge} aria-hidden="true">
                {p.badge}
              </span>
              <span className={styles.phaseName}>{p.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.next}>
        <p className={styles.nextEyebrow}>Et maintenant, concrètement ?</p>
        <h3 className={styles.nextTitle}>Votre première action est déjà prête.</h3>
        <p className={styles.nextText}>
          Savoir analyser ne suffit pas : il faut ouvrir un compte, y verser de l&rsquo;argent et
          passer un premier ordre. Voilà la semaine qui vous en sépare — une étape par jour.
        </p>

        <Link href="/coffre/checklist" className={styles.primary}>
          <span className={styles.primaryIc} aria-hidden="true">
            🗝️
          </span>
          <span className={styles.primaryBody}>
            <strong>Check-list « 7 premiers jours »</strong>
            <span>Débloquée à l&rsquo;instant dans votre Coffre-fort</span>
          </span>
          <span className={styles.arw} aria-hidden="true">
            →
          </span>
        </Link>

        <Link href="/certificat" className={styles.secondary}>
          <span className={styles.secondaryIc} aria-hidden="true">
            🎓
          </span>
          <span className={styles.secondaryBody}>
            <strong>Votre certificat de fin de parcours</strong>
            <span>À télécharger et à partager</span>
          </span>
          <span className={styles.arw} aria-hidden="true">
            →
          </span>
        </Link>

        <p className={styles.hookTitle}>Un doute avant de vous lancer ?</p>
        <p className={styles.hookText}>
          Écrivez-moi : on regarde ensemble votre plan et le choix de votre SGI avant votre premier
          ordre.
        </p>
        <a
          className={styles.whatsappBtn}
          href={CONTACT_HREF}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon className={styles.waIcon} /> Discuter sur WhatsApp
        </a>
      </div>

      <button type="button" className={styles.btn} onClick={onNext}>
        Retour au tableau de bord
      </button>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statVal}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}
