import { merge } from 'lodash'

export const getBase = (options: { readonly [x: string]: any } = {}) =>
  merge(
    {
      semi: false,
      trailingComma: 'es5',
      singleQuote: true,
      printWidth: 120,
      tabWidth: 2,
    },
    options
  )
