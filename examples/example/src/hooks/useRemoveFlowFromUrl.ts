import { useCallback } from "react"
import { useLocation, useNavigate } from "@tanstack/react-router"

export const useRemoveFlowFromUrl = () => {
  const nav = useNavigate()
  const location = useLocation()

  return useCallback(() => {
    nav({
      to: location.pathname,
      search: ({ flow: _, ...search }) => search,
      replace: true,
    })
  }, [nav, location.pathname])
}
