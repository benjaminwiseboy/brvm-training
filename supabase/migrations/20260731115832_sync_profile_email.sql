-- =============================================================
-- profiles.email n'est écrit qu'une fois, à l'inscription (trigger
-- handle_new_user). Sans ce trigger, un changement d'email via
-- lib/actions/auth.ts::updateEmail (supabase.auth.updateUser) mettrait à
-- jour auth.users.email mais laisserait profiles.email périmé — visible
-- notamment dans la liste admin (app/admin/page.tsx).
-- =============================================================

create or replace function public.handle_user_email_change()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row execute function public.handle_user_email_change();
