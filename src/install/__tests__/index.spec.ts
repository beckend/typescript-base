/* eslint-disable import/first */
jest.mock('../../config', () => ({
  Configuration: {
    isTest: true,
  },

  default: {
    PATH: {
      DIR: {
        ROOT: '/root',
      },
    },
  },
}))

import { join } from 'path'

import { TestFramework } from '__tests__/testFramework'
import { Install as TargetModule, Install } from '..'

describe(TargetModule.name, () => {
  const tf = new TestFramework<typeof TargetModule>({
    moduleBasePath: __dirname,
    modulePath: 'src/install',
    moduleKey: 'Install',
  })

  const DIR_ROOT = join(__dirname, '../../..')

  TestFramework.setup.afterEach()

  describe('statics', () => {
    describe('DIR', () => {
      describe('ROOT_APP', () => {
        describe('Configuration.isTest', () => {
          it('true', () => {
            const { NewModule } = tf.utils.doMock({
              '../../config': {
                Configuration: {
                  isTest: true,
                },

                default: {
                  PATH: {
                    DIR: {
                      ROOT: '/root',
                    },
                  },
                },
              },
            })

            expect(NewModule.PATH.DIR.ROOT_APP).toEqual('/root')
          })

          it('false', () => {
            const { NewModule } = tf.utils.doMock({
              '../../config': {
                Configuration: {
                  isTest: false,
                },

                default: {
                  PATH: {
                    DIR: {
                      ROOT: '/root',
                    },
                  },
                },
              },
            })

            expect(NewModule.PATH.DIR.ROOT_APP).toEqual(DIR_ROOT)
          })
        })
      })
    })

    describe('getters', () => {
      describe('fileInfo', () => {
        const targetFnName = 'fileInfo'
        const targetFn = TargetModule.getters[targetFnName]

        it('file exists', () => {
          const pathFile = '/path/test.txt'

          TestFramework.utils.mockFS({
            [pathFile]: TestFramework.utils.mockFS.file({
              content: 'content',
            }),
          })

          return expect(
            targetFn({
              pathFile,
            })
          ).resolves.toMatchInlineSnapshot(`
            Object {
              "exists": true,
              "readable": true,
              "writeable": true,
            }
          `)
        })

        it('file does not exist', () =>
          expect(
            targetFn({
              pathFile: '/path/does/not/___REALLY/SHOULD__NOT/kinda-exist/test.txt',
            })
          ).resolves.toMatchInlineSnapshot(`
              Object {
                "exists": false,
                "readable": false,
                "writeable": false,
              }
          `))
      })

      describe('filePathRelativeToThisProjectRoot', () => {
        const targetFnName = 'filePathRelativeToThisProjectRoot'
        const targetFn = TargetModule.getters[targetFnName]

        it('returns expected', () => {
          expect(targetFn({ pathFile: 'path/test.txt' })).toEqual('/root/path/test.txt')
        })
      })

      describe('filePathRelativeToAppRoot', () => {
        const targetFnName = 'filePathRelativeToAppRoot'
        const targetFn = TargetModule.getters[targetFnName]

        it('returns expected', () => {
          expect(targetFn({ pathFile: 'path/test.txt' })).toEqual('/root/path/test.txt')
        })
      })

      describe('filePathRelativeToAppRoot', () => {
        const targetFnName = 'filePathRelativeToInstallFiles'
        const targetFn = TargetModule.getters[targetFnName]

        it('returns expected', () => {
          expect(targetFn({ pathFile: 'path/test.txt' })).toEqual('/root/src/install/files/path/test.txt')
        })
      })

      describe('typescriptBaseRC', () => {
        const targetFnName = 'typescriptBaseRC'
        const targetFn = TargetModule.getters[targetFnName]

        it('catch', () =>
          expect(targetFn()).resolves.toMatchInlineSnapshot(`
            Object {
              "filesToCopy": Object {
                "exclude": Array [],
              },
              "modifyPackageJSON": true,
            }
          `))
      })
    })

    describe('installFns', () => {
      describe('base', () => {
        const targetFnName = 'base'

        describe('overwrite false', () => {
          it('file does not exist', () => {
            const { NewModule } = tf.utils.doMock({
              'fs-extra': {
                createReadStream: TestFramework.DUMMY_VALUES.FN_NOOP,
                createWriteStream: TestFramework.DUMMY_VALUES.FN_NOOP,
                ensureDir: TestFramework.DUMMY_VALUES.FN_NOOP,
              },
              promisepipe: {
                default: () => TestFramework.getters.deferredPromise(({ resolve }) => resolve(undefined)),
              },
            })
            ;(NewModule as any).getters.fileInfo = () =>
              TestFramework.getters.deferredPromise(({ resolve }) =>
                resolve({
                  exists: false,
                  readable: false,
                  writeable: false,
                })
              )

            const targetNewFn = NewModule.installFns[targetFnName]

            return expect(targetNewFn({ pathFileInput: '/', pathFileWrite: '/tmp/_____test.txt' })).resolves
              .toMatchInlineSnapshot(`
                Object {
                  "exists": false,
                  "overwrite": false,
                  "wroteFile": true,
                }
              `)
          })

          // differences in CI causes this one to fail
          it('file exists', () => {
            const { NewModule } = tf.utils.doMock({
              'fs-extra': {
                createReadStream: TestFramework.DUMMY_VALUES.FN_NOOP,
                createWriteStream: TestFramework.DUMMY_VALUES.FN_NOOP,
              },
              promisepipe: {
                default: () => TestFramework.getters.deferredPromise(({ resolve }) => resolve(undefined)),
              },
            })
            ;(NewModule as any).getters.fileInfo = () =>
              TestFramework.getters.deferredPromise(({ resolve }) =>
                resolve({
                  exists: true,
                  readable: true,
                  writeable: true,
                })
              )

            const targetNewFn = NewModule.installFns[targetFnName]

            return expect(
              targetNewFn({ overwrite: false, pathFileInput: '/whatever', pathFileWrite: '/tmp/_____test.txt' })
            ).resolves.toMatchInlineSnapshot(`
              Object {
                "exists": true,
                "overwrite": false,
                "wroteFile": false,
              }
            `)
          })
        })

        describe('overwrite true', () => {
          it('file does not exists', () => {
            const NewModule = tf.getters.newModule()
            const targetNewFn = NewModule.installFns[targetFnName]
            ;(NewModule as any).getters.fileInfo = () =>
              TestFramework.getters.deferredPromise(({ resolve }) =>
                resolve({
                  exists: false,
                  readable: true,
                  writeable: true,
                })
              )

            const pathFileInput = '/path/to/custom/test/file.txt'

            TestFramework.utils.mockFS({
              [pathFileInput]: TestFramework.utils.mockFS.file({
                content: 'content',
              }),
            })

            return expect(
              targetNewFn({
                overwrite: true,
                pathFileInput,
                pathFileWrite: '/path/to/custom/test/file2.txt',
              })
            ).resolves.toMatchInlineSnapshot(`
              Object {
                "exists": false,
                "overwrite": true,
                "wroteFile": true,
              }
            `)
          })

          it('file exists', () => {
            const NewModule = tf.getters.newModule()
            const targetNewFn = NewModule.installFns[targetFnName]
            ;(NewModule as any).getters.fileInfo = () =>
              TestFramework.getters.deferredPromise(({ resolve }) =>
                resolve({
                  exists: true,
                  readable: true,
                  writeable: true,
                })
              )

            const pathFileWrite = '/path/to/custom/test/file.txt'

            TestFramework.utils.mockFS({
              [pathFileWrite]: TestFramework.utils.mockFS.file({
                content: 'content',
              }),
            })

            return expect(targetNewFn({ overwrite: true, pathFileInput: pathFileWrite, pathFileWrite })).resolves
              .toMatchInlineSnapshot(`
                Object {
                  "exists": true,
                  "overwrite": true,
                  "wroteFile": true,
                }
              `)
          })

          it('file exists but not writable', () => {
            const NewModule = tf.getters.newModule()
            const targetNewFn = NewModule.installFns[targetFnName]
            const pathFileWrite = '/path/to/custom/test/file.txt'
            ;(NewModule as any).getters.fileInfo = () =>
              TestFramework.getters.deferredPromise(({ resolve }) =>
                resolve({
                  exists: true,
                  readable: true,
                  writeable: false,
                })
              )

            TestFramework.utils.mockFS({
              [pathFileWrite]: TestFramework.utils.mockFS.file({
                content: 'content',
                // lul does not work, but suppose to work...
                mode: '0444',
              }),
            })

            return expect(targetNewFn({ overwrite: true, pathFileInput: pathFileWrite, pathFileWrite })).resolves
              .toMatchInlineSnapshot(`
                Object {
                  "exists": true,
                  "overwrite": true,
                  "wroteFile": false,
                }
              `)
          })
        })

        it('write error occurs', () => {
          const { NewModule } = tf.utils.doMock({
            'fs-extra': {
              createReadStream: TestFramework.DUMMY_VALUES.FN_NOOP,
              createWriteStream: TestFramework.DUMMY_VALUES.FN_NOOP,
              ensureDir: TestFramework.DUMMY_VALUES.FN_NOOP,
            },
            promisepipe: {
              default: () => TestFramework.getters.deferredPromise(({ reject }) => reject(new Error('nope'))),
            },
          })
          ;(NewModule as any).getters.fileInfo = () =>
            TestFramework.getters.deferredPromise(({ resolve }) =>
              resolve({
                exists: false,
                readable: true,
                writeable: true,
              })
            )

          const targetNewFn = NewModule.installFns[targetFnName]

          return expect(
            targetNewFn({ overwrite: true, pathFileInput: '/whatever', pathFileWrite: '/tmp/_____test.txt' })
          ).resolves.toMatchInlineSnapshot(`
            Object {
              "exists": false,
              "overwrite": true,
              "wroteFile": false,
            }
          `)
        })
      })

      describe('baseAndLog', () => {
        const targetFnName = 'baseAndLog'

        it('wroteFile true', async () => {
          const { NewModule, input } = tf.utils.doMock({
            'just-task': {
              logger: {
                info: jest.fn<void, [string]>(),
              },
            },
          })
          ;(NewModule as any).installFns.base = ({ overwrite }: any) =>
            TestFramework.getters.deferredPromise(({ resolve }) =>
              resolve({
                overwrite,
                wroteFile: true,
              })
            )

          const targetNewFn = NewModule.installFns[targetFnName]

          await Promise.all([
            expect(
              targetNewFn({
                overwrite: true,
                pathFileInput: 'pathFileInput',
                pathFileWrite: 'pathFileWrite',
              })
            ).resolves.toEqual({ wroteFile: true }),

            expect(
              targetNewFn({
                overwrite: false,
                pathFileInput: 'pathFileInput',
                pathFileWrite: 'pathFileWrite',
              })
            ).resolves.toEqual({ wroteFile: true }),
          ])

          expect(input['just-task'].logger.info).toHaveBeenCalledTimes(2)
          expect(input['just-task'].logger.info).toHaveBeenNthCalledWith(1, '"pathFileWrite" was overwritten.')
          expect(input['just-task'].logger.info).toHaveBeenNthCalledWith(2, '"pathFileWrite" was written.')
        })

        it('wroteFile false', async () => {
          const { NewModule, input } = tf.utils.doMock({
            'just-task': {
              logger: {
                info: jest.fn<void, [string]>(),
              },
            },
          })
          ;(NewModule as any).installFns.base = ({ overwrite }: any) =>
            TestFramework.getters.deferredPromise(({ resolve }) =>
              resolve({
                overwrite,
                wroteFile: false,
              })
            )

          const targetNewFn = NewModule.installFns[targetFnName]

          await expect(
            targetNewFn({
              overwrite: true,
              pathFileInput: 'pathFileInput',
              pathFileWrite: 'pathFileWrite',
            })
          ).resolves.toEqual({ wroteFile: false })

          TestFramework.utils
            .expectWithCalledTimes(input['just-task'].logger.info, 1)
            .toHaveBeenCalledWith('"pathFileWrite" was not written.')
        })

        it('skips write if it is exluded', async () => {
          const { NewModule, input } = tf.utils.doMock({
            'just-task': {
              logger: {
                info: jest.fn<void, [string]>(),
              },
            },
          })

          const targetNewFn = NewModule.installFns[targetFnName]

          await expect(
            targetNewFn({
              overwrite: true,
              pathFileInput: 'pathFileInput',
              pathFileWrite: 'pathFileWrite',
              typescriptBaseRC: {
                filesToCopy: {
                  exclude: ['pathFileWrite'],
                },
              },
            })
          ).resolves.toMatchInlineSnapshot(`
            Object {
              "wroteFile": false,
            }
          `)

          TestFramework.utils
            .expectWithCalledTimes(input['just-task'].logger.info, 1)
            .toHaveBeenCalledWith('"pathFileWrite" was not written.')
        })
      })

      describe('packageJSON', () => {
        const targetFnName = 'packageJSON'
        const targetFn = Install.installFns[targetFnName]
        const getBasePKGJSON = ({ scripts }: { readonly scripts?: { readonly [x: string]: string } } = {}) => ({
          scripts: {
            commit: 'git-cz',
            lint: 'eslint . --fix',
            release: 'standard-version',
            test: 'jest',
            'test:coverage': 'jest --coverage',
            'test:watch': 'jest --watchAll',
            'test:watch-coverage': 'jest --watchAll --coverage',
            ...scripts,
          },
        })

        it('does nothing if config says so', () =>
          expect(targetFn({ typescriptBaseRC: { modifyPackageJSON: false } })).resolves.toMatchInlineSnapshot(`
            Object {
              "new": undefined,
              "original": undefined,
              "wroteFile": false,
            }
          `))

        it('updates package json when it differs', async () => {
          const { NewModule, input } = tf.utils.doMock({
            'fs-extra': {
              readJson: () => TestFramework.getters.deferredPromise(({ resolve }) => resolve({})),
              writeJSON: () => TestFramework.getters.deferredPromise(({ resolve }) => resolve(undefined)),
            },
            'just-task': {
              logger: {
                info: jest.fn<void, [string]>(),
              },
            },
          })

          await expect(NewModule.installFns[targetFnName]()).resolves.toMatchInlineSnapshot(`
            Object {
              "new": Object {
                "scripts": Object {
                  "commit": "git-cz",
                  "lint": "eslint . --fix",
                  "release": "standard-version",
                  "test": "jest",
                  "test:coverage": "jest --coverage",
                  "test:watch": "jest --watchAll",
                  "test:watch-coverage": "jest --watchAll --coverage",
                },
              },
              "original": Object {},
              "wroteFile": true,
            }
          `)

          TestFramework.utils
            .expectWithCalledTimes(input['just-task'].logger.info, 1)
            .toHaveBeenCalledWith('updated package.json with core scripts.')
        })

        it('does nothing if not change detected', () => {
          const { NewModule } = tf.utils.doMock({
            'fs-extra': {
              readJson: () => TestFramework.getters.deferredPromise(({ resolve }) => resolve(getBasePKGJSON())),
            },
          })

          return expect(NewModule.installFns[targetFnName]()).resolves.toMatchInlineSnapshot(`
            Object {
              "new": Object {
                "scripts": Object {
                  "commit": "git-cz",
                  "lint": "eslint . --fix",
                  "release": "standard-version",
                  "test": "jest",
                  "test:coverage": "jest --coverage",
                  "test:watch": "jest --watchAll",
                  "test:watch-coverage": "jest --watchAll --coverage",
                },
              },
              "original": Object {
                "scripts": Object {
                  "commit": "git-cz",
                  "lint": "eslint . --fix",
                  "release": "standard-version",
                  "test": "jest",
                  "test:coverage": "jest --coverage",
                  "test:watch": "jest --watchAll",
                  "test:watch-coverage": "jest --watchAll --coverage",
                },
              },
              "wroteFile": false,
            }
          `)
        })

        it('empty scripts will add scripts', () => {
          const { NewModule } = tf.utils.doMock({
            'fs-extra': {
              readJson: () => TestFramework.getters.deferredPromise(({ resolve }) => resolve({ scripts: {} })),
              writeJSON: () => TestFramework.getters.deferredPromise(({ resolve }) => resolve(undefined)),
            },
          })

          return expect(NewModule.installFns[targetFnName]()).resolves.toMatchInlineSnapshot(`
            Object {
              "new": Object {
                "scripts": Object {
                  "commit": "git-cz",
                  "lint": "eslint . --fix",
                  "release": "standard-version",
                  "test": "jest",
                  "test:coverage": "jest --coverage",
                  "test:watch": "jest --watchAll",
                  "test:watch-coverage": "jest --watchAll --coverage",
                },
              },
              "original": Object {
                "scripts": Object {},
              },
              "wroteFile": true,
            }
          `)
        })

        it('script.test jest detected', () => {
          const { NewModule } = tf.utils.doMock({
            'fs-extra': {
              readJson: () =>
                TestFramework.getters.deferredPromise(({ resolve }) => resolve({ scripts: { test: 'jest' } })),
              writeJSON: () => TestFramework.getters.deferredPromise(({ resolve }) => resolve(undefined)),
            },
          })

          return expect(NewModule.installFns[targetFnName]()).resolves.toMatchInlineSnapshot(`
            Object {
              "new": Object {
                "scripts": Object {
                  "commit": "git-cz",
                  "lint": "eslint . --fix",
                  "release": "standard-version",
                  "test": "jest",
                  "test:coverage": "jest --coverage",
                  "test:watch": "jest --watchAll",
                  "test:watch-coverage": "jest --watchAll --coverage",
                },
              },
              "original": Object {
                "scripts": Object {
                  "test": "jest",
                },
              },
              "wroteFile": true,
            }
          `)
        })

        it('scripts.test not jest', () => {
          const { NewModule } = tf.utils.doMock({
            'fs-extra': {
              readJson: () =>
                TestFramework.getters.deferredPromise(({ resolve }) => resolve({ scripts: { test: 'mocha' } })),
              writeJSON: () => TestFramework.getters.deferredPromise(({ resolve }) => resolve(undefined)),
            },
          })

          return expect(NewModule.installFns[targetFnName]()).resolves.toMatchInlineSnapshot(`
            Object {
              "new": Object {
                "scripts": Object {
                  "commit": "git-cz",
                  "lint": "eslint . --fix",
                  "release": "standard-version",
                  "test": "mocha",
                },
              },
              "original": Object {
                "scripts": Object {
                  "test": "mocha",
                },
              },
              "wroteFile": true,
            }
          `)
        })
      })

      // comment to stop it from prettier
      ;[
        {
          name: 'vscode',
        },
        {
          name: 'eslint',
        },
        {
          name: 'husky',
        },
        {
          name: 'git',
        },
        {
          name: 'nvm',
        },
        {
          name: 'prettier',
        },
        {
          name: 'stylelint',
        },
        {
          name: 'commitlint',
        },
        {
          name: 'jest',
        },
        {
          name: 'typescript',
        },
        {
          name: 'editorconfig',
        },
      ].forEach(({ name }) => {
        it(name, async () => {
          const { NewModule } = tf.utils.doMock({
            '../../config': {
              Configuration: {
                isTest: true,
              },

              default: {
                PATH: {
                  DIR: {
                    ROOT: '/root',
                  },
                },
              },
            },
          })
          ;(NewModule as any).installFns.baseAndLog = (x: any) =>
            TestFramework.getters.deferredPromise(({ resolve }) => resolve(x))

          const targetNewFn = (NewModule as any).installFns[name]

          expect(
            await targetNewFn({
              overwrite: true,
            })
          ).toMatchSnapshot()
        })
      })
    })
  })
})
