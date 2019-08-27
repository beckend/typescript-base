import { merge } from 'lodash';
export interface IGetBaseOptions {
    readonly onConfig?: (x: {
        readonly config: ReturnType<typeof getBase>;
        readonly defaults: typeof defaults;
        readonly merge: typeof merge;
    }) => ReturnType<typeof getBase>;
    readonly isReact?: boolean;
    readonly [x: string]: any;
}
declare const defaults: {
    'import/no-extraneous-dependencies': {
        devDependencies: string[];
    };
};
export declare const getBase: ({ onConfig, isReact, packageDirs, pathFileTSConfig, ...rest }?: IGetBaseOptions) => {
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
export {};
