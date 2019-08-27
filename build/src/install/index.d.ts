export interface IInstallOptionsBase {
    readonly overwrite?: boolean;
    readonly typescriptBaseRC?: ITypescriptBaseRC;
}
export interface ITypescriptBaseRC {
    readonly filesToCopy?: {
        readonly exclude?: Array<string>;
    };
    readonly modifyPackageJSON?: boolean;
}
export declare class Install {
    static defaults: {
        baseRC: {
            filesToCopy: {
                exclude: string[];
            };
            modifyPackageJSON: boolean;
        };
        encoding: string;
    };
    static PATH: {
        DIR: {
            ROOT_APP: string;
            ROOT_INSTALL: string;
            FILES_INSTALL: string;
        };
        FILE: {
            ROOT_APP: {
                packageJSON: string;
                typescriptBaseRC: string;
            };
        };
    };
    static utils: {
        logger: import("just-task").Logger;
    };
    static getters: {
        fileInfo({ pathFile }: {
            readonly pathFile: string;
        }): Promise<{
            exists: boolean;
            readable: boolean;
            writeable: boolean;
        }>;
        pathRelativeToThisProjectRoot: ({ path }: {
            readonly path: string;
        }) => string;
        pathRelativeToAppRoot: ({ path }: {
            readonly path: string;
        }) => string;
        pathRelativeToInstallFiles: ({ path }: {
            readonly path: string;
        }) => string;
        typescriptBaseRC(): Promise<{
            filesToCopy: {
                exclude: string[];
            };
            modifyPackageJSON: boolean;
        }>;
    };
    static installFns: {
        base: ({ overwrite, pathFileInput, pathFileWrite, }: IInstallOptionsBase & {
            readonly pathFileInput: string;
            readonly pathFileWrite: string;
        }) => Promise<{
            exists: boolean;
            overwrite: boolean;
            wroteFile: boolean;
        }>;
        baseAndLog: (x: IInstallOptionsBase & {
            readonly pathFileInput: string;
            readonly pathFileWrite: string;
            readonly pathWriteBase?: string;
        }) => Promise<{
            wroteFile: boolean;
        }>;
        listOfBaseAndLog: (baseAndLogOptionsList: Array<IInstallOptionsBase & {
            readonly pathFileInput: string;
            readonly pathFileWrite: string;
            readonly pathWriteBase?: string;
        }> | (IInstallOptionsBase & {
            readonly pathFileInput: string;
            readonly pathFileWrite: string;
            readonly pathWriteBase?: string;
        }), options?: IInstallOptionsBase | undefined) => Promise<{
            wroteFile: boolean;
        }[]>;
        dirListOfBaseAndLog: <T1 extends {
            readonly pathDirInput: string;
            readonly pathDirOutput: string;
        }>({ pathDirInput, pathDirOutput }: T1, { overwrite }?: IInstallOptionsBase) => Promise<void>;
        packageJSON: ({ typescriptBaseRC: typescriptBaseRCInput, }?: {
            typescriptBaseRC?: IInstallOptionsBase['typescriptBaseRC'];
        }) => Promise<{
            new: any;
            original: any;
            wroteFile: boolean;
        }>;
        vscode: (options?: IInstallOptionsBase | undefined) => Promise<void>;
        eslint: (options?: IInstallOptionsBase | undefined) => Promise<{
            wroteFile: boolean;
        }[]>;
        husky: (options?: IInstallOptionsBase | undefined) => Promise<void>;
        git: (options?: IInstallOptionsBase | undefined) => Promise<{
            wroteFile: boolean;
        }[]>;
        nvm: (options?: IInstallOptionsBase | undefined) => Promise<{
            wroteFile: boolean;
        }[]>;
        prettier: (options?: IInstallOptionsBase | undefined) => Promise<{
            wroteFile: boolean;
        }[]>;
        stylelint: (options?: IInstallOptionsBase | undefined) => Promise<{
            wroteFile: boolean;
        }[]>;
        jest: (options?: IInstallOptionsBase | undefined) => Promise<{
            wroteFile: boolean;
        }[]>;
        typescript: (options?: IInstallOptionsBase | undefined) => Promise<{
            wroteFile: boolean;
        }[]>;
        editorconfig: (options?: IInstallOptionsBase | undefined) => Promise<{
            wroteFile: boolean;
        }[]>;
    };
}
