import { applyD1Migrations, env } from 'cloudflare:test'

await applyD1Migrations(env.WALLET_GW_DB, env.TEST_MIGRATIONS)
