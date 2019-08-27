import { merge } from 'lodash'

export const getBase = (options: { readonly [x: string]: any } = {}) =>
  merge(
    {
      hooks: {
        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
        'pre-commit': 'concurrently "npm run test" "npm run lint"',
      },
    },
    options
  )
