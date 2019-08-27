"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const _1 = require(".");
const configuration_1 = require("../configuration");
(async () => {
    try {
        const packageJSONFromAppRoot = await fs.readJson(_1.Install.PATH.FILE.ROOT_APP.packageJSON);
        if (configuration_1.Configuration.packageJSON.name === packageJSONFromAppRoot.name) {
            _1.Install.utils.logger.info('Detected installation on own repo, exiting.');
            return;
        }
        const { installFns } = _1.Install;
        await Promise.all([
            installFns.commitlint,
            installFns.eslint,
            installFns.git,
            installFns.husky,
            installFns.jest,
            installFns.nvm,
            installFns.packageJSON,
            installFns.prettier,
            installFns.typescript,
            installFns.vscode,
        ].map(x => x()));
    }
    catch (err) {
        _1.Install.utils.logger.error(err);
    }
})();
