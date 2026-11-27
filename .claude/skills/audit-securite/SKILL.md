---
name: audit-securite
description: Revue de sécurité de BRVM Learning — d'une PR (RLS, Server Actions, routes publiques, secrets) ou audit complet trimestriel (dépendances, historique Git, en-têtes, Supabase). À utiliser pour « audit de sécurité », « est-ce que c'est sûr », ou avant de merger une PR qui touche à l'auth, aux paiements, à l'admin ou au schéma.
---

# Audit de sécurité

Référence : `docs/SECURITY-AUDIT.md` (constats passés et checklist §4). Le dépôt est **public** : ne jamais décrire une faille non corrigée dans une issue, un commit ou une PR publique. La signaler à l'utilisateur en privé.

## A. Revue d'une PR

```bash
git diff origin/develop...HEAD --stat
git diff origin/develop...HEAD -- supabase/ lib/actions/ app/api/ proxy.ts lib/supabase/
```

Pour chaque fichier sensible, appliquer la checklist §4 de `docs/SECURITY-AUDIT.md`. Points qui reviennent souvent :

- Une Server Action qui prend un `userId` en paramètre : `requireAdmin()` est-il appelé ?
- `createAdminClient()` utilisé avec une donnée venue du client.
- Une nouvelle route dans `ALWAYS_PUBLIC` : est-elle bornée (taille, débit) et muette sur ses erreurs ?
- Une migration sans `enable row level security`, ou une fonction `security definer` sans `revoke`.

## B. Audit complet (trimestriel)

1. Dépendances : `npm audit --omit=dev`, puis traiter les alertes Dependabot ouvertes.
2. Historique Git (secrets) : laisser tourner gitleaks en CI. En complément, chercher dans `git log --all -p` les motifs de JWT, de clés `sb_secret_`, de clés Resend `re_…` et de tokens de bot Telegram.
3. Inventaire des accès privilégiés : `grep -rn "createAdminClient\|security definer" app lib supabase`.
4. RLS : toutes les tables de `public` ont-elles la RLS ? Policies relues une par une.
5. En-têtes : `curl -sI https://brvm-training.vercel.app`, puis vérifier HSTS, CSP, X-Frame-Options, nosniff et Referrer-Policy.
6. Supabase (dashboard, à faire par l'utilisateur) : *Advisors → Security*, réglages Auth (confirmation d'email, longueur du mot de passe).
7. GitHub : onglet *Security* (CodeQL, secret scanning, Dependabot).
8. Rotation des secrets si un départ ou une fuite est suspecté : `CRON_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, token Telegram.

## C. Restituer

Mettre à jour `docs/SECURITY-AUDIT.md` : nouvelle date, tableau des constats (gravité, statut). Les constats **corrigés** peuvent être documentés publiquement ; les constats ouverts exploitables restent hors du dépôt jusqu'à leur correction.
