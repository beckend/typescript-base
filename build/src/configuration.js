"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = void 0;
const path_1 = require("path");
const packageJSON = require("../package.json");
class Configuration {
    static packageJSON = packageJSON;
    static isBuild = __filename.endsWith('.js');
    static isTest = process.env.NODE_ENV === 'test';
    static createPathsConfig({ pathRoot: THE_ROOT }) {
        return {
            DIR: {
                ROOT: THE_ROOT,
                ROOT_BUILD: path_1.join(THE_ROOT, 'build'),
                ROOT_NODE_MODULES: path_1.join(THE_ROOT, 'node_modules'),
            },
        };
    }
    PATH;
    constructor({ pathRoot }) {
        this.PATH = Configuration.createPathsConfig({ pathRoot });
    }
}
exports.Configuration = Configuration;
