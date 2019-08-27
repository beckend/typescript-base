export declare const returnArray: <T1>(x: T1) => T1 extends ArrayConstructor ? T1 : any[];
export declare const toArray: <T1>(x: T1) => T1 extends any[] ? T1 : T1[];
