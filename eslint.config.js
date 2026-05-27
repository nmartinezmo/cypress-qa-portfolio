// @ts-check
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
/** @type {import('eslint-plugin-cypress')} */
const cypressPlugin = require('eslint-plugin-cypress');

export default [
  // Global ignore patterns
  {
    ignores: ['node_modules/**', 'reports/**', 'cypress/screenshots/**', 'cypress/videos/**'],
  },

  // TypeScript files — full type-checked rules
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        // Cypress globals (window, document, cy, Cypress, expect, etc.)
        cy: 'readonly',
        Cypress: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        after: 'readonly',
        afterEach: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        context: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      cypress: cypressPlugin,
    },
    rules: {
      // Base TS recommended
      ...tsPlugin.configs['recommended'].rules,
      ...tsPlugin.configs['recommended-requiring-type-checking'].rules,

      // Cypress rules
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/no-assigning-return-values': 'error',
      'cypress/no-async-tests': 'error',

      // Hard bans — align with CLAUDE.md quality bar
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',

      // Style
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  },

  // Config files — relax type-checked rules
  {
    files: ['*.config.ts', '*.config.js', 'eslint.config.js'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
];
