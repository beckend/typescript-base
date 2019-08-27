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
const getBase = ({ onConfig, isReact, packageDirs, pathFileTSConfig, ...rest } = {}) => {
    const results = lodash_1.merge({
        root: true,
        extends: [
            `airbnb-typescript${isReact ? '' : '/base'}`,
            'plugin:import/errors',
            'plugin:import/warnings',
            'plugin:import/typescript',
            'plugin:@typescript-eslint/recommended',
            'plugin:@typescript-eslint/recommended-requiring-type-checking',
            'prettier',
        ],
        parserOptions: {
            extraFileExtensions: ['.mjs'],
            project: pathFileTSConfig,
        },
        settings: {
            'import/parsers': {
                '@typescript-eslint/parser': ['.ts', '.tsx', '.js', '.jsx'],
            },
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: [pathFileTSConfig],
                },
            },
        },
        rules: {
            'import/no-extraneous-dependencies': [
                'error',
                {
                    devDependencies: [],
                    packageDir: [...array_1.returnArray(packageDirs)],
                },
            ],
            '@typescript-eslint/no-floating-promises': [
                'error',
                {
                    ignoreIIFE: true,
                },
            ],
            'no-plusplus': 'off',
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            'import/prefer-default-export': 'off',
        },
    }, rest);
    if (typeof onConfig === 'function') {
        // this is just to let typescript infer the type
        let resultsModified = results;
        resultsModified = onConfig({ config: results, defaults, merge: lodash_1.merge });
        return resultsModified;
    }
    return results;
};
exports.getBase = getBase;
