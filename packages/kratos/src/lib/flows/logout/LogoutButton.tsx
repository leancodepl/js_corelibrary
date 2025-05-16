import { ComponentType, ReactNode } from "react"
import * as Slot from "@radix-ui/react-slot"
import { useKratosContext } from "../../hooks"
import { CommonButtonProps } from "../../utils"

type LogoutButtonProps = {
    children: ReactNode
    returnTo?: string
    onLogoutSuccess?: () => void
    onLogoutError?: () => void
}

// invalidować querki wszystkie?
export function LogoutButton({ children, returnTo, onLogoutSuccess, onLogoutError }: LogoutButtonProps) {
    const { kratosClient } = useKratosContext()

    const handleLogout = async () => {
        try {
            // Create a "logout flow" in Ory Identities
            const logoutFlow = await kratosClient.createBrowserLogoutFlow(
                { returnTo },
                async ({ init: { headers } }) => ({
                    headers: { ...headers, Accept: "application/json" },
                    credentials: "include",
                }),
            )

            // Use the received token to "update" the flow and thus perform the logout
            await kratosClient.updateLogoutFlow(
                {
                    token: logoutFlow.logout_token,
                },
                {
                    credentials: "include",
                    headers: { Accept: "application/json", "Content-Type": "application/json" },
                },
            )

            // Logout was succesful
            onLogoutSuccess?.()
        } catch (error) {
            console.error("Logout error", error)
            onLogoutError?.()
            // The user could not be logged out
            // This typically happens if the token does not match the session,
            // or is otherwise malformed or missing
        }
    }

    const Comp: ComponentType<CommonButtonProps> = Slot.Root

    return (
        <Comp type="button" onClick={handleLogout}>
            {children}
        </Comp>
    )
}
