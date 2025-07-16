import { useLocation, useNavigate } from "@tanstack/react-router"
import { useCallback } from "react"

export const useRemoveFlowFromUrl = () => {
    const nav = useNavigate()
    const location = useLocation()

    return useCallback(() => {
        nav({
            to: location.pathname,
            search: ({ flow, ...search }) => search,
            replace: true,
        })
    }, [nav, location.pathname])
}
