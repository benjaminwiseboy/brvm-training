# Workflow de développement

## 1. Cycle de vie d'un changement

```
Issue ─► branche depuis develop ─► PR vers develop ─► CI verte ─► test sur preview ─► merge
                                                                                     │
                     Production ◄─ merge ◄─ PR de release develop → main ◄───────────┘
```

1. **Issue d'abord.** Tout changement part d'une issue (bug, évolution ou contenu), avec un label de type, de zone et, pour un bug, de priorité. Seules exceptions : les coquilles et la maintenance de moins de 10 minutes.
2. **Branche** créée depuis `develop` : `feat/<sujet>`, `fix/<sujet>`, `chore/<sujet>`, `content/<module>`, `docs/<sujet>`.
3. **PR vers `develop`.** Remplir le template, lier l'issue (`Closes #N`). Une PR fait une seule chose.
4. **CI verte obligatoire** : lint, types, tests, build, migrations sur base vierge, `npm audit`, gitleaks, CodeQL.
5. **Recette sur la preview** (base dev), en mobile 390 px au minimum.
6. **Merge** en *squash*. Le titre de la PR devient le commit : il doit respecter la convention ci-dessous.

## 2. Branches

| Branche | Rôle | Protection |
|---|---|---|
| `main` | Ce qui tourne en production | PR obligatoire, CI verte, pas de push direct, pas de force-push |
| `develop` | Intégration, déployé en dev | PR obligatoire, CI verte |
| `feat/*`, `fix/*`… | Travail en cours | aucune ; supprimée après le merge |
| `hotfix/*` | Correctif urgent de prod | créée depuis `main`, PR vers `main`, puis `main` est remergée dans `develop` |

Les protections se règlent dans *Settings → Branches* (voir la commande en fin de document).

## 3. Messages de commit

[Conventional Commits](https://www.conventionalcommits.org/fr/), en français, comme l'historique existant :

```
feat(portefeuille): ordres à cours limité
fix(auth): le lien de reset ouvert sur un autre appareil
content(m12): corrige le PER moyen du marché
chore(deps): next 16.4.6
docs(architecture): ajoute le flux de paiement
```

Types : `feat`, `fix`, `content`, `refactor`, `perf`, `test`, `docs`, `chore`, `ci`, `security`.

## 4. Livrer en production

1. Ouvrir une PR `develop` → `main` intitulée `release: AAAA-MM-JJ`, qui liste les PR incluses.
2. Vérifier :
   - [ ] la preview `develop` a été testée sur les parcours critiques : inscription, M01, paywall, admin ;
   - [ ] les migrations de la release sont compatibles avec le code actuellement en prod (§5) ;
   - [ ] les nouvelles variables d'environnement sont présentes en Production sur Vercel.
3. Merger. Vercel déploie ; `db-migrate.yml` attend votre approbation pour la base prod ; `smoke.yml` vérifie le déploiement et alerte sur Telegram en cas d'échec.
4. Taguer : `git tag vAAAA.MM.JJ && git push --tags`, puis créer une *GitHub Release* avec les notes.

**Rollback :** Vercel → *Deployments* → le déploiement précédent → *Promote to Production* (environ 10 secondes). Une migration ne se « rollback » pas : on écrit une nouvelle migration qui corrige.

## 5. Migrations de base de données

- Un fichier par changement : `supabase/migrations/AAAAMMJJHHMMSS_description.sql`, généré avec `npx supabase migration new description`.
- **Jamais** modifier une migration déjà mergée dans `develop`.
- **Expand → contract** : Vercel et le workflow de migration démarrent en même temps, donc pendant quelques secondes l'ancien code tourne sur le nouveau schéma. On ajoute d'abord (colonne nullable, nouvelle table), on déploie le code, puis on retire l'ancien dans une release suivante.
- Toute nouvelle table : `enable row level security`, des policies explicites, des `grant` minimaux. Toute fonction `security definer` : `set search_path = ''` et `revoke execute … from public, anon`. Le skill `.claude/skills/migration-supabase` détaille la checklist.

## 6. Bugs et board

- **Signaler** : *New issue → 🐞 Bug*. Une alerte Telegram qui révèle un vrai problème devient une issue, avec le texte de l'alerte collé dedans.
- **Trier** (au moins une fois par semaine) : retirer `status:triage`, ajouter la priorité et la zone, placer la carte dans le board.

| Priorité | Définition | Délai |
|---|---|---|
| **P0** | Tous les apprenants bloqués, perte de données, faille | immédiat, en `hotfix/*` |
| **P1** | Fonction majeure cassée (paywall, sauvegarde, inscription) | dans la semaine |
| **P2** | Gênant mais contournable | prochain cycle |
| **P3** | Cosmétique | quand on peut |

- **Board** GitHub Projects « BRVM Learning » : colonnes *Backlog → À faire → En cours → En revue → Terminé*. Création : `bash scripts/github/project-board.sh`.
- Une **faille de sécurité** ne va **jamais** dans une issue publique : voir [SECURITY.md](../SECURITY.md).

## 7. Definition of Done

Un changement est terminé quand :

- [ ] la CI est verte ;
- [ ] il a été testé sur la preview, en mobile et en desktop ;
- [ ] les tests unitaires couvrent la logique nouvelle dans `lib/` ;
- [ ] la documentation est à jour : `ARCHITECTURE.md` en cas de changement de structure, `AGENTS.md` si une règle change, `ENVIRONMENTS.md` en cas de nouvelle variable ;
- [ ] l'issue est fermée par la PR.

## Annexe — protéger les branches

À lancer une fois par le propriétaire du dépôt :

```bash
for b in main develop; do
  gh api -X PUT "repos/benjaminwiseboy/brvm-training/branches/$b/protection" --input - <<JSON
{
  "required_status_checks": { "strict": true, "contexts": [
    "Lint · types · tests · build", "Migrations sur base vierge", "Dépendances · secrets", "analyze"
  ]},
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
done
```
