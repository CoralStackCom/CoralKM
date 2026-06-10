#!/usr/bin/env bash
#
# Phase 0 naming guard (P0.2).
# Fails if any "coralstack" reference reappears in application/protocol source.
# The marketing site under docs/ references the website domain and is excluded.
set -euo pipefail

matches=$(grep -rIn \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude-dir=dist \
  --exclude-dir=.yarn \
  --exclude-dir=.wrangler \
  --exclude-dir=.expo \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --include="*.json" \
  --include="*.toml" \
  --include="*.sql" \
  "coralstack" packages/ || true)

if [ -n "$matches" ]; then
  echo "❌ Found 'coralstack' references in source. Use @coralkm / coralkm.com only."
  echo "$matches"
  exit 1
fi

echo "✅ Naming clean (no 'coralstack' in package source)."
