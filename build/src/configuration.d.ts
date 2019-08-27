interface IConfigurationOptions {
    readonly pathRoot: string;
}
export declare class Configuration {
    static packageJSON: {
        "name": string;
        "version": string;
        "description": string;
        "engines": {
            "node": string;
        };
        "scripts": {
            "build": string;
            "ci": string;
            "commit": string;
            "lint": string;
            "patch:files": string;
            "postinstall": string;
            "prepare-release": string;
            "release": string;
            "jest:integration": string;
            "test:coverage": string;
            "test:watch-coverage": string;
            "test:watch": string;
            "test": string;
        };
        "main": string;
        "keywords": never[];
        "author": string;
        "license": string;
        "config": {
            "commitizen": {
                "path": string;
            };
        };
        "dependencies": {
            "@commitlint/cli": string;
            "@commitlint/config-conventional": string;
            "@types/eslint": string;
            "@types/fs-extra": string;
            "@types/jest": string;
            "@types/lodash": string;
            "@types/stylelint": string;
            "@typescript-eslint/eslint-plugin": string;
            "@typescript-eslint/parser": string;
            "app-root-path": string;
            "concurrently": string;
            "cz-conventional-changelog": string;
            "eslint": string;
            "eslint-config-airbnb-base": string;
            "eslint-config-prettier": string;
            "eslint-import-resolver-typescript": string;
            "eslint-plugin-import": string;
            "eslint-plugin-jsx-a11y": string;
            "eslint-plugin-prettier": string;
            "fs-extra": string;
            "git-cz": string;
            "husky": string;
            "jest": string;
            "jest-config": string;
            "jest-mock-console": string;
            "just-task": string;
            "lodash": string;
            "mock-fs": string;
            "npm-check-updates": string;
            "prettier": string;
            "promisepipe": string;
            "standard-version": string;
            "ts-jest": string;
            "tslib": string;
        };
        "devDependencies": {
            "@schemastore/package": string;
            "@testing-library/jest-dom": string;
            "@testing-library/react": string;
            "@types/expect-puppeteer": string;
            "@types/jest-environment-puppeteer": string;
            "@types/jest-image-snapshot": string;
            "@types/node": string;
            "@types/puppeteer": string;
            "@types/react": string;
            "@types/react-dom": string;
            "@types/undertaker": string;
            "@types/yargs": string;
            "eslint-config-airbnb": string;
            "eslint-plugin-react": string;
            "eslint-plugin-react-hooks": string;
            "jest-environment-jsdom": string;
            "jest-environment-jsdom-global": string;
            "jest-image-snapshot": string;
            "jest-puppeteer": string;
            "puppeteer": string;
            "react": string;
            "react-dom": string;
            "stylelint": string;
            "stylelint-config-recommended": string;
            "ts-node": string;
            "typescript": string;
        };
        "peerDependencies": {
            "@testing-library/jest-dom": string;
            "@testing-library/react": string;
            "@types/expect-puppeteer": string;
            "@types/jest-environment-puppeteer": string;
            "@types/jest-image-snapshot": string;
            "@types/puppeteer": string;
            "@types/react": string;
            "@types/react-dom": string;
            "eslint-config-airbnb": string;
            "eslint-plugin-react": string;
            "eslint-plugin-react-hooks": string;
            "jest-environment-jsdom": string;
            "jest-environment-jsdom-global": string;
            "jest-image-snapshot": string;
            "jest-puppeteer": string;
            "puppeteer": string;
            "react": string;
            "react-dom": string;
            "stylelint": string;
            "stylelint-config-recommended": string;
            "typescript": string;
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
