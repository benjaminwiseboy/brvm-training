#!/usr/bin/env bash
# Crée / met à jour les labels du dépôt (idempotent). Usage : bash scripts/github/labels.sh
set -euo pipefail
REPO="${REPO:-benjaminwiseboy/brvm-training}"

label() { gh label create "$1" --repo "$REPO" --color "$2" --description "$3" --force >/dev/null && echo "✓ $1"; }

# Type
label "type:bug"      d73a4a "Quelque chose ne marche pas"
label "type:feature"  1d76db "Nouvelle fonctionnalité ou amélioration"
label "type:content"  5319e7 "Erreur ou amélioration du contenu pédagogique"
label "type:chore"    c5def5 "Maintenance, dépendances, outillage"
label "type:security" b60205 "Durcissement sécurité (jamais de faille exploitable en public)"
label "type:docs"     0075ca "Documentation"
label "type:perf"     fbca04 "Performance / montée en charge"

# Priorité
label "P0" b60205 "Critique : tous les apprenants bloqués ou perte de données — on lâche tout"
label "P1" d93f0b "Majeur : fonction importante cassée — dans la semaine"
label "P2" fbca04 "Mineur : gênant mais contournable — prochain sprint"
label "P3" c2e0c6 "Cosmétique / confort — quand on peut"

# Statut (complète les colonnes du board)
label "status:triage"  ededed "À qualifier (gravité, zone, reproductible ?)"
label "status:blocked" 000000 "Bloqué par une décision ou une dépendance externe"

# Zone
label "area:parcours"     0e8a16 "Modules, moteur, quiz, simulateurs"
label "area:dashboard"    0e8a16 "Tableau de bord, progression, statuts"
label "area:coffre"       0e8a16 "Coffre-fort (glossaire, SGI, plan, checklist)"
label "area:portefeuille" 0e8a16 "Portefeuille virtuel"
label "area:auth"         0e8a16 "Inscription, connexion, compte"
label "area:admin"        0e8a16 "Back-office"
label "area:landing"      0e8a16 "Page publique"
label "area:push"         0e8a16 "Notifications push, crons"
label "area:infra"        0e8a16 "CI/CD, environnements, observabilité"
label "area:contenu"      0e8a16 "Textes et chiffres des modules"

# Environnement où le bug a été vu
label "env:prod" e99695 "Constaté en production"
label "env:dev"  bfdadc "Constaté sur dev / preview"
