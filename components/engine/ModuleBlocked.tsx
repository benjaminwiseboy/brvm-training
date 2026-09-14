import Link from "next/link";
import type { Module } from "@/lib/types";
import { MODULES, lockedPhases } from "@/content/registry";
import { moduleMinutes, durationLabel, totalMinutes } from "@/lib/duration";
import { BLOCAGE_ADMIN, DEBLOCAGE, blocageAdminHref, deblocageHref } from "@/lib/contact";
import { WhatsAppIcon } from "./WhatsAppIcon";
import styles from "./ModuleBlocked.module.css";

/**
 * Écran d'un module auquel l'apprenant n'a pas accès — deux raisons possibles :
 *
 * - `payment` : l'essai gratuit (Phase 1) est terminé. Ce n'est PAS une
 *   impasse : c'est l'endroit du parcours où l'envie est la plus forte, on
 *   vient de cliquer sur le module. On y montre donc ce que contient la suite,
 *   puis exactement comment l'obtenir — écrire sur WhatsApp, message déjà
 *   rédigé — dans la même logique que l'écran de fin de Phase 1
 *   (`PhaseComplete`), qui proposait déjà ce chemin.
 * - `admin` : l'accès a été restreint à la main sur ce compte. Là c'est une
 *   anomalie, pas une offre : ton neutre, et un lien pour la signaler.
 */
export function ModuleBlocked({ module, reason = "admin" }: { module: Module; reason?: "admin" | "payment" }) {
  if (reason === "admin") return <AdminBlocked module={module} />;
  return <PaymentBlocked module={module} />;
}

function AdminBlocked({ module }: { module: Module }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>🔒</div>
      <h1 className={styles.title}>Module verrouillé</h1>
      <p className={styles.text}>
        L&apos;accès à «&nbsp;{module.title}&nbsp;» a été restreint pour votre compte. Si vous pensez qu&apos;il
        s&apos;agit d&apos;une erreur, écrivez-moi : je vérifie et je le rouvre.
      </p>
      <a
        className={styles.whatsappBtn}
        href={blocageAdminHref(module.title)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon className={styles.waIcon} /> {BLOCAGE_ADMIN.cta}
      </a>
      <Link className={styles.link} href="/">
        ← Retour au tableau de bord
      </Link>
    </div>
  );
}

function PaymentBlocked({ module }: { module: Module }) {
  const phases = lockedPhases();
  // Ce que l'apprenant achète, chiffré : nombre de modules et temps de contenu
  // encore fermés. Une promesse vague se refuse plus facilement qu'un volume.
  const lockedCodes = phases.flatMap((p) => p.codes);
  const lockedModules = lockedCodes.map((c) => MODULES[c]).filter(Boolean);

  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>🔒</div>
      <p className={styles.eyebrow}>Essai gratuit terminé</p>
      <h1 className={styles.title}>
        «&nbsp;{module.title}&nbsp;» fait partie du parcours complet
      </h1>
      <p className={styles.text}>
        Vous avez terminé la partie gratuite. Ce module — {durationLabel(moduleMinutes(module))} — appartient à la
        suite, qui se débloque en une fois.
      </p>

      <div className={styles.stats}>
        <span className={styles.stat}>
          <strong>{lockedModules.length}</strong> modules encore fermés
        </span>
        <span className={styles.stat}>
          <strong>{durationLabel(totalMinutes(lockedModules))}</strong> de contenu
        </span>
      </div>

      <ul className={styles.phases}>
        {phases.map((p) => (
          <li key={p.name}>
            <span className={styles.phaseBadge} aria-hidden="true">
              {p.badge}
            </span>
            <div>
              <strong>{p.name}</strong>
              <p>{p.teaser ?? p.recap[0] ?? ""}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.unlock}>
        <h2 className={styles.unlockTitle}>{DEBLOCAGE.title}</h2>
        <p className={styles.unlockIntro}>{DEBLOCAGE.intro}</p>
        <ol className={styles.steps}>
          {DEBLOCAGE.steps.map((s, i) => (
            <li key={s.title}>
              <span className={styles.stepNum} aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <strong>
                  <span className={styles.stepIc} aria-hidden="true">
                    {s.icon}
                  </span>
                  {s.title}
                </strong>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <a
          className={styles.whatsappBtn}
          href={deblocageHref(module.title)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon className={styles.waIcon} /> {DEBLOCAGE.cta}
        </a>
        <p className={styles.unlockNote}>
          Message déjà rédigé — il ne part que si vous l&apos;envoyez.
        </p>
      </div>

      <Link className={styles.link} href="/">
        ← Retour au tableau de bord
      </Link>
    </div>
  );
}
