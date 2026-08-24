"use client";

import { whatsappHref } from "@/lib/contact";
import { WhatsAppIcon } from "./WhatsAppIcon";
import styles from "./PhaseComplete.module.css";

// Pas d'intégration Stripe pour l'instant : la conversion "gratuit → payant"
// se fait en message direct (numéro centralisé dans lib/contact.ts).
function phaseUpsellHref(phaseName: string): string {
  return whatsappHref(
    `Bonjour ! Je viens de terminer ${phaseName} (gratuite) sur BRVM Learning et j'aimerais en savoir plus sur la suite du parcours.`
  );
}

// Confettis en CSS pur (aucune lib d'animation dans le projet). La dispersion
// est déterministe (dérivée de l'index via des multiplicateurs irrationnels)
// plutôt qu'aléatoire : même rendu visuel « éparpillé », mais pur au sens React
// — pas de valeur qui saute à chaque re-rendu, pas d'écart serveur/client.
const CONFETTI = Array.from({ length: 16 }, (_, i) => {
  const frac = (n: number) => (i * n) % 1;
  return {
    key: i,
    style: {
      "--x": `${Math.round((frac(0.6180339887) - 0.5) * 220)}px`,
      "--rot": `${Math.round((frac(0.7548776662) - 0.5) * 540)}deg`,
      "--hue": Math.round(frac(0.3819660113) * 360),
      "--delay": `${Math.round(frac(0.2360679775) * 220)}ms`,
      left: `${(8 + frac(0.5698402909) * 84).toFixed(2)}%`,
    } as React.CSSProperties,
  };
});

/**
 * Écran dédié affiché après le Bilan du DERNIER module d'une phase (M04 =
 * fin Phase 1, M10 = fin Phase 2 après renumérotation) — remplace l'ancien
 * procédé qui glissait la félicitation dans le `.note` d'une explication de
 * quiz (M04) ou dans `feedback.plan` (M10/ex-M08) : un vrai écran à part
 * entière, avec badge et récap en puces (demande explicite de la revue).
 *
 * Animation "victoire" façon jeu vidéo (badge qui pop + halo + confettis +
 * récap qui se révèle en cascade) et, pour la Phase 1 en essai gratuit,
 * un bloc d'upsell (`remainingPhases`) vers le reste du parcours + CTA
 * WhatsApp — cf. ModulePlayer pour la condition d'affichage.
 */
export function PhaseComplete({
  badge,
  name,
  recap,
  futureNote,
  remainingPhases,
  onNext,
}: {
  badge: string;
  name: string;
  recap: string[];
  /** Fonctionnalité annoncée mais pas encore construite (ex. export PDF, M10) — rendue en bouton désactivé, pas un lien mort. */
  futureNote?: string;
  /** Non vide seulement pour un compte gratuit qui termine la Phase 1 (cf. ModulePlayer) — teaser du reste du parcours + CTA contact. */
  remainingPhases?: { badge: string; name: string; highlight: string }[];
  onNext: () => void;
}) {
  return (
    <div className={styles.wrap}>
      <p className={styles.eyebrow}>Fin de phase</p>

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
            {badge}
          </div>
        </div>
        <h2 className={styles.title}>Bravo, vous terminez {name} !</h2>
        <p className={styles.sub}>Voici ce que vous savez faire maintenant :</p>
        <ul className={styles.recap}>
          {recap.map((r, i) => (
            <li key={i} style={{ "--d": i } as React.CSSProperties}>
              {r}
            </li>
          ))}
        </ul>

        {futureNote && (
          <button type="button" className={styles.futureBtn} disabled>
            {futureNote}
          </button>
        )}
      </div>

      {remainingPhases && remainingPhases.length > 0 && (
        <div className={styles.upsell}>
          <p className={styles.upsellEyebrow}>Et la suite du parcours ?</p>
          <ul className={styles.upsellList}>
            {remainingPhases.map((p) => (
              <li key={p.name}>
                <span className={styles.upsellBadge} aria-hidden="true">
                  {p.badge}
                </span>
                <div>
                  <strong>{p.name}</strong>
                  <p>{p.highlight}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className={styles.hookTitle}>Envie d&rsquo;aller jusqu&rsquo;au bout ?</p>
          <p className={styles.hookText}>
            Écrivez-moi directement, je vous explique comment débloquer la suite du parcours.
          </p>
          <a
            className={styles.whatsappBtn}
            href={phaseUpsellHref(name)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon className={styles.waIcon} /> Discuter sur WhatsApp
          </a>
        </div>
      )}

      <button type="button" className={styles.btn} onClick={onNext}>
        Continuer <span className={styles.arw}>→</span>
      </button>
    </div>
  );
}
