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

// need to mock fs in order to run these tests
describe.skip(TargetModule.name, () => {
  const tf = new TestFramework<typeof TargetModule>({
    moduleBasePath: __dirname,
    modulePath: 'src/install',
    moduleKey: 'Install',
  })

  const DIR_ROOT = join(__dirname, '../../..')

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

      describe('pathRelativeToThisProjectRoot', () => {
        const targetFnName = 'pathRelativeToThisProjectRoot'
        const targetFn = TargetModule.getters[targetFnName]

        it('returns expected', () => {
          expect(targetFn({ path: 'path/test.txt' })).toEqual('/root/path/test.txt')
        })
      })

      describe('pathRelativeToAppRoot', () => {
        const targetFnName = 'pathRelativeToAppRoot'
        const targetFn = TargetModule.getters[targetFnName]

        it('returns expected', () => {
          expect(targetFn({ path: 'path/test.txt' })).toEqual('/root/path/test.txt')
        })
      })

      describe('pathRelativeToInstallFiles', () => {
        const targetFnName = 'pathRelativeToInstallFiles'
        const targetFn = TargetModule.getters[targetFnName]

        it('returns expected', () => {
          expect(targetFn({ path: 'path/test.txt' })).toEqual('/root/src/install/files/path/test.txt')
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(NewModule as any).getters.fileInfo = () =>
              TestFramework.getters.deferredPromise(({ resolve }) =>
                resolve({
                  exists: false,
                  readable: true,
                  writeable: true,
                })
              )

            const pathFileInput = '/path/to/custom/test/file.txt'

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(NewModule as any).getters.fileInfo = () =>
              TestFramework.getters.deferredPromise(({ resolve }) =>
                resolve({
                  exists: true,
                  readable: true,
                  writeable: true,
                })
              )

            const pathFileWrite = '/path/to/custom/test/file.txt'

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(NewModule as any).getters.fileInfo = () =>
              TestFramework.getters.deferredPromise(({ resolve }) =>
                resolve({
                  exists: true,
                  readable: true,
                  writeable: false,
                })
              )

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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      describe('dirListOfBaseAndLog', () => {
        const targetFnName = 'dirListOfBaseAndLog'

        describe('success', () => {
          it('works as expected', async () => {
            const paths = {
              dir: {
                in: '/path-in',
                out: '/path-out',
              },
            }

            const stateLocal = {
              filesWritten: 0,
            }

            const { NewModule } = tf.utils.doMock({
              'fs-extra': {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                stat(path: string, callback: any) {
                  if (path === paths.dir.in) {
                    return TestFramework.getters.deferredPromise(({ resolve }) => {
                      const returned = {
                        isDirectory: () => true,
                      }

                      resolve(returned)

                      if (callback) {
                        callback(undefined, returned)
                      }
                    })
                  }

                  return TestFramework.getters.deferredPromise(({ resolve }) => {
                    const returned = {
                      isDirectory: () => false,
                    }

                    resolve(returned)

                    if (callback) {
                      callback(undefined, returned)
                    }
                  })
                },

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                readdir(path: string, callback: any) {
                  if (path === paths.dir.in) {
                    return TestFramework.getters.deferredPromise(({ resolve }) => {
                      const returned = Array.from({ length: 10 }).map((_, index) => join(paths.dir.in, `file-${index}`))

                      resolve(returned)

                      if (callback) {
                        callback(undefined, returned)
                      }
                    })
                  }

                  throw new Error('this should not happen in this test.')
                },
              },
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(NewModule as any).installFns.base = (x: any) => {
              expect(typeof x.overwrite).toEqual('boolean')
              expect(typeof x.pathFileInput).toEqual('string')
              expect(typeof x.pathFileWrite).toEqual('string')

              stateLocal.filesWritten++

              return TestFramework.getters.deferredPromise(({ resolve }) => {
                resolve(undefined)
              })
            }

            const targetNewFn = NewModule.installFns[targetFnName]

            await targetNewFn({ pathDirInput: paths.dir.in, pathDirOutput: paths.dir.out }, { overwrite: true })

            expect(stateLocal.filesWritten).toEqual(10)
          })
        })

        describe('failure', () => {
          it('dir in or out does not exists', async () => {
            const paths = {
              dir: {
                in: '/path-in',
                out: '/path-out',
              },
            }

            const { NewModule } = tf.utils.doMock({
              'fs-extra': {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                stat(path: string, callback: any) {
                  if (path === paths.dir.in) {
                    return TestFramework.getters.deferredPromise(({ resolve }) => {
                      const returned = {
                        isDirectory: () => false,
                      }

                      resolve(returned)

                      if (callback) {
                        callback(undefined, returned)
                      }
                    })
                  }

                  throw new Error('Should not happen')
                },
              },
            })

            const targetNewFn = NewModule.installFns[targetFnName]

            await expect(
              targetNewFn({
                pathDirInput: paths.dir.in,
                pathDirOutput: paths.dir.out,
              })
            ).rejects.toThrowError(/path does not exist or is not a directory/)
          })

          it('file in directory cannot be read', async () => {
            const paths = {
              dir: {
                in: '/path-in',
                out: '/path-out',
              },
            }

            const { NewModule } = tf.utils.doMock({
              'fs-extra': {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                stat(path: string, callback: any) {
                  if (path === paths.dir.in) {
                    return TestFramework.getters.deferredPromise(({ resolve }) => {
                      const returned = {
                        isDirectory: () => true,
                      }

                      resolve(returned)

                      if (callback) {
                        callback(undefined, returned)
                      }
                    })
                  }

                  return TestFramework.getters.deferredPromise(({ resolve }) => {
                    const returned = {
                      isDirectory: () => false,
                    }

                    resolve(returned)

                    if (callback) {
                      // this test will fail here
                      callback(new Error('fail'), returned)
                    }
                  })
                },

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                readdir(path: string, callback: any) {
                  if (path === paths.dir.in) {
                    return TestFramework.getters.deferredPromise(({ resolve }) => {
                      const returned = Array.from({ length: 10 }).map((_, index) => join(paths.dir.in, `file-${index}`))

                      resolve(returned)

                      if (callback) {
                        callback(undefined, returned)
                      }
                    })
                  }

                  throw new Error('this should not happen in this test.')
                },
              },
            })

            const targetNewFn = NewModule.installFns[targetFnName]

            return expect(
              targetNewFn({ pathDirInput: paths.dir.in, pathDirOutput: paths.dir.out }, { overwrite: true })
            ).rejects.toThrowError('fail')
          })

          it('directory cannot be read', async () => {
            const paths = {
              dir: {
                in: '/path-in',
                out: '/path-out',
              },
            }

            const { NewModule } = tf.utils.doMock({
              'fs-extra': {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                stat(path: string, callback: any) {
                  if (path === paths.dir.in) {
                    return TestFramework.getters.deferredPromise(({ resolve }) => {
                      const returned = {
                        isDirectory: () => true,
                      }

                      resolve(returned)

                      if (callback) {
                        callback(undefined, returned)
                      }
                    })
                  }

                  return TestFramework.getters.deferredPromise(({ resolve }) => {
                    const returned = {
                      isDirectory: () => false,
                    }

                    resolve(returned)

                    if (callback) {
                      callback(undefined, returned)
                    }
                  })
                },

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                readdir(path: string, callback: any) {
                  if (path === paths.dir.in) {
                    return TestFramework.getters.deferredPromise(({ resolve }) => {
                      const returned = Array.from({ length: 10 }).map((_, index) => join(paths.dir.in, `file-${index}`))

                      resolve(returned)

                      if (callback) {
                        // Fail here
                        callback(new Error('fail'), returned)
                      }
                    })
                  }

                  throw new Error('this should not happen in this test.')
                },
              },
            })

            const targetNewFn = NewModule.installFns[targetFnName]

            return expect(
              targetNewFn({ pathDirInput: paths.dir.in, pathDirOutput: paths.dir.out }, { overwrite: true })
            ).rejects.toThrowError('fail')
          })

          it('fails to write', async () => {
            const paths = {
              dir: {
                in: '/path-in',
                out: '/path-out',
              },
            }

            const { NewModule } = tf.utils.doMock({
              'fs-extra': {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                stat(path: string, callback: any) {
                  if ([paths.dir.in, paths.dir.out].includes(path)) {
                    return TestFramework.getters.deferredPromise(({ resolve }) => {
                      const returned = {
                        isDirectory: () => true,
                      }

                      resolve(returned)

                      if (callback) {
                        callback(undefined, returned)
                      }
                    })
                  }

                  return TestFramework.getters.deferredPromise(({ resolve }) => {
                    const returned = {
                      isDirectory: () => false,
                    }

                    resolve(returned)

                    if (callback) {
                      callback(undefined, returned)
                    }
                  })
                },

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                readdir(path: string, callback: any) {
                  if (path === paths.dir.in) {
                    return TestFramework.getters.deferredPromise(({ resolve }) => {
                      const returned = Array.from({ length: 10 }).map((_, index) => join(paths.dir.in, `file-${index}`))

                      resolve(returned)

                      if (callback) {
                        callback(undefined, returned)
                      }
                    })
                  }

                  throw new Error('this should not happen in this test.')
                },
              },
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(NewModule as any).installFns.base = () =>
              TestFramework.getters.deferredPromise(({ reject }) => {
                reject(new Error('fail'))
              })

            const targetNewFn = NewModule.installFns[targetFnName]
            return expect(
              targetNewFn({ pathDirInput: paths.dir.in, pathDirOutput: paths.dir.out }, { overwrite: true })
            ).rejects.toThrowError('fail')
          })
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        it('skips write if it is excluded', async () => {
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
                        "lint": "eslint './**/*.js' './**/*.ts' './**/*.tsx' --fix",
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
                          "lint": "eslint './**/*.js' './**/*.ts' './**/*.tsx' --fix",
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
                          "lint": "eslint './**/*.js' './**/*.ts' './**/*.tsx' --fix",
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
                          "lint": "eslint './**/*.js' './**/*.ts' './**/*.tsx' --fix",
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

          const mocks = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fnDummyPromise: (x: any) => TestFramework.getters.deferredPromise(({ resolve }) => resolve(x)),
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Object.assign((NewModule as any).installFns, {
            baseAndLog: mocks.fnDummyPromise,
            dirListOfBaseAndLog: mocks.fnDummyPromise,
          })

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
