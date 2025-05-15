import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/registration")({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/"!</div>
}
