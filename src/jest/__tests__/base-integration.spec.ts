import { getBaseIntegration } from '../base-integration'

describe('jest base config', () => {
  const rootDir = '/root'

  it('return expected format', () => {
    expect(
      getBaseIntegration({
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
        "preset": "jest-puppeteer",
        "resetMocks": true,
        "resetModules": true,
        "rootDir": "/root",
        "roots": undefined,
        "setupFilesAfterEnv": Array [
          "jest-mock-console/dist/setupTestFramework.js",
          "/root/build/__tests__/setupTestFramework.js",
          "/root/build/__tests__/setupTestFrameworkIntegration.js",
        ],
        "testEnvironment": "/root/jest.config.integration.testEnvironment.js",
        "testMatch": Array [
          "**/__tests__/**/*.integration.spec.{ts,tsx}",
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
