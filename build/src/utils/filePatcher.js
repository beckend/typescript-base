"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilePatcher = void 0;
const os_1 = require("os");
const just_task_1 = require("just-task");
const fsExtra = require("fs-extra");
const path = require("path");
class FilePatcher {
    static constants = {
        EOL: os_1.EOL,
    };
    static utils = {
        fsExtra,
        logger: just_task_1.logger,
        path,
        addWhenNotExist({ addEOL = true, content, contentAdded, }) {
            const contentStr = FilePatcher.utils.getString({ content });
            if (contentStr.indexOf(contentAdded) === -1) {
                return contentAdded + (addEOL ? os_1.EOL : '') + contentStr;
            }
            return contentStr;
        },
        getString({ content }) {
            return content instanceof Buffer ? content.toString() : content;
        },
        patchStringContent({ content, stringMatch, stringReplace, }) {
            const contentStr = FilePatcher.utils.getString({ content });
            return contentStr.indexOf(stringMatch) === -1 ? contentStr : contentStr.replace(stringMatch, stringReplace);
        },
    };
    logPrefix;
    constructor({ logPrefix }) {
        this.logPrefix = logPrefix;
    }
    patchFile = async ({ onFile, pathFileInput, pathFileOutput }) => {
        const content = await fsExtra.readFile(pathFileInput);
        const pathFileWrite = pathFileOutput || pathFileInput;
        const returned = await onFile({ content });
        if (returned && returned.newContent) {
            const contentStr = content.toString();
            const contentStrReturned = returned.newContent instanceof Buffer ? returned.newContent.toString() : returned.newContent;
            if (contentStr !== contentStrReturned) {
                await fsExtra.writeFile(pathFileWrite, returned.newContent);
                just_task_1.logger.info(`"${this.logPrefix}" - wrote file "${pathFileWrite}" successfully.`);
                return {
                    wroteFile: true,
                };
            }
            just_task_1.logger.warn(`"${this.logPrefix}" - Content was not changed, not writing to "${pathFileWrite}".`);
        }
        else {
            just_task_1.logger.warn(`"${this.logPrefix}" - Nothing returned from onFile callback.`);
        }
        return {
            wroteFile: false,
        };
    };
    patchFiles = ({ patchList }) => Promise.all(patchList.map((x) => this.patchFile(x)));
}
exports.FilePatcher = FilePatcher;
