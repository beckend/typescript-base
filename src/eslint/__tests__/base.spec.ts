import { CLIEngine } from 'eslint'
import { join } from 'path'

import { getBase } from '../base'

describe('Eslint base config', () => {
  const FILE_ESLINTRC = join(__dirname, 'eslintrc.base.js')
  const fixtures = {
    base1: join(__dirname, '..', 'base.ts'),
  }
  const eslintCLI = new CLIEngine({ configFile: FILE_ESLINTRC })

  it('no errors', () => {
    expect(eslintCLI.executeOnFiles(Object.values(fixtures)).errorCount).toEqual(0)
  }, 30000)
})

describe('getBaseReact', () => {
  it('return proper config', () => {
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
          "airbnb-base",
          "plugin:@typescript-eslint/recommended",
          "prettier",
          "prettier/@typescript-eslint",
        ],
        "parser": "@typescript-eslint/parser",
        "parserOptions": Object {
          "createDefaultProgram": true,
          "ecmaFeatures": Object {
            "impliedStrict": true,
            "modules": true,
          },
          "ecmaVersion": 2019,
          "project": "/test/file.json",
          "sourceType": "module",
        },
        "plugins": Array [
          "import",
          "@typescript-eslint",
          "prettier",
        ],
        "rules": Object {
          "@typescript-eslint/explicit-function-return-type": "off",
          "@typescript-eslint/indent": "off",
          "@typescript-eslint/interface-name-prefix": Array [
            "error",
            "always",
          ],
          "@typescript-eslint/no-explicit-any": "off",
          "@typescript-eslint/no-unused-vars": Array [
            "error",
            Object {
              "args": "after-used",
              "ignoreRestSiblings": false,
              "vars": "all",
            },
          ],
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
          "import/no-unresolved": "error",
          "import/prefer-default-export": "off",
          "jsx-a11y/control-has-associated-label": "off",
          "prettier/prettier": "error",
        },
        "settings": Object {
          "import/resolver": Object {
            "typescript": Object {
              "directory": "/test/file.json",
            },
          },
        },
      }
    `)
  })

  it('allow config override', () => {
    expect(
      getBase({
        onConfig: ({ config, defaults, merge }) => {
          return merge(config, {
            rules: {
              'import/no-extraneous-dependencies': [
                'error',
                {
                  devDependencies: [...defaults['import/no-extraneous-dependencies'].devDependencies, 'myFile*'],
                },
              ],
            },
          })
        },
      })
    ).toMatchInlineSnapshot(`
      Object {
        "extends": Array [
          "airbnb-base",
          "plugin:@typescript-eslint/recommended",
          "prettier",
          "prettier/@typescript-eslint",
        ],
        "parser": "@typescript-eslint/parser",
        "parserOptions": Object {
          "createDefaultProgram": true,
          "ecmaFeatures": Object {
            "impliedStrict": true,
            "modules": true,
          },
          "ecmaVersion": 2019,
          "project": undefined,
          "sourceType": "module",
        },
        "plugins": Array [
          "import",
          "@typescript-eslint",
          "prettier",
        ],
        "rules": Object {
          "@typescript-eslint/explicit-function-return-type": "off",
          "@typescript-eslint/indent": "off",
          "@typescript-eslint/interface-name-prefix": Array [
            "error",
            "always",
          ],
          "@typescript-eslint/no-explicit-any": "off",
          "@typescript-eslint/no-unused-vars": Array [
            "error",
            Object {
              "args": "after-used",
              "ignoreRestSiblings": false,
              "vars": "all",
            },
          ],
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
          "import/no-unresolved": "error",
          "import/prefer-default-export": "off",
          "jsx-a11y/control-has-associated-label": "off",
          "prettier/prettier": "error",
        },
        "settings": Object {
          "import/resolver": Object {
            "typescript": Object {
              "directory": undefined,
            },
          },
        },
      }
    `)
  })

  it('accepts no options', () => {
    expect(getBase()).toBeTruthy()
  })

  it('omits airbnb-base if react airbnb is included', () => {
    expect(
      getBase({
        extends: ['airbnb', 'airbnb-base'],
      }).extends.includes('airbnb-base')
    ).toEqual(false)
  })
})
