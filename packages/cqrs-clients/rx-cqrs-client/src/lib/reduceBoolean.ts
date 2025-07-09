import { OperatorFunction, reduce } from "rxjs";

/**
 * Reduces boolean values in RxJS streams using logical AND operation.
 * 
 * Creates an operator that combines multiple boolean values into a single result
 * by applying logical AND. Returns true only if all values are true.
 * 
 * @returns RxJS operator function that reduces boolean values
 * @example
 * ```typescript
 * import { of } from 'rxjs';
 * import { reduceBoolean } from '@leancodepl/rx-cqrs-client';
 * 
 * of(true, true, false).pipe(reduceBoolean()).subscribe(result => {
 *   console.log(result); // false
 * });
 * ```
 */
export function reduceBoolean(): OperatorFunction<boolean, boolean> {
    return source => source.pipe(reduce<boolean, boolean>((prev, cur) => prev && cur, true));
}
