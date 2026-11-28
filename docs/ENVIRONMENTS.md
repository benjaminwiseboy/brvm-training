# Environnements — dev et production

## 1. Le modèle

| | **Dev** | **Production** |
|---|---|---|
| Sert à | Tester une fonctionnalité avant les vrais apprenants | Les apprenants |
| Branche | `develop`, et toute branche de PR (preview) | `main` |
| URL | `https://brvm-training-git-develop-wiseboy-s-projects.vercel.app` (protégée par Vercel) | `https://brvm-training.vercel.app` |
| Variables Vercel | portée **Preview** | portée **Production** |
| Supabase | `brvm-learning-dev` (réf. `ybvkmgnjlpfidqrfxhne`, Paris) | `BRVM Learning` (réf. `arokxyrimpyoiandwfpe`, Paris) |
| Données | fictives : comptes de test, comptes de charge `loadtest+N@brvm-learning.test` | réelles, personnelles : ne jamais les copier en dev |

> **Mis en place le 28/11/2026.** Avant cette date, Preview et Production partageaient la même base : chaque preview écrivait dans les données des vrais apprenants.

**Convention locale :** le dossier de travail `brvm-training/app` est relié (`supabase link`) au projet **dev**. Une commande `npx supabase …` touche donc la base de test par défaut ; viser la prod demande un `--project-ref arokxyrimpyoiandwfpe` explicite. Les migrations de prod passent de préférence par le workflow GitHub, avec approbation.

## 2. Variables d'environnement

| Variable | Dev (Preview) | Prod | Secrète | Rôle |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet dev | URL du projet prod | non | API Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé anon dev | clé anon prod | non (publique par conception, protégée par la RLS) | client navigateur |
| `SUPABASE_SERVICE_ROLE_KEY` | clé service dev | clé service prod | **oui** | contourne la RLS, uniquement côté serveur |
| `NEXT_PUBLIC_SITE_URL` | URL develop | URL prod | non | liens des emails (confirmation, reset) |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | **paire dédiée au dev** | paire prod (ne jamais régénérer) | privée : oui | Web Push |
| `VAPID_SUBJECT` | `mailto:` | `mailto:` | non | Web Push |
| `CRON_SECRET` | aléatoire | aléatoire, différent | **oui** | authentifie Vercel Cron |
| `TELEGRAM_BOT_TOKEN` | même bot | même bot | **oui** | alertes |
| `TELEGRAM_CHAT_ID` | groupe « BRVM alertes dev » (conseillé) | groupe « BRVM alertes » | non | alertes |

Toute nouvelle variable doit être ajoutée à trois endroits dans la même PR : `.env.local.example`, Vercel (Preview **et** Production), et le tableau ci-dessus.

## 3. Mettre en place l'environnement dev (une seule fois)

> ✅ **Fait le 28/11/2026** pour `brvm-learning-dev`. La procédure reste ici pour recréer l'environnement si besoin. Le câblage Vercel et GitHub (§3.2 et §3.3, hors secrets personnels) est automatisé par `node scripts/env/setup-dev-env.mjs <ref-dev>` : il restreint chaque variable partagée à la Production, sans en changer la valeur, puis crée la valeur Preview.

### 3.1 Créer le projet Supabase dev

1. Sur https://supabase.com/dashboard : **New project**, nom `brvm-learning-dev`, même région que la prod. Noter le mot de passe de la base.
2. *Project Settings → API* : noter l'URL, la clé `anon` et la clé `service_role`. Le *Reference ID* se trouve dans *Project Settings → General*.
3. *Authentication → URL Configuration* :
   - Site URL : `https://brvm-training-git-develop-wiseboy-s-projects.vercel.app`
   - Redirect URLs : `https://brvm-training-git-develop-wiseboy-s-projects.vercel.app/**`, `https://brvm-training-*-wiseboy-s-projects.vercel.app/**`, `http://localhost:3000/**`
4. Appliquer le schéma :

   ```bash
   npx supabase login
   npx supabase link --project-ref <REF_DEV>
   npx supabase db push
   ```

5. Créer un compte admin de test : s'inscrire sur l'URL dev, puis dans le SQL editor du projet **dev** :

   ```sql
   update public.profiles set role = 'admin' where email = '<email-de-test>';
   ```

### 3.2 Faire pointer les previews Vercel sur le dev

Remplacer les valeurs **Preview** (la Production n'est pas touchée) :

```bash
for v in NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY NEXT_PUBLIC_SITE_URL CRON_SECRET NEXT_PUBLIC_VAPID_PUBLIC_KEY VAPID_PRIVATE_KEY; do
  vercel env rm "$v" preview --yes
  vercel env add "$v" preview      # colle la valeur DEV quand la CLI la demande
done
vercel env add TELEGRAM_BOT_TOKEN preview
vercel env add TELEGRAM_CHAT_ID preview
vercel env add TELEGRAM_BOT_TOKEN production
vercel env add TELEGRAM_CHAT_ID production
```

Pour les clés VAPID dev : `npx web-push generate-vapid-keys`. Puis redéployer `develop` (un commit vide suffit) et vérifier :

```bash
bash scripts/smoke.sh https://brvm-training-git-develop-wiseboy-s-projects.vercel.app
```

Comme la preview est protégée, exporter d'abord `BYPASS=<secret>` (voir §3.3).

### 3.3 Configurer GitHub

*Settings → Environments* :

| Environnement | Secrets | Règles |
|---|---|---|
| `dev` | `SUPABASE_PROJECT_REF` (réf. dev), `SUPABASE_DB_PASSWORD` (dev), `DEV_SUPABASE_ANON_KEY`, `LOADTEST_PASSWORD` | aucune |
| `production` | `SUPABASE_PROJECT_REF` (réf. prod), `SUPABASE_DB_PASSWORD` (prod) | **Required reviewers** : vous ; branche `main` uniquement |

Secrets de dépôt (*Settings → Secrets and variables → Actions*) : `SUPABASE_ACCESS_TOKEN` (https://supabase.com/dashboard/account/tokens), `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `VERCEL_AUTOMATION_BYPASS_SECRET` (Vercel → *Settings → Deployment Protection → Protection Bypass for Automation*).

Variables de dépôt : `DEV_BASE_URL` (URL develop), `DEV_SUPABASE_URL`, `PROD_MIGRATIONS_ENABLED` (laisser **vide** tant que le §4 n'est pas fait).

## 4. Activer les migrations automatiques en prod

Jusqu'ici, les migrations de prod ont pu être appliquées à la main (SQL editor). Si l'historique `supabase_migrations.schema_migrations` est incomplet, `db push` tenterait de rejouer des migrations déjà présentes. Avant d'activer `PROD_MIGRATIONS_ENABLED=true` :

```bash
npx supabase link --project-ref <REF_PROD>
npx supabase migration list          # colonnes Local / Remote
```

- Les deux colonnes sont identiques : on peut activer.
- Une migration est présente en Local mais pas en Remote, alors qu'elle est **déjà appliquée** à la main : la marquer comme appliquée, sans l'exécuter, avec `npx supabase migration repair --status applied <version>`.
- Une migration est présente en Local, absente en Remote et **pas** appliquée (par exemple `20261016120000_portfolio.sql`) : la laisser, le workflow l'appliquera.

## 5. Règles

- **Ne jamais** brancher un poste local ou une preview sur la base de prod.
- **Ne jamais** copier de données de prod en dev. Si un bug exige des données réalistes, fabriquer un jeu de données fictif.
- Le projet Supabase gratuit est **mis en pause après 7 jours sans activité** : le réveiller depuis le dashboard avant une session de test.
