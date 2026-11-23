#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# Compose passes this per-run password to the disposable PHP and MySQL services.
MYSQL_PASSWORD="$(openssl rand -hex 24)"
export MYSQL_PASSWORD

compose=(docker compose -f tests/compose.yml)
cleanup() {
  local status=$?
  if (( status != 0 )); then
    "${compose[@]}" logs php || true
  fi
  "${compose[@]}" down --volumes
}
trap cleanup EXIT

"${compose[@]}" up --build --wait --wait-timeout 180
npm run test:integration
