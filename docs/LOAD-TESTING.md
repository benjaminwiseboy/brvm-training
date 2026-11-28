# Tests de montée en charge

## 1. Pourquoi et quoi

La question à laquelle on répond : **combien d'apprenants simultanés la stack actuelle (Vercel + Supabase gratuit) encaisse-t-elle, et qu'est-ce qui casse en premier ?** Il faut le savoir avant une campagne d'acquisition : pub, post viral, partenariat.

| Scénario | Fichier | Ce qu'il simule | Ce qu'il stresse |
|---|---|---|---|
| Visiteurs anonymes | `loadtest/public-pages.js` | landing → inscription ou connexion → `/api/health` | Vercel (rendu serveur, proxy), sonde base |
| Apprenants connectés | `loadtest/progress-sync.js` | changements de slide → RPC `merge_user_progress` | **Postgres Supabase** : le goulot le plus probable (connexions, CPU du free tier) |

| Profil | Forme | Usage |
|---|---|---|
| `smoke` | 2 utilisateurs virtuels, 30 s | vérifier que le script tourne |
| `load` | montée à 20 VU, plateau de 3 min | trafic réaliste d'un lancement |
| `stress` | 50 → 100 → 150 VU | trouver le point de rupture |
| `spike` | 5 → 120 VU en 10 s | partage viral soudain |

Les utilisateurs virtuels marquent des pauses de 2 à 5 s. 20 VU représentent donc environ 20 personnes actives au même instant, soit plusieurs centaines d'inscrits connectés dans la journée.

**Seuils** (le test échoue s'ils sont dépassés) : moins de 1 % d'erreurs ; p95 < 1,2 s sur la landing ; p95 < 600 ms et p99 < 1,5 s sur `merge_user_progress`.

## 2. Règle absolue

**Jamais contre la production.** Les scripts refusent `brvm-training.vercel.app`, toute URL listée dans `PROD_URLS` et la référence Supabase `SUPABASE_PROD_REF`. On cible l'environnement **dev** ([ENVIRONMENTS.md](ENVIRONMENTS.md)), qui a la même configuration que la prod. Prévenir Vercel et Supabase n'est pas nécessaire à ces volumes, mais on évite d'enchaîner les `stress`.

## 3. Lancer un test

### Depuis GitHub (recommandé, rien à installer)

*Actions → Test de charge → Run workflow* : choisir le scénario et le profil. Le résumé (`summary.json`) est attaché au run.

Prérequis, une fois : environnement GitHub `dev` avec `DEV_SUPABASE_ANON_KEY` et `LOADTEST_PASSWORD`, variables `DEV_BASE_URL` et `DEV_SUPABASE_URL`, secret `VERCEL_AUTOMATION_BYPASS_SECRET`.

### En local

```bash
winget install k6 --source winget   # ou https://grafana.com/docs/k6/latest/set-up/install-k6/

# Scénario 1
k6 run -e BASE_URL=https://brvm-training-git-develop-wiseboy-s-projects.vercel.app \
       -e VERCEL_BYPASS=<secret> -e PROFILE=load loadtest/public-pages.js

# Scénario 2 : créer d'abord les comptes de test sur le projet DEV
SUPABASE_URL=https://<ref-dev>.supabase.co SUPABASE_DEV_REF=<ref-dev> \
SUPABASE_SERVICE_ROLE_KEY=<service-dev> LOADTEST_PASSWORD=<mdp> node loadtest/seed-users.mjs 50

k6 run -e SUPABASE_URL=https://<ref-dev>.supabase.co -e SUPABASE_ANON_KEY=<anon-dev> \
       -e LOADTEST_PASSWORD=<mdp> -e USERS=50 -e PROFILE=load loadtest/progress-sync.js

# Nettoyage
node loadtest/seed-users.mjs --delete    # mêmes variables
```

## 4. Lire les résultats

- `http_req_duration` p95 et p99 par tag (`page:landing`, `op:merge`…) : la latence vécue par les 5 % et 1 % les plus lents.
- `http_req_failed` : des 429 renvoyés par Supabase signalent une limite de débit ; des 5xx signalent une saturation.
- Pendant un `stress`, garder ouverts Supabase → *Reports* (CPU, connexions) et Vercel → *Observability*. Le premier à saturer est le goulot.

## 5. Journal des campagnes

Une ligne par campagne significative : on suit l'évolution de la capacité dans le temps.

| Date | Commit | Scénario / profil | VU max | p95 | Erreurs | Goulot observé | Notes |
|---|---|---|---|---|---|---|---|
| — | — | *première campagne à lancer une fois l'env dev en place* | | | | | |

## 6. Pistes si ça casse

| Symptôme | Piste |
|---|---|
| `merge_user_progress` lent ou en 5xx sous charge | Augmenter le debounce client (`lib/debounce.ts`) ; vérifier les index ; passer Supabase en plan Pro (compute) |
| Landing lente | Rendre la landing statique pour les visiteurs (aujourd'hui, le layout lit la session à chaque requête) |
| 429 sur `/auth/v1/token` | Limite de débit de Supabase Auth (normal, il s'agit d'une protection) : étaler les connexions dans `setup()` |
