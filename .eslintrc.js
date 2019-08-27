// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require('path')

const DIR_ROOT = __dirname
const FILE_TSCONFIG = join(DIR_ROOT, 'tsconfig.json')

module.exports = require('./build/src').eslint.getBaseReact({
  packageDirs: [__dirname],
  pathFileTSConfig: FILE_TSCONFIG,

  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },

  globals: {
    // puppeteer related
    browser: 'readonly',
    context: 'readonly',
    jestPuppeteer: 'readonly',
    page: 'readonly',
  },

  onConfig: ({ config, defaults, merge }) =>
    merge(config, {
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: [...defaults['import/no-extraneous-dependencies'].devDependencies],
          },
        ],
      },
    }),
})
