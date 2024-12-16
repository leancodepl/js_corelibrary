import { useCallback } from "react"
import { FrontendApi } from "../kratos"
import { AxiosError } from "axios"

export function useLogoutFlow({
    kratosClient,
    returnTo,
    onLoggedOut,
}: {
    kratosClient: FrontendApi
    returnTo?: string
    onLoggedOut?: () => void
}) {
    const logout = useCallback(async () => {
        const flow = await kratosClient.createBrowserLogoutFlow({ returnTo: "/" })

        kratosClient
            .updateLogoutFlow({ returnTo, token: flow.logout_token })
            .then(() => {
                onLoggedOut?.()
            })
            .catch((err: AxiosError) => {
                if (err.response?.status === 400) {
                    return
                }

                return Promise.reject(err)
            })
    }, [kratosClient, returnTo, onLoggedOut])

    return { logout }
}
