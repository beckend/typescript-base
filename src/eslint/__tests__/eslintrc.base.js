const { join } = require('path')

const DIR_ROOT = join(__dirname, '../../..')
const FILE_TSCONFIG = join(DIR_ROOT, 'tsconfig.json')

module.exports = require('../../../build/src/eslint/base').getBase({
  packageDirs: [DIR_ROOT],
  pathFileTSConfig: FILE_TSCONFIG,
})
