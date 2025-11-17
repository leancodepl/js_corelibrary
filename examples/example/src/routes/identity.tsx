import { dataTestIds } from "@example/e2e-ids"
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
    return <p data-testid={dataTestIds.identity.loading}>Loading identity page...</p>
  }

  if (!isLoggedIn) {
    return <p data-testid={dataTestIds.identity.notLoggedIn}>You are not logged in.</p>
  }

  return (
    <div data-testid={dataTestIds.identity.page}>
      {userId ? (
        <div>
          <h1>Identity Information</h1>
          <p>
            <strong>ID:</strong> <span data-testid={dataTestIds.identity.userId}>{userId}</span>
          </p>
          <p>
            <strong>Email:</strong> <span data-testid={dataTestIds.identity.email}>{email}</span>
          </p>
          <p>
            <strong>First Name:</strong> <span data-testid={dataTestIds.identity.firstName}>{firstName}</span>
          </p>
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  )
}
