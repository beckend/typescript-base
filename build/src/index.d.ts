import { FilePatcher } from './utils/filePatcher';
export declare const eslint: {
    getBase: ({ onConfig, isReact, packageDirs, pathFileTSConfig, ...rest }?: import("./eslint/base").IGetBaseOptions) => {
        root: boolean;
        extends: string[];
        parserOptions: {
            extraFileExtensions: string[];
            project: any;
        };
        settings: {
            'import/parsers': {
                '@typescript-eslint/parser': string[];
            };
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: boolean;
                    project: any[];
                };
            };
        };
        rules: {
            'import/no-extraneous-dependencies': (string | {
                devDependencies: never[];
                packageDir: any[];
            })[];
            '@typescript-eslint/no-floating-promises': (string | {
                ignoreIIFE: boolean;
            })[];
            'no-plusplus': string;
            '@typescript-eslint/unbound-method': string;
            '@typescript-eslint/explicit-module-boundary-types': string;
            '@typescript-eslint/no-var-requires': string;
            '@typescript-eslint/no-unsafe-return': string;
            '@typescript-eslint/no-unsafe-assignment': string;
            '@typescript-eslint/no-unsafe-call': string;
            '@typescript-eslint/no-unsafe-member-access': string;
            'import/prefer-default-export': string;
        };
    } & {
        readonly [x: string]: any;
    };
};
export declare const jest: {
    getBase: ({ isIntegration, isReact, moduleDirectories, onConfig, rootDir, roots, setupFilesAfterEnv: setupFilesAfterEnvInput, testEnvironment, TSConfig, withDefaultSetupFilesAfterEnv, ...rest }: import("./jest/base").IGetBaseOptions) => import("ts-jest/dist/types").InitialOptionsTsJest;
    getBaseIntegration: (opts: import("./jest/base").IGetBaseOptions) => import("ts-jest/dist/types").InitialOptionsTsJest;
};
export declare const prettier: {
    getBase: (options?: {
        readonly [x: string]: any;
    }) => {
        semi: boolean;
        trailingComma: string;
        singleQuote: boolean;
        printWidth: number;
        tabWidth: number;
    } & {
        readonly [x: string]: any;
    };
};
export declare const stylelint: {
    getBase: ({ onConfig, ...options }?: import("./model").TPartialReadonly<import("stylelint").Configuration> & import("./stylelint/base").IGetBaseOptions) => {
        plugins: never[];
        extends: string[];
        rules: {
            'function-name-case': null;
        };
        ignoreFiles: string[];
    } & {
        readonly [x: string]: any;
        rules?: Record<string, any> | undefined;
        extends?: string | string[] | undefined;
        plugins?: string[] | undefined;
        processors?: string[] | undefined;
        ignoreFiles?: string | string[] | undefined;
        defaultSeverity?: import("stylelint").Severity | undefined;
        isReact?: boolean | undefined;
    };
};
export declare const utils: {
    FilePatcher: typeof FilePatcher;
    syncPackageDeps: ({ pathPackageSource, pathPackageSyncTo, }: {
        readonly pathPackageSource: string;
        readonly pathPackageSyncTo: string;
    }) => Promise<{
        wroteFile: boolean;
    }>;
};
