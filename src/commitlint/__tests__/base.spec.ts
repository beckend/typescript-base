import { getBase } from '../base'

describe('commitlint base', () => {
  it('get defaults', () => {
    expect(getBase()).toMatchInlineSnapshot(`
      Object {
        "extends": Array [
          "@commitlint/config-conventional",
        ],
      }
    `)
  })

  it('able to override', () => {
    expect(getBase({ custom: true })).toMatchInlineSnapshot(`
      Object {
        "custom": true,
        "extends": Array [
          "@commitlint/config-conventional",
        ],
      }
    `)
  })
})
