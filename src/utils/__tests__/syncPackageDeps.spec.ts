import { TestFramework } from '__tests__/testFramework'

import { syncPackageDeps as targetModule } from '../syncPackageDeps'

describe(targetModule.name, () => {
  const tf = new TestFramework<typeof targetModule>({
    moduleBasePath: __dirname,
    modulePath: 'src/utils/syncPackageDeps.ts',
    moduleKey: 'syncPackageDeps',
  })

  it('does nothing if no deps in source package', async () => {
    const { NewModule: newModule, input } = tf.utils.doMock({
      'fs-extra': {
        readJSON: jest.fn().mockImplementation((path: string) => {
          expect(path).toEqual('/')
          return TestFramework.getters.deferredPromise<{}>(({ resolve }) => resolve({}))
        }),
        writeFile: jest.fn(),
      },
    })

    await expect(newModule({ pathPackageSource: '/', pathPackageSyncTo: '/' })).resolves.toEqual({
      wroteFile: false,
    })

    expect(input['fs-extra'].writeFile).not.toHaveBeenCalled()
  })

  it('does nothing if no deps in destination package', async () => {
    const { NewModule: newModule, input } = tf.utils.doMock({
      'fs-extra': {
        readJSON: jest.fn().mockImplementation((path: string) =>
          TestFramework.getters.deferredPromise<{}>(({ resolve }) =>
            resolve({
              dependencies: path === '/pathPackageSource' ? {} : undefined,
            })
          )
        ),
        writeFile: jest.fn(),
      },
    })

    await expect(
      newModule({ pathPackageSource: '/pathPackageSource', pathPackageSyncTo: '/pathPackageSyncTo' })
    ).resolves.toEqual({
      wroteFile: false,
    })

    expect(input['fs-extra'].writeFile).not.toHaveBeenCalled()
  })

  it('does not write if the deps are the same', async () => {
    const { NewModule: newModule, input } = tf.utils.doMock({
      'fs-extra': {
        readJSON: jest.fn().mockImplementation(() =>
          TestFramework.getters.deferredPromise<any>(({ resolve }) =>
            resolve({
              dependencies: {
                jest: '^24.8.0',
                nock: '^1.8.0',
              },
            })
          )
        ),
        writeFile: jest.fn(),
      },
    })

    await expect(
      newModule({ pathPackageSource: '/pathPackageSource', pathPackageSyncTo: '/pathPackageSyncTo' })
    ).resolves.toEqual({
      wroteFile: false,
    })

    expect(input['fs-extra'].writeFile).not.toHaveBeenCalled()
  })

  it('syncs source to destination', async () => {
    const { NewModule: newModule, input } = tf.utils.doMock({
      'fs-extra': {
        readJSON: jest.fn().mockImplementation((path: string) =>
          TestFramework.getters.deferredPromise<{}>(({ resolve }) =>
            resolve({
              dependencies:
                path === '/pathPackageSource'
                  ? {
                      jest: '^24.8.0',
                      nock: '^1.8.0',
                    }
                  : {
                      jest: '^4.8.0',
                      nock: '^1.6',
                    },
            })
          )
        ),
        writeFile: jest.fn(),
      },
    })

    await expect(
      newModule({ pathPackageSource: '/pathPackageSource', pathPackageSyncTo: '/pathPackageSyncTo' })
    ).resolves.toEqual({
      wroteFile: true,
    })

    TestFramework.utils.expectWithCalledTimes(input['fs-extra'].writeFile, 1).toHaveBeenCalledWith(
      '/pathPackageSyncTo',

      `{
  "dependencies": {
    "jest": "^24.8.0",
    "nock": "^1.8.0"
  }
}
`
    )
  })
})
