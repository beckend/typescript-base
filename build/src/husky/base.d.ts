export declare const getBase: (options?: {
    readonly [x: string]: any;
}) => {
    hooks: {
        'commit-msg': string;
        'pre-commit': string;
    };
} & {
    readonly [x: string]: any;
};
