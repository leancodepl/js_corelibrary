import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { useLogout } from "../services/kratos"
import { useState } from "react"

const verificationSearchSchema = z.object({
    flow: z.string().optional(),
})

export const Route = createFileRoute("/logout")({
    component: RouteComponent,
    validateSearch: verificationSearchSchema,
})

function RouteComponent() {
    const { logout } = useLogout({ returnTo: "/redirect-after-logout" })

    const [loggingOut, setLoggingOut] = useState(false)
    const handleLogout = async () => {
        setLoggingOut(true)
        const response = await logout()
        setLoggingOut(false)

        if (response.isSuccess) {
            alert("Logout success")
        } else {
            alert(response.error)
        }
    }

    return (
        <div>
            <button onClick={handleLogout}>{loggingOut ? "Wylogowuję..." : "Wyloguj"}</button>
        </div>
    )
}
