# BRVM Learning v0 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Porter le POC vanilla (`brvm-training/POC-Module-1/`) en une app Next.js déployable sur Vercel — onboarding, dashboard, et les 26 modules jouables — sans authentification (phase 2).

**Architecture:** Moteur générique piloté par des données typées (un objet `Module` par fichier, 26 fichiers), rendu par des composants React. Progression persistée en `localStorage` (aucun backend). Style Cauri News porté du POC (CSS global + CSS Modules, pas de Tailwind).

**Tech Stack:** Next.js (App Router) · TypeScript · React 19 · vitest (tests unitaires purs) · next/font (Poppins + Nunito) · Vercel (déploiement zero-config).

## Global Constraints

- **Cible :** Next.js App Router + TypeScript + React 19. Projet à la racine `brvm-training/app/` (dépôt git déjà initialisé, `docs/` déjà présent).
- **Pas de Tailwind.** Tokens et composants portés de `POC-Module-1/styles.css`. Styles composant en **CSS Modules**.
- **Pas d'auth, pas de Supabase, aucune variable d'environnement** en v0.
- **Persistance :** `localStorage`, clé exacte `brvm-learning:v1`. Hydratation SSR-safe (état neutre au 1er rendu, lecture au `mount`).
- **Polices :** Poppins (titres + chiffres), Nunito (corps), via `next/font/google`.
- **Tokens de marque (valeurs exactes) :** `--blue #0F4A6E`, `--blue-1 #1C6E96`, `--blue-2 #0E2F44`, `--or #F2B705`, `--pos #1FA774`, `--coral #F0714E`, `--clay #C6553B`, fond neutre `#F4F4F1`.
- **Formatage FCFA maison :** fonction `money()` avec séparateur de milliers ` ` (espace insécable normal) — **jamais** `Intl.NumberFormat('fr-FR')` (son espace fine insécable s'affiche à largeur nulle en Poppins).
- **Règle de contenu :** « puce auto-explicative » — **ne jamais simplifier** le texte des `.txt` ; chaque puce enseigne le pourquoi + le comment ; tout sigle défini à sa 1ʳᵉ apparition. Le gras `**…**` de la source est conservé.
- **Source de vérité contenu :** `brvm-training/BRVM Learning/MXX.txt` (hors dépôt `app/`). Source de vérité visuelle/logique : `brvm-training/POC-Module-1/` (hors dépôt `app/`).
- **Commits fréquents**, un par tâche minimum.

**Chemins de référence (hors dépôt, en lecture) :**
- POC : `../POC-Module-1/` (relatif à `app/`) — `app.js`, `styles.css`, `dashboard.js`, `dashboard.html`, `onboarding.js`, `onboarding.html`, `data/module-01.js`, `data/module-08.js`, `data/user-state.js`.
- Contenu : `../BRVM Learning/MXX.txt`, `../BRVM Learning/Gamification - Bareme harmonise.txt`.

---

## File Structure

```
brvm-training/app/
  app/                          # dossier de routes Next (--no-src-dir)
    layout.tsx                  # fonts + globals.css + ProgressProvider
    globals.css                 # tokens + base portés de styles.css
    page.tsx                    # Dashboard (redirige vers /onboarding si 1ʳᵉ visite)
    onboarding/page.tsx
    module/[code]/page.tsx      # generateStaticParams + notFound
    coffre/page.tsx
  lib/
    types.ts                    # Module, Slide, Block, Challenge, Feedback
    format.ts                   # money(), splitMarkup(), fvAnnuity()
    format.test.ts
    store.ts                    # ProgressProvider, useProgress, dérivations pures
    store.test.ts
    markup.tsx                  # renderMarkup() (consomme splitMarkup, renvoie ReactNode)
  content/
    registry.ts                 # MODULES, PHASES, getModule/getNext/orderedCodes
    validate.ts                 # validateModule(), validateAll()
    validate.test.ts
    modules/m01.ts … m26.ts     # 26 objets Module typés
  components/
    engine/
      ModulePlayer.tsx  Hero.tsx  SlideDeck.tsx  BlockRenderer.tsx
      QuizChallenge.tsx  SimulatorChallenge.tsx  CompoundChart.tsx
      Bilan.tsx  Wallet.tsx  ScoreRing.tsx  (+ *.module.css)
    dashboard/
      Dashboard.tsx  ResumeCard.tsx  ProgressCard.tsx  ModuleMap.tsx  VaultCard.tsx  (+ *.module.css)
    onboarding/Onboarding.tsx (+ .module.css)
    nav/AppShell.tsx (+ .module.css)     # sidebar desktop + barre d'onglets mobile
  vitest.config.ts
  package.json  tsconfig.json  next.config.ts  .gitignore  README.md
```

---

## Task 1: Scaffold Next.js dans `app/` (avec `.git` + `docs/` déjà présents)

**Files:**
- Create: tout le squelette `create-next-app` dans `brvm-training/app/`
- Modify: `app/app/globals.css` (remplacé), `app/app/layout.tsx`, `app/app/page.tsx`
- Create: `app/.gitignore` (fourni par le scaffold)

**Interfaces:**
- Produces: projet Next.js fonctionnel (`npm run dev`), tokens CSS globaux, polices Poppins/Nunito chargées via `next/font`.

- [ ] **Step 1 : mettre `docs/` de côté** (create-next-app refuse un dossier contenant des fichiers hors allowlist ; `.git` est toléré, `docs/` non)

```bash
cd "brvm-training/app"
mv docs ../_docs_tmp
```

- [ ] **Step 2 : scaffolder dans le dossier courant**

```bash
npx create-next-app@latest . --ts --app --no-tailwind --eslint --no-src-dir --import-alias "@/*" --use-npm --yes
```
Expected : création de `app/`, `package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`, `node_modules/`. (Turbopack activé par défaut — OK.)

- [ ] **Step 3 : restaurer `docs/`**

```bash
mv ../_docs_tmp docs
```

- [ ] **Step 4 : porter les tokens + base dans `app/app/globals.css`**

Remplacer intégralement `app/app/globals.css` par les `:root { --blue … }`, resets et classes de base de `../POC-Module-1/styles.css` (copier le fichier, retirer les `@import` de polices Google — les polices passent par `next/font`). Conserver le fond `#F4F4F1`, la typo par défaut Nunito, titres Poppins.

- [ ] **Step 5 : charger les polices dans `app/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Poppins, Nunito } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["500","600","700","800"], variable: "--font-poppins" });
const nunito  = Nunito({ subsets: ["latin"], weight: ["400","600","700"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "BRVM Learning",
  description: "De zéro à investisseur autonome à la BRVM.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${poppins.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```
Dans `globals.css`, faire pointer les familles sur les variables : `body{font-family:var(--font-nunito),system-ui,sans-serif}` et les titres/chiffres sur `var(--font-poppins)`.

- [ ] **Step 6 : page d'accueil temporaire** — remplacer `app/app/page.tsx` par un simple `<main><h1>BRVM Learning</h1></main>` (le vrai dashboard vient en Task 11).

- [ ] **Step 7 : lancer le serveur de dev et vérifier**

Run : `npm run dev` puis ouvrir `http://localhost:3000`.
Expected : page « BRVM Learning » sur fond `#F4F4F1`, titre en Poppins. Aucune erreur console.

- [ ] **Step 8 : commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js (App Router, TS, no-tailwind) + tokens Cauri News + fonts"
```

---

## Task 2: Utilitaires purs — `lib/format.ts` (TDD)

**Files:**
- Create: `app/vitest.config.ts`, `app/lib/format.ts`, `app/lib/format.test.ts`
- Modify: `app/package.json` (script `test`)

**Interfaces:**
- Produces :
  - `money(n: number): string` — entier groupé par ` `, signe conservé.
  - `splitMarkup(input: string): { bold: boolean; text: string }[]` — découpe le gras `**…**`, remplace `&nbsp;` par ` `. DOM-free.
  - `fvAnnuity(monthly: number, annualRatePct: number, years: number): { invested: number; future: number }` — valeur future d'une annuité mensuelle.

- [ ] **Step 1 : installer vitest + config**

```bash
npm i -D vitest
```
Créer `app/vitest.config.ts` :
```ts
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { environment: "node" } });
```
Ajouter à `package.json` scripts : `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 2 : écrire les tests (échouent)** — `app/lib/format.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { money, splitMarkup, fvAnnuity } from "./format";

describe("money", () => {
  it("groupe les milliers avec un espace insécable", () => {
    expect(money(1000000)).toBe("1 000 000");
    expect(money(1060000)).toBe("1 060 000");
    expect(money(5000)).toBe("5 000");
    expect(money(0)).toBe("0");
  });
  it("conserve le signe négatif", () => {
    expect(money(-5000)).toBe("-5 000");
  });
});

describe("splitMarkup", () => {
  it("isole les segments en gras", () => {
    expect(splitMarkup("Oubliez **Wall Street**.")).toEqual([
      { bold: false, text: "Oubliez " },
      { bold: true, text: "Wall Street" },
      { bold: false, text: "." },
    ]);
  });
  it("convertit &nbsp; en espace insécable", () => {
    expect(splitMarkup("Wall&nbsp;Street")).toEqual([
      { bold: false, text: "Wall Street" },
    ]);
  });
});

describe("fvAnnuity", () => {
  it("sans rendement, la valeur future = le total investi", () => {
    const r = fvAnnuity(25000, 0, 10);
    expect(r.invested).toBe(3_000_000);
    expect(Math.round(r.future)).toBe(3_000_000);
  });
  it("avec rendement, la valeur future dépasse l'investi", () => {
    const r = fvAnnuity(25000, 8, 15);
    expect(r.invested).toBe(4_500_000);
    expect(r.future).toBeGreaterThan(r.invested);
  });
});
```

- [ ] **Step 3 : run → échoue**

Run : `npm test`
Expected : FAIL (module `./format` introuvable).

- [ ] **Step 4 : implémenter `app/lib/format.ts`**

```ts
export function money(n: number): string {
  const sign = n < 0 ? "-" : "";
  const digits = Math.abs(Math.round(n)).toString();
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function splitMarkup(input: string): { bold: boolean; text: string }[] {
  const text = input.replace(/&nbsp;/g, " ");
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter((seg) => seg.length > 0)
    .map((seg) =>
      seg.startsWith("**") && seg.endsWith("**")
        ? { bold: true, text: seg.slice(2, -2) }
        : { bold: false, text: seg },
    );
}

export function fvAnnuity(monthly: number, annualRatePct: number, years: number) {
  const i = annualRatePct / 100 / 12;
  const n = years * 12;
  const invested = monthly * n;
  const future = i === 0 ? invested : monthly * ((Math.pow(1 + i, n) - 1) / i);
  return { invested, future };
}
```

- [ ] **Step 5 : run → passe**

Run : `npm test`
Expected : PASS (3 describes, tous verts).

- [ ] **Step 6 : commit**

```bash
git add -A && git commit -m "feat(lib): money/splitMarkup/fvAnnuity + vitest"
```

---

## Task 3: Types de contenu + validateur runtime (`lib/types.ts`, `content/validate.ts`, TDD)

**Files:**
- Create: `app/lib/types.ts`, `app/content/validate.ts`, `app/content/validate.test.ts`

**Interfaces:**
- Produces :
  - Types `Block`, `Slide`, `QuizChallenge`, `SimulatorChallenge`, `Challenge`, `Feedback`, `Module` (voir spec §3.1).
  - `validateModule(m: Module): string[]` — renvoie la liste des erreurs (vide si valide).
  - `validateAll(modules: Module[]): string[]` — invariants inter-modules (codes uniques, index 1..26).

- [ ] **Step 1 : écrire `app/lib/types.ts`** — recopier exactement le bloc de types de la spec §3.1 (`Block` avec `text|lead|callout|duo|list|countries`, `callout.tone: "info"|"highlight"|"warn"`, `Challenge` = union `quiz|simulator`, `Module` complet avec `hero.rules?`, `hero.card?`, `reward?`).

- [ ] **Step 2 : écrire les tests (échouent)** — `app/content/validate.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { validateModule, validateAll } from "./validate";
import type { Module } from "@/lib/types";

const base: Module = {
  code: "M01", index: 1, totalModules: 26, title: "T", phase: "Phase 1",
  status: { emoji: "🥉", label: "s" },
  hero: { eyebrow: "e", headline: "h", lead: "l", cta: "c" },
  slides: [{ title: "s", blocks: [{ kind: "text", value: "x" }] }],
  challenge: {
    type: "quiz", kicker: "k", title: "t", instruction: "i",
    penaltyPerError: 5000, perfectReward: 20000,
    options: [{ value: "mythe", label: "Mythe" }, { value: "realite", label: "Réalité" }],
    questions: [{ prompt: "p", answer: "mythe" }],
  },
  feedback: { perfect: { icon: "🎉", title: "t", body: "b" }, imperfect: { icon: "📉", title: "t", body: "b" }, explanations: [] },
  next: { label: "n", target: "Module 02" },
};

describe("validateModule", () => {
  it("accepte un module bien formé", () => {
    expect(validateModule(base)).toEqual([]);
  });
  it("rejette une réponse de quiz absente des options", () => {
    const bad = { ...base, challenge: { ...base.challenge, questions: [{ prompt: "p", answer: "xxx" }] } } as Module;
    expect(validateModule(bad)).toContain("M01: réponse \"xxx\" absente des options");
  });
  it("rejette un module sans slide", () => {
    const bad = { ...base, slides: [] } as Module;
    expect(validateModule(bad)).toContain("M01: aucune slide");
  });
});

describe("validateAll", () => {
  it("rejette les codes dupliqués", () => {
    expect(validateAll([base, base])).toContain("code dupliqué: M01");
  });
});
```

- [ ] **Step 3 : run → échoue**

Run : `npm test`
Expected : FAIL (`./validate` introuvable).

- [ ] **Step 4 : implémenter `app/content/validate.ts`**

```ts
import type { Module } from "@/lib/types";

export function validateModule(m: Module): string[] {
  const errs: string[] = [];
  const tag = m.code ?? "?";
  if (!m.slides || m.slides.length === 0) errs.push(`${tag}: aucune slide`);
  m.slides?.forEach((s, i) => {
    if (!s.blocks || s.blocks.length === 0) errs.push(`${tag}: slide ${i + 1} vide`);
  });
  if (m.challenge.type === "quiz") {
    const values = new Set(m.challenge.options.map((o) => o.value));
    if (m.challenge.questions.length === 0) errs.push(`${tag}: quiz sans question`);
    m.challenge.questions.forEach((q) => {
      if (!values.has(q.answer)) errs.push(`${tag}: réponse "${q.answer}" absente des options`);
    });
  } else {
    if (m.challenge.sliders.length === 0) errs.push(`${tag}: simulateur sans curseur`);
  }
  if (!m.next?.target) errs.push(`${tag}: pas de module suivant`);
  return errs;
}

export function validateAll(modules: Module[]): string[] {
  const errs: string[] = [];
  const seen = new Set<string>();
  for (const m of modules) {
    if (seen.has(m.code)) errs.push(`code dupliqué: ${m.code}`);
    seen.add(m.code);
    if (m.index < 1 || m.index > 26) errs.push(`${m.code}: index hors [1,26]`);
    errs.push(...validateModule(m));
  }
  return errs;
}
```

- [ ] **Step 5 : run → passe** — Run : `npm test` → PASS.

- [ ] **Step 6 : commit**

```bash
git add -A && git commit -m "feat(content): types Module + validateModule/validateAll"
```

---

## Task 4: Registry + port des 2 modules du POC (`content/registry.ts`, `m01.ts`, `m08.ts`)

**Files:**
- Create: `app/content/modules/m01.ts`, `app/content/modules/m08.ts`, `app/content/registry.ts`
- Modify: `app/content/validate.test.ts` (ajouter un test sur le registry réel)

**Interfaces:**
- Consumes : `Module` (Task 3), `validateAll` (Task 3).
- Produces :
  - `MODULES: Record<string, Module>` ; `PHASES: { name: string; badge: string; codes: string[] }[]`.
  - `getModule(code: string): Module | undefined` ; `getNext(code): Module | undefined` ; `orderedCodes(): string[]`.

- [ ] **Step 1 : porter `m01.ts`** — traduire `../POC-Module-1/data/module-01.js` en `export const m01: Module = { … }` typé. Contenu **identique** (hero « cadeau », 5 slides, quiz Mythe/Réalité 4 questions, feedback + 4 explications, `next.target: "Module 02"`). Ajouter `reward: 20000` (récompense de complétion Phase 1, cf. barème).

- [ ] **Step 2 : porter `m08.ts`** — traduire `../POC-Module-1/data/module-08.js` : hero `card` (pas de `rules`), 7 slides, `challenge.type: "simulator"` (3 sliders `monthly/rate/years`), `feedback.headline/golden/plan`. `startingCapital: 1060000` conservé pour référence (le capital réel vient du store).

- [ ] **Step 3 : écrire `app/content/registry.ts`**

```ts
import type { Module } from "@/lib/types";
import { m01 } from "./modules/m01";
import { m08 } from "./modules/m08";
// … imports m02..m26 ajoutés au fil des tâches de conversion

export const MODULES: Record<string, Module> = { M01: m01, M08: m08 /*, …*/ };

export const PHASES = [
  { name: "Phase 1 · Les Fondations", badge: "🥉", codes: ["M01","M02","M03","M04"] },
  { name: "Phase 2 · La Boussole",    badge: "🥈", codes: ["M05","M06","M07","M08"] },
  { name: "Phase 3 · L'Analyse",      badge: "🥇", codes: ["M09","M10","M11","M12","M13","M14","M15","M16","M17","M18","M19"] },
  { name: "Phase 4 · Passage à l'action", badge: "🥇", codes: ["M20","M21","M22"] },
  { name: "Phase 5 · Suivi & maîtrise",   badge: "💎", codes: ["M23","M24","M25","M26"] },
];

export function orderedCodes(): string[] { return PHASES.flatMap((p) => p.codes); }
export function getModule(code: string): Module | undefined { return MODULES[code.toUpperCase()]; }
export function getNext(code: string): Module | undefined {
  const order = orderedCodes();
  const i = order.indexOf(code.toUpperCase());
  return i >= 0 && i < order.length - 1 ? MODULES[order[i + 1]] : undefined;
}
```
> Note : `MODULES` ne contient que les modules déjà convertis ; il se remplit au fil des Tasks 14-18. `PHASES` liste déjà les 26 codes (pour l'affichage verrouillé du dashboard). Les helpers tolèrent un code présent dans `PHASES` mais absent de `MODULES`.

- [ ] **Step 4 : test registry** — ajouter à `validate.test.ts` :

```ts
import { MODULES } from "./registry";
it("tous les modules du registry sont valides", () => {
  expect(validateAll(Object.values(MODULES))).toEqual([]);
});
```
Run : `npm test` → PASS. (Ce test devient le **garde-fou** de toutes les conversions à venir.)

- [ ] **Step 5 : commit**

```bash
git add -A && git commit -m "feat(content): registry + port M01 (quiz) et M08 (simulateur)"
```

---

## Task 5: `Wallet` + `ScoreRing` + `renderMarkup` (composants primitifs)

**Files:**
- Create: `app/lib/markup.tsx`, `app/components/engine/Wallet.tsx` (+ `.module.css`), `app/components/engine/ScoreRing.tsx` (+ `.module.css`)

**Interfaces:**
- Consumes : `splitMarkup`, `money` (Task 2).
- Produces :
  - `renderMarkup(input: string): React.ReactNode` — rend le gras via `<strong>`.
  - `Wallet({ amount, delta }: { amount: number; delta?: number })` — montant FCFA qui « roule », jeton +/− flottant, flash « correction ».
  - `ScoreRing({ pct, label }: { pct: number; label?: string })` — anneau SVG à état final inline (animé en CSS).

- [ ] **Step 1 : `app/lib/markup.tsx`**

```tsx
import React from "react";
import { splitMarkup } from "./format";

export function renderMarkup(input: string): React.ReactNode {
  return splitMarkup(input).map((seg, i) =>
    seg.bold ? <strong key={i}>{seg.text}</strong> : <React.Fragment key={i}>{seg.text}</React.Fragment>,
  );
}
```

- [ ] **Step 2 : `ScoreRing.tsx`** — porter l'anneau SVG de `../POC-Module-1/app.js` (recherche `ScoreRing`/`stroke-dasharray`). SVG circulaire, `stroke` = `var(--pos)`, dash calculé depuis `pct`, chiffre central en Poppins bold. État final **inline** (correct même sans animation), transition CSS.

- [ ] **Step 3 : `Wallet.tsx`** — `"use client"`. Porter le compteur de `../POC-Module-1/app.js` (recherche `money(`, `wallet`, `js-capital`) : au changement d'`amount`, animer le comptage (requestAnimationFrame) de l'ancienne à la nouvelle valeur ; si `delta` fourni, afficher un jeton flottant `+X`/`−X` (`var(--pos)` / `var(--clay)`) et un flash. Label masqué en mobile (média query dans le `.module.css`, cf. `styles.css` `.wallet`).

- [ ] **Step 4 : vérifier au rendu** — insérer temporairement `<Wallet amount={1000000} />` et `<ScoreRing pct={75} />` dans `app/app/page.tsx`, `npm run dev`, vérifier : montant `1 000 000` (espaces), anneau à 75 % vert. Retirer l'insert temporaire.

- [ ] **Step 5 : commit**

```bash
git add -A && git commit -m "feat(engine): renderMarkup + Wallet + ScoreRing"
```

---

## Task 6: `Hero` + `SlideDeck` + `BlockRenderer`

**Files:**
- Create: `app/components/engine/Hero.tsx`, `SlideDeck.tsx`, `BlockRenderer.tsx` (+ `.module.css`)

**Interfaces:**
- Consumes : `Module["hero"]`, `Slide`, `Block` (Task 3) ; `renderMarkup` (Task 5).
- Produces :
  - `Hero({ module, onStart }: { module: Module; onStart: () => void })` — écran d'accueil ; variante « cadeau » (si `hero.rules`) vs « carte thématique » (si `hero.card`).
  - `SlideDeck({ slides, onSlide, onDone }: { slides: Slide[]; onSlide?: (i:number)=>void; onDone: () => void })` — navigation ← → (clavier + boutons), stepper de progression, `onSlide(i)` à chaque changement (pour la reprise), `onDone` au dernier « Suivant ».
  - `BlockRenderer({ block }: { block: Block })` — un `switch` sur `block.kind`.

- [ ] **Step 1 : `BlockRenderer.tsx`** — `switch (block.kind)` pour les 6 types (`text`, `lead`, `callout` avec classe selon `tone`, `duo`, `list`, `countries`). Chaque valeur texte passe par `renderMarkup`. Reprendre les classes de `../POC-Module-1/styles.css` (`.lead`, `.callout--info/--highlight`, `.duo`, `.countries`, …).

- [ ] **Step 2 : `SlideDeck.tsx`** — `"use client"`. État `i`. Boutons ←/→ + `keydown` (ArrowLeft/ArrowRight). Stepper « fait » (pastilles). Au dernier slide, le bouton devient « Suivant » → `onDone()`. Appeler `onSlide?.(i)` dans un `useEffect([i])`. Port de la logique slides de `app.js`.

- [ ] **Step 3 : `Hero.tsx`** — deux rendus selon `hero.rules` (liste de règles du « cadeau ») ou `hero.card` (carte thématique). Bouton CTA → `onStart()`. Port du hero de `app.js` / `styles.css` (`.hero`, `.hero__title::after`, `.eyebrow`).

- [ ] **Step 4 : vérifier au rendu** — page temporaire montant `<Hero module={m01} …/>` puis `<SlideDeck slides={m01.slides} …/>`, vérifier la nav clavier + les 6 kinds de bloc (M01 en couvre plusieurs ; `countries` visible slide 3). Retirer l'insert.

- [ ] **Step 5 : commit**

```bash
git add -A && git commit -m "feat(engine): Hero + SlideDeck + BlockRenderer"
```

---

## Task 7: `QuizChallenge` + `Bilan` (branche M01 de bout en bout)

**Files:**
- Create: `app/components/engine/QuizChallenge.tsx`, `Bilan.tsx` (+ `.module.css`)

**Interfaces:**
- Consumes : `QuizChallenge`, `Feedback` (Task 3) ; `ScoreRing`, `Wallet` (Task 5).
- Produces :
  - `QuizChallenge({ challenge, onResult }: { challenge: QuizChallenge; onResult: (r: { correct: number; total: number; capitalDelta: number }) => void })` — options paramétrables, validation groupée, calcule `correct`, `capitalDelta = correct===total ? perfectReward : -errors*penaltyPerError`.
  - `Bilan({ result, feedback, onNext }: { result: {correct:number;total:number;capitalDelta:number}; feedback: Feedback; onNext: () => void })` — anneau de score, stats, variation animée, explications (une par question).

- [ ] **Step 1 : `QuizChallenge.tsx`** — `"use client"`. Grille de questions ; par question, boutons pour chaque `option` (Mythe/Réalité, Feu vert/rouge…). Bouton « Valider » actif quand toutes répondues → calcule `correct`/`capitalDelta`, appelle `onResult`. Port de la logique quiz de `app.js`.

- [ ] **Step 2 : `Bilan.tsx`** — choisit `feedback.perfect` ou `feedback.imperfect` selon `result`. `ScoreRing pct={correct/total*100}`. Pastilles Score / Portefeuille / Bonus. Liste `feedback.explanations` (verdict + titre + corps + `note?`). Bouton `onNext` = `next.label`.

- [ ] **Step 3 : vérifier au rendu** — page temporaire : `QuizChallenge` de M01 → sur « Valider », afficher `Bilan`. Tester 4/4 (récompense +20 000) et une erreur (−5 000). Retirer l'insert.

- [ ] **Step 4 : commit**

```bash
git add -A && git commit -m "feat(engine): QuizChallenge + Bilan"
```

---

## Task 8: `SimulatorChallenge` + `CompoundChart` + leçon (branche M08)

**Files:**
- Create: `app/components/engine/SimulatorChallenge.tsx`, `CompoundChart.tsx` (+ `.module.css`)
- Modify: `app/components/engine/Bilan.tsx` (rendu « leçon » quand `feedback.golden` présent)

**Interfaces:**
- Consumes : `SimulatorChallenge`, `Feedback` (Task 3) ; `fvAnnuity`, `money` (Task 2).
- Produces :
  - `SimulatorChallenge({ challenge, onDone }: { challenge: SimulatorChallenge; onDone: () => void })` — 3 curseurs, graphe live, bouton « Continuer » → `onDone`.
  - `CompoundChart({ monthly, ratePct, years }: {...})` — SVG : aire « investi » + bande dorée « intérêts composés » (`fvAnnuity`).

- [ ] **Step 1 : `CompoundChart.tsx`** — recalcule à chaque paramètre : pour t=0..years, `fvAnnuity(monthly, ratePct, t)` → deux polylignes/aires SVG (investi en `var(--blue)`, total en `var(--or)`, bande = écart). Port du graphe de `app.js` (recherche `path`/`svg` dans le simulateur M08).

- [ ] **Step 2 : `SimulatorChallenge.tsx`** — `"use client"`. 3 `<input type="range">` (`monthly/rate/years`) initialisés depuis `challenge.sliders[].value`, libellés formatés selon `kind` (`money`/`pct`/`years`). `<CompoundChart>` réactif. `note` affichée. Bouton « Continuer » → `onDone`.

- [ ] **Step 3 : leçon dans `Bilan.tsx`** — si `feedback.golden` défini : rendre `headline` + `golden` + `plan` (pas d'anneau de score). Sinon rendu quiz (Task 7).

- [ ] **Step 4 : vérifier au rendu** — page temporaire M08 : régler les curseurs, voir la bande dorée se creuser quand `years` augmente ; « Continuer » → leçon. Retirer l'insert.

- [ ] **Step 5 : commit**

```bash
git add -A && git commit -m "feat(engine): SimulatorChallenge + CompoundChart + leçon"
```

---

## Task 9: Store de progression (`lib/store.ts`) — dérivations pures en TDD + provider

**Files:**
- Create: `app/lib/store.ts`, `app/lib/store.test.ts`

**Interfaces:**
- Produces (fonctions pures, testées) :
  - `deriveStatus(doneCount: number): { emoji: string; label: string }`
  - `deriveModuleState(code: string, completed: Record<string,unknown>, order: string[]): "done"|"current"|"unlocked"|"locked"`
  - `progressPct(doneCount: number, total: number): number`
  - `applyCompletion(state, code, correct, total, capitalDelta): ProgressState`
- Produces (React) : `ProgressProvider`, `useProgress(): { state; completeModule(...); setResumeSlide(...); reset() }`. Clé `localStorage` = `brvm-learning:v1`.

- [ ] **Step 1 : tests (échouent)** — `app/lib/store.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { deriveStatus, deriveModuleState, progressPct, applyCompletion, initialState } from "./store";

const order = ["M01","M02","M03"];

describe("deriveModuleState", () => {
  it("terminé / en cours / débloqué / verrouillé", () => {
    const done = { M01: { score: 1, at: "x" } };
    expect(deriveModuleState("M01", done, order)).toBe("done");
    expect(deriveModuleState("M02", done, order)).toBe("current");
    expect(deriveModuleState("M03", done, order)).toBe("locked");
    expect(deriveModuleState("M01", {}, order)).toBe("current");
    expect(deriveModuleState("M02", {}, order)).toBe("unlocked");
  });
});

describe("progressPct", () => {
  it("arrondit le pourcentage", () => {
    expect(progressPct(7, 26)).toBe(27);
    expect(progressPct(0, 26)).toBe(0);
  });
});

describe("applyCompletion", () => {
  it("ajoute le module, applique le delta de capital, pose la reprise sur le suivant", () => {
    const s = applyCompletion(initialState(), "M01", 4, 4, 20000);
    expect(s.completed.M01.score).toBe(1);
    expect(s.capital).toBe(1_020_000);
    expect(s.resume).toEqual({ code: "M02", slide: 0 });
  });
  it("ne repasse pas le capital sous zéro", () => {
    const s = applyCompletion({ ...initialState(), capital: 3000 }, "M01", 0, 4, -20000);
    expect(s.capital).toBe(0);
  });
});
```
> `deriveModuleState` : `done` si dans `completed` ; sinon `current` pour le 1er code non terminé ; `unlocked` pour le code juste après le dernier terminé contigu ; `locked` au-delà. (Régler la logique pour satisfaire exactement les cas ci-dessus.)

- [ ] **Step 2 : run → échoue** — `npm test` → FAIL.

- [ ] **Step 3 : implémenter `app/lib/store.ts`** — les fonctions pures ci-dessus + :

```ts
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { orderedCodes } from "@/content/registry";

const KEY = "brvm-learning:v1";
export type ProgressState = {
  onboarded: boolean; capital: number; streak: number;
  completed: Record<string, { score: number; at: string }>;
  resume?: { code: string; slide: number };
  unlockedResources: string[];
};
export const initialState = (): ProgressState => ({
  onboarded: false, capital: 1_000_000, streak: 0, completed: {}, unlockedResources: [],
});
// deriveStatus / deriveModuleState / progressPct / applyCompletion : fonctions pures exportées
// … (implémenter pour passer les tests) …

const Ctx = createContext<{
  state: ProgressState;
  completeModule: (code: string, correct: number, total: number, capitalDelta: number) => void;
  setResumeSlide: (code: string, slide: number) => void;
  setOnboarded: () => void;
  reset: () => void;
} | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setState(JSON.parse(raw)); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(KEY, JSON.stringify(state)); }, [state, hydrated]);
  const value = {
    state,
    completeModule: (code, correct, total, delta) => setState((s) => applyCompletion(s, code, correct, total, delta)),
    setResumeSlide: (code, slide) => setState((s) => ({ ...s, resume: { code, slide } })),
    setOnboarded: () => setState((s) => ({ ...s, onboarded: true })),
    reset: () => setState(initialState()),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useProgress() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useProgress hors ProgressProvider");
  return c;
}
```
`applyCompletion(state, code, correct, total, delta)` : `completed[code] = { score: correct/total, at: new Date().toISOString() }` ; `capital = Math.max(0, capital + delta)` ; `resume = { code: <code suivant via orderedCodes>, slide: 0 }` ; `streak += 1`.

- [ ] **Step 4 : run → passe** — `npm test` → PASS.

- [ ] **Step 5 : brancher le provider** — envelopper `children` dans `app/app/layout.tsx` avec `<ProgressProvider>`.

- [ ] **Step 6 : commit**

```bash
git add -A && git commit -m "feat(store): progression localStorage + dérivations (TDD)"
```

---

## Task 10: `ModulePlayer` + route `/module/[code]` (un module de bout en bout)

**Files:**
- Create: `app/components/engine/ModulePlayer.tsx`, `app/app/module/[code]/page.tsx`, `app/components/nav/AppShell.tsx` (+ `.module.css`)

**Interfaces:**
- Consumes : `Hero`, `SlideDeck`, `QuizChallenge`, `SimulatorChallenge`, `Bilan` (Tasks 6-8) ; `useProgress` (Task 9) ; `getModule`, `orderedCodes` (Task 4).
- Produces :
  - `ModulePlayer({ module }: { module: Module })` — machine à états `intro→cours→defi→bilan`, écrit la progression à la fin.
  - `page.tsx` avec `generateStaticParams()` (les 26 codes) + `notFound()`.

- [ ] **Step 1 : `ModulePlayer.tsx`** — `"use client"`. `const [phase,setPhase]=useState<"intro"|"cours"|"defi"|"bilan">("intro")`. `Wallet` en tête (lit `useProgress().state.capital`). Transitions : Hero.onStart→cours ; SlideDeck.onDone→defi (et `onSlide`→`setResumeSlide(code,i)`) ; QuizChallenge.onResult / SimulatorChallenge.onDone→bilan ; à l'entrée en bilan, appeler `completeModule(...)` **une seule fois** (garder le résultat en state). Bilan.onNext→`router.push('/module/'+nextCode)` ou `/` si dernier.

- [ ] **Step 2 : `app/app/module/[code]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { getModule, orderedCodes } from "@/content/registry";
import { ModulePlayer } from "@/components/engine/ModulePlayer";

export function generateStaticParams() {
  return orderedCodes().map((code) => ({ code: code.toLowerCase() }));
}
export default async function ModulePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const module = getModule(code);
  if (!module) notFound();
  return <ModulePlayer module={module} />;
}
```
> Un code listé dans `PHASES` mais pas encore converti (absent de `MODULES`) → `notFound()` : normal tant que le contenu n'est pas fait.

- [ ] **Step 3 : `AppShell.tsx`** — coquille avec bouton retour ← vers `/` (classe `.backbtn`) ; en Task 11 elle portera la sidebar/onglets. Envelopper `ModulePlayer` dans `AppShell`.

- [ ] **Step 4 : vérifier de bout en bout** — `npm run dev` → `/module/m01` : Intro→Cours→Défi→Bilan→bouton suivant tente `/module/m02` (→ 404 attendu pour l'instant). Recharger `/module/m08` : simulateur→leçon. Vérifier que le capital du Wallet reflète la récompense après M01 (persisté).

- [ ] **Step 5 : commit**

```bash
git add -A && git commit -m "feat(engine): ModulePlayer + route /module/[code] + AppShell"
```

---

## Task 11: Dashboard (`/`) + navigation responsive + redirection 1ʳᵉ visite

**Files:**
- Create: `app/components/dashboard/Dashboard.tsx`, `ResumeCard.tsx`, `ProgressCard.tsx`, `ModuleMap.tsx`, `VaultCard.tsx` (+ `.module.css`)
- Modify: `app/app/page.tsx`, `app/components/nav/AppShell.tsx` (sidebar desktop + onglets mobile)

**Interfaces:**
- Consumes : `useProgress` + dérivations (Task 9) ; `PHASES`, `getModule` (Task 4) ; `ScoreRing`, `Wallet` (Task 5).
- Produces : `Dashboard()` client complet ; `AppShell` avec `variant?: "dash" | "module"`.

- [ ] **Step 1 : `app/app/page.tsx`** — `"use client"` : si `state.onboarded === false` (après hydratation) → `redirect('/onboarding')` (via `useRouter().replace`), sinon `<AppShell variant="dash"><Dashboard/></AppShell>`.

- [ ] **Step 2 : `ResumeCard`** — lit `state.resume` (ou M01 par défaut) → titre du module + slide + lien `/module/<code>`. Port `dashboard.js` (carte « Reprendre »).

- [ ] **Step 3 : `ProgressCard`** — `ScoreRing pct={progressPct(doneCount,26)}`, pastilles : statut `deriveStatus`, capital (`Wallet`/`money`), streak, `doneCount/26`. Port `dashboard.js`.

- [ ] **Step 4 : `ModuleMap`** — pour chaque `PHASES`, lister les modules avec état `deriveModuleState` → icônes ✓/▶/○/🔒 ; `done`/`current`/`unlocked` cliquables vers `/module/<code>`, `locked` non. Port `dashboard.js` (carte des 26 modules).

- [ ] **Step 5 : `VaultCard`** — ressources (tracker, check-list, calendrier, plan) : débloquées vs verrouillées (grisées + condition). Statique pour v0 (liste dérivée de `../POC-Module-1/data/user-state.js`, champ `unlocked`). Lien « Ouvrir le Coffre-fort » → `/coffre`.

- [ ] **Step 6 : `AppShell` responsive** — sidebar gauche fixe desktop (marque + nav verticale + mini-Wallet + bloc profil) ; barre d'onglets flottante mobile. Règles desktop **scopées** à `variant="dash"` (ne pas décaler le header des pages module). Port de `styles.css` (`body.dash-page`, `.sidebar`, `.tabbar`).

- [ ] **Step 7 : vérifier au rendu** — `/` après avoir terminé M01 : reprise, progression, carte des modules (M01 ✓, M02 ▶…), coffre. Réduire la fenêtre → sidebar devient onglets. Tester « Réinitialiser » (via `reset()`, bouton dans le profil) → retour état neuf → redirection `/onboarding`.

- [ ] **Step 8 : commit**

```bash
git add -A && git commit -m "feat(dashboard): dashboard apprenant + nav responsive + redirect 1re visite"
```

---

## Task 12: Onboarding (`/onboarding`) — carrousel 6 étapes

**Files:**
- Create: `app/app/onboarding/page.tsx`, `app/components/onboarding/Onboarding.tsx` (+ `.module.css`)

**Interfaces:**
- Consumes : `useProgress` (`setOnboarded`) ; `Wallet` (Task 5).
- Produces : `Onboarding()` — carrousel 6 étapes, remet le million, `setOnboarded()` puis `router.push('/module/m01')`.

- [ ] **Step 1 : `Onboarding.tsx`** — `"use client"`. 6 étapes (port de `../POC-Module-1/onboarding.js`) : Bienvenue → portefeuille fictif (Wallet 0→1 000 000 démo) → mission + échelle 🥉→💎 → déroulé Contexte/Défi/Feedback → Coffre-fort + reprise → remise du million (compteur qui roule) + CTA. Barre de progression segmentée, ←/→, « Passer ». Le CTA final : `setOnboarded()` puis `router.push('/module/m01')`.

- [ ] **Step 2 : `app/app/onboarding/page.tsx`** — rend `<Onboarding/>` (pas d'AppShell : plein écran).

- [ ] **Step 3 : vérifier** — vider `localStorage` (bouton reset ou devtools) → `/` redirige vers `/onboarding` → parcours 6 étapes → lance M01 ; `state.onboarded` passe à true (retour `/` = dashboard, plus de redirection).

- [ ] **Step 4 : commit**

```bash
git add -A && git commit -m "feat(onboarding): carrousel 6 étapes → remise du million → M01"
```

---

## Task 13: Coffre-fort (`/coffre`) — cartes d'affichage

**Files:**
- Create: `app/app/coffre/page.tsx` (+ composant/`.module.css` si besoin)

**Interfaces:**
- Consumes : `useProgress`, `VaultCard` (Task 11) ; `AppShell`.

- [ ] **Step 1 : `app/app/coffre/page.tsx`** — `"use client"` : `<AppShell variant="dash">` + grille de ressources (mêmes données que `VaultCard`), chaque outil en carte avec badge « Bientôt » (non cliquable en v0). Titre « Le Coffre-fort ».

- [ ] **Step 2 : vérifier** — `/coffre` s'affiche, outils marqués « Bientôt », lien retour dashboard OK.

- [ ] **Step 3 : commit**

```bash
git add -A && git commit -m "feat(coffre): page Coffre-fort (cartes, outils à venir)"
```

---

## Recette de conversion de contenu (Tasks 14-18)

Chaque module `MXX` : traduire `../BRVM Learning/MXX - ….txt` en `app/content/modules/mXX.ts` (`export const mXX: Module = {…}`), puis l'ajouter à `MODULES` dans `registry.ts`. **Mapping exact :**

1. **En-tête** : `code`,`index`,`totalModules:26`,`title` (titre du `.txt`),`phase` (cf. `PHASES`),`status` (emoji+libellé du `.txt` « Statut actuel »),`reward` (barème `Gamification - Bareme harmonise.txt`).
2. **`hero`** : `eyebrow` = `Formation BRVM · Module XX` ; `headline`/`lead` = accroche du `.txt` ; module « cadeau » → `rules` ; sinon `card` (label/title/hint/rules). `cta` = phrase d'action.
3. **`slides`** : une entrée par `📱 Slide N/T` ; découper le corps en `blocks` selon le sens — paragraphe→`text` (ou `lead` pour l'accroche), encadré→`callout` (`info` neutre / `highlight` message-clé / `warn` avertissement risque), opposition→`duo`, énumération→`list`, liste de pays→`countries`. **Conserver le texte intégral** (règle « puce auto-explicative »), gras `**…**` compris. Définir chaque sigle à sa 1ʳᵉ apparition (déjà fait dans les `.txt`).
4. **`challenge`** (Section 2) :
   - Quiz : `options` = les 2 libellés du `.txt` (Mythe/Réalité, 🟢 Feu vert/🔴 Feu rouge, Vrai/Faux…) ; `questions[]` = chaque cas (`prompt` + `answer` ∈ options) ; `penaltyPerError` et `perfectReward` du barème.
   - Simulateur (rare) : `sliders[]` + `note`.
5. **`feedback`** (Section 3) : `perfect`/`imperfect` (icône+titre+corps du `.txt`) ; `explanations[]` = une par question (`verdict`,`title`,`body`,`note?`). Simulateur → `headline`/`golden`/`plan`.
6. **`next`** : `label` = phrase du bouton final ; `target` = `Module XX+1`.

**Garde-fou (à lancer après chaque module ajouté) :** `npm test` (le test « registry valide » de la Task 4 vérifie structure + réponses ∈ options) **puis** revue de rendu `npm run dev` sur `/module/mXX` (Intro→Cours→Défi→Bilan). Commit par lot.

---

## Task 14: Contenu Phase 1 — M02, M03, M04

**Files:** Create `app/content/modules/m02.ts`, `m03.ts`, `m04.ts` ; Modify `app/content/registry.ts` (imports + `MODULES`).

- [ ] **Step 1** : convertir **M02** (`M02 - Securite financiere.txt`) selon la recette. Défi = « Feu vert / Feu rouge » (options `vert`/`rouge`), 4 cas (Awa 🔴, Ibrahim 🔴, Moussa 🔴, Fatou 🟢), `penaltyPerError:5000`,`perfectReward:20000`, 4 explications. `next.target:"Module 03"`.
- [ ] **Step 2** : convertir **M03** (`M03 - Les gains.txt`).
- [ ] **Step 3** : convertir **M04** (`M04 - Les produits.txt`).
- [ ] **Step 4** : ajouter les 3 imports à `registry.ts` (`MODULES.M02/M03/M04`).
- [ ] **Step 5 : garde-fou** — `npm test` → PASS (registry valide) ; `npm run dev` → parcourir `/module/m02`, `/module/m03`, `/module/m04`.
- [ ] **Step 6 : commit** — `git add -A && git commit -m "content: Phase 1 (M02-M04)"`.

---

## Task 15: Contenu Phase 2 — M05, M06, M07

**Files:** Create `m05.ts`, `m06.ts`, `m07.ts` ; Modify `registry.ts`. (M08 déjà fait en Task 4.)

- [ ] **Step 1** : convertir **M05** (`Profil de risque`).
- [ ] **Step 2** : convertir **M06** (`Investissement de rente`) — attention aux slides ajoutées (règle « puce auto-explicative »), critère payout ≥ 50 %, métaphore fermier/chasseur.
- [ ] **Step 3** : convertir **M07** (`Investissement de croissance`) — 5 moteurs de plus-value ; exemples historiques (SGBCI/Nestlé/PALMCI) **à laisser tels quels que dans le `.txt`** (ne pas inventer de chiffres).
- [ ] **Step 4** : imports `registry.ts` (M05/M06/M07).
- [ ] **Step 5 : garde-fou** — `npm test` + revue `/module/m05..m07`.
- [ ] **Step 6 : commit** — `git commit -m "content: Phase 2 (M05-M07)"`.

---

## Task 16: Contenu Phase 3 — M09 à M19 (le cœur : bloc Graham)

**Files:** Create `m09.ts … m19.ts` ; Modify `registry.ts`.

- [ ] **Step 1** : M09 (`Lire le BOC essentiel`), M10 (`BOC avancé 1`), M11 (`BOC avancé 2`), M12 (`BOC avancé 3`) — métaphores du glossaire (indice=note de classe, PER=boutique…).
- [ ] **Step 2** : M13 (`Obligations en profondeur` — nominal/coupon/coupon couru/modes IF/AC/ACD/AD), M14 (`Analyse fondamentale les bases`).
- [ ] **Step 3** : **bloc Graham** M15 (`1a Portrait`), M16 (`1b Performance`), M17 (`2 Perspectives`), M18 (`3 Prix`) — cœur de valeur, conserver toute la profondeur (règle 22,5 calibrée BRVM, value trap, PNB banques…).
- [ ] **Step 4** : M19 (`Défi de synthèse`, badge 🎓, 6 questions).
- [ ] **Step 5** : imports `registry.ts` (M09-M19).
- [ ] **Step 6 : garde-fou** — `npm test` + revue `/module/m09..m19` (lot volumineux : vérifier surtout les Défis et les `callout`).
- [ ] **Step 7 : commit** — `git commit -m "content: Phase 3 (M09-M19, bloc Graham)"`.

---

## Task 17: Contenu Phase 4 — M20, M21, M22

**Files:** Create `m20.ts`, `m21.ts`, `m22.ts` ; Modify `registry.ts`.

- [ ] **Step 1** : M20 (`Compte SGI et frais` — 3 types de frais, 3 critères de choix SGI ; **ne pas** reprendre de partenariats commerciaux).
- [ ] **Step 2** : M21 (`OPCVM en pratique` — VL, catégories, frais, 3 modes libre/mandat/collective).
- [ ] **Step 3** : M22 (`Passer un ordre`).
- [ ] **Step 4** : imports `registry.ts` (M20-M22).
- [ ] **Step 5 : garde-fou** — `npm test` + revue `/module/m20..m22`.
- [ ] **Step 6 : commit** — `git commit -m "content: Phase 4 (M20-M22)"`.

---

## Task 18: Contenu Phase 5 — M23, M24, M25, M26

**Files:** Create `m23.ts`, `m24.ts`, `m25.ts`, `m26.ts` ; Modify `registry.ts`.

- [ ] **Step 1** : M23 (`Fiscalité` — IRVM par pays CI 12 %/Burkina 12,5 %/Niger 7 %/Bénin 4 %, IRC obligations).
- [ ] **Step 2** : M24 (`Quand vendre ses titres` — 3 bonnes raisons / pièges).
- [ ] **Step 3** : M25 (`Simulations finales` — grand oral, 3 profils → bon placement).
- [ ] **Step 4** : M26 (`Boss psychologique`, badge 💎, `next` = retour dashboard / fin).
- [ ] **Step 5** : imports `registry.ts` (M23-M26) — `MODULES` contient désormais les 26.
- [ ] **Step 6 : garde-fou** — `npm test` + revue `/module/m23..m26`.
- [ ] **Step 7 : commit** — `git commit -m "content: Phase 5 (M23-M26)"`.

---

## Task 19: Vérification de bout en bout + build + déploiement Vercel

**Files:** Create `app/README.md` ; vérifier `.gitignore` (déjà généré par create-next-app).

- [ ] **Step 1 : parcours complet manuel** — `npm run dev`, `localStorage` vidé : `/onboarding` → million → M01 → … → dashboard → parcourir les 26 modules dans l'ordre, vérifier déverrouillage progressif, reprise au bon slide, capital cohérent, statut qui évolue 🥉→💎, badges 🎓 (M19) / 💎 (M26).
- [ ] **Step 2 : type-check + build de prod**

Run : `npm run build`
Expected : build **réussi**, 26 routes `/module/*` pré-générées (`generateStaticParams`), aucune erreur TS. (Garantit qu'aucun des 26 modules n'est malformé.)

- [ ] **Step 3 : revue mobile** — DevTools responsive : sidebar→onglets, wallet compact, slides défilables au tactile.

- [ ] **Step 4 : `README.md`** — comment lancer (`npm run dev`), tester (`npm test`), builder (`npm run build`), et **déployer sur Vercel** : soit `npx vercel` (login + déploiement) soit push vers un repo GitHub puis import Vercel (root = `app/`, framework auto-détecté Next.js, aucune variable d'env). Préciser que le **déclenchement du déploiement revient à l'utilisateur** (compte Vercel).

- [ ] **Step 5 : commit final**

```bash
git add -A && git commit -m "docs: README + vérification build v0 (26 modules)"
```

- [ ] **Step 6 : remettre le déploiement à l'utilisateur** — signaler que `npm run build` passe et fournir la commande `npx vercel` / les étapes d'import GitHub ; ne pas déployer à sa place.

---

## Self-Review — couverture de la spec

- **§1 périmètre / hors-périmètre** → Tasks 1-19 (auth/Supabase/outils Coffre-fort exclus ; Task 13 = cartes only). ✔
- **§2 stack & emplacement** → Task 1 (Next.js dans `app/`, no-tailwind, zero-env). ✔
- **§3.1 modèle de contenu typé** → Task 3. ✔
- **§3.2 organisation contenu** → Task 4 (registry) + 14-18 (modules). ✔
- **§3.3 moteur (tous les composants)** → Tasks 5-10. ✔
- **§3.4 dashboard & onboarding** → Tasks 11-12. ✔
- **§4 routing (4 routes + generateStaticParams + notFound)** → Tasks 10-13. ✔
- **§5 état & persistance localStorage SSR-safe** → Task 9. ✔
- **§6 style (tokens + CSS Modules + responsive)** → Tasks 1, 5-6, 11. ✔
- **§7 conversion 26 modules + règle puce auto-explicative** → recette + Tasks 14-18. ✔
- **§8 vérification** → garde-fous par tâche + Task 19. ✔
- **§9 déploiement Vercel (déclenché par l'utilisateur)** → Task 19. ✔

**Cohérence de types :** `money`/`splitMarkup`/`fvAnnuity` (Task 2) consommés en Tasks 5/8 ; `Module`/`Challenge`/`Feedback` (Task 3) consommés partout ; `useProgress`/`completeModule`/`setResumeSlide`/`setOnboarded`/`reset` (Task 9) consommés en Tasks 10-12 ; `getModule`/`getNext`/`orderedCodes`/`PHASES` (Task 4) consommés en Tasks 10-11. Aucun nom divergent. ✔

**Placeholders :** aucune étape « TBD/à compléter » ; le contenu des 24 modules est un mapping mécanique d'une source existante (`.txt`) avec garde-fou machine (`validateAll` + `npm run build`). ✔
