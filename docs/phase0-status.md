# Phase 0 — Implementation Status

Tracks `plan.md` (Phase 0: Foundation & Cleanup). ✅ = done in-repo · ⚙️ = needs an
external account / interactive tool / manual decision before it can complete.

## Done (in this change)

- ✅ **P0.2 Naming unification (🔴):** all protocol type-URIs and code references moved
  from `coralstack.com` → **`coralkm.com`** (`@coralkm/core` constants are the single
  source of truth). Package names were already `@coralkm/*`. Prose package references in
  `README.md` / `.github/copilot-instructions.md` / `docs/coralkm.md` updated. The
  marketing-site hosting config under `docs/` (`_config.yml`, site URL/email/GitHub org)
  is intentionally left as the real website domain.
- ✅ **Naming guard:** `scripts/check-naming.sh` (fails on any `coralstack` in package
  source) + root `yarn check-naming` script + a step in CI.
- ✅ **Toolchain:** `.nvmrc` = `22`; Node ≥22 + Yarn 4 (`packageManager`) already pinned.
- ✅ **D1 rollback convention (P0.5):** `packages/gateway/migrations/down/` with a matching
  `*.down.sql` for every up migration (0000/0001/0002) + `scripts/d1-rollback.sh`.
- ✅ **CI/CD scaffolding (P0.6):** `.github/workflows/ci.yml`
  (naming → typecheck → test → lint → build) and `.github/workflows/deploy.yml`
  (staging on `main`, production on `v*` tags with an approval environment).
- ✅ **EAS profiles:** `packages/wallet-mobile/eas.json` (development/preview/production).
- ✅ **Changesets:** `.changeset/config.json` + README.
- ✅ Root `yarn ci` aggregate script.

## Test baseline (P0.4)

Captured 2026-06-10 (all green after the rename):

| Package | Runner | Tests |
|---|---|---|
| `@coralkm/core` | Vitest | 14 |
| `@coralkm/gateway` | Vitest (workers pool) | 14 |
| `@coralkm/wallet-mobile` | Jest (jest-expo) | 104 |
| `@coralkm/wallet` (web) | — | typecheck clean |

Ratchet convention: coverage thresholds start at the current baseline and may not
decrease in a PR; crypto modules will be held to 90% in Phase 1.

## Requires manual / account setup (cannot be done from the repo alone)

- ⚙️ **Cloudflare environments (P0.5):** create `coralkm-dev/staging/prod` D1 databases
  (`wrangler d1 create …`), paste each `database_id` into `wrangler.toml` `env.staging` /
  `env.production` blocks, and add the production custom domain (for `did:web`).
- ⚙️ **Secrets:** `wrangler secret put …` for runtime secrets; GitHub repo secrets
  `CF_API_TOKEN` / `CF_ACCOUNT_ID`; a GitHub **production** Environment with Required
  reviewers (the approval gate `deploy.yml` expects).
- ⚙️ **Dev installs:** `yarn add -D @changesets/cli husky lint-staged`, then
  `yarn husky init` and a `.husky/pre-commit` running `lint-staged` + `check-naming`.
  (Needs network to install.)
- ⚙️ **Expo/EAS:** an Expo account to use `eas.json` profiles.

## Intentionally not applied (would destabilize the currently-green build)

- The plan's **Turborepo** switch, **ultra-strict `tsconfig.base`** flags
  (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, …), and a full **ESLint flat
  rewrite** with `recommendedTypeChecked` are deferred: applied as-is they introduce a
  large error surface across the existing code and would break `typecheck`/`test`. They
  should be adopted incrementally (per package, with the ratchet) rather than in one pass.
