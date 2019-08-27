import { dirname, join, resolve as resolvePath } from 'path'
import { logger } from 'just-task'
import { merge, once } from 'lodash'
import * as fs from 'fs-extra'
import { queue } from 'async'

import { toArray } from '../modules/array'
import config, { Configuration } from '../config'

const promisePipe = require('promisepipe')

export interface IInstallOptionsBase {
  readonly overwrite?: boolean
  readonly typescriptBaseRC?: ITypescriptBaseRC
}

export interface ITypescriptBaseRC {
  readonly filesToCopy?: {
    readonly exclude?: Array<string>
  }

  readonly modifyPackageJSON?: boolean
}

const DIR = {
  // eslint-disable-next-line global-require
  ROOT_APP: Configuration.isTest ? '/root' : (require('app-root-path').path as string),
}

export class Install {
  static defaults = {
    baseRC: {
      filesToCopy: {
        exclude: [] as string[],
      },

      modifyPackageJSON: true,
    },
    encoding: 'utf8',
  }

  static PATH = {
    DIR: {
      ROOT_INSTALL: join(config.PATH.DIR.ROOT, 'src/install'),
      FILES_INSTALL: join(config.PATH.DIR.ROOT, 'src/install/files'),
      ...DIR,
    },

    FILE: {
      ROOT_APP: {
        packageJSON: join(DIR.ROOT_APP, 'package.json'),
        typescriptBaseRC: join(DIR.ROOT_APP, 'typescriptbaserc.js'),
      },
    },
  }

  static utils = {
    logger,
  }

  static getters = {
    async fileInfo({ pathFile }: { readonly pathFile: string }) {
      try {
        await fs
          // eslint-disable-next-line no-bitwise
          .access(pathFile, fs.constants.F_OK | fs.constants.W_OK)

        return {
          exists: true,
          readable: true,
          writeable: true,
        }
      } catch ({ code }) {
        const errIsNotFound = code === 'ENOENT'

        return {
          exists: !errIsNotFound,
          readable: !errIsNotFound,
          writeable: !errIsNotFound,
        }
      }
    },

    pathRelativeToThisProjectRoot: ({ path }: { readonly path: string }) => join(config.PATH.DIR.ROOT, path),
    pathRelativeToAppRoot: ({ path }: { readonly path: string }) => join(Install.PATH.DIR.ROOT_APP, path),
    pathRelativeToInstallFiles: ({ path }: { readonly path: string }) => join(Install.PATH.DIR.FILES_INSTALL, path),

    async typescriptBaseRC(): Promise<typeof Install.defaults.baseRC> {
      const { baseRC } = Install.defaults

      try {
        return merge(baseRC, await import(Install.PATH.FILE.ROOT_APP.typescriptBaseRC))
      } catch {
        return baseRC
      }
    },
  }

  static installFns = {
    base: async ({
      overwrite = false,
      pathFileInput,
      pathFileWrite,
    }: IInstallOptionsBase & {
      readonly pathFileInput: string
      readonly pathFileWrite: string
    }) => {
      const { exists, writeable } = await Install.getters.fileInfo({
        pathFile: pathFileWrite,
      })

      const payloadNoWrite = {
        exists,
        overwrite,
        wroteFile: false,
      }

      const doWriteFile = async () => {
        try {
          await fs.ensureDir(dirname(pathFileWrite))
          await promisePipe(fs.createReadStream(pathFileInput), fs.createWriteStream(pathFileWrite))

          return {
            exists,
            overwrite,
            wroteFile: true,
          }
        } catch {
          return payloadNoWrite
        }
      }

      if (overwrite) {
        if (!writeable) {
          return payloadNoWrite
        }

        return doWriteFile()
      }

      if (exists) {
        return payloadNoWrite
      }

      return doWriteFile()
    },

    baseAndLog: async (
      x: IInstallOptionsBase & {
        readonly pathFileInput: string
        readonly pathFileWrite: string
        readonly pathWriteBase?: string
      }
    ) => {
      const { pathWriteBase, pathFileWrite, typescriptBaseRC: typescriptBaseRCInput } = x
      const writePath = join(pathWriteBase || '', pathFileWrite)
      const { filesToCopy } = typescriptBaseRCInput || (await Install.getters.typescriptBaseRC())
      const logNotWritten = () => {
        logger.info(`"${writePath}" was not written.`)
      }

      if (
        filesToCopy &&
        filesToCopy.exclude &&
        filesToCopy.exclude.includes(pathFileWrite.replace(Install.PATH.DIR.ROOT_APP, ''))
      ) {
        logNotWritten()

        return {
          wroteFile: false,
        }
      }

      const { overwrite, wroteFile } = await Install.installFns.base(x)

      if (wroteFile) {
        logger.info(`"${writePath}" was ${overwrite ? 'overwritten' : 'written'}.`)
      } else {
        logNotWritten()
      }

      return {
        wroteFile,
      }
    },

    listOfBaseAndLog: (
      baseAndLogOptionsList:
        | Array<
            IInstallOptionsBase & {
              readonly pathFileInput: string
              readonly pathFileWrite: string
              readonly pathWriteBase?: string
            }
          >
        | (IInstallOptionsBase & {
            readonly pathFileInput: string
            readonly pathFileWrite: string
            readonly pathWriteBase?: string
          }),
      options?: IInstallOptionsBase
    ) =>
      Promise.all(
        toArray(baseAndLogOptionsList).map((x) =>
          Install.installFns.baseAndLog({
            ...options,
            ...x,
          })
        )
      ),

    dirListOfBaseAndLog: async <
      T1 extends {
        readonly pathDirInput: string
        readonly pathDirOutput: string
      }
    >(
      { pathDirInput, pathDirOutput }: T1,
      { overwrite }: IInstallOptionsBase = {}
    ) => {
      const checkValidDir = (path: string) =>
        fs.stat(path).then((stat) => {
          if (!stat.isDirectory()) {
            throw new Error(`path does not exist or is not a directory: ${path}`)
          }
        })

      await checkValidDir(pathDirInput)

      return new Promise<void>((resolve, reject) => {
        const walker = queue((path: string, callbackInput) => {
          const callback = once(callbackInput)

          fs.stat(path, (errStat, stats) => {
            if (errStat) {
              callback(errStat)
            }

            if (stats.isDirectory()) {
              fs.readdir(path, (errReadDir, files) => {
                if (errReadDir) {
                  callback(errReadDir)
                } else {
                  files.forEach((file) => {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    walker.push(resolvePath(path, file))
                  })
                  callback()
                }
              })
            } else {
              Install.installFns
                .base({
                  overwrite,
                  pathFileInput: path,
                  pathFileWrite: join(pathDirOutput, path.replace(pathDirInput, '')),
                })
                .then(() => {
                  callback()
                })
                .catch(callback)
            }
          })
        }, 50)

        walker.error(reject)

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        walker.push(pathDirInput)
        walker.drain(resolve)
      })
    },

    packageJSON: async ({
      typescriptBaseRC: typescriptBaseRCInput,
    }: { typescriptBaseRC?: IInstallOptionsBase['typescriptBaseRC'] } = {}) => {
      const { modifyPackageJSON } = typescriptBaseRCInput || (await Install.getters.typescriptBaseRC())

      if (!modifyPackageJSON) {
        return {
          new: undefined,
          original: undefined,
          wroteFile: false,
        }
      }

      const packageJSON = await fs.readJson(Install.PATH.FILE.ROOT_APP.packageJSON)
      const originalContent = JSON.stringify(packageJSON)

      if (!packageJSON.scripts) {
        packageJSON.scripts = {}
      }

      if (!packageJSON.scripts.lint) {
        packageJSON.scripts.lint = "eslint './**/*.js' './**/*.ts' './**/*.tsx' --fix"
      }

      if (
        !packageJSON.scripts.test ||
        (packageJSON.scripts.test && packageJSON.scripts.test.includes('Error: no test specified'))
      ) {
        packageJSON.scripts.test = 'jest'
      }

      if (packageJSON.scripts.test === 'jest') {
        if (!packageJSON.scripts['test:coverage']) {
          packageJSON.scripts['test:coverage'] = 'jest --coverage'
        }

        if (!packageJSON.scripts['test:watch']) {
          packageJSON.scripts['test:watch'] = 'jest --watchAll'
        }

        if (!packageJSON.scripts['test:watch-coverage']) {
          packageJSON.scripts['test:watch-coverage'] = 'jest --watchAll --coverage'
        }
      }

      const hasChanged = originalContent !== JSON.stringify(packageJSON)

      if (hasChanged) {
        await fs.writeJSON(Install.PATH.FILE.ROOT_APP.packageJSON, packageJSON, {
          spaces: 2,
        })

        logger.info(`updated package.json with core scripts.`)
      }

      return {
        new: packageJSON,
        original: JSON.parse(originalContent),
        wroteFile: hasChanged,
      }
    },

    vscode: (options?: IInstallOptionsBase) =>
      Install.installFns.dirListOfBaseAndLog(
        {
          pathDirInput: Install.getters.pathRelativeToThisProjectRoot({ path: '.vscode' }),
          pathDirOutput: Install.getters.pathRelativeToAppRoot({ path: '.vscode' }),
        },
        options
      ),

    eslint: (options?: IInstallOptionsBase) =>
      Install.installFns.listOfBaseAndLog(
        [
          {
            pathFileInput: Install.getters.pathRelativeToInstallFiles({ path: 'tsconfig.eslint.json' }),
            pathFileWrite: Install.getters.pathRelativeToAppRoot({ path: 'tsconfig.eslint.json' }),
          },
          {
            pathFileInput: Install.getters.pathRelativeToInstallFiles({ path: '.eslintignore' }),
            pathFileWrite: Install.getters.pathRelativeToAppRoot({ path: '.eslintignore' }),
          },
          {
            // had to use other filename to prevent from current eslint to try to use it in current project
            pathFileInput: Install.getters.pathRelativeToInstallFiles({ path: 'config.eslintrc.js' }),
            pathFileWrite: Install.getters.pathRelativeToAppRoot({ path: '.eslintrc.js' }),
          },
        ],
        options
      ),

    husky: (options?: IInstallOptionsBase) =>
      Install.installFns.dirListOfBaseAndLog(
        {
          pathDirInput: Install.getters.pathRelativeToThisProjectRoot({ path: '.husky' }),
          pathDirOutput: Install.getters.pathRelativeToAppRoot({ path: '.husky' }),
        },
        options
      ),

    git: (options?: IInstallOptionsBase) =>
      Install.installFns.listOfBaseAndLog(
        {
          // had to rename this file to gitignore otherwise npm would not publish it and the copy fails
          pathFileInput: Install.getters.pathRelativeToInstallFiles({ path: 'gitignore' }),
          pathFileWrite: Install.getters.pathRelativeToAppRoot({ path: '.gitignore' }),
        },
        options
      ),

    prettier: (options?: IInstallOptionsBase) =>
      Install.installFns.listOfBaseAndLog(
        {
          pathFileInput: Install.getters.pathRelativeToInstallFiles({ path: '.prettierrc.js' }),
          pathFileWrite: Install.getters.pathRelativeToAppRoot({ path: '.prettierrc.js' }),
        },
        options
      ),

    stylelint: (options?: IInstallOptionsBase) =>
      Install.installFns.listOfBaseAndLog(
        {
          pathFileInput: Install.getters.pathRelativeToInstallFiles({ path: '.stylelintrc.js' }),
          pathFileWrite: Install.getters.pathRelativeToAppRoot({ path: '.stylelintrc.js' }),
        },
        options
      ),

    jest: (options?: IInstallOptionsBase) =>
      Install.installFns.listOfBaseAndLog(
        {
          pathFileInput: Install.getters.pathRelativeToInstallFiles({ path: 'jest.config.js' }),
          pathFileWrite: Install.getters.pathRelativeToAppRoot({ path: 'jest.config.js' }),
        },
        options
      ),

    typescript: (options?: IInstallOptionsBase) =>
      Install.installFns.listOfBaseAndLog(
        {
          pathFileInput: Install.getters.pathRelativeToInstallFiles({ path: 'tsconfig.json' }),
          pathFileWrite: Install.getters.pathRelativeToAppRoot({ path: 'tsconfig.json' }),
        },
        options
      ),

    editorconfig: (options?: IInstallOptionsBase) =>
      Install.installFns.listOfBaseAndLog(
        {
          pathFileInput: Install.getters.pathRelativeToInstallFiles({ path: '.editorconfig' }),
          pathFileWrite: Install.getters.pathRelativeToAppRoot({ path: '.editorconfig' }),
        },
        options
      ),
  }
}
