import { IGetBaseOptions } from './base';
export declare const getBaseReact: ({ packageDirs, pathFileTSConfig, ...rest }?: IGetBaseOptions) => {
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
