import { OperatorFunction, ReplaySubject } from "rxjs"
import { concatMap } from "rxjs/operators"
import type { ReducerDescription, ValidationErrorsHandler } from "@leancodepl/validation"

/**
 * Handles command responses with RxJS operators for validation error processing.
 *
 * Creates an operator that processes validation error handlers and transforms them
 * into the desired result type using a reducer pattern.
 *
 * @param handlerFunc - Function that processes validation error handlers
 * @returns RxJS operator function for handling command responses
 * @example
 * ```typescript
 * import { handleCommandResponse } from '@leancodepl/rx-cqrs-client';
 *
 * const handler = handleCommandResponse((handle) =>
 *   handle('success', () => 'Success!')
 *     .handle('failure', () => 'Failed!')
 *     .check()
 * );
 * ```
 */
export function handleCommandResponse<TErrorCodes extends Record<string, number>, THandlerResult>(
  handlerFunc: (
    handler: ValidationErrorsHandler<TErrorCodes, never>,
  ) => (reducer: ReducerDescription<THandlerResult, any>) => any,
): OperatorFunction<ValidationErrorsHandler<TErrorCodes, never>, THandlerResult> {
  return source =>
    source.pipe(
      concatMap(handler => {
        const subj = new ReplaySubject<THandlerResult>()

        handlerFunc(handler)({
          reducer: (prev, cur) => subj.next(cur) as never,
          initialValue: null as never,
        })

        subj.complete()

        return subj
      }),
    )
}
