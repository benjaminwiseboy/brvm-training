# Revue M01-M08 + expansion (Trade & Plan d'investissement) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Appliquer les remarques de relecture du user sur M01-M08 (BRVM Learning, `brvm-training/app/`), en distinguant les correctifs de contenu (un seul module) des correctifs de moteur (composants partagés `components/engine/*`, qui bénéficient à toute la formation), puis insérer 2 nouveaux modules (Stratégie de trade, Plan d'investissement) en renumérotant proprement M08-M26 → M10-M28.

**Architecture:** Moteur générique (`components/engine/`) + contenu typé par module (`content/modules/mXX.ts`), voir `lib/types.ts`/`content/registry.ts`. Ce plan ajoute des champs **optionnels** aux types existants (jamais de breaking change sur les 20 modules M09-M28 non touchés par la revue de contenu) et un nouveau composant `PhaseComplete`.

**Tech Stack:** Next.js 16 (App Router) / React 19 / TypeScript, CSS Modules, vitest.

## Global Constraints

- **Ne jamais casser `npm run build` ni `npm run test`** (vitest, dont `content/validate.test.ts` qui valide TOUS les modules du registry) — vérifier après chaque tâche.
- **`node_modules/next/dist/docs/`** fait foi sur les API Next.js (cf. `AGENTS.md`) — ce plan ne touche que des Client/Server Components déjà établis (aucune nouvelle route), donc aucune lecture supplémentaire requise sauf si un exécutant dévie du patron existant.
- **Champs de type ajoutés = optionnels** (`?:`) partout où des modules non révisés (M11-M28 après renumérotation) ne les fournissent pas.
- **`renderMarkup()`** est le seul moyen d'afficher du texte contenant `**gras**` — jamais de `dangerouslySetInnerHTML`.
- **Chiffres réels non vérifiés** (ex. taux de remplacement des retraites en France) : toujours formulés avec une réserve explicite (« de l'ordre de », « selon ») — jamais présentés comme une statistique officielle précise sans source.
- **Commit après chaque tâche** avec un message conventionnel (`content:`, `feat(engine):`, `fix(engine):`, `refactor(content):`), à l'intérieur du dépôt git `app/`.

---

## Partie 0 — Renumérotation (préalable à tout le reste)

### Contexte

Le user veut 2 nouveaux modules : **Stratégie de trade** (juste après M07, en 3ᵉ stratégie) et **Plan d'investissement** (synthèse profil+objectif+horizon+stratégie+capacité d'épargne, après le trade). Décision actée : **renumérotation propre**. Les 19 fichiers `m08.ts`…`m26.ts` décalent de **+2** :

| Ancien | Nouveau | Ancien | Nouveau | Ancien | Nouveau |
|---|---|---|---|---|---|
| M08 (DCA) | **M10** | M14 | M16 | M20 | M22 |
| M09 | M11 | M15 | M17 | M21 | M23 |
| M10 | M12 | M16 | M18 | M22 | M24 |
| M11 | M13 | M17 | M19 | M23 | M25 |
| M12 | M14 | M18 | M20 | M24 | M26 |
| M13 | M15 | M19 | M21 | M25 | M27 |
| | | | | M26 | M28 |

Nouveaux : **M08 = Stratégie de trade**, **M09 = Plan d'investissement** (placeholder, cf. Tâche 12). `totalModules` passe de `26` à `28` partout (type + 26 fichiers de contenu).

**Hors périmètre** : `BRVM Learning/*.txt` et `POC-Module-1/` (hors du dépôt git `app/`, sources de référence historiques — pas renumérotés).

### Tâche 1 : Script de renumérotation des fichiers M08-M26 → M10-M28

**Files:**
- Create (temporaire, supprimé après usage) : `app/scripts/renumber.mjs`
- Modify (via le script) : `app/content/modules/m08.ts` … `m26.ts` (renommés), tout `app/content/modules/*.ts` (remplacement de tokens)

**Interfaces:**
- Produces : 19 fichiers renommés `m10.ts`…`m28.ts`, tous les tokens `MXX`/`Module XX` internes à `content/modules/` mis à jour de façon cohérente.

- [ ] **Étape 1 : écrire le script**

```js
// app/scripts/renumber.mjs — usage : node scripts/renumber.mjs
import { readdirSync, readFileSync, writeFileSync, renameSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "content", "modules");
const pad = (n) => String(n).padStart(2, "0");

// Ordre DESCENDANT obligatoire (26→28 en premier, 08→10 en dernier) : un
// remplacement ascendant créerait des tokens "M10" (issus de M08→M10) qui
// seraient ensuite re-capturés par le remplacement M10→M12, décalant deux
// fois la même référence. En descendant, chaque token de sortie (ex. "M28")
// n'est plus jamais la cible d'une étape suivante.
const shifts = [];
for (let old = 26; old >= 8; old--) shifts.push([old, old + 2]);

function applyTextShift(text) {
  let out = text;
  for (const [oldN, newN] of shifts) {
    const oldTag = `M${pad(oldN)}`;
    const newTag = `M${pad(newN)}`;
    out = out.replace(new RegExp(`\\b${oldTag}\\b`, "g"), newTag);
    out = out.replace(new RegExp(`\\bModule ${pad(oldN)}\\b`, "g"), `Module ${pad(newN)}`);
  }
  out = out.replace(/totalModules: 26,/g, "totalModules: 28,");
  return out;
}

// 1) Met à jour le CONTENU de tous les fichiers existants (y compris ceux
//    qui ne seront pas renommés, ex. m01.ts..m07.ts, qui contiennent des
//    renvois textuels vers M08+ : "on la verra au M08").
for (const file of readdirSync(DIR)) {
  if (!file.endsWith(".ts")) continue;
  const p = join(DIR, file);
  const before = readFileSync(p, "utf8");
  const after = applyTextShift(before);
  if (after !== before) writeFileSync(p, after, "utf8");
}

// 2) Renomme les fichiers m08.ts..m26.ts → m10.ts..m28.ts (ordre descendant
//    aussi, par prudence, même si les noms de fichiers ne se chevauchent pas).
for (let old = 26; old >= 8; old--) {
  const oldPath = join(DIR, `m${pad(old)}.ts`);
  const newPath = join(DIR, `m${pad(old + 2)}.ts`);
  renameSync(oldPath, newPath);
}

console.log("Renumérotation terminée.");
```

- [ ] **Étape 2 : exécuter et vérifier**

```bash
cd app
node scripts/renumber.mjs
git status --short   # doit lister 19 renames + modifications dans m01..m07 et les fichiers renommés
```

- [ ] **Étape 3 : corriger les champs non couverts par le remplacement textuel**

Le remplacement `MXX`/`Module XX` couvre `code:`, `eyebrow:`, `next.target:` et toutes les mentions en prose. Il NE couvre PAS :
- le champ `index: N,` (entier nu, pas préfixé `M`) — corriger dans chacun des 19 fichiers renommés pour qu'il corresponde au nouveau numéro (ex. `m10.ts` → `index: 10,`, `m28.ts` → `index: 28,`). Utiliser `grep -n "index:" content/modules/m{10..28}.ts`.
- **l'identifiant `export const mXX`** (minuscule, sur la ligne `export const mXX: Module = {`) — après renommage, `m10.ts` exporte toujours `m08`, `m28.ts` exporte toujours `m26`, etc. (trouvé en exécution : `git status` montrait bien 19 fichiers renommés/modifiés, mais leur export ne correspondait plus ni au nom de fichier ni à leur propre `code:`). Ce décalage casse silencieusement Tâche 2 (`import { m10 } from "./modules/m10"` échoue en compilation si `m10.ts` exporte `m08`). Corriger dans chacun des 19 fichiers : `export const m08: Module = {` → `export const m10: Module = {`, etc. (même correspondance que le renommage de fichier). Vérifier avec `grep -n "export const m" content/modules/m{10..28}.ts` que chaque export correspond bien à son nom de fichier.

- [ ] **Étape 4 : supprimer le script temporaire**

```bash
git rm scripts/renumber.mjs  # ou rm si jamais commit
```

- [ ] **Étape 5 : vérifier qu'aucun faux positif n'a été introduit**

Vérifier spécifiquement (ces occurrences NE DOIVENT PAS avoir changé, ce sont des nombres sans rapport avec la numérotation des modules) :
- `content/modules/m14.ts` (nouveau nom de l'ancien m12.ts) ligne ~72/100 : « 26 mai 2026 » doit rester intact (pas de `totalModules: 26,` isolé transformé par erreur — le remplacement cible la chaîne exacte `totalModules: 26,` avec la virgule, donc « 26 mai 2026 » n'est pas touché ; vérifier quand même à l'œil).
- `content/modules/m21.ts` (nouveau nom de l'ancien m19.ts) : « 12 → 26 (hausse régulière) » doit rester intact.

```bash
grep -n "26 mai 2026\|12 → 26" content/modules/m14.ts content/modules/m21.ts
```

- [ ] **Étape 6 : commit**

```bash
git add content/modules/
git commit -m "content: renumber M08-M26 to M10-M28 to make room for the trade and investment-plan modules"
```

### Tâche 2 : Mettre à jour `registry.ts` et `lib/types.ts` (totalModules, imports, PHASES)

**Files:**
- Modify: `app/lib/types.ts:49`
- Modify: `app/content/registry.ts` (réécriture complète)
- Modify: `app/content/validate.ts:36`
- Modify: `app/content/validate.test.ts:7`
- Modify: `app/lib/store.test.ts:26-27,78`
- Modify: `app/components/dashboard/Dashboard.tsx:9-10`

**Interfaces:**
- Consumes : fichiers renommés `m10.ts`…`m28.ts` (Tâche 1), futurs `m08.ts`(trade)/`m09.ts`(plan) (Tâches 11-12).
- Produces : `MODULES`, `PHASES` (avec nouveau champ `recap: string[]` et `futureNote?: string` consommés en Partie 1, Tâche 8), `orderedCodes()`, `getModule()`, `getNext()`, nouveau `phaseCompletionFor(code)`.

- [ ] **Étape 1 : `lib/types.ts:49`** — `totalModules: 26;` → `totalModules: 28;`

- [ ] **Étape 2 : réécrire `content/registry.ts`**

```ts
import type { Module } from "@/lib/types";
import { m01 } from "./modules/m01";
import { m02 } from "./modules/m02";
import { m03 } from "./modules/m03";
import { m04 } from "./modules/m04";
import { m05 } from "./modules/m05";
import { m06 } from "./modules/m06";
import { m07 } from "./modules/m07";
import { m08 } from "./modules/m08";
import { m09 } from "./modules/m09";
import { m10 } from "./modules/m10";
import { m11 } from "./modules/m11";
import { m12 } from "./modules/m12";
import { m13 } from "./modules/m13";
import { m14 } from "./modules/m14";
import { m15 } from "./modules/m15";
import { m16 } from "./modules/m16";
import { m17 } from "./modules/m17";
import { m18 } from "./modules/m18";
import { m19 } from "./modules/m19";
import { m20 } from "./modules/m20";
import { m21 } from "./modules/m21";
import { m22 } from "./modules/m22";
import { m23 } from "./modules/m23";
import { m24 } from "./modules/m24";
import { m25 } from "./modules/m25";
import { m26 } from "./modules/m26";
import { m27 } from "./modules/m27";
import { m28 } from "./modules/m28";

export const MODULES: Record<string, Module> = {
  M01: m01, M02: m02, M03: m03, M04: m04, M05: m05, M06: m06, M07: m07, M08: m08, M09: m09,
  M10: m10, M11: m11, M12: m12, M13: m13, M14: m14, M15: m15, M16: m16, M17: m17, M18: m18, M19: m19,
  M20: m20, M21: m21, M22: m22, M23: m23, M24: m24, M25: m25, M26: m26, M27: m27, M28: m28,
};

export type PhaseDef = {
  name: string;
  badge: string;
  codes: string[];
  /** Récap bullet-points affiché sur l'écran PhaseComplete (Partie 1, Tâche 8) — un item par notion clé de la phase. */
  recap: string[];
  /** Fonctionnalité annoncée mais pas encore construite (ex. export PDF) — affichée en bouton désactivé sur PhaseComplete. */
  futureNote?: string;
};

export const PHASES: PhaseDef[] = [
  {
    name: "Phase 1 · Les Fondations",
    badge: "🥉",
    codes: ["M01", "M02", "M03", "M04"],
    recap: [
      "Ce qu'est la bourse et pourquoi la BRVM est unique au monde (8 pays, 1 seul compte).",
      "Comment on gagne de l'argent : le dividende (cash régulier) et la plus-value (capital qui grossit).",
      "Les 3 règles d'or de sécurité à respecter avant d'investir le moindre franc.",
      "Les 3 produits de la BRVM — action, obligation, OPCVM — et pour quel profil chacun est fait.",
    ],
  },
  {
    name: "Phase 2 · La Boussole",
    badge: "🥈",
    codes: ["M05", "M06", "M07", "M08", "M09", "M10"],
    recap: [
      "Votre profil d'investisseur (prudent, équilibré, croissance ou audacieux).",
      "Vos 3 stratégies possibles — rente, croissance, trade — et pour qui chacune est faite.",
      "Le plan d'investissement qui réunit objectif, horizon, stratégie et capacité d'épargne.",
      "La régularité (DCA) et les intérêts composés — le vrai moteur de l'enrichissement.",
    ],
    futureNote: "📄 Téléchargement de votre plan en PDF — bientôt disponible",
  },
  { name: "Phase 3 · L'Analyse", badge: "🥇", codes: ["M11","M12","M13","M14","M15","M16","M17","M18","M19","M20","M21"], recap: [] },
  { name: "Phase 4 · Passage à l'action", badge: "🥇", codes: ["M22","M23","M24"], recap: [] },
  { name: "Phase 5 · Suivi & maîtrise", badge: "💎", codes: ["M25","M26","M27","M28"], recap: [] },
];

export function orderedCodes(): string[] { return PHASES.flatMap((p) => p.codes); }
export function getModule(code: string): Module | undefined { return MODULES[code.toUpperCase()]; }
export function getNext(code: string): Module | undefined {
  const order = orderedCodes();
  const i = order.indexOf(code.toUpperCase());
  return i >= 0 && i < order.length - 1 ? MODULES[order[i + 1]] : undefined;
}
/** La phase se termine à `code` ? Renvoie sa définition (pour l'écran PhaseComplete), sinon `undefined`. */
export function phaseCompletionFor(code: string): PhaseDef | undefined {
  const upper = code.toUpperCase();
  return PHASES.find((p) => p.codes[p.codes.length - 1] === upper);
}
```

Note : `recap: []` pour les Phases 3-5 (hors du périmètre de cette revue — `phaseCompletionFor` reste utilisable plus tard sans re-toucher `ModulePlayer`/`PhaseComplete`, il suffira de remplir ces tableaux).

- [ ] **Étape 3 : `content/validate.ts:36`** — `if (m.index < 1 || m.index > 26)` → `if (m.index < 1 || m.index > 28)`

- [ ] **Étape 4 : `content/validate.test.ts:7`** — `code: "M01", index: 1, totalModules: 26,` → `totalModules: 28,`

- [ ] **Étape 5 : `lib/store.test.ts:26-27,78`** — les tests `progressPct(7, 26)`/`progressPct(0, 26)` restent valides tels quels (ils testent la fonction pure avec un `total` arbitraire, pas le total réel du parcours) — **ne pas modifier**. Seule la ligne 78 `deriveStatus(26)` teste le clamp avec l'ancien total : remplacer par `deriveStatus(28)` pour rester représentatif du nombre réel de modules (`expect(deriveStatus(28).emoji).toBe("💎");`).

- [ ] **Étape 6 : `components/dashboard/Dashboard.tsx:9-10`** — `const TOTAL_MODULES = 26;` → `const TOTAL_MODULES = 28;`

- [ ] **Étape 7 : vérifier**

```bash
npm run test
npm run build
```

Le build échouera tant que `content/modules/m08.ts` et `m09.ts` n'existent pas (créés Tâches 11-12) — **attendu à ce stade**, continuer le plan puis revérifier à la fin de la Partie 3.

- [ ] **Étape 8 : commit**

```bash
git add lib/types.ts content/registry.ts content/validate.ts content/validate.test.ts lib/store.test.ts components/dashboard/Dashboard.tsx
git commit -m "feat(content): registry for 28 modules, PHASES.recap/futureNote, phaseCompletionFor()"
```

---

## Partie 1 — Moteur (composants partagés `components/engine/*`)

Ces correctifs sont nés d'une remarque sur UN module mais s'appliquent au composant partagé — donc à tous les modules qui l'utilisent.

### Tâche 3 : navigation — retour à l'intro (M06 : « impossible de revenir au menu introduction »)

**Cause räcine :** `SlideDeck.go(-1)` à `i === 0` ne fait rien (`if (n < 0) return;`) et le bouton Précédent est `disabled={i === 0}` — aucun chemin ne ramène à l'écran `Hero`.

**Files:**
- Modify: `app/components/engine/SlideDeck.tsx:28-63,113-120`
- Modify: `app/components/engine/ModulePlayer.tsx:129-139`

- [ ] **Étape 1 : `SlideDeck.tsx`** — ajouter un prop optionnel et l'utiliser dans `go()`/le bouton :

```tsx
export function SlideDeck({
  slides,
  onSlide,
  onDone,
  initialIndex = 0,
  onExitToIntro,
}: {
  slides: Slide[];
  onSlide?: (i: number) => void;
  onDone: () => void;
  initialIndex?: number;
  /** Fix nav (M06) : rendu au clic sur "Précédent" quand i===0, pour revenir à l'écran Hero du module au lieu de rester bloqué. Optionnel pour ne pas casser un futur appelant qui ne le fournirait pas. */
  onExitToIntro?: () => void;
}) {
  ...
  const go = useCallback(
    (dir: number) => {
      const n = i + dir;
      if (n < 0) { onExitToIntro?.(); return; }
      if (n >= slides.length) { onDone(); return; }
      setSeen((prev) => { if (prev[n]) return prev; const next = [...prev]; next[n] = true; return next; });
      setI(n);
    },
    [i, slides.length, onDone, onExitToIntro],
  );
```

Et le bouton (ligne ~117) :

```tsx
<button
  type="button"
  className={`${styles.btn} ${styles.btnGhost}`}
  onClick={() => go(-1)}
  disabled={i === 0 && !onExitToIntro}
>
```

- [ ] **Étape 2 : `ModulePlayer.tsx`** — passer le callback (bloc `phase === "cours"`, ligne ~129) :

```tsx
{phase === "cours" && (
  <SlideDeck
    slides={module.slides}
    initialIndex={initialSlide}
    onSlide={(i) => setResumeSlide(module.code, i)}
    onExitToIntro={() => setPhase("intro")}
    onDone={() => {
      setResumeSlide(module.code, module.slides.length - 1, "defi");
      setPhase("defi");
    }}
  />
)}
```

- [ ] **Étape 3 : vérifier** — `npm run dev`, ouvrir `/module/m06`, avancer d'une slide puis cliquer Précédent jusqu'à revenir à l'écran d'accueil ; re-cliquer le CTA relance bien le cours.

- [ ] **Étape 4 : commit** — `fix(engine): SlideDeck can navigate back to the module intro screen from slide 1`

### Tâche 4 : Hero — section « objectifs du module » (partout) + refonte de l'intro M01

**Files:**
- Modify: `app/lib/types.ts:55-60`
- Modify: `app/components/engine/Hero.tsx`
- Modify: `app/components/engine/Hero.module.css`
- Modify: `app/content/modules/m01.ts` (hero), `m02.ts`…`m08.ts`(nouveau, cf. Tâche 11)/`m10.ts` (hero — ajout `objectives`)

- [ ] **Étape 1 : `lib/types.ts`** — ajouter `objectives?: string[]` sur `Module["hero"]` :

```ts
hero: {
  eyebrow: string; headline: string; lead: string;
  rules?: string[];
  card?: { label: string; title: string; hint: string; rules: string[] };
  /** M02 (revue) : "ce que vous saurez faire à la fin du module", affiché sur l'écran d'accueil, sur TOUS les modules. */
  objectives?: string[];
  cta: string;
};
```

- [ ] **Étape 2 : `Hero.tsx`** — nouveau sous-composant + insertion avant le CTA :

```tsx
function ObjectivesList({ items }: { items: string[] }) {
  return (
    <div className={styles.objectives}>
      <p className={styles.objectivesLabel}>🎯 À la fin de ce module, vous saurez :</p>
      <ul className={styles.objectivesList}>
        {items.map((o, i) => (
          <li key={i}>{renderMarkup(o)}</li>
        ))}
      </ul>
    </div>
  );
}
```

Dans `Hero()`, juste avant le `<button className={styles.cta}...>` :

```tsx
{h.objectives && h.objectives.length > 0 && <ObjectivesList items={h.objectives} />}

<button type="button" className={styles.cta} onClick={onStart}>
```

- [ ] **Étape 3 : `Hero.module.css`** — ajouter :

```css
.objectives {
  margin: 22px 0 0;
}
.objectivesLabel {
  font-family: var(--f-display);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--ink-soft);
  margin: 0 0 10px;
}
.objectivesList {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}
.objectivesList li {
  position: relative;
  padding-left: 26px;
  color: var(--ink);
  font-weight: 600;
  font-size: 0.98rem;
}
.objectivesList li::before {
  content: "✓";
  position: absolute;
  left: 0;
  top: -1px;
  color: var(--pos);
  font-weight: 800;
}
```

- [ ] **Étape 4 : `content/modules/m01.ts`** — remplacer le bloc `hero` (M01 : plus de `rules` — l'onboarding couvre déjà les règles du jeu — remplacé par un message de bienvenue à toute la formation + les objectifs du module) :

```ts
hero: {
  eyebrow: "Formation BRVM · Module 01",
  headline: "Oubliez Wall&nbsp;Street.",
  lead:
    "Bienvenue dans **BRVM Learning** ! Vous allez apprendre à investir à la Bourse Régionale des Valeurs Mobilières, module après module, sans jargon inutile. On commence par une idée simple : écrans rouges, traders qui hurlent au téléphone… oubliez ces images. La bourse, surtout la BRVM, est bien plus **calme, sûre et accessible** que vous ne le croyez.",
  objectives: [
    "Comprendre ce qu'est réellement la bourse, et à quoi elle sert.",
    "Découvrir ce qui rend la BRVM unique au monde (8 pays, 1 seul compte).",
    "Démonter 4 idées reçues qui empêchent beaucoup de gens d'investir.",
  ],
  cta: "Recevoir mon million et commencer",
},
```

(Le bloc `slides[0]` garde son propre texte inchangé — seul `hero` change ; ce slide répète volontairement l'accroche, comme avant.)

- [ ] **Étape 5 : ajouter `objectives` à `m02.ts` … `m07.ts` et `m10.ts`** (hero, à la suite de `card`, avant `cta`) :

`m02.ts` :
```ts
objectives: [
  "Les 3 règles d'or à respecter avant d'investir le moindre franc.",
  "Combien mettre de côté (fonds d'urgence) avant de penser bourse.",
  "Reconnaître une situation « feu vert » d'une situation « feu rouge ».",
],
```

`m03.ts` :
```ts
objectives: [
  "Distinguer le dividende (cash régulier) de la plus-value (capital qui grossit).",
  "Repérer la date de détachement du dividende dans le BOC.",
  "Calculer un rendement de dividende à partir d'un cas concret.",
],
```

`m04.ts` :
```ts
objectives: [
  "Différencier action, obligation et OPCVM sur le couple risque/gain.",
  "Associer le bon produit à un objectif et un horizon donnés.",
],
```

`m06.ts` :
```ts
objectives: [
  "Comprendre la logique de la rente : des revenus réguliers, sans vendre le capital.",
  "Identifier les 4 critères d'une bonne valeur de rente.",
  "Voir comment la rente peut compléter un salaire ou une retraite.",
],
```

`m07.ts` :
```ts
objectives: [
  "Comprendre la logique de la croissance : faire grossir un capital pour un projet.",
  "Connaître les 5 moteurs qui font monter un cours de bourse.",
  "Savoir sur quel horizon viser une stratégie de croissance.",
],
```

`m10.ts` (ex-M08, DCA) :
```ts
objectives: [
  "Comprendre le DCA (investir un montant fixe, à intervalle régulier).",
  "Comprendre les intérêts composés et pourquoi le temps est le vrai moteur.",
  "Simuler l'écart entre l'argent investi et la richesse totale.",
],
```

- [ ] **Étape 6 : vérifier** — `npm run dev`, ouvrir `/module/m01` (nouveau texte de bienvenue, pas de règles ①②③), `/module/m02`…`/module/m07`, `/module/m10` (section objectifs visible sur l'écran d'accueil).

- [ ] **Étape 7 : commit** — `feat(engine): learning objectives on every module's intro screen; M01 welcomes the whole training instead of repeating onboarding rules`

### Tâche 5 : QuizChallenge — champ `scenario` distinct de l'instruction (M03)

**Files:**
- Modify: `app/lib/types.ts:11-17`
- Modify: `app/components/engine/QuizChallenge.tsx`
- Modify: `app/components/engine/QuizChallenge.module.css`
- Modify: `app/content/modules/m03.ts` (challenge)

- [ ] **Étape 1 : `lib/types.ts`** — ajouter `scenario?: string;` à `QuizChallenge` :

```ts
export type QuizChallenge = {
  type: "quiz";
  kicker: string; title: string; instruction: string;
  /** Mise en scène d'un cas concret (M03 : « le scénario de Koffi »), affichée à part de `instruction` dans un encart dédié — pas mélangée au texte d'instruction générique. */
  scenario?: string;
  penaltyPerError: number; perfectReward: number;
  options: { value: string; label: string }[];
  questions: { prompt: string; answer: string; options?: { value: string; label: string }[] }[];
};
```

- [ ] **Étape 2 : `QuizChallenge.tsx`** — rendre l'encart juste après `.sectionHead` (avant le stepper `!validated && <div className={styles.head}>`) :

```tsx
<div className={styles.sectionHead}>
  <div className={styles.kicker}>{challenge.kicker}</div>
  <h2 className={styles.title}>{renderMarkup(challenge.title)}</h2>
  <p className={styles.instruction}>{renderMarkup(challenge.instruction)}</p>
</div>

{challenge.scenario && (
  <div className={styles.scenario}>
    <p className={styles.scenarioLabel}>📖 Scénario</p>
    <p className={styles.scenarioText}>{renderMarkup(challenge.scenario)}</p>
  </div>
)}
```

- [ ] **Étape 3 : `QuizChallenge.module.css`** — ajouter (et `white-space: pre-line;` sur `.qPrompt` existant, requis par la Tâche 6) :

```css
.scenario {
  background: var(--blue-soft);
  border: 1px solid #bcd4e6;
  border-radius: var(--radius-lg);
  padding: 18px 20px;
  margin: 0 0 22px;
}
.scenarioLabel {
  font-family: var(--f-display);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--blue);
  margin: 0 0 8px;
}
.scenarioText {
  color: #0e3a56;
  margin: 0;
  font-weight: 600;
  line-height: 1.45;
}
```

Modifier `.qPrompt` existant :
```css
.qPrompt {
  font-size: 1.12rem;
  font-weight: 700;
  color: var(--ink);
  margin: 8px 0 18px;
  line-height: 1.4;
  white-space: pre-line;
}
```

- [ ] **Étape 4 : `content/modules/m03.ts`** — extraire le scénario de `instruction` :

Remplacer :
```ts
instruction:
  "Lisez le scénario et répondez. (Bonne réponse = + 10 000 FCFA · erreur = − 5 000 FCFA.) **Le scénario de Koffi :** L'an dernier, Koffi a acheté **100 actions** de la banque SuperBank à **10 000 FCFA** l'action (soit 1 000 000 FCFA investis). Aujourd'hui, l'action vaut **12 000 FCFA**, et SuperBank vient de lui verser un dividende de **1 000 FCFA par action**.",
```
par :
```ts
instruction: "Lisez le scénario ci-dessous, puis répondez aux 3 questions. (Bonne réponse = + 10 000 FCFA · erreur = − 5 000 FCFA.)",
scenario:
  "**Le scénario de Koffi :** L'an dernier, Koffi a acheté **100 actions** de la banque SuperBank à **10 000 FCFA** l'action (soit 1 000 000 FCFA investis). Aujourd'hui, l'action vaut **12 000 FCFA**, et SuperBank vient de lui verser un dividende de **1 000 FCFA par action**.",
```

- [ ] **Étape 5 : vérifier** — `/module/m03`, écran Défi : le scénario est dans un encart bleu, visuellement distinct de l'instruction.

- [ ] **Étape 6 : commit** — `feat(engine): QuizChallenge scenario box, visually distinct from the instruction line`

### Tâche 6 : Bilan — afficher la réponse erronée choisie à côté de la bonne réponse (M03, tous les quiz)

**Files:**
- Modify: `app/components/engine/ModulePlayer.tsx`
- Modify: `app/components/engine/QuizChallenge.tsx:56-69`
- Modify: `app/components/engine/Bilan.tsx`
- Modify: `app/components/engine/Bilan.module.css`

**Interfaces:**
- Consumes : `QuizChallengeData` (`lib/types.ts`, déjà défini Tâche 5).
- Produces : `Bilan` accepte un nouveau prop optionnel `quiz`.

- [ ] **Étape 1 : `QuizChallenge.tsx`** — inclure les réponses de l'apprenant dans `onResult` :

Changer la signature du prop :
```ts
onResult: (r: { correct: number; total: number; capitalDelta: number; answers: (string | null)[] }) => void;
```
Et dans `handleValidate()` :
```ts
onResult({ correct, total, capitalDelta, answers });
```

- [ ] **Étape 2 : `ModulePlayer.tsx`** — étendre `Result` et transmettre à `Bilan` :

```ts
type Result = { correct: number; total: number; capitalDelta: number; answers?: (string | null)[] };
const EMPTY_RESULT: Result = { correct: 0, total: 0, capitalDelta: 0, answers: [] };
```

Dans le rendu (bloc `phase === "bilan"`), ajouter le prop `quiz` :
```tsx
{phase === "bilan" && (
  <Bilan
    result={result}
    feedback={module.feedback}
    onNext={handleBilanNext}
    walletTotal={state.capital}
    quiz={
      module.challenge.type === "quiz"
        ? { challenge: module.challenge, answers: result.answers ?? [] }
        : undefined
    }
    diagnostic={...}
  />
)}
```
(`onNext={handleBilanNext}` anticipe la Tâche 8 — voir plus bas ; si la Tâche 8 n'est pas encore faite, laisser `onNext={handleNext}` pour l'instant et le corriger à la Tâche 8.)

- [ ] **Étape 3 : `Bilan.tsx`** — importer le type et ajouter le prop :

```tsx
import type { Feedback, QuizChallenge as QuizChallengeData } from "@/lib/types";
...
export function Bilan({
  result, feedback, onNext, walletTotal, diagnostic, quiz,
}: {
  result: { correct: number; total: number; capitalDelta: number };
  feedback: Feedback;
  onNext: () => void;
  walletTotal?: number;
  diagnostic?: { points: number; bands: {...}[] };
  /** Chemin quiz (Task revue M03) : permet d'afficher, à côté de chaque explication, la réponse erronée choisie par l'apprenant — pas seulement la bonne réponse. */
  quiz?: { challenge: QuizChallengeData; answers: (string | null)[] };
}) {
```

Dans la boucle `feedback.explanations.map((e, i) => (...))`, ajouter la résolution + le rendu (à l'intérieur de `.expBody`, après `.expText`, avant `.expNote`) :

```tsx
{feedback.explanations.map((e, i) => {
  const q = quiz?.challenge.questions[i];
  const chosenValue = quiz?.answers[i] ?? null;
  const isWrong = !!q && chosenValue !== null && chosenValue !== q.answer;
  const chosenLabel = isWrong
    ? (q!.options ?? quiz!.challenge.options).find((o) => o.value === chosenValue)?.label
    : undefined;
  return (
    <div className={styles.exp} key={i}>
      <span className={styles.expBadge}>{e.verdict}</span>
      <div className={styles.expBody}>
        <p className={styles.expTitle}>{renderMarkup(e.title)}</p>
        <p className={styles.expText}>{renderMarkup(e.body)}</p>
        {chosenLabel && (
          <p className={styles.expWrong}>
            Votre réponse : <strong>{chosenLabel}</strong>
          </p>
        )}
        {e.note && <div className={styles.expNote}>{renderMarkup(e.note)}</div>}
      </div>
    </div>
  );
})}
```

- [ ] **Étape 4 : `Bilan.module.css`** — ajouter :

```css
.expWrong {
  margin: 6px 0 0;
  font-size: 0.92rem;
  font-weight: 600;
  color: #8a3d1e;
}
```

- [ ] **Étape 5 : vérifier** — jouer `/module/m03` en se trompant volontairement sur une question, valider, vérifier au Bilan que « Votre réponse : … » s'affiche sous l'explication correspondante ; vérifier que M01/M02/M04/M06/M07 (autres quiz) ne cassent pas (le prop `quiz` est optionnel, testable sans se tromper aussi).

- [ ] **Étape 6 : commit** — `feat(engine): Bilan shows the learner's wrong answer next to the correct one in quiz explanations`

### Tâche 7 : DiagnosticChallenge — sections thématiques + Bilan — répartition en liste à puces (M05)

**Files:**
- Modify: `app/lib/types.ts:26-31`
- Modify: `app/components/engine/DiagnosticChallenge.tsx`
- Modify: `app/components/engine/DiagnosticChallenge.module.css`
- Modify: `app/components/engine/Bilan.tsx` (branche `diagnostic`)
- Modify: `app/components/engine/Bilan.module.css`
- Modify: `app/content/modules/m05.ts`
- Modify: `app/content/validate.test.ts:72` (fixture `diagnosticBase` — `bands[]` sans `allocation`/`tip`, cassera le type-check une fois ces champs requis)

**Contexte (réponse au « pourquoi les questions s'enchaînent ») :** `DiagnosticChallenge` a toujours affiché toutes les questions d'un coup (contrairement à `QuizChallenge`, qui en montre une à la fois) — ce n'est pas une régression, c'est le comportement d'origine (Task 15a, jamais aligné sur `QuizChallenge`). Le user valide ce mode « enchaîné » mais veut des parties nommées, à l'image d'un vrai questionnaire de profil investisseur.

**Source :** le user a fourni `BRVM Learning/profil d'investisseur.pdf` (L'École de la Bourse d'Abidjan, « document confidentiel »). Ce questionnaire réel structure ses 9 questions en 3 parties (situation personnelle/financière ; objectifs et tolérance au risque ; connaissances et expérience) et va jusqu'à 5 profils (Prudent/Modéré/Équilibré/Croissance/Audacieux). **Ne pas copier le questionnaire verbatim** (document confidentiel, auteur nommé) : s'en inspirer pour la STRUCTURE et le CONCEPT, comme le fait déjà tout le reste du projet avec les transcripts École de la Bourse (cf. mémoire projet), en réécrivant les questions dans le ton déjà établi de M05. Décision de scope : garder **4 bandes** (pas 5 — « Modéré » entre Prudent et Équilibré alourdirait sans bénéfice pédagogique clair ici) mais ajouter la 3ᵉ partie « connaissances », absente de la version actuelle de M05, en 5ᵉ question — véritable valeur ajoutée du PDF.

- [ ] **Étape 1 : `lib/types.ts`** — étendre `DiagnosticChallenge` :

```ts
export type DiagnosticChallenge = {
  type: "diagnostic";
  kicker: string; title: string; instruction: string;
  /** Regroupe les questions en parties thématiques (M05) — `startIndex` = index (0-based) de la 1ère question de la partie dans `questions`. Optionnel : sans ce champ, comportement inchangé (aucun séparateur). */
  sections?: { title: string; startIndex: number }[];
  questions: { prompt: string; options: { label: string; points: number }[] }[];
  bands: {
    min: number; max: number; emoji: string; label: string;
    body: string;
    /** Répartition cible, une puce par ligne (remplace l'ancienne prose inline). */
    allocation: string[];
    /** Astuce affichée sous la répartition (ex. « la structure ne change pas selon le montant »). */
    tip: string;
  }[];
};
```

- [ ] **Étape 2 : `DiagnosticChallenge.tsx`** — rendre les en-têtes de section (import `Fragment` de React) :

```tsx
import { Fragment, useState } from "react";
...
{challenge.questions.map((q, qi) => {
  const answer = answers[qi];
  const section = challenge.sections?.find((s) => s.startIndex === qi);
  const sectionNo = section ? challenge.sections!.indexOf(section) + 1 : 0;

  return (
    <Fragment key={qi}>
      {section && (
        <div className={styles.sectionDivider}>
          <span className={styles.sectionNo}>
            Partie {sectionNo} / {challenge.sections!.length}
          </span>
          <h3 className={styles.sectionTitle}>{section.title}</h3>
        </div>
      )}
      <div className={[styles.q, validated ? styles.locked : ""].filter(Boolean).join(" ")}>
        <div className={styles.qNo}>Question {qi + 1}</div>
        <p className={styles.qPrompt}>{renderMarkup(q.prompt)}</p>
        <div className={styles.qOpts}>
          {q.options.map((o, oi) => {
            const selected = answer === oi;
            return (
              <button
                key={oi}
                type="button"
                className={[styles.opt, selected ? styles.selected : validated ? styles.muted : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => selectOption(qi, oi)}
                disabled={validated}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
})}
```

(Le reste du composant — `selectOption`, `handleValidate`, le bouton Valider — ne change pas.)

- [ ] **Étape 3 : `DiagnosticChallenge.module.css`** — ajouter :

```css
.sectionDivider {
  margin: 30px 0 14px;
}
.sectionDivider:first-child {
  margin-top: 0;
}
.sectionNo {
  font-family: var(--f-display);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--or-deep);
}
.sectionTitle {
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 1.15rem;
  color: var(--blue-2);
  margin: 4px 0 0;
}
```

- [ ] **Étape 4 : `Bilan.tsx`** — branche `diagnostic`, afficher `allocation` en liste + `tip` :

```tsx
if (diagnostic) {
  const band = diagnostic.bands.find((b) => diagnostic.points >= b.min && diagnostic.points <= b.max);

  return (
    <div className={styles.wrap}>
      <p className={styles.eyebrow}>Votre profil</p>

      {band && (
        <div className={styles.lessonHl}>
          <div className={styles.lessonHlIc}>{band.emoji}</div>
          <h2 className={styles.lessonHlTitle}>{renderMarkup(band.label)}</h2>
          <p className={styles.lessonHlBody}>{renderMarkup(band.body)}</p>
          <ul className={styles.allocList}>
            {band.allocation.map((a, i) => (
              <li key={i}>{renderMarkup(a)}</li>
            ))}
          </ul>
        </div>
      )}

      {band?.tip && <div className={styles.golden}>{renderMarkup(band.tip)}</div>}

      <button type="button" className={`${styles.btn} ${styles.btnGold}`} onClick={onNext}>
        Continuer <span className={styles.arw}>→</span>
      </button>
    </div>
  );
}
```

Mettre à jour le type du prop `diagnostic` en haut du fichier pour inclure `allocation`/`tip` (miroir du type `lib/types.ts`).

- [ ] **Étape 5 : `Bilan.module.css`** — ajouter :

```css
.allocList {
  list-style: none;
  margin: 14px 0 0;
  padding: 14px 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  display: grid;
  gap: 8px;
}
.allocList li {
  position: relative;
  padding-left: 22px;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 600;
  font-size: 0.95rem;
}
.allocList li::before {
  content: "•";
  position: absolute;
  left: 4px;
  color: var(--or);
  font-weight: 800;
}
```

- [ ] **Étape 6 : `content/modules/m05.ts`** — restructurer le challenge en 3 parties / 5 questions (0-40 pts) et `bands` avec `allocation`/`tip` :

```ts
challenge: {
  type: "diagnostic",
  kicker: "Le Défi",
  title: "Le test de profilage",
  instruction:
    "Répondez avec sincérité : chaque réponse rapporte des points (entre parenthèses), additionnés pour un score sur 40 points. Un test inspiré de ceux utilisés par les conseillers financiers.",
  sections: [
    { title: "Votre situation", startIndex: 0 },
    { title: "Vos objectifs et votre tolérance au risque", startIndex: 1 },
    { title: "Vos connaissances", startIndex: 4 },
  ],
  questions: [
    {
      prompt: "Dans combien de temps retirerez-vous une part importante de cet argent ?",
      options: [
        { label: "Moins de 3 ans.", points: 0 },
        { label: "Entre 4 et 10 ans.", points: 4 },
        { label: "Dans plus de 10 ans.", points: 8 },
      ],
    },
    {
      prompt: "Votre objectif principal en investissant ?",
      options: [
        { label: "Préserver mon capital et toucher un revenu, sans risque.", points: 0 },
        { label: "Un rendement correct, avec un risque modéré, pour battre l'inflation.", points: 4 },
        { label: "La croissance maximale à long terme, quitte à subir des secousses.", points: 8 },
      ],
    },
    {
      prompt: "Une crise fait baisser votre portefeuille de 25 % (1 000 000 → 750 000). Que faites-vous ?",
      options: [
        { label: "Je vends tout pour limiter la casse.", points: 0 },
        { label: "Je m'inquiète, mais je conserve en attendant que ça remonte.", points: 4 },
        { label: "J'en profite pour acheter plus : les actions sont en promo !", points: 8 },
      ],
    },
    {
      prompt: "Combien de temps êtes-vous prêt à attendre que vos placements récupèrent ?",
      options: [
        { label: "Moins de 6 mois.", points: 0 },
        { label: "Entre 6 mois et 2 ans.", points: 4 },
        { label: "Plus de 2 ans.", points: 8 },
      ],
    },
    {
      prompt: "Comment décririez-vous vos connaissances de la bourse aujourd'hui ?",
      options: [
        { label: "Débutant(e) : je découvre tout juste.", points: 0 },
        { label: "Je connais les bases (action, obligation, dividende…).", points: 4 },
        { label: "Je comprends bien les différents produits et leurs risques.", points: 8 },
      ],
    },
  ],
  bands: [
    {
      min: 0, max: 10, emoji: "🛡️", label: "PRUDENT",
      body: "La sécurité avant tout.",
      allocation: [
        "🛡️ 80 % obligations / OPCVM obligataires",
        "📈 20 % actions très stables (banques, télécoms)",
      ],
      tip: "**L'astuce :** cette « structure » (le % actions vs obligations) reste la même quel que soit le montant. Que vous investissiez 15 000 ou 500 000 FCFA par mois, les pourcentages ne changent pas.",
    },
    {
      min: 11, max: 20, emoji: "⚖️", label: "ÉQUILIBRÉ",
      body: "Le juste milieu.",
      allocation: [
        "⚖️ 50 % obligations",
        "📈 50 % actions réparties sur plusieurs secteurs (ou OPCVM mixtes)",
      ],
      tip: "**L'astuce :** cette « structure » (le % actions vs obligations) reste la même quel que soit le montant. Que vous investissiez 15 000 ou 500 000 FCFA par mois, les pourcentages ne changent pas.",
    },
    {
      min: 21, max: 30, emoji: "📈", label: "CROISSANCE",
      body: "Vous avez le temps (5 ans +) et visez la performance.",
      allocation: [
        "🛡️ 30 % obligations",
        "📈 70 % actions",
      ],
      tip: "**L'astuce :** cette « structure » (le % actions vs obligations) reste la même quel que soit le montant. Que vous investissiez 15 000 ou 500 000 FCFA par mois, les pourcentages ne changent pas.",
    },
    {
      min: 31, max: 40, emoji: "🚀", label: "AUDACIEUX",
      body: "Très long terme, les krachs sont des opportunités.",
      allocation: [
        "🛡️ 10-20 % de sécurité",
        "📈 80-100 % actions",
      ],
      tip: "**L'astuce :** cette « structure » (le % actions vs obligations) reste la même quel que soit le montant. Que vous investissiez 15 000 ou 500 000 FCFA par mois, les pourcentages ne changent pas.",
    },
  ],
},
```

(Score max passe de 32 à 40 — 5 questions × 8 pts. Bandes redécoupées en quarts de 0-40. Section 3 « Vos connaissances » ne contient qu'1 question (index 4) — `sections` n'exige pas un nombre égal de questions par partie.)

- [ ] **Étape 7 : `content/validate.test.ts:72`** — la fixture `diagnosticBase` type-check contre le `DiagnosticChallenge` mis à jour ; ajouter les 2 nouveaux champs requis :

Remplacer :
```ts
bands: [{ min: 0, max: 8, emoji: "🛡️", label: "Prudent", body: "b" }],
```
par :
```ts
bands: [{ min: 0, max: 8, emoji: "🛡️", label: "Prudent", body: "b", allocation: ["a"], tip: "t" }],
```

- [ ] **Étape 8 : vérifier** — `/module/m05`, écran Défi : 3 en-têtes « Partie N/3 » visibles, questions toujours enchaînées (pas de pagination). Écran Bilan : répartition en liste à puces + astuce séparée. `npm run test` vert (le fixture compile).

- [ ] **Étape 9 : commit** — `feat(engine): DiagnosticChallenge themed sections; diagnostic results show allocation as a bullet list`

### Tâche 8 : écran de fin de phase (`PhaseComplete`) — badge + récap (M04 fin Phase 1, M10 fin Phase 2)

**Files:**
- Create: `app/components/engine/PhaseComplete.tsx`
- Create: `app/components/engine/PhaseComplete.module.css`
- Modify: `app/components/engine/ModulePlayer.tsx`
- Modify: `app/content/modules/m04.ts` (trim de la note « Bravo Phase 1 »)
- Modify: `app/content/modules/m10.ts` (suppression de `feedback.plan`)

**Interfaces:**
- Consumes : `phaseCompletionFor(code)` (`content/registry.ts`, Tâche 2).
- Produces : nouveau composant `PhaseComplete`.

- [ ] **Étape 1 : `components/engine/PhaseComplete.tsx`**

```tsx
"use client";

import styles from "./PhaseComplete.module.css";

/**
 * Écran dédié affiché après le Bilan du DERNIER module d'une phase (M04 =
 * fin Phase 1, M10 = fin Phase 2 après renumérotation) — remplace l'ancien
 * procédé qui glissait la félicitation dans le `.note` d'une explication de
 * quiz (M04) ou dans `feedback.plan` (M10/ex-M08) : un vrai écran à part
 * entière, avec badge et récap en puces (demande explicite de la revue).
 */
export function PhaseComplete({
  badge,
  name,
  recap,
  futureNote,
  onNext,
}: {
  badge: string;
  name: string;
  recap: string[];
  /** Fonctionnalité annoncée mais pas encore construite (ex. export PDF, M10) — rendue en bouton désactivé, pas un lien mort. */
  futureNote?: string;
  onNext: () => void;
}) {
  return (
    <div className={styles.wrap}>
      <p className={styles.eyebrow}>Fin de phase</p>

      <div className={styles.card}>
        <div className={styles.badge} aria-hidden="true">
          {badge}
        </div>
        <h2 className={styles.title}>Bravo, vous terminez la {name} !</h2>
        <p className={styles.sub}>Voici ce que vous savez faire maintenant :</p>
        <ul className={styles.recap}>
          {recap.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>

        {futureNote && (
          <button type="button" className={styles.futureBtn} disabled>
            {futureNote}
          </button>
        )}
      </div>

      <button type="button" className={styles.btn} onClick={onNext}>
        Continuer <span className={styles.arw}>→</span>
      </button>
    </div>
  );
}
```

Note : `name` reçoit `PhaseDef.name` qui vaut déjà `"Phase 1 · Les Fondations"` — adapter le titre pour éviter « Bravo, vous terminez la Phase 1 · Les Fondations ! » (double article) : utiliser plutôt `Bravo, vous terminez {name} !` (sans « la »). Corriger dans le JSX ci-dessus : `<h2 className={styles.title}>Bravo, vous terminez {name} !</h2>`.

- [ ] **Étape 2 : `components/engine/PhaseComplete.module.css`**

```css
.wrap {
  display: block;
}

.eyebrow {
  font-family: var(--f-display);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--or-deep);
  margin: 0 0 16px;
}

.card {
  background: linear-gradient(140deg, var(--blue-1), var(--blue-2));
  color: #e7eef4;
  border-radius: var(--radius-xl);
  padding: 34px 30px;
  box-shadow: var(--shadow-lg);
  text-align: center;
  position: relative;
  overflow: hidden;
}
.card::before {
  content: "";
  position: absolute;
  right: -70px;
  top: -80px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent 60%);
}
.card > * {
  position: relative;
}

.badge {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 40px;
  margin: 0 auto 18px;
  background: linear-gradient(135deg, #f7cf49, var(--or));
  box-shadow: 0 12px 26px -12px rgba(242, 183, 5, 0.85);
}

.title {
  font-family: var(--f-display);
  font-weight: 800;
  font-size: clamp(1.4rem, 4vw, 1.9rem);
  line-height: 1.15;
  margin: 0 0 8px;
  color: #fff;
}

.sub {
  color: #a9c2d4;
  font-weight: 600;
  margin: 0 0 18px;
}

.recap {
  list-style: none;
  margin: 0;
  padding: 20px 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  display: grid;
  gap: 12px;
  text-align: left;
}
.recap li {
  position: relative;
  padding-left: 28px;
  color: #dae6ef;
  font-weight: 600;
}
.recap li::before {
  content: "✓";
  position: absolute;
  left: 0;
  top: 0;
  color: var(--pos);
  font-weight: 800;
}

.futureBtn {
  appearance: none;
  width: 100%;
  margin-top: 22px;
  border: 1.5px dashed rgba(255, 255, 255, 0.3);
  border-radius: 14px;
  padding: 13px 16px;
  background: rgba(255, 255, 255, 0.06);
  color: #a9c2d4;
  font-family: var(--f-display);
  font-weight: 600;
  font-size: 0.92rem;
  cursor: not-allowed;
}

.btn {
  appearance: none;
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 17px 28px;
  font-family: var(--f-display);
  font-size: 1.06rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  margin-top: 22px;
  background: linear-gradient(135deg, #f7cf49, var(--or));
  color: #3a2907;
  box-shadow: 0 12px 26px -12px rgba(242, 183, 5, 0.85);
  transition: transform 0.12s, filter 0.2s;
}
.btn:hover {
  filter: brightness(1.04);
}
.btn:active {
  transform: translateY(1px) scale(0.995);
}
.arw {
  transition: transform 0.2s;
}
.btn:hover .arw {
  transform: translateX(3px);
}
```

- [ ] **Étape 3 : `ModulePlayer.tsx`** — nouvelle phase `"phase-recap"`, routage après le Bilan :

```tsx
import { getNext, phaseCompletionFor } from "@/content/registry";
import { PhaseComplete } from "./PhaseComplete";

type Phase = "intro" | "cours" | "defi" | "bilan" | "phase-recap";
...
function ModulePlayerInner({ module }: { module: Module }) {
  ...
  useReportModulePhase(PHASE_ORDER.indexOf(phase === "phase-recap" ? "bilan" : phase));

  function handleChallengeResult(r: Result) { ... } // inchangé
  function handleSimulatorDone() { ... }             // inchangé
  function handleDiagnosticResult(...) { ... }        // inchangé

  // Après le Bilan : si ce module est le dernier de sa phase, montrer
  // l'écran de fin de phase avant de continuer — sinon comportement inchangé.
  function handleBilanNext() {
    if (phaseCompletionFor(module.code)) { setPhase("phase-recap"); return; }
    handleNext();
  }

  function handleNext() {
    const nextMod = getNext(module.code);
    router.push(nextMod ? `/module/${nextMod.code.toLowerCase()}` : "/");
  }

  return (
    <>
      {phase === "intro" && <Hero module={module} onStart={() => setPhase("cours")} />}
      {phase === "cours" && ( <SlideDeck ... /> )}
      {phase === "defi" && module.challenge.type === "quiz" && ( <QuizChallenge ... /> )}
      {phase === "defi" && module.challenge.type === "simulator" && ( <SimulatorChallenge ... /> )}
      {phase === "defi" && module.challenge.type === "diagnostic" && ( <DiagnosticChallenge ... /> )}

      {phase === "bilan" && (
        <Bilan
          result={result}
          feedback={module.feedback}
          onNext={handleBilanNext}
          walletTotal={state.capital}
          quiz={...}
          diagnostic={...}
        />
      )}

      {phase === "phase-recap" && (() => {
        const completion = phaseCompletionFor(module.code)!;
        return (
          <PhaseComplete
            badge={completion.badge}
            name={completion.name}
            recap={completion.recap}
            futureNote={completion.futureNote}
            onNext={handleNext}
          />
        );
      })()}
    </>
  );
}
```

(Le reste de `handleChallengeResult`/`handleSimulatorDone`/`handleDiagnosticResult` est inchangé — seul `onNext` passé à `Bilan` change, de `handleNext` à `handleBilanNext`.)

- [ ] **Étape 4 : `content/modules/m04.ts`** — trim de la note (le nouvel écran dédié porte désormais la félicitation de fin de Phase 1) :

Remplacer :
```ts
note: "🏆 **Bravo, vous terminez la Phase 1 « Les Fondations » !** Vous connaissez le marché, les produits et la façon de gagner de l'argent. Vous ne regarderez plus jamais le journal télé de la même manière. Il est temps de définir VOTRE propre stratégie.",
```
par :
```ts
note: "Elle a le temps (horizon long) et vise le rendement max. Elle peut encaisser la volatilité. Seules les actions solides offrent cette croissance de long terme.",
```
Attention : cette phrase existe déjà dans `body` juste au-dessus (« Elle a le temps... croissance de long terme. ») — la Fatou `note` fait doublon avec `body` une fois le 🏆 retiré. Retirer plutôt le champ `note` entièrement pour cette explication (le type `Feedback.explanations[].note` est optionnel) :
```ts
{
  verdict: "Action",
  title: "Fatou",
  body: "Elle a le temps (horizon long) et vise le rendement max. Elle peut encaisser la volatilité. Seules les actions solides offrent cette croissance de long terme.",
},
```
(supprimer la clé `note` de cet objet).

- [ ] **Étape 5 : `content/modules/m10.ts`** (ex-M08 DCA) — supprimer `feedback.plan` (contenu repris dans `PHASES[1].recap`, Tâche 2) :

Remplacer :
```ts
feedback: {
  headline: { ... },
  golden: "...",
  plan: {
    title: "Votre plan est maintenant complet",
    items: [ ... ],
  },
},
```
par :
```ts
feedback: {
  headline: { ... },   // inchangé
  golden: "...",        // inchangé
},
```

- [ ] **Étape 6 : vérifier** — terminer `/module/m04` (Défi puis Bilan) : après « Continuer », l'écran PhaseComplete Phase 1 s'affiche (badge 🥉, 4 puces, bouton Continuer → M05). Terminer `/module/m10` : écran PhaseComplete Phase 2 (badge 🥈, 4 puces, bouton PDF désactivé visible, bouton Continuer → M11). Vérifier qu'un module NON dernier-de-phase (ex. M02, M06) passe toujours directement de Bilan au module suivant, sans écran intermédiaire.

- [ ] **Étape 7 : commit** — `feat(engine): dedicated PhaseComplete screen (badge + recap) at the end of each phase, replacing the old inline "bravo" note and the M08 "plan complete" box`

---

## Partie 2 — Corrections de contenu, module par module (M01-M07, M10)

Toutes les tâches ci-dessous supposent la Partie 0 (renumérotation) et la Partie 1 (moteur) déjà appliquées. Chaque tâche = un seul fichier, éditable indépendamment des autres.

### Tâche 9 : M02 — liste slide 5, renvoi « module 10 », alignement feu vert/rouge

**Files:**
- Modify: `app/content/modules/m02.ts`
- Modify: `app/components/engine/QuizChallenge.module.css`

- [ ] **Étape 1 : slide 5 (index 4, « Alors, combien investir ? »)** — remplacer :

```ts
{ kind: "text", value: "Ce qu'il vous reste **après** avoir : (1) payé l'essentiel, (2) constitué votre fonds d'urgence, (3) mis de côté vos projets proches." },
{ kind: "text", value: "Ce surplus, investissez-le **régulièrement** (la magie de la régularité, on la verra au M08)." },
```
par :
```ts
{ kind: "text", value: "Ce qu'il vous reste **après** avoir :" },
{
  kind: "list",
  items: [
    "✅ payé l'essentiel,",
    "✅ constitué votre fonds d'urgence,",
    "✅ mis de côté vos projets proches.",
  ],
},
{ kind: "text", value: "Ce surplus, investissez-le **régulièrement** (la magie de la régularité, on la verra au module 10)." },
```

(Le renvoi textuel cite désormais « module 10 » — DCA après renumérotation, cf. Partie 0. Si la Tâche 9 est exécutée AVANT la Partie 0 dans un ordre différent, utiliser le numéro correct au moment de l'édition.)

- [ ] **Étape 2 : alignement feu vert/feu rouge** — cause : `.opt` (QuizChallenge.module.css) a `justify-content: center` mais pas de largeur de texte contrainte ; les libellés « 🟢 Feu vert » (11 caractères) et « 🔴 Feu rouge » (12 caractères) sont proches en longueur, le vrai problème visuel vient de `align-items: center` sur `.qOpts` (grid) qui laisse chaque bouton s'étirer à la hauteur de son contenu sans les aligner sur la même ligne de base. Ajouter `align-items: stretch` (défaut de grid déjà implicite en fait — vérifier au rendu) : le correctif le plus sûr est de garantir que le texte des deux boutons d'une même question est sur une seule ligne, centré verticalement, avec un `min-height` commun :

```css
.opt {
  appearance: none;
  border: 2px solid var(--line-strong);
  background: var(--card);
  color: var(--ink);
  border-radius: 16px;
  padding: 15px 14px;
  min-height: 54px;
  font-family: var(--f-display);
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 8px;
  transition: border-color 0.18s, background 0.18s, color 0.18s, transform 0.12s;
}
```

(Ajout de `min-height: 54px` + `text-align: center` — sans casser `.opt` des autres modules puisque ce changement est purement additif/normalisant, appliqué à toutes les options de tous les quiz.)

- [ ] **Étape 3 : vérifier** — `/module/m02` (slide 5 : liste à puces + « module 10 » ; écran Défi : les 4 boutons Feu vert/Feu rouge alignés, même hauteur, texte centré).

- [ ] **Étape 4 : commit** — `content(m02): bullet list on slide 5, fix stale M08 cross-reference to module 10; fix(engine): align quiz option button text/height`

### Tâche 10 : M03 — liste slide 5 (déjà couvert scénario/mauvaise réponse par la Partie 1)

**Files:**
- Modify: `app/content/modules/m03.ts`

- [ ] **Étape 1 : slide 5 (index 4, « À la pratique ! »)** — remplacer :

```ts
{ kind: "lead", value: "Dividende = cash régulier. Plus-value = le capital qui grossit." },
{ kind: "text", value: "Voyons si c'est bien clair. 👇" },
```
par :
```ts
{ kind: "lead", value: "Retenez ces deux mécanismes :" },
{
  kind: "list",
  items: [
    "🍊 **Dividende** = cash régulier, versé chaque année.",
    "📈 **Plus-value** = le capital qui grossit, réel seulement le jour où vous vendez.",
  ],
},
{ kind: "text", value: "Voyons si c'est bien clair. 👇" },
```

- [ ] **Étape 2 : vérifier** — `/module/m03`, slide 5 : liste à puces avec emojis 🍊/📈 (rappel des moteurs 1 et 2 vus aux slides 2 et 4).

- [ ] **Étape 3 : commit** — `content(m03): bullet list with emoji recap on slide 5`

### Tâche 11 : M06 — nav (déjà fixée Partie 1), transition profil→stratégie, cadrage des 3 « problèmes », exemple France, exemple fin de mois, fourchette 6-10 %, liste Q3

**Files:**
- Modify: `app/content/modules/m06.ts`

- [ ] **Étape 1 : `hero.lead`** — mentionner la transition profil → stratégie :

Remplacer :
```ts
lead:
  "La rente vous procure des revenus réguliers, presque sans effort : vous possédez des actions comme un fermier possède des arbres, et vous récoltez les dividendes chaque année — sans jamais vendre le capital.",
```
par :
```ts
lead:
  "Vous connaissez votre profil d'investisseur (M05) — reste à le mettre en musique : c'est le rôle d'une stratégie. La rente vous procure des revenus réguliers, presque sans effort : vous possédez des actions comme un fermier possède des arbres, et vous récoltez les dividendes chaque année — sans jamais vendre le capital.",
```

- [ ] **Étape 2 : slide 2 (index 1, « Problème n°1 »)** — cadrer comme des EXEMPLES, pas LA fonction première : ajouter une phrase d'intro avant le texte existant :

```ts
{
  title: "Problème n°1 que la rente résout : financer les études des enfants",
  blocks: [
    { kind: "lead", value: "Voici quelques exemples de problèmes que la rente peut résoudre — pas les seuls, mais parmi les plus fréquents." },
    { kind: "text", value: "Vous constituez peu à peu un portefeuille d'actions qui versent de bons dividendes. Chaque année, ces dividendes arrivent sur votre compte et paient la scolarité." },
    { kind: "callout", tone: "highlight", value: "Le point clé : **vous ne vendez jamais vos actions**. Votre capital (les arbres) reste en place et continue même de grandir — vous ne dépensez que les fruits." },
  ],
},
```

- [ ] **Étape 3 : slide 3 (index 2, « Problème n°2 : compléter sa retraite »)** — préciser que la Côte d'Ivoire est un exemple + ajouter un exemple France :

Remplacer :
```ts
{
  title: "Problème n°2 : compléter sa retraite",
  blocks: [
    { kind: "text", value: "Un chiffre qui fait réfléchir : en Côte d'Ivoire, la pension versée par la CNPS (la Caisse Nationale de Prévoyance Sociale, la caisse de retraite) représente en moyenne environ **un tiers** de vos meilleures années de salaire." },
    { kind: "text", value: "Concrètement : si vous gagniez 600 000 FCFA par mois, votre retraite tournera autour de **200 000 FCFA** — soit 400 000 FCFA de train de vie en moins **chaque mois**." },
    { kind: "text", value: "La parade : en investissant pendant votre vie active, vous vous bâtissez une **seconde source de revenus**. Le jour venu, les dividendes viennent combler ce manque." },
  ],
},
```
par :
```ts
{
  title: "Problème n°2 : compléter sa retraite",
  blocks: [
    { kind: "text", value: "Prenons un exemple : en Côte d'Ivoire, la pension versée par la CNPS (la Caisse Nationale de Prévoyance Sociale) représente en moyenne environ **un tiers** de vos meilleures années de salaire. Concrètement : si vous gagniez 600 000 FCFA par mois, votre retraite tournera autour de **200 000 FCFA** — soit 400 000 FCFA de train de vie en moins **chaque mois**." },
    { kind: "text", value: "Ce n'est pas propre à la Côte d'Ivoire : même en France, la pension moyenne ne remplace pas non plus l'intégralité du dernier salaire — les estimations du Conseil d'orientation des retraites évoquent un taux de remplacement de l'ordre de **50 à 75 %** selon les revenus et les carrières, avec une baisse plus marquée pour les hauts salaires." },
    { kind: "text", value: "La parade est la même partout : en investissant pendant votre vie active, vous vous bâtissez une **seconde source de revenus**. Le jour venu, les dividendes viennent combler ce manque." },
  ],
},
```

- [ ] **Étape 4 : slide 4 (index 3, « Problème n°3 : arrondir ses fins de mois »)** — ajouter un exemple chiffré :

Remplacer :
```ts
{
  title: "Problème n°3 : arrondir ses fins de mois",
  blocks: [
    { kind: "text", value: "Même en travaillant, la rente ajoute un revenu **par-dessus** votre salaire." },
    { kind: "callout", tone: "warn", value: "⚠️ Une particularité de la BRVM à connaître : ici, les dividendes sont versés **une seule fois par an** (entre mai et juillet), en une somme unique — pas chaque mois comme un salaire. Il faut donc savoir **répartir vous-même** cette somme sur les 12 mois de l'année." },
  ],
},
```
par :
```ts
{
  title: "Problème n°3 : arrondir ses fins de mois",
  blocks: [
    { kind: "text", value: "Même en travaillant, la rente ajoute un revenu **par-dessus** votre salaire." },
    { kind: "callout", tone: "info", value: "**Exemple :** avec 6 000 000 FCFA investis dans des actions de rente à 8 % de rendement, vous touchez 480 000 FCFA de dividendes par an. Réparti sur 12 mois, cela fait **40 000 FCFA en plus chaque mois** — de quoi couvrir une facture, la cantine, ou simplement souffler avant la fin du mois." },
    { kind: "callout", tone: "warn", value: "⚠️ Une particularité de la BRVM à connaître : ici, les dividendes sont versés **une seule fois par an** (entre mai et juillet), en une somme unique — pas chaque mois comme un salaire. Il faut donc savoir **répartir vous-même** cette somme sur les 12 mois de l'année, comme dans l'exemple ci-dessus." },
  ],
},
```

- [ ] **Étape 5 : slide 6 (index 5, dividende attractif)** — fourchette 6-10 % au lieu de 9-10 % :

Remplacer, dans le 2ᵉ item de la `list` :
```ts
"**Un rendement de départ élevé** — le rendement = dividende ÷ prix de l'action. Il vous dit ce que l'action rapporte **chaque année**, par rapport à ce que vous la payez. À la BRVM, viser **9-10 %** est un bon repère (contre ~3 % sur un livret d'épargne).",
```
par :
```ts
"**Un rendement de départ élevé** — le rendement = dividende ÷ prix de l'action. Il vous dit ce que l'action rapporte **chaque année**, par rapport à ce que vous la payez. À la BRVM, viser **entre 6 et 10 %** est un bon repère (contre ~3 % sur un livret d'épargne).",
```

- [ ] **Étape 6 : `hero.card.rules`** — même fourchette (cohérence avec le slide) :

Remplacer :
```ts
"**Un rendement élevé** — viser 9-10 % à la BRVM.",
```
par :
```ts
"**Un rendement élevé** — viser entre 6 et 10 % à la BRVM.",
```

- [ ] **Étape 7 : Défi Q3 — liste à la ligne des propositions A/B** :

Remplacer :
```ts
{
  prompt:
    "Quelle est la meilleure **valeur de rente** ? **A :** bénéfices réguliers et croissants, distribue **60 %**, rendement **9 %**. **B :** bénéfices en dents de scie, distribue **15 %**, rendement **2 %**.",
  answer: "A",
  options: [
    { value: "A", label: "Entreprise A" },
    { value: "B", label: "Entreprise B" },
  ],
},
```
par :
```ts
{
  prompt:
    "Quelle est la meilleure **valeur de rente** ?\n🅰️ Bénéfices réguliers et croissants, distribue **60 %**, rendement **9 %**.\n🅱️ Bénéfices en dents de scie, distribue **15 %**, rendement **2 %**.",
  answer: "A",
  options: [
    { value: "A", label: "Entreprise A" },
    { value: "B", label: "Entreprise B" },
  ],
},
```

(Le `\n` s'affiche bien grâce à `white-space: pre-line` sur `.qPrompt`, ajouté Tâche 5 Étape 3.)

- [ ] **Étape 8 : vérifier** — `/module/m06` : intro mentionne la transition M05→stratégie ; slide 2 cadré « quelques exemples » ; slide 3 France + CI ; slide 4 exemple chiffré ; slide 6 et hero « 6-10 % » ; Défi Q3 sur 3 lignes distinctes (question / A / B).

- [ ] **Étape 9 : commit** — `content(m06): profile-to-strategy transition, frame the 3 "problems" as examples, add a France example, add a concrete end-of-month example, widen dividend target to 6-10%, format Q3 propositions on separate lines`

### Tâche 12 : M07 — « module 3 » au lieu de M03, croissance comme levier, exemple chiffré slide 6

**Files:**
- Modify: `app/content/modules/m07.ts`

- [ ] **Étape 1 : slide 2 (index 1, « L'argent qui dort ne grossit pas »)** — remplacer :

```ts
{ kind: "text", value: "En bourse, c'est pareil : certaines actions montent avec le temps. La différence entre le prix d'achat et le prix de revente, c'est la **plus-value** (vue au M03). On achète ces actions dans le but de les revendre plus tard, plus cher." },
```
par :
```ts
{ kind: "text", value: "En bourse, c'est pareil : certaines actions montent avec le temps. La différence entre le prix d'achat et le prix de revente, c'est la **plus-value** (vue au module 3). On achète ces actions dans le but de les revendre plus tard, plus cher." },
```

- [ ] **Étape 2 : slide 5 (index 4, « À quoi sert la croissance ? »)** — ajouter la notion de levier, avant la liste d'exemples :

Remplacer :
```ts
{
  title: "À quoi sert la croissance ? À financer un projet",
  blocks: [
    { kind: "text", value: "Contrairement à la rente (qui paie des dépenses courantes), la croissance sert à **réunir une grosse somme** pour un objectif précis :" },
    { kind: "list", items: [ ... ] },
  ],
},
```
par :
```ts
{
  title: "À quoi sert la croissance ? À financer un projet",
  blocks: [
    { kind: "text", value: "Contrairement à la rente (qui paie des dépenses courantes), la croissance sert à **réunir une grosse somme** pour un objectif précis :" },
    { kind: "list", items: [
      "les **études supérieures** d'un enfant,",
      "un projet **immobilier** — au lieu d'épargner pendant des années pour construire votre terrain, vous investissez pour y arriver plus vite,",
      "lancer un **business**, ou financer un grand **voyage**.",
    ] },
    { kind: "callout", tone: "highlight", value: "La croissance est un **levier** : bien utilisée, elle vous permet d'atteindre ces objectifs **plus vite qu'en épargnant seul(e)** — l'argent qui dort sur un compte ne travaille pas pour vous." },
  ],
},
```

(Le texte des 3 items de liste est inchangé, juste redistribué + un `callout` ajouté après.)

- [ ] **Étape 3 : slide 6 (index 5, « La puissance de la croissance (et sa limite) »)** — corriger l'incohérence arithmétique existante (100 000 FCFA/mois × 5 ans = 6 000 000, pas 4,8 millions) et ajouter un exemple chiffré de croissance, calculé avec la même formule que le simulateur du module DCA (`fvAnnuity`, `lib/format.ts`) pour rester cohérent avec le reste de l'app — `fvAnnuity(100000, 12, 5)` ≈ investi 6 000 000 FCFA, valeur finale ≈ 8 167 000 FCFA (soit ≈ +2 167 000 FCFA de gains à 12 %/an, hypothèse jamais garantie) :

Remplacer :
```ts
{
  title: "La puissance de la croissance (et sa limite)",
  blocks: [
    { kind: "text", value: "Un exemple parlant : épargner 100 000 FCFA/mois pendant 5 ans, cela fait environ **4,8 millions**. Bien placé en stratégie de croissance, ce même effort d'épargne peut fructifier **bien au-delà**." },
    { kind: "callout", tone: "warn", value: "⚠️ Mais restons lucides : viser une forte croissance est un objectif **ambitieux et jamais garanti**, et il demande du **temps** — comptez un horizon de **5 à 10 ans**. Sur moins de 3 ans, c'est trop risqué. 👇" },
  ],
},
```
par :
```ts
{
  title: "La puissance de la croissance (et sa limite)",
  blocks: [
    { kind: "text", value: "Un exemple parlant : épargner 100 000 FCFA/mois pendant 5 ans, sans rendement, cela fait **6 000 000 FCFA**. Bien placé en stratégie de croissance — disons à 12 % par an, une hypothèse, pas une promesse — ce même effort d'épargne peut atteindre environ **8 167 000 FCFA**, soit **plus de 2 millions de gains en plus** sur la même période." },
    { kind: "callout", tone: "warn", value: "⚠️ Mais restons lucides : viser une forte croissance est un objectif **ambitieux et jamais garanti**, et il demande du **temps** — comptez un horizon de **5 à 10 ans**. Sur moins de 3 ans, c'est trop risqué. 👇" },
  ],
},
```

- [ ] **Étape 4 : vérifier** — `/module/m07` : slide 2 « module 3 » ; slide 5 mention du levier ; slide 6 chiffres cohérents (6M vs 8,167M).

- [ ] **Étape 5 : commit** — `content(m07): say "module 3" instead of M03, frame growth as a leverage vs plain saving, add a computed compounding example (fixes a pre-existing arithmetic slip)`

### Tâche 13 : vérification finale de la Partie 2

- [ ] `npm run test && npm run build` doivent passer (le build échouera encore si M08/M09 n'existent pas — cf. Tâches 11bis/12bis... voir Partie 3 ci-dessous, à faire avant cette vérification finale si exécuté dans l'ordre du plan).
- [ ] Parcours manuel `npm run dev` : M01 → M02 → … → M07 → M10, en particulier l'écran PhaseComplete à la sortie de M04 et de M10.

---

## Partie 3 — Nouveaux modules M08 (Stratégie de trade) et M09 (Plan d'investissement)

### Tâche 14 : M08 — Stratégie de trade

**Files:**
- Create: `app/content/modules/m08.ts`

**Interfaces:**
- Consumes : `Module` (`lib/types.ts`), `QuizChallenge` (avec `scenario?`, Tâche 5).
- Produces : `m08` exporté, importé par `content/registry.ts` (déjà câblé Tâche 2).

- [ ] **Étape 1 : écrire le fichier**

```ts
import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 08 — La stratégie de trade (nouveau module,
   revue de juillet 2026). 3ᵉ stratégie, à côté de la rente (M06) et
   de la croissance (M07) : opportunités de marché à court terme,
   très risqué, jamais garanti, demande d'être très informé — mais
   un potentiel de rentabilité élevé. Framing volontairement prudent
   (cf. garde-fous d'honnêteté du risque déjà appliqués partout
   ailleurs dans la formation) : aucun chiffre de performance n'est
   avancé comme un exemple à suivre.
   ============================================================= */
export const m08: Module = {
  code: "M08",
  index: 8,
  totalModules: 28,
  title: "La stratégie de trade",
  phase: "Phase 2 · La Boussole",
  status: { emoji: "🥈", label: "L'Investisseur Curieux" },
  reward: 20000,

  hero: {
    eyebrow: "Formation BRVM · Module 08",
    headline: "La 3ᵉ voie : réservée aux initiés.",
    lead:
      "Rente et croissance se jouent sur des années. Il existe une 3ᵉ stratégie, bien plus rapide et bien plus risquée : le trade. Avant de vous laisser tenter, voyons honnêtement ce qu'elle exige — et ce qu'elle peut coûter.",
    card: {
      label: "Une 3ᵉ stratégie, à part",
      title: "Le trading à court terme",
      hint: "4 choses à savoir avant d'y songer :",
      rules: [
        "**Le principe** — acheter et revendre vite, sur de courtes opportunités de marché.",
        "**Très risqué** — les pertes peuvent être aussi rapides que les gains.",
        "**Rien n'est garanti** — aucune martingale, aucune formule magique.",
        "**Exige d'être très informé** — suivi quasi quotidien du marché, pas compatible avec « investir et oublier ».",
      ],
    },
    objectives: [
      "Comprendre en quoi le trade diffère de la rente et de la croissance.",
      "Identifier pourquoi cette stratégie est réservée à des investisseurs avertis.",
      "Savoir reconnaître une situation où le trade est (ou n'est pas) adapté.",
    ],
    cta: "Découvrir la 3ᵉ stratégie",
  },

  slides: [
    {
      title: "Rente, croissance… et le trade ?",
      blocks: [
        { kind: "text", value: "Vous connaissez deux stratégies : la **rente** (des revenus réguliers, M06) et la **croissance** (faire grossir un capital sur plusieurs années, M07). Il en existe une 3ᵉ, à l'esprit très différent : le **trade**." },
        {
          kind: "duo",
          items: [
            { side: "Rente & croissance", value: "on **achète et on garde**, parfois pendant des années, en laissant le temps travailler." },
            { side: "Le trade", value: "on **achète et on revend vite** (jours, semaines, parfois quelques mois), en cherchant à profiter d'un mouvement de prix précis." },
          ],
        },
      ],
    },
    {
      title: "Le trade, concrètement",
      blocks: [
        { kind: "text", value: "Un trader ne cherche pas à devenir copropriétaire d'une entreprise sur le long terme : il cherche des **opportunités de marché** — une action qu'il juge sous-évaluée à court terme, une actualité qui devrait faire bouger un cours, un mouvement technique qu'il pense pouvoir anticiper." },
        { kind: "text", value: "Il achète, puis revend dès que l'opportunité s'est réalisée (ou qu'elle a échoué, pour limiter la perte)." },
      ],
    },
    {
      title: "Pourquoi c'est risqué",
      blocks: [
        { kind: "text", value: "Le rentier et le bâtisseur de capital ont le temps pour eux : une baisse passagère ne les inquiète pas. Le trader, lui, n'a **pas ce filet** : son pari doit se réaliser dans une fenêtre courte." },
        {
          kind: "list",
          items: [
            "**Personne ne devine le marché à coup sûr** — pas même les professionnels, en permanence.",
            "**Le coupe-circuit (± 7,5 %/séance, vu au module 1) ne protège que d'une chute brutale en une journée** — rien n'empêche un enchaînement de séances défavorables.",
            "**La discipline émotionnelle est aussi importante que l'analyse** — paniquer ou s'entêter coûte souvent plus cher que l'erreur de départ.",
          ],
        },
      ],
    },
    {
      title: "Le potentiel (et son revers)",
      blocks: [
        { kind: "callout", tone: "warn", value: "⚠️ Le trade peut offrir un **potentiel de rentabilité élevé** sur une opportunité bien identifiée — mais le même mécanisme qui fait gagner vite peut faire **perdre vite**. Contrairement à la rente ou à la croissance, il n'y a pas de « temps » pour rattraper une erreur de timing." },
        { kind: "text", value: "C'est un jeu à somme où l'information et la préparation font la différence : sans un vrai travail de suivi du marché, le trade se transforme vite en pari." },
      ],
    },
    {
      title: "Qui devrait s'y risquer ?",
      blocks: [
        { kind: "lead", value: "Le trade n'est pas une stratégie de débutant." },
        {
          kind: "list",
          items: [
            "Seulement une fois les **fondations maîtrisées** (Phases 1 et 2 de cette formation).",
            "Seulement avec de l'**argent que vous pouvez perdre entièrement**, jamais votre fonds d'urgence ni votre épargne de rente/croissance (rappel des 3 règles d'or, module 2).",
            "Seulement si vous êtes prêt(e) à **suivre le marché régulièrement** — pas un investissement « et on oublie ».",
          ],
        },
        { kind: "text", value: "Voyons si les bons réflexes sont déjà là. 👇" },
      ],
    },
  ],

  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Trade ou pas trade ?",
    instruction: "Pour chaque situation, dites si le trade est une réponse adaptée. (1 erreur = − 5 000 FCFA.)",
    penaltyPerError: 5000,
    perfectReward: 20000,
    options: [
      { value: "oui", label: "Adapté" },
      { value: "non", label: "Pas adapté" },
    ],
    questions: [
      { prompt: "**Kader** débute tout juste en bourse. Il a lu 2 articles et veut « essayer » le trade avec son fonds d'urgence.", answer: "non" },
      { prompt: "**Aïcha** investit depuis 3 ans (rente + croissance), a un fonds d'urgence solide, et veut consacrer une petite somme — qu'elle peut perdre sans conséquence — à suivre une opportunité de marché qu'elle a étudiée en détail.", answer: "oui" },
      { prompt: "**Boubacar** pense qu'il peut deviner, à coup sûr, la direction du marché la semaine prochaine.", answer: "non" },
      { prompt: "**Nadège** est prête à consulter le marché quasi quotidiennement pendant plusieurs semaines pour suivre une position de trade.", answer: "oui" },
    ],
  },

  feedback: {
    perfect: {
      icon: "🎉",
      title: "Bons réflexes ! + 20 000 FCFA sur votre portefeuille !",
      body: "Vous savez déjà reconnaître quand le trade est une option raisonnable — et quand c'est un pari déguisé.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Le trade ne pardonne pas l'approximation (− 5 000 FCFA par erreur).",
      body: "Reprenons chaque situation.",
    },
    explanations: [
      {
        verdict: "Pas adapté",
        title: "Kader",
        body: "Débuter par le trade, avec le fonds d'urgence en plus, cumule les 2 pires erreurs : aucune expérience, et de l'argent qu'on n'a pas le droit de perdre (règle d'or n°1, module 2).",
      },
      {
        verdict: "Adapté",
        title: "Aïcha",
        body: "Elle coche les cases : fondations déjà solides, argent dédié qu'elle peut perdre sans conséquence, opportunité étudiée. Le trade reste risqué pour elle aussi — mais dans un cadre responsable.",
      },
      {
        verdict: "Pas adapté",
        title: "Boubacar",
        body: "Personne ne devine le marché « à coup sûr » — pas même les professionnels. Croire l'inverse est le meilleur moyen de perdre gros.",
      },
      {
        verdict: "Adapté",
        title: "Nadège",
        body: "Le trade demande un suivi quasi quotidien : sans ce temps disponible, mieux vaut s'en tenir à la rente ou à la croissance, qui ne l'exigent pas.",
      },
    ],
  },

  next: {
    label: "3 stratégies en poche ! Reste à les assembler dans un vrai plan.",
    target: "Module 09",
  },
};
```

- [ ] **Étape 2 : vérifier** — `npm run test` (validate.test.ts doit toujours passer), `/module/m08` en dev.

- [ ] **Étape 3 : commit** — `content: add Module 08 — Stratégie de trade (3rd strategy, high risk, after Croissance)`

### Tâche 15 : M09 — Plan d'investissement

**Source :** le user a fourni `BRVM Learning/EDB Plan d'investissement.txt` (transcription d'un cours audio de L'École de la Bourse). Concepts clés à reprendre, reformulés dans le ton BRVM Learning (jamais copiés verbatim) :
- Métaphore : investir sans plan = construire une maison sans architecte (un peu de ciment ici, une brique là → rien de solide au final).
- 2 objectifs possibles : **revenu** (→ stratégie de rente, M06) ou **capital** (→ stratégie de croissance, M07) — cumulables, mais idéalement dans 2 portefeuilles séparés pour bien mesurer chacun.
- L'horizon protège des paniques : plus il est long, plus on peut encaisser un choc de marché sans être forcé de vendre à perte.
- Budget : repère pratique = au moins 25 000-30 000 FCFA par objectif poursuivi en direct ; en dessous, l'OPCVM (M04) reste la solution pour diversifier correctement.
- Le user demande 5 piliers (objectif/horizon/**stratégie**/profil/capacité d'épargne) — le script audio EDB n'en distingue que 4 (l'objectif y inclut implicitement la stratégie) ; ce plan **suit la demande du user** et distingue stratégie et objectif, la stratégie faisant le lien explicite vers M06/M07/M08.
- ⚠️ **Ne PAS reprendre l'anecdote réelle du script** (crise SAF Cacao 2018, valeur « CIB »/« la cible », chiffres 2800→2000→5300 FCFA) : transcription automatique d'audio, chiffres de marché non vérifiables ni sourcés autrement. Remplacée ci-dessous par un cas **fictif équivalent**, dans le style Aïcha/Koffi déjà utilisé partout ailleurs dans la formation — même leçon (l'horizon donne la marge pour patienter), sans chiffre de marché invérifié.

**Files:**
- Create: `app/content/modules/m09.ts`

- [ ] **Étape 1 : écrire le fichier**

```ts
import type { Module } from "@/lib/types";

/* =============================================================
   Contenu du Module 09 — Plan d'investissement.
   Inspiré du script audio EDB fourni par le user (BRVM Learning/EDB
   Plan d'investissement.txt) : métaphore de la construction sans
   plan, 2 objectifs (revenu/capital), rôle protecteur de l'horizon,
   repère de budget (25-30k FCFA/objectif). Reformulé intégralement
   (pas de copie), et l'exemple d'horizon est fictif (cf. plan —
   l'anecdote réelle du script vient d'une transcription audio avec
   des chiffres de marché non vérifiables).
   ============================================================= */
export const m09: Module = {
  code: "M09",
  index: 9,
  totalModules: 28,
  title: "Votre plan d'investissement",
  phase: "Phase 2 · La Boussole",
  status: { emoji: "🥈", label: "L'Investisseur Curieux" },
  reward: 20000,

  hero: {
    eyebrow: "Formation BRVM · Module 09",
    headline: "Votre boussole personnelle.",
    lead:
      "Investir sans plan, c'est comme construire une maison sans architecte : un peu de ciment ici, une brique là — et au final, rien de solide. Le plan d'investissement réunit 5 éléments déjà vus dans cette formation, pour choisir chaque opportunité en connaissance de cause.",
    card: {
      label: "5 éléments à réunir",
      title: "Votre plan d'investissement",
      hint: "Un vrai plan répond à 5 questions :",
      rules: [
        "**L'objectif** — pourquoi investissez-vous : un revenu, ou un capital ?",
        "**L'horizon** — pour quand aurez-vous besoin de cet argent ?",
        "**La stratégie** — rente, croissance ou trade (modules 6 à 8) ?",
        "**Le profil** — quelle est votre tolérance au risque (module 5) ?",
        "**La capacité d'épargne** — combien pouvez-vous investir, régulièrement ?",
      ],
    },
    objectives: [
      "Comprendre pourquoi un plan d'investissement écrit change tout.",
      "Identifier les 5 éléments qui composent un plan complet.",
      "Savoir pourquoi l'horizon de placement protège des paniques de marché.",
    ],
    cta: "Construire mon plan",
  },

  slides: [
    {
      title: "Investir sans plan, c'est construire sans architecte",
      blocks: [
        { kind: "lead", value: "Imaginez quelqu'un qui construit une maison sans plan : un peu de ciment aujourd'hui, une brique demain, ici puis là. Au final, il n'aura rien de solide." },
        { kind: "text", value: "Investir en bourse au hasard — un peu de ceci, un peu de cela, selon les conseils du moment — mène exactement au même résultat : un portefeuille sans cohérence, difficile à évaluer, qui ne sert aucun objectif précis." },
        { kind: "text", value: "Le **plan d'investissement** est votre architecte : il réunit 5 éléments qui, ensemble, vous permettent de choisir chaque opportunité en connaissance de cause." },
      ],
    },
    {
      title: "1er élément : votre objectif",
      blocks: [
        { kind: "text", value: "Pourquoi investissez-vous ? On peut résumer à 2 grandes familles d'objectifs :" },
        {
          kind: "duo",
          items: [
            { side: "Un revenu", value: "vous cherchez du cash régulier → c'est la stratégie de **rente** (module 6)." },
            { side: "Un capital", value: "vous cherchez à faire grossir une somme pour un projet → c'est la stratégie de **croissance** (module 7)." },
          ],
        },
        { kind: "callout", tone: "info", value: "Vous pouvez poursuivre les deux objectifs à la fois — ce n'est pas incompatible. Mais idéalement, séparez-les en **2 portefeuilles distincts**, pour mesurer clairement si chacun atteint son but." },
      ],
    },
    {
      title: "2ᵉ élément : votre horizon",
      blocks: [
        { kind: "text", value: "Votre **horizon de placement**, c'est la durée pendant laquelle votre capital reste engagé avant que vous n'en ayez besoin. Il compte double : il détermine ce que vous pouvez raisonnablement acheter, ET il vous donne — ou non — la marge pour patienter en cas de coup dur." },
        { kind: "callout", tone: "highlight", value: "**Exemple :** Aïcha a ouvert un portefeuille d'actions bancaires pour financer les études de sa fille, dans 8 ans. Un choc sur le secteur bancaire fait chuter son action de 25 % en quelques mois. Comme elle n'aura besoin de cet argent que dans 8 ans, elle n'est pas obligée de vendre dans la panique : elle patiente. Quelques mois plus tard, l'action a retrouvé son niveau — et continue de progresser." },
        { kind: "text", value: "Avec un horizon **court** (si Aïcha avait eu besoin de cet argent dans 18 mois), la même baisse l'aurait forcée à vendre à perte, faute de temps pour attendre le rebond." },
      ],
    },
    {
      title: "3ᵉ et 4ᵉ éléments : votre stratégie et votre profil",
      blocks: [
        { kind: "text", value: "Ces deux éléments, vous les connaissez déjà :" },
        {
          kind: "list",
          items: [
            "**Votre stratégie** — rente, croissance ou trade (modules 6, 7 et 8) : le COMMENT vous poursuivez votre objectif.",
            "**Votre profil de risque** — mesuré au module 5 : ce qu'il détermine, c'est votre capacité à ENCAISSER les fluctuations sans paniquer.",
          ],
        },
        { kind: "text", value: "Votre stratégie doit servir votre objectif ; votre profil doit dicter le dosage risque/sécurité de votre portefeuille." },
      ],
    },
    {
      title: "5ᵉ élément : votre capacité d'épargne",
      blocks: [
        { kind: "text", value: "Votre **budget** détermine combien de lignes (d'entreprises différentes) vous pouvez raisonnablement détenir en direct — donc combien vous pouvez diversifier." },
        { kind: "callout", tone: "warn", value: "Avec 15 000 ou 20 000 FCFA, difficile de diversifier correctement en actions en direct : 1 ou 2 lignes ne protègent de rien. Repère pratique : comptez **au moins 25 000 à 30 000 FCFA** par objectif poursuivi en direct." },
        { kind: "text", value: "En dessous de ce seuil, ou pour déléguer la diversification, l'**OPCVM** (module 4) reste la solution la plus adaptée : un seul versement, déjà réparti sur des dizaines de titres." },
      ],
    },
    {
      title: "Votre plan, en une phrase",
      blocks: [
        { kind: "lead", value: "Un plan d'investissement complet répond à 5 questions : pourquoi (objectif), pour quand (horizon), comment (stratégie), avec quel dosage de risque (profil), et avec combien (capacité d'épargne)." },
        { kind: "text", value: "À vous de vérifier si vous savez reconnaître un plan complet. 👇" },
      ],
    },
  ],

  challenge: {
    type: "quiz",
    kicker: "Le Défi",
    title: "Les éléments d'un bon plan",
    instruction: "Pour chaque situation, dites si le plan décrit est complet. (1 erreur = − 5 000 FCFA.)",
    penaltyPerError: 5000,
    perfectReward: 20000,
    options: [
      { value: "complet", label: "Plan complet" },
      { value: "incomplet", label: "Il manque un élément" },
    ],
    questions: [
      {
        prompt: "**Fatou** : « Je veux financer les études de ma fille dans 8 ans, avec une stratégie de croissance, je suis prête à encaisser des baisses, et j'investis 50 000 FCFA/mois. »",
        answer: "complet",
      },
      {
        prompt: "**Moussa** : « Je veux 30 000 FCFA de revenus complémentaires par mois d'ici 3 ans, via des actions à bon dividende ; je tolère de petites fluctuations, et j'épargne 40 000 FCFA/mois. »",
        answer: "complet",
      },
      {
        prompt: "**Ibrahim** : « Je veux investir pour gagner de l'argent. » — c'est tout ce qu'il sait dire de son projet.",
        answer: "incomplet",
      },
    ],
  },

  feedback: {
    perfect: {
      icon: "🎉",
      title: "Plan limpide ! + 20 000 FCFA sur votre portefeuille !",
      body: "Vous savez reconnaître les 5 éléments d'un plan d'investissement complet.",
    },
    imperfect: {
      icon: "📉",
      title: "Aïe ! Un plan incomplet mène à des décisions au hasard (− 5 000 FCFA par erreur).",
      body: "Reprenons les 5 éléments.",
    },
    explanations: [
      {
        verdict: "Plan complet",
        title: "Fatou",
        body: "Objectif (études), horizon (8 ans), stratégie (croissance), profil (tolère les baisses) et capacité d'épargne (50 000/mois) : les 5 éléments sont là.",
      },
      {
        verdict: "Plan complet",
        title: "Moussa",
        body: "Objectif (revenu régulier via dividendes → rente), horizon (3 ans), stratégie (rente), profil (petites fluctuations tolérées) et capacité d'épargne (40 000/mois) : les 5 éléments sont là aussi, même si son horizon court impose la prudence.",
      },
      {
        verdict: "Plan incomplet",
        title: "Ibrahim",
        body: "« Gagner de l'argent » n'est ni un objectif précis, ni un horizon, ni une stratégie. Sans ces repères, impossible de choisir la bonne opportunité — c'est exactement la maison sans plan.",
      },
    ],
  },

  next: {
    label: "Mon plan est posé ! Reste la régularité pour le faire vivre.",
    target: "Module 10",
  },
};
```

- [ ] **Étape 2 : vérifier** — `npm run test && npm run build` doivent maintenant passer (28 modules complets), `/module/m09` en dev.

- [ ] **Étape 3 : commit** — `content: add Module 09 — Plan d'investissement (5 pillars, inspired by the EDB audio script, fictionalized horizon example)`

---

## Vérification finale (toutes parties)

- [ ] `npm run test` — vert (vitest, y compris `validate.test.ts` sur les 28 modules).
- [ ] `npm run build` — vert (type-check + build Next.js).
- [ ] `npm run dev` — parcours manuel complet : `/onboarding` → M01 (nouvelle intro) → … → M04 (écran PhaseComplete Phase 1) → M05 (sections du diagnostic, résultat en liste) → M06 (retour à l'intro possible, exemples France/fin de mois, fourchette 6-10 %) → M07 (« module 3 », exemple chiffré cohérent) → M08 (nouveau, trade) → M09 (nouveau, placeholder) → M10 (ex-M08 DCA, écran PhaseComplete Phase 2 avec bouton PDF désactivé) → M11.
- [ ] Revue mobile rapide (sidebar → barre d'onglets) sur un écran modifié (ex. PhaseComplete) — pas de régression de layout.
- [ ] Rappeler au user : (a) le chiffre France (taux de remplacement des retraites, M06) est une approximation générale à vérifier avant publication, (b) l'exemple d'horizon du M09 (Aïcha, choc bancaire) est fictif — l'anecdote réelle du script EDB (SAF Cacao 2018) n'a pas été reprise faute de chiffres vérifiables, (c) les `BRVM Learning/*.txt` de référence n'ont pas été renumérotés (hors dépôt).
