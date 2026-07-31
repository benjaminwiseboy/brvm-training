-- =============================================================
-- Fusion atomique de la progression, côté serveur — corrige un vrai risque
-- de perte de données : lib/store.tsx écrivait auparavant `state` en entier
-- via un simple upsert, sans lire l'existant. Un appareil resté ouvert avec
-- un état périmé (ex. téléphone laissé en arrière-plan pendant qu'on avance
-- sur un laptop) pouvait donc écraser silencieusement une progression plus
-- récente à la moindre interaction locale.
--
-- Règle : jamais de régression, par champ —
--   completed          : union, meilleur score conservé par code (même
--                         logique que applyCompletion côté client)
--   capital / streak    : le plus grand des deux
--   onboarded           : true dès que l'un des deux l'est
--   unlockedResources    : union
--   resume               : celui du côté ayant le plus de modules terminés
--                          (proxy de "le plus avancé")
--
-- `for update` verrouille la ligne le temps de la fusion : deux appels
-- presque simultanés (2 appareils) restent sérialisés proprement, pas de
-- course. `security invoker` (par défaut) : repose sur les policies RLS
-- existantes ("progress: insert/update own"), pas de contournement.
-- =============================================================

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

grant execute on function public.merge_user_progress(jsonb) to authenticated;
