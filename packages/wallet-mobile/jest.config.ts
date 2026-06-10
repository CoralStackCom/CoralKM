import type { Config } from 'jest'

const config: Config = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@shopify/react-native-skia|@noble/.*|@scure/.*)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFiles: ['<rootDir>/__tests__/setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup-after-env.ts'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  collectCoverageFrom: [
    'providers/**/*.{ts,tsx}',
    'utils/**/*.{ts,tsx}',
    '!**/*.interfaces.ts',
    '!**/*.styles.ts',
    '!**/index.ts',
  ],
}

export default config
