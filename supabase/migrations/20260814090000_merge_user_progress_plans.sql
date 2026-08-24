-- Plans d'investissement personnels dans la progression synchronisée.
--
-- `merge_user_progress` reconstruit l'état avec `jsonb_build_object` : toute
-- clé qu'il ne connaît pas est silencieusement perdue à la première écriture.
-- La nouvelle clé `plans` (cf. lib/plan.ts) doit donc y être ajoutée
-- explicitement, sinon un apprenant qui rédige son plan sur son téléphone le
-- verrait disparaître dès la synchro suivante.
--
-- Règle de fusion, identique à `mergePlans()` côté client : union PAR
-- IDENTIFIANT, en gardant la version dont `updatedAt` est le plus récent.
-- Ni « le dernier qui écrit gagne » : un appareil resté ouvert avec un état
-- périmé écraserait une version plus récente. Les suppressions voyagent sous
-- forme de pierres tombales (`deletedAt`, cf. lib/plan.ts) plutôt que par
-- absence de la ligne : une ligne absente d'un côté et présente de l'autre
-- est indiscernable d'un plan créé ailleurs, et une union la ressusciterait
-- à chaque synchro.
--
-- Le reste de la fonction est repris à l'identique de
-- 20260731165330_merge_user_progress_rpc.sql.

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
  v_merged_plans jsonb;
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

  -- Plans : on empile les deux listes, on ne garde par `id` que la ligne au
  -- `updatedAt` le plus récent (départage stable par `ord` si deux versions
  -- portent le même horodatage, pour que le résultat soit déterministe).
  with candidats as (
    select
      plan->>'id'                              as plan_id,
      coalesce(plan->>'updatedAt', '')         as updated_at,
      plan,
      ord
    from (
      select jsonb_array_elements(coalesce(v_existing->'plans', '[]'::jsonb)) as plan, 0 as ord
      union all
      select jsonb_array_elements(coalesce(p_state->'plans', '[]'::jsonb)) as plan, 1 as ord
    ) tous
    where plan->>'id' is not null
  ),
  gagnants as (
    select distinct on (plan_id) plan
    from candidats
    -- À horodatage égal, la suppression l'emporte : mêmes règles que
    -- `wins()` dans lib/plan.ts, pour que client et serveur ne divergent pas.
    order by plan_id, updated_at desc, (plan->>'deletedAt' is not null) desc, ord desc
  )
  select coalesce(jsonb_agg(plan), '[]'::jsonb) into v_merged_plans from gagnants;

  v_merged := jsonb_build_object(
    'onboarded', coalesce((v_existing->>'onboarded')::boolean, false) or coalesce((p_state->>'onboarded')::boolean, false),
    'capital', greatest(coalesce((v_existing->>'capital')::numeric, 0), coalesce((p_state->>'capital')::numeric, 0)),
    'streak', greatest(coalesce((v_existing->>'streak')::int, 0), coalesce((p_state->>'streak')::int, 0)),
    'completed', v_merged_completed,
    'plans', v_merged_plans,
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
