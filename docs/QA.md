# Recette manuelle

> Checklist historique de la v0 (26 modules), déplacée depuis l'ancien README. Le parcours compte aujourd'hui **28 modules** (M01–M28) : adapter les numéros. Les vérifications automatiques sont désormais faites par la CI (`.github/workflows/ci.yml`) et le smoke test post-déploiement (`scripts/smoke.sh`).

## Avant une mise en ligne majeure

Deux vérifications manuelles prévues par le plan v0 (Task 19, étapes 1 et 3) **n'ont pas pu être automatisées** dans cet environnement (pas de navigateur/DevTools disponibles) et restent à faire à la main avant de partager le lien de prod :

1. **Parcours complet en navigateur** — `localStorage` vidé, `npm run dev`, puis `/onboarding` → remise du million → M01 → … → M26 → dashboard. Vérifier à l'œil :
   - déverrouillage progressif des modules (un module ne s'ouvre qu'après le précédent) ;
   - reprise au bon slide quand on quitte un module en cours et qu'on y revient — **implémenté** (revue finale, Fix 3 : `ModulePlayer` saute l'intro et initialise `SlideDeck` sur `state.resume.slide` quand le pointeur `resume` désigne le module courant ; vérifié structurellement dans le code) ; un clic-à-clic en direct reste néanmoins recommandé pour confirmer le rendu ;
   - cohérence du capital affiché (Portefeuille / Wallet) au fil des modules ;
   - évolution du statut 🥉 → 💎 et déblocage des badges 🎓 (à M19) et 💎 (à M26).

2. **Revue mobile (DevTools responsive)** — largeur téléphone :
   - la barre latérale (sidebar) devient une barre d'onglets (tabbar) en bas/haut ;
   - le portefeuille (Wallet) passe en mode compact ;
   - les slides des modules défilent correctement au tactile.

Ce que cet agent a vérifié mécaniquement à la place (sans navigateur) : `npm run build` réussi avec les 26 routes `/module/*` pré-générées, `npm test` vert, et un smoke-test HTTP (`curl`) des 29 routes (`/`, `/onboarding`, `/coffre`, `/module/m01`…`/module/m26`) confirmant un code 200 et l'absence de marqueurs d'erreur Next.js dans le HTML rendu. Ce smoke-test ne couvre pas l'état client (localStorage, déverrouillage, animations) — d'où les deux points manuels ci-dessus.
