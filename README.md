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

Le déploiement n'est **pas automatisé par cet agent** — c'est une action de l'utilisateur, sur son propre compte Vercel. Deux options :

**Option A — CLI Vercel**

```bash
npx vercel
```

Suivre les invites (connexion au compte Vercel, choix du projet). Depuis la racine `app/` : aucune variable d'environnement n'est nécessaire pour la v0.

**Option B — Import GitHub**

1. Pousser ce dossier vers un dépôt GitHub (`git push`).
2. Sur [vercel.com/new](https://vercel.com/new), importer le dépôt.
3. Root Directory : `app/` (si le dépôt contient d'autres dossiers au même niveau, ex. `docs/`).
4. Framework Preset : Next.js (auto-détecté).
5. Aucune variable d'environnement à configurer pour la v0 (pas de backend, pas de clés).
6. Déployer.

## QA avant mise en ligne

Deux vérifications manuelles prévues par le plan v0 (Task 19, étapes 1 et 3) **n'ont pas pu être automatisées** dans cet environnement (pas de navigateur/DevTools disponibles) et restent à faire à la main avant de partager le lien de prod :

1. **Parcours complet en navigateur** — `localStorage` vidé, `npm run dev`, puis `/onboarding` → remise du million → M01 → … → M26 → dashboard. Vérifier à l'œil :
   - déverrouillage progressif des modules (un module ne s'ouvre qu'après le précédent) ;
   - reprise au bon slide quand on quitte un module en cours et qu'on y revient ;
   - cohérence du capital affiché (Portefeuille / Wallet) au fil des modules ;
   - évolution du statut 🥉 → 💎 et déblocage des badges 🎓 (à M19) et 💎 (à M26).

2. **Revue mobile (DevTools responsive)** — largeur téléphone :
   - la barre latérale (sidebar) devient une barre d'onglets (tabbar) en bas/haut ;
   - le portefeuille (Wallet) passe en mode compact ;
   - les slides des modules défilent correctement au tactile.

Ce que cet agent a vérifié mécaniquement à la place (sans navigateur) : `npm run build` réussi avec les 26 routes `/module/*` pré-générées, `npm test` vert, et un smoke-test HTTP (`curl`) des 29 routes (`/`, `/onboarding`, `/coffre`, `/module/m01`…`/module/m26`) confirmant un code 200 et l'absence de marqueurs d'erreur Next.js dans le HTML rendu. Ce smoke-test ne couvre pas l'état client (localStorage, déverrouillage, animations) — d'où les deux points manuels ci-dessus.
