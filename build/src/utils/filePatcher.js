"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fsExtra = require("fs-extra");
const path = require("path");
const os_1 = require("os");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { logger } = require('just-task');
class FilePatcher {
    constructor({ logPrefix }) {
        this.patchFile = async ({ onFile, pathFileInput, pathFileOutput }) => {
            const content = await fsExtra.readFile(pathFileInput);
            const pathFileWrite = pathFileOutput || pathFileInput;
            const returned = await onFile({ content });
            if (returned && returned.newContent) {
                const contentStr = content.toString();
                const contentStrReturned = returned.newContent instanceof Buffer ? returned.newContent.toString() : returned.newContent;
                if (contentStr !== contentStrReturned) {
                    await fsExtra.writeFile(pathFileWrite, returned.newContent);
                    logger.info(`"${this.logPrefix}" - wrote file "${pathFileWrite}" successfully.`);
                    return {
                        wroteFile: true,
                    };
                }
                logger.warn(`"${this.logPrefix}" - Content was not changed, not writing to "${pathFileWrite}".`);
            }
            else {
                logger.warn(`"${this.logPrefix}" - Nothing returned from onFile callback.`);
            }
            return {
                wroteFile: false,
            };
        };
        this.patchFiles = ({ patchList }) => Promise.all(patchList.map(x => this.patchFile(x)));
        this.logPrefix = logPrefix;
    }
}
FilePatcher.constants = {
    EOL: os_1.EOL,
};
FilePatcher.utils = {
    fsExtra,
    logger,
    path,
    patchStringContent({ content, stringMatch, stringReplace, }) {
        const contentStr = content instanceof Buffer ? content.toString() : content;
        return contentStr.indexOf(stringMatch) === -1 ? contentStr : contentStr.replace(stringMatch, stringReplace);
    },
};
exports.FilePatcher = FilePatcher;
