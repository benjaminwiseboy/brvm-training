# BRVM Learning

Formation e-learning interactive sur la BRVM (Bourse Régionale des Valeurs Mobilières) — parcours unique de 26 modules, dashboard de progression, portefeuille pédagogique. Next.js 16 (App Router, Turbopack), zéro dépendance backend, progression persistée dans `localStorage`.

## Lancer en local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000). **Visiteur non connecté : la landing publique.** Une fois connecté, `/` affiche le tableau de bord — et redirige vers `/onboarding` au premier passage (aucune progression en `localStorage`).

## Landing publique

`/` sert deux publics depuis [app/page.tsx](app/page.tsx) : `<Landing />` pour un visiteur, `<HomeDashboard />` pour un apprenant connecté. `proxy.ts` laisse donc passer `/` sans session. Garder la même URL évite de toucher aux liens « Accueil » de la sidebar, au bouton « Quitter le module » et aux `redirect("/")` des actions serveur.

- Composants : [components/landing/](components/landing/) — indépendants du reste de l'app, aucun import croisé.
- Styles : [app/landing.css](app/landing.css), **entièrement scopé sous `.lp`**. Next.js ne décharge pas les feuilles globales lors d'une navigation client : sans ce préfixe, les règles de la landing suivraient l'utilisateur jusque dans le parcours. Les jetons restent posés sur `.lp` et non sur `:root` — la plupart valent désormais la même chose des deux côtés, mais `.lp` en garde qui lui sont propres (`--ink-2`, `--gutter`, `--section-y`, `--max`).
- Polices : héritées de `<html>` — tout le produit tourne sur la même typographie (voir « Charte graphique » ci-dessous). `Landing.tsx` ne charge plus rien. Les crénages négatifs de `landing.css` ont été divisés par deux au passage à Poppins, plus large que la Space Grotesk d'origine.
- Destinations des CTA : [components/landing/links.ts](components/landing/links.ts) (`START_HREF` → `/signup`, `LOGIN_HREF` → `/login`).
- Captures d'écran et témoignages sont des **placeholders** : voir `components/landing/Mockup.tsx` et le tableau `TESTIMONIALS` de `components/landing/Temoignages.tsx`.

## Charte graphique

Landing et application partagent **une seule** identité. Les valeurs vivent dans
[app/globals.css](app/globals.css) et sont recopiées à l'identique en tête de
`landing.css` : si vous en changez une, changez-la aux deux endroits.

| | |
|---|---|
| Marine | `--navy-700` **#023362**, décliné de `--navy-950` à `--navy-050` |
| Or | `--gold-500` **#e89e11**, décliné de `--gold-700` à `--gold-050` |
| Fond | `--paper` #f3f6fb (neutre froid), cartes en blanc |
| Titres | **Poppins** (`--f-display`) |
| Texte | **Nunito** (`--f-body`) |
| Étiquettes, codes de module, données | **JetBrains Mono** (`--f-mono`) |

Les trois polices sont déclarées une seule fois dans [lib/fonts.ts](lib/fonts.ts)
et posées sur `<html>` par [app/layout.tsx](app/layout.tsx) — `next/font` ne
dédoublonne pas entre deux points d'appel, un module partagé est le seul moyen
de ne pas les télécharger deux fois. Poppins n'existe qu'en statique : ses
poids (400→800) sont listés à la main, alors que Nunito et JetBrains Mono sont
chargées en variable.

**Alias historiques.** Les CSS Modules de l'app utilisent `--blue-2`, `--or`,
`--paper`… : ces noms sont conservés dans `globals.css` et repointés sur les
échelles ci-dessus. C'est ce qui a fait basculer les ~9 000 lignes de styles de
l'app sans les réécrire. Ne les supprimez pas ; pour du code neuf, préférez
`--navy-*` / `--gold-*`.

**Contraste.** Trois jetons existent uniquement pour le texte sur fond teinté,
là où la couleur vive ne tient pas le seuil AA de 4,5:1 : `--or-deep`
(= `--gold-700`) sur blanc, `--pos-ink` sur `--pos-soft`, `--clay-ink` sur
`--clay-soft`. Utilisez-les dès qu'une couleur sémantique devient de l'encre.

**Primitives partagées.** `globals.css` définit `.eyebrow`, `.btn` (+ `--gold`,
`--navy`, `--outline`, `--ghost`, `--lg`, `--block`), `.pill`, `.card` et
`.brandmark` avec les mêmes noms que la landing : le même balisage donne le
même rendu des deux côtés. Sur la landing, `.lp .btn` (spécificité 0,2,0)
l'emporte, la page publique reste donc maîtresse de son rendu.

**Composants d'identité.** Le monogramme est
[components/ui/BrandMark.tsx](components/ui/BrandMark.tsx) (une seule
définition, `size` en pixels) et les icônes
[components/ui/Icons.tsx](components/ui/Icons.tsx) — trait 1,75, grille 24,
`currentColor`. La navigation tournait sur des emoji : à remplacer par une
icône du jeu partagé à chaque fois que vous en croisez un décoratif. Les emoji
qui portent du SENS (🥉→💎 des statuts, 🔥 de la série, illustrations des
leçons) restent des emoji.

**Formes et mouvement.** `--radius-sm/-/-lg/-xl/-pill` (12/18/26/34/999) ;
toute commande d'action est une pilule. `--ease` et `--ease-out` sont les
courbes de la marque ; l'entrée de page passe par `.u-rise` / `@keyframes
app-rise`. Les icônes PWA se régénèrent avec le monogramme — cf.
`public/icons/` et `app/apple-icon.png`.

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

## Notifications push de relance

Relance les utilisateurs inactifs (paliers J+3/J+7/J+14, cf. `app/api/cron/reengagement`) via Web Push — uniquement pour les comptes ayant installé l'app en PWA et accepté les notifications (`components/pwa/NotificationPrompt.tsx`).

Variables à définir sur Vercel (Preview **et** Production, cf. `.env.local.example`) :

- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` — générées via `npx web-push generate-vapid-keys`. Ne jamais régénérer en prod sans réabonner tous les utilisateurs (les abonnements existants deviendraient invalides).
- `VAPID_SUBJECT` — email de contact (`mailto:...`), exigé par la spec Web Push.
- `CRON_SECRET` — vérifié par la route contre l'en-tête `Authorization` envoyé automatiquement par Vercel Cron (`vercel.json`, tous les jours à 9h).

Le palier redevient dû après un retour d'activité (`reengagement_notifications.last_activity_at`, migration `20260808133000_reengagement_reset_per_episode.sql`) — pas de blocage à vie. Les abonnements expirés/révoqués (erreur 404/410 du navigateur) sont automatiquement nettoyés de `push_subscriptions`.

### Rappel de série ("streak")

Distinct de la relance ci-dessus : `app/api/cron/streak-reminder`, tous les jours à 19h, notifie qui était actif hier mais ne l'a pas encore été aujourd'hui (« 🔥 Série de N jours — ne la casse pas »). `N` est calculé à la volée (`private.compute_streak_days`) à partir des jours calendaires actifs journalisés dans `daily_activity` à chaque sauvegarde de progression (`merge_user_progress`, migration `20260808140000_streak_reminders.sql`) — distinct du compteur `state.streak` existant (nombre de modules complétés, pas de jours).

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
