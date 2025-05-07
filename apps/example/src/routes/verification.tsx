import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

const verificationSearchSchema = z.object({
    flow: z.string().optional(),
})

export const Route = createFileRoute("/verification")({
    component: RouteComponent,
    validateSearch: verificationSearchSchema,
})

function RouteComponent() {
    return <div>Verification flow</div>
}
