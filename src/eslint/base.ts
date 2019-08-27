import { merge } from 'lodash'

import { returnArray } from '../modules/array'

export interface IGetBaseOptions {
  readonly onConfig?: (x: {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    readonly config: ReturnType<typeof getBase>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    readonly defaults: typeof defaults
    readonly merge: typeof merge
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
  }) => ReturnType<typeof getBase>
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

export const getBase = ({ onConfig, packageDirs, pathFileTSConfig, ...rest }: IGetBaseOptions = {}) => {
  const results = merge(
    {
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
            packageDir: [...returnArray(packageDirs)],
          },
        ],
        'import/no-unresolved': 'error',
        'import/extensions': 'off',
        'import/prefer-default-export': 'off',
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
        '@typescript-eslint/interface-name-prefix': ['error', 'always'],
      },
    },
    rest
  )

  const hasReactConfig = results.extends.includes('airbnb')

  results.extends = results.extends.reduce((acc, x) => {
    // do not add base config if react config detected, since it already includes it in itself
    if (hasReactConfig && x === 'airbnb-base') {
      return acc
    }

    acc.push(x)

    return acc
  }, [] as string[])

  if (typeof onConfig === 'function') {
    // this is just to let typescript infer the type
    let resultsModified = results
    resultsModified = onConfig({ config: results, defaults, merge })
    return resultsModified
  }

  return results
}
