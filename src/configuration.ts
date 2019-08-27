import { join } from 'path'
import * as packageJSON from '../package.json'

interface IConfigurationOptions {
  readonly pathRoot: string
}

export class Configuration {
  static packageJSON = packageJSON

  static isBuild = __filename.endsWith('.js')

  static isTest = process.env.NODE_ENV === 'test'

  static createPathsConfig({ pathRoot: THE_ROOT }: { readonly pathRoot: string }) {
    return {
      DIR: {
        ROOT: THE_ROOT,
        ROOT_BUILD: join(THE_ROOT, 'build'),
        ROOT_NODE_MODULES: join(THE_ROOT, 'node_modules'),
      },
    }
  }

  PATH: ReturnType<typeof Configuration.createPathsConfig>

  constructor({ pathRoot }: IConfigurationOptions) {
    this.PATH = Configuration.createPathsConfig({ pathRoot })
  }
}
