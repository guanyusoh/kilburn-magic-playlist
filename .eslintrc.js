module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'no-lonely-if': 'off',
    'no-new': 0,
    'no-restricted-syntax': 0,
    'max-len': 'off',
    'guard-for-in': 'off'
  }
}
