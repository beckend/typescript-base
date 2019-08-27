import { join } from 'path'

import { Configuration } from './configuration'

export default new Configuration({
  pathRoot: join(
    Configuration.isTest && !Configuration.isBuild ? '/root/__NOT_USED__' : __dirname,
    Configuration.isBuild ? '../..' : '..'
  ),
})

export { Configuration }
