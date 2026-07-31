-- =============================================================
-- Admin — paiement et notes internes, pour la fiche utilisateur.
-- Même pattern que module_access_overrides : RLS + policy "admin
-- manage all" via private.is_admin(), grants explicites (le GRANT
-- Postgres est une barrière distincte de la policy RLS).
-- =============================================================

create table public.payments (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  status text not null default 'unpaid' check (status in ('paid','unpaid')),
  amount integer,
  method text,
  paid_at timestamptz,
  updated_at timestamptz not null default now()
);

-- Notes internes support client (§4.3.3 cahier de charge) — jamais
-- visibles côté apprenant, pas de policy "select own".
create table public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  author_email text,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.payments enable row level security;
alter table public.admin_notes enable row level security;

create trigger payments_set_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

grant select, insert, update, delete on public.payments to authenticated;
grant select, insert, delete on public.admin_notes to authenticated;

create policy "payments: select own" on public.payments
  for select using (auth.uid() = user_id);
create policy "payments: admin manage all" on public.payments
  for all using (private.is_admin(auth.uid())) with check (private.is_admin(auth.uid()));

create policy "admin_notes: admin manage all" on public.admin_notes
  for all using (private.is_admin(auth.uid())) with check (private.is_admin(auth.uid()));
