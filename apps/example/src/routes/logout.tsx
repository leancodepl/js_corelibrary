import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { LogoutButton } from "../services/kratos"

const verificationSearchSchema = z.object({
    flow: z.string().optional(),
})

export const Route = createFileRoute("/logout")({
    component: RouteComponent,
    validateSearch: verificationSearchSchema,
})

function RouteComponent() {
    return (
        <div>
            <LogoutButton
                onLogoutSuccess={() => {
                    alert("Wylogowano")
                }}
                onLogoutError={() => {
                    alert("Błędy")
                }}>
                <button>Wyloguj</button>
            </LogoutButton>
        </div>
    )
}
