const is = (Ctor: any, val: any): boolean => (val != null && val.constructor === Ctor) || val instanceof Ctor;
const trim = (a: string): string => a.trim();
const replace = (b: string | RegExp, c: string, a: string): string => a.replace(b, c);
const head = <T>(a: T[]): T => a[0];
const tail = <T>(a: T[]): T[] => a.slice(1);
const isNil = (a: any): boolean => a === null || a === undefined;

export { is, trim, replace, head, tail, isNil };
