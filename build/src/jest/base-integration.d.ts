import { IGetBaseOptions } from './base';
export declare const getBaseIntegration: (opts: IGetBaseOptions) => {
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
    transform: {
        [x: string]: string | import("@jest/types/build/Config").TransformerConfig;
    };
} & {
    readonly [x: string]: any;
    preset?: string | undefined;
};
