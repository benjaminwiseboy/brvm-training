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
            Installe BRVM Learning sur ton téléphone : appuie sur <strong>Partager</strong> <span aria-hidden>📤</span> puis <strong>Sur l&rsquo;écran d&rsquo;accueil</strong>.
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
