export interface IInstallOptionsBase {
    readonly overwrite?: boolean;
}
export declare class Install {
    static PATH: {
        DIR: {
            ROOT_APP: string;
            ROOT_INSTALL: string;
            FILES_INSTALL: string;
        };
        FILE: {
            ROOT_APP: {
                packageJSON: string;
            };
        };
    };
    static utils: {
        logger: any;
    };
    static getters: {
        fileInfo: ({ pathFile }: {
            readonly pathFile: string;
        }) => Promise<{
            exists: boolean;
            readable: boolean;
            writeable: boolean;
        }>;
        filePathRelativeToThisProjectRoot: ({ pathFile }: {
            readonly pathFile: string;
        }) => string;
        filePathRelativeToAppRoot: ({ pathFile }: {
            readonly pathFile: string;
        }) => string;
        filePathRelativeToInstallFiles: ({ pathFile }: {
            readonly pathFile: string;
        }) => string;
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
            readonly pathWriteBase?: string | undefined;
        }) => Promise<{
            wroteFile: boolean;
        }>;
        listOfBaseAndLog: (baseAndLogOptionsList: (IInstallOptionsBase & {
            readonly pathFileInput: string;
            readonly pathFileWrite: string;
            readonly pathWriteBase?: string | undefined;
        })[], options?: IInstallOptionsBase | undefined) => Promise<{
            wroteFile: boolean;
        }[]>;
        packageJSON: () => Promise<{
            new: any;
            original: any;
            wroteFile: boolean;
        }>;
        vscode: (options?: IInstallOptionsBase | undefined) => Promise<{
            wroteFile: boolean;
        }[]>;
        eslint: (options?: IInstallOptionsBase | undefined) => Promise<{
            wroteFile: boolean;
        }[]>;
        husky: (options?: IInstallOptionsBase | undefined) => Promise<{
            wroteFile: boolean;
        }[]>;
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
        commitlint: (options?: IInstallOptionsBase | undefined) => Promise<{
            wroteFile: boolean;
        }[]>;
        jest: (options?: IInstallOptionsBase | undefined) => Promise<{
            wroteFile: boolean;
        }[]>;
        typescript: (options?: IInstallOptionsBase | undefined) => Promise<{
            wroteFile: boolean;
        }[]>;
    };
}
