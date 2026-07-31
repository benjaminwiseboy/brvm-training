-- =============================================================
-- module_access_overrides ne pouvait pas être écrit : seul `select`
-- avait été accordé à `authenticated` dans la migration initiale, alors
-- que la policy "overrides: admin manage all" (for all) suppose
-- insert/update/delete possibles. Le GRANT Postgres est une barrière
-- distincte de la policy RLS ; sans lui, tout upsert/delete admin
-- échoue avec une erreur de permission avant même d'atteindre la RLS.
-- =============================================================

grant insert, update, delete on public.module_access_overrides to authenticated;
