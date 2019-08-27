"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// https://jestjs.io/docs/en/configuration.html
const path_1 = require("path");
const ts_jest_1 = require("ts-jest");
const utils_1 = require("ts-jest/utils");
const lodash_1 = require("lodash");
const config_1 = require("../config");
const array_1 = require("../modules/array");
const jestDefaults = require('jest-config').defaults;
exports.getBase = ({ isIntegration = false, isReact = false, moduleDirectories, onConfig, rootDir, roots, setupFilesAfterEnv: setupFilesAfterEnvInput, testEnvironment = 'jest-environment-jsdom-global', TSConfig, withDefaultSetupFilesAfterEnv = true, ...rest }) => {
    const isPuppeteer = rest.preset === 'jest-puppeteer';
    const moduleNameMapper = {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': path_1.join(config_1.default.PATH.DIR.ROOT_BUILD, '__mocks__/fileMock.js'),
        '\\.(css|less)$': path_1.join(config_1.default.PATH.DIR.ROOT_BUILD, '__mocks__/styleMock.js'),
    };
    const setupFilesAfterEnv = [
        ...array_1.returnArray(withDefaultSetupFilesAfterEnv &&
            [
                'jest-mock-console/dist/setupTestFramework.js',
                path_1.join(config_1.default.PATH.DIR.ROOT_BUILD, '__tests__/setupTestFramework.js'),
                isReact &&
                    testEnvironment.includes('jsdom') &&
                    path_1.join(config_1.default.PATH.DIR.ROOT_BUILD, '__tests__/setupTestFrameworkReact.js'),
                isPuppeteer && path_1.join(config_1.default.PATH.DIR.ROOT_BUILD, '__tests__/setupTestFrameworkIntegration.js'),
            ].filter(Boolean)),
        ...array_1.returnArray(setupFilesAfterEnvInput),
    ].filter(Boolean);
    if (TSConfig) {
        if (TSConfig.compilerOptions) {
            if (TSConfig.compilerOptions.paths) {
                Object.assign(moduleNameMapper, {
                    ...utils_1.pathsToModuleNameMapper(TSConfig.compilerOptions.paths, { prefix: '<rootDir>/' }),
                });
            }
        }
    }
    const jestConfig = lodash_1.merge({
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
        moduleDirectories: [...jestDefaults.moduleDirectories, ...array_1.returnArray(moduleDirectories)],
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
            ...ts_jest_1.jestPreset.transform,
        },
    }, rest);
    if (onConfig) {
        let userConfig = jestConfig;
        userConfig = onConfig({ config: jestConfig });
        return userConfig;
    }
    return jestConfig;
};
