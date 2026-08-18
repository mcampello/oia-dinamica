#!/usr/bin/env bash
# Gera os ZIPs de download de cada grupo em downloads/ (links do README)
# e em web/public/downloads/ (servidos pela interface).
# Rode da raiz do repositório sempre que algum arquivo de grupo mudar.
set -euo pipefail
cd "$(dirname "$0")/.."

declare -a PASTAS=(
  "Grupo 1 — Pessoas:grupo-1-pessoas"
  "Grupo 2 — Financeiro:grupo-2-financeiro"
  "Grupo 3 — Jurídico:grupo-3-juridico"
  "Grupo 4 — Operações:grupo-4-operacoes"
)

mkdir -p downloads web/public/downloads

for par in "${PASTAS[@]}"; do
  pasta="${par%%:*}"
  slug="${par##*:}"
  rm -f "downloads/$slug.zip"
  zip -r -X "downloads/$slug.zip" "$pasta" -x "*.DS_Store"
  cp "downloads/$slug.zip" "web/public/downloads/$slug.zip"
  echo "gerado downloads/$slug.zip (+ web/public/downloads)"
done
