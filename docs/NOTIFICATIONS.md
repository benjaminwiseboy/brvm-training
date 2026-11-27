# Notifications push et crons

> Déplacé depuis l'ancien README (2026-11). Planification : `vercel.json`. Supervision : docs/OBSERVABILITY.md.

## Relance des inactifs

Relance les utilisateurs inactifs (paliers J+3/J+7/J+14, cf. `app/api/cron/reengagement`) via Web Push — uniquement pour les comptes ayant installé l'app en PWA et accepté les notifications (`components/pwa/NotificationPrompt.tsx`).

Variables à définir sur Vercel (Preview **et** Production, cf. `.env.local.example`) :

- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` — générées via `npx web-push generate-vapid-keys`. Ne jamais régénérer en prod sans réabonner tous les utilisateurs (les abonnements existants deviendraient invalides).
- `VAPID_SUBJECT` — email de contact (`mailto:...`), exigé par la spec Web Push.
- `CRON_SECRET` — vérifié par la route contre l'en-tête `Authorization` envoyé automatiquement par Vercel Cron (`vercel.json`, tous les jours à 9h).

Le palier redevient dû après un retour d'activité (`reengagement_notifications.last_activity_at`, migration `20260808133000_reengagement_reset_per_episode.sql`) — pas de blocage à vie. Les abonnements expirés/révoqués (erreur 404/410 du navigateur) sont automatiquement nettoyés de `push_subscriptions`.

### Rappel de série ("streak")

Distinct de la relance ci-dessus : `app/api/cron/streak-reminder`, tous les jours à 19h, notifie qui était actif hier mais ne l'a pas encore été aujourd'hui (« 🔥 Série de N jours — ne la casse pas »). `N` est calculé à la volée (`private.compute_streak_days`) à partir des jours calendaires actifs journalisés dans `daily_activity` à chaque sauvegarde de progression (`merge_user_progress`, migration `20260808140000_streak_reminders.sql`) — distinct du compteur `state.streak` existant (nombre de modules complétés, pas de jours).
