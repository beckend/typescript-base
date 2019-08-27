"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filePatcher_1 = require("../utils/filePatcher");
const config_1 = require("../config");
const { join } = filePatcher_1.FilePatcher.utils.path;
(async () => {
    const filePatcher = new filePatcher_1.FilePatcher({ logPrefix: __filename });
    await filePatcher.patchFiles({
        patchList: [
            {
                onFile: ({ content }) => ({
                    newContent: filePatcher_1.FilePatcher.utils.patchStringContent({
                        content,
                        stringMatch: `import _ts, { CompilerOptions, SourceFile, TransformerFactory } from 'typescript';`,
                        stringReplace: `import { CompilerOptions, SourceFile, TransformerFactory } from 'typescript';${filePatcher_1.FilePatcher.constants.EOL}import * as _ts from 'typescript';`,
                    }),
                }),
                pathFileInput: join(config_1.default.PATH.DIR.ROOT_NODE_MODULES, 'ts-jest/dist/types.d.ts'),
            },
        ],
    });
})();
