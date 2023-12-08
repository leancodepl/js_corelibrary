import { ReactNode, useMemo, useContext } from "react";
import { defaultComponents } from "./defaultComponents";
import { type KratosContextData, kratosContext } from "./kratosContext";
import type { KratosComponents } from "./types/components";
import type { UseHandleFlowError } from "./types/useHandleFlowError";

export type KratosContextProviderProps = {
    components?: Partial<KratosComponents>;
    useHandleFlowError?: UseHandleFlowError;
    excludeScripts?: boolean;
    children?: ReactNode;
};

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
    } = useContext(kratosContext);

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
    );

    return <kratosContext.Provider value={value}>{children}</kratosContext.Provider>;
}
