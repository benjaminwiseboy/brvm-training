-- =============================================================
-- Les relances de formation (migration précédente) ne se déclenchaient
-- qu'une fois par palier et par utilisateur, à vie : quelqu'un relancé à
-- J+3 qui revient puis redécroche plus tard n'était plus jamais recontacté
-- pour ce palier. On rend chaque palier réutilisable à chaque nouvel
-- épisode d'inactivité — un palier n'est bloquant que tant qu'aucune
-- activité n'est survenue depuis son dernier envoi.
--
-- `last_activity_at` fige la valeur de `user_progress.updated_at` au
-- moment de l'envoi : le palier redevient dû dès que `updated_at` a
-- avancé au-delà (= l'utilisateur est revenu, donc "nouvel épisode").
-- =============================================================

alter table public.reengagement_notifications
  add column last_activity_at timestamptz not null default 'epoch';

drop function if exists public.get_users_due_for_reengagement(int);

create function public.get_users_due_for_reengagement(p_tier_days int)
returns table(user_id uuid, endpoint text, p256dh text, auth_key text, last_activity_at timestamptz)
language sql security definer set search_path = ''
as $$
  select ps.user_id, ps.endpoint, ps.p256dh, ps.auth, up.updated_at
  from public.push_subscriptions ps
  join public.user_progress up on up.user_id = ps.user_id
  left join public.reengagement_notifications rn
    on rn.user_id = ps.user_id and rn.tier_days = p_tier_days
  where up.updated_at <= now() - (p_tier_days || ' days')::interval
    and (rn.user_id is null or rn.last_activity_at < up.updated_at);
$$;

revoke execute on function public.get_users_due_for_reengagement(int) from public, anon, authenticated;
grant execute on function public.get_users_due_for_reengagement(int) to service_role;
