import { CLIEngine } from 'eslint'
import { join } from 'path'

import { getBaseReact } from '../base-react'

describe('Eslint react config', () => {
  const DIR_FIXTURES = join(__dirname, 'fixtures')
  const FILE_ESLINTRC = join(__dirname, 'eslintrc.base.react.js')
  const fixtures = {
    react1: join(DIR_FIXTURES, 'good/react-class.tsx'),
  }
  const eslintCLI = new CLIEngine({ configFile: FILE_ESLINTRC })

  it('no errors', () => {
    expect(eslintCLI.executeOnFiles(Object.values(fixtures)).errorCount).toEqual(0)
  })
})

describe('getBaseReact', () => {
  it('return proper config', () => {
    expect(
      getBaseReact({
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
          "airbnb",
          "plugin:@typescript-eslint/recommended",
          "prettier",
          "prettier/react",
          "prettier/@typescript-eslint",
        ],
        "parser": "@typescript-eslint/parser",
        "parserOptions": Object {
          "createDefaultProgram": true,
          "ecmaFeatures": Object {
            "impliedStrict": true,
            "jsx": true,
            "modules": true,
          },
          "ecmaVersion": 2020,
          "project": "/test/file.json",
          "sourceType": "module",
        },
        "plugins": Array [
          "import",
          "@typescript-eslint",
          "react",
          "react-hooks",
          "jsx-a11y",
          "prettier",
        ],
        "rules": Object {
          "@typescript-eslint/explicit-function-return-type": "off",
          "@typescript-eslint/explicit-module-boundary-types": "off",
          "@typescript-eslint/indent": "off",
          "@typescript-eslint/no-empty-function": "off",
          "@typescript-eslint/no-explicit-any": "off",
          "@typescript-eslint/no-unused-vars": Array [
            "error",
            Object {
              "args": "after-used",
              "ignoreRestSiblings": false,
              "vars": "all",
            },
          ],
          "import/extensions": "off",
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
          "react-hooks/exhaustive-deps": "warn",
          "react-hooks/rules-of-hooks": "error",
          "react/destructuring-assignment": "off",
          "react/jsx-filename-extension": "off",
          "react/no-children-prop": "off",
          "react/prop-types": "off",
          "react/react-in-jsx-scope": "off",
        },
        "settings": Object {
          "import/resolver": Object {
            "typescript": Object {
              "directory": "/test/file.json",
            },
          },
          "react": Object {
            "version": "detect",
          },
        },
      }
    `)
  })

  it('accepts no options', () => {
    expect(getBaseReact()).toBeTruthy()
  })
})
