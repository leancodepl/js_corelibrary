import { useQuery } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { registrationFlowKey } from "./queryKeys"
import { useRegistrationFlowContext } from "./useRegistrationFlowContext"

export function useGetRegistrationFlow() {
    const { kratosClient } = useKratosClientContext()
    const { registrationFlowId } = useRegistrationFlowContext()

    return useQuery({
        queryKey: registrationFlowKey(registrationFlowId),
        queryFn: ({ signal }) => {
            if (!registrationFlowId) throw new Error("No registration flow ID provided")

            return kratosClient.getRegistrationFlow({ id: registrationFlowId }, async ({ init: { headers } }) => ({
                signal,
                headers: { ...headers, Accept: "application/json" },
            }))
        },
        enabled: !!registrationFlowId,
        staleTime: Infinity,
    })
}
