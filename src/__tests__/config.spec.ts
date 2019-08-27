import { join } from 'path'

import { TestFramework } from '__tests__/testFramework'

import { Configuration as TargetModule } from '../config'

describe('config', () => {
  const tf = new TestFramework<typeof TargetModule>({
    moduleBasePath: __dirname,
    modulePath: 'src/config',
    moduleKey: 'default',
  })

  const dirnameRelativeToTargetModule = join(__dirname, '..')

  const getConfigurationClass = ({ isBuild, isTest }: { readonly isBuild: boolean; readonly isTest: boolean }) =>
    class MockConfiguration {
      public static isBuild = isBuild

      public static isTest = isTest

      public testPayload: any = {}

      public constructor(opts: any) {
        Object.assign(this.testPayload, opts)
      }
    }

  describe('sets correct root DIR', () => {
    describe('Configuration.isTest', () => {
      describe('true', () => {
        const isTest = true

        describe('Configuration.isBuild', () => {
          it('true', () => {
            const { NewModule } = tf.utils.doMock({
              '../configuration': {
                Configuration: getConfigurationClass({ isBuild: true, isTest }),
              },
            })

            expect((NewModule as any).testPayload.pathRoot).toEqual(join(dirnameRelativeToTargetModule, '../..'))
          })

          it('false', () => {
            const { NewModule } = tf.utils.doMock({
              '../configuration': {
                Configuration: getConfigurationClass({ isBuild: false, isTest }),
              },
            })

            expect((NewModule as any).testPayload.pathRoot).toEqual('/root')
          })
        })
      })

      describe('false', () => {
        const isTest = false

        describe('Configuration.isBuild', () => {
          it('true', () => {
            const { NewModule } = tf.utils.doMock({
              '../configuration': {
                Configuration: getConfigurationClass({ isBuild: true, isTest }),
              },
            })

            expect((NewModule as any).testPayload.pathRoot).toEqual(join(dirnameRelativeToTargetModule, '../..'))
          })

          it('false', () => {
            const { NewModule } = tf.utils.doMock({
              '../configuration': {
                Configuration: getConfigurationClass({ isBuild: false, isTest }),
              },
            })

            expect((NewModule as any).testPayload.pathRoot).toEqual(join(dirnameRelativeToTargetModule, '..'))
          })
        })
      })
    })
  })
})
