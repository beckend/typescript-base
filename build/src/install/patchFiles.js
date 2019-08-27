"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const filePatcher_1 = require("../utils/filePatcher");
const config_1 = require("../config");
(async () => {
    const filePatcher = new filePatcher_1.FilePatcher({ logPrefix: __filename });
    await filePatcher.patchFiles({
        patchList: [
            {
                onFile: ({ content }) => ({
                    newContent: filePatcher_1.FilePatcher.utils.patchStringContent({
                        content,
                        stringMatch: `process(input: string, filePath: Config.Path, jestConfig: Config.ProjectConfig, transformOptions?: TransformOptions): TransformedSource | string;`,
                        stringReplace: `process(input: string, filePath: Config.Path, jestConfig: Config.ProjectConfig | any, transformOptions?: TransformOptions): TransformedSource | string;`,
                    }),
                }),
                pathFileInput: path_1.join(config_1.default.PATH.DIR.ROOT_NODE_MODULES, 'ts-jest/dist/ts-jest-transformer.d.ts'),
            },
        ],
    });
})();
