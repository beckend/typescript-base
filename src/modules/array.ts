export const returnArray = <T1>(x: T1): T1 extends typeof Array ? T1 : any[] => (Array.isArray(x) ? (x as any) : [])
