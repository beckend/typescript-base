"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBase = void 0;
const lodash_1 = require("lodash");
exports.getBase = (options = {}) => lodash_1.merge({
    semi: false,
    trailingComma: 'es5',
    singleQuote: true,
    printWidth: 120,
    tabWidth: 2,
}, options);
