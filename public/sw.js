// Service worker minimal : un handler `fetch` est requis par les critères
// d'installabilité PWA (Chrome/Android) pour proposer l'ajout à l'écran
// d'accueil. Volontairement sans stratégie de cache — l'app est dynamique
// (auth par requête, cf. app/layout.tsx) et un cache agressif risquerait de
// servir un état de session périmé.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});

// Relances de formation envoyées par app/api/cron/reengagement — payload
// JSON { title, body, url } posé par web-push côté serveur.
self.addEventListener("push", (event) => {
  let payload = { title: "BRVM Learning", body: "Reprends ta formation.", url: "/" };
  try {
    if (event.data) payload = { ...payload, ...event.data.json() };
  } catch {
    // Payload non-JSON : on garde les valeurs par défaut plutôt que d'échouer.
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: payload.url },
    })
  );
});

// Focus un onglet déjà ouvert sur l'app plutôt que d'en empiler un nouveau.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
