import type { InitialOptionsTsJest } from 'ts-jest/dist/types';
export interface IGetBaseOptions {
    readonly TSConfig?: {
        readonly compilerOptions?: {
            readonly paths?: {
                readonly [x: string]: string[];
            };
        };
    };
    readonly isIntegration?: boolean;
    readonly isReact?: boolean;
    readonly moduleDirectories?: string[];
    readonly onConfig?: (x: {
        readonly config: any;
    }) => any;
    readonly preset?: string;
    readonly rootDir: string;
    readonly roots?: string[];
    readonly setupFilesAfterEnv?: string[];
    readonly testEnvironment?: string;
    readonly withDefaultSetupFilesAfterEnv?: boolean;
    readonly [x: string]: any;
}
export declare const getBase: ({ isIntegration, isReact, moduleDirectories, onConfig, rootDir, roots, setupFilesAfterEnv: setupFilesAfterEnvInput, testEnvironment, TSConfig, withDefaultSetupFilesAfterEnv, ...rest }: IGetBaseOptions) => InitialOptionsTsJest;
