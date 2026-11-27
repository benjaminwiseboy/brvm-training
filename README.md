# BRVM Learning

Formation en ligne interactive pour apprendre à investir à la **BRVM** (Bourse Régionale des Valeurs Mobilières de l'UEMOA), de zéro à investisseur autonome.

- **28 modules** en 5 phases, au format Contexte → Défi (quiz, simulateur, diagnostic) → Bilan, avec un capital fictif en FCFA qui monte ou baisse selon les réponses.
- **Phase 1 gratuite** (M01–M04). La suite se débloque après paiement par mobile money ou virement, validé à la main dans le back-office. Il n'y a **pas de paiement en ligne**.
- **Coffre-fort** : glossaire, comparateur des 37 SGI, plan d'investissement, checklist « 7 premiers jours ».
- PWA installable, notifications push de relance, certificat de fin de parcours, back-office admin.

| | |
|---|---|
| Production | https://brvm-training.vercel.app (branche `main`) |
| Dev / staging | https://brvm-training-git-develop-wiseboy-s-projects.vercel.app (branche `develop`) |
| Suivi | [Issues](https://github.com/benjaminwiseboy/brvm-training/issues) · [Roadmap](docs/ROADMAP.md) |

## Stack

| Couche | Choix |
|---|---|
| Application | Next.js 16 (App Router, Turbopack), React 19, TypeScript, CSS Modules (pas de Tailwind) |
| Données et auth | Supabase : Postgres avec RLS, Auth email + mot de passe (PKCE) |
| Hébergement | Vercel : déploiement Git, Vercel Cron, preview par branche |
| Tests | Vitest (unitaires), CI GitHub Actions, k6 (charge) |
| Observabilité | Logs JSON structurés, alertes Telegram, UptimeRobot sur `/api/health` |

Vue d'ensemble, schéma de données et flux : **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

## Démarrer en local

Prérequis : Node 22 (voir `.nvmrc`) et l'accès au projet Supabase **dev**. Ne branchez jamais votre poste sur la prod.

```bash
npm install
cp .env.local.example .env.local   # puis remplir avec les clés du projet Supabase DEV
npm run dev
```

Ouvrir http://localhost:3000. Un visiteur non connecté voit la landing ; une fois connecté, `/` affiche le tableau de bord, et `/onboarding` au premier passage.

Les variables d'environnement sont toutes décrites dans [.env.local.example](.env.local.example) et dans [docs/ENVIRONMENTS.md](docs/ENVIRONMENTS.md).

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production. Sert aussi de garde-fou de contenu : un module mal formé fait échouer le build |
| `npm run lint` | ESLint (règles Next.js et TypeScript) |
| `npm test` | Tests unitaires Vitest |
| `npx tsc --noEmit` | Vérification des types |
| `bash scripts/smoke.sh <url>` | Smoke test d'un déploiement |
| `bash scripts/github/labels.sh` | (Re)crée les labels GitHub |

## Organisation du code

```
app/            Routes (App Router) : pages, API (crons, health, monitoring), admin
components/     UI par domaine : engine (lecteur de module), dashboard, coffre, admin, landing…
content/        Contenu pédagogique typé : modules/mXX.ts, registry.ts (phases), glossaire, SGI
lib/            Logique métier pure et testée (progress, access, duration, plan…), clients Supabase,
                observability/ (logs, alertes), cron.ts
supabase/       Migrations SQL : schéma, RLS, fonctions
loadtest/       Scénarios k6
scripts/        Smoke test, outillage GitHub
docs/           Architecture, environnements, workflow, sécurité, observabilité, roadmap
.github/        CI/CD, templates d'issues et de PR, Dependabot
.claude/skills/ Procédures pour les agents IA (voir AGENTS.md)
```

## Travailler sur le projet

1. Une issue par changement : bug, évolution ou erreur de contenu (templates dans *New issue*).
2. Une branche `feat/…`, `fix/…` ou `chore/…` créée depuis `develop`, puis une PR vers `develop`. La CI doit être verte.
3. Tester sur la preview Vercel (base **dev**).
4. Livrer en prod avec une PR `develop` → `main`.

Détails, conventions de commit et Definition of Done : **[docs/WORKFLOW.md](docs/WORKFLOW.md)**.

## Documentation

| Document | Contenu |
|---|---|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Composants, données, flux, décisions |
| [ENVIRONMENTS.md](docs/ENVIRONMENTS.md) | Dev / prod, variables, mise en place du projet Supabase dev |
| [WORKFLOW.md](docs/WORKFLOW.md) | Branches, PR, livraison, migrations, gestion des bugs |
| [OBSERVABILITY.md](docs/OBSERVABILITY.md) | Logs, alertes Telegram, sonde, runbook d'incident |
| [SECURITY-AUDIT.md](docs/SECURITY-AUDIT.md) | Audit de sécurité de novembre 2026 et checklist |
| [LOAD-TESTING.md](docs/LOAD-TESTING.md) | Tests de montée en charge |
| [ROADMAP.md](docs/ROADMAP.md) | Où va le produit |
| [DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) | Charte graphique, jetons, typographie |
| [NOTIFICATIONS.md](docs/NOTIFICATIONS.md) | Push de relance et de série |
| [QA.md](docs/QA.md) | Recette manuelle |
| [superpowers/](docs/superpowers/) | Specs et plans de chaque chantier |

Signaler une faille : [SECURITY.md](SECURITY.md). Jamais en issue publique.
