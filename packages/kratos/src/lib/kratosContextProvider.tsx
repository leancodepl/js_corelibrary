import { ReactNode, useContext, useMemo } from "react"
import { defaultComponents } from "./defaultComponents"
import { kratosContext, type KratosContextData } from "./kratosContext"
import type { KratosComponents } from "./types/components"
import type { UseHandleFlowError } from "./types/useHandleFlowError"

export type KratosContextProviderProps = {
    components?: Partial<KratosComponents>
    useHandleFlowError?: UseHandleFlowError
    excludeScripts?: boolean
    children?: ReactNode
}

/**
 * Provides Kratos context to child components with customizable configuration.
 * 
 * Sets up the React context for Kratos integration, allowing customization of
 * UI components, error handling, and script loading behavior.
 * 
 * @param components - Partial override of default Kratos UI components
 * @param useHandleFlowError - Custom error handler for authentication flows
 * @param excludeScripts - Whether to exclude script node execution
 * @param children - Child React components
 * @returns JSX element providing Kratos context
 * @example
 * ```typescript
 * import { KratosContextProvider } from '@leancodepl/kratos';
 * 
 * function App() {
 *   return (
 *     <KratosContextProvider>
 *       <LoginPage />
 *     </KratosContextProvider>
 *   );
 * }
 * ```
 */
export function KratosContextProvider({
    components = {},
    useHandleFlowError,
    excludeScripts,
    children,
}: KratosContextProviderProps) {
    const {
        components: baseComponents,
        useHandleFlowError: baseUseHandleFlowError,
        excludeScripts: baseExcludeScripts,
    } = useContext(kratosContext)

    const value = useMemo<KratosContextData>(
        () => ({
            components: {
                ...(baseComponents ?? defaultComponents),
                ...components,
            },
            useHandleFlowError: useHandleFlowError ?? baseUseHandleFlowError,
            excludeScripts: excludeScripts ?? baseExcludeScripts,
        }),
        [baseComponents, components, useHandleFlowError, baseUseHandleFlowError, excludeScripts, baseExcludeScripts],
    )

    return <kratosContext.Provider value={value}>{children}</kratosContext.Provider>
}
