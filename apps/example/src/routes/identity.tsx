import { createFileRoute } from "@tanstack/react-router"
import { sessionManager } from "../services/kratos"
import { useObservable } from "react-use"

export const Route = createFileRoute("/identity")({
    component: RouteComponent,
})

function RouteComponent() {
    const userId = useObservable(sessionManager.userId$)
    const firstName = useObservable(sessionManager.firstName$)
    const email = useObservable(sessionManager.email$)

    const session = useObservable(sessionManager.session$)

    console.log("Session:", session)

    return (
        <div>
            {userId ? (
                <div>
                    <h1>Identity Information</h1>
                    <p>
                        <strong>ID:</strong> {userId}
                    </p>
                    <p>
                        <strong>Email:</strong> {email}
                    </p>
                    <p>
                        <strong>First Name:</strong> {firstName}
                    </p>
                </div>
            ) : (
                <p>No user information available.</p>
            )}
        </div>
    )
}
