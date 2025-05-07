import { useQuery } from "@tanstack/react-query"
import { useKratosContext } from "../../login"
import { registrationFlowKey } from "./queryKeys"

export function useGetRegistrationFlow() {
    const { kratosClient, registrationFlowId } = useKratosContext()

    return useQuery({
        queryKey: registrationFlowKey(registrationFlowId),
        queryFn: ({ signal }) => {
            if (!registrationFlowId) throw new Error("No registration flow ID provided")

            return kratosClient.getRegistrationFlow({ id: registrationFlowId }, async ({ init: { headers } }) => ({
                signal,
                headers: { ...headers, Accept: "application/json" },
                credentials: "include",
            }))
        },
        enabled: !!registrationFlowId,
        staleTime: Infinity,
    })
}
