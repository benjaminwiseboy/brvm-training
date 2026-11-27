---
name: test-de-charge
description: Lancer et interpréter un test de montée en charge k6 de BRVM Learning (scénarios public-pages et progress-sync, profils smoke/load/stress/spike) sur l'environnement dev, puis consigner les résultats. À utiliser pour « test de charge », « combien d'utilisateurs on tient », « performance sous charge ».
---

# Test de charge

Référence complète : `docs/LOAD-TESTING.md`.

## Règle absolue

**Jamais contre la production.** Les scripts refusent les URL de prod (`loadtest/lib.js`), mais ce garde-fou ne dispense pas de vérifier soi-même la cible. Si l'environnement dev n'existe pas encore (issue « Basculer les previews… »), s'arrêter et le dire.

## Déroulé

1. Vérifier que le projet Supabase dev est réveillé (il se met en pause après 7 jours) : `curl <url-dev>/api/health` doit renvoyer `"status":"ok"`.
2. Toujours commencer par `smoke`. S'il échoue, corriger le script ou la configuration avant d'aller plus loin.
3. Puis `load`, puis `stress` (et `spike` avant une campagne marketing).
4. Via GitHub, sans installation : `gh workflow run "Test de charge" -f scenario=public-pages -f profile=smoke`, puis `gh run watch`, puis récupérer l'artefact `summary.json` avec `gh run download`.
5. En local (k6 installé) : voir les commandes de `docs/LOAD-TESTING.md` §3. Le scénario `progress-sync` demande d'abord `node loadtest/seed-users.mjs <N>`.

## Interpréter

- Seuils dépassés = test en échec. Indiquer **lequel** (p95 landing ? p99 merge ? taux d'erreur ?).
- Distinguer : 429 = limite de débit (Supabase Auth ou API), 5xx = saturation, timeouts = connexions Postgres épuisées.
- Donner le **VU maximum tenu sous les seuils** et le traduire en nombre d'apprenants simultanés.

## Consigner

Ajouter une ligne au journal (`docs/LOAD-TESTING.md` §5) : date, commit, scénario et profil, VU max, p95, taux d'erreur, goulot, notes. En cas de dégradation, créer une issue `type:perf`. Nettoyer ensuite les comptes de test : `node loadtest/seed-users.mjs --delete`.
