"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBase = void 0;
const lodash_1 = require("lodash");
const getBase = ({ onConfig, ...options } = {}) => {
    const results = lodash_1.merge({
        plugins: [],
        extends: ['stylelint-config-recommended'],
        rules: {
            'function-name-case': null,
        },
        ignoreFiles: ['./node_modules/**/*'],
    }, options);
    if (typeof onConfig === 'function') {
        // this is just to let typescript infer the type
        let resultsModified = results;
        resultsModified = onConfig({ config: results, merge: lodash_1.merge });
        return resultsModified;
    }
    return results;
};
exports.getBase = getBase;
