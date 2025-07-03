import eslintPluginImport from 'eslint-plugin-import';

export default {
  env: {
    node: true,
    es2021: true,
  },
  plugins: ['import'],
  extends: ['plugin:import/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // your rules
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@locators', './locators'],
          ['@pages', './pages'],
          ['@components', './components'],
        ],
        extensions: ['.js'],
      },
    },
  },
};

