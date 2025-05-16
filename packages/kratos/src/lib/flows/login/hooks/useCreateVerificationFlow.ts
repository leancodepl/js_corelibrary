import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useKratosContext } from "../../../hooks"
import { useLoginFlowContext } from "../loginFlow"
import { verificationFlowKey } from "./queryKeys"

export function useCreateVerificationFlow({ returnTo }: { returnTo?: string } = {}) {
    const { kratosClient } = useKratosContext()
    const { setVerificationFlowId } = useLoginFlowContext()

    const client = useQueryClient()

    return useMutation({
        mutationFn: () =>
            kratosClient.createBrowserVerificationFlow({ returnTo }, async ({ init: { headers } }) => ({
                headers: { ...headers, Accept: "application/json" },
                credentials: "include",
            })),
        onSuccess(data) {
            client.setQueryDefaults(verificationFlowKey(data.id), { staleTime: Infinity })
            client.setQueryData(verificationFlowKey(data.id), data)
            setVerificationFlowId(data.id)
        },
    })
}
