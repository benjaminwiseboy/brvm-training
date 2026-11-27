#!/usr/bin/env bash
# Smoke test d'un déploiement : ./scripts/smoke.sh https://brvm-training.vercel.app
# Variable optionnelle BYPASS = secret « Protection Bypass for Automation » de Vercel.
set -euo pipefail

BASE_URL="${1:?usage: scripts/smoke.sh <url>}"
BASE_URL="${BASE_URL%/}"
HEADERS=()
if [ -n "${BYPASS:-}" ]; then HEADERS=(-H "x-vercel-protection-bypass: ${BYPASS}"); fi

fail=0
check() { # check <chemin> <code attendu> [motif attendu dans le corps]
  local path="$1" expected="$2" pattern="${3:-}"
  local body code
  body=$(mktemp)
  code=$(curl -sS -o "$body" -w "%{http_code}" --max-time 20 "${HEADERS[@]}" "${BASE_URL}${path}" || echo "000")
  if [ "$code" != "$expected" ]; then
    echo "✗ ${path} → HTTP ${code} (attendu ${expected})"; fail=1
  elif [ -n "$pattern" ] && ! grep -q "$pattern" "$body"; then
    echo "✗ ${path} → motif « ${pattern} » absent"; fail=1
  else
    echo "✓ ${path} → ${code}"
  fi
  rm -f "$body"
}

check /api/health 200 '"status":"ok"'
check / 200 'BRVM'
check /login 200
check /signup 200
check /parcours 307            # non connecté → redirection vers /login
check /api/cron/reengagement 401  # sans secret → refusé

exit $fail
