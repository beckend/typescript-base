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
export declare const getBase: ({ isIntegration, isReact, moduleDirectories, onConfig, rootDir, roots, setupFilesAfterEnv: setupFilesAfterEnvInput, testEnvironment, TSConfig, withDefaultSetupFilesAfterEnv, ...rest }: IGetBaseOptions) => {
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
