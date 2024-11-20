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

                return isNonNullObject(value) ? value[property] : undefined
            })

            return cache[property]
        },
    })
}

export type Value = { [key: string | symbol]: Value | undefined } | RuleSet | string | undefined

function isNonNullObject(value: unknown): value is Record<string | symbol, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value)
}
