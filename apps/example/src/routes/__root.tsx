import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { KratosProviders, sessionManager, useLogout } from "../services/kratos"
import { useObservable } from "react-use"
import { useRunInTask } from "@leancodepl/utils"
import { useCallback } from "react"

const queryClient = new QueryClient()

export const Route = createRootRoute({
    component: () => (
        <>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                <KratosProviders>
                    <>
                        <UserInfoHeader />
                        <Outlet />
                    </>
                </KratosProviders>
            </QueryClientProvider>
            <TanStackRouterDevtools />
        </>
    ),
})

const UserInfoHeader = () => {
    const email = useObservable(sessionManager.email$)
    const userId = useObservable(sessionManager.userId$)
    const { logout } = useLogout()

    const [isRunning, runInTask] = useRunInTask()

    const handleLogout = useCallback(() => {
        runInTask(async () => {
            const response = await logout({})
            // const response = await logout({ returnTo: "/login" })

            if (response.isSuccess) {
                alert("Logout success")
            } else {
                alert(response.error)
            }
        })
    }, [logout, runInTask])

    if (!userId) {
        return null
    }

    return (
        <header style={{ padding: "1rem", backgroundColor: "#f0f0f0", textAlign: "center" }}>
            <strong>Welcome, {email}</strong>{" "}
            <button onClick={handleLogout}>{isRunning ? "Wylogowuję..." : "Wyloguj"}</button>
        </header>
    )
}
