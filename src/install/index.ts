/* eslint-disable @typescript-eslint/no-var-requires */
import * as fs from 'fs-extra'
import { dirname, join } from 'path'

import config, { Configuration } from '../config'

const promisePipe = require('promisepipe')
const { logger } = require('just-task')

export interface IInstallOptionsBase {
  readonly overwrite?: boolean
}

const DIR = {
  // eslint-disable-next-line global-require
  ROOT_APP: Configuration.isTest ? '/root' : (require('app-root-path').path as string),
}

export class Install {
  public static PATH = {
    DIR: {
      ROOT_INSTALL: join(config.PATH.DIR.ROOT, 'src/install'),
      FILES_INSTALL: join(config.PATH.DIR.ROOT, 'src/install/files'),
      ...DIR,
    },

    FILE: {
      ROOT_APP: {
        packageJSON: join(DIR.ROOT_APP, 'package.json'),
      },
    },
  }

  public static utils = {
    logger,
  }

  public static getters = {
    fileInfo: async ({ pathFile }: { readonly pathFile: string }) => {
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

    filePathRelativeToThisProjectRoot: ({ pathFile }: { readonly pathFile: string }) =>
      join(config.PATH.DIR.ROOT, pathFile),
    filePathRelativeToAppRoot: ({ pathFile }: { readonly pathFile: string }) =>
      join(Install.PATH.DIR.ROOT_APP, pathFile),
    filePathRelativeToInstallFiles: ({ pathFile }: { readonly pathFile: string }) =>
      join(Install.PATH.DIR.FILES_INSTALL, pathFile),
  }

  public static installFns = {
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
      const { pathWriteBase, pathFileWrite } = x
      const writePath = join(pathWriteBase || '', pathFileWrite)

      const { overwrite, wroteFile } = await Install.installFns.base(x)

      if (wroteFile) {
        logger.info(`"${writePath}" was ${overwrite ? 'overwritten' : 'written'}.`)
      } else {
        logger.info(`"${writePath}" was not written.`)
      }

      return {
        wroteFile,
      }
    },

    listOfBaseAndLog: (
      baseAndLogOptionsList: Array<
        IInstallOptionsBase & {
          readonly pathFileInput: string
          readonly pathFileWrite: string
          readonly pathWriteBase?: string
        }
      >,
      options?: IInstallOptionsBase
    ) =>
      Promise.all(
        baseAndLogOptionsList.map(x =>
          Install.installFns.baseAndLog({
            ...options,
            ...x,
          })
        )
      ),

    packageJSON: async () => {
      const packageJSON = await fs.readJson(Install.PATH.FILE.ROOT_APP.packageJSON)
      const originalContent = JSON.stringify(packageJSON)

      if (!packageJSON.scripts) {
        packageJSON.scripts = {}
      }

      if (!packageJSON.scripts.commit) {
        packageJSON.scripts.commit = 'git-cz'
      }

      if (!packageJSON.scripts.lint) {
        packageJSON.scripts.lint = 'eslint . --fix'
      }

      if (!packageJSON.scripts.release) {
        packageJSON.scripts.release = 'standard-version'
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
      Install.installFns.listOfBaseAndLog(
        [
          {
            pathFileInput: Install.getters.filePathRelativeToThisProjectRoot({ pathFile: '.vscode/settings.json' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.vscode/settings.json' }),
          },
          {
            pathFileInput: Install.getters.filePathRelativeToThisProjectRoot({ pathFile: '.vscode/tasks.json' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.vscode/tasks.json' }),
          },
        ],
        options
      ),

    eslint: (options?: IInstallOptionsBase) =>
      Install.installFns.listOfBaseAndLog(
        [
          {
            pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: '.eslintignore' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.eslintignore' }),
          },
          {
            // had to use other filename to prevent from current eslint to try to use it in current project
            pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: 'config.eslintrc.js' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.eslintrc.js' }),
          },
        ],
        options
      ),

    husky: (options?: IInstallOptionsBase) =>
      Install.installFns.listOfBaseAndLog(
        [
          {
            pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: '.huskyrc.js' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.huskyrc.js' }),
          },
        ],
        options
      ),

    git: (options?: IInstallOptionsBase) =>
      Install.installFns.listOfBaseAndLog(
        [
          {
            // had to rename this file to gitignore otherwise npm would not publish it and the copy fails
            pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: 'gitignore' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.gitignore' }),
          },
        ],
        options
      ),

    nvm: (options?: IInstallOptionsBase) =>
      Install.installFns.listOfBaseAndLog(
        [
          {
            pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: '.nvmrc' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.nvmrc' }),
          },
        ],
        options
      ),

    prettier: (options?: IInstallOptionsBase) =>
      Install.installFns.listOfBaseAndLog(
        [
          {
            pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: '.prettierrc.js' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.prettierrc.js' }),
          },
        ],
        options
      ),

    stylelint: (options?: IInstallOptionsBase) =>
      Install.installFns.listOfBaseAndLog(
        [
          {
            pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: '.stylelintrc.js' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.stylelintrc.js' }),
          },
        ],
        options
      ),

    commitlint: (options?: IInstallOptionsBase) =>
      Install.installFns.listOfBaseAndLog(
        [
          {
            pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: 'commitlint.config.js' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: 'commitlint.config.js' }),
          },
        ],
        options
      ),

    jest: (options?: IInstallOptionsBase) =>
      Install.installFns.listOfBaseAndLog(
        [
          {
            pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: 'jest.config.js' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: 'jest.config.js' }),
          },
        ],
        options
      ),

    typescript: (options?: IInstallOptionsBase) =>
      Install.installFns.listOfBaseAndLog(
        [
          {
            pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: 'tsconfig.json' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: 'tsconfig.json' }),
          },
        ],
        options
      ),
  }
}
