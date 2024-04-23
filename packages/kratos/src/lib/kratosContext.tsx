import { createContext, useContext } from "react";
import type { KratosComponents } from "./types/components";
import type { UseHandleFlowError } from "./types/useHandleFlowError";

export type KratosContextData = {
    components: KratosComponents | undefined;
    useHandleFlowError: UseHandleFlowError;
    excludeScripts: boolean;
};

export const kratosContext = createContext<KratosContextData>({
    components: undefined,
    useHandleFlowError: () => async () => undefined,
    excludeScripts: false,
});

export function useKratosContext() {
    const context = useContext(kratosContext);

    if (context.components === undefined) {
        throw new Error("Kratos context components were not initialized");
    }

    return context as { components: KratosComponents } & KratosContextData;
}
