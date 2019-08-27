"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseIntegration = void 0;
const path_1 = require("path");
const config_1 = require("../config");
const base_1 = require("./base");
const getBaseIntegration = (opts) => base_1.getBase({
    isIntegration: true,
    testEnvironment: path_1.join(config_1.default.PATH.DIR.ROOT, 'jest.config.integration.testEnvironment.js'),
    ...opts,
});
exports.getBaseIntegration = getBaseIntegration;
