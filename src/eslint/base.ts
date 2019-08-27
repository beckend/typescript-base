import { merge } from 'lodash'

import { returnArray } from '../modules/array'

export interface IGetBaseOptions {
  readonly onConfig?: (x: {
    readonly config: ReturnType<typeof getBase>
    readonly defaults: typeof defaults
    readonly merge: typeof merge
  }) => ReturnType<typeof getBase>
  readonly isReact?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly [x: string]: any
}

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
}

export const getBase = ({ onConfig, isReact, packageDirs, pathFileTSConfig, ...rest }: IGetBaseOptions = {}) => {
  const results = merge(
    {
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
            packageDir: [...returnArray(packageDirs)],
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
    },
    rest
  )

  if (typeof onConfig === 'function') {
    // this is just to let typescript infer the type
    let resultsModified = results
    resultsModified = onConfig({ config: results, defaults, merge })
    return resultsModified
  }

  return results
}
