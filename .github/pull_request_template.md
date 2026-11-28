## Quoi et pourquoi

<!-- Une ou deux phrases. Lier l'issue : « Closes #123 ». -->

## Comment vérifier

<!-- Étapes concrètes sur l'URL de preview. -->

## Checklist

- [ ] La CI est verte (lint, types, tests, build, migrations, sécurité)
- [ ] Testé sur la preview Vercel, y compris en mobile (390 px)
- [ ] Migration SQL ? Compatible avec le code actuellement en prod (expand → contract) et testée sur la base dev
- [ ] Nouvelle variable d'environnement ? Ajoutée à `.env.local.example`, Vercel (Preview **et** Production) et `docs/ENVIRONMENTS.md`
- [ ] Docs à jour si l'architecture ou une règle change (`docs/ARCHITECTURE.md`, `AGENTS.md`)
- [ ] Aucune donnée personnelle dans le code, les captures ou les fixtures
