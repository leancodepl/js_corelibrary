import { useCallback } from "react"
import { useLocation, useNavigate } from "@tanstack/react-router"

export const useRemoveFlowFromUrl = () => {
    const nav = useNavigate()
    const location = useLocation()

    return useCallback(() => {
        nav({
            to: location.pathname,
            // eslint-disable-next-line unused-imports/no-unused-vars
            search: ({ flow, ...search }) => search,
            replace: true,
        })
    }, [nav, location.pathname])
}
