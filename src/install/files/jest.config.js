const DIR_ROOT = __dirname

// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-extraneous-dependencies
module.exports = require('typescript-base').jest.getBase({
  rootDir: DIR_ROOT,
  testEnvironment: 'node',
})
