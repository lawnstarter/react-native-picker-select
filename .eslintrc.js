module.exports = {
    extends: 'ls-react',
    env: {
        jest: true,
    },
    globals: {
        shallow: true,
    },
    rules: {
        'import/no-extraneous-dependencies': 0,
        'lodash/import-scope': 0,
        'lodash/prefer-lodash-method': 0,
        'lodash/prefer-noop': 0,
    },
};
