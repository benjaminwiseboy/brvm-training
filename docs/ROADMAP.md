# Roadmap — BRVM Learning

> Format *Now / Next / Later* : seul le « Now » est un engagement. Chaque ligne correspond à une issue GitHub rattachée à un **milestone**, et le board « BRVM Learning » en montre l'avancement. Revue mensuelle : on déplace, on coupe, on ajoute. Dernière revue : 27/11/2026.

## Cap produit

> Amener un débutant d'Afrique de l'Ouest ou de la diaspora **de zéro à son premier ordre en bourse**, avec une méthode d'analyse (Graham) qu'il sait appliquer seul. Indicateur Nord : **nombre d'apprenants qui terminent la Phase 3 « Passer à l'action » (M13)**, le moment où l'on passe un premier ordre.

## Now — décembre 2026 · milestone `v1.1 Fondations`

Rendre le produit fiable avant d'accélérer l'acquisition.

| Chantier | Pourquoi maintenant | Issue |
|---|---|---|
| Fondations SDLC : CI/CD, alertes, docs, audit (cette PR) | On ne peut pas grandir sans filet | PR `chore/sdlc-foundations` |
| Basculer les previews sur un projet Supabase **dev** | Les tests écrivent aujourd'hui dans la base des apprenants | [#6](https://github.com/benjaminwiseboy/brvm-training/issues/6) |
| Activer les protections GitHub (branches, secret scanning, signalement privé) | Dépôt public | [#7](https://github.com/benjaminwiseboy/brvm-training/issues/7) |
| Brancher les alertes Telegram et UptimeRobot | Le code est prêt, il manque le bot et les variables | [#8](https://github.com/benjaminwiseboy/brvm-training/issues/8) |
| Activer les migrations automatiques en prod | Fin des migrations appliquées à la main | [#9](https://github.com/benjaminwiseboy/brvm-training/issues/9) |
| Première campagne de charge (`load` + `stress`) sur dev | Connaître la capacité avant une campagne | [#10](https://github.com/benjaminwiseboy/brvm-training/issues/10) |

## Next — T1 2027

| Milestone | Chantier | Valeur | Issue |
|---|---|---|---|
| `v1.2 Portefeuille` | Merger le portefeuille virtuel (lots 1 et 2), appliquer la migration en prod | Application directe dès M13 : rétention | [#11](https://github.com/benjaminwiseboy/brvm-training/issues/11) |
| `v1.2 Portefeuille` | Lot 3 : dividendes, vue admin du portefeuille, récap hebdomadaire en push | Boucle d'engagement hebdomadaire | [#12](https://github.com/benjaminwiseboy/brvm-training/issues/12) |
| `v1.3 Confiance` | Vérifier **tous les chiffres réels** des modules (exemples SGBCI, Nestlé, PALMCI, taux IRVM, PER du marché) | Crédibilité, risque réglementaire | [#13](https://github.com/benjaminwiseboy/brvm-training/issues/13) |
| `v1.3 Confiance` | Tests de bout en bout (Playwright) : inscription → M01 → paywall → admin marque payé → M05 | Aucune régression sur le parcours qui rapporte | [#14](https://github.com/benjaminwiseboy/brvm-training/issues/14) |
| `v1.3 Confiance` | CSP stricte à nonces | Contenir une XSS éventuelle | [#15](https://github.com/benjaminwiseboy/brvm-training/issues/15) |
| `v1.3 Confiance` | Dead man's switch des crons (healthchecks.io) | Savoir qu'un cron ne tourne plus | [#16](https://github.com/benjaminwiseboy/brvm-training/issues/16) |
| `v1.4 Pilotage` | Analytics produit (respectueuses de la vie privée) : entonnoir landing → inscription → M04 → paiement → M13 → certificat | Décider avec des chiffres | [#17](https://github.com/benjaminwiseboy/brvm-training/issues/17) |

## Later — à arbitrer

| Idée | Question ouverte |
|---|---|
| Capital « vivant » qui fluctue entre les modules | Plus d'enjeu, ou plus de frustration ? |
| Coffre-fort outillé : tracker du portefeuille **réel**, calendrier des dividendes | Le manque n°1 relevé à l'audit de contenu, mais coûteux à maintenir (données BRVM) |
| Fiches « diversification concrète » et « sources au quotidien » | Contenu à rédiger |
| Paiement mobile money en ligne (Wave, Orange Money via un PSP) | Le paiement manuel via WhatsApp est un choix assumé (relation, confiance). À revoir au-delà d'environ 50 ventes par mois |
| Offre d'accompagnement intégrée à l'app | Dépend du modèle commercial |

## Ce qu'on ne fait pas (pour l'instant)

- Une piste « avancée » séparée : le parcours reste **unique et long**, c'est un choix de conception.
- Un classement entre apprenants dans le portefeuille virtuel : il pousserait à prendre trop de risques.
- Des applications natives : la PWA suffit.
