"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const packageJSON = require("../package.json");
class Configuration {
    constructor({ pathRoot }) {
        this.PATH = Configuration.createPathsConfig({ pathRoot });
    }
    static createPathsConfig({ pathRoot: THE_ROOT }) {
        return {
            DIR: {
                ROOT: THE_ROOT,
                ROOT_BUILD: path_1.join(THE_ROOT, 'build'),
                ROOT_NODE_MODULES: path_1.join(THE_ROOT, 'node_modules'),
            },
        };
    }
}
Configuration.packageJSON = packageJSON;
Configuration.isBuild = __filename.endsWith('.js');
Configuration.isTest = process.env.NODE_ENV === 'test';
exports.Configuration = Configuration;
