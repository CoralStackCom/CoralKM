import type { Env } from '../src/env'

// The `Env` interface is defined in `src/index.ts`. We can augment it here
declare module 'cloudflare:test' {
  interface ProvidedEnv extends Env {
    TEST_MIGRATIONS: D1Migration[] // Defined in `vitest.config.mts`
  }
}
