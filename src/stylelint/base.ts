import { merge } from 'lodash'
import { Configuration } from 'stylelint'

import { TPartialReadonly } from '../model'

export const getBase = (options: TPartialReadonly<Configuration> = {}) =>
  merge(
    {
      plugins: [],
      extends: ['stylelint-config-recommended'],
      rules: {
        'function-name-case': null,
      },
      ignoreFiles: ['./node_modules/**/*'],
    },
    options
  )
