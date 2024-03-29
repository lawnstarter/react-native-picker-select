module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'airbnb/hooks'],
  plugins: ['react', 'react-native', 'prettier'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'arrow-body-style': 0,
    'comma-dangle': 0,
    'default-param-last': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'object-curly-newline': 0,
    'operator-linebreak': 0,
    'prettier/prettier': 'error',
    'react/destructuring-assignment': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-arrow-function-lifecycle': 0,
    'react/no-unused-class-component-methods': 0,
    'react/prop-types': 0,
    'react/static-property-placement': 0,
  },
};
