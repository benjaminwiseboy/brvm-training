"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/nav/AppShell";
import { useProgress, readPlans } from "@/lib/store";
import { renderMarkup } from "@/lib/markup";
import { whatsappHref } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/engine/WhatsAppIcon";
import { getResource, isResourceUnlocked } from "@/content/vault";
import { PLAN_PILLARS, emptyPlan, filledCount, planToText, type InvestmentPlan } from "@/lib/plan";
import styles from "./page.module.css";

const INTRO =
  "Un plan répond à 5 questions : **pourquoi** vous investissez, **pour quand**, **comment**, **avec quel dosage de risque** et **avec combien**. C'est le document que vous relirez avant chaque décision — et le seul rempart contre les achats d'humeur.";

/**
 * `/coffre/plan` — le Plan d'Investissement Personnel.
 *
 * Il existait déjà, mais le temps d'un écran : le défi du module 09 faisait
 * choisir les 5 piliers, le bilan en affichait le récap, puis les réponses
 * disparaissaient avec le `useState` de `ModulePlayer`. Le Coffre-fort
 * l'annonçait pourtant comme une ressource, et la fin de Phase 2 promettait
 * un export. Cette page lui donne une vie : on le consulte, on le MODIFIE
 * quand la situation change (elle change), et on peut en tenir plusieurs —
 * un plan « rente » et un plan « études des enfants » n'ont ni le même
 * horizon ni la même stratégie.
 */
export default function PlanPage() {
  const { state, hydrated, savePlan, deletePlan } = useProgress();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<InvestmentPlan | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const resource = getResource("plan-investissement")!;
  const unlocked = hydrated && isResourceUnlocked(resource, state.completed);
  const plans = readPlans(state);

  function startEdit(plan: InvestmentPlan) {
    setDraft({ ...plan, pillars: { ...plan.pillars } });
    setEditingId(plan.id);
  }

  function startNew() {
    const plan = emptyPlan(plans.length === 0 ? "Mon plan d'investissement" : "Nouveau plan");
    setDraft(plan);
    setEditingId(plan.id);
  }

  function commit() {
    if (draft) savePlan({ ...draft, name: draft.name.trim() || "Plan sans titre" });
    setDraft(null);
    setEditingId(null);
  }

  function cancel() {
    setDraft(null);
    setEditingId(null);
  }

  function confirmDelete(plan: InvestmentPlan) {
    if (window.confirm(`Supprimer « ${plan.name} » ? Cette action est irréversible.`)) {
      deletePlan(plan.id);
      if (editingId === plan.id) cancel();
    }
  }

  async function copy(plan: InvestmentPlan) {
    try {
      await navigator.clipboard.writeText(planToText(plan));
      setCopiedId(plan.id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  }

  if (!hydrated) return null;

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
          <h1 className={styles.h1}>Plan d&rsquo;Investissement Personnel</h1>
          <p className={styles.lockedText}>
            Il se construit au <strong>module 09</strong>, à la fin de la Phase 2 — et il
            s&rsquo;installe ici, pour être relu et modifié aussi souvent que votre situation
            change.
          </p>
          <Link href="/parcours" className={styles.lockedBtn}>
            Reprendre le parcours →
          </Link>
        </div>
      ) : (
        <>
          <header className={styles.head}>
            <p className={styles.eyebrow}>Coffre-fort</p>
            <h1 className={styles.h1}>Plan d&rsquo;Investissement Personnel</h1>
            <p className={styles.lead}>{renderMarkup(INTRO)}</p>
          </header>

          {plans.length === 0 && !draft && (
            <div className={styles.empty}>
              <span className={styles.emptyIc} aria-hidden="true">
                📝
              </span>
              <p className={styles.emptyText}>
                Vous n&rsquo;avez pas encore de plan enregistré. Rejouez le défi du module 09 pour
                le construire pas à pas, ou écrivez-le directement ici.
              </p>
              <div className={styles.emptyActions}>
                <button type="button" className={styles.primary} onClick={startNew}>
                  Créer un plan
                </button>
                <Link href="/module/m09" className={styles.ghost}>
                  Refaire le module 09
                </Link>
              </div>
            </div>
          )}

          <div className={styles.list}>
            {plans.map((plan) =>
              editingId === plan.id && draft ? (
                <PlanEditor
                  key={plan.id}
                  draft={draft}
                  onChange={setDraft}
                  onCommit={commit}
                  onCancel={cancel}
                />
              ) : (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  copied={copiedId === plan.id}
                  onEdit={() => startEdit(plan)}
                  onDelete={() => confirmDelete(plan)}
                  onCopy={() => copy(plan)}
                />
              )
            )}

            {/* Plan tout neuf : il n'est pas encore dans `plans`, on rend son
                éditeur à part plutôt que d'enregistrer une coquille vide qu'il
                faudrait ensuite nettoyer si l'apprenant renonce. */}
            {draft && !plans.some((p) => p.id === draft.id) && (
              <PlanEditor draft={draft} onChange={setDraft} onCommit={commit} onCancel={cancel} />
            )}
          </div>

          {plans.length > 0 && !draft && (
            <button type="button" className={styles.add} onClick={startNew}>
              + Ajouter un autre plan
            </button>
          )}

          <section className={styles.review}>
            <span className={styles.reviewIc} aria-hidden="true">
              🤝
            </span>
            <div className={styles.reviewBody}>
              <strong>Un avis extérieur sur votre plan ?</strong>
              <p>
                Envoyez-le-moi : on vérifie ensemble que l&rsquo;horizon, la stratégie et la
                capacité d&rsquo;épargne se tiennent avant que vous n&rsquo;engagiez votre argent.
                Service d&rsquo;accompagnement payant.
              </p>
            </div>
            <a
              className={styles.reviewBtn}
              href={whatsappHref(
                "Bonjour ! J'ai construit mon plan d'investissement avec BRVM Learning et j'aimerais votre avis dessus. Quelles sont les modalités de votre accompagnement ?"
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className={styles.reviewIcon} /> Faire relire
            </a>
          </section>

          <p className={styles.disclaimer}>
            ⚠️ Votre plan est un support de décision personnel. BRVM Learning ne fournit aucun
            conseil en investissement personnalisé.
          </p>
        </>
      )}
    </AppShell>
  );
}

function PlanCard({
  plan,
  copied,
  onEdit,
  onDelete,
  onCopy,
}: {
  plan: InvestmentPlan;
  copied: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
}) {
  const filled = filledCount(plan);
  return (
    <article className={styles.card}>
      <div className={styles.cardHead}>
        <div className={styles.cardTitleWrap}>
          <h2 className={styles.cardTitle}>{plan.name}</h2>
          <p className={styles.cardMeta}>
            {filled} / {PLAN_PILLARS.length} piliers renseignés · modifié le{" "}
            {new Date(plan.updatedAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <button type="button" className={styles.editBtn} onClick={onEdit}>
          Modifier
        </button>
      </div>

      <dl className={styles.pillars}>
        {PLAN_PILLARS.map((pillar) => {
          const value = plan.pillars[pillar.key];
          return (
            <div key={pillar.key} className={`${styles.pillar} ${value ? "" : styles.pillarEmpty}`}>
              <dt>
                <span className={styles.pillarIc} aria-hidden="true">
                  {pillar.icon}
                </span>
                {pillar.label}
              </dt>
              <dd>{value || "À compléter"}</dd>
            </div>
          );
        })}
      </dl>

      {plan.notes?.trim() && <p className={styles.notes}>{plan.notes}</p>}

      <div className={styles.cardActions}>
        <button type="button" className={styles.linkBtn} onClick={onCopy}>
          {copied ? "✓ Copié" : "Copier le plan"}
        </button>
        <button type="button" className={`${styles.linkBtn} ${styles.danger}`} onClick={onDelete}>
          Supprimer
        </button>
      </div>
    </article>
  );
}

/**
 * Éditeur d'un plan. Chaque pilier propose les réponses du module 09 en
 * pastilles cliquables ET un champ libre : le vocabulaire du cours guide
 * sans enfermer — la vraie situation de quelqu'un tient rarement dans trois
 * options.
 */
function PlanEditor({
  draft,
  onChange,
  onCommit,
  onCancel,
}: {
  draft: InvestmentPlan;
  onChange: (plan: InvestmentPlan) => void;
  onCommit: () => void;
  onCancel: () => void;
}) {
  function setPillar(key: string, value: string) {
    onChange({ ...draft, pillars: { ...draft.pillars, [key]: value } });
  }

  return (
    <article className={`${styles.card} ${styles.cardEditing}`}>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Nom du plan</span>
        <input
          type="text"
          className={styles.input}
          value={draft.name}
          onChange={(e) => onChange({ ...draft, name: e.target.value })}
          placeholder="Ma retraite, les études des enfants…"
          maxLength={60}
        />
      </label>

      {PLAN_PILLARS.map((pillar) => {
        const value = draft.pillars[pillar.key] ?? "";
        return (
          <div key={pillar.key} className={styles.editPillar}>
            <p className={styles.editLabel}>
              <span aria-hidden="true">{pillar.icon}</span> {pillar.label}
            </p>
            <p className={styles.editPrompt}>{pillar.prompt}</p>
            <div className={styles.chips}>
              {pillar.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`${styles.chip} ${value === option ? styles.chipOn : ""}`}
                  onClick={() => setPillar(pillar.key, value === option ? "" : option)}
                  aria-pressed={value === option}
                >
                  {option}
                </button>
              ))}
            </div>
            <input
              type="text"
              className={styles.input}
              value={value}
              onChange={(e) => setPillar(pillar.key, e.target.value)}
              placeholder="…ou écrivez votre propre réponse"
            />
          </div>
        );
      })}

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Notes (facultatif)</span>
        <textarea
          className={styles.textarea}
          rows={3}
          value={draft.notes ?? ""}
          onChange={(e) => onChange({ ...draft, notes: e.target.value })}
          placeholder="Ce que vous ne voulez pas oublier : montant de départ, échéances, contraintes…"
        />
      </label>

      <div className={styles.editActions}>
        <button type="button" className={styles.primary} onClick={onCommit}>
          Enregistrer
        </button>
        <button type="button" className={styles.ghost} onClick={onCancel}>
          Annuler
        </button>
      </div>
    </article>
  );
}
