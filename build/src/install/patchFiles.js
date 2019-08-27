"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filePatcher_1 = require("../utils/filePatcher");
(async () => {
    const filePatcher = new filePatcher_1.FilePatcher({ logPrefix: __filename });
    await filePatcher.patchFiles({
        patchList: [],
    });
})();
