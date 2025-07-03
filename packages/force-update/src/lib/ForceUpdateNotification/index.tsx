import { useEffect } from "react"
import { listenOnForceUpdate } from "../listenOnForceUpdate"

export type ForceUpdateNotificationProps = {
    appVersion: string
    isProduction: boolean
    message?: string
}

export function ForceUpdateNotification({
    appVersion,
    isProduction,
    message = "A new version of the app is available. Please reload the page to access latest features.",
}: ForceUpdateNotificationProps) {
    useEffect(() => {
        const cleanup = listenOnForceUpdate({
            appVersion,
            isProduction,
            onNewVersionAvailable: () => {
                if (window.confirm(message)) {
                    window.location.reload()
                }
            },
        })

        return cleanup
    }, [appVersion, isProduction, message])

    return null
}
