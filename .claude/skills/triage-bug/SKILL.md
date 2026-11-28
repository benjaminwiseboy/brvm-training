---
name: triage-bug
description: Transformer un retour d'apprenant, une capture, un message WhatsApp ou une alerte Telegram en issue GitHub exploitable (labels, priorité, reproduction), puis enquêter et corriger. À utiliser quand l'utilisateur signale un bug, colle une alerte ou demande de « consigner » un problème.
---

# Trier et traiter un bug

## 1. Qualifier

Extraire du signalement :

- **Environnement** : prod, dev ou local. Une alerte `[PRODUCTION]` vient de la prod.
- **Zone** : parcours, dashboard, coffre, portefeuille, auth, admin, landing, push, infra ou contenu.
- **Gravité**, selon `docs/WORKFLOW.md` §6 : P0 = tous bloqués ou perte de données ; P1 = fonction majeure (paywall, sauvegarde, inscription) ; P2 = contournable ; P3 = cosmétique.
- **Reproduction** : étapes, appareil et navigateur, compte gratuit ou payé.

**Données personnelles** : le dépôt est public. Retirer emails, téléphones, noms et identifiants d'utilisateur avant de créer l'issue. Si le signalement révèle une **faille de sécurité**, NE PAS créer d'issue : le dire à l'utilisateur et passer par un signalement privé (`SECURITY.md`).

## 2. Créer l'issue (avec l'accord de l'utilisateur)

Vérifier d'abord qu'elle n'existe pas déjà : `gh issue list --search "<mots-clés>" --state all`.

```bash
gh issue create --repo benjaminwiseboy/brvm-training \
  --title "[Bug] <symptôme en une ligne>" \
  --label "type:bug" --label "P1" --label "area:parcours" --label "env:prod" \
  --body "<environnement, étapes, attendu/obtenu, alerte Telegram collée (route, digest, commit)>"
```

## 3. Enquêter

- L'alerte serveur donne `route`, `digest` et `commit` : chercher la ligne de log dans Vercel (*Logs*, filtre sur la route et l'heure).
- Lire le code de la route (`app/<route>`) et la logique dans `lib/`.
- Écrire d'abord un **test qui reproduit** le bug (`lib/*.test.ts`) quand la logique est testable.

## 4. Corriger

Branche `fix/<sujet>` depuis `develop` (ou `hotfix/<sujet>` depuis `main` pour un P0), commit `fix(<zone>): …`, PR avec `Closes #N`. Une fois la correction en prod, vérifier que l'alerte ne revient plus.
