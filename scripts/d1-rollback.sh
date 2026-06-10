#!/usr/bin/env bash
#
# Phase 0 D1 rollback convention (P0.5).
# D1 has no native down-migrations, so each up migration has a matching file
# under packages/gateway/migrations/down/. This applies one of them.
#
# Usage: scripts/d1-rollback.sh <dev|staging|production> <NNNN>
#   e.g. scripts/d1-rollback.sh staging 0002
set -euo pipefail

ENV="${1:?usage: d1-rollback.sh <dev|staging|production> <NNNN>}"
NUM="${2:?migration number, e.g. 0002}"

DOWN_GLOB="packages/gateway/migrations/down/${NUM}_*.down.sql"
DOWN_FILE=$(ls ${DOWN_GLOB} 2>/dev/null | head -1 || true)
if [ -z "${DOWN_FILE}" ]; then
  echo "❌ No down migration matching ${DOWN_GLOB}"
  exit 1
fi

echo "⚠️  Rolling back ${NUM} on ${ENV} using ${DOWN_FILE}"
if [ "${ENV}" = "dev" ]; then
  ( cd packages/gateway && yarn wrangler d1 execute wallet-gateway-db --local --file "../../${DOWN_FILE}" )
else
  ( cd packages/gateway && yarn wrangler d1 execute wallet-gateway-db --env "${ENV}" --remote --file "../../${DOWN_FILE}" )
fi
echo "✅ Rolled back ${NUM} on ${ENV}. Update the migration tracking table manually if needed."
