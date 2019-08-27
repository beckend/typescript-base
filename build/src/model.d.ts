export declare type TPartialReadonly<T> = {
    readonly [P in keyof T]?: T[P];
};
