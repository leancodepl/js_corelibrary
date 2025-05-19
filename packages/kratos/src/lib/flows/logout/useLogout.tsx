import { ApiResponse } from "@leancodepl/cqrs-client-base"
import { useKratosContext } from "../../hooks"

type UseButtonProps = {
    returnTo?: string
}

// TODO: maybe we need to invalidate queries?
export function useLogout({ returnTo }: UseButtonProps) {
    const { kratosClient } = useKratosContext()

    const logout = async (): Promise<ApiResponse<{ returnTo: string }>> => {
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

            return { isSuccess: true, result: { returnTo } }
        } catch (error) {
            return { isSuccess: false, error }
        }
    }

    return {
        logout,
    }
}
