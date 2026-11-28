# Audit de sécurité — novembre 2026

> Périmètre : branche `develop` au 27/11/2026, plus une relecture de la migration du portefeuille virtuel (branche `feat/portefeuille-virtuel`, non mergée). Méthode : revue de code (autorisation, RLS, entrées utilisateur, secrets), `npm audit`, recherche de secrets dans tout l'historique Git (le dépôt est **public**), test des corrections sur un build de production local.
>
> À refaire : à chaque nouvelle table ou route API (checklist §4), et entièrement une fois par trimestre (skill `.claude/skills/audit-securite`).

## 1. Synthèse

| # | Constat | Gravité | Statut |
|---|---|---|---|
| S1 | Next.js 16.2.11 touché par 16 avis de sécurité, dont plusieurs RCE non authentifiées (Image Optimization, `next/og`), du cache poisoning et un DoS via Server Actions | **Critique** | ✅ Corrigé : Next 16.4.6, `npm audit` à 0 |
| S2 | Les previews Vercel utilisaient la base de **production** : n'importe quelle branche de test lisait et écrivait les données réelles | **Élevée** | ✅ Corrigé le 28/11/2026 : projet Supabase dev dédié, variables Vercel Preview séparées de la Production (vérifié dans le bundle de la preview) |
| S3 | Authentification des crons : si `CRON_SECRET` manquait, l'en-tête littéral `Bearer undefined` était accepté, et n'importe qui pouvait déclencher l'envoi de notifications push | Moyenne | ✅ Corrigé : `lib/cron.ts` échoue fermé, comparaison à temps constant, tests |
| S4 | Inscription : la reprise de la progression locale (client service-role) **écrasait** une progression existante. En ré-inscrivant l'email d'un compte non confirmé, un tiers pouvait remplacer son état | Faible | 🟡 Atténué : migration seulement si ce `signUp` vient de créer le compte (`identities` non vide, créé il y a moins de 60 s), jamais par-dessus une progression existante. **Risque résiduel accepté** : quelqu'un qui inscrit en premier l'email d'un tiers peut pré-remplir une progression fictive dans ce compte non confirmé. Impact limité au score et à la progression de la phase gratuite : pas d'accès aux données, pas de contournement du paiement. Correctif complet prévu : migrer la progression **après** confirmation, avec la session de l'utilisateur (RPC `merge_user_progress`), quand `lib/store.tsx` aura été stabilisé par le merge du portefeuille |
| S5 | Aucun en-tête de sécurité : pas de HSTS ni d'anti-clickjacking, `X-Powered-By` exposé | Faible | ✅ Corrigé : `next.config.ts` (HSTS, `frame-ancestors 'none'`, nosniff, Referrer-Policy, Permissions-Policy) |
| S6 | Pas de CSP sur les scripts (`script-src`) : une XSS éventuelle ne serait pas contenue | Faible (durcissement) | 📋 Roadmap : CSP à nonces |
| S7 | Aucune détection automatique : pas de CodeQL, de Dependabot, d'audit de dépendances ni de recherche de secrets | Moyenne (processus) | ✅ Corrigé : `ci.yml`, `codeql.yml`, `dependabot.yml` |
| S9 | (Revue de cette PR) La route publique `/api/monitoring/client-error` partageait le budget d'alertes du serveur : l'inonder pouvait masquer une vraie panne. Le workflow de charge acceptait une URL libre et y envoyait le secret de contournement Vercel | Moyenne | ✅ Corrigé : budgets séparés (client : 5 par 10 min) et alertes critiques hors plafond ; cible de charge fixée par une variable de dépôt |
| S8 | Pas de canal de signalement privé | Faible (processus) | ✅ `SECURITY.md`, template d'issue qui y redirige ; activer *Private vulnerability reporting* dans les réglages |

## 2. Ce qui est déjà solide

- **RLS activée sur toutes les tables**, policies « own » + admin via `private.is_admin` (schéma non exposé, `security definer`, `search_path` vide).
- **Pas d'escalade de rôle** : aucune policy d'update sur `profiles`, la promotion admin se fait en SQL manuel.
- **Paywall côté serveur** (`app/module/[code]/page.tsx`) à partir de `payments`, table dont seul l'admin a l'écriture. Modifier son propre `user_progress` ne débloque **pas** les modules payants.
- **Défense en profondeur sur l'admin** : layout serveur, puis `requireAdmin()` dans chaque Server Action, puis RLS.
- **Redirections ouvertes neutralisées** : `sanitizeNextPath` (`//evil.com`, `/\evil.com`) sur le login et `/auth/confirm`.
- **Pas d'énumération de comptes** sur le reset de mot de passe.
- **Client service-role** protégé par `import "server-only"`, ce qui fait échouer le build s'il est importé côté client.
- **Fonctions des crons** réservées à `service_role` (`revoke … from public, anon, authenticated`).
- **Historique Git propre** : aucun JWT, aucune clé `service_role`, aucun secret VAPID, Resend ou Telegram trouvé dans les commits ; `.env*` est ignoré.
- **Migration du portefeuille (WIP)** : RLS sur les 7 tables, écritures uniquement via des RPC `security definer` qui relisent elles-mêmes cash et positions, `EXECUTE` resserré, `portfolio_market_close` réservé à `service_role`. ⚠️ Son cron `market-close` utilise encore l'ancienne comparaison du secret : passer à `isAuthorizedCron` au moment du merge.

## 3. Actions restantes (propriétaire du dépôt)

1. ~~Basculer les previews sur le projet Supabase dev (S2).~~ Fait le 28/11/2026.
2. *Settings → Code security* : activer **Private vulnerability reporting**, **Dependabot alerts**, **Secret scanning** et **Push protection**.
3. Protéger `main` et `develop` ([WORKFLOW.md](WORKFLOW.md), annexe).
4. Supabase prod → *Authentication* : longueur minimale du mot de passe ≥ 8 (alignée sur l'app), confirmation d'email obligatoire, limites de débit par défaut conservées.
5. Supabase prod → *Advisors* (Security et Performance) : traiter les éventuels avertissements.
6. Renouveler `CRON_SECRET` en prod. Le secret actuel n'a pas fuité, mais il a été créé avant le passage à une comparaison stricte, et la rotation est une bonne hygiène.

## 4. Checklist pour chaque PR sensible

- [ ] **Nouvelle table** : `enable row level security`, policies explicites (select/insert/update/delete), `grant` minimal.
- [ ] **Fonction `security definer`** : `set search_path = ''`, `revoke execute … from public, anon`, vérification de `auth.uid()` à l'intérieur.
- [ ] **Server Action** : contrôle d'authentification et d'autorisation **dans** l'action (jamais seulement dans le proxy) ; entrées revalidées côté serveur.
- [ ] **Route API publique** : ajoutée à `ALWAYS_PUBLIC` en connaissance de cause ; taille d'entrée bornée ; aucun détail d'erreur dans la réponse.
- [ ] **Client service-role** : justifié en commentaire ; jamais avec un identifiant venu du client sans vérification.
- [ ] **Redirection** : `sanitizeNextPath`.
- [ ] **Secrets** : uniquement dans Vercel ou GitHub, jamais dans le code ni dans une capture.
- [ ] **Logs et alertes** : aucune donnée personnelle (email, téléphone, état de progression).

## 5. Comment relancer l'audit

```bash
npm audit --omit=dev                     # dépendances
npx tsc --noEmit && npm run lint && npm test
grep -rn "createAdminClient" app lib     # chaque usage doit être justifié
grep -n "create policy\|security definer\|grant " supabase/migrations/*.sql
```

Plus : CodeQL (onglet Security), l'onglet Advisors de Supabase et le skill `audit-securite` pour la revue guidée.
