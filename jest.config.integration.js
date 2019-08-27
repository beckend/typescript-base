// eslint-disable-next-line @typescript-eslint/no-var-requires
const { coveragePathIgnorePatterns } = require('./jest.common')

const DIR_ROOT = __dirname

module.exports = require('./build/src').jest.getBaseIntegration({
  coveragePathIgnorePatterns,
  rootDir: DIR_ROOT,
})
