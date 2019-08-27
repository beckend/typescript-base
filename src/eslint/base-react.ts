import { IGetBaseOptions, getBase } from './base'
import { returnArray } from '../modules/array'

export const getBaseReact = ({ packageDirs, pathFileTSConfig, ...rest }: IGetBaseOptions = {}) =>
  getBase({
    packageDirs,
    pathFileTSConfig,
    ...rest,

    extends: [
      'airbnb',
      'plugin:@typescript-eslint/recommended',
      'prettier',
      'prettier/react',
      'prettier/@typescript-eslint',
      ...returnArray(rest && rest.extends),
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
      ...returnArray(rest && rest.plugins),
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
  })
