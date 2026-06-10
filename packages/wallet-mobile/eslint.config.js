// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Prevent raw console usage — use structured logger instead
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Discourage explicit any
      '@typescript-eslint/no-explicit-any': 'warn',
      // Require return types on exported functions
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // No unused variables (error on vars, warn on args prefixed with _)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
]);
