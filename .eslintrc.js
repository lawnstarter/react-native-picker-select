module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['plugin:react/recommended', 'airbnb', 'airbnb/hooks', 'prettier'],
    plugins: ['react', 'react-native'],
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
        'import/no-extraneous-dependencies': 0,
        'import/prefer-default-export': 0,
        'react/prop-types': 0,
        'react/jsx-props-no-spreading': 0,
        'react/destructuring-assignment': 0,
        'react/static-property-placement': 0,
        'react/forbid-prop-types': 0,
        'react/no-arrow-function-lifecycle': 0,
        'react/no-unused-class-component-methods': 0,
        'react/jsx-filename-extension': 0,
        'arrow-body-style': 0,
        'default-param-last': 0,
    },
};
