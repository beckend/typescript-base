/// <reference types="jest" />
import * as lodash from 'lodash';
import * as mockConsole from 'jest-mock-console';
import { Puppeteer } from './puppeteer';
export declare class TestFramework<TComponent = any> {
    static DUMMY_VALUES: Readonly<{
        BOOL_FALSE: boolean;
        BOOL_TRUE: boolean;
        OBJECT_EMPTY: {};
        OBJECT_WITH_DUMMY_KEYS: {
            KEY1: string;
            KEY2: string;
        };
        NUMBER: number;
        STRING: string;
        UNDEFINED: undefined;
        FN_NOOP(): void;
        FN_PASSTHROUGH: <T1>(x: T1) => T1;
    }>;
    static getters: {
        deferredPromise: <T1 = any>(cb: (x: {
            readonly resolve: (resValue: T1 | PromiseLike<T1> | undefined) => void;
            readonly reject: (reason: Error) => void;
        }) => void, { timeout, }?: {
            readonly timeout?: number | undefined;
        }) => Promise<T1>;
    };
    static setup: {
        afterEach({ resetMockFS }?: {
            readonly resetMockFS?: boolean | undefined;
        }): void;
    };
    static utils: {
        Puppeteer: typeof Puppeteer;
        lodash: lodash.LoDashStatic;
        mockConsole: typeof mockConsole;
        mockFS: any;
        expectWithCalledTimes<T1 extends jest.Mock<any, any>>(spy: T1, times?: number): jest.Matchers<T1>;
    };
    TargetComponent: TComponent;
    moduleBasePath: string;
    moduleKey?: string;
    modulePath: string;
    constructor({ TargetComponent, moduleBasePath, moduleKey, modulePath, }: {
        readonly TargetComponent?: TComponent;
        readonly moduleBasePath: string;
        readonly moduleKey?: string;
        readonly modulePath: string;
    });
    getters: {
        newModule: ({ key, path, }?: {
            readonly key?: string | undefined;
            readonly path?: string | undefined;
        }) => TComponent;
    };
    utils: {
        doMock: <TInput extends Record<string | number, any> & {
            readonly __mockOptions?: {
                readonly mergeOriginalModule?: boolean | undefined;
            } | undefined;
        }>(obj: TInput, optionsGetNewModule?: {
            readonly key?: string | undefined;
            readonly path?: string | undefined;
        } | undefined) => {
            input: TInput;
            newModule: TComponent;
            NewModule: TComponent;
        };
    };
}
