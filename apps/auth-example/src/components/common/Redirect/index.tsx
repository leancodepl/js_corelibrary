import { useEffect } from "react"
import { useNavigate } from "react-router"

export type RedirectProps = {
    path: string
    replace?: boolean
    isExternal?: boolean
}

export default function Redirect({ path, isExternal, replace }: RedirectProps) {
    const nav = useNavigate()

    useEffect(() => {
        if (isExternal) {
            window.location.href = path
        } else {
            nav(path, { replace })
        }
    }, [isExternal, nav, path, replace])

    return null
}
