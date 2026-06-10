# 08 — Phase 0 Build Plan: Foundation & Cleanup

> خطة بناء تنفيذية كاملة لـ Phase 0. كل الـ configs جاهزة للنسخ. كل task إله Acceptance Criteria.
> **المدة:** 1–2 أسبوع · **الهدف:** أرضية نظيفة قبل ما نبني قلب الـ crypto (Phase 1).
> **مصمَّمة بحيث:** تنفّذها يدوي أو تطعميها لـ Replit Agent task-by-task.

---

## 0. الهدف و Definition of Done

Phase 0 خلصت لما **كل** هاي تتحقق:

```
[ ] Toolchain موحّد: Node ≥22 + Yarn 4 (corepack) شغّالين على كل جهاز/CI
[ ] التسمية موحّدة: @coralkm/* في كل مكان + domain واحد لكل type URIs
[ ] لا import أو type-URI فيه coralstack بعد اليوم
[ ] Lint + Format + Typecheck بيمرّوا أخضر على كل الـ 4 packages
[ ] Test runner شغّال لكل package + تقرير coverage baseline موجود
[ ] 3 بيئات Cloudflare (dev/staging/prod) + D1 منفصلة لكل وحدة
[ ] D1 migrations منظّمة + اتفاقية rollback موثّقة وشغّالة
[ ] CI pipeline أخضر على كل PR (lint→typecheck→test→build)
[ ] CD: staging تلقائي على main، prod بموافقة يدوية
[ ] Secrets خارج الكود (Wrangler secrets + GitHub secrets)
[ ] Pre-commit hooks + changesets + EAS profiles مهيّأة
```

> **القاعدة:** ما في كود crypto بهالمرحلة. Phase 0 = بنية تحتية + تنظيف فقط.

---

## 1. Tech Requirements — الـ Toolchain الكامل

كل اللي بدّك تثبّته/تهيّئه لتبني Phase 0:

| الأداة                              | الإصدار           | الدور                                  | ملاحظة حرجة                       |
| ----------------------------------- | ----------------- | -------------------------------------- | --------------------------------- |
| **Node.js**                         | ≥ 22 LTS          | الـ runtime                            | ثبّت عبر nvm/volta                |
| **Yarn**                            | 4.x (stable)      | package manager + workspaces           | عبر `corepack` — مش npm install   |
| **TypeScript**                      | 5.x               | اللغة                                  | strict mode إجباري                |
| **ESLint**                          | 9.x (flat config) | linting                                | `eslint.config.js` مش `.eslintrc` |
| **Prettier**                        | 3.x               | formatting                             | متكامل مع ESLint                  |
| **Vitest**                          | latest            | اختبار core + gateway                  |                                   |
| **@cloudflare/vitest-pool-workers** | latest            | اختبار Worker جوّا بيئة Workers حقيقية | بديل Miniflare اليدوي             |
| **Jest + jest-expo**                | latest            | اختبار الموبايل                        | preset jest-expo                  |
| **Wrangler**                        | latest            | نشر/تشغيل Cloudflare                   | pin latest، بيتغيّر بسرعة         |
| **Turborepo**                       | latest            | task runner + caching للـ monorepo     | اختياري لكن موصى به بشدة          |
| **Changesets** (`@changesets/cli`)  | latest            | versioning البروتوكول/الـ packages     | يربط INF-8                        |
| **Husky + lint-staged**             | latest            | pre-commit hooks                       | يمنع كود وسخ يدخل                 |
| **EAS CLI** (`eas-cli`)             | latest            | build/submit الموبايل                  | تهيئة الـ profiles بس بهالمرحلة   |
| **GitHub Actions**                  | —                 | CI/CD                                  | أو أي CI بتفضّله                  |

**حسابات/أسرار لازمة:**

- Cloudflare account + API Token (بصلاحيات Workers/D1/DO) + Account ID.
- Expo account (للـ EAS profiles).
- GitHub repo + GitHub Environments (للـ approval gates).

---

## 2. الهيكل المستهدف بعد Phase 0

```
coralkm/
├── .github/
│   └── workflows/
│       ├── ci.yml                  # lint + typecheck + test + build
│       └── deploy.yml              # staging (auto) + prod (manual)
├── .changeset/                     # changesets config + entries
├── .husky/                         # pre-commit hooks
├── packages/
│   ├── core/                       # @coralkm/core
│   │   ├── src/
│   │   │   └── coralkm-protocol/
│   │   │       ├── constants.ts    # ★ PROTOCOL_BASE_URI (single source of truth)
│   │   │       ├── types.ts
│   │   │       └── coralkm-protocol-handler.ts
│   │   ├── vitest.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json            # name: @coralkm/core
│   ├── gateway/                    # @coralkm/gateway
│   │   ├── src/
│   │   ├── migrations/             # ★ D1 migrations (مرقّمة + down/)
│   │   │   ├── 0001_init.sql
│   │   │   └── down/0001_init.down.sql
│   │   ├── wrangler.toml           # ★ dev/staging/prod environments
│   │   ├── vitest.config.ts        # @cloudflare/vitest-pool-workers
│   │   └── package.json            # name: @coralkm/gateway
│   ├── wallet/                     # @coralkm/wallet (web — Vite)
│   │   └── package.json
│   └── wallet-mobile/              # @coralkm/wallet-mobile (Expo)
│       ├── eas.json                # ★ build profiles
│       ├── jest.config.js
│       └── package.json            # name: @coralkm/wallet-mobile
├── scripts/
│   ├── d1-rollback.sh              # ★ اتفاقية rollback
│   └── check-naming.sh             # يمنع رجوع coralstack
├── .nvmrc                          # 22
├── .yarnrc.yml                     # nodeLinker: node-modules
├── .prettierrc
├── eslint.config.js                # root flat config
├── tsconfig.base.json              # ★ base config يرثوه الكل
├── turbo.json                      # task pipeline
└── package.json                    # root: workspaces + scripts
```

---

## 3. المهام (Tasks)

### ▸ P0.1 — Toolchain & Workspace Bootstrap

**الهدف:** Node + Yarn 4 + TS base موحّدين عبر الـ monorepo.

**الخطوات:**

1. ثبّت الإصدارات:

```bash
# .nvmrc
echo "22" > .nvmrc
nvm install && nvm use

# Yarn 4 عبر corepack (مش npm i -g yarn)
corepack enable
yarn set version stable        # يحط .yarn/releases + يحدّث packageManager
```

2. `.yarnrc.yml` — **مهم:** node-modules linker (Expo/RN ما بيحبّوا PnP):

```yaml
nodeLinker: node-modules
enableGlobalCache: true
```

3. Root `package.json`:

```json
{
  "name": "coralkm",
  "private": true,
  "packageManager": "yarn@4.x.x",
  "engines": { "node": ">=22" },
  "workspaces": ["packages/*"],
  "scripts": {
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "build": "turbo run build",
    "ci": "turbo run lint typecheck test build"
  }
}
```

4. `tsconfig.base.json` (يرثوه كل package):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "sourceMap": true
  }
}
```

5. كل package `tsconfig.json` بيمتد منه:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist" },
  "include": ["src"]
}
```

**Acceptance:** `yarn install --immutable` بينجح · `yarn workspaces list` بيطلع 4 packages · `node -v` ≥22 على CI والمحلي.

---

### ▸ P0.2 — Naming Unification (يحل G6 / INF-9 / CORE-8) 🔴

**الهدف:** صفر `coralstack` بالكود. domain واحد لكل البروتوكول.

**قرار لازم تاخده أول شي:** اختَر الـ canonical domain. **التوصية: `coralkm.com`** (يطابق scope الـ packages). كل الـ type URIs بتصير `https://coralkm.com/coralkm/0.1/...`.

**الخطوات:**

1. **Single source of truth** للـ type URIs — `packages/core/src/coralkm-protocol/constants.ts`:

```typescript
export const PROTOCOL_VERSION = '0.1'
export const PROTOCOL_BASE_URI = `https://coralkm.com/coralkm/${PROTOCOL_VERSION}` as const

export const CoralKMV01MessageTypes = {
  NAMESPACE_REQUEST: `${PROTOCOL_BASE_URI}/namespace-request`,
  NAMESPACE_GRANT: `${PROTOCOL_BASE_URI}/namespace-grant`,
  NAMESPACE_DENY: `${PROTOCOL_BASE_URI}/namespace-deny`,
  NAMESPACE_SYNC: `${PROTOCOL_BASE_URI}/namespace-sync`,
  NAMESPACE_SYNC_RESPONSE: `${PROTOCOL_BASE_URI}/namespace-sync-response`,
  GUARDIAN_REQUEST: `${PROTOCOL_BASE_URI}/guardian-request`,
  GUARDIAN_GRANT: `${PROTOCOL_BASE_URI}/guardian-grant`,
  GUARDIAN_DENY: `${PROTOCOL_BASE_URI}/guardian-deny`,
  GUARDIAN_SHARE_UPDATE: `${PROTOCOL_BASE_URI}/guardian-share-update`,
  GUARDIAN_SHARE_UPDATE_CONFIRM: `${PROTOCOL_BASE_URI}/guardian-share-update-confirm`,
  GUARDIAN_REMOVE: `${PROTOCOL_BASE_URI}/guardian-remove`,
  GUARDIAN_REMOVE_CONFIRM: `${PROTOCOL_BASE_URI}/guardian-remove-confirm`,
  NAMESPACE_RECOVERY_REQUEST: `${PROTOCOL_BASE_URI}/namespace-recovery-request`,
  GUARDIAN_VERIFICATION_CHALLENGE: `${PROTOCOL_BASE_URI}/guardian-verification-challenge`,
  GUARDIAN_VERIFICATION_CHALLENGE_RESPONSE: `${PROTOCOL_BASE_URI}/guardian-verification-challenge-response`,
  GUARDIAN_RELEASE_SHARE: `${PROTOCOL_BASE_URI}/guardian-release-share`,
} as const
```

> **مهم:** أي مكان بالكود بيكتب الـ URI يدوي → بدّله ليستورد من هون. صفر hardcoded strings.

2. وحّد أسماء الـ packages بكل `package.json` → `@coralkm/core|gateway|wallet|wallet-mobile`، وحدّث كل الـ imports.

3. سكربت حارس `scripts/check-naming.sh` (يمنع رجوع coralstack):

```bash
#!/usr/bin/env bash
set -euo pipefail
if grep -rIn --exclude-dir={node_modules,.git,dist,.yarn} "coralstack" .; then
  echo "❌ Found 'coralstack' references. Use @coralkm / coralkm.com only."
  exit 1
fi
echo "✅ Naming clean."
```

4. ضيفه لـ CI (خطوة مستقلة).

**Acceptance:** `bash scripts/check-naming.sh` بيمرّ · كل type URI بييجي من `constants.ts` · `yarn build` بينجح بالأسماء الجديدة · أي رسالة DIDComm بتطلع بالـ domain الموحّد.

---

### ▸ P0.3 — Lint / Format / Typecheck Baseline

**الهدف:** جودة موحّدة + بوابة تمنع الانحدار.

**الخطوات:**

1. `eslint.config.js` (flat, ESLint 9):

```javascript
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: { parserOptions: { projectService: true } },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      'no-console': ['warn', { allow: ['error', 'warn'] }], // أساس لمنع تسريب logs لاحقاً
    },
  },
  { ignores: ['**/dist/**', '**/.yarn/**', '**/node_modules/**'] },
  prettier
)
```

2. `.prettierrc`:

```json
{ "semi": true, "singleQuote": false, "printWidth": 100, "trailingComma": "all" }
```

3. ضيف لكل package سكربتات:

```json
{
  "scripts": {
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "build": "tsc -p tsconfig.json"
  }
}
```

4. `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "lint": { "outputs": [] },
    "typecheck": { "dependsOn": ["^build"], "outputs": [] },
    "test": { "dependsOn": ["^build"], "outputs": ["coverage/**"] },
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] }
  }
}
```

**Acceptance:** `yarn lint` + `yarn typecheck` أخضر على الـ 4 packages · Prettier موحّد · لا أخطاء TS strict.

---

### ▸ P0.4 — Testing Baseline + Coverage

**الهدف:** نعرف وين واقفين بالتغطية، ونجهّز البنية للـ crypto tests بـ Phase 1.

**الخطوات:**

1. **core** — `packages/core/vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      // ابدأ من الواقع، ورفّعها بالـ ratchet. crypto بيوصل 90% بـ Phase 1.
      thresholds: { lines: 0, functions: 0, branches: 0, statements: 0 },
    },
  },
})
```

2. **gateway** — `packages/gateway/vitest.config.ts` (بيئة Workers حقيقية):

```typescript
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config'
export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: { wrangler: { configPath: './wrangler.toml' } },
    },
    coverage: { provider: 'v8', reporter: ['text', 'json-summary'] },
  },
})
```

3. **mobile** — `packages/wallet-mobile/jest.config.js`:

```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverage: true,
  coverageReporters: ['text', 'json-summary'],
}
```

4. اكتب **smoke test واحد** لكل package (يتأكد الـ runner شغّال) — مثلاً يستورد `constants.ts` ويتأكد الـ URI صح.

5. شغّل وخزّن الـ baseline:

```bash
yarn test  # خزّن أرقام التغطية الحالية بملف docs/coverage-baseline.md
```

**Acceptance:** `yarn test` بيشتغل لكل package بلا فشل بنية · تقرير coverage موجود · ملف baseline متوثّق · gateway tests بتشتغل جوّا Workers runtime.

> **اتفاقية الـ ratchet:** thresholds تبدأ من الـ baseline الحالي، وكل PR ممنوع ينزّلها. الـ crypto modules رح تتفرض عليها 90% بـ Phase 1.

---

### ▸ P0.5 — Cloudflare Environments + D1 Migrations + Rollback (INF-1/INF-2/INF-3)

**الهدف:** 3 بيئات معزولة + migrations منظّمة + rollback شغّال.

**الخطوات:**

1. أنشئ 3 D1 databases:

```bash
wrangler d1 create coralkm-dev
wrangler d1 create coralkm-staging
wrangler d1 create coralkm-prod
# خزّن الـ database_id لكل وحدة
```

2. `packages/gateway/wrangler.toml`:

```toml
name = "coralkm-gateway"
main = "src/index.ts"
compatibility_date = "2026-01-01"
compatibility_flags = ["nodejs_compat"]

# ── Durable Object (WebSocket hub) ──
[[durable_objects.bindings]]
name = "WS_HUB"
class_name = "WebSocketsHub"

[[migrations]]
tag = "v1"
new_classes = ["WebSocketsHub"]

# ── Cron (cleanup TTL — يتفعّل بـ Phase 2) ──
[triggers]
crons = ["0 * * * *"]

# ── dev (default) ──
[[d1_databases]]
binding = "DB"
database_name = "coralkm-dev"
database_id = "<dev-id>"
migrations_dir = "migrations"

# ── staging ──
[env.staging]
[[env.staging.d1_databases]]
binding = "DB"
database_name = "coralkm-staging"
database_id = "<staging-id>"
migrations_dir = "migrations"
[[env.staging.durable_objects.bindings]]
name = "WS_HUB"
class_name = "WebSocketsHub"

# ── production ──
[env.production]
route = { pattern = "gateway.coralkm.com", custom_domain = true }  # DID:web يحتاج domain ثابت
[[env.production.d1_databases]]
binding = "DB"
database_name = "coralkm-prod"
database_id = "<prod-id>"
migrations_dir = "migrations"
[[env.production.durable_objects.bindings]]
name = "WS_HUB"
class_name = "WebSocketsHub"
```

3. نظّم الـ migrations مع اتفاقية **down** (D1 ما عنده down-migrations native — لهيك نعمل اتفاقية يدوية):

```
migrations/
├── 0001_init.sql              # up
└── down/
    └── 0001_init.down.sql     # rollback يدوي مقابل
```

الـ `0001_init.sql` بيعرّف كل جداول Veramo + CoralKM (identifiers, keys, private-keys, services, messages, mediation_policies, mediations, namespace_policies, namespaces, guardian_policies, guardian_shares, recovery_requests).

4. سكربت `scripts/d1-rollback.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
ENV="${1:?usage: d1-rollback.sh <staging|production> <NNNN>}"
NUM="${2:?migration number e.g. 0001}"
DOWN="packages/gateway/migrations/down/${NUM}_*.down.sql"
echo "⚠️  Rolling back ${NUM} on ${ENV}"
wrangler d1 execute coralkm-${ENV} --env "${ENV}" --file ${DOWN} --remote
echo "✅ Rolled back. تذكّر تحدّث جدول التتبّع يدوياً إذا لزم."
```

5. طبّق:

```bash
wrangler d1 migrations apply coralkm-dev --local      # local dev
wrangler d1 migrations apply coralkm-staging --env staging --remote
```

**Acceptance:** الـ 3 DBs موجودة ومعزولة · `migrations apply` بينجح على dev+staging · `d1-rollback.sh staging 0001` بيرجع الـ schema بنجاح · `wrangler deploy --env staging --dry-run` بيمرّ.

---

### ▸ P0.6 — CI/CD + Secrets + Hooks + Changesets + EAS

**الهدف:** أتمتة كاملة + بوابات أمان + versioning.

**الخطوات:**

1. **CI** — `.github/workflows/ci.yml`:

```yaml
name: CI
on: [pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: corepack enable
      - run: yarn install --immutable
      - run: bash scripts/check-naming.sh
      - run: yarn lint
      - run: yarn typecheck
      - run: yarn test
      - run: yarn build
```

2. **CD** — `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]          # → staging تلقائي
    tags: ["v*"]              # → production بموافقة
jobs:
  staging:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: corepack enable && yarn install --immutable
      - run: yarn build
      - run: yarn wrangler d1 migrations apply coralkm-staging --env staging --remote
        working-directory: packages/gateway
      - run: yarn wrangler deploy --env staging
        working-directory: packages/gateway
        env: { CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }} }

  production:
    if: startsWith(github.ref, 'refs/tags/v')
    runs-on: ubuntu-latest
    environment: production      # ★ فعّل Required reviewers على هالـ environment بـ GitHub
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: corepack enable && yarn install --immutable
      - run: yarn build
      - run: yarn wrangler d1 migrations apply coralkm-prod --env production --remote
        working-directory: packages/gateway
      - run: yarn wrangler deploy --env production
        working-directory: packages/gateway
        env: { CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }} }
```

3. **Secrets** — لا أسرار بالكود:

```bash
# Cloudflare runtime secrets (مفاتيح gateway DID لاحقاً)
wrangler secret put GATEWAY_DID_SEED --env staging
# GitHub: Settings → Secrets → CF_API_TOKEN, CF_ACCOUNT_ID
# GitHub Environments: production → Required reviewers (approval gate)
```

4. **Pre-commit** — Husky + lint-staged:

```bash
yarn add -D husky lint-staged
yarn husky init
# .husky/pre-commit:
echo 'yarn lint-staged && bash scripts/check-naming.sh' > .husky/pre-commit
```

```json
// package.json
{ "lint-staged": { "*.{ts,tsx}": ["eslint --fix", "prettier --write"] } }
```

5. **Changesets** (versioning البروتوكول/الـ packages — INF-8):

```bash
yarn add -D @changesets/cli
yarn changeset init
# كل تغيير بروتوكول/package → yarn changeset (يولّد changelog + bump)
```

6. **EAS profiles** — `packages/wallet-mobile/eas.json` (تهيئة فقط، الـ builds لاحقاً):

```json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal", "channel": "preview" },
    "production": { "channel": "production", "autoIncrement": true }
  },
  "submit": { "production": {} }
}
```

**Acceptance:** PR بيشغّل CI كامل أخضر · merge على main بينشر staging تلقائي · tag `v*` بيوقف عند موافقة قبل prod · pre-commit بيرفض كود وسخ/coralstack · `yarn changeset` شغّال · `eas.json` صالح.

---

## 4. ترتيب التنفيذ (Build Sequence)

```
يوم 1–2:  P0.1 (toolchain) → P0.3 (lint/format/typecheck)
يوم 3–4:  P0.2 (naming unification — أهم تنظيف) + check-naming حارس
يوم 5–6:  P0.4 (testing baseline + coverage)
يوم 7–9:  P0.5 (Cloudflare envs + D1 migrations + rollback)
يوم 10:   P0.6 (CI/CD + secrets + hooks + changesets + EAS)
يوم 11–14: buffer + تثبيت + توثيق + تشغيل DoD checklist كامل
```

اعتماد: P0.1 يحجب الكل · P0.2 لازم قبل ما يتراكم كود جديد فوق الأسماء القديمة · P0.5 و P0.6 ممكن يتوازوا جزئياً.

---

## 5. Phase 0 — Final Checklist (انسخها للـ PR description)

```
TOOLCHAIN
[ ] Node ≥22 + Yarn 4 (corepack) + packageManager pinned
[ ] tsconfig.base strict + كل package بيرثه
[ ] yarn install --immutable ينجح، 4 workspaces

NAMING (G6)
[ ] @coralkm/* في كل package.json + كل الـ imports
[ ] PROTOCOL_BASE_URI single source of truth بـ constants.ts
[ ] check-naming.sh أخضر (صفر coralstack)

QUALITY GATES
[ ] eslint flat config + prettier موحّدين
[ ] yarn lint + yarn typecheck أخضر × 4 packages
[ ] no-console rule مفعّلة (أساس منع تسريب logs)

TESTING
[ ] vitest (core) + vitest-pool-workers (gateway) + jest-expo (mobile)
[ ] smoke test لكل package
[ ] coverage baseline متوثّق + ratchet convention

CLOUDFLARE / DATA
[ ] 3 D1 DBs (dev/staging/prod) معزولة
[ ] wrangler.toml بـ env.staging + env.production + DO + cron
[ ] migrations مرقّمة + down/ + d1-rollback.sh شغّال
[ ] custom domain للـ prod (DID:web)

CI/CD / OPS
[ ] ci.yml: naming→lint→typecheck→test→build
[ ] deploy.yml: staging auto + prod بموافقة (Required reviewers)
[ ] secrets خارج الكود (wrangler + GitHub)
[ ] husky + lint-staged + changesets + eas.json
```

---

## 6. التسليم لـ Phase 1

لما Phase 0 تخلص، بتكون جاهز تبدأ **Phase 1 (Production Crypto Core)** على أرضية:

- أسماء وURIs موحّدة → الـ crypto code ما بيتلخبط.
- CI بيمسك أي regression بالـ crypto فوراً.
- بيئة staging معزولة لتجريب الـ recovery بأمان.
- coverage gates جاهزة لفرض 90% على الـ crypto modules.

**أول task بـ Phase 1:** `CORE-1` (استبدال الكود الثابت `"123456"`) — شوف `04-development-plan.md §1`.
