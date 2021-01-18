/*
 * @Author: Spring Breeze
 * @Date: 2021-01-18 15:49:53
 * @FilePath: \foodPlatform\.eslintrc.js
 * @LastEditTime: 2021-01-18 15:50:22
 */
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'no-unused-vars': 0,
  },
  plugins: ['@typescript-eslint'],
};
