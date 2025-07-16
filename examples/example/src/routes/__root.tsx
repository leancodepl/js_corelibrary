import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { QueryClientProvider } from "@tanstack/react-query"
import { KratosProviders } from "../services/kratos"
import { queryClient } from "../services/query"
import { UserInfoHeader } from "../components/UserInfoHeader"
import { environment } from "../environments/environment"

export const Route = createRootRoute({
    component: () => (
        <>
            <QueryClientProvider client={queryClient}>
                {environment.showDevTools && <ReactQueryDevtools initialIsOpen={false} />}
                <KratosProviders>
                    <>
                        <UserInfoHeader />
                        <Outlet />
                    </>
                </KratosProviders>
            </QueryClientProvider>
            {environment.showDevTools && <TanStackRouterDevtools />}
        </>
    ),
})
