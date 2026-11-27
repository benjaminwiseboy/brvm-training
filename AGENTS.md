<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# BRVM Learning — consignes pour les agents

Formation en ligne sur la bourse BRVM : 28 modules en 5 phases, Phase 1 gratuite. Next.js 16 + Supabase + Vercel. Le produit, le code et la documentation sont **en français**, et les apprenants sont **vouvoyés** dans les cours. Lire [README.md](README.md), puis [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) avant toute modification de structure.

## Commandes

```bash
npm run dev            # serveur local (sur le projet Supabase DEV uniquement)
npm run lint           # ESLint
npx tsc --noEmit       # types
npm test               # Vitest
npm run build          # build + validation de tout le contenu
```

Avant de déclarer une tâche finie : `npm run lint && npx tsc --noEmit && npm test`, puis `npm run build` si `content/`, `app/` ou `next.config.ts` ont été modifiés.

## Où mettre quoi

| Besoin | Emplacement |
|---|---|
| Une règle métier (accès, durée, score, plan) | `lib/*.ts`, en **fonction pure + test** `*.test.ts` à côté |
| Du contenu pédagogique | `content/modules/mXX.ts` (type `Module` de `lib/types.ts`), phase dans `content/registry.ts` |
| Un composant d'écran | `components/<domaine>/`, avec son `.module.css` |
| Une écriture en base depuis l'UI | Server Action dans `lib/actions/*.ts`, ou RPC SQL pour les écritures atomiques |
| Un changement de schéma | **nouvelle** migration `supabase/migrations/` (voir le skill `migration-supabase`) |
| Une tâche planifiée | `app/api/cron/<nom>/route.ts` + `vercel.json` + `ALWAYS_PUBLIC` dans `proxy.ts`, en passant par `lib/cron.ts` |
| Une alerte ou un log | `sendAlert()` / `log()` de `lib/observability/` |

## Règles non négociables

**Accès et paiement**
- Il n'existe **aucun paiement en ligne**. On paie par mobile money ou virement après un échange WhatsApp ; l'admin passe ensuite `payments.status = 'paid'`. Tout écran qui verrouille propose donc le lien WhatsApp (`lib/contact.ts`).
- « Ce module est-il payant pour cet apprenant ? » a **une seule** réponse : `lib/progress.ts::isPaywalled`. Ne pas dupliquer cette règle. Un override admin (ouvert **ou** fermé) l'emporte toujours.

**Sécurité**
- La **RLS est la vraie barrière**. `proxy.ts` ne vérifie que la présence d'une session, sans aucune requête en base.
- Chaque Server Action revérifie l'utilisateur et, pour l'admin, appelle `requireAdmin()`.
- `createAdminClient()` (service role) est réservé au serveur, et chaque usage est justifié en commentaire.
- Redirections : toujours via `sanitizeNextPath`.
- Crons : `isAuthorizedCron(request)`, jamais de comparaison maison du secret.
- Rien de personnel (email, téléphone, état de progression, cookie, query string) dans les logs, les alertes, les issues ni les fixtures. **Le dépôt est public.**

**Contenu**
- Les durées de module ne sont **jamais** saisies à la main : `lib/duration.ts` les calcule.
- Un chiffre réel (cours, taux, PER, exemple d'entreprise) cite une source datée.
- Une slide porte une idée et explique le pourquoi et le comment. La formation est lue sans narration.

**Interface** (détails dans [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md))
- Polices chargées **une seule fois** dans `lib/fonts.ts` : Poppins (titres), Nunito (texte), JetBrains Mono (étiquettes).
- Pour du code neuf, utiliser les jetons `--navy-*` / `--gold-*`. Ne pas supprimer les alias historiques (`--blue-2`, `--or`, `--paper`…).
- `app/landing.css` reste **entièrement scopé sous `.lp`** : Next ne décharge pas les feuilles globales à la navigation.
- Toute commande d'action est une pilule (`.btn`). Pour du texte sur fond teinté, utiliser les jetons d'encre AA (`--or-deep`, `--pos-ink`, `--clay-ink`).
- Vérifier en mobile (390 px) et en desktop.

**Environnements**
- Ne **jamais** se connecter à la base de **production** depuis un poste, une preview ou un script, et ne jamais y lancer de test de charge.
- Une nouvelle variable d'environnement s'ajoute dans `.env.local.example`, sur Vercel (Preview **et** Production) et dans `docs/ENVIRONMENTS.md`.
- Ne jamais régénérer les clés VAPID de prod.

## Git

- Branches `feat/…`, `fix/…`, `chore/…`, `content/…` créées depuis `develop` ; PR vers `develop`. `main` = production, alimentée seulement par une PR de release.
- Commits au format Conventional Commits, en français : `feat(portefeuille): …`, `fix(auth): …`, `content(m12): …`.
- Ne jamais pousser sur `main`, ne jamais forcer un push, ne jamais modifier une migration déjà mergée.
- Ne commiter et ne pousser que sur demande explicite de l'utilisateur.

## Skills du projet (`.claude/skills/`)

| Skill | Quand |
|---|---|
| `nouveau-module` | Créer ou modifier un module de cours |
| `migration-supabase` | Tout changement de schéma, de RLS ou de fonction SQL |
| `livraison` | Préparer une release `develop` → `main` |
| `triage-bug` | Transformer un retour ou une alerte en issue exploitable, puis la corriger |
| `audit-securite` | Revue de sécurité d'une PR ou audit trimestriel |
| `test-de-charge` | Lancer et interpréter une campagne k6 |

## Pièges connus

- `next dev` refuse un second serveur sur le même dossier : utiliser un worktree pour lancer deux serveurs en parallèle.
- Les captures headless d'Edge ne descendent pas sous 504 px de large : pour un vrai rendu mobile, émuler le viewport via CDP.
- `glob("app/**/*.module.css")` ne trouve pas `app/admin/users/[id]/`, car les crochets forment une classe de caractères : utiliser `os.walk`.
- Les composants Recharts animés ne s'affichent pas en capture headless : `isAnimationActive={false}`.
