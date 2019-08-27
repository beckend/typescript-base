// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const returnArray = <T1>(x: T1): T1 extends typeof Array ? T1 : any[] => (Array.isArray(x) ? (x as any) : [])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toArray = <T1>(x: T1): T1 extends any[] ? T1 : T1[] => (Array.isArray(x) ? x : ([x] as any))
