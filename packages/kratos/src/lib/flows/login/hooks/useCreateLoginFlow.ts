import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useKratosContext } from "../../../hooks"
import { loginFlowKey } from "./queryKeys"
import { useLoginFlowContext } from "./useLoginFlowContext"

export function useCreateLoginFlow({
    aal,
    refresh,
    returnTo,
}: { aal?: string; refresh?: boolean; returnTo?: string } = {}) {
    const { kratosClient } = useKratosContext()
    const { setLoginFlowId } = useLoginFlowContext()

    const client = useQueryClient()

    return useMutation({
        mutationFn: () =>
            kratosClient.createBrowserLoginFlow({ aal, refresh, returnTo }, async ({ init: { headers } }) => ({
                headers: { ...headers, Accept: "application/json" },
                credentials: "include",
            })),
        onSuccess(data) {
            client.setQueryDefaults(loginFlowKey(data.id), { staleTime: Infinity })
            client.setQueryData(loginFlowKey(data.id), data)
            setLoginFlowId(data.id)
        },
    })
}
