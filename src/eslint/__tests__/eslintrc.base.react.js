// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require('path')

const DIR_ROOT = join(__dirname, '../../..')
const FILE_TSCONFIG = join(DIR_ROOT, 'tsconfig.json')

module.exports = require('../../../build/src/eslint/base-react').getBaseReact({
  packageDirs: [DIR_ROOT],
  pathFileTSConfig: FILE_TSCONFIG,
})
