import { createContext, useContext } from "react"
import type { KratosComponents } from "./types/components"
import type { UseHandleFlowError } from "./types/useHandleFlowError"

export type KratosContextData = {
    components: KratosComponents | undefined
    useHandleFlowError: UseHandleFlowError
    excludeScripts: boolean
}

export const kratosContext = createContext<KratosContextData>({
    components: undefined,
    useHandleFlowError: () => async () => undefined,
    excludeScripts: false,
})

/**
 * Access Kratos context data with components and error handling.
 * 
 * Retrieves the current Kratos context including UI components, error handlers,
 * and configuration. Throws error if components are not initialized.
 * 
 * @returns Kratos context data with initialized components
 * @throws Error when Kratos context components are not initialized
 * @example
 * ```typescript
 * import { useKratosContext } from '@leancodepl/kratos';
 * 
 * function LoginComponent() {
 *   const { components, useHandleFlowError } = useKratosContext();
 *   // Use components and error handling...
 * }
 * ```
 */
export function useKratosContext() {
    const context = useContext(kratosContext)

    if (context.components === undefined) {
        throw new Error("Kratos context components were not initialized")
    }

    return context as KratosContextData & { components: KratosComponents }
}
