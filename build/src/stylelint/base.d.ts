import { merge } from 'lodash';
import { Configuration } from 'stylelint';
import { TPartialReadonly } from '../model';
export interface IGetBaseOptions {
    readonly onConfig?: (x: {
        readonly config: ReturnType<typeof getBase>;
        readonly merge: typeof merge;
    }) => ReturnType<typeof getBase>;
    readonly isReact?: boolean;
    readonly [x: string]: any;
}
export declare const getBase: ({ onConfig, ...options }?: TPartialReadonly<Configuration> & IGetBaseOptions) => {
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
