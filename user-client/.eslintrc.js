module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        mocha: true
      }
    },
    {
      extends: [
        '@vue/typescript/recommended'
      ],
      files: [
        '**/*.vue',
        '**/*.ts',
        '**/*.tsx',
      ],
      rules: {
        'no-empty-interface': 'off',
        'ban-ts-ignore': 'off'
      }
    }
  ]
}
