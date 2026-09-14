"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/nav/AppShell";
import { useProgress } from "@/lib/store";
import { renderMarkup } from "@/lib/markup";
import { orderedCodes } from "@/content/registry";
import { getResource, isResourceUnlocked } from "@/content/vault";
import { ACCOMPAGNEMENT, ACCOMPAGNEMENT_HREF } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/engine/WhatsAppIcon";
import {
  CHECKLIST,
  CHECKLIST_AFTER,
  CHECKLIST_COMPARATOR,
  CHECKLIST_DISCLAIMER,
  CHECKLIST_LEAD,
  CHECKLIST_TITLE,
  CHECKLIST_TOTAL_STEPS,
  EMAIL_TEMPLATE,
  INVESTOR_ROUTINE,
  ROUTINE_LEAD,
  ROUTINE_TITLE,
} from "@/content/checklist";
import styles from "./page.module.css";

/**
 * Clé de persistance des cases cochées — DÉLIBÉRÉMENT séparée de
 * `STORAGE_KEY` (lib/progress.ts) et donc locale à l'appareil.
 *
 * Pourquoi ne pas la ranger dans `ProgressState`, qui se synchronise déjà ?
 * Parce que la synchro passe par le RPC `merge_user_progress`
 * (supabase/migrations/20260731165330_*.sql), qui reconstruit l'état avec
 * `jsonb_build_object` : toute clé qu'il ne connaît pas serait effacée à la
 * première écriture. Et l'étendre imposerait le modèle de fusion « monotone »
 * du reste du store (capital = `greatest`, ressources = union) — parfait pour
 * une progression qui ne recule jamais, faux pour une case à cocher, qu'on
 * doit pouvoir DÉCOCHER. Un appareil qui resynchroniserait un état périmé
 * ferait revenir les coches sous les doigts de l'apprenant.
 */
const CHECKLIST_KEY = "brvm-learning:checklist:v1";

function loadChecked(): string[] {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/**
 * `/coffre/checklist` — la check-list « 7 premiers jours », première
 * ressource RÉELLE du Coffre-fort (les autres restent des « Bientôt »).
 *
 * Elle répond au trou signalé par le premier bêta-testeur : le parcours
 * donnait envie d'investir sans jamais dire par quoi commencer le lundi
 * matin. Verrouillée jusqu'au dernier module (`content/vault.ts`), elle
 * s'ouvre pile au moment où cette envie est à son maximum.
 */
export default function ChecklistPage() {
  const { state, hydrated } = useProgress();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: lire l'état persisté EST le but de cet effet (même précédent que lib/store.tsx).
    setChecked(new Set(loadChecked()));
    setReady(true);
  }, []);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(CHECKLIST_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(
        `Objet : ${EMAIL_TEMPLATE.subject}

${EMAIL_TEMPLATE.body}`
      );
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 2000);
    } catch {}
  }

  const resource = getResource("checklist-7-jours")!;
  const unlocked = isResourceUnlocked(resource, state.completed);
  // Avancement DANS le parcours (pour l'état verrouillé) vs avancement DANS
  // la check-list (pour la barre, une fois ouverte) : deux compteurs distincts.
  const total = orderedCodes().length;
  const modulesDone = Object.keys(state.completed).length;
  const doneCount = checked.size;
  const pct = Math.round((doneCount / CHECKLIST_TOTAL_STEPS) * 100);
  const allDone = doneCount === CHECKLIST_TOTAL_STEPS;

  // Même précédent qu'app/page.tsx : ne rien rendre tant que l'état réel
  // n'est pas lu, plutôt que d'afficher une seconde un « 0 / N » faux ou un
  // écran verrouillé à quelqu'un qui a tout terminé.
  if (!hydrated || !ready) return null;

  return (
    <AppShell variant="dash">
      <Link href="/coffre" className={styles.back}>
        ← Le Coffre-fort
      </Link>

      {!unlocked ? (
        <div className={styles.locked}>
          <span className={styles.lockedIc} aria-hidden="true">
            🔒
          </span>
          <h1 className={styles.h1}>{CHECKLIST_TITLE}</h1>
          <p className={styles.lockedText}>
            Elle se débloque dans votre Coffre-fort à la fin de la dernière phase. Vous en êtes à{" "}
            <strong>
              {modulesDone} / {total} modules
            </strong>
            .
          </p>

          {/* Aperçu du contenu : les 7 titres, sans les étapes. Un verrou qui
              ne montre rien de ce qu'il garde ne donne envie de rien. */}
          <ol className={styles.teaser}>
            {CHECKLIST.map((day) => (
              <li key={day.id}>
                <span className={styles.teaserTag} aria-hidden="true">
                  {day.tag}
                </span>
                <span className={styles.teaserTitle}>{day.title}</span>
              </li>
            ))}
            {/* Ce qui vient APRÈS la semaine compte autant dans la promesse :
                sans ça, l'aperçu s'arrête au premier ordre. */}
            <li>
              <span className={styles.teaserTag} aria-hidden="true">
                +
              </span>
              <span className={styles.teaserTitle}>
                {ROUTINE_TITLE} — semaine, mois, trimestre, année
              </span>
            </li>
          </ol>

          <Link href="/parcours" className={styles.lockedBtn}>
            Reprendre le parcours →
          </Link>
        </div>
      ) : (
        <>
          <header className={styles.head}>
            <p className={styles.eyebrow}>Coffre-fort · Ressource débloquée</p>
            <h1 className={styles.h1}>{CHECKLIST_TITLE}</h1>
            <p className={styles.lead}>{renderMarkup(CHECKLIST_LEAD)}</p>
          </header>

          <div className={`${styles.meter} ${allDone ? styles.meterDone : ""}`}>
            <div className={styles.meterTop}>
              <span className={styles.meterLabel}>
                {allDone ? "🎉 Vous êtes investisseur." : "Votre avancement"}
              </span>
              <span className={styles.meterCount}>
                {doneCount} / {CHECKLIST_TOTAL_STEPS} étapes
              </span>
            </div>
            <div
              className={styles.bar}
              role="progressbar"
              aria-valuenow={doneCount}
              aria-valuemin={0}
              aria-valuemax={CHECKLIST_TOTAL_STEPS}
              aria-label="Étapes terminées"
            >
              <span className={styles.fill} style={{ "--p": pct / 100 } as React.CSSProperties} />
            </div>
          </div>

          {/* Route interne depuis le portage du comparateur : `Link` (navigation
              client) et flèche « → », plus le « ↗ » d'un lien qui sort du site. */}
          <Link className={styles.compare} href={CHECKLIST_COMPARATOR.href}>
            <span className={styles.compareIc} aria-hidden="true">
              🏦
            </span>
            <span className={styles.compareBody}>
              <span className={styles.compareLabel}>{CHECKLIST_COMPARATOR.label}</span>
              <span className={styles.compareSub}>{CHECKLIST_COMPARATOR.sublabel}</span>
            </span>
            <span className={styles.compareArw} aria-hidden="true">
              →
            </span>
          </Link>

          <ol className={styles.days}>
            {CHECKLIST.map((day) => {
              const dayDone = day.steps.every((s) => checked.has(s.id));
              return (
                <li key={day.id} className={`${styles.day} ${dayDone ? styles.dayDone : ""}`}>
                  <div className={styles.dayHead}>
                    <span className={styles.tag} aria-hidden="true">
                      {dayDone ? "✓" : day.tag}
                    </span>
                    <div>
                      <h2 className={styles.dayTitle}>{day.title}</h2>
                      <p className={styles.dayGoal}>{day.goal}</p>
                    </div>
                  </div>

                  <ul className={styles.steps}>
                    {day.steps.map((step) => {
                      const on = checked.has(step.id);
                      return (
                        <li key={step.id}>
                          <label
                            className={`${styles.step} ${on ? styles.stepOn : ""} ${
                              step.highlight ? styles.stepKey : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              className={styles.box}
                              checked={on}
                              onChange={() => toggle(step.id)}
                            />
                            <span className={styles.tick} aria-hidden="true" />
                            <span className={styles.stepBody}>
                              <span className={styles.stepLabel}>{renderMarkup(step.label)}</span>
                              {step.hint && <span className={styles.stepHint}>{step.hint}</span>}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Le modèle vit DANS la journée qui le réclame (J1) : c'est
                      l'étape où l'on renonce faute de savoir quoi écrire. */}
                  {day.id === "j1" && (
                    <div className={styles.mail}>
                      <p className={styles.mailIntro}>{EMAIL_TEMPLATE.intro}</p>
                      <div className={styles.mailCard}>
                        <p className={styles.mailSubject}>
                          <span>Objet</span> {EMAIL_TEMPLATE.subject}
                        </p>
                        <pre className={styles.mailBody}>{EMAIL_TEMPLATE.body}</pre>
                      </div>
                      <button type="button" className={styles.mailCopy} onClick={copyEmail}>
                        {emailCopied ? "✓ E-mail copié" : "📋 Copier l'e-mail"}
                      </button>
                      <p className={styles.mailOutro}>{EMAIL_TEMPLATE.outro}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          {/* Offre commerciale, annoncée comme telle. Elle est placée juste
              après la semaine : quelqu'un qui vient de lire les 37 étapes sait
              exactement s'il veut les faire seul ou accompagné. */}
          <section className={styles.help}>
            <span className={styles.helpIc} aria-hidden="true">
              🤝
            </span>
            <h2 className={styles.helpTitle}>{ACCOMPAGNEMENT.title}</h2>
            <p className={styles.helpBody}>{ACCOMPAGNEMENT.body}</p>
            <a
              className={styles.helpBtn}
              href={ACCOMPAGNEMENT_HREF}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className={styles.helpIcon} /> {ACCOMPAGNEMENT.cta}
            </a>
            <p className={styles.helpNote}>{ACCOMPAGNEMENT.note}</p>
          </section>

          {/* Le jour 7 n'est pas une fin : c'est le début d'un rythme. Sans ce
              bloc, la ressource s'arrêtait sur « vous avez passé votre premier
              ordre », et laissait l'apprenant sans le mode d'emploi des mois
              suivants — le moment où l'on décroche, ou l'on s'affole. */}
          <section className={styles.routine}>
            <h2 className={styles.afterTitle}>{ROUTINE_TITLE}</h2>
            <p className={styles.afterLead}>{renderMarkup(ROUTINE_LEAD)}</p>

            <div className={styles.routineBlocks}>
              {INVESTOR_ROUTINE.map((block) => (
                <section key={block.id} className={styles.routineBlock}>
                  <div className={styles.routineHead}>
                    <h3 className={styles.routineCadence}>{block.cadence}</h3>
                    <span className={styles.routineBudget}>{block.budget}</span>
                  </div>
                  <p className={styles.routineGoal}>{block.goal}</p>

                  <ul className={styles.routineItems}>
                    {block.items.map((item) => (
                      <li key={item.id} className={styles.routineItem}>
                        <span className={styles.routineIc} aria-hidden="true">
                          {item.icon}
                        </span>
                        <div className={styles.routineBody}>
                          <strong className={styles.routineItemTitle}>{item.title}</strong>
                          <p className={styles.routineText}>{item.body}</p>
                          {item.link &&
                            (item.link.external ? (
                              <a
                                className={styles.routineLink}
                                href={item.link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {item.link.label} <span aria-hidden="true">↗</span>
                              </a>
                            ) : (
                              <Link className={styles.routineLink} href={item.link.href}>
                                {item.link.label} <span aria-hidden="true">→</span>
                              </Link>
                            ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </section>

          <section className={styles.after}>
            <h2 className={styles.afterTitle}>Les quatre réflexes</h2>
            <p className={styles.afterLead}>
              Ceux-là ne se cochent pas et n&rsquo;ont pas de date — ils se gardent.
            </p>
            <div className={styles.afterGrid}>
              {CHECKLIST_AFTER.map((a) => (
                <div key={a.title} className={styles.afterCard}>
                  <span className={styles.afterIc} aria-hidden="true">
                    {a.icon}
                  </span>
                  <strong className={styles.afterCardTitle}>{a.title}</strong>
                  <p className={styles.afterBody}>{a.body}</p>
                </div>
              ))}
            </div>
          </section>

          <p className={styles.disclaimer}>⚠️ {CHECKLIST_DISCLAIMER}</p>
        </>
      )}
    </AppShell>
  );
}
