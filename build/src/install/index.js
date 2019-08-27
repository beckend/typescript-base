"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Install = void 0;
const path_1 = require("path");
const just_task_1 = require("just-task");
const lodash_1 = require("lodash");
const fs = require("fs-extra");
const async_1 = require("async");
const array_1 = require("../modules/array");
const config_1 = require("../config");
const promisePipe = require('promisepipe');
const DIR = {
    // eslint-disable-next-line global-require
    ROOT_APP: config_1.Configuration.isTest ? '/root' : require('app-root-path').path,
};
class Install {
    static defaults = {
        baseRC: {
            filesToCopy: {
                exclude: [],
            },
            modifyPackageJSON: true,
        },
        encoding: 'utf8',
    };
    static PATH = {
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
    static utils = {
        logger: just_task_1.logger,
    };
    static getters = {
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
        pathRelativeToThisProjectRoot: ({ path }) => path_1.join(config_1.default.PATH.DIR.ROOT, path),
        pathRelativeToAppRoot: ({ path }) => path_1.join(Install.PATH.DIR.ROOT_APP, path),
        pathRelativeToInstallFiles: ({ path }) => path_1.join(Install.PATH.DIR.FILES_INSTALL, path),
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
    static installFns = {
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
        dirListOfBaseAndLog: async ({ pathDirInput, pathDirOutput }, { overwrite } = {}) => {
            const checkValidDir = (path) => fs.stat(path).then((stat) => {
                if (!stat.isDirectory()) {
                    throw new Error(`path does not exist or is not a directory: ${path}`);
                }
            });
            await checkValidDir(pathDirInput);
            return new Promise((resolve, reject) => {
                const walker = async_1.queue((path, callbackInput) => {
                    const callback = lodash_1.once(callbackInput);
                    fs.stat(path, (errStat, stats) => {
                        if (errStat) {
                            callback(errStat);
                        }
                        if (stats.isDirectory()) {
                            fs.readdir(path, (errReadDir, files) => {
                                if (errReadDir) {
                                    callback(errReadDir);
                                }
                                else {
                                    files.forEach((file) => {
                                        // eslint-disable-next-line @typescript-eslint/no-floating-promises
                                        walker.push(path_1.resolve(path, file));
                                    });
                                    callback();
                                }
                            });
                        }
                        else {
                            Install.installFns
                                .base({
                                overwrite,
                                pathFileInput: path,
                                pathFileWrite: path_1.join(pathDirOutput, path.replace(pathDirInput, '')),
                            })
                                .then(() => {
                                callback();
                            })
                                .catch(callback);
                        }
                    });
                }, 50);
                walker.error(reject);
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                walker.push(pathDirInput);
                walker.drain(resolve);
            });
        },
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
            if (!packageJSON.scripts.lint) {
                packageJSON.scripts.lint = "eslint './**/*.js' './**/*.ts' './**/*.tsx' --fix";
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
        vscode: (options) => Install.installFns.dirListOfBaseAndLog({
            pathDirInput: Install.getters.pathRelativeToThisProjectRoot({ path: '.vscode' }),
            pathDirOutput: Install.getters.pathRelativeToAppRoot({ path: '.vscode' }),
        }, options),
        eslint: (options) => Install.installFns.listOfBaseAndLog([
            {
                pathFileInput: Install.getters.pathRelativeToInstallFiles({ path: 'tsconfig.eslint.json' }),
                pathFileWrite: Install.getters.pathRelativeToAppRoot({ path: 'tsconfig.eslint.json' }),
            },
            {
                pathFileInput: Install.getters.pathRelativeToInstallFiles({ path: '.eslintignore' }),
                pathFileWrite: Install.getters.pathRelativeToAppRoot({ path: '.eslintignore' }),
            },
            {
                // had to use other filename to prevent from current eslint to try to use it in current project
                pathFileInput: Install.getters.pathRelativeToInstallFiles({ path: 'config.eslintrc.js' }),
                pathFileWrite: Install.getters.pathRelativeToAppRoot({ path: '.eslintrc.js' }),
            },
        ], options),
        husky: (options) => Install.installFns.dirListOfBaseAndLog({
            pathDirInput: Install.getters.pathRelativeToThisProjectRoot({ path: '.husky' }),
            pathDirOutput: Install.getters.pathRelativeToAppRoot({ path: '.husky' }),
        }, options),
        git: (options) => Install.installFns.listOfBaseAndLog({
            // had to rename this file to gitignore otherwise npm would not publish it and the copy fails
            pathFileInput: Install.getters.pathRelativeToInstallFiles({ path: 'gitignore' }),
            pathFileWrite: Install.getters.pathRelativeToAppRoot({ path: '.gitignore' }),
        }, options),
        nvm: (options) => Install.installFns.listOfBaseAndLog({
            pathFileInput: Install.getters.pathRelativeToInstallFiles({ path: '.nvmrc' }),
            pathFileWrite: Install.getters.pathRelativeToAppRoot({ path: '.nvmrc' }),
        }, options),
        prettier: (options) => Install.installFns.listOfBaseAndLog({
            pathFileInput: Install.getters.pathRelativeToInstallFiles({ path: '.prettierrc.js' }),
            pathFileWrite: Install.getters.pathRelativeToAppRoot({ path: '.prettierrc.js' }),
        }, options),
        stylelint: (options) => Install.installFns.listOfBaseAndLog({
            pathFileInput: Install.getters.pathRelativeToInstallFiles({ path: '.stylelintrc.js' }),
            pathFileWrite: Install.getters.pathRelativeToAppRoot({ path: '.stylelintrc.js' }),
        }, options),
        jest: (options) => Install.installFns.listOfBaseAndLog({
            pathFileInput: Install.getters.pathRelativeToInstallFiles({ path: 'jest.config.js' }),
            pathFileWrite: Install.getters.pathRelativeToAppRoot({ path: 'jest.config.js' }),
        }, options),
        typescript: (options) => Install.installFns.listOfBaseAndLog({
            pathFileInput: Install.getters.pathRelativeToInstallFiles({ path: 'tsconfig.json' }),
            pathFileWrite: Install.getters.pathRelativeToAppRoot({ path: 'tsconfig.json' }),
        }, options),
        editorconfig: (options) => Install.installFns.listOfBaseAndLog({
            pathFileInput: Install.getters.pathRelativeToInstallFiles({ path: '.editorconfig' }),
            pathFileWrite: Install.getters.pathRelativeToAppRoot({ path: '.editorconfig' }),
        }, options),
    };
}
exports.Install = Install;
