import { OperatorFunction, reduce } from "rxjs";

export function reduceBoolean(): OperatorFunction<boolean, boolean> {
    return source => source.pipe(reduce<boolean, boolean>((prev, cur) => prev && cur, true));
}
