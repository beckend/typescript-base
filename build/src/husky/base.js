"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBase = void 0;
const lodash_1 = require("lodash");
exports.getBase = (options = {}) => lodash_1.merge({
    hooks: {
        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
        'pre-commit': 'concurrently "npm run test" "npm run lint"',
    },
}, options);
