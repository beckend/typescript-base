const { join } = require('path')

const DIR_ROOT = __dirname
const FILE_TSCONFIG = join(DIR_ROOT, 'tsconfig.eslint.json')

module.exports = require('./build/src').eslint.getBase({
  isReact: true,
  packageDirs: [__dirname],
  pathFileTSConfig: FILE_TSCONFIG,

  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },

  globals: {},

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
