import { getBase } from '../base'

describe('husky base', () => {
  it('get defaults', () => {
    expect(getBase()).toMatchInlineSnapshot(`
                  Object {
                    "hooks": Object {
                      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
                      "pre-commit": "concurrently \\"npm run test\\" \\"npm run lint\\"",
                    },
                  }
            `)
  })

  it('able to override', () => {
    expect(
      getBase({
        custom: true,
        hooks: {
          'pre-commit': 'npm run test',
        },
      })
    ).toMatchInlineSnapshot(`
      Object {
        "custom": true,
        "hooks": Object {
          "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
          "pre-commit": "npm run test",
        },
      }
    `)
  })
})
