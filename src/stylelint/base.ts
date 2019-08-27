import { merge } from 'lodash'
import { Configuration } from 'stylelint'

import { TPartialReadonly } from '../model'

export interface IGetBaseOptions {
  readonly onConfig?: (x: {
    readonly config: ReturnType<typeof getBase>
    readonly merge: typeof merge
  }) => ReturnType<typeof getBase>
  readonly isReact?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly [x: string]: any
}

export const getBase = ({ onConfig, ...options }: TPartialReadonly<Configuration> & IGetBaseOptions = {}) => {
  const results = merge(
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

  if (typeof onConfig === 'function') {
    // this is just to let typescript infer the type
    let resultsModified = results
    resultsModified = onConfig({ config: results, merge })
    return resultsModified
  }

  return results
}
