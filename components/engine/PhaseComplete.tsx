"use client";

import styles from "./PhaseComplete.module.css";

// Numéro WhatsApp de contact admin (fourni par le porteur du projet) — pas
// d'intégration Stripe pour l'instant : la conversion "gratuit → payant" se
// fait en message direct. Format wa.me = chiffres seuls, sans "+".
const WHATSAPP_NUMBER = "33754232300";

function whatsappHref(phaseName: string): string {
  const text = `Bonjour ! Je viens de terminer ${phaseName} (gratuite) sur BRVM Learning et j'aimerais en savoir plus sur la suite du parcours.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
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

// Glyphe WhatsApp monochrome (hérite du blanc du bouton) — l'emoji 💬 utilisé
// avant ressortait en pâle sur le vert et ne signalait pas le canal.
function WhatsAppIcon() {
  return (
    <svg className={styles.waIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

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
            href={whatsappHref(name)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon /> Discuter sur WhatsApp
          </a>
        </div>
      )}

      <button type="button" className={styles.btn} onClick={onNext}>
        Continuer <span className={styles.arw}>→</span>
      </button>
    </div>
  );
}
