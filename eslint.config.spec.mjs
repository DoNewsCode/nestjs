import rootLint from './eslint.config.mjs';

export default [
  ...rootLint,
  {
    name: 'custom-spec-language-option',
    languageOptions: {
      parserOptions: {
        project: 'tsconfig.spec.json',
        sourceType: 'module',
      },
    },
  },
  {
    name: 'custom-spec-rule',
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
];
