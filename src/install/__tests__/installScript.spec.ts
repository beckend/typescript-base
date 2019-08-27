import { TestFramework } from '__tests__/testFramework'

import { Install } from '..'

describe('install', () => {
  const tf = new TestFramework<undefined>({
    moduleBasePath: __dirname,
    modulePath: 'src/install/installScript',
  })

  describe('installScript', () => {
    it('does nothing if detected package name is the same as configuration', async () => {
      const packageName = 'packageName'

      const { input } = tf.utils.doMock({
        __mockOptions: {
          mergeOriginalModule: false,
        },

        'fs-extra': {
          readJson: (path: string) => {
            expect(path).toEqual('/path/to/packageJSON')

            return TestFramework.getters.deferredPromise(({ resolve }) =>
              resolve({
                name: packageName,
              })
            )
          },
        },

        '../../configuration': {
          Configuration: {
            packageJSON: {
              name: packageName,
            },
          },
        },

        '../index': {
          Install: {
            PATH: {
              FILE: {
                ROOT_APP: {
                  packageJSON: '/path/to/packageJSON',
                },
              },
            },

            utils: {
              logger: {
                info: jest.fn(),
              },
            },
          },
        },
      })

      // waiting for the module to do the work by queuing another nextTick
      await TestFramework.getters.deferredPromise<undefined>(({ resolve }) => resolve(undefined))

      TestFramework.utils
        .expectWithCalledTimes(input['../index'].Install.utils.logger.info, 1)
        .toHaveBeenCalledWith('Detected installation on own repo, exiting.')
    })

    it('handles errors', async () => {
      const rejectError = new Error('nope')

      const { input } = tf.utils.doMock({
        __mockOptions: {
          mergeOriginalModule: false,
        },

        'fs-extra': {
          readJson: () => TestFramework.getters.deferredPromise(({ reject }) => reject(rejectError)),
        },

        '../../configuration': {},

        '../index': {
          Install: {
            PATH: {
              FILE: {
                ROOT_APP: {
                  packageJSON: '/path/to/packageJSON',
                },
              },
            },

            utils: {
              logger: {
                error: jest.fn(),
              },
            },
          },
        },
      })

      // waiting for the module to do the work by queuing another nextTick
      await TestFramework.getters.deferredPromise<undefined>(({ resolve }) => resolve(undefined))

      TestFramework.utils
        .expectWithCalledTimes(input['../index'].Install.utils.logger.error, 1)
        .toHaveBeenCalledWith(rejectError)
    })

    it('copies files when applicable', async () => {
      const { input } = tf.utils.doMock({
        __mockOptions: {
          mergeOriginalModule: false,
        },

        'fs-extra': {
          readJson: () =>
            TestFramework.getters.deferredPromise(({ resolve }) =>
              resolve({
                name: 'one',
              })
            ),
        },

        '../../configuration': {
          Configuration: {
            packageJSON: {
              name: 'two',
            },
          },
        },

        '../index': {
          Install: {
            PATH: {
              FILE: {
                ROOT_APP: {
                  packageJSON: '/path/to/packageJSON',
                },
              },
            },

            getters: {
              typescriptBaseRC: () => Install.defaults.baseRC,
            },

            installFns: [
              'commitlint',
              'editorconfig',
              'eslint',
              'git',
              'husky',
              'jest',
              'nvm',
              'packageJSON',
              'prettier',
              'typescript',
              'vscode',
            ].reduce((acc, name) => {
              acc[name] = jest
                .fn<Promise<undefined>, undefined[]>()
                .mockImplementationOnce(() =>
                  TestFramework.getters.deferredPromise<undefined>(({ resolve }) => resolve(undefined))
                )

              return acc
            }, {} as { [x: string]: jest.Mock<Promise<undefined>, undefined[]> }),

            utils: {
              logger: {
                error: jest.fn(),
              },
            },
          },
        },
      })

      // waiting for the module to do the work by queuing another nextTick
      await TestFramework.getters.deferredPromise<undefined>(({ resolve }) => resolve(undefined))

      Object.values(input['../index'].Install.installFns).forEach((mockFn) => {
        TestFramework.utils
          .expectWithCalledTimes(mockFn, 1)
          .toHaveBeenCalledWith({ typescriptBaseRC: Install.defaults.baseRC })
      })
    })
  })
})
