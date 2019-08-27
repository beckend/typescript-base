import { FilePatcher } from './utils/filePatcher';
export declare const commitlint: {
    getBase: (options?: {
        readonly [x: string]: any;
    }) => {
        hooks: {
            'commit-msg': string;
            'pre-commit': string;
        };
    } & {
        readonly [x: string]: any;
    };
};
export declare const eslint: {
    getBase: ({ onConfig, packageDirs, pathFileTSConfig, ...rest }?: import("./eslint/base").IGetBaseOptions) => {
        extends: string[];
        parser: string;
        parserOptions: {
            createDefaultProgram: boolean;
            ecmaFeatures: {
                impliedStrict: boolean;
                modules: boolean;
            };
            ecmaVersion: number;
            project: any;
            sourceType: string;
        };
        plugins: string[];
        settings: {
            'import/resolver': {
                typescript: {
                    directory: any;
                };
            };
        };
        rules: {
            'jsx-a11y/control-has-associated-label': string;
            'prettier/prettier': string;
            'import/no-extraneous-dependencies': (string | {
                devDependencies: never[];
                packageDir: any[];
            })[];
            'import/no-unresolved': string;
            'import/extensions': string;
            'import/prefer-default-export': string;
            '@typescript-eslint/no-empty-function': string;
            '@typescript-eslint/indent': string;
            '@typescript-eslint/no-explicit-any': string;
            '@typescript-eslint/explicit-function-return-type': string;
            '@typescript-eslint/no-unused-vars': (string | {
                vars: string;
                args: string;
                ignoreRestSiblings: boolean;
            })[];
            '@typescript-eslint/interface-name-prefix': string[];
        };
    } & {
        readonly [x: string]: any;
    };
    getBaseReact: ({ packageDirs, pathFileTSConfig, ...rest }?: import("./eslint/base").IGetBaseOptions) => {
        extends: string[];
        parser: string;
        parserOptions: {
            createDefaultProgram: boolean;
            ecmaFeatures: {
                impliedStrict: boolean;
                modules: boolean;
            };
            ecmaVersion: number;
            project: any;
            sourceType: string;
        };
        plugins: string[];
        settings: {
            'import/resolver': {
                typescript: {
                    directory: any;
                };
            };
        };
        rules: {
            'jsx-a11y/control-has-associated-label': string;
            'prettier/prettier': string;
            'import/no-extraneous-dependencies': (string | {
                devDependencies: never[];
                packageDir: any[];
            })[];
            'import/no-unresolved': string;
            'import/extensions': string;
            'import/prefer-default-export': string;
            '@typescript-eslint/no-empty-function': string;
            '@typescript-eslint/indent': string;
            '@typescript-eslint/no-explicit-any': string;
            '@typescript-eslint/explicit-function-return-type': string;
            '@typescript-eslint/no-unused-vars': (string | {
                vars: string;
                args: string;
                ignoreRestSiblings: boolean;
            })[];
            '@typescript-eslint/interface-name-prefix': string[];
        };
    } & {
        readonly [x: string]: any;
    };
};
export declare const husky: {
    getBase: (options?: {
        readonly [x: string]: any;
    }) => {
        extends: string[];
    } & {
        readonly [x: string]: any;
    };
};
export declare const jest: {
    getBase: ({ isIntegration, isReact, moduleDirectories, onConfig, rootDir, roots, setupFilesAfterEnv: setupFilesAfterEnvInput, testEnvironment, TSConfig, withDefaultSetupFilesAfterEnv, ...rest }: import("./jest/base").IGetBaseOptions) => {
        collectCoverageFrom: string[];
        coverageDirectory: string;
        coverageThreshold: {
            global: {
                branches: number;
                functions: number;
                lines: number;
                statements: number;
            };
        };
        moduleDirectories: any[];
        moduleNameMapper: {
            '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': string;
            '\\.(css|less)$': string;
        };
        modulePaths: string[];
        resetMocks: boolean;
        resetModules: boolean;
        roots: string[] | undefined;
        rootDir: string;
        setupFilesAfterEnv: string[];
        testEnvironment: string;
        testMatch: string[];
        testPathIgnorePatterns: string[];
        transform: {};
    } & {
        readonly [x: string]: any;
        preset?: string | undefined;
    };
    getBaseIntegration: (opts: import("./jest/base").IGetBaseOptions) => {
        collectCoverageFrom: string[];
        coverageDirectory: string;
        coverageThreshold: {
            global: {
                branches: number;
                functions: number;
                lines: number;
                statements: number;
            };
        };
        moduleDirectories: any[];
        moduleNameMapper: {
            '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': string;
            '\\.(css|less)$': string;
        };
        modulePaths: string[];
        resetMocks: boolean;
        resetModules: boolean;
        roots: string[] | undefined;
        rootDir: string;
        setupFilesAfterEnv: string[];
        testEnvironment: string;
        testMatch: string[];
        testPathIgnorePatterns: string[];
        transform: {};
    } & {
        readonly [x: string]: any;
        preset?: string | undefined;
    };
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
    getBase: (options?: import("./model").TPartialReadonly<import("stylelint").Configuration>) => {
        plugins: never[];
        extends: string[];
        rules: {
            'function-name-case': null;
        };
        ignoreFiles: string[];
    } & import("./model").TPartialReadonly<import("stylelint").Configuration>;
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
