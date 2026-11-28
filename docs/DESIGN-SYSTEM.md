# Design system — BRVM Learning

> Déplacé depuis l'ancien README (2026-11). Source de vérité des jetons : `app/globals.css` (+ `app/landing.css` pour la page publique).

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
