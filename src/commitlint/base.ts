import { merge } from 'lodash'

export const getBase = (options: { readonly [x: string]: any } = {}) =>
  merge(
    {
      extends: ['@commitlint/config-conventional'],
    },
    options
  )
