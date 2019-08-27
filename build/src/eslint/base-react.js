"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseReact = void 0;
const base_1 = require("./base");
const array_1 = require("../modules/array");
exports.getBaseReact = ({ packageDirs, pathFileTSConfig, ...rest } = {}) => base_1.getBase({
    packageDirs,
    pathFileTSConfig,
    ...rest,
    extends: [
        'airbnb',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/react',
        'prettier/@typescript-eslint',
        ...array_1.returnArray(rest && rest.extends),
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ...(rest && rest.parserOptions),
    },
    plugins: [
        'import',
        '@typescript-eslint',
        'react',
        'react-hooks',
        'jsx-a11y',
        'prettier',
        ...array_1.returnArray(rest && rest.plugins),
    ],
    settings: {
        react: {
            version: 'detect',
        },
        ...(rest && rest.settings),
    },
    rules: {
        'react/no-children-prop': 'off',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-filename-extension': 'off',
        'react/destructuring-assignment': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        ...(rest && rest.rules),
    },
});
