import { join } from 'path'
import * as stylelint from 'stylelint'

import { getBase } from '../base'

describe('stylelint base config', () => {
  const DIR_FIXTURES = join(__dirname, 'fixtures')
  const FILE_STYLELINTRC = join(__dirname, 'stylelintrc.js')
  const fixtures = {
    react1: join(DIR_FIXTURES, 'test.css'),
  }

  it(
    'no errors',
    () =>
      expect(
        stylelint.lint({
          configFile: FILE_STYLELINTRC,
          files: Object.values(fixtures),
        })
      ).resolves.toHaveProperty('errored', false),
    30000
  )
})

describe('stylelint base', () => {
  it('get defaults', () => {
    expect(getBase()).toMatchInlineSnapshot(`
      Object {
        "extends": Array [
          "stylelint-config-recommended",
        ],
        "ignoreFiles": Array [
          "./node_modules/**/*",
        ],
        "plugins": Array [],
        "rules": Object {
          "function-name-case": null,
        },
      }
    `)
  })

  it('able to override', () => {
    expect(
      getBase({
        rules: {
          myrule: 2,
        },
      })
    ).toMatchInlineSnapshot(`
      Object {
        "extends": Array [
          "stylelint-config-recommended",
        ],
        "ignoreFiles": Array [
          "./node_modules/**/*",
        ],
        "plugins": Array [],
        "rules": Object {
          "function-name-case": null,
          "myrule": 2,
        },
      }
    `)
  })
})
