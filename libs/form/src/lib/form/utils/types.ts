type Without<A, B> = { [P in Exclude<keyof A, keyof B>]?: never };

export type OneOf<A, B> = A | B extends object ? (Without<A, B> & B) | (Without<B, A> & A) : A | B;

export type StringKeys<T> = Extract<keyof T, string>;
export type ValueOfStringKey<T> = T[StringKeys<T>];
