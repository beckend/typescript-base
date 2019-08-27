// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require('path')

const DIR_ROOT = __dirname
const FILE_TSCONFIG = join(DIR_ROOT, 'tsconfig.json')

// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-extraneous-dependencies
module.exports = require('@linkening/typescript-base').eslint.getBase({
  packageDirs: [__dirname],
  pathFileTSConfig: FILE_TSCONFIG,
})
