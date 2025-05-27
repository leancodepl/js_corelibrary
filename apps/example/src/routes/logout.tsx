import { useRunInTask } from "@leancodepl/utils"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { useLogout } from "../services/kratos"
import { useCallback } from "react"

const verificationSearchSchema = z.object({
    flow: z.string().optional(),
})

export const Route = createFileRoute("/logout")({
    component: RouteComponent,
    validateSearch: verificationSearchSchema,
})

function RouteComponent() {
    const { logout } = useLogout()

    const [isRunning, runInTask] = useRunInTask()

    const handleLogout = useCallback(() => {
        runInTask(async () => {
            const response = await logout({ returnTo: "/redirect-after-logout" })

            if (response.isSuccess) {
                alert("Logout success")
            } else {
                alert(response.error)
            }
        })
    }, [logout, runInTask])

    return (
        <div>
            <button onClick={handleLogout}>{isRunning ? "Wylogowuję..." : "Wyloguj"}</button>
        </div>
    )
}
