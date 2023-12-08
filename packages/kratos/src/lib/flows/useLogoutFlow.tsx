import { useCallback } from "react";
import { FrontendApi } from "@ory/client";
import { AxiosError } from "axios";

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
