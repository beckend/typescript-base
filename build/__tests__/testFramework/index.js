"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestFramework = void 0;
const path_1 = require("path");
const lodash = require("lodash");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class TestFramework {
    static DUMMY_VALUES = Object.freeze({
        BOOL_FALSE: false,
        BOOL_TRUE: true,
        OBJECT_EMPTY: {},
        OBJECT_WITH_DUMMY_KEYS: {
            KEY1: 'KEY1',
            KEY2: 'KEY2',
        },
        NUMBER: 1234567890,
        STRING: 'STRING',
        UNDEFINED: undefined,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        FN_NOOP() { },
        FN_PASSTHROUGH: (x) => x,
    });
    static getters = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        deferredPromise: (cb, { timeout = 0, } = {}) => new Promise((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            lodash.defer(() => cb({ resolve: resolve, reject }), timeout);
        }),
    };
    static utils = {
        lodash,
        expectWithCalledTimes(spy, times = 1) {
            expect(spy).toHaveBeenCalledTimes(times);
            return expect(spy);
        },
    };
    TargetComponent;
    moduleBasePath;
    moduleKey;
    modulePath;
    constructor({ TargetComponent, moduleBasePath, moduleKey, modulePath, }) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.TargetComponent = TargetComponent;
        this.moduleBasePath = moduleBasePath;
        this.moduleKey = moduleKey;
        this.modulePath = modulePath;
    }
    getters = {
        newModule: ({ key = this.moduleKey, path = this.modulePath, } = {}) => {
            if (!path) {
                throw new Error('Cannot get a new module without path.');
            }
            const baseModule = jest.requireActual(path);
            if (!baseModule || !key) {
                return baseModule;
            }
            return baseModule ? baseModule[key] : baseModule;
        },
    };
    utils = {
        doMock: (obj, optionsGetNewModule) => {
            const extraOptionsKeys = ['__mockOptions'];
            const moduleOptionsCommonDefault = {
                mergeOriginalModule: true,
                // eslint-disable-next-line no-underscore-dangle
                ...obj.__mockOptions,
            };
            Object.keys(lodash.omit(obj, extraOptionsKeys)).forEach((theModulePath) => {
                const theObjectValue = obj[theModulePath];
                const value = lodash.isObject(theObjectValue) ? lodash.omit(theObjectValue, extraOptionsKeys) : theObjectValue;
                const pathIsRelative = ['..', './'].some((x) => theModulePath.startsWith(x));
                const requirePath = pathIsRelative ? path_1.join(this.moduleBasePath || '', theModulePath) : theModulePath;
                jest.doMock(requirePath, () => {
                    if (lodash.isObject(value)) {
                        // user overrideable per module
                        const moduleOptions = {
                            ...moduleOptionsCommonDefault,
                            // eslint-disable-next-line no-underscore-dangle
                            ...theObjectValue.__mockOptions,
                        };
                        if (!moduleOptions.mergeOriginalModule) {
                            return {
                                __esModule: true,
                                ...value,
                            };
                        }
                        const originalModule = moduleOptions.mergeOriginalModule ? jest.requireActual(requirePath) : {};
                        const isOriginalModuleAFunction = typeof originalModule === 'function';
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const mockHasDefaultPropertyAsFunction = value && typeof value.default === 'function';
                        if (!lodash.isObject(originalModule)) {
                            throw new Error(`The module "${theModulePath}" is not an object, object was supplied as mock.`);
                        }
                        const mockKeys = Object.keys(value);
                        // not using object assign due so we are able to copy getters and setters
                        const res = Object.keys(originalModule).reduce((acc, k) => {
                            const objDescOriginalProperty = Object.getOwnPropertyDescriptor(mockKeys.includes(k) ? value : originalModule, k);
                            Object.defineProperty(acc, k, lodash.isObject(objDescOriginalProperty)
                                ? objDescOriginalProperty
                                : {
                                    enumerable: true,
                                    configurable: true,
                                    writable: true,
                                    value: objDescOriginalProperty,
                                });
                            return acc;
                        }, isOriginalModuleAFunction && mockHasDefaultPropertyAsFunction
                            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                Object.assign(value.default.bind(null), {
                                    __esModule: true,
                                })
                            : {
                                __esModule: true,
                            });
                        return res;
                    }
                    return value;
                });
            });
            jest.resetModules();
            const newModule = this.getters.newModule(optionsGetNewModule);
            return {
                input: obj,
                newModule,
                NewModule: newModule,
            };
        },
    };
}
exports.TestFramework = TestFramework;
