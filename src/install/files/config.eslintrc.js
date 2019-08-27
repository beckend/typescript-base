const { join } = require('path')

const DIR_ROOT = __dirname
const FILE_TSCONFIG = join(DIR_ROOT, 'tsconfig.eslint.json')

// eslint-disable-next-line import/no-extraneous-dependencies
module.exports = require('@linkening/typescript-base').eslint.getBase({
  packageDirs: [__dirname],
  pathFileTSConfig: FILE_TSCONFIG,
})
