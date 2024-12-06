import { type ExecutionContext, type RuleSet, useTheme } from "styled-components"
import { mkProxy, Value } from "./mkProxy"

export function mkTheme<TTheme extends Value>() {
    return {
        theme: mkProxy(ctx => ctx.theme as TTheme) as unknown as TransformDeep<TTheme>,
        useTheme: () => useTheme() as TTheme,
    }
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
