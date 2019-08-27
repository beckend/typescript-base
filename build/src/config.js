"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const configuration_1 = require("./configuration");
exports.Configuration = configuration_1.Configuration;
exports.default = new configuration_1.Configuration({
    pathRoot: path_1.join(configuration_1.Configuration.isTest && !configuration_1.Configuration.isBuild ? '/root/__NOT_USED__' : __dirname, configuration_1.Configuration.isBuild ? '../..' : '..'),
});
