// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require('path')

const DIR_ROOT = __dirname

// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-extraneous-dependencies
module.exports = require('@linkening/typescript-base').jest.getBase({
  rootDir: DIR_ROOT,
  testEnvironment: 'node',

  globals: {
    'ts-jest': {
      tsConfig: join(DIR_ROOT, 'tsconfig.json'),
    },
  },

  modulePaths: [__dirname],
})
