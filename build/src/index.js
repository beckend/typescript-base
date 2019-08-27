"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = exports.stylelint = exports.prettier = exports.jest = exports.husky = exports.eslint = exports.commitlint = void 0;
const base_1 = require("./husky/base");
const base_2 = require("./eslint/base");
const base_3 = require("./commitlint/base");
const base_4 = require("./jest/base");
const base_integration_1 = require("./jest/base-integration");
const base_5 = require("./prettier/base");
const base_6 = require("./stylelint/base");
const base_react_1 = require("./eslint/base-react");
const filePatcher_1 = require("./utils/filePatcher");
const syncPackageDeps_1 = require("./utils/syncPackageDeps");
exports.commitlint = {
    getBase: base_1.getBase,
};
exports.eslint = {
    getBase: base_2.getBase,
    getBaseReact: base_react_1.getBaseReact,
};
exports.husky = {
    getBase: base_3.getBase,
};
exports.jest = {
    getBase: base_4.getBase,
    getBaseIntegration: base_integration_1.getBaseIntegration,
};
exports.prettier = {
    getBase: base_5.getBase,
};
exports.stylelint = {
    getBase: base_6.getBase,
};
exports.utils = {
    FilePatcher: filePatcher_1.FilePatcher,
    syncPackageDeps: syncPackageDeps_1.syncPackageDeps,
};
