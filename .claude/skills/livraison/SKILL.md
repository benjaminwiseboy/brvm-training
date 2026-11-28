---
name: livraison
description: Préparer et exécuter une mise en production de BRVM Learning (release develop → main) — inventaire des changements, vérifications pré-release, PR de release, suivi du déploiement, des migrations et du smoke test, tag et notes de version. À utiliser quand l'utilisateur veut « livrer », « mettre en prod », « faire une release ».
---

# Livraison en production

Chaque étape qui publie (PR, merge, tag) se fait **avec l'accord explicite de l'utilisateur**.

## 1. Inventaire

```bash
git fetch origin
git log --oneline origin/main..origin/develop
git diff --stat origin/main..origin/develop -- supabase/migrations/ .env.local.example vercel.json next.config.ts
```

Classer les changements : fonctionnalités, correctifs, contenu, migrations, nouvelles variables d'environnement, nouveaux crons.

## 2. Vérifications avant release

- [ ] CI verte sur le dernier commit de `develop` : `gh run list --branch develop --limit 5`
- [ ] La preview `develop` a été recettée par l'utilisateur sur les parcours critiques : inscription, M01, paywall M05, admin
- [ ] Migrations : compatibles avec le code de prod actuel (expand → contract) et déjà appliquées avec succès sur dev
- [ ] Nouvelles variables présentes sur Vercel en Production : `vercel env ls production`
- [ ] Nouveau cron : présent dans `vercel.json`, dans `ALWAYS_PUBLIC` et protégé par `isAuthorizedCron`
- [ ] Aucune issue P0 ou P1 ouverte sur des changements de cette release

## 3. PR de release

```bash
gh pr create --base main --head develop --title "release: AAAA-MM-JJ" --body "<PR incluses, migrations, variables>"
```

Après le merge (par l'utilisateur ou avec son accord) :

1. Vercel déploie la production.
2. `db-migrate.yml` attend l'**approbation** dans *Actions*, si la release contient des migrations et que `PROD_MIGRATIONS_ENABLED` est activé.
3. `smoke.yml` vérifie le déploiement ; un échec déclenche une alerte Telegram.

## 4. Après le déploiement

```bash
bash scripts/smoke.sh https://brvm-training.vercel.app
```

- Surveiller le canal Telegram pendant 30 minutes.
- Tag et release : `git tag vAAAA.MM.JJ origin/main`, `git push origin vAAAA.MM.JJ`, puis `gh release create vAAAA.MM.JJ --generate-notes`.
- Fermer le milestone s'il est terminé.

## 5. En cas de problème

- App cassée : Vercel → *Deployments* → déploiement précédent → *Promote to Production*.
- Migration en cause : écrire une migration corrective, sans revert manuel en base.
- Ouvrir une issue P0 ou P1 et rédiger le post-mortem dans l'issue.
