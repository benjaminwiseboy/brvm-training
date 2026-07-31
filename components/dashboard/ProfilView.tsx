"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useProgress, deriveStatus } from "@/lib/store";
import { money } from "@/lib/format";
import { logout, updateEmail } from "@/lib/actions/auth";
import styles from "./ProfilView.module.css";

// 28 = Module["totalModules"] (lib/types.ts), même valeur que Dashboard.tsx.
const TOTAL_MODULES = 28;

export function ProfilView({ isAdmin }: { isAdmin: boolean }) {
  const { state, userEmail, reset } = useProgress();
  const doneCount = Object.keys(state.completed).length;
  const status = deriveStatus(doneCount);
  const initial = (userEmail ?? "?").charAt(0).toUpperCase();

  const [editingEmail, setEditingEmail] = useState(false);
  const [emailState, emailAction, emailPending] = useActionState(updateEmail, undefined);

  return (
    <div>
      <h1 className={styles.h1}>Profil & paramètres</h1>

      <div className={styles.card}>
        <div className={styles.avatar}>{initial}</div>
        <div className={styles.identity}>{userEmail ?? "Mon compte"}</div>
      </div>

      <div className={styles.stats}>
        <Stat cls={styles.stBlue} icon={status.emoji} val={status.label} label="Statut" />
        <Stat cls={styles.stGold} icon="💰" val={money(state.capital)} label="Portefeuille" />
        <Stat cls={styles.stTeal} icon="🔥" val={`${state.streak} j`} label="Série" />
        <Stat cls={styles.stGreen} icon="🎓" val={`${doneCount} / ${TOTAL_MODULES}`} label="Modules" />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Compte</h2>

        {editingEmail ? (
          <form action={emailAction} className={styles.emailForm}>
            {emailState?.error && <p className={styles.formError}>{emailState.error}</p>}
            {emailState?.message && <p className={styles.formSuccess}>{emailState.message}</p>}
            <input
              type="email"
              name="email"
              defaultValue={userEmail ?? ""}
              required
              className={styles.emailInput}
            />
            <div className={styles.emailActions}>
              <button type="submit" className={styles.saveBtn} disabled={emailPending}>
                {emailPending ? "Envoi…" : "Enregistrer"}
              </button>
              <button type="button" className={styles.cancelBtn} onClick={() => setEditingEmail(false)}>
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <button type="button" className={styles.row} onClick={() => setEditingEmail(true)}>
            <span>Modifier l&apos;e-mail</span>
            <span className={styles.arrow}>→</span>
          </button>
        )}

        <Link href="/reset-password" className={styles.row}>
          <span>Changer le mot de passe</span>
          <span className={styles.arrow}>→</span>
        </Link>

        <form action={logout}>
          <button type="submit" className={`${styles.row} ${styles.danger}`}>
            <span>Se déconnecter</span>
            <span className={styles.arrow}>→</span>
          </button>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Zone sensible</h2>
        {/* Déplacé depuis la sidebar (Fix, demande explicite) : le bouton y
            était toujours visible, à portée d'un clic accidentel — ici, il
            faut délibérément venir sur /profil pour le trouver. */}
        <button
          type="button"
          className={`${styles.row} ${styles.danger}`}
          onClick={() => {
            if (
              window.confirm("Réinitialiser toute la progression et le portefeuille ? Cette action est irréversible.")
            ) {
              reset();
            }
          }}
        >
          <span>Réinitialiser la progression</span>
          <span className={styles.arrow}>→</span>
        </button>
      </div>

      <div className={styles.disclaimer}>
        ⚠️ <strong>Avertissement :</strong> BRVM Learning fournit un contenu purement éducatif et ne constitue en
        aucun cas un conseil en investissement personnalisé. Les performances passées ne garantissent pas les
        performances futures.
      </div>

      {isAdmin && (
        <Link href="/admin" className={styles.adminLink}>
          → Voir l&apos;espace admin
        </Link>
      )}
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
