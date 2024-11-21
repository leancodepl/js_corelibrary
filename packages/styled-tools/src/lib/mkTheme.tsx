import { mkProxy, Value } from "./mkProxy"
import type { ExecutionContext, RuleSet } from "styled-components"

export function mkTheme<TTheme extends Value>() {
    return mkProxy(ctx => ctx.theme as TTheme) as unknown as TransformDeep<TTheme>
}

type TransformDeep<T> = T extends RuleSet
    ? (context: ExecutionContext) => RuleSet
    : T extends Array<infer TArrayElement>
      ? Array<TransformDeep<TArrayElement>>
      : T extends object
        ? {
              [TKey in keyof T]: TransformDeep<T[TKey]>
          }
        : T extends null
          ? undefined
          : (context: ExecutionContext) => T
