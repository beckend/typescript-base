const { coveragePathIgnorePatterns } = require('./jest.common')

const DIR_ROOT = __dirname

module.exports = require('./build/src').jest.getBase({
  coveragePathIgnorePatterns,
  rootDir: DIR_ROOT,
  testEnvironment: 'jest-environment-jsdom',

  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: -10,
    },
  },
})
