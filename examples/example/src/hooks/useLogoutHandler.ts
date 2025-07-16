import { useRunInTask } from "@leancodepl/utils"
import { useLogout } from "../services/kratos"
import { useCallback } from "react"

export const useLogoutHandler = () => {
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

    return {
        handleLogout,
        isLoggingOut: isRunning,
    }
}
