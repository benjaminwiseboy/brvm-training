"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/nav/AppShell";
import { useProgress, deriveStatus } from "@/lib/store";
import { money } from "@/lib/format";
import { orderedCodes } from "@/content/registry";
import { isParcoursComplete } from "@/content/vault";
import {
  CERT_HEIGHT,
  CERT_WIDTH,
  certificateBlob,
  certificateFileName,
  paintCertificate,
  type CertificateFonts,
} from "@/lib/certificate";
import styles from "./page.module.css";

/** Nom saisi pour le certificat — local à l'appareil, comme la check-list. */
const NAME_KEY = "brvm-learning:certificat-nom:v1";

const SHARE_TEXT =
  "Je viens de terminer le parcours BRVM Learning : de zéro à investisseur autonome à la BRVM. 💎";

type ShareCapableNavigator = Navigator & {
  share?: (data: { files?: File[]; title?: string; text?: string; url?: string }) => Promise<void>;
  canShare?: (data: { files?: File[] }) => boolean;
};

/** « awa.traore@… » → « Awa Traore » : un point de départ, pas une vérité. */
function nameFromEmail(email: string | null): string {
  if (!email) return "";
  const local = email.split("@")[0] ?? "";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/**
 * `/certificat` — le certificat de fin de parcours, à télécharger en image
 * et à partager.
 *
 * Il n'existe qu'une fois les 28 modules terminés (même condition que la
 * check-list du Coffre-fort, cf. `content/vault.ts`) : un certificat qu'on
 * peut obtenir sans finir ne vaut rien, ni pour celui qui le publie ni pour
 * ceux qui le voient passer.
 *
 * Le partage se fait sur le FICHIER PNG (via `navigator.share` quand
 * l'appareil le propose — c'est le cas de la quasi-totalité des mobiles),
 * avec un repli honnête sur desktop : téléchargement de l'image + liens
 * pré-remplis vers les réseaux, puisqu'aucun réseau n'accepte qu'un site
 * publie une image à la place de l'utilisateur.
 */
export default function CertificatPage() {
  const { state, userEmail, hydrated } = useProgress();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const displayProbe = useRef<HTMLSpanElement | null>(null);
  const bodyProbe = useRef<HTMLSpanElement | null>(null);

  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const doneCount = Object.keys(state.completed).length;
  const total = orderedCodes().length;
  const complete = isParcoursComplete(state.completed);
  const status = deriveStatus(doneCount);

  useEffect(() => {
    let stored = "";
    try {
      stored = localStorage.getItem(NAME_KEY) ?? "";
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: lire la valeur persistée EST le but de cet effet.
    setName(stored || nameFromEmail(userEmail));
    setShareUrl(window.location.origin);
    setReady(true);
  }, [userEmail]);

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Les polices next/font portent un nom de famille généré : on le lit sur
    // deux sondes invisibles plutôt que de le deviner. Et on attend leur
    // chargement, sinon le premier rendu sortirait en police système.
    try {
      await document.fonts.ready;
    } catch {}
    const fonts: CertificateFonts = {
      display: displayProbe.current
        ? getComputedStyle(displayProbe.current).fontFamily
        : "sans-serif",
      body: bodyProbe.current ? getComputedStyle(bodyProbe.current).fontFamily : "sans-serif",
    };
    paintCertificate(
      canvas,
      {
        name: name.trim() || "Votre nom",
        date: new Date().toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        capital: money(state.capital),
        modulesDone: total,
        statusLabel: status.label,
      },
      fonts
    );
  }, [name, state.capital, total, status.label]);

  useEffect(() => {
    if (!ready || !complete) return;
    void draw();
  }, [ready, complete, draw]);

  function persistName(value: string) {
    setName(value);
    try {
      localStorage.setItem(NAME_KEY, value);
    } catch {}
  }

  async function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await certificateBlob(canvas);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = certificateFileName(name);
    a.click();
    URL.revokeObjectURL(url);
  }

  async function share() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await certificateBlob(canvas);
    if (!blob) return;
    const file = new File([blob], certificateFileName(name), { type: "image/png" });
    const nav = navigator as ShareCapableNavigator;
    if (nav.share && nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({ files: [file], text: SHARE_TEXT, url: shareUrl });
        return;
      } catch {
        // Partage annulé par l'utilisateur : on retombe sur les liens, sans
        // re-télécharger l'image dans son dos.
      }
    }
    setShowLinks(true);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${shareUrl}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  const encoded = encodeURIComponent(`${SHARE_TEXT} ${shareUrl}`);
  const encodedUrl = encodeURIComponent(shareUrl);
  const NETWORKS = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encoded}`, cls: styles.netWa },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      cls: styles.netLi,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      cls: styles.netFb,
    },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${encoded}`, cls: styles.netX },
  ];

  if (!hydrated || !ready) return null;

  return (
    <AppShell variant="dash">
      {/* Sondes de police : invisibles, jamais lues par un lecteur d'écran —
          elles ne servent qu'à connaître le nom de famille réel des webfonts. */}
      <span ref={displayProbe} className={styles.probeDisplay} aria-hidden="true" />
      <span ref={bodyProbe} className={styles.probeBody} aria-hidden="true" />

      {!complete ? (
        <div className={styles.locked}>
          <span className={styles.lockedIc} aria-hidden="true">
            🎓
          </span>
          <h1 className={styles.h1}>Votre certificat vous attend</h1>
          <p className={styles.lockedText}>
            Il se débloque quand les {total} modules sont terminés. Vous en êtes à{" "}
            <strong>
              {doneCount} / {total}
            </strong>
            .
          </p>
          <Link href="/parcours" className={styles.lockedBtn}>
            Reprendre le parcours →
          </Link>
        </div>
      ) : (
        <>
          <header className={styles.head}>
            <p className={styles.eyebrow}>Fin du parcours</p>
            <h1 className={styles.h1}>Votre certificat</h1>
            <p className={styles.lead}>
              Mettez votre nom, téléchargez l&rsquo;image et publiez-la. C&rsquo;est le format
              attendu par LinkedIn, WhatsApp et les autres réseaux.
            </p>
          </header>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Le nom à faire figurer</span>
            <input
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => persistName(e.target.value)}
              placeholder="Prénom Nom"
              maxLength={48}
            />
          </label>

          <div className={styles.preview}>
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              style={{ aspectRatio: `${CERT_WIDTH} / ${CERT_HEIGHT}` }}
              role="img"
              aria-label={`Certificat de fin de parcours BRVM Learning au nom de ${
                name.trim() || "votre nom"
              }`}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.primary} onClick={share}>
              📤 Partager mon certificat
            </button>
            <button type="button" className={styles.ghost} onClick={download}>
              ⬇ Télécharger l&rsquo;image
            </button>
          </div>

          {showLinks && (
            <div className={styles.links}>
              <p className={styles.linksTitle}>Publier depuis cet ordinateur</p>
              <p className={styles.linksText}>
                Téléchargez d&rsquo;abord l&rsquo;image, puis joignez-la à votre publication — un
                site ne peut pas poster une image à votre place.
              </p>
              <div className={styles.netRow}>
                {NETWORKS.map((n) => (
                  <a
                    key={n.label}
                    className={`${styles.net} ${n.cls}`}
                    href={n.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {n.label}
                  </a>
                ))}
              </div>
              <button type="button" className={styles.copy} onClick={copyLink}>
                {copied ? "✓ Copié" : "Copier le message et le lien"}
              </button>
            </div>
          )}

          <div className={styles.nextStep}>
            <span className={styles.nextIc} aria-hidden="true">
              🗝️
            </span>
            <div className={styles.nextBody}>
              <strong>Le certificat, c&rsquo;est la preuve. La suite, c&rsquo;est l&rsquo;action.</strong>
              <p>
                Votre check-list « 7 premiers jours » est débloquée : ouvrir le compte, verser,
                passer le premier ordre.
              </p>
            </div>
            <Link href="/coffre/checklist" className={styles.nextBtn}>
              Ouvrir →
            </Link>
          </div>
        </>
      )}
    </AppShell>
  );
}
