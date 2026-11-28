# Observabilité et alertes

## 1. Ce qui est surveillé

| Signal | Capté par | Alerte Telegram | Gravité |
|---|---|---|---|
| Erreur serveur non rattrapée (page, Server Action, route API, proxy) | `instrumentation.ts` → `onRequestError` | oui | 🟠 error |
| Erreur JavaScript du navigateur, promesse rejetée, crash d'une page | `instrumentation-client.ts`, `app/error.tsx`, `app/global-error.tsx` → `POST /api/monitoring/client-error` | oui | 🟠 error |
| Cron en échec partiel (envois push ratés) | `lib/cron.ts::reportCronRun` | oui | 🟡 warning |
| Cron qui ne peut pas lire la base | `app/api/cron/streak-reminder` | oui | 🔴 critical |
| App ou base injoignable | UptimeRobot → `GET /api/health` toutes les 5 min | oui (intégration native UptimeRobot) | 🔴 |
| CI rouge sur `develop` ou `main` | `.github/workflows/ci.yml` | oui | 🟠 |
| Déploiement qui ne passe pas le smoke test | `.github/workflows/smoke.yml` | oui | 🔴 |
| Migration appliquée ou en échec | `.github/workflows/db-migrate.yml` | oui | 🔵 / 🔴 |
| Faille dans une dépendance | Dependabot, `npm audit` en CI, CodeQL | e-mail GitHub et CI rouge | — |

Chaque message est préfixé par l'environnement : `[PRODUCTION]`, `[PREVIEW]` ou `[LOCAL]`.

## 2. Comment ça marche

- **`lib/observability/format.ts`** contient la logique pure et testée : mise en forme HTML Telegram, filtres de bruit, et `AlertGate` (une même empreinte n'est notifiée qu'**une fois par 10 min** ; **20 alertes au plus par 10 min** et par instance).
- **`lib/observability/alert.ts`** gère l'envoi (timeout de 4 s) et **ne lève jamais d'exception** : une panne de Telegram ne doit pas casser l'app. Sans `TELEGRAM_BOT_TOKEN` ni `TELEGRAM_CHAT_ID`, l'alerte est seulement journalisée.
- **`lib/observability/log.ts`** écrit une ligne JSON par évènement (`level`, `event`, `env`, `sha`, `ts`…). Pour la retrouver : Vercel → *Logs*, puis filtrer par `event`.
- **Données personnelles** : les alertes ne contiennent **jamais** d'en-têtes (cookies), de query string (codes PKCE, `next=`), d'email ni d'état de progression. Seulement la route, la méthode, le message, le digest et le commit.
- **`/api/health`** renvoie 200 avec `{"status":"ok"}` si l'app répond **et** que la base répond ; sinon 503. La route est publique et ne divulgue aucun détail.

## 3. Mise en place (une fois)

### Bot Telegram

1. Dans Telegram, ouvrir **@BotFather** → `/newbot` → nom « BRVM Learning Alertes ». Copier le **token**.
2. Créer un groupe « BRVM alertes » (et, si possible, « BRVM alertes dev »), puis y ajouter le bot.
3. Envoyer un message dans le groupe, puis récupérer le `chat_id` (un nombre négatif) :

   ```bash
   curl -s "https://api.telegram.org/bot<TOKEN>/getUpdates" | grep -o '"chat":{"id":-[0-9]*'
   ```

4. Renseigner `TELEGRAM_BOT_TOKEN` et `TELEGRAM_CHAT_ID` dans Vercel (Production et Preview) et dans les secrets GitHub (voir [ENVIRONMENTS.md](ENVIRONMENTS.md) §3).
5. Tester depuis un poste :

   ```bash
   curl -s -X POST https://brvm-training.vercel.app/api/monitoring/client-error \
     -H "Content-Type: application/json" -d '{"message":"Test alerte","path":"/test"}'
   ```

### UptimeRobot (gratuit)

1. Créer un compte sur https://uptimerobot.com. *Integrations → Telegram* : suivre l'assistant, qui ajoute leur bot au groupe.
2. *New monitor* :
   - Type **Keyword**, URL `https://brvm-training.vercel.app/api/health`, mot-clé `"status":"ok"`, condition *alert if keyword NOT exists* ;
   - intervalle 5 min, contact : l'intégration Telegram.
3. Optionnel : un second monitor HTTP sur `https://brvm-training.vercel.app/`.

## 4. Runbook — que faire quand une alerte tombe

| Alerte | Premier geste | Ensuite |
|---|---|---|
| 🔴 `/api/health` DOWN | Ouvrir l'URL. Si c'est un 503 `database.ok=false`, consulter https://status.supabase.com et le dashboard Supabase (projet en pause ? quota ?) | Si c'est l'app qui est KO : Vercel → *Deployments* → *Promote* du déploiement précédent |
| 🔴 Smoke test en échec après déploiement | Lire le run GitHub (quelle route ?) | Rollback Vercel si la prod est touchée, puis issue P0/P1 |
| 🟠 Erreur serveur sur `<route>` | Vercel → *Logs*, filtrer sur la route et l'heure ; le `digest` relie l'alerte à la ligne de log | Issue `type:bug` avec l'alerte collée |
| 🟠 Erreur navigateur | Reproduire sur la même route et le même navigateur (user-agent dans l'alerte) | Issue, sauf s'il s'agit d'un bruit à ajouter à `isClientNoise` |
| 🟡 Cron en échec partiel | Souvent des abonnements push transitoirement KO ; le prochain passage réessaie | Si l'alerte revient tous les jours : issue `area:push` |
| 🔴 Migration en échec | La base est restée dans l'état précédent (chaque migration est transactionnelle) | Corriger dans une **nouvelle** migration |

Après un incident P0 ou P1 : écrire un court post-mortem dans l'issue (chronologie, cause, correctif, ce qui aurait permis de le détecter plus tôt).

## 5. Limites et prochaines étapes

- Le dédoublonnage est fait par instance serverless. Si le bruit devient gênant, passer à un compteur partagé (table Supabase ou Upstash).
- Pas de « dead man's switch » : un cron qui **ne tourne plus du tout** ne déclenche aucune alerte. Piste : un ping https://healthchecks.io à la fin de chaque cron.
- Pas de métriques produit (activation, rétention) : c'est un chantier analytics distinct, inscrit dans la roadmap.
