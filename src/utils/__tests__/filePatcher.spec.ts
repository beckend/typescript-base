/* eslint-disable import/first */
jest.mock('just-task')

import { TestFramework } from '__tests__/testFramework'

import { FilePatcher as TargetModule } from '../filePatcher'

describe('utils', () => {
  const tf = new TestFramework<typeof TargetModule>({
    moduleBasePath: __dirname,
    modulePath: 'src/utils/filePatcher.ts',
    moduleKey: 'FilePatcher',
  })

  const defaults = {
    constructorOptions: {
      logPrefix: 'test',
    },
  }

  describe(TargetModule.name, () => {
    describe('statics', () => {
      describe('utils', () => {
        describe('getString', () => {
          const targetName: keyof typeof TargetModule.utils = 'getString'

          it('string', () => {
            expect(
              TargetModule.utils[targetName]({
                content: '1234',
              })
            ).toEqual('1234')
          })

          it('buffer', () => {
            expect(
              TargetModule.utils[targetName]({
                content: Buffer.from('1234'),
              })
            ).toEqual('1234')
          })
        })

        describe('addWhenNotExist', () => {
          const targetName: keyof typeof TargetModule.utils = 'addWhenNotExist'

          describe('string', () => {
            it('added when not exist', () => {
              expect(
                TargetModule.utils[targetName]({
                  content: '1234',
                  contentAdded: 'hello',
                })
              ).toMatchInlineSnapshot(`
                "hello
                1234"
              `)
            })

            it('exist and not added', () => {
              expect(
                TargetModule.utils[targetName]({
                  content: '1234',
                  contentAdded: '1234',
                })
              ).toEqual('1234')
            })

            describe('options', () => {
              describe('addEOL', () => {
                it('not passed', () => {
                  expect(
                    TargetModule.utils[targetName]({
                      content: '1234',
                      contentAdded: 'hello',
                    })
                  ).toMatchInlineSnapshot(`
                    "hello
                    1234"
                  `)
                })

                it('true', () => {
                  expect(
                    TargetModule.utils[targetName]({
                      addEOL: true,
                      content: '1234',
                      contentAdded: 'hello',
                    })
                  ).toMatchInlineSnapshot(`
                    "hello
                    1234"
                  `)
                })

                it('false', () => {
                  expect(
                    TargetModule.utils[targetName]({
                      addEOL: false,
                      content: '1234',
                      contentAdded: 'hello',
                    })
                  ).toMatchInlineSnapshot(`"hello1234"`)
                })
              })
            })
          })
        })

        describe('patchStringContent', () => {
          const targetName: keyof typeof TargetModule.utils = 'patchStringContent'

          describe('string', () => {
            it('string match and replace', () => {
              expect(
                TargetModule.utils[targetName]({
                  content: '1234',
                  stringMatch: '12',
                  stringReplace: '33',
                })
              ).toEqual('3334')
            })

            it('no match', () => {
              expect(
                TargetModule.utils[targetName]({
                  content: '1234',
                  stringMatch: '432432',
                  stringReplace: '33',
                })
              ).toEqual('1234')
            })
          })
        })
      })
    })

    describe('constructor', () => {
      it('works', () => {
        expect(() => new TargetModule({ logPrefix: 'test' })).not.toThrow()
      })
    })

    describe('instance', () => {
      describe('patchFile', () => {
        const targetName: keyof TargetModule = 'patchFile'

        describe('success', () => {
          it('option pathFileInput only', () => {
            const pathFileInput = 'pathFileInput'

            const { NewModule } = tf.utils.doMock({
              'fs-extra': {
                readFile: (inputFilename: string) => {
                  expect(inputFilename).toEqual(pathFileInput)

                  return TestFramework.getters.deferredPromise<Buffer>(({ resolve }) => resolve(Buffer.from('1234')))
                },
                writeFile: (inputFilename: string) => {
                  expect(inputFilename).toEqual(pathFileInput)
                  return TestFramework.getters.deferredPromise(({ resolve }) => resolve(undefined))
                },
              },
            })

            const instance = new NewModule(defaults.constructorOptions)

            return expect(
              instance[targetName]({
                onFile({ content }) {
                  return { newContent: `${content.toString()}-more-content` }
                },
                pathFileInput,
              })
            ).resolves.toEqual({ wroteFile: true })
          })

          it('option pathFileInput and pathFileOutput and buffer onFile callback', () => {
            const pathFileInput = 'pathFileInput'
            const pathFileOutput = 'pathFileOutput'

            const { NewModule } = tf.utils.doMock({
              'fs-extra': {
                readFile: (inputFilename: string) => {
                  expect(inputFilename).toEqual(pathFileInput)

                  return TestFramework.getters.deferredPromise<Buffer>(({ resolve }) => resolve(Buffer.from('1234')))
                },
                writeFile: (inputFilename: string) => {
                  expect(inputFilename).toEqual(pathFileOutput)
                  return TestFramework.getters.deferredPromise(({ resolve }) => resolve(undefined))
                },
              },
            })

            const instance = new NewModule(defaults.constructorOptions)

            return expect(
              instance[targetName]({
                onFile({ content }) {
                  return { newContent: Buffer.from(`${content.toString()}-more-content`) }
                },
                pathFileInput,
                pathFileOutput,
              })
            ).resolves.toEqual({ wroteFile: true })
          })
        })

        describe('no write', () => {
          it('nothing returned from onFile callback', () => {
            const { NewModule } = tf.utils.doMock({
              'fs-extra': {
                readFile: () =>
                  TestFramework.getters.deferredPromise<Buffer>(({ resolve }) => resolve(Buffer.from('1234'))),
              },
            })

            const instance = new NewModule(defaults.constructorOptions)

            return expect(
              instance[targetName]({
                onFile() {},
                pathFileInput: 'pathFileInput',
              })
            ).resolves.toEqual({ wroteFile: false })
          })

          it('onFile callback does not modify the content', () => {
            const { NewModule } = tf.utils.doMock({
              'fs-extra': {
                readFile: () =>
                  TestFramework.getters.deferredPromise<Buffer>(({ resolve }) => resolve(Buffer.from('1234'))),
              },
            })

            const instance = new NewModule(defaults.constructorOptions)

            return expect(
              instance[targetName]({
                onFile: ({ content }) => ({ newContent: content }),
                pathFileInput: 'pathFileInput',
              })
            ).resolves.toEqual({ wroteFile: false })
          })
        })
      })

      describe('patchFiles', () => {
        const targetName: keyof TargetModule = 'patchFiles'

        it('option patchList', () => {
          const instance = new TargetModule(defaults.constructorOptions)

          instance.patchFile = () => TestFramework.getters.deferredPromise(({ resolve }) => resolve(undefined))

          return expect(
            instance[targetName]({
              patchList: [
                {
                  onFile() {},
                  pathFileInput: '/tmp/test.txt',
                },
              ],
            })
          ).resolves.toMatchInlineSnapshot(`
                                Array [
                                  undefined,
                                ]
                            `)
        })
      })
    })
  })
})
