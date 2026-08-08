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
