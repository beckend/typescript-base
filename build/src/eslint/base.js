"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBase = void 0;
const lodash_1 = require("lodash");
const array_1 = require("../modules/array");
const defaults = {
    'import/no-extraneous-dependencies': {
        devDependencies: [
            '**/__mocks__/**/*',
            '**/__tests__/**/*',
            '**/.babelrc*',
            '**/.eslintrc*',
            '**/.huskyrc*',
            '**/.prettierrc*',
            '**/.stylelintrc*',
            '**/*.stories.*',
            '**/commitlint.config.*',
            '**/jest.config.*',
            '**/webpack.config.*',
        ],
    },
};
exports.getBase = ({ onConfig, packageDirs, pathFileTSConfig, ...rest } = {}) => {
    const results = lodash_1.merge({
        extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'prettier', 'prettier/@typescript-eslint'],
        parser: '@typescript-eslint/parser',
        parserOptions: {
            createDefaultProgram: true,
            ecmaFeatures: {
                impliedStrict: true,
                modules: true,
            },
            ecmaVersion: 2020,
            project: pathFileTSConfig,
            sourceType: 'module',
        },
        plugins: ['import', '@typescript-eslint', 'prettier'],
        settings: {
            'import/resolver': {
                typescript: {
                    directory: pathFileTSConfig,
                },
            },
        },
        rules: {
            'jsx-a11y/control-has-associated-label': 'off',
            'prettier/prettier': 'error',
            'import/no-extraneous-dependencies': [
                'error',
                {
                    devDependencies: [],
                    packageDir: [...array_1.returnArray(packageDirs)],
                },
            ],
            'import/no-unresolved': 'error',
            'import/extensions': 'off',
            'import/prefer-default-export': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/indent': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    args: 'after-used',
                    ignoreRestSiblings: false,
                },
            ],
        },
    }, rest);
    const hasReactConfig = results.extends.includes('airbnb');
    results.extends = results.extends.reduce((acc, x) => {
        // do not add base config if react config detected, since it already includes it in itself
        if (hasReactConfig && x === 'airbnb-base') {
            return acc;
        }
        acc.push(x);
        return acc;
    }, []);
    if (typeof onConfig === 'function') {
        // this is just to let typescript infer the type
        let resultsModified = results;
        resultsModified = onConfig({ config: results, defaults, merge: lodash_1.merge });
        return resultsModified;
    }
    return results;
};
