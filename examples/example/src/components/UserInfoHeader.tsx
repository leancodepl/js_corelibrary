import { useCallback } from "react"
import { useRunInTask } from "@leancodepl/utils"
import { dataTestIds } from "../../../example-e2e-ids/src"
import { sessionManager, useLogout } from "../services/kratos"

export const UserInfoHeader = () => {
    const { isLoggedIn, isLoading } = sessionManager.useIsLoggedIn()
    const { userId } = sessionManager.useUserId()
    const { email } = sessionManager.useEmail()

    const { logout } = useLogout()

    const [isLoggingOut, runLoggingOutTask] = useRunInTask()

    const handleLogout = useCallback(() => {
        runLoggingOutTask(async () => {
            const response = await logout({ returnTo: "/login" })

            if (response.isSuccess) {
                alert("Logout success")
            } else {
                alert(response.error)
            }
        })
    }, [logout, runLoggingOutTask])

    return (
        <header
            data-testid={dataTestIds.userInfoHeader.header}
            style={{ padding: "1rem", backgroundColor: "#f0f0f0", textAlign: "center" }}>
            {isLoading && <p data-testid={dataTestIds.userInfoHeader.headerLoading}>Loading user information...</p>}
            {isLoggedIn === false && (
                <p data-testid={dataTestIds.userInfoHeader.headerNotLoggedIn}>
                    <button>
                        <a href="/login">Login</a>
                    </button>
                    <button>
                        <a href="/registration">Register</a>
                    </button>
                </p>
            )}
            {isLoggedIn && (
                <p data-testid={dataTestIds.userInfoHeader.headerLoggedIn}>
                    Welcome, <strong>{email || "user with ID: " + userId}</strong>
                    <button onClick={() => sessionManager.checkIfLoggedIn()}>check if logged in</button>
                    {isLoggingOut && <p>Logging out...</p>}
                    {!isLoggingOut && (
                        <button data-testid={dataTestIds.userInfoHeader.logoutButton} onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                    {!isLoggingOut && (
                        <button>
                            <a href="/settings">Settings</a>
                        </button>
                    )}
                </p>
            )}
        </header>
    )
}
