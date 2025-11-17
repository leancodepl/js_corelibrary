import { OperatorFunction, reduce } from "rxjs"

type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never

/**
 * Reduces object values in RxJS streams by merging properties.
 *
 * Creates an operator that combines multiple objects into a single result
 * by spreading properties. Later objects override earlier ones.
 *
 * @returns RxJS operator function that reduces object values
 * @example
 * ```typescript
 * import { of } from 'rxjs';
 * import { reduceObject } from '@leancodepl/rx-cqrs-client';
 *
 * of({ a: 1 }, { b: 2 }, { a: 3 }).pipe(reduceObject()).subscribe(result => {
 *   console.log(result); // { a: 3, b: 2 }
 * });
 * ```
 */
export function reduceObject<T>(): OperatorFunction<T, Partial<UnionToIntersection<T>>> {
  return source => source.pipe(reduce((prev, cur) => ({ ...prev, ...cur }), {} as Partial<UnionToIntersection<T>>))
}
