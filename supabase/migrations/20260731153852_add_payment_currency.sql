-- =============================================================
-- Ajoute la devise du paiement (FCFA / EUR / USD) — l'admin doit pouvoir
-- indiquer le prix payé dans plusieurs devises, pas seulement FCFA.
-- =============================================================

alter table public.payments
  add column currency text not null default 'FCFA' check (currency in ('FCFA', 'EUR', 'USD'));
