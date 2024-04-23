import type { ReducerDescription, ValidationErrorsHandler } from "@leancodepl/validation";
import { OperatorFunction, ReplaySubject } from "rxjs";
import { concatMap } from "rxjs/operators";

export function handleCommandResponse<TErrorCodes extends Record<string, number>, THandlerResult>(
    handlerFunc: (
        handler: ValidationErrorsHandler<TErrorCodes, never>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => (reducer: ReducerDescription<THandlerResult, any>) => any,
): OperatorFunction<ValidationErrorsHandler<TErrorCodes, never>, THandlerResult> {
    return source =>
        source.pipe(
            concatMap(handler => {
                const subj = new ReplaySubject<THandlerResult>();

                handlerFunc(handler)({
                    reducer: (prev, cur) => subj.next(cur) as never,
                    initialValue: null as never,
                });

                subj.complete();

                return subj;
            }),
        );
}
