import { join } from 'path'

import config from '../config'
import { IGetBaseOptions, getBase } from './base'

export const getBaseIntegration = (opts: IGetBaseOptions) =>
  getBase({
    isIntegration: true,
    testEnvironment: join(config.PATH.DIR.ROOT, 'jest.config.integration.testEnvironment.js'),
    ...opts,
  })
