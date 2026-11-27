---
name: nouveau-module
description: Créer, modifier ou renuméroter un module de cours BRVM Learning (content/modules/mXX.ts) en respectant le type Module, le registre des phases, le barème de gamification et les garde-fous de contenu. À utiliser pour toute modification de texte, slide, quiz, simulateur ou bilan d'un module.
---

# Créer ou modifier un module

## 1. Comprendre l'existant

- Type : `Module` dans `lib/types.ts` (hero, slides, challenge, feedback, next). Les blocs de slide et les types de défi (quiz, simulateur, diagnostic…) y sont tous définis.
- S'inspirer d'un module **du même type de défi** : `grep -l 'type: "simulator"' content/modules/*.ts`.
- Phases et ordre : `content/registry.ts` (`MODULES` et `PHASES`). La Phase 1 (`PHASES[0]`) est **gratuite** : ajouter un module à la Phase 1 change le paywall (`isFreeTrialModule`).

## 2. Règles de contenu

- **Vouvoiement**, langage clair de niveau « équilibré », nuances de risque conservées. Ne jamais promettre de rendement.
- **Une idée par slide**, qui explique le pourquoi **et** le comment : la formation est lue sans narration.
- **Chiffres réels** (cours, taux d'IRVM, PER, dividendes, exemples d'entreprises) : source datée en commentaire au-dessus du bloc, par exemple `// Source : BOC BRVM du 17/07/2026`. En cas de doute, le signaler à l'utilisateur au lieu d'inventer.
- **Barème** : `reward` suit le barème harmonisé (Phase 1 : +20 k, +30 k pour M03 ; malus −5 k, −10 k sur les modules durs). Ne pas inventer de nouvelle valeur sans demander.
- **Durée** : jamais saisie à la main, `lib/duration.ts` la calcule. Si le module devient trop long (plus de 16 min), le découper plutôt que d'accepter.
- Renvois entre modules : par code (`M12`), et vérifier qu'ils pointent vers le bon numéro après toute renumérotation.
- Glossaire : un terme technique nouveau va dans `content/glossaire.ts`, il devient alors cliquable dans les cours.

## 3. Vérifier

```bash
npm test          # validate.test.ts : validateAll sur les 28 modules
npm run build     # garde-fou final : un module mal formé casse le build
```

Puis vérifier le rendu : `npm run dev` → `/module/mXX`, en desktop et en 390 px. Parcourir l'intro, toutes les slides, le défi avec une bonne puis une mauvaise réponse, et le bilan.

## 4. Livrer

Branche `content/mXX-<sujet>`, commit `content(mXX): …`, PR vers `develop`. Pour une correction signalée par un apprenant, lier l'issue `type:content`.
