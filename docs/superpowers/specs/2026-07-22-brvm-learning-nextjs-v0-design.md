# BRVM Learning — v0 Next.js (design)

**Date :** 2026-07-22
**Statut :** approuvé (brainstorming)
**Objectif :** porter le POC vanilla (`brvm-training/POC-Module-1/`) vers une application Next.js déployable sur Vercel, avec l'onboarding, le dashboard et les **26 modules jouables**, pour un beta-test de bout en bout. **Sans authentification ni comptes** (phase 2).

---

## 1. Contexte & objectif

Le contenu de la formation (26 modules, 5 phases) est **entièrement rédigé** dans `brvm-training/BRVM Learning/M01…M26.txt`, tous au même gabarit :

- **Section 1 — le Cours** : des slides défilables (`📱 Slide N/T — Titre`), une idée par slide.
- **Section 2 — le Défi** : soit un **quiz** (variantes : Mythe/Réalité, Feu vert/rouge, Vrai/Faux…), soit un **simulateur** (M08).
- **Section 3 — le Feedback** : réaction (parfait / imparfait) + explications détaillées.
- **Bouton suivant** vers le module suivant, + statut 🥉🥈🥇💎, phase, récompenses/malus.

Le POC vanilla a déjà validé l'expérience et l'identité visuelle : un **moteur générique** (`app.js`) affiche n'importe quel module à partir d'un **objet de données** (`data/module-01.js` quiz, `data/module-08.js` simulateur), plus un **dashboard** (`dashboard.html`) et un **onboarding** 6 étapes (`onboarding.html`). Le système visuel « Cauri News » (marine `#0E2F44` + or `#F2B705` sur neutre `#F4F4F1`, accent positif vert `#1FA774`, typo Poppins/Nunito) est finement réglé.

**Ce design porte ce POC en Next.js** en conservant son architecture « 1 moteur + N fichiers de contenu », et en convertissant les **26 modules** en données typées.

### Hors périmètre v0 (phase 2 / plus tard)
- Authentification, comptes utilisateurs, Supabase.
- Outils du Coffre-fort (tracker de portefeuille, calendrier des dividendes, comparateur SGI…) : **affichés en cartes**, marqués « bientôt », non fonctionnels.
- Back-office admin (`module_access`, support, indicateurs).
- Persistance serveur / multi-appareils (v0 = `localStorage`, par navigateur).

---

## 2. Stack & emplacement

- **Next.js (App Router, dernière version stable), TypeScript, React 19.**
- Projet dans **`brvm-training/app/`**, initialisé comme **son propre dépôt git** (racine du déploiement Vercel).
- `brvm-training/POC-Module-1/` et `brvm-training/BRVM Learning/` restent **hors du dépôt `app/`**, comme sources de référence.
- **Aucune variable d'environnement, aucun backend** → déploiement Vercel « zero-config ».
- **Pas de Tailwind** : port du `styles.css` existant (global + tokens) + CSS Modules par composant, pour préserver l'identité visuelle à l'identique.

---

## 3. Architecture — le moteur piloté par les données

### 3.1 Modèle de contenu (type-safe)

`lib/types.ts` définit la forme d'un module. Le contenu devient **vérifié au build** : un bloc malformé casse `npm run build`, pas la prod.

```ts
type Block =
  | { kind: "text"; value: string }
  | { kind: "lead"; value: string }
  | { kind: "callout"; tone: "info" | "highlight" | "warn"; value: string }
  | { kind: "duo"; items: { side: string; value: string }[] }
  | { kind: "list"; items: string[] }
  | { kind: "countries"; items: string[] };

type Slide = { title: string; blocks: Block[] };

type QuizChallenge = {
  type: "quiz";
  kicker: string; title: string; instruction: string;
  penaltyPerError: number; perfectReward: number;
  options: { value: string; label: string }[];   // ex. Mythe/Réalité, Feu vert/rouge
  questions: { prompt: string; answer: string }[]; // answer ∈ options.value
};

type SimulatorChallenge = {
  type: "simulator";
  kicker: string; title: string; instruction: string; note?: string;
  sliders: { key: string; label: string; min: number; max: number;
             step: number; value: number; kind: "money" | "pct" | "years" }[];
};

type Challenge = QuizChallenge | SimulatorChallenge;

type Feedback = {
  // quiz
  perfect?: { icon: string; title: string; body: string };
  imperfect?: { icon: string; title: string; body: string };
  explanations?: { verdict: string; title: string; body: string; note?: string }[];
  // simulateur
  headline?: { icon: string; title: string; body: string };
  golden?: string;
  plan?: { title: string; items: string[] };
};

type Module = {
  code: string;            // "M01"
  index: number;           // 1..26
  totalModules: 26;
  title: string;
  phase: string;           // "Phase 1 · Fondations"
  status: { emoji: string; label: string };
  startingCapital?: number;
  reward?: number;         // récompense de complétion (barème harmonisé)
  hero: {
    eyebrow: string; headline: string; lead: string;
    rules?: string[];      // module « cadeau » (M01)
    card?: { label: string; title: string; hint: string; rules: string[] }; // carte thématique
    cta: string;
  };
  slides: Slide[];
  challenge: Challenge;
  feedback: Feedback;
  next: { label: string; target: string };
};
```

> Le gras inline `**…**` des textes est conservé et rendu via un petit utilitaire `renderMarkup()` (gras uniquement, comme le POC), pas de moteur markdown complet.

### 3.2 Organisation des fichiers de contenu

- `content/modules/m01.ts … m26.ts` — un `Module` typé par fichier (port de `data/module-01.js`, etc.).
- `content/registry.ts` — `MODULES: Record<string, Module>` + `PHASES` (nom, badge, codes ordonnés) dérivé de `data/user-state.js`. Fournit `getModule(code)`, `getNext(code)`, `orderedCodes()`.

### 3.3 Le moteur (composants React, port de `app.js`)

`components/engine/` :
- **`ModulePlayer`** — machine à états : `intro → cours → défi → bilan`. Orchestre l'avancement et écrit la progression dans le store à la complétion.
- **`Hero`** — écran d'accueil (variante « cadeau du million » M01 vs « carte thématique »).
- **`SlideDeck`** + **`BlockRenderer`** — slides défilables (← →, clavier + boutons), rend chaque `Block` selon son `kind`.
- **`QuizChallenge`** — questions à options paramétrables (Mythe/Réalité, Feu vert/rouge…), validation groupée, calcul du score, application récompense/malus au capital.
- **`SimulatorChallenge`** — 3 curseurs + **graphe SVG maison** (aire « investi » + bande dorée « intérêts composés », formule FV d'annuité mensuelle). Sans score.
- **`Bilan`** / **`Lecon`** — `ScoreRing` (anneau SVG animé), pastilles de stats, variation animée du portefeuille, explications (quiz) ou leçon d'or + plan (simulateur).
- **`Wallet`** — compteur FCFA qui roule (header + sidebar), jeton +/− flottant, flash « correction ». Formatage FCFA **maison** (`money()`, espaces des milliers — évite l'espace fine insécable de `Intl` qui casse en Poppins).

### 3.4 Dashboard & Onboarding (port de `dashboard.js` / `onboarding.js`)

- **`/`** → **Dashboard** : carte d'accueil, carte **« Reprendre »** (module + slide → lien réel), carte de **progression** (anneau %, statut, capital, série, modules terminés/26), **Coffre-fort** (ressources débloquées/verrouillées, outils « bientôt »), **carte des 26 modules par phase** avec états ✓/▶/○/🔒. Sidebar fixe desktop + barre d'onglets flottante mobile.
- **`/onboarding`** → carrousel **6 étapes** (Bienvenue → portefeuille fictif → mission + statuts → déroulé Contexte/Défi/Feedback → Coffre-fort + reprise → remise du million qui roule 0→1 000 000) → lance `/module/m01`.

---

## 4. Routing

| Route | Écran | Rendu |
|---|---|---|
| `/` | Dashboard | client (lit le store) ; redirige vers `/onboarding` si première visite (flag `onboarded`) |
| `/onboarding` | Carrousel 6 étapes | client |
| `/module/[code]` | Moteur du module `code` | `generateStaticParams` sur les 26 codes ; page serveur qui passe le `Module` au `ModulePlayer` client |
| `/coffre` | Coffre-fort (cartes) | client (états débloqués depuis le store) |

`[code]` inconnu → `notFound()`.

---

## 5. État & persistance (localStorage, sans compte)

`lib/store.ts` — un **contexte React + hook `useProgress()`**, persistant dans `localStorage` (clé `brvm-learning:v1`) :

```ts
type ProgressState = {
  onboarded: boolean;
  capital: number;            // démarre à 1 000 000 après onboarding
  streak: number;
  completed: Record<string, { score: number; at: string }>; // par code module
  resume?: { code: string; slide: number };                  // pointeur de reprise
  unlockedResources: string[];
};
```

- **Dérivations** (pas stockées) : statut 🥉→💎 (selon modules terminés / phase atteinte), état de chaque module (`done` si dans `completed` ; `current` = 1er non terminé ; `unlocked` = le suivant ; `locked` au-delà), % de progression.
- **Écritures** : `ModulePlayer` met à jour `completed`, `capital` (récompense/malus), `resume`, `streak` à la fin d'un module ; le `SlideDeck` met à jour `resume.slide` en cours de lecture.
- **Hydratation SSR-safe** : les écrans à état sont des composants client ; le store s'hydrate au `mount` (état initial neutre au premier rendu, puis lecture `localStorage`) → aucun mismatch d'hydratation. Un bouton « Réinitialiser ma progression » (utile en beta) vide la clé.

---

## 6. Style

- Port de `POC-Module-1/styles.css` → `app/globals.css` : tous les **tokens** (`--blue #0F4A6E`, `--blue-2 #0E2F44`, `--or #F2B705`, `--pos #1FA774`, `--coral #F0714E`, neutre `#F4F4F1`…), polices **Poppins** (titres/chiffres) + **Nunito** (corps) via `next/font/google`.
- Composants stylés en **CSS Modules** (repris des classes existantes). Rendu **identique au POC**.
- Responsive conservé : sidebar desktop scoping (règles ex-`body.dash-page`), barre d'onglets mobile, wallet compact mobile.

---

## 7. Contenu — conversion des 26 modules

**Le gros du travail.** Transcription **module par module** de `BRVM Learning/MXX.txt` → `content/modules/mXX.ts`, en respectant :

- **Règle « puce auto-explicative »** ([[feedback-brvm-explicit-no-narration]]) : on **ne simplifie pas** le texte, chaque puce enseigne le pourquoi + le comment ; sigles définis à leur 1ʳᵉ apparition.
- Découpage en slides = celui déjà présent dans le `.txt` (`📱 Slide N/T`).
- Chaque **Défi** : mapper les cas/questions du `.txt` vers `questions[]` + `options[]` (les variantes Mythe/Réalité, Feu vert/rouge… sont juste des libellés d'options différents pour le **même** `QuizChallenge`). M08 = simulateur (déjà fait dans le POC).
- Récompenses/malus depuis le barème harmonisé (`Gamification - Bareme harmonise.txt`).
- M01 et M08 : port direct des objets POC existants (référence de format).

Chaque module converti est **vérifié au rendu** (le typage attrape les erreurs de structure ; revue visuelle du parcours).

---

## 8. Vérification

- **Local (`npm run dev`)** — parcours de bout en bout : `/onboarding` → remise du million → `/module/m01` → Bilan → `/` (dashboard) → progression persistée → parcourir chaque phase, déverrouillage correct, reprise au bon slide.
- **Type-check + build (`npm run build`)** — doit passer ; garantit qu'aucun des 26 modules n'est malformé.
- **Revue mobile** (sidebar → barre d'onglets, wallet compact).
- **Après conversion de chaque lot de modules** : rendu vérifié avant de passer au suivant.

---

## 9. Déploiement Vercel

- Le dépôt `app/` est un projet Next.js standard → **zero-config**.
- Options : `vercel` CLI, ou push GitHub + import dans Vercel.
- **Le déclenchement final du déploiement revient à l'utilisateur** (compte Vercel) ; la spec/plan fournit les étapes exactes et garantit que `npm run build` passe en amont.
- Aucune variable d'environnement requise en v0.

---

## 10. Découpage d'implémentation (aperçu — détaillé dans le plan)

1. **Scaffold** : `create-next-app` (TS, App Router) dans `app/`, fusion avec le dépôt git + `docs/` déjà présents ; port des tokens/polices dans `globals.css`.
2. **Types & registry** : `lib/types.ts`, `content/registry.ts`, `lib/format.ts` (`money`, `renderMarkup`).
3. **Store** : `lib/store.ts` (`useProgress`, localStorage, dérivations, hydratation SSR-safe).
4. **Moteur** : `ModulePlayer` + Hero + SlideDeck/BlockRenderer + QuizChallenge + Bilan + Wallet + ScoreRing. Branché sur M01 (quiz).
5. **Simulateur** : `SimulatorChallenge` + graphe SVG. Branché sur M08.
6. **Dashboard** + **Onboarding** + **Coffre-fort** (cartes) + navigation responsive.
7. **Conversion des 24 modules restants** (M02–M07, M09–M26) par lots, avec vérif de rendu.
8. **Vérif de bout en bout + `npm run build`** + notice de déploiement Vercel.

---

## 11. Risques & décisions

- **Volume de contenu** (24 modules) : principal effort ; sans risque technique, découpé en lots vérifiés.
- **`create-next-app` sur dossier non vide** : le dépôt `app/` contient déjà `.git` + `docs/`. Le plan scaffoldera dans un sous-dossier temporaire puis fusionnera (ou déplacera `docs/` le temps du scaffold) — pas de perte de la spec.
- **Hydratation SSR + localStorage** : traité par hydratation au `mount` (état neutre initial).
- **Fidélité visuelle** : garantie par la réutilisation directe de `styles.css` (pas de réécriture Tailwind).
```
