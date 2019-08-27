import { merge } from 'lodash'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
