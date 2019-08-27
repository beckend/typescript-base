"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = exports.stylelint = exports.prettier = exports.jest = exports.eslint = void 0;
const base_1 = require("./eslint/base");
const base_2 = require("./jest/base");
const base_integration_1 = require("./jest/base-integration");
const base_3 = require("./prettier/base");
const base_4 = require("./stylelint/base");
const filePatcher_1 = require("./utils/filePatcher");
const syncPackageDeps_1 = require("./utils/syncPackageDeps");
exports.eslint = {
    getBase: base_1.getBase,
};
exports.jest = {
    getBase: base_2.getBase,
    getBaseIntegration: base_integration_1.getBaseIntegration,
};
exports.prettier = {
    getBase: base_3.getBase,
};
exports.stylelint = {
    getBase: base_4.getBase,
};
exports.utils = {
    FilePatcher: filePatcher_1.FilePatcher,
    syncPackageDeps: syncPackageDeps_1.syncPackageDeps,
};
