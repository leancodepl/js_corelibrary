import { type ExecutionContext, type RuleSet, useTheme } from "styled-components"
import { mkProxy, Value } from "./mkProxy"

/**
 * Creates type-safe theme utilities for styled-components with full TypeScript support.
 *
 * @template TTheme - The theme object type extending Value
 * @returns Object containing theme proxy and useTheme hook
 * @example
 * ```typescript
 * interface AppTheme {
 *   colors: { primary: string; secondary: string };
 *   spacing: { small: string; large: string };
 * }
 *
 * const { theme, useTheme } = mkTheme<AppTheme>();
 *
 * const Button = styled.button`
 *   color: ${theme.colors.primary};
 *   padding: ${theme.spacing.small};
 * `;
 * ```
 */
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
