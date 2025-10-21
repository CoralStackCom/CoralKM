import { defineWorkersConfig, readD1Migrations } from '@cloudflare/vitest-pool-workers/config'
import path from 'node:path'

export default defineWorkersConfig(async () => {
  // Read all migrations in the `migrations` directory
  const migrationsPath = path.join(__dirname, './migrations')
  const migrations = await readD1Migrations(migrationsPath)

  return {
    test: {
      // Show console output during tests (false)
      silent: false,
      // Apply D1 migrations before running tests
      setupFiles: ['./test/vitest-setup.ts'],
      globals: true,
      poolOptions: {
        workers: {
          wrangler: { configPath: './wrangler.toml' },
          miniflare: {
            d1Databases: { WALLET_GW_DB: 'Wallet_Gateway_DB' },
            // Add a test-only binding for migrations, so we can apply them in a
            // setup file
            bindings: {
              TEST_MIGRATIONS: migrations,
            },
          },
        },
      },
      server: {
        deps: {
          // Ensure Vite processes these packages so aliases are applied inside them
          inline: [/@veramo\/utils/, /ethers/, /@veramo\/key-manager/],
        },
      },
    },
    resolve: {
      alias: {
        ethers: path.resolve(__dirname, './test/shims/ethers.ts'),
        '@coralkm/core': path.resolve(__dirname, './test/shims/coralkm-core.ts'),
      },
    },
  }
})
