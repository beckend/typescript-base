import { getBase } from '../base'

describe('jest base config', () => {
  const rootDir = '/root'

  it('return expected format', () => {
    expect(
      getBase({
        hello: true,
        rootDir,
      })
    ).toMatchInlineSnapshot(`
      Object {
        "collectCoverageFrom": Array [
          "**/*.{ts,tsx}",
          "!**/*.d.ts",
          "!**/__*__/**",
        ],
        "coverageDirectory": "coverage",
        "coverageThreshold": Object {
          "global": Object {
            "branches": 80,
            "functions": 80,
            "lines": 80,
            "statements": -10,
          },
        },
        "hello": true,
        "moduleDirectories": Array [
          "node_modules",
        ],
        "moduleNameMapper": Object {
          "\\\\.(css|less)$": "/root/build/__mocks__/styleMock.js",
          "\\\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "/root/build/__mocks__/fileMock.js",
        },
        "modulePaths": Array [
          "<rootDir>",
        ],
        "resetMocks": true,
        "resetModules": true,
        "rootDir": "/root",
        "roots": undefined,
        "setupFilesAfterEnv": Array [
          "/root/build/__tests__/setupTestFramework.js",
        ],
        "testEnvironment": "jest-environment-jsdom",
        "testMatch": Array [
          "**/__tests__/**/*.spec.{ts,tsx}",
          "!**/__tests__/**/*.integration.spec.{ts,tsx}",
        ],
        "testPathIgnorePatterns": Array [
          "<rootDir>/node_modules",
          "<rootDir>/build",
          "<rootDir>/build-test",
        ],
        "transform": Object {
          "^.+\\\\.tsx?$": "ts-jest",
        },
      }
    `)
  })

  it('isReact', () => {
    expect(
      getBase({
        isReact: true,
        rootDir,
      })
    ).toMatchInlineSnapshot(`
      Object {
        "collectCoverageFrom": Array [
          "**/*.{ts,tsx}",
          "!**/*.d.ts",
          "!**/__*__/**",
        ],
        "coverageDirectory": "coverage",
        "coverageThreshold": Object {
          "global": Object {
            "branches": 80,
            "functions": 80,
            "lines": 80,
            "statements": -10,
          },
        },
        "moduleDirectories": Array [
          "node_modules",
        ],
        "moduleNameMapper": Object {
          "\\\\.(css|less)$": "/root/build/__mocks__/styleMock.js",
          "\\\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "/root/build/__mocks__/fileMock.js",
        },
        "modulePaths": Array [
          "<rootDir>",
        ],
        "resetMocks": true,
        "resetModules": true,
        "rootDir": "/root",
        "roots": undefined,
        "setupFilesAfterEnv": Array [
          "/root/build/__tests__/setupTestFramework.js",
          "/root/build/__tests__/setupTestFrameworkReact.js",
        ],
        "testEnvironment": "jest-environment-jsdom",
        "testMatch": Array [
          "**/__tests__/**/*.spec.{ts,tsx}",
          "!**/__tests__/**/*.integration.spec.{ts,tsx}",
        ],
        "testPathIgnorePatterns": Array [
          "<rootDir>/node_modules",
          "<rootDir>/build",
          "<rootDir>/build-test",
        ],
        "transform": Object {
          "^.+\\\\.tsx?$": "ts-jest",
        },
      }
    `)
  })

  describe('TSConfig', () => {
    it('adds paths config from ts-jest if available', () => {
      expect(
        getBase({
          TSConfig: {
            compilerOptions: {
              paths: {
                '*': ['src/*'],
              },
            },
          },

          rootDir,
        }).moduleNameMapper
      ).toMatchInlineSnapshot(`
        Object {
          "\\\\.(css|less)$": "/root/build/__mocks__/styleMock.js",
          "\\\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "/root/build/__mocks__/fileMock.js",
          "^(.*)$": "<rootDir>/src/$1",
        }
      `)
    })

    it('no compilerOptions', () => {
      expect(
        getBase({
          TSConfig: {},
          rootDir,
        }).moduleNameMapper
      ).toMatchInlineSnapshot(`
        Object {
          "\\\\.(css|less)$": "/root/build/__mocks__/styleMock.js",
          "\\\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "/root/build/__mocks__/fileMock.js",
        }
      `)
    })

    it('no compilerOptions.paths', () => {
      expect(
        getBase({
          TSConfig: {
            compilerOptions: {},
          },
          rootDir,
        }).moduleNameMapper
      ).toMatchInlineSnapshot(`
        Object {
          "\\\\.(css|less)$": "/root/build/__mocks__/styleMock.js",
          "\\\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "/root/build/__mocks__/fileMock.js",
        }
      `)
    })
  })

  describe('onConfig', () => {
    it('returns the mutated config', () => {
      expect(
        getBase({
          onConfig({ config }) {
            config.collectCoverageFrom.push('hello')

            return config
          },
          rootDir,
        })
      ).toMatchInlineSnapshot(`
        Object {
          "collectCoverageFrom": Array [
            "**/*.{ts,tsx}",
            "!**/*.d.ts",
            "!**/__*__/**",
            "hello",
          ],
          "coverageDirectory": "coverage",
          "coverageThreshold": Object {
            "global": Object {
              "branches": 80,
              "functions": 80,
              "lines": 80,
              "statements": -10,
            },
          },
          "moduleDirectories": Array [
            "node_modules",
          ],
          "moduleNameMapper": Object {
            "\\\\.(css|less)$": "/root/build/__mocks__/styleMock.js",
            "\\\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "/root/build/__mocks__/fileMock.js",
          },
          "modulePaths": Array [
            "<rootDir>",
          ],
          "resetMocks": true,
          "resetModules": true,
          "rootDir": "/root",
          "roots": undefined,
          "setupFilesAfterEnv": Array [
            "/root/build/__tests__/setupTestFramework.js",
          ],
          "testEnvironment": "jest-environment-jsdom",
          "testMatch": Array [
            "**/__tests__/**/*.spec.{ts,tsx}",
            "!**/__tests__/**/*.integration.spec.{ts,tsx}",
          ],
          "testPathIgnorePatterns": Array [
            "<rootDir>/node_modules",
            "<rootDir>/build",
            "<rootDir>/build-test",
          ],
          "transform": Object {
            "^.+\\\\.tsx?$": "ts-jest",
          },
        }
      `)
    })
  })
})
