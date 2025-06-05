import { useRunInTask } from "@leancodepl/utils"
import { useIsLoggedIn, useLogout, useProfileInfo, useUserId } from "../services/kratos"
import { useCallback } from "react"

export const UserInfoHeader = () => {
    const isLoggedIn = useIsLoggedIn()
    const userId = useUserId()
    const { email } = useProfileInfo()

    const { logout } = useLogout()

    const [isRunning, runInTask] = useRunInTask()

    const handleLogout = useCallback(() => {
        runInTask(async () => {
            const response = await logout({ returnTo: "/login" })

            if (response.isSuccess) {
                alert("Logout success")
            } else {
                alert(response.error)
            }
        })
    }, [logout, runInTask])

    return (
        <header style={{ padding: "1rem", backgroundColor: "#f0f0f0", textAlign: "center" }}>
            {isLoggedIn === undefined && <p>Loading user information...</p>}
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
            {/* {isLoggedIn && !email && (
                <p>
                    Welcome, user with ID: <strong>{userId}</strong>
                </p>
            )}
            {isLoggedIn && email && (
                <p>
                    Welcome, <strong>{email}</strong> {isRunning && <p>Wylogowuję...</p>}
                    {isLoggedIn && !isRunning && <button onClick={handleLogout}>Wyloguj</button>}
                </p>
            )} */}
            {isLoggedIn && (
                <p>
                    Welcome, <strong>{email || "user with ID: " + userId}</strong>
                    {isRunning && <p>Logging out...</p>}
                    {!isRunning && <button onClick={handleLogout}>Logout</button>}
                    {!isRunning && (
                        <button>
                            <a href="/settings">Settings</a>
                        </button>
                    )}
                </p>
            )}
        </header>
    )
}
