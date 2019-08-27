import { getBase } from '../base'

describe('prettier base', () => {
  it('get defaults', () => {
    expect(getBase()).toMatchInlineSnapshot(`
      Object {
        "printWidth": 120,
        "semi": false,
        "singleQuote": true,
        "tabWidth": 2,
        "trailingComma": "es5",
      }
    `)
  })

  it('able to override', () => {
    expect(getBase({ custom: true })).toMatchInlineSnapshot(`
      Object {
        "custom": true,
        "printWidth": 120,
        "semi": false,
        "singleQuote": true,
        "tabWidth": 2,
        "trailingComma": "es5",
      }
    `)
  })
})
