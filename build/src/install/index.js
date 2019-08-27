"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Install = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
const path_1 = require("path");
const just_task_1 = require("just-task");
const lodash_1 = require("lodash");
const fs = require("fs-extra");
const array_1 = require("../modules/array");
const config_1 = require("../config");
const promisePipe = require('promisepipe');
const DIR = {
    // eslint-disable-next-line global-require
    ROOT_APP: config_1.Configuration.isTest ? '/root' : require('app-root-path').path,
};
let Install = /** @class */ (() => {
    class Install {
    }
    Install.defaults = {
        baseRC: {
            filesToCopy: {
                exclude: [],
            },
            modifyPackageJSON: true,
        },
    };
    Install.PATH = {
        DIR: {
            ROOT_INSTALL: path_1.join(config_1.default.PATH.DIR.ROOT, 'src/install'),
            FILES_INSTALL: path_1.join(config_1.default.PATH.DIR.ROOT, 'src/install/files'),
            ...DIR,
        },
        FILE: {
            ROOT_APP: {
                packageJSON: path_1.join(DIR.ROOT_APP, 'package.json'),
                typescriptBaseRC: path_1.join(DIR.ROOT_APP, 'typescriptbaserc.js'),
            },
        },
    };
    Install.utils = {
        logger: just_task_1.logger,
    };
    Install.getters = {
        async fileInfo({ pathFile }) {
            try {
                await fs
                    // eslint-disable-next-line no-bitwise
                    .access(pathFile, fs.constants.F_OK | fs.constants.W_OK);
                return {
                    exists: true,
                    readable: true,
                    writeable: true,
                };
            }
            catch ({ code }) {
                const errIsNotFound = code === 'ENOENT';
                return {
                    exists: !errIsNotFound,
                    readable: !errIsNotFound,
                    writeable: !errIsNotFound,
                };
            }
        },
        filePathRelativeToThisProjectRoot: ({ pathFile }) => path_1.join(config_1.default.PATH.DIR.ROOT, pathFile),
        filePathRelativeToAppRoot: ({ pathFile }) => path_1.join(Install.PATH.DIR.ROOT_APP, pathFile),
        filePathRelativeToInstallFiles: ({ pathFile }) => path_1.join(Install.PATH.DIR.FILES_INSTALL, pathFile),
        async typescriptBaseRC() {
            const { baseRC } = Install.defaults;
            try {
                return lodash_1.merge(baseRC, await Promise.resolve().then(() => require(Install.PATH.FILE.ROOT_APP.typescriptBaseRC)));
            }
            catch {
                return baseRC;
            }
        },
    };
    Install.installFns = {
        base: async ({ overwrite = false, pathFileInput, pathFileWrite, }) => {
            const { exists, writeable } = await Install.getters.fileInfo({
                pathFile: pathFileWrite,
            });
            const payloadNoWrite = {
                exists,
                overwrite,
                wroteFile: false,
            };
            const doWriteFile = async () => {
                try {
                    await fs.ensureDir(path_1.dirname(pathFileWrite));
                    await promisePipe(fs.createReadStream(pathFileInput), fs.createWriteStream(pathFileWrite));
                    return {
                        exists,
                        overwrite,
                        wroteFile: true,
                    };
                }
                catch {
                    return payloadNoWrite;
                }
            };
            if (overwrite) {
                if (!writeable) {
                    return payloadNoWrite;
                }
                return doWriteFile();
            }
            if (exists) {
                return payloadNoWrite;
            }
            return doWriteFile();
        },
        baseAndLog: async (x) => {
            const { pathWriteBase, pathFileWrite, typescriptBaseRC: typescriptBaseRCInput } = x;
            const writePath = path_1.join(pathWriteBase || '', pathFileWrite);
            const { filesToCopy } = typescriptBaseRCInput || (await Install.getters.typescriptBaseRC());
            const logNotWritten = () => {
                just_task_1.logger.info(`"${writePath}" was not written.`);
            };
            if (filesToCopy &&
                filesToCopy.exclude &&
                filesToCopy.exclude.includes(pathFileWrite.replace(Install.PATH.DIR.ROOT_APP, ''))) {
                logNotWritten();
                return {
                    wroteFile: false,
                };
            }
            const { overwrite, wroteFile } = await Install.installFns.base(x);
            if (wroteFile) {
                just_task_1.logger.info(`"${writePath}" was ${overwrite ? 'overwritten' : 'written'}.`);
            }
            else {
                logNotWritten();
            }
            return {
                wroteFile,
            };
        },
        listOfBaseAndLog: (baseAndLogOptionsList, options) => Promise.all(array_1.toArray(baseAndLogOptionsList).map((x) => Install.installFns.baseAndLog({
            ...options,
            ...x,
        }))),
        packageJSON: async ({ typescriptBaseRC: typescriptBaseRCInput, } = {}) => {
            const { modifyPackageJSON } = typescriptBaseRCInput || (await Install.getters.typescriptBaseRC());
            if (!modifyPackageJSON) {
                return {
                    new: undefined,
                    original: undefined,
                    wroteFile: false,
                };
            }
            const packageJSON = await fs.readJson(Install.PATH.FILE.ROOT_APP.packageJSON);
            const originalContent = JSON.stringify(packageJSON);
            if (!packageJSON.scripts) {
                packageJSON.scripts = {};
            }
            if (!packageJSON.scripts.commit) {
                packageJSON.scripts.commit = 'git-cz';
            }
            if (!packageJSON.scripts.lint) {
                packageJSON.scripts.lint = "eslint './**/*.js' './**/*.ts' './**/*.tsx' --fix";
            }
            if (!packageJSON.scripts.release) {
                packageJSON.scripts.release = 'standard-version';
            }
            if (!packageJSON.scripts.test ||
                (packageJSON.scripts.test && packageJSON.scripts.test.includes('Error: no test specified'))) {
                packageJSON.scripts.test = 'jest';
            }
            if (packageJSON.scripts.test === 'jest') {
                if (!packageJSON.scripts['test:coverage']) {
                    packageJSON.scripts['test:coverage'] = 'jest --coverage';
                }
                if (!packageJSON.scripts['test:watch']) {
                    packageJSON.scripts['test:watch'] = 'jest --watchAll';
                }
                if (!packageJSON.scripts['test:watch-coverage']) {
                    packageJSON.scripts['test:watch-coverage'] = 'jest --watchAll --coverage';
                }
            }
            const hasChanged = originalContent !== JSON.stringify(packageJSON);
            if (hasChanged) {
                await fs.writeJSON(Install.PATH.FILE.ROOT_APP.packageJSON, packageJSON, {
                    spaces: 2,
                });
                just_task_1.logger.info(`updated package.json with core scripts.`);
            }
            return {
                new: packageJSON,
                original: JSON.parse(originalContent),
                wroteFile: hasChanged,
            };
        },
        vscode: (options) => Install.installFns.listOfBaseAndLog([
            {
                pathFileInput: Install.getters.filePathRelativeToThisProjectRoot({ pathFile: '.vscode/extensions.json' }),
                pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.vscode/extensions.json' }),
            },
            {
                pathFileInput: Install.getters.filePathRelativeToThisProjectRoot({ pathFile: '.vscode/settings.json' }),
                pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.vscode/settings.json' }),
            },
            {
                pathFileInput: Install.getters.filePathRelativeToThisProjectRoot({ pathFile: '.vscode/tasks.json' }),
                pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.vscode/tasks.json' }),
            },
        ], options),
        eslint: (options) => Install.installFns.listOfBaseAndLog([
            {
                pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: '.eslintignore' }),
                pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.eslintignore' }),
            },
            {
                // had to use other filename to prevent from current eslint to try to use it in current project
                pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: 'config.eslintrc.js' }),
                pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.eslintrc.js' }),
            },
        ], options),
        husky: (options) => Install.installFns.listOfBaseAndLog({
            pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: '.huskyrc.js' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.huskyrc.js' }),
        }, options),
        git: (options) => Install.installFns.listOfBaseAndLog({
            // had to rename this file to gitignore otherwise npm would not publish it and the copy fails
            pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: 'gitignore' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.gitignore' }),
        }, options),
        nvm: (options) => Install.installFns.listOfBaseAndLog({
            pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: '.nvmrc' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.nvmrc' }),
        }, options),
        prettier: (options) => Install.installFns.listOfBaseAndLog({
            pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: '.prettierrc.js' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.prettierrc.js' }),
        }, options),
        stylelint: (options) => Install.installFns.listOfBaseAndLog({
            pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: '.stylelintrc.js' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.stylelintrc.js' }),
        }, options),
        commitlint: (options) => Install.installFns.listOfBaseAndLog({
            pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: 'commitlint.config.js' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: 'commitlint.config.js' }),
        }, options),
        jest: (options) => Install.installFns.listOfBaseAndLog({
            pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: 'jest.config.js' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: 'jest.config.js' }),
        }, options),
        typescript: (options) => Install.installFns.listOfBaseAndLog({
            pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: 'tsconfig.json' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: 'tsconfig.json' }),
        }, options),
        editorconfig: (options) => Install.installFns.listOfBaseAndLog({
            pathFileInput: Install.getters.filePathRelativeToInstallFiles({ pathFile: '.editorconfig' }),
            pathFileWrite: Install.getters.filePathRelativeToAppRoot({ pathFile: '.editorconfig' }),
        }, options),
    };
    return Install;
})();
exports.Install = Install;
