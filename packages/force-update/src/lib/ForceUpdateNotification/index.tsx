import { useEffect } from "react"
import { listenOnForceUpdate } from "../listenOnForceUpdate"

export type ForceUpdateNotificationProps = {
    message?: string
}

export function ForceUpdateNotification({
    message = "A new version of the app is available. Please reload the page to access latest features.",
}: ForceUpdateNotificationProps) {
    useEffect(() => {
        const cleanup = listenOnForceUpdate({
            onNewVersionAvailable: () => {
                if (window.confirm(message)) {
                    window.location.reload()
                }
            },
        })

        return cleanup
    }, [message])

    return null
}
