import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { KratosContextProvider } from "@leancodepl/kratos"

const queryClient = new QueryClient()

export const Route = createRootRoute({
    component: () => (
        <>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                <KratosContextProvider baseUrl="https://auth.local.lncd.pl">
                    <Outlet />
                </KratosContextProvider>
            </QueryClientProvider>
            <TanStackRouterDevtools />
        </>
    ),
})
