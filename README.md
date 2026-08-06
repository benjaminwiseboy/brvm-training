# BRVM Learning

Formation e-learning interactive sur la BRVM (Bourse Régionale des Valeurs Mobilières) — parcours unique de 26 modules, dashboard de progression, portefeuille pédagogique. Next.js 16 (App Router, Turbopack), zéro dépendance backend, progression persistée dans `localStorage`.

## Lancer en local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000). Redirige automatiquement vers `/onboarding` au premier passage (aucune progression en `localStorage`), puis vers le dashboard une fois `onboarded` posé.

## Tester

```bash
npm test
```

Lance `vitest run` sur les 3 suites du projet (formatage monétaire, store de progression, `validateAll` sur les 26 modules du registry). Au moment de la vérification v0 : **3 fichiers, 21 tests, tous verts**.

## Build de production

```bash
npm run build
```

Vérifie le typage TypeScript et pré-génère toutes les routes statiques, y compris les 26 routes `/module/[code]` via `generateStaticParams` (`m01` → `m26`). Un module mal formé dans `content/registry.ts` ferait échouer ce build — c'est le garde-fou de contenu.

Pour servir le build de prod en local (sans le mode dev) :

```bash
npm run start
```

## Déployer sur Vercel

Le projet Vercel `brvm-training` est connecté au dépôt GitHub `benjaminwiseboy/brvm-training` (déploiement automatique à chaque push).

- **`main`** → déploiement **Production** (`brvm-training.vercel.app`).
- **`develop`** → environnement de **dev/test**, déploiement Preview à chaque push, URL stable : `https://brvm-training-git-develop-wiseboy-s-projects.vercel.app`.

Workflow recommandé :

1. Travailler sur `develop` (ou une branche de feature mergée dans `develop`), pousser sur GitHub.
2. Tester les changements sur l'URL dev ci-dessus (connexion au compte Vercel requise — la Deployment Protection redirige vers une auth SSO Vercel).
3. Une fois validé, merger `develop` → `main` pour déployer en prod.

Les variables d'environnement Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, etc., cf. `.env.local.example`) sont **partagées entre Preview et Production** : l'environnement dev tape sur la même base Supabase que la prod (choix assumé — pas de projet Supabase séparé pour l'instant).

Déploiement manuel ponctuel (hors du flux Git, ex. dépannage) :

```bash
npx vercel          # preview
npx vercel --prod   # production
```

## QA avant mise en ligne

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
