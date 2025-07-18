import { useQueryClient } from "@tanstack/react-query"
import { useKratosClientContext, useKratosSessionContext } from "../../hooks"
import { ApiResponse } from "../../types"
import { baseQueryKey } from "../../utils"

/**
 * Provides logout functionality for Kratos authentication flows.
 *
 * Handles the complete logout process including creating logout flow,
 * updating session state, cleaning up cached queries, and optional redirects.
 *
 * @returns Object containing logout function that accepts optional returnTo parameter
 * @example
 * ```tsx
 * import { useLogout } from "@leancodepl/kratos";
 *
 * function LogoutButton() {
 *   const { logout } = useLogout();
 *
 *   const handleLogout = async () => {
 *     const result = await logout({ returnTo: "/login" });
 *     if (!result.isSuccess) {
 *       console.error("Logout failed:", result.error);
 *     }
 *   };
 *
 *   return <button onClick={handleLogout}>Logout</button>;
 * }
 * ```
 */
export function useLogout() {
    const { kratosClient } = useKratosClientContext()
    const { sessionManager } = useKratosSessionContext()
    const queryClient = useQueryClient()

    const logout = async ({ returnTo }: { returnTo?: string } = {}): Promise<ApiResponse> => {
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
                    headers: { Accept: "application/json", "Content-Type": "application/json" },
                },
            )

            sessionManager.checkIfLoggedIn()

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
