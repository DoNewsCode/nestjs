import js from '@eslint/js';
import importlint from 'eslint-plugin-import';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  importlint.flatConfigs.errors,
  importlint.flatConfigs.warnings,
  importlint.flatConfigs.typescript,
  ...tseslint.configs.recommended,
  prettierRecommended,

  {
    name: 'custom-language-option',
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        project: 'tsconfig.json',
      },
    },
  },
  {
    name: 'custom-rule',
    rules: {
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',

      'no-console': 'off',

      // eslint-plugin-import
      'import/order': [
        'error',
        { 'newlines-between': 'always', alphabetize: { order: 'asc' } },
      ],
      'import/no-unresolved': ['off', { ignore: ['.*\\.js$'] }],

      //ECMAScript 6
      'prefer-const': 'error',
      'sort-imports': [
        'error',
        { ignoreDeclarationSort: true, ignoreCase: true },
      ],
    },
  },
  {
    name: 'global-ignore',
    ignores: [
      '**/.idea',
      '**/*.iml',
      '**/out',
      '**/gen',
      '**/dist',
      '**/node_modules/**',
    ],
  },
];
