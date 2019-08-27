import { Configuration } from 'stylelint';
import { TPartialReadonly } from '../model';
export declare const getBase: (options?: TPartialReadonly<Configuration>) => {
    plugins: never[];
    extends: string[];
    rules: {
        'function-name-case': null;
    };
    ignoreFiles: string[];
} & TPartialReadonly<Configuration>;
