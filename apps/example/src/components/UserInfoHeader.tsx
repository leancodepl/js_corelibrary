import { useRunInTask } from "@leancodepl/utils"
import { sessionManager, useLogout } from "../services/kratos"
import { useCallback } from "react"

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
        <header style={{ padding: "1rem", backgroundColor: "#f0f0f0", textAlign: "center" }}>
            {isLoading && <p>Loading user information...</p>}
            {isLoggedIn === false && (
                <p>
                    <button>
                        <a href="/login">Login</a>
                    </button>
                    <button>
                        <a href="/registration">Register</a>
                    </button>
                </p>
            )}
            {isLoggedIn && (
                <p>
                    Welcome, <strong>{email || "user with ID: " + userId}</strong>
                    <button onClick={() => sessionManager.checkIfLoggedIn()}>check if logged in</button>
                    {isLoggingOut && <p>Logging out...</p>}
                    {!isLoggingOut && <button onClick={handleLogout}>Logout</button>}
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
