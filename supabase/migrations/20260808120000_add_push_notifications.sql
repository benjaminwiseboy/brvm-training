-- =============================================================
-- Notifications push de relance ("reprends ta formation") — paliers
-- progressifs d'inactivité (J+3/J+7/J+14, cf. app/api/cron/reengagement).
--
-- `push_subscriptions` : un abonnement Push API par appareil (un même
-- utilisateur peut avoir plusieurs appareils/navigateurs, donc pas de
-- primary key sur user_id — seul `endpoint` est unique par nature).
--
-- `reengagement_notifications` : journal "palier déjà notifié" —
-- source de vérité anti-doublon pour le cron. Table privée : jamais
-- lue/écrite par un client, seul le service role (cron) y touche, donc
-- RLS activée sans aucune policy (deny-all pour anon/authenticated).
-- =============================================================

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

create table public.reengagement_notifications (
  user_id uuid not null references public.profiles(id) on delete cascade,
  tier_days int not null,
  sent_at timestamptz not null default now(),
  primary key (user_id, tier_days)
);

alter table public.push_subscriptions enable row level security;
alter table public.reengagement_notifications enable row level security;

grant select, insert, delete on public.push_subscriptions to authenticated;

create policy "push_subscriptions: select own" on public.push_subscriptions
  for select using (auth.uid() = user_id);
create policy "push_subscriptions: insert own" on public.push_subscriptions
  for insert with check (auth.uid() = user_id);
create policy "push_subscriptions: delete own" on public.push_subscriptions
  for delete using (auth.uid() = user_id);

-- ── requête du cron : utilisateurs dus pour un palier de relance ────
-- `security definer` pour lire au travers de push_subscriptions/
-- user_progress/reengagement_notifications indépendamment de la RLS
-- (le cron n'a pas de session utilisateur). Exposée en RPC (schéma
-- public, requis par PostgREST) mais verrouillée au service role :
-- un utilisateur authentifié normal ne doit jamais pouvoir lister les
-- abonnements push d'un tiers.
create or replace function public.get_users_due_for_reengagement(p_tier_days int)
returns table(user_id uuid, endpoint text, p256dh text, auth_key text)
language sql security definer set search_path = ''
as $$
  select ps.user_id, ps.endpoint, ps.p256dh, ps.auth
  from public.push_subscriptions ps
  join public.user_progress up on up.user_id = ps.user_id
  where up.updated_at <= now() - (p_tier_days || ' days')::interval
    and not exists (
      select 1 from public.reengagement_notifications rn
      where rn.user_id = ps.user_id and rn.tier_days = p_tier_days
    );
$$;

revoke execute on function public.get_users_due_for_reengagement(int) from public, anon, authenticated;
grant execute on function public.get_users_due_for_reengagement(int) to service_role;
