import { interval } from "rxjs"
import { ajax } from "rxjs/ajax"
import { first, map, mergeMap } from "rxjs/operators"

const defaultVersionCheckIntervalPeriod = 3 * 60 * 1000

export type ForceUpdateParams = {
    versionCheckIntervalPeriod?: number
    appVersion: string
    isProduction: boolean
    onNewVersionAvailable: () => void
}

export const listenOnForceUpdate = ({
    versionCheckIntervalPeriod = defaultVersionCheckIntervalPeriod,
    appVersion,
    isProduction,
    onNewVersionAvailable,
}: ForceUpdateParams) => {
    if (!isProduction) {
        return () => void 0
    }

    const subscription = interval(versionCheckIntervalPeriod)
        .pipe(
            mergeMap(() =>
                ajax({
                    url: "/version",
                    responseType: "text",
                }),
            ),
            map(response => response.response),
            first(latestVersion => typeof latestVersion === "string" && latestVersion.trim() !== appVersion.trim()),
        )
        .subscribe(() => {
            onNewVersionAvailable()

            subscription.unsubscribe()
        })

    return () => subscription.unsubscribe()
}
