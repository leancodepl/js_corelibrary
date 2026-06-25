import { type ReactNode } from "react"
import { renderHook } from "@testing-library/react"
import { type ExecutionContext, ThemeProvider } from "styled-components"
import { describe, expect, it } from "vitest"
import { mkTheme } from "./mkTheme"

type AppTheme = {
    colors: { primary: string; secondary: string }
    spacing: { small: string; large: string }
}

const appTheme: AppTheme = {
    colors: { primary: "#ff0000", secondary: "#00ff00" },
    spacing: { small: "4px", large: "16px" },
}

// Resolves a styled-components interpolation against an ExecutionContext carrying the theme.
function withTheme(theme: AppTheme): ExecutionContext {
    return { theme } as unknown as ExecutionContext
}

describe("mkTheme", () => {
    it("returns an object exposing both a theme proxy and a useTheme hook", () => {
        const tools = mkTheme<AppTheme>()

        expect(tools).toHaveProperty("theme")
        expect(tools).toHaveProperty("useTheme")
        expect(typeof tools.useTheme).toBe("function")
    })

    describe("theme proxy", () => {
        it("reads top-level nested values from the execution context theme", () => {
            const { theme } = mkTheme<AppTheme>()

            const primary = theme.colors.primary as unknown as (c: ExecutionContext) => string
            const small = theme.spacing.small as unknown as (c: ExecutionContext) => string

            expect(primary(withTheme(appTheme))).toBe("#ff0000")
            expect(small(withTheme(appTheme))).toBe("4px")
        })

        it("resolves the latest theme on each invocation (theme switching)", () => {
            const { theme } = mkTheme<AppTheme>()

            const darkTheme: AppTheme = {
                colors: { primary: "#111111", secondary: "#222222" },
                spacing: { small: "2px", large: "8px" },
            }

            const primary = theme.colors.primary as unknown as (c: ExecutionContext) => string

            expect(primary(withTheme(appTheme))).toBe("#ff0000")
            expect(primary(withTheme(darkTheme))).toBe("#111111")
        })
    })

    describe("useTheme hook", () => {
        it("returns the theme provided by styled-components ThemeProvider", () => {
            const { useTheme } = mkTheme<AppTheme>()

            const wrapper = ({ children }: { children: ReactNode }) => (
                <ThemeProvider theme={appTheme}>{children}</ThemeProvider>
            )

            const { result } = renderHook(() => useTheme(), { wrapper })

            expect(result.current).toEqual(appTheme)
            expect(result.current.colors.primary).toBe("#ff0000")
            expect(result.current.spacing.large).toBe("16px")
        })

        it("reflects the active provider theme value", () => {
            const { useTheme } = mkTheme<AppTheme>()

            const otherTheme: AppTheme = {
                colors: { primary: "#abcdef", secondary: "#fedcba" },
                spacing: { small: "1px", large: "2px" },
            }

            const wrapper = ({ children }: { children: ReactNode }) => (
                <ThemeProvider theme={otherTheme}>{children}</ThemeProvider>
            )

            const { result } = renderHook(() => useTheme(), { wrapper })

            expect(result.current).toEqual(otherTheme)
        })
    })
})
