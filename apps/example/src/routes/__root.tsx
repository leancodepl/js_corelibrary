import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { KratosProviders } from "../services/kratos"
import { UserInfoHeader } from "../components/UserInfoHeader"

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
