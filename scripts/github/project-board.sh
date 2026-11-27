#!/usr/bin/env bash
# Crée le board GitHub Projects « BRVM Learning » et y relie le dépôt.
# Prérequis (une fois) : gh auth refresh -s project
set -euo pipefail
OWNER="${OWNER:-benjaminwiseboy}"
REPO="${REPO:-brvm-training}"

NUMBER=$(gh project create --owner "$OWNER" --title "BRVM Learning" --format json --jq .number)
gh project link "$NUMBER" --owner "$OWNER" --repo "$OWNER/$REPO"

# Champ « Priorité » (le champ Status par défaut = Todo / In Progress / Done ;
# renommer/ajouter les colonnes Backlog · À faire · En cours · En revue ·
# Terminé dans l'interface : l'API ne permet pas d'éditer les options de Status).
gh project field-create "$NUMBER" --owner "$OWNER" --name "Priorité" --data-type SINGLE_SELECT \
  --single-select-options "P0,P1,P2,P3"

# Ajoute toutes les issues ouvertes existantes.
gh issue list --repo "$OWNER/$REPO" --state open --limit 200 --json url --jq '.[].url' |
  while read -r url; do gh project item-add "$NUMBER" --owner "$OWNER" --url "$url" >/dev/null; done

echo "Board créé : https://github.com/users/$OWNER/projects/$NUMBER"
echo "Dans Settings du board → Workflows : activer « Item added to project → Backlog »,"
echo "« Item closed → Done » et « Pull request merged → Done »."
