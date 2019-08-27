"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
exports.getBase = (options = {}) => lodash_1.merge({
    plugins: [],
    extends: ['stylelint-config-recommended'],
    rules: {
        'function-name-case': null,
    },
    ignoreFiles: ['./node_modules/**/*'],
}, options);
