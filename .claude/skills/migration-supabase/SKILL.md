---
name: migration-supabase
description: Écrire, tester et déployer une migration Supabase (table, colonne, RLS, policy, fonction SQL, RPC) pour BRVM Learning, avec la checklist de sécurité RLS et la règle expand → contract. À utiliser dès qu'un changement touche supabase/migrations/ ou le schéma de la base.
---

# Migration Supabase

## 1. Créer le fichier

```bash
npx supabase migration new <description_en_snake_case>
```

**Jamais** modifier une migration déjà mergée dans `develop` : on en écrit une nouvelle.

## 2. Checklist de sécurité (obligatoire)

- [ ] Nouvelle table : `alter table … enable row level security;`
- [ ] Policies explicites, par opération. Modèle de la maison :
  ```sql
  create policy "<table>: select own" on public.<table> for select using (auth.uid() = user_id);
  create policy "<table>: admin select all" on public.<table> for select using (private.is_admin(auth.uid()));
  ```
- [ ] `grant` minimal à `authenticated`, rien à `anon` sauf besoin explicite.
- [ ] **Aucune** policy qui laisse un utilisateur modifier `profiles.role`, `payments` ou `module_access_overrides`.
- [ ] Fonction `security definer` : `set search_path = ''`, objets entièrement qualifiés (`public.x`), contrôle de `auth.uid()` à l'intérieur, puis :
  ```sql
  revoke execute on function public.f(<args>) from public, anon;
  grant execute on function public.f(<args>) to authenticated;   -- ou service_role pour un cron
  ```
- [ ] Une fonction utilitaire interne va dans le schéma `private` (non exposé par l'API).
- [ ] Une écriture qui doit être atomique (lire puis écrire) passe par une RPC, pas par deux appels client.

## 3. Compatibilité (expand → contract)

Vercel et `db-migrate.yml` démarrent en même temps : pendant quelques secondes, **l'ancien code tourne sur le nouveau schéma**.

- Ajout : colonne nullable ou avec valeur par défaut, nouvelle table. OK.
- Renommage ou suppression : en deux releases. 1) Ajouter le nouveau et faire écrire le code aux deux endroits. 2) Une fois en prod, retirer l'ancien.

## 4. Tester

- La CI applique toutes les migrations sur une base vierge (job « Migrations sur base vierge ») et lance `supabase db lint`.
- En local sans Docker : la migration peut être testée dans PGlite (déjà fait pour le portefeuille).
- Sur **dev** : merge dans `develop`, `db-migrate.yml` applique sur le projet dev, puis recette sur la preview.
- Ne **jamais** appliquer une migration à la main sur la prod (SQL editor) : cela désynchronise l'historique (voir `docs/ENVIRONMENTS.md` §4).

## 5. Documenter

Mettre à jour le schéma de `docs/ARCHITECTURE.md` §3 si une table apparaît ou disparaît. Commit `feat(db): …` ou `fix(db): …`.
