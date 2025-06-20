import { createFileRoute } from "@tanstack/react-router"
import { sessionManager } from "../services/kratos"

export const Route = createFileRoute("/identity")({
    component: RouteComponent,
})

function RouteComponent() {
    const { isLoggedIn, isLoading } = sessionManager.useIsLoggedIn()
    const { userId } = sessionManager.useUserId()
    const { email } = sessionManager.useEmail()
    const { firstName } = sessionManager.useFirstName()

    if (isLoading) {
        return <p>Loading identity page...</p>
    }

    if (!isLoggedIn) {
        return <p>You are not logged in.</p>
    }

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
