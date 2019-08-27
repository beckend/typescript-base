"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncPackageDeps = void 0;
const fs_extra_1 = require("fs-extra");
const os_1 = require("os");
const syncPackageDeps = async ({ pathPackageSource, pathPackageSyncTo, }) => {
    const [packageSource, packageSyncTo] = await Promise.all([
        fs_extra_1.readJSON(pathPackageSource),
        fs_extra_1.readJSON(pathPackageSyncTo),
    ]);
    if (packageSource.dependencies && packageSyncTo.dependencies) {
        const newDependencies = {
            ...packageSyncTo.dependencies,
        };
        Object.keys(packageSyncTo.dependencies).forEach((k) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const versionPJSON = packageSource.dependencies[k];
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const versionPJSONSync = packageSyncTo.dependencies[k];
            if (versionPJSON && versionPJSONSync && versionPJSON !== versionPJSONSync) {
                newDependencies[k] = versionPJSON;
            }
        });
        if (JSON.stringify(packageSyncTo.dependencies) !== JSON.stringify(newDependencies)) {
            await fs_extra_1.writeFile(pathPackageSyncTo, JSON.stringify({
                ...packageSyncTo,
                dependencies: newDependencies,
            }, undefined, 2) + os_1.EOL);
            return { wroteFile: true };
        }
    }
    return { wroteFile: false };
};
exports.syncPackageDeps = syncPackageDeps;
