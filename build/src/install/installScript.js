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
        const typescriptBaseRC = await _1.Install.getters.typescriptBaseRC();
        await Promise.all([
            installFns.editorconfig,
            installFns.eslint,
            installFns.git,
            installFns.husky,
            installFns.jest,
            installFns.nvm,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            installFns.packageJSON,
            installFns.prettier,
            installFns.typescript,
            installFns.vscode,
        ].map((x) => x({ typescriptBaseRC })));
    }
    catch (err) {
        _1.Install.utils.logger.error(err);
    }
})();
