-- =============================================================
-- Rappel de série ("streak") — distinct des relances J+3/7/14
-- (win-back long terme) : ici, chaque jour, on notifie en fin de
-- journée quiconque était actif HIER mais ne l'a pas encore été
-- AUJOURD'HUI, pour préserver l'habitude — dès le lendemain du tout
-- premier jour d'activité, et tant que ce schéma se reproduit.
--
-- `daily_activity` journalise les jours calendaires actifs (un jour =
-- au moins un appel à `merge_user_progress`) — distinct du compteur
-- `state.streak` existant (lib/progress.ts), qui compte des MODULES
-- complétés, pas des jours : les deux notions coexistent sans lien.
-- `current_date` = fuseau du serveur Postgres (UTC sur Supabase) —
-- s'aligne naturellement sur le jour calendaire du public visé
-- (Abidjan/Dakar, UTC+0), pas de conversion de fuseau nécessaire.
-- =============================================================

create table public.daily_activity (
  user_id uuid not null references public.profiles(id) on delete cascade,
  activity_date date not null,
  primary key (user_id, activity_date)
);

alter table public.daily_activity enable row level security;
grant select, insert on public.daily_activity to authenticated;

create policy "daily_activity: select own" on public.daily_activity
  for select using (auth.uid() = user_id);
create policy "daily_activity: insert own" on public.daily_activity
  for insert with check (auth.uid() = user_id);

-- Journalise le jour courant à chaque sauvegarde de progression —
-- `security invoker` comme merge_user_progress, la policy "insert own"
-- ci-dessus suffit donc à autoriser l'écriture.
create or replace function public.merge_user_progress(p_state jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_existing jsonb;
  v_existing_completed jsonb;
  v_incoming_completed jsonb;
  v_merged_completed jsonb;
  v_key text;
  v_existing_score numeric;
  v_incoming_score numeric;
  v_existing_count int;
  v_incoming_count int;
  v_merged jsonb;
begin
  if v_user_id is null then
    raise exception 'merge_user_progress: not authenticated';
  end if;

  insert into public.daily_activity (user_id, activity_date)
  values (v_user_id, current_date)
  on conflict (user_id, activity_date) do nothing;

  select state into v_existing
  from public.user_progress
  where user_id = v_user_id
  for update;

  if v_existing is null then
    insert into public.user_progress (user_id, state) values (v_user_id, p_state)
    on conflict (user_id) do update set state = excluded.state;
    return p_state;
  end if;

  v_existing_completed := coalesce(v_existing->'completed', '{}'::jsonb);
  v_incoming_completed := coalesce(p_state->'completed', '{}'::jsonb);
  v_merged_completed := v_existing_completed;

  for v_key in select jsonb_object_keys(v_incoming_completed) loop
    v_incoming_score := (v_incoming_completed->v_key->>'score')::numeric;
    if v_existing_completed ? v_key then
      v_existing_score := (v_existing_completed->v_key->>'score')::numeric;
      if v_incoming_score > v_existing_score then
        v_merged_completed := jsonb_set(v_merged_completed, array[v_key], v_incoming_completed->v_key);
      end if;
    else
      v_merged_completed := v_merged_completed || jsonb_build_object(v_key, v_incoming_completed->v_key);
    end if;
  end loop;

  select count(*) into v_existing_count from jsonb_object_keys(v_existing_completed);
  select count(*) into v_incoming_count from jsonb_object_keys(v_incoming_completed);

  v_merged := jsonb_build_object(
    'onboarded', coalesce((v_existing->>'onboarded')::boolean, false) or coalesce((p_state->>'onboarded')::boolean, false),
    'capital', greatest(coalesce((v_existing->>'capital')::numeric, 0), coalesce((p_state->>'capital')::numeric, 0)),
    'streak', greatest(coalesce((v_existing->>'streak')::int, 0), coalesce((p_state->>'streak')::int, 0)),
    'completed', v_merged_completed,
    'unlockedResources', (
      select coalesce(jsonb_agg(distinct val), '[]'::jsonb)
      from (
        select jsonb_array_elements_text(coalesce(v_existing->'unlockedResources', '[]'::jsonb)) as val
        union
        select jsonb_array_elements_text(coalesce(p_state->'unlockedResources', '[]'::jsonb)) as val
      ) u
    ),
    'resume', case
      when v_existing_count > v_incoming_count then coalesce(v_existing->'resume', p_state->'resume')
      else coalesce(p_state->'resume', v_existing->'resume')
    end
  );

  update public.user_progress set state = v_merged where user_id = v_user_id;

  return v_merged;
end;
$$;

-- ── dédoublonnage cron : un seul rappel de série par jour et par user ──
create table public.streak_reminders_sent (
  user_id uuid not null references public.profiles(id) on delete cascade,
  reminder_date date not null,
  sent_at timestamptz not null default now(),
  primary key (user_id, reminder_date)
);
alter table public.streak_reminders_sent enable row level security;
-- Pas de policy : jamais accédé par un client, seul le service role (cron) y écrit.

-- ── longueur de la série de jours actifs consécutifs se terminant à p_as_of ──
-- Technique "gaps and islands" : `activity_date - row_number()` est constant
-- sur une plage de jours consécutifs, ce qui permet de compter d'un coup
-- tous les jours de l'îlot contenant p_as_of.
create or replace function private.compute_streak_days(p_user_id uuid, p_as_of date)
returns int
language sql stable set search_path = ''
as $$
  with days as (
    select activity_date,
           activity_date - (row_number() over (order by activity_date))::int as grp
    from public.daily_activity
    where user_id = p_user_id and activity_date <= p_as_of
  )
  select count(*)::int from days d
  where d.grp = (select grp from days where activity_date = p_as_of);
$$;

create or replace function public.get_users_due_for_streak_reminder()
returns table(user_id uuid, endpoint text, p256dh text, auth_key text, streak_days int)
language sql security definer set search_path = ''
as $$
  select ps.user_id, ps.endpoint, ps.p256dh, ps.auth,
         private.compute_streak_days(ps.user_id, current_date - 1)
  from public.push_subscriptions ps
  where exists (
    select 1 from public.daily_activity da
    where da.user_id = ps.user_id and da.activity_date = current_date - 1
  )
  and not exists (
    select 1 from public.daily_activity da2
    where da2.user_id = ps.user_id and da2.activity_date = current_date
  )
  and not exists (
    select 1 from public.streak_reminders_sent sr
    where sr.user_id = ps.user_id and sr.reminder_date = current_date
  );
$$;

revoke execute on function public.get_users_due_for_streak_reminder() from public, anon, authenticated;
grant execute on function public.get_users_due_for_streak_reminder() to service_role;
