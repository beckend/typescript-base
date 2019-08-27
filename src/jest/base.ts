// https://jestjs.io/docs/en/configuration.html
import type { InitialOptionsTsJest } from 'ts-jest/dist/types'
import { join } from 'path'
import { defaults as tsJestPreset } from 'ts-jest/presets'
import { pathsToModuleNameMapper } from 'ts-jest/utils'
import { merge } from 'lodash'
import * as jestConfig from 'jest-config'

import configuration from '../config'
import { returnArray } from '../modules/array'

export interface IGetBaseOptions {
  readonly TSConfig?: {
    readonly compilerOptions?: {
      readonly paths?: {
        readonly [x: string]: string[]
      }
    }
  }
  readonly isIntegration?: boolean
  readonly isReact?: boolean

  readonly moduleDirectories?: string[]
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly onConfig?: (x: { readonly config: any }) => any
  readonly preset?: string
  readonly rootDir: string
  readonly roots?: string[]
  readonly setupFilesAfterEnv?: string[]
  readonly testEnvironment?: string
  readonly withDefaultSetupFilesAfterEnv?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly [x: string]: any
}

export const getBase = ({
  isIntegration = false,
  isReact = false,
  moduleDirectories,
  onConfig,
  rootDir,
  roots,
  setupFilesAfterEnv: setupFilesAfterEnvInput,
  testEnvironment = 'jest-environment-jsdom',
  TSConfig,
  withDefaultSetupFilesAfterEnv = true,
  ...rest
}: IGetBaseOptions): InitialOptionsTsJest => {
  const isPuppeteer = rest.preset === 'jest-puppeteer'

  const moduleNameMapper = {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': join(
      configuration.PATH.DIR.ROOT_BUILD,
      '__mocks__/fileMock.js'
    ),
    '\\.(css|less)$': join(configuration.PATH.DIR.ROOT_BUILD, '__mocks__/styleMock.js'),
  }

  const setupFilesAfterEnv: string[] = [
    ...returnArray(
      withDefaultSetupFilesAfterEnv &&
        [
          join(configuration.PATH.DIR.ROOT_BUILD, '__tests__/setupTestFramework.js'),

          isReact &&
            testEnvironment.includes('jsdom') &&
            join(configuration.PATH.DIR.ROOT_BUILD, '__tests__/setupTestFrameworkReact.js'),

          isPuppeteer && join(configuration.PATH.DIR.ROOT_BUILD, '__tests__/setupTestFrameworkIntegration.js'),
        ].filter(Boolean)
    ),
    ...returnArray(setupFilesAfterEnvInput),
  ].filter(Boolean)

  if (TSConfig) {
    if (TSConfig.compilerOptions) {
      if (TSConfig.compilerOptions.paths) {
        Object.assign(moduleNameMapper, {
          ...pathsToModuleNameMapper(TSConfig.compilerOptions.paths, { prefix: '<rootDir>/' }),
        })
      }
    }
  }

  const config = merge(
    {
      // An array of glob patterns indicating a set of files for which coverage information should be collected. If a file matches the specified glob pattern, coverage information will be collected for it even if no tests exist for this file and it's never required in the test suite.
      collectCoverageFrom: ['**/*.{ts,tsx}', '!**/*.d.ts', '!**/__*__/**'],

      coverageDirectory: 'coverage',
      coverageThreshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: -10,
        },
      },
      moduleDirectories: [...jestConfig.defaults.moduleDirectories, ...returnArray(moduleDirectories)],
      moduleNameMapper,
      modulePaths: ['<rootDir>'],

      resetMocks: true,
      resetModules: true,

      // A list of paths to directories that Jest should use to search for tests in.
      roots,

      // Default: The root of the directory containing your jest's config file or the package.json or the pwd if no package.json is found
      rootDir,

      // The path to a module that runs some code to configure or set up the testing framework before each test
      setupFilesAfterEnv,

      // The test environment that will be used for testing
      testEnvironment,

      // The glob patterns Jest uses to detect test files
      testMatch: [
        ...(isIntegration
          ? ['**/__tests__/**/*.integration.spec.{ts,tsx}']
          : ['**/__tests__/**/*.spec.{ts,tsx}', '!**/__tests__/**/*.integration.spec.{ts,tsx}']),
      ].filter(Boolean),

      // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
      testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/build', '<rootDir>/build-test'],

      transform: {
        ...tsJestPreset.transform,
      },

      // @TODO swc cannot compile this project
      // transform: {
      //   '^.+\\.(t|j)sx?$': [
      //     '@swc-node/jest',

      //     // https://github.com/Brooooooklyn/swc-node/blob/master/packages/core/index.ts#L9s
      //     {
      //       dynamicImport: true,
      //       keepClassNames: true,
      //       target: 'es2019',
      //     },
      //   ],
      // },
    } as InitialOptionsTsJest,
    rest
  )

  if (onConfig) {
    let userConfig = config

    userConfig = onConfig({ config })

    return userConfig
  }

  return config
}
