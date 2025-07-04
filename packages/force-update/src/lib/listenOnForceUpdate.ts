import { EMPTY, interval, of } from "rxjs"
import { ajax } from "rxjs/ajax"
import { catchError, first, map, mergeMap, switchMap } from "rxjs/operators"

const defaultVersionCheckIntervalPeriod = 3 * 60 * 1000

export type ForceUpdateParams = {
    versionCheckIntervalPeriod?: number
    onNewVersionAvailable: () => void
}

/**
 * Listens for force updates by periodically checking the `/version` endpoint.
 * When a new version is detected, it calls the provided callback function.
 *
 * @param params - Configuration object for force update listening
 * @param params.versionCheckIntervalPeriod - The interval period in milliseconds to check for version updates (default: 180000 - 3 minutes)
 * @param params.onNewVersionAvailable - Callback function that is called when a new version is available
 * @returns A cleanup function that unsubscribes from the version checking
 */
export const listenOnForceUpdate = ({
    versionCheckIntervalPeriod = defaultVersionCheckIntervalPeriod,
    onNewVersionAvailable,
}: ForceUpdateParams) => {
    const versionUrl = () =>
        ajax({
            url: "/version",
            responseType: "text",
        }).pipe(
            map(response => response.response),
            catchError(() => of(null)),
        )

    const subscription = versionUrl()
        .pipe(
            switchMap(initialVersion => {
                if (!initialVersion || typeof initialVersion !== "string") {
                    return EMPTY
                }

                return interval(versionCheckIntervalPeriod).pipe(
                    mergeMap(versionUrl),
                    first(
                        latestVersion =>
                            typeof latestVersion === "string" && latestVersion.trim() !== initialVersion.trim(),
                    ),
                )
            }),
        )
        .subscribe(() => {
            onNewVersionAvailable()

            subscription.unsubscribe()
        })

    return () => subscription.unsubscribe()
}
