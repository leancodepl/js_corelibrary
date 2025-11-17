import * as ReactDOM from "react-dom/client"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(<RouterProvider router={router} />)
