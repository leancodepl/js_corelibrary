import { OperatorFunction, reduce } from "rxjs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never;

export function reduceObject<T>(): OperatorFunction<T, Partial<UnionToIntersection<T>>> {
    return source => source.pipe(reduce((prev, cur) => ({ ...prev, ...cur }), {} as Partial<UnionToIntersection<T>>));
}
