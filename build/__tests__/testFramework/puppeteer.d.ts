import * as qs from 'querystring';
export declare class Puppeteer {
    baseImageURL: string;
    constructor({ baseImageURL, }?: {
        readonly baseImageURL?: string;
    });
    getImageURL: ({ baseImageURL, query, }: {
        readonly baseImageURL?: string | undefined;
        readonly query: qs.ParsedUrlQueryInput;
    }) => string;
}
