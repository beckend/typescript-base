interface IConfigurationOptions {
    readonly pathRoot: string;
}
export declare class Configuration {
    static packageJSON: {
        name: string;
        version: string;
        description: string;
        engines: {
            node: string;
        };
        scripts: {
            build: string;
            "build-new": string;
            ci: string;
            lint: string;
            "patch:files": string;
            postinstall: string;
            "prepare-release": string;
            "jest:integration": string;
            "test:coverage": string;
            "test:watch-coverage": string;
            "test:watch": string;
            test: string;
        };
        main: string;
        keywords: never[];
        author: string;
        license: string;
        dependencies: {
            "@swc/helpers": string;
            "@typescript-eslint/eslint-plugin": string;
            "app-root-path": string;
            async: string;
            "eslint-config-airbnb-typescript": string;
            "eslint-config-prettier": string;
            "eslint-import-resolver-typescript": string;
            "eslint-plugin-import": string;
            "fs-extra": string;
            jest: string;
            "jest-config": string;
            "just-task": string;
            lodash: string;
            prettier: string;
            promisepipe: string;
            "ts-jest": string;
            tslib: string;
        };
        devDependencies: {
            "@schemastore/package": string;
            "@swc-node/jest": string;
            "@swc/cli": string;
            "@swc/core": string;
            "@testing-library/jest-dom": string;
            "@testing-library/react": string;
            "@types/async": string;
            "@types/eslint": string;
            "@types/fs-extra": string;
            "@types/jest": string;
            "@types/lodash": string;
            "@types/node": string;
            "@types/react": string;
            "@types/react-dom": string;
            "@types/stylelint": string;
            "@types/undertaker": string;
            "@types/yargs": string;
            "@typescript-eslint/parser": string;
            concurrently: string;
            eslint: string;
            "eslint-plugin-jsx-a11y": string;
            "eslint-plugin-react": string;
            "eslint-plugin-react-hooks": string;
            "jest-environment-jsdom": string;
            react: string;
            "react-dom": string;
            stylelint: string;
            "stylelint-config-recommended": string;
            "ts-node": string;
            typescript: string;
        };
        peerDependencies: {
            "@swc-node/jest": string;
            "@testing-library/jest-dom": string;
            "@testing-library/react": string;
            "@types/react": string;
            "@types/react-dom": string;
            "eslint-plugin-react": string;
            "eslint-plugin-react-hooks": string;
            "jest-environment-jsdom": string;
            react: string;
            "react-dom": string;
            stylelint: string;
            "stylelint-config-recommended": string;
            typescript: string;
        };
    };
    static isBuild: boolean;
    static isTest: boolean;
    static createPathsConfig({ pathRoot: THE_ROOT }: {
        readonly pathRoot: string;
    }): {
        DIR: {
            ROOT: string;
            ROOT_BUILD: string;
            ROOT_NODE_MODULES: string;
        };
    };
    PATH: ReturnType<typeof Configuration.createPathsConfig>;
    constructor({ pathRoot }: IConfigurationOptions);
}
export {};
