"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@/lib/store";
import { subscribeToPush } from "@/lib/actions/push";
import styles from "./InstallPrompt.module.css";

const DISMISS_KEY = "brvm-learning:notif-prompt-dismissed-at";
const DISMISS_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000; // 14 jours

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isDismissedRecently(): boolean {
  const raw = window.localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  return Number.isFinite(dismissedAt) && Date.now() - dismissedAt < DISMISS_COOLDOWN_MS;
}

// L'API Push exige la clé VAPID en Uint8Array, pas en base64url brut.
// Cast explicite : `Uint8Array.from` type le buffer en `ArrayBufferLike`
// (englobe SharedArrayBuffer), incompatible avec `BufferSource` attendu par
// `applicationServerKey` — toujours un vrai `ArrayBuffer` en pratique ici.
function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const base64Safe = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64Safe);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0))) as Uint8Array<ArrayBuffer>;
}

/**
 * Propose d'activer les notifications de relance ("reprends ta formation")
 * — uniquement pour un compte connecté (`userEmail`, cf. lib/store.tsx) et
 * une fois l'app installée en PWA : sur iOS, la Push API n'existe même pas
 * hors mode standalone, et sur Android/desktop l'expérience est cohérente
 * avec InstallPrompt (même geste "d'engagement" envers l'app).
 */
export function NotificationPrompt() {
  const { userEmail } = useProgress();
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userEmail) return;
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) return;
    if (!isStandalone()) return;
    if (Notification.permission !== "default") return; // déjà accepté ou refusé, on ne redemande jamais
    if (isDismissedRecently()) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: reading platform capability (Notification.permission, standalone mode) on mount is the effect's whole purpose, not a derived-state anti-pattern.
    setVisible(true);
  }, [userEmail]);

  function dismiss() {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  }

  async function handleEnable() {
    setPending(true);
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        dismiss();
        return;
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) throw new Error("Notifications non configurées.");

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      const result = await subscribeToPush(subscription.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } });
      if (result.error) throw new Error(result.error);

      setVisible(false);
    } catch {
      setError("Impossible d'activer les notifications, réessayez.");
    } finally {
      setPending(false);
    }
  }

  if (!visible) return null;

  return (
    <div className={styles.sheet} role="dialog" aria-label="Activer les notifications">
      <button type="button" className={styles.close} onClick={dismiss} aria-label="Fermer">
        ✕
      </button>
      <div className={styles.mark}>🔔</div>
      <div className={styles.body}>
        <div className={styles.title}>Active les notifications</div>
        <div className={styles.text}>
          Reçois un rappel si tu t&rsquo;éloignes trop longtemps de ta formation BRVM Learning.
        </div>
        {error && <div className={styles.text}>{error}</div>}
      </div>
      <button type="button" className={styles.install} onClick={handleEnable} disabled={pending}>
        {pending ? "…" : "Activer"}
      </button>
    </div>
  );
}
