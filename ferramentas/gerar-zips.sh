#!/usr/bin/env bash
# Gera os ZIPs das bases de conhecimento em downloads/ (links do README)
# e em web/public/downloads/ (servidos pela interface), além de publicar
# separadamente o descritivo da vaga e os três currículos comuns aos grupos.
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
  arquivos=("$pasta"/*.md)

  if [[ "${#arquivos[@]}" -ne 4 ]]; then
    echo "erro: $pasta deve conter exatamente 4 documentos .md" >&2
    exit 1
  fi

  rm -f "downloads/$slug.zip"
  zip -X "downloads/$slug.zip" "${arquivos[@]}"
  cp "downloads/$slug.zip" "web/public/downloads/$slug.zip"
  echo "gerado downloads/$slug.zip (+ web/public/downloads)"
done

declare -a CURRICULOS=(
  "Curriculo-1-Rafael-DAvila.md"
  "Curriculo-2-Aline-Ferraz.md"
  "Curriculo-3-Juliana-Setubal.md"
)

# Remove o artefato legado, que reunia os três candidatos em um único arquivo.
rm -f \
  "downloads/Dinamica-Curriculos-dos-tres-finalistas.md" \
  "web/public/downloads/Dinamica-Curriculos-dos-tres-finalistas.md"

for curriculo in "${CURRICULOS[@]}"; do
  cp "Material comum/$curriculo" "downloads/$curriculo"
  cp "Material comum/$curriculo" "web/public/downloads/$curriculo"
  echo "gerado downloads/$curriculo (+ web/public/downloads)"
done

vaga="Descritivo-da-vaga-Head-de-Automacao-e-IA.md"
cp "Material comum/$vaga" "downloads/$vaga"
cp "Material comum/$vaga" "web/public/downloads/$vaga"
echo "gerado downloads/$vaga (+ web/public/downloads)"

regras="Regras-e-Estrategia-da-Vertice.md"
cp "Facilitador (não distribuir)/$regras" "web/public/downloads/$regras"
echo "gerado web/public/downloads/$regras"
