"use client";

import { useEffect, useState } from "react";
import styles from "./InstallPrompt.module.css";

const DISMISS_KEY = "brvm-learning:pwa-install-dismissed-at";
const DISMISS_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000; // 14 jours

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari : pas de `display-mode`, mais expose `navigator.standalone`.
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isDismissedRecently(): boolean {
  const raw = window.localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  return Number.isFinite(dismissedAt) && Date.now() - dismissedAt < DISMISS_COOLDOWN_MS;
}

// Safari iOS ne déclenche jamais `beforeinstallprompt` : seul moyen fiable de
// proposer l'install, c'est un mode d'emploi manuel (Partager → écran d'accueil).
function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent) && !("MSStream" in window);
}

function isMobile(): boolean {
  return (
    /android|iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

// Le vrai glyphe « Partager » d'iOS (carré + flèche sortante). L'emoji 📤 qui
// servait avant ne lui ressemble pas — les utilisateurs iOS ne reconnaissaient
// pas le bouton à chercher dans la barre Safari.
function ShareIcon() {
  return (
    <svg className={styles.shareIcon} viewBox="0 0 24 24" role="img" aria-label="l'icône Partager">
      <path
        d="M12 3v11M12 3 8.5 6.5M12 3l3.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 10H5.6A1.6 1.6 0 0 0 4 11.6v7.8A1.6 1.6 0 0 0 5.6 21h12.8a1.6 1.6 0 0 0 1.6-1.6v-7.8A1.6 1.6 0 0 0 18.4 10H17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSHelp, setShowIOSHelp] = useState(false);
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Installabilité dégradée en douceur : le manifest seul suffit déjà
        // sur la plupart des navigateurs, pas besoin de bloquer l'UI ici.
      });
    }

    if (!isMobile() || isStandalone() || isDismissedRecently()) return;

    if (isIOS()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: reading platform capability (UA sniffing) on mount is the effect's whole purpose, not a derived-state anti-pattern.
      setShowIOSHelp(true);
      setVisible(true);
      return;
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };
    const onAppInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  function dismiss() {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    setInstalling(true);
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setInstalling(false);
    setDeferredPrompt(null);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className={styles.sheet} role="dialog" aria-label="Installer l'application BRVM Learning">
      <button type="button" className={styles.close} onClick={dismiss} aria-label="Fermer">
        ✕
      </button>
      <div className={styles.mark}>B</div>
      <div className={styles.body}>
        <div className={styles.title}>Installe l&rsquo;application mobile</div>
        {showIOSHelp ? (
          <div className={styles.text}>
            <p className={styles.iosIntro}>Pour l&rsquo;installer sur ton iPhone, dans Safari :</p>
            <ol className={styles.steps}>
              <li>
                Appuie sur <ShareIcon /> <strong>en bas de l&rsquo;écran</strong>.
              </li>
              <li>
                Fais défiler le menu vers le bas, puis appuie sur{" "}
                <strong>« Sur l&rsquo;écran d&rsquo;accueil »</strong>.
              </li>
              <li>
                Appuie sur <strong>« Ajouter »</strong> en haut à droite. C&rsquo;est fait ! 🎉
              </li>
            </ol>
          </div>
        ) : (
          <div className={styles.text}>Installe BRVM Learning sur ton téléphone pour un accès direct depuis ton écran d&rsquo;accueil.</div>
        )}
      </div>
      {!showIOSHelp && (
        <button type="button" className={styles.install} onClick={handleInstall} disabled={installing}>
          {installing ? "…" : "Installer l'application"}
        </button>
      )}
    </div>
  );
}
