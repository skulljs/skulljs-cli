const is = (Ctor, val) => (val != null && val.constructor === Ctor) || val instanceof Ctor;
const trim = (a) => a.trim();
const replace = (b, c, a) => a.replace(b, c);
const head = (a) => a[0];
const tail = (a) => a.slice(1);
const isNil = (a) => a === null || a === undefined;
export { is, trim, replace, head, tail, isNil };
