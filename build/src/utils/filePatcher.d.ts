/// <reference types="node" />
import * as fsExtra from 'fs-extra';
import * as path from 'path';
export declare type TPatchFileOnFile = (x: {
    readonly content: Buffer;
}) => {
    readonly newContent: string | Buffer;
} | Promise<{
    readonly newContent: string | Buffer;
}> | void;
export interface IPatchFileOptions {
    readonly onFile: TPatchFileOnFile;
    readonly pathFileInput: string;
    readonly pathFileOutput?: string;
}
export declare class FilePatcher {
    static constants: {
        EOL: string;
    };
    static utils: {
        fsExtra: typeof fsExtra;
        logger: import("just-task").Logger;
        path: path.PlatformPath;
        patchStringContent({ content, stringMatch, stringReplace, }: {
            readonly content: string | Buffer;
            readonly stringMatch: string;
            readonly stringReplace: string;
        }): string;
    };
    logPrefix: string;
    constructor({ logPrefix }: {
        readonly logPrefix: string;
    });
    patchFile: ({ onFile, pathFileInput, pathFileOutput }: IPatchFileOptions) => Promise<{
        wroteFile: boolean;
    }>;
    patchFiles: ({ patchList }: {
        readonly patchList: IPatchFileOptions[];
    }) => Promise<{
        wroteFile: boolean;
    }[]>;
}
