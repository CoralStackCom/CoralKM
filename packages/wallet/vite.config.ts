import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Use source ESM/TS from the workspace to avoid CJS dist named export issues
      '@coralkm/core': path.resolve(__dirname, '../core/src/index.ts'),
    },
  },
  optimizeDeps: {
    // Ensure linked deps still get pre-bundled when necessary
    include: ['@coralkm/core'],
  },
})
