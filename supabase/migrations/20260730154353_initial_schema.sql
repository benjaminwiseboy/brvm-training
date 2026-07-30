-- =============================================================
-- BRVM Learning — schéma initial (comptes + admin).
-- Tables profiles / user_progress / module_access_overrides, RLS +
-- policies, trigger d'auto-création de profil à l'inscription.
-- =============================================================

-- ── Schéma ──────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table public.user_progress (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.module_access_overrides (
  user_id uuid not null references public.profiles(id) on delete cascade,
  module_code text not null,
  blocked boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, module_code)
);

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.module_access_overrides enable row level security;

-- ── updated_at automatique ──────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger user_progress_set_updated_at
  before update on public.user_progress
  for each row execute function public.set_updated_at();

create trigger module_access_overrides_set_updated_at
  before update on public.module_access_overrides
  for each row execute function public.set_updated_at();

-- ── création auto du profil à l'inscription ─────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── check admin, sans récursion RLS (schéma privé, hors API) ────
create schema if not exists private;

create or replace function private.is_admin(uid uuid)
returns boolean
language sql security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = uid and role = 'admin'
  );
$$;

-- ── droits (RLS reste la vraie barrière) ─────────────────────────
grant select, update on public.profiles to authenticated;
grant select, insert, update on public.user_progress to authenticated;
grant select on public.module_access_overrides to authenticated;

-- ── policies : profiles ───────────────────────────────────────────
create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: admin select all" on public.profiles
  for select using (private.is_admin(auth.uid()));
-- Pas de policy insert/update sur `role` : promotion admin = SQL manuel (voir README).

-- ── policies : user_progress ──────────────────────────────────────
create policy "progress: select own" on public.user_progress
  for select using (auth.uid() = user_id);
create policy "progress: insert own" on public.user_progress
  for insert with check (auth.uid() = user_id);
create policy "progress: update own" on public.user_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "progress: admin select all" on public.user_progress
  for select using (private.is_admin(auth.uid()));

-- ── policies : module_access_overrides ────────────────────────────
create policy "overrides: select own" on public.module_access_overrides
  for select using (auth.uid() = user_id);
create policy "overrides: admin manage all" on public.module_access_overrides
  for all using (private.is_admin(auth.uid())) with check (private.is_admin(auth.uid()));
