"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const config_1 = require("../config");
const base_1 = require("./base");
exports.getBaseIntegration = (opts) => base_1.getBase({
    isIntegration: true,
    preset: 'jest-puppeteer',
    testEnvironment: path_1.join(config_1.default.PATH.DIR.ROOT, 'jest.config.integration.testEnvironment.js'),
    ...opts,
});
