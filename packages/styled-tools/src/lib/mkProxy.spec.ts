import type { ExecutionContext } from "styled-components"
import { describe, expect, it } from "vitest"
import { mkProxy, Value } from "./mkProxy"

// Builds a minimal ExecutionContext carrying the provided theme value.
function ctx(theme: Value): ExecutionContext {
    return { theme } as unknown as ExecutionContext
}

describe("mkProxy", () => {
    it("returns the accessor result when invoked directly with a context", () => {
        const proxy = mkProxy(c => c.theme as Value)

        expect((proxy as unknown as (c: ExecutionContext) => Value)(ctx("root-value"))).toBe("root-value")
    })

    it("traverses nested object properties lazily until invoked", () => {
        const theme = { colors: { primary: "#fff", secondary: "#000" } }
        const proxy = mkProxy(c => c.theme as Value) as any

        expect(proxy.colors.primary(ctx(theme))).toBe("#fff")
        expect(proxy.colors.secondary(ctx(theme))).toBe("#000")
    })

    it("resolves deeply nested values across multiple levels", () => {
        const theme = { a: { b: { c: { d: 42 } } } }
        const proxy = mkProxy(c => c.theme as Value) as any

        expect(proxy.a.b.c.d(ctx(theme))).toBe(42)
    })

    it("returns undefined when a property is accessed on a non-object (string) value", () => {
        const theme = { colors: "not-an-object" }
        const proxy = mkProxy(c => c.theme as Value) as any

        // colors resolves to a string; reaching into it must hit the guard and return undefined
        expect(proxy.colors.primary(ctx(theme))).toBeUndefined()
    })

    it("returns undefined when a property is accessed on a number value", () => {
        const theme = { spacing: 8 }
        const proxy = mkProxy(c => c.theme as Value) as any

        expect(proxy.spacing.small(ctx(theme))).toBeUndefined()
    })

    it("returns undefined when the accessor itself yields undefined", () => {
        const emptyValue: Value = undefined
        const proxy = mkProxy(() => emptyValue) as any

        expect(proxy(ctx(emptyValue))).toBeUndefined()
        expect(proxy.anything(ctx(emptyValue))).toBeUndefined()
    })

    it("returns undefined for a missing property on an object value", () => {
        const theme = { colors: { primary: "#fff" } }
        const proxy = mkProxy(c => c.theme as Value) as any

        expect(proxy.colors.missing(ctx(theme))).toBeUndefined()
    })

    it("exposes Function.prototype for the special 'prototype' property", () => {
        const proxy = mkProxy(c => c.theme as Value) as any

        expect(proxy.prototype).toBe(Function.prototype)
    })

    it("caches nested proxies so repeated access returns the same reference", () => {
        const proxy = mkProxy(c => c.theme as Value) as any

        const first = proxy.colors
        const second = proxy.colors

        expect(first).toBe(second)
    })

    it("creates distinct proxies for distinct properties", () => {
        const proxy = mkProxy(c => c.theme as Value) as any

        expect(proxy.colors).not.toBe(proxy.spacing)
    })

    it("re-evaluates the accessor against the context on every invocation", () => {
        const proxy = mkProxy(c => c.theme as Value) as any

        const themeA = { colors: { primary: "#aaa" } }
        const themeB = { colors: { primary: "#bbb" } }

        // Same cached proxy node, different contexts -> different resolved values
        const accessor = proxy.colors.primary
        expect(accessor(ctx(themeA))).toBe("#aaa")
        expect(accessor(ctx(themeB))).toBe("#bbb")
    })

    it("supports symbol-keyed property access", () => {
        const key = Symbol("token")
        const theme = { [key]: "symbol-value" }
        const proxy = mkProxy(c => c.theme as Value) as any

        expect(proxy[key](ctx(theme))).toBe("symbol-value")
    })

    it("treats null as an object access (typeof null === 'object') and returns undefined for its props", () => {
        // guard() uses typeof === "object"; null passes the guard but optional chaining yields undefined
        const theme = { colors: null as unknown as Value }
        const proxy = mkProxy(c => c.theme as Value) as any

        expect(proxy.colors.primary(ctx(theme))).toBeUndefined()
    })
})
