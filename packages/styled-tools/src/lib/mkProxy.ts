import type { ExecutionContext, RuleSet } from "styled-components"

export function mkProxy(accessor: (context: ExecutionContext) => Value) {
  const cache: Record<string | symbol, ReturnType<typeof mkProxy>> = {}

  return new Proxy(accessor, {
    get(target, property) {
      if (property === "prototype") {
        return Function.prototype
      }

      cache[property] ??= mkProxy((context: ExecutionContext) => {
        const value = target(context)

        return guard(value) ? value?.[property] : undefined
      })

      return cache[property]
    },
  })
}

export type Value = number | RuleSet | string | undefined | { [key: string | symbol]: undefined | Value }

function guard(value: unknown): value is Record<string | symbol, unknown> {
  return typeof value === "object"
}
