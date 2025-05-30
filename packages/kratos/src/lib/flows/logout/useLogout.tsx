import { useQueryClient } from "@tanstack/react-query"
import { useKratosContext } from "../../hooks"
import { ApiResponse } from "../../types"
import { baseQueryKey } from "../../utils"

export function useLogout() {
    const { kratosClient } = useKratosContext()
    const queryClient = useQueryClient()

    const logout = async ({ returnTo }: { returnTo?: string }): Promise<ApiResponse> => {
        try {
            const logoutFlow = await kratosClient.createBrowserLogoutFlow(
                { returnTo },
                async ({ init: { headers } }) => ({
                    credentials: "include",
                    headers: { ...headers, Accept: "application/json", "Content-Type": "application/json" },
                }),
            )

            await kratosClient.updateLogoutFlow(
                {
                    token: logoutFlow.logout_token,
                },
                {
                    credentials: "include",
                    headers: { Accept: "application/json", "Content-Type": "application/json" },
                },
            )

            if (returnTo) {
                window.location.href = returnTo
            }

            queryClient.removeQueries({ queryKey: [baseQueryKey] })

            return { isSuccess: true }
        } catch (error) {
            return { isSuccess: false, error }
        }
    }

    return {
        logout,
    }
}
