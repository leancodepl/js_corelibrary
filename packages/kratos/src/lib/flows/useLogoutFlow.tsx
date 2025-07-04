import { useCallback } from "react";
import { FrontendApi } from "@ory/client";
import { AxiosError } from "axios";

/**
 * Manages Kratos user logout flow with callback support.
 * 
 * Provides a logout function that creates and executes logout flow,
 * handling token invalidation and redirect logic.
 * 
 * @param kratosClient - Configured Kratos FrontendApi client
 * @param returnTo - Optional URL to redirect after logout
 * @param onLoggedOut - Optional callback executed after successful logout
 * @returns Object with logout function
 * @example
 * ```typescript
 * import { useLogoutFlow } from '@leancodepl/kratos';
 * 
 * function LogoutButton() {
 *   const { logout } = useLogoutFlow({
 *     kratosClient,
 *     returnTo: '/login',
 *     onLoggedOut: () => console.log('User logged out')
 *   });
 * 
 *   return <button onClick={logout}>Logout</button>;
 * }
 * ```
 */
export function useLogoutFlow({
    kratosClient,
    returnTo,
    onLoggedOut,
}: {
    kratosClient: FrontendApi;
    returnTo?: string;
    onLoggedOut?: () => void;
}) {
    const logout = useCallback(async () => {
        const flow = await kratosClient.createBrowserLogoutFlow(undefined, { params: { return_url: "/" } });

        kratosClient
            .updateLogoutFlow({ returnTo, token: flow.data.logout_token })
            .then(() => {
                onLoggedOut?.();
            })
            .catch((err: AxiosError) => {
                if (err.response?.status === 400) {
                    return;
                }

                return Promise.reject(err);
            });
    }, [kratosClient, returnTo, onLoggedOut]);

    return { logout };
}
