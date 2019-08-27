import { ESLint } from 'eslint'
import { join } from 'path'

import { getBase } from '../base'

describe('Eslint getBase', () => {
  const utils = {
    testLinter<
      T1 extends {
        readonly pathFileEslintRC: string
        readonly fixtures: {
          readonly [x: string]: string
        }
      }
    >({ fixtures, pathFileEslintRC }: T1) {
      it('no errors', async () => {
        const linter = new ESLint({ overrideConfigFile: pathFileEslintRC, useEslintrc: false })
        const result = await linter.lintFiles(Object.values(fixtures))

        expect(result.length > 0).toEqual(true)

        result.forEach(({ messages }) => {
          expect(messages.length).toEqual(0)
        })
      }, 30000)
    },
  }

  describe('base config', () => {
    utils.testLinter({
      fixtures: {
        base1: join(__dirname, '..', 'base.ts'),
      },
      pathFileEslintRC: join(__dirname, 'eslintrc.base.js'),
    })
  })

  describe('react config', () => {
    const DIR_FIXTURES = join(__dirname, 'fixtures')
    const fixtures = {
      react1: join(DIR_FIXTURES, 'good/react-class.tsx'),
    }

    utils.testLinter({ fixtures, pathFileEslintRC: join(__dirname, 'eslintrc.base.react.js') })
  })

  it('returns proper config', () => {
    expect(
      getBase({
        packageDirs: ['/test/dir'],
        pathFileTSConfig: '/test/file.json',
        rules: {
          'import/no-extraneous-dependencies': [
            'error',
            {
              devDependencies: [
                './gulpfile.*',
                './internals/**/*',
                '**/manage-translations.ts',
                '**/.storybook/**/*',
                '**/__mocks__/**/*',
                '**/__tests__/**/*',
                '**/*.stories.ts*',
                '**/jest.config.*',
              ],
            },
          ],
        },
      })
    ).toMatchInlineSnapshot(`
      Object {
        "extends": Array [
          "airbnb-typescript/base",
          "plugin:import/errors",
          "plugin:import/warnings",
          "plugin:import/typescript",
          "plugin:@typescript-eslint/recommended",
          "plugin:@typescript-eslint/recommended-requiring-type-checking",
          "prettier",
        ],
        "parserOptions": Object {
          "extraFileExtensions": Array [
            ".mjs",
          ],
          "project": "/test/file.json",
        },
        "root": true,
        "rules": Object {
          "@typescript-eslint/explicit-module-boundary-types": "off",
          "@typescript-eslint/no-floating-promises": Array [
            "error",
            Object {
              "ignoreIIFE": true,
            },
          ],
          "@typescript-eslint/no-unsafe-assignment": "off",
          "@typescript-eslint/no-unsafe-call": "off",
          "@typescript-eslint/no-unsafe-member-access": "off",
          "@typescript-eslint/no-unsafe-return": "off",
          "@typescript-eslint/no-var-requires": "off",
          "@typescript-eslint/unbound-method": "off",
          "import/no-extraneous-dependencies": Array [
            "error",
            Object {
              "devDependencies": Array [
                "./gulpfile.*",
                "./internals/**/*",
                "**/manage-translations.ts",
                "**/.storybook/**/*",
                "**/__mocks__/**/*",
                "**/__tests__/**/*",
                "**/*.stories.ts*",
                "**/jest.config.*",
              ],
              "packageDir": Array [
                "/test/dir",
              ],
            },
          ],
          "import/prefer-default-export": "off",
          "no-plusplus": "off",
        },
        "settings": Object {
          "import/parsers": Object {
            "@typescript-eslint/parser": Array [
              ".ts",
              ".tsx",
              ".js",
              ".jsx",
            ],
          },
          "import/resolver": Object {
            "typescript": Object {
              "alwaysTryTypes": true,
              "project": Array [
                "/test/file.json",
              ],
            },
          },
        },
      }
    `)
  })

  it('allow config override', () => {
    expect(
      getBase({
        onConfig: ({ config, defaults, merge }) =>
          merge(config, {
            rules: {
              'import/no-extraneous-dependencies': [
                'error',
                {
                  devDependencies: [...defaults['import/no-extraneous-dependencies'].devDependencies, 'myFile*'],
                },
              ],
            },
          }),
      })
    ).toMatchInlineSnapshot(`
      Object {
        "extends": Array [
          "airbnb-typescript/base",
          "plugin:import/errors",
          "plugin:import/warnings",
          "plugin:import/typescript",
          "plugin:@typescript-eslint/recommended",
          "plugin:@typescript-eslint/recommended-requiring-type-checking",
          "prettier",
        ],
        "parserOptions": Object {
          "extraFileExtensions": Array [
            ".mjs",
          ],
          "project": undefined,
        },
        "root": true,
        "rules": Object {
          "@typescript-eslint/explicit-module-boundary-types": "off",
          "@typescript-eslint/no-floating-promises": Array [
            "error",
            Object {
              "ignoreIIFE": true,
            },
          ],
          "@typescript-eslint/no-unsafe-assignment": "off",
          "@typescript-eslint/no-unsafe-call": "off",
          "@typescript-eslint/no-unsafe-member-access": "off",
          "@typescript-eslint/no-unsafe-return": "off",
          "@typescript-eslint/no-var-requires": "off",
          "@typescript-eslint/unbound-method": "off",
          "import/no-extraneous-dependencies": Array [
            "error",
            Object {
              "devDependencies": Array [
                "**/__mocks__/**/*",
                "**/__tests__/**/*",
                "**/.babelrc*",
                "**/.eslintrc*",
                "**/.huskyrc*",
                "**/.prettierrc*",
                "**/.stylelintrc*",
                "**/*.stories.*",
                "**/commitlint.config.*",
                "**/jest.config.*",
                "**/webpack.config.*",
                "myFile*",
              ],
              "packageDir": Array [],
            },
          ],
          "import/prefer-default-export": "off",
          "no-plusplus": "off",
        },
        "settings": Object {
          "import/parsers": Object {
            "@typescript-eslint/parser": Array [
              ".ts",
              ".tsx",
              ".js",
              ".jsx",
            ],
          },
          "import/resolver": Object {
            "typescript": Object {
              "alwaysTryTypes": true,
              "project": Array [
                undefined,
              ],
            },
          },
        },
      }
    `)
  })

  it('accepts no options', () => {
    expect(getBase()).toBeTruthy()
  })

  it('uses plugin airbnb-typescript when isReact', () => {
    expect(
      getBase({
        isReact: true,
      }).extends
    ).toContain('airbnb-typescript')
  })
})
